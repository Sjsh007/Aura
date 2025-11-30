"""
Settlement/disbursement Pydantic schemas.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class DisbursementRequest(BaseModel):
    """Request for loan disbursement."""
    
    application_id: UUID
    decision_id: UUID
    wallet_address: str = Field(..., min_length=50)
    approved_amount: float = Field(..., gt=0)
    proof_id: UUID


class TransactionMetadata(BaseModel):
    """Blockchain transaction metadata."""
    
    block_height: int
    slot_number: int
    epoch: int
    fees_ada: float
    confirmations: int
    plutus_script_hash: str
    datum_hash: str


class DisbursementResponse(BaseModel):
    """Disbursement transaction response."""
    
    transaction_id: UUID
    tx_hash: str = Field(..., min_length=64)
    from_address: str
    to_address: str
    amount_ada: float
    amount_lovelace: int
    network: str
    metadata: TransactionMetadata
    status: str
    submitted_at: datetime


class TransactionVerifyResponse(BaseModel):
    """Transaction verification status."""
    
    tx_hash: str
    is_confirmed: bool
    confirmations: int
    block_height: Optional[int]
    slot_number: Optional[int]
    status: str
    verified_at: datetime
