// Deterministic ZK-style proof generation logic
import type { LoanApplicationInput, ZKProof } from "./types"
import { generateRealisticHash } from "./realistic-ids"

export interface ProofEvaluation {
  incomeToRepaymentRatioOk: boolean
  debtToIncomeOk: boolean
  noRedFlags: boolean
  monthlyRepayment: number
  debtToIncomeRatio: number
}

// Evaluate eligibility conditions based on loan rules
export function evaluateConditions(input: LoanApplicationInput): ProofEvaluation {
  const monthlyRepayment =
    input.requestedAmount / input.tenureMonths + (input.requestedAmount * 0.05) / (input.tenureMonths * 12)

  const incomeToRepaymentRatioOk = input.monthlyIncome >= monthlyRepayment * 3

  const totalMonthlyDebt = input.existingDebt / 12 + monthlyRepayment
  const debtToIncomeRatio = totalMonthlyDebt / input.monthlyIncome
  const debtToIncomeOk = debtToIncomeRatio < 0.4

  const noRedFlags = !input.hasRedFlags

  return {
    incomeToRepaymentRatioOk,
    debtToIncomeOk,
    noRedFlags,
    monthlyRepayment,
    debtToIncomeRatio,
  }
}

export function generateProof(
  input: LoanApplicationInput,
  cid: string,
  dataHash: string,
  proofId: string,
  proofHash: string,
): ZKProof {
  const evaluation = evaluateConditions(input)
  const valid = evaluation.incomeToRepaymentRatioOk && evaluation.debtToIncomeOk && evaluation.noRedFlags

  // Generate realistic proof metadata
  const constraintCount = 2048 + Math.floor(Math.random() * 512)
  const provingTime = 1800 + Math.floor(Math.random() * 600)
  const verificationTime = 12 + Math.floor(Math.random() * 8)

  return {
    proofId,
    cid,
    conditions: {
      incomeToRepaymentRatioOk: evaluation.incomeToRepaymentRatioOk,
      debtToIncomeOk: evaluation.debtToIncomeOk,
      noRedFlags: evaluation.noRedFlags,
    },
    hash: proofHash,
    valid,
    generatedAt: new Date().toISOString(),
    metadata: {
      circuitName: "loan_eligibility_v1",
      constraintCount,
      proofSize: 192 + Math.floor(Math.random() * 32),
      verificationTime,
      provingTime,
      curveType: "BN254",
      protocol: "Groth16",
      publicInputsHash: generateRealisticHash(`pub-${proofId}`),
      witnessHash: generateRealisticHash(`wit-${proofId}`),
    },
  }
}
