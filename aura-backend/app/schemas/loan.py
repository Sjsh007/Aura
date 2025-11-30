"""
Loan-related Pydantic schemas.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class LoanApplicationCreate(BaseModel):
    """Schema for creating a new loan application."""
    
    wallet_address: str = Field(..., min_length=50, max_length=128)
    ipfs_cid: str = Field(..., min_length=46, max_length=64)
    data_hash: str = Field(..., min_length=64, max_length=64)
    encryption_nonce: str = Field(..., min_length=24, max_length=32)
    
    requested_amount: float = Field(..., gt=0, le=1_000_000)
    tenure_months: int = Field(..., ge=1, le=60)
    purpose: Optional[str] = Field(None, max_length=64)
    
    # Encrypted financial data hash
    monthly_income_hash: str
    existing_debt_hash: str
    
    @field_validator("wallet_address")
    @classmethod
    def validate_wallet_address(cls, v: str) -> str:
        if not (v.startswith("addr_test") or v.startswith("addr1")):
            raise ValueError("Invalid Cardano wallet address format")
        return v


class LoanApplicationResponse(BaseModel):
    """Schema for loan application response."""
    
    id: UUID
    wallet_address: str
    status: str
    requested_amount: float
    tenure_months: int
    ipfs_cid: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class AuraAssessmentResponse(BaseModel):
    """Schema for Aura agent risk assessment."""
    
    risk_score: float = Field(..., ge=0, le=100)
    risk_level: str
    recommendation: str
    max_approved_amount: Optional[float]
    confidence: float = Field(..., ge=0, le=1)
    reasoning: str
    model_version: str
    processing_time_ms: int


class LenderDecisionResponse(BaseModel):
    """Schema for Lender agent decision."""
    
    is_approved: bool
    approved_amount: Optional[float]
    interest_rate: Optional[float]
    adjusted_tenure: Optional[int]
    monthly_payment: Optional[float]
    explanation: str
    model_version: str
    processing_time_ms: int


class LoanDecisionResponse(BaseModel):
    """Complete loan decision response."""
    
    application_id: UUID
    aura_assessment: AuraAssessmentResponse
    lender_decision: LenderDecisionResponse
    decided_at: datetime
    
    class Config:
        from_attributes = True
