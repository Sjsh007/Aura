"""
Tests for AI agents.
"""

import pytest
from app.services.agents import AuraAgent, LenderAgent


@pytest.mark.asyncio
async def test_aura_low_risk_assessment():
    """Test Aura assessment for low-risk borrower."""
    result = await AuraAgent.assess_risk(
        proof_valid=True,
        income_sufficient=True,
        dti_acceptable=True,
        no_compliance_flags=True,
        requested_amount=2000.0,
        tenure_months=12,
        monthly_income=5000.0,
        existing_debt=1000.0,
    )
    
    assert result["risk_level"] == "low"
    assert result["recommendation"] == "approve"
    assert result["risk_score"] < 25


@pytest.mark.asyncio
async def test_aura_high_risk_assessment():
    """Test Aura assessment for high-risk borrower."""
    result = await AuraAgent.assess_risk(
        proof_valid=True,
        income_sufficient=False,
        dti_acceptable=False,
        no_compliance_flags=True,
        requested_amount=5000.0,
        tenure_months=12,
        monthly_income=2000.0,
        existing_debt=5000.0,
    )
    
    assert result["risk_level"] in ["high", "critical"]
    assert result["recommendation"] in ["reduce_amount", "reject"]


@pytest.mark.asyncio
async def test_lender_approval_decision():
    """Test Lender approval decision."""
    aura_assessment = {
        "risk_score": 15.0,
        "risk_level": "low",
        "recommendation": "approve",
        "max_approved_amount": 2000.0,
        "confidence": 0.95,
        "reasoning": "Low risk borrower with strong financials.",
    }
    
    result = await LenderAgent.make_decision(
        aura_assessment=aura_assessment,
        requested_amount=2000.0,
        requested_tenure=12,
    )
    
    assert result["is_approved"] is True
    assert result["approved_amount"] == 2000.0
    assert result["interest_rate"] is not None
    assert result["monthly_payment"] is not None


@pytest.mark.asyncio
async def test_lender_rejection_decision():
    """Test Lender rejection decision."""
    aura_assessment = {
        "risk_score": 85.0,
        "risk_level": "critical",
        "recommendation": "reject",
        "max_approved_amount": None,
        "confidence": 0.98,
        "reasoning": "High risk borrower, exceeds lending thresholds.",
    }
    
    result = await LenderAgent.make_decision(
        aura_assessment=aura_assessment,
        requested_amount=5000.0,
        requested_tenure=12,
    )
    
    assert result["is_approved"] is False
    assert result["approved_amount"] is None
