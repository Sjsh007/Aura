"""
AI Agent services for risk assessment and loan decisions.
"""

import time
from typing import Dict, Any, Optional
from uuid import uuid4

import structlog
import numpy as np

from app.core.config import settings

logger = structlog.get_logger(__name__)


class AuraAgent:
    """
    Aura Risk Assessment Agent.
    
    Analyzes ZK proof results and financial indicators to produce
    a comprehensive risk score and lending recommendation.
    """
    
    MODEL_VERSION = "aura-risk-v2.3.1"
    _model = None
    
    @classmethod
    async def load_model(cls):
        """Load the risk assessment ML model."""
        try:
            # In production, load actual model
            # cls._model = joblib.load(settings.AURA_MODEL_PATH)
            cls._model = "loaded"  # Placeholder
            logger.info("Aura model loaded", version=cls.MODEL_VERSION)
        except Exception as e:
            logger.warning("Could not load Aura model, using rule-based fallback", error=str(e))
            cls._model = None
    
    @classmethod
    async def assess_risk(
        cls,
        proof_valid: bool,
        income_sufficient: bool,
        dti_acceptable: bool,
        no_compliance_flags: bool,
        requested_amount: float,
        tenure_months: int,
        monthly_income: float,
        existing_debt: float,
    ) -> Dict[str, Any]:
        """
        Perform comprehensive risk assessment.
        
        Returns risk score, level, recommendation, and reasoning.
        """
        start_time = time.time()
        
        # Calculate base risk factors
        monthly_repayment = requested_amount / tenure_months
        income_ratio = monthly_repayment / monthly_income if monthly_income > 0 else 1.0
        dti_ratio = (existing_debt + requested_amount) / (monthly_income * 12) if monthly_income > 0 else 1.0
        
        # Rule-based risk scoring (in production, use ML model)
        risk_score = cls._calculate_risk_score(
            proof_valid,
            income_sufficient,
            dti_acceptable,
            no_compliance_flags,
            income_ratio,
            dti_ratio,
            tenure_months
        )
        
        # Determine risk level
        if risk_score < 25:
            risk_level = "low"
        elif risk_score < 50:
            risk_level = "medium"
        elif risk_score < 75:
            risk_level = "high"
        else:
            risk_level = "critical"
        
        # Generate recommendation
        recommendation, max_amount = cls._generate_recommendation(
            risk_score,
            risk_level,
            proof_valid,
            requested_amount,
            monthly_income
        )
        
        # Calculate confidence
        confidence = cls._calculate_confidence(
            proof_valid,
            income_sufficient,
            dti_acceptable
        )
        
        # Generate reasoning
        reasoning = cls._generate_reasoning(
            risk_score,
            risk_level,
            recommendation,
            income_ratio,
            dti_ratio,
            no_compliance_flags
        )
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return {
            "assessment_id": str(uuid4()),
            "risk_score": round(risk_score, 2),
            "risk_level": risk_level,
            "recommendation": recommendation,
            "max_approved_amount": max_amount,
            "confidence": round(confidence, 3),
            "reasoning": reasoning,
            "model_version": cls.MODEL_VERSION,
            "processing_time_ms": processing_time,
            "factors": {
                "income_ratio": round(income_ratio, 4),
                "dti_ratio": round(dti_ratio, 4),
                "proof_valid": proof_valid,
                "compliance_clear": no_compliance_flags,
            }
        }
    
    @classmethod
    def _calculate_risk_score(
        cls,
        proof_valid: bool,
        income_sufficient: bool,
        dti_acceptable: bool,
        no_compliance_flags: bool,
        income_ratio: float,
        dti_ratio: float,
        tenure_months: int
    ) -> float:
        """Calculate weighted risk score (0-100, lower is better)."""
        score = 0.0
        
        # Proof validity (major factor)
        if not proof_valid:
            score += 40
        
        # Income check
        if not income_sufficient:
            score += 20
        else:
            # Penalize high income ratios
            score += max(0, (income_ratio - 0.2) * 30)
        
        # DTI check
        if not dti_acceptable:
            score += 20
        else:
            score += max(0, (dti_ratio - 0.2) * 25)
        
        # Compliance flags
        if not no_compliance_flags:
            score += 30
        
        # Tenure risk (longer = slightly higher risk)
        score += min(5, tenure_months / 12)
        
        return min(100, max(0, score))
    
    @classmethod
    def _generate_recommendation(
        cls,
        risk_score: float,
        risk_level: str,
        proof_valid: bool,
        requested_amount: float,
        monthly_income: float
    ) -> tuple[str, Optional[float]]:
        """Generate lending recommendation."""
        if not proof_valid:
            return "reject", None
        
        if risk_level == "low":
            return "approve", requested_amount
        elif risk_level == "medium":
            # Suggest reduced amount
            max_safe = min(requested_amount, monthly_income * 4)
            return "reduce_amount", round(max_safe, 2)
        elif risk_level == "high":
            max_safe = monthly_income * 2
            if max_safe >= requested_amount * 0.3:
                return "reduce_amount", round(max_safe, 2)
            return "reject", None
        else:
            return "reject", None
    
    @classmethod
    def _calculate_confidence(
        cls,
        proof_valid: bool,
        income_sufficient: bool,
        dti_acceptable: bool
    ) -> float:
        """Calculate model confidence in assessment."""
        base_confidence = 0.85
        
        # Higher confidence when conditions are clear
        if proof_valid and income_sufficient and dti_acceptable:
            return 0.95
        elif not proof_valid:
            return 0.98  # Very confident in rejection
        elif proof_valid and (income_sufficient or dti_acceptable):
            return 0.88
        else:
            return 0.82
    
    @classmethod
    def _generate_reasoning(
        cls,
        risk_score: float,
        risk_level: str,
        recommendation: str,
        income_ratio: float,
        dti_ratio: float,
        no_compliance_flags: bool
    ) -> str:
        """Generate human-readable reasoning."""
        parts = []
        
        parts.append(f"Risk assessment complete with score {risk_score:.1f}/100 ({risk_level} risk).")
        
        if income_ratio < 0.25:
            parts.append("Income coverage is excellent.")
        elif income_ratio < 0.33:
            parts.append("Income coverage is adequate.")
        else:
            parts.append("Income coverage is marginal.")
        
        if dti_ratio < 0.3:
            parts.append("Debt-to-income ratio is healthy.")
        elif dti_ratio < 0.4:
            parts.append("DTI ratio is acceptable but elevated.")
        else:
            parts.append("DTI ratio exceeds acceptable threshold.")
        
        if not no_compliance_flags:
            parts.append("Compliance flags require additional review.")
        
        if recommendation == "approve":
            parts.append("Recommendation: Approve at requested terms.")
        elif recommendation == "reduce_amount":
            parts.append("Recommendation: Approve with reduced principal.")
        else:
            parts.append("Recommendation: Decline application.")
        
        return " ".join(parts)


