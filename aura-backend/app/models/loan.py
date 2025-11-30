"""
Loan-related database models.
"""

import enum
from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import Column, String, Float, Integer, Enum, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class LoanStatus(str, enum.Enum):
    PENDING = "pending"
    PROOF_GENERATED = "proof_generated"
    RISK_ASSESSED = "risk_assessed"
    APPROVED = "approved"
    REJECTED = "rejected"
    DISBURSED = "disbursed"
    COMPLETED = "completed"
    DEFAULTED = "defaulted"


class RiskLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class LoanApplication(Base):
    """Loan application model storing encrypted application data."""
    
    __tablename__ = "loan_applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    wallet_address = Column(String(128), nullable=False, index=True)
    
    # Encrypted data reference
    ipfs_cid = Column(String(64), nullable=False)
    data_hash = Column(String(64), nullable=False)
    encryption_nonce = Column(String(32), nullable=False)
    
    # Loan parameters (non-sensitive)
    requested_amount = Column(Float, nullable=False)
    tenure_months = Column(Integer, nullable=False)
    purpose = Column(String(64), nullable=True)
    
    # Status tracking
    status = Column(Enum(LoanStatus), default=LoanStatus.PENDING, nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    proof = relationship("ZKProof", back_populates="application", uselist=False)
    decision = relationship("LoanDecision", back_populates="application", uselist=False)
    transaction = relationship("LoanTransaction", back_populates="application", uselist=False)
    
    def __repr__(self):
        return f"<LoanApplication {self.id} - {self.status}>"


class LoanDecision(Base):
    """AI agent loan decision record."""
    
    __tablename__ = "loan_decisions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("loan_applications.id"), nullable=False)
    
    # Aura Agent Assessment
    risk_score = Column(Float, nullable=False)
    risk_level = Column(Enum(RiskLevel), nullable=False)
    aura_recommendation = Column(String(32), nullable=False)  # approve, reduce_amount, reject
    aura_max_amount = Column(Float, nullable=True)
    aura_confidence = Column(Float, nullable=False)
    aura_reasoning = Column(Text, nullable=True)
    
    # Lender Agent Decision
    is_approved = Column(Boolean, nullable=False)
    approved_amount = Column(Float, nullable=True)
    interest_rate = Column(Float, nullable=True)
    adjusted_tenure = Column(Integer, nullable=True)
    monthly_payment = Column(Float, nullable=True)
    lender_explanation = Column(Text, nullable=True)
    
    # Model metadata
    aura_model_version = Column(String(32), nullable=False)
    lender_model_version = Column(String(32), nullable=False)
    
    # Timestamps
    decided_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    application = relationship("LoanApplication", back_populates="decision")
    
    def __repr__(self):
        return f"<LoanDecision {self.id} - approved={self.is_approved}>"


class LoanTransaction(Base):
    """Cardano blockchain transaction record."""
    
    __tablename__ = "loan_transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("loan_applications.id"), nullable=False)
    
    # Transaction details
    tx_hash = Column(String(64), nullable=False, unique=True, index=True)
    from_address = Column(String(128), nullable=False)
    to_address = Column(String(128), nullable=False)
    amount_ada = Column(Float, nullable=False)
    amount_lovelace = Column(Integer, nullable=False)
    
    # Blockchain metadata
    network = Column(String(16), nullable=False)
    block_height = Column(Integer, nullable=True)
    slot_number = Column(Integer, nullable=True)
    epoch = Column(Integer, nullable=True)
    fees_ada = Column(Float, nullable=True)
    
    # Plutus script data
    plutus_script_hash = Column(String(64), nullable=True)
    datum_hash = Column(String(64), nullable=True)
    redeemer_data = Column(JSON, nullable=True)
    
    # Confirmation tracking
    confirmations = Column(Integer, default=0)
    is_confirmed = Column(Boolean, default=False)
    confirmed_at = Column(DateTime, nullable=True)
    
    # Timestamps
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    application = relationship("LoanApplication", back_populates="transaction")
    
    def __repr__(self):
        return f"<LoanTransaction {self.tx_hash[:16]}...>"
