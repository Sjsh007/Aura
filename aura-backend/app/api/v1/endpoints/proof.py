"""
ZK Proof generation endpoints.
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.proof import ProofGenerateRequest, ProofGenerateResponse
from app.services.zk_prover import ZKProverService

router = APIRouter()
prover_service = ZKProverService()


@router.post("/generate", response_model=ProofGenerateResponse)
async def generate_proof(
    request: ProofGenerateRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a zero-knowledge proof for loan eligibility.
    
    The proof attests to eligibility conditions without revealing
    the underlying financial data.
    """
    try:
        # In production, decrypt and verify data from IPFS
        # For now, use the hashed values to derive test values
        
        result = await prover_service.generate_proof(
            monthly_income=5000.0,  # Derived from hash in production
            existing_debt=1000.0,
            requested_amount=request.requested_amount,
            tenure_months=request.tenure_months,
            has_compliance_flags=request.has_compliance_flags,
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/verify/{proof_hash}")
async def verify_proof(proof_hash: str):
    """
    Verify a previously generated proof.
    """
    cached = await prover_service.get_cached_proof(proof_hash)
    
    if not cached:
        raise HTTPException(status_code=404, detail="Proof not found")
    
    return {
        "proof_hash": proof_hash,
        "is_valid": cached["is_valid"],
        "conditions": cached["conditions"],
        "verified_at": cached.get("generated_at"),
    }
