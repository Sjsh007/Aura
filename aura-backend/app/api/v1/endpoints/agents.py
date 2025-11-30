"""
AI Agent endpoints.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.services.agents import AuraAgent, LenderAgent

router = APIRouter()


class AuraAssessmentRequest(BaseModel):
    proof_valid: bool
    income_sufficient: bool
    dti_acceptable: bool
    no_compliance_flags: bool
    requested_amount: float
    tenure_months: int
    monthly_income: float
    existing_debt: float


class LenderDecisionRequest(BaseModel):
    aura_assessment: dict
    requested_amount: float
    requested_tenure: int


@router.post("/aura/assess")
async def aura_risk_assessment(request: AuraAssessmentRequest):
    """
    Perform Aura risk assessment based on ZK proof results.
    """
    try:
        result = await AuraAgent.assess_risk(
            proof_valid=request.proof_valid,
            income_sufficient=request.income_sufficient,
            dti_acceptable=request.dti_acceptable,
            no_compliance_flags=request.no_compliance_flags,
            requested_amount=request.requested_amount,
            tenure_months=request.tenure_months,
            monthly_income=request.monthly_income,
            existing_debt=request.existing_debt,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/lender/decide")
async def lender_decision(request: LenderDecisionRequest):
    """
    Get final lending decision from Lender agent.
    """
    try:
        result = await LenderAgent.make_decision(
            aura_assessment=request.aura_assessment,
            requested_amount=request.requested_amount,
            requested_tenure=request.requested_tenure,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
