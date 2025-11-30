// Aura and Lender Agent logic
import type { ZKProof, AuraAssessment, LoanDecision } from "./types"
import { generateRealisticHash } from "./realistic-ids"

// Risk score calculation
export function calculateRiskScore(
  proof: ZKProof,
  monthlyIncome: number,
  requestedAmount: number,
  tenureMonths: number,
): number {
  let riskScore = 50 // Base score

  // Condition checks
  if (!proof.conditions.incomeToRepaymentRatioOk) riskScore += 20
  if (!proof.conditions.debtToIncomeOk) riskScore += 15
  if (!proof.conditions.noRedFlags) riskScore += 25

  // Income-to-loan ratio
  const incomeToLoanRatio = (monthlyIncome * tenureMonths) / requestedAmount
  if (incomeToLoanRatio < 10) riskScore += 10
  else if (incomeToLoanRatio < 20) riskScore += 5

  // Clamp to 0-100
  return Math.min(Math.max(riskScore, 0), 100)
}

// Aura Agent: Risk assessment
export function runAuraAgent(
  proof: ZKProof,
  monthlyIncome: number,
  requestedAmount: number,
  tenureMonths: number,
): AuraAssessment {
  const riskScore = calculateRiskScore(proof, monthlyIncome, requestedAmount, tenureMonths)

  let recommendation: "approve" | "reduce_amount" | "reject" = "approve"
  let maxRecommendedAmount = requestedAmount
  const notes: string[] = []

  if (!proof.valid) {
    recommendation = "reject"
    notes.push("Proof validation failed")
  } else if (riskScore > 80) {
    recommendation = "reject"
    notes.push(`High risk score: ${riskScore}. Conditions not met for approval.`)
  } else if (riskScore > 60) {
    recommendation = "reduce_amount"
    maxRecommendedAmount = requestedAmount * 0.7 // Recommend 70% of requested
    notes.push(`Moderate risk score: ${riskScore}. Consider reducing loan amount.`)
    notes.push(`Recommended max: ${maxRecommendedAmount.toFixed(2)} ADA`)
  } else {
    recommendation = "approve"
    notes.push(`Low risk score: ${riskScore}. Conditions met for approval.`)
  }

  if (!proof.conditions.incomeToRepaymentRatioOk) {
    notes.push("Income may be insufficient relative to repayment obligation.")
  }

  if (!proof.conditions.debtToIncomeOk) {
    notes.push("Debt-to-income ratio is elevated.")
  }

  return {
    proofId: proof.proofId,
    riskScore,
    recommendation,
    maxRecommendedAmount,
    notes,
    metadata: {
      modelVersion: "aura-v2.1.0",
      evaluationId: generateRealisticHash(`eval-${proof.proofId}`).slice(0, 32),
      confidenceScore: 85 + Math.floor(Math.random() * 10),
      processingTime: 180 + Math.floor(Math.random() * 120),
      factorsAnalyzed: 12 + Math.floor(Math.random() * 5),
    },
  }
}

// Lender Agent: Final decision and terms
export function runLenderAgent(
  assessment: AuraAssessment,
  requestedAmount: number,
  tenureMonths: number,
): LoanDecision {
  const decisionId = getUUID()
  let status: "APPROVED" | "CONDITIONAL" | "REJECTED" = "REJECTED"
  let approvedAmount = 0
  let interestRateAnnualPercent = 0
  let requiresUserConfirmation = false
  let explanation = ""
  let riskTier = "standard"

  if (assessment.riskScore > 80) {
    status = "REJECTED"
    riskTier = "high"
    explanation = `Application rejected due to high risk score (${assessment.riskScore}/100). ${assessment.notes.join(" ")}`
  } else if (assessment.riskScore > 60) {
    status = "CONDITIONAL"
    riskTier = "elevated"
    approvedAmount = Math.min(assessment.maxRecommendedAmount, requestedAmount)
    interestRateAnnualPercent = 8.5
    requiresUserConfirmation = true
    explanation = `Conditional approval: ${approvedAmount.toFixed(2)} ADA at ${interestRateAnnualPercent}% annual interest. Please confirm the reduced amount.`
  } else {
    status = "APPROVED"
    riskTier = "low"
    approvedAmount = requestedAmount
    interestRateAnnualPercent = 5.0
    explanation = `Approved: ${approvedAmount.toFixed(2)} ADA at ${interestRateAnnualPercent}% annual interest for ${tenureMonths} months.`
  }

  return {
    decisionId,
    proofId: assessment.proofId,
    status,
    approvedAmount,
    interestRateAnnualPercent,
    tenureMonths,
    explanation,
    requiresUserConfirmation,
    metadata: {
      policyVersion: "lender-policy-v1.4.2",
      underwritingTime: 95 + Math.floor(Math.random() * 60),
      riskTier,
      collateralRequired: assessment.riskScore > 70,
    },
  }
}

function getUUID(): string {
  return globalThis.crypto.randomUUID()
}
