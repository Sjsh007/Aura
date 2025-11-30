"""
Zero-Knowledge Proof models.
"""

from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Boolean, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class ZKProof(Base):
    """Zero-knowledge proof record."""
    
    __tablename__ = "zk_proofs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("loan_applications.id"), nullable=False)
    
    # Proof data
    proof_hash = Column(String(64), nullable=False, unique=True, index=True)
    proof_data = Column(Text, nullable=False)  # Serialized proof (pi_a, pi_b, pi_c)
    public_signals = Column(JSON, nullable=False)
    
    # Validity
    is_valid = Column(Boolean, nullable=False)
    
    # Eligibility conditions
    income_sufficient = Column(Boolean, nullable=False)
    dti_acceptable = Column(Boolean, nullable=False)
    no_compliance_flags = Column(Boolean, nullable=False)
    
    # Circuit metadata
    circuit_id = Column(String(64), nullable=False)
    circuit_version = Column(String(16), nullable=False)
    proving_scheme = Column(String(16), nullable=False, default="groth16")
    curve = Column(String(16), nullable=False, default="bn254")
    
    # Performance metrics
    num_constraints = Column(Integer, nullable=False)
    num_public_inputs = Column(Integer, nullable=False)
    num_private_inputs = Column(Integer, nullable=False)
    proving_time_ms = Column(Integer, nullable=False)
    proof_size_bytes = Column(Integer, nullable=False)
    
    # Timestamps
    generated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    application = relationship("LoanApplication", back_populates="proof")
    verifications = relationship("ProofVerification", back_populates="proof")
    
    def __repr__(self):
        return f"<ZKProof {self.proof_hash[:16]}... valid={self.is_valid}>"


class ProofVerification(Base):
    """Record of proof verification attempts."""
    
    __tablename__ = "proof_verifications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    proof_id = Column(UUID(as_uuid=True), ForeignKey("zk_proofs.id"), nullable=False)
    
    # Verification result
    is_verified = Column(Boolean, nullable=False)
    verification_time_ms = Column(Integer, nullable=False)
    
    # Verifier info
    verifier_address = Column(String(128), nullable=True)
    verifier_type = Column(String(32), nullable=False)  # "backend", "contract", "external"
    
    # Timestamp
    verified_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    proof = relationship("ZKProof", back_populates="verifications")
    
    def __repr__(self):
        return f"<ProofVerification {self.id} - verified={self.is_verified}>"
