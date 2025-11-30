// Core domain types for the lending dApp

export interface EncryptedPayload {
  cid: string
  algo: "AES-GCM"
  nonce: string
  ciphertext: string
}

export interface LoanApplicationInput {
  fullName: string
  email: string
  monthlyIncome: number
  existingDebt: number
  requestedAmount: number
  tenureMonths: number
  purpose: string
  hasRedFlags: boolean
}

export interface ZKProof {
  proofId: string
  cid: string
  conditions: {
    incomeToRepaymentRatioOk: boolean
    debtToIncomeOk: boolean
    noRedFlags: boolean
  }
  hash: string
  valid: boolean
  generatedAt: string
  // New technical metadata
  metadata: {
    circuitName: string
    constraintCount: number
    proofSize: number // bytes
    verificationTime: number // ms
    provingTime: number // ms
    curveType: string
    protocol: string
    publicInputsHash: string
    witnessHash: string
  }
}

export interface AuraAssessment {
  proofId: string
  riskScore: number
  recommendation: "approve" | "reduce_amount" | "reject"
  maxRecommendedAmount: number
  notes: string[]
  metadata: {
    modelVersion: string
    evaluationId: string
    confidenceScore: number
    processingTime: number // ms
    factorsAnalyzed: number
  }
}

export interface LoanDecision {
  decisionId: string
  proofId: string
  status: "APPROVED" | "CONDITIONAL" | "REJECTED"
  approvedAmount: number
  interestRateAnnualPercent: number
  tenureMonths: number
  explanation: string
  requiresUserConfirmation: boolean
  metadata: {
    policyVersion: string
    underwritingTime: number // ms
    riskTier: string
    collateralRequired: boolean
  }
}

export interface DisbursementResult {
  txHash: string
  toAddress: string
  amount: number
  network: string
  metadata: {
    blockHeight: number
    slotNumber: number
    epoch: number
    fees: number
    confirmations: number
    plutusScriptHash: string
    datumHash: string
  }
}

export interface ApplicationSession {
  sessionId: string
  walletAddress: string
  encryptedPayload?: EncryptedPayload
  zkProof?: ZKProof
  auraAssessment?: AuraAssessment
  loanDecision?: LoanDecision
  disbursementResult?: DisbursementResult
  createdAt: string
  updatedAt: string
}

export interface ProcessingLogEntry {
  timestamp: string
  level: "info" | "success" | "warning" | "error" | "debug"
  stage: string
  message: string
  data?: Record<string, unknown>
}
