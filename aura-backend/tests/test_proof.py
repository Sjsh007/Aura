"""
Tests for ZK proof generation.
"""

import pytest
from app.services.zk_prover import ZKProverService


@pytest.mark.asyncio
async def test_generate_valid_proof():
    """Test generating a valid proof for eligible borrower."""
    prover = ZKProverService()
    
    result = await prover.generate_proof(
        monthly_income=5000.0,
        existing_debt=1000.0,
        requested_amount=2000.0,
        tenure_months=12,
        has_compliance_flags=False,
    )
    
    assert result["is_valid"] is True
    assert result["conditions"]["income_sufficient"] is True
    assert result["conditions"]["dti_acceptable"] is True
    assert result["conditions"]["no_compliance_flags"] is True
    assert len(result["proof_hash"]) == 64


@pytest.mark.asyncio
async def test_generate_invalid_proof_low_income():
    """Test proof generation for borrower with insufficient income."""
    prover = ZKProverService()
    
    result = await prover.generate_proof(
        monthly_income=500.0,
        existing_debt=1000.0,
        requested_amount=5000.0,
        tenure_months=12,
        has_compliance_flags=False,
    )
    
    assert result["is_valid"] is False
    assert result["conditions"]["income_sufficient"] is False


@pytest.mark.asyncio
async def test_generate_invalid_proof_high_dti():
    """Test proof generation for borrower with high DTI."""
    prover = ZKProverService()
    
    result = await prover.generate_proof(
        monthly_income=3000.0,
        existing_debt=10000.0,
        requested_amount=5000.0,
        tenure_months=12,
        has_compliance_flags=False,
    )
    
    assert result["is_valid"] is False
    assert result["conditions"]["dti_acceptable"] is False


@pytest.mark.asyncio
async def test_generate_invalid_proof_compliance_flags():
    """Test proof generation for borrower with compliance flags."""
    prover = ZKProverService()
    
    result = await prover.generate_proof(
        monthly_income=5000.0,
        existing_debt=1000.0,
        requested_amount=2000.0,
        tenure_months=12,
        has_compliance_flags=True,
    )
    
    assert result["is_valid"] is False
    assert result["conditions"]["no_compliance_flags"] is False
