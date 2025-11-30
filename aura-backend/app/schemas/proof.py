"""
ZK Proof Pydantic schemas.
"""

from datetime import datetime
from typing import Dict, Any, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ProofGenerateRequest(BaseModel):
    """Request schema for ZK proof generation."""
    
    application_id: UUID
    ipfs_cid: str = Field(..., min_length=46)
    
    # Encrypted inputs (hashes only, actual data stays private)
    monthly_income_hash: str
    existing_debt_hash: str
    requested_amount: float
    tenure_months: int
    
    # Compliance check inputs
    has_compliance_flags: bool = False


class ProofCircuitMetadata(BaseModel):
    """ZK circuit metadata."""
    
    circuit_id: str
    circuit_version: str
    proving_scheme: str = "groth16"
    curve: str = "bn254"
    num_constraints: int
    num_public_inputs: int
    num_private_inputs: int


class ProofConditions(BaseModel):
    """Proof eligibility conditions."""
    
    income_sufficient: bool
    dti_acceptable: bool
    no_compliance_flags: bool


class ProofGenerateResponse(BaseModel):
    """Response schema for ZK proof generation."""
    
    proof_id: UUID
    proof_hash: str = Field(..., min_length=64)
    is_valid: bool
    
    conditions: ProofConditions
    circuit_metadata: ProofCircuitMetadata
    
    # Performance
    proving_time_ms: int
    proof_size_bytes: int
    verification_time_ms: int
    
    # Proof data (for on-chain verification)
    proof_data: Dict[str, Any]
    public_signals: list
    
    generated_at: datetime


class ProofVerifyRequest(BaseModel):
    """Request to verify a proof."""
    
    proof_hash: str = Field(..., min_length=64)
    public_signals: list


class ProofVerifyResponse(BaseModel):
    """Proof verification response."""
    
    is_verified: bool
    verification_time_ms: int
    verifier_type: str
    verified_at: datetime