class LenderAgent:
    """
    Lender Decision Agent.
    
    Makes final lending decisions based on Aura assessment,
    determines interest rates, and structures loan terms.
    """
    
    MODEL_VERSION = "lender-decision-v1.8.2"
    _model = None
    
    # Interest rate configuration
    BASE_RATE = 8.5  # Base APR %
    RISK_PREMIUM = {
        "low": 0,
        "medium": 2.5,
        "high": 5.0,
        "critical": 10.0
    }
    
    @classmethod
    async def load_model(cls):
        """Load the decision ML model."""
        try:
            cls._model = "loaded"
            logger.info("Lender model loaded", version=cls.MODEL_VERSION)
        except Exception as e:
            logger.warning("Could not load Lender model", error=str(e))
    
    @classmethod
    async def make_decision(
        cls,
        aura_assessment: Dict[str, Any],
        requested_amount: float,
        requested_tenure: int,
    ) -> Dict[str, Any]:
        """
        Make final lending decision.
        
        Returns approval status, final terms, and explanation.
        """
        start_time = time.time()
        
        recommendation = aura_assessment["recommendation"]
        risk_level = aura_assessment["risk_level"]
        risk_score = aura_assessment["risk_score"]
        max_amount = aura_assessment.get("max_approved_amount")
        
        # Determine approval
        is_approved = recommendation in ["approve", "reduce_amount"]
        
        if is_approved:
            # Calculate approved amount
            if recommendation == "approve":
                approved_amount = requested_amount
            else:
                approved_amount = min(max_amount or requested_amount * 0.7, requested_amount)
            
            # Calculate interest rate
            interest_rate = cls._calculate_interest_rate(risk_level, risk_score)
            
            # Adjust tenure if needed
            adjusted_tenure = cls._adjust_tenure(
                requested_tenure,
                risk_level,
                approved_amount,
                requested_amount
            )
            
            # Calculate monthly payment
            monthly_payment = cls._calculate_monthly_payment(
                approved_amount,
                interest_rate,
                adjusted_tenure
            )
            
            explanation = cls._generate_approval_explanation(
                approved_amount,
                requested_amount,
                interest_rate,
                adjusted_tenure,
                risk_level
            )
        else:
            approved_amount = None
            interest_rate = None
            adjusted_tenure = None
            monthly_payment = None
            explanation = cls._generate_rejection_explanation(
                aura_assessment["reasoning"],
                risk_score
            )
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return {
            "decision_id": str(uuid4()),
            "is_approved": is_approved,
            "approved_amount": approved_amount,
            "interest_rate": interest_rate,
            "adjusted_tenure": adjusted_tenure,
            "monthly_payment": monthly_payment,
            "explanation": explanation,
            "model_version": cls.MODEL_VERSION,
            "processing_time_ms": processing_time,
            "terms": {
                "apr": interest_rate,
                "total_repayment": round(monthly_payment * adjusted_tenure, 2) if monthly_payment else None,
                "total_interest": round((monthly_payment * adjusted_tenure) - approved_amount, 2) if monthly_payment and approved_amount else None,
            } if is_approved else None
        }
    
    @classmethod
    def _calculate_interest_rate(cls, risk_level: str, risk_score: float) -> float:
        """Calculate APR based on risk profile."""
        base = cls.BASE_RATE
        premium = cls.RISK_PREMIUM.get(risk_level, 5.0)
        
        # Additional adjustment based on exact score
        score_adjustment = (risk_score / 100) * 2
        
        rate = base + premium + score_adjustment
        return round(min(25.0, max(5.0, rate)), 2)
    
    @classmethod
    def _adjust_tenure(
        cls,
        requested_tenure: int,
        risk_level: str,
        approved_amount: float,
        requested_amount: float
    ) -> int:
        """Adjust loan tenure based on risk."""
        if risk_level in ["low", "medium"]:
            return requested_tenure
        
        # For higher risk, may reduce tenure
        if approved_amount < requested_amount:
            # Proportionally reduce tenure
            ratio = approved_amount / requested_amount
            adjusted = int(requested_tenure * ratio)
            return max(3, min(adjusted, requested_tenure))
        
        return requested_tenure
    
    @classmethod
    def _calculate_monthly_payment(
        cls,
        principal: float,
        annual_rate: float,
        tenure_months: int
    ) -> float:
        """Calculate monthly payment using amortization formula."""
        if annual_rate == 0:
            return round(principal / tenure_months, 2)
        
        monthly_rate = annual_rate / 100 / 12
        payment = principal * (monthly_rate * (1 + monthly_rate) ** tenure_months) / \
                  ((1 + monthly_rate) ** tenure_months - 1)
        
        return round(payment, 2)
    
    @classmethod
    def _generate_approval_explanation(
        cls,
        approved_amount: float,
        requested_amount: float,
        interest_rate: float,
        tenure: int,
        risk_level: str
    ) -> str:
        """Generate approval explanation."""
        if approved_amount == requested_amount:
            return (
                f"Loan approved at full requested amount of ₳{approved_amount:,.2f}. "
                f"Based on your {risk_level} risk profile, you qualify for an APR of {interest_rate}% "
                f"over {tenure} months. Funds will be disbursed to your connected wallet upon confirmation."
            )
        else:
            return (
                f"Loan approved for ₳{approved_amount:,.2f} (reduced from requested ₳{requested_amount:,.2f}). "
                f"Based on risk assessment, we've adjusted the principal to ensure sustainable repayment. "
                f"APR: {interest_rate}% over {tenure} months."
            )
    
    @classmethod
    def _generate_rejection_explanation(cls, aura_reasoning: str, risk_score: float) -> str:
        """Generate rejection explanation."""
        return (
            f"After careful review, we're unable to approve this loan application. "
            f"Risk score of {risk_score:.1f}/100 exceeds our lending thresholds. "
            f"{aura_reasoning} "
            f"We recommend reducing the requested amount or improving your debt-to-income ratio before reapplying."
        )
