"""
Settlement and disbursement endpoints.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.schemas.settlement import DisbursementRequest, DisbursementResponse
from app.services.cardano import CardanoService

router = APIRouter()
cardano_service = CardanoService()


@router.post("/disburse")
async def disburse_funds(request: DisbursementRequest):
    """
    Disburse approved loan funds to borrower's wallet.
    """
    try:
        amount_lovelace = int(request.approved_amount * 1_000_000)
        
        result = await cardano_service.build_and_submit_transaction(
            recipient_address=request.wallet_address,
            amount_lovelace=amount_lovelace,
            metadata={
                "application_id": str(request.application_id),
                "decision_id": str(request.decision_id),
                "proof_id": str(request.proof_id),
            }
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/verify/{tx_hash}")
async def verify_transaction(tx_hash: str):
    """
    Verify transaction status on Cardano blockchain.
    """
    try:
        result = await cardano_service.verify_transaction(tx_hash)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
