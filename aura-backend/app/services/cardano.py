"""
Cardano blockchain integration service.
"""

import hashlib
import time
from typing import Dict, Any, Optional
from uuid import uuid4

import structlog
from pycardano import (
    TransactionBuilder,
    TransactionOutput,
    PaymentSigningKey,
    PaymentVerificationKey,
    Address,
    Network,
    Value,
)
from blockfrost import Api, ApiError

from app.core.config import settings

logger = structlog.get_logger(__name__)


class CardanoService:
    """
    Cardano blockchain service for transaction management.
    
    Handles wallet operations, transaction building, signing,
    and submission to the Cardano network via Blockfrost.
    """
    
    def __init__(self):
        self.network = self._get_network()
        self.blockfrost = self._init_blockfrost()
        self.lender_signing_key = self._load_lender_key()
    
    def _get_network(self) -> Network:
        """Get Cardano network from config."""
        network_map = {
            "mainnet": Network.MAINNET,
            "preprod": Network.TESTNET,
            "preview": Network.TESTNET,
            "testnet": Network.TESTNET,
        }
        return network_map.get(settings.CARDANO_NETWORK, Network.TESTNET)
    
    def _init_blockfrost(self) -> Optional[Api]:
        """Initialize Blockfrost API client."""
        if not settings.BLOCKFROST_PROJECT_ID:
            logger.warning("Blockfrost project ID not configured")
            return None
        
        project_id = settings.BLOCKFROST_PROJECT_ID
        
        # Determine API URL based on network
        if settings.CARDANO_NETWORK == "mainnet":
            base_url = "https://cardano-mainnet.blockfrost.io/api"
        elif settings.CARDANO_NETWORK == "preprod":
            base_url = "https://cardano-preprod.blockfrost.io/api"
        else:
            base_url = "https://cardano-preview.blockfrost.io/api"
        
        return Api(project_id=project_id, base_url=base_url)
    
    def _load_lender_key(self) -> Optional[PaymentSigningKey]:
        """Load lender's signing key for transaction signing."""
        if not settings.LENDER_PRIVATE_KEY:
            logger.warning("Lender private key not configured")
            return None
        
        try:
            return PaymentSigningKey.from_primitive(
                bytes.fromhex(settings.LENDER_PRIVATE_KEY)
            )
        except Exception as e:
            logger.error("Failed to load lender key", error=str(e))
            return None
    
    async def build_and_submit_transaction(
        self,
        recipient_address: str,
        amount_lovelace: int,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Build, sign, and submit a transaction to the Cardano network.
        
        Returns transaction details including hash and status.
        """
        start_time = time.time()
        
        try:
            # Parse recipient address
            to_address = Address.from_primitive(recipient_address)
            
            # Get lender address and UTXOs
            lender_vkey = PaymentVerificationKey.from_signing_key(self.lender_signing_key)
            lender_address = Address(lender_vkey.hash(), network=self.network)
            
            # Query UTXOs from Blockfrost
            utxos = await self._get_utxos(str(lender_address))
            
            if not utxos:
                raise ValueError("Insufficient funds in lender wallet")
            
            # Build transaction
            builder = TransactionBuilder(context=self.blockfrost)
            
            # Add inputs
            for utxo in utxos:
                builder.add_input(utxo)
            
            # Add output
            builder.add_output(
                TransactionOutput(to_address, Value(amount_lovelace))
            )
            
            # Build and sign
            signed_tx = builder.build_and_sign(
                signing_keys=[self.lender_signing_key],
                change_address=lender_address
            )
            
            # Submit to network
            tx_hash = self.blockfrost.transaction_submit(signed_tx.to_cbor())
            
            # Get transaction details
            tx_details = await self._get_transaction_details(tx_hash)
            
            processing_time = int((time.time() - start_time) * 1000)
            
            logger.info(
                "Transaction submitted",
                tx_hash=tx_hash,
                amount_ada=amount_lovelace / 1_000_000,
                processing_time_ms=processing_time
            )
            
            return {
                "tx_hash": tx_hash,
                "status": "submitted",
                "amount_lovelace": amount_lovelace,
                "amount_ada": amount_lovelace / 1_000_000,
                "from_address": str(lender_address),
                "to_address": recipient_address,
                "network": settings.CARDANO_NETWORK,
                "details": tx_details,
                "processing_time_ms": processing_time,
            }
            
        except ApiError as e:
            logger.error("Blockfrost API error", error=str(e))
            raise
        except Exception as e:
            logger.error("Transaction failed", error=str(e))
            raise
    
    async def _get_utxos(self, address: str) -> list:
        """Get UTXOs for an address from Blockfrost."""
        try:
            utxos = self.blockfrost.address_utxos(address)
            return utxos
        except ApiError as e:
            if e.status_code == 404:
                return []
            raise
    
    async def _get_transaction_details(self, tx_hash: str) -> Dict[str, Any]:
        """Get transaction details from Blockfrost."""
        try:
            tx = self.blockfrost.transaction(tx_hash)
            return {
                "block_height": tx.block_height,
                "slot": tx.slot,
                "index": tx.index,
                "fees": int(tx.fees) / 1_000_000,
            }
        except ApiError:
            return {}
    
    async def verify_transaction(self, tx_hash: str) -> Dict[str, Any]:
        """
        Verify a transaction on the Cardano blockchain.
        
        Returns confirmation status and block details.
        """
        try:
            tx = self.blockfrost.transaction(tx_hash)
            
            # Get current tip for confirmation count
            tip = self.blockfrost.blocks_latest()
            confirmations = tip.height - tx.block_height if tx.block_height else 0
            
            return {
                "tx_hash": tx_hash,
                "is_confirmed": confirmations >= 1,
                "confirmations": confirmations,
                "block_height": tx.block_height,
                "slot_number": tx.slot,
                "epoch": tx.block_height // 432000 if tx.block_height else None,  # Approximate
                "fees_ada": int(tx.fees) / 1_000_000,
                "status": "confirmed" if confirmations >= 1 else "pending",
            }
            
        except ApiError as e:
            if e.status_code == 404:
                return {
                    "tx_hash": tx_hash,
                    "is_confirmed": False,
                    "confirmations": 0,
                    "status": "not_found",
                }
            raise
    
    def generate_plutus_script_hash(self, script_data: Dict[str, Any]) -> str:
        """Generate a Plutus script hash for the loan contract."""
        script_bytes = str(script_data).encode()
        return hashlib.blake2b(script_bytes, digest_size=28).hexdigest()
    
    def generate_datum_hash(self, datum: Dict[str, Any]) -> str:
        """Generate datum hash for script transaction."""
        datum_bytes = str(datum).encode()
        return hashlib.blake2b(datum_bytes, digest_size=32).hexdigest()
