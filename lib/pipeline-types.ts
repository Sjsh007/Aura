// Types for the staged loan processing pipeline

export type PipelineStage =
  | "idle"
  | "encrypting"
  | "uploading"
  | "generating_proof"
  | "risk_assessment"
  | "lender_decision"
  | "settlement_pending"
  | "settlement_confirmed"
  | "error"

export interface PipelineStep {
  id: PipelineStage
  label: string
  description: string
  estimatedDuration: number // seconds
  icon: string
  technicalDetail: string
}

export interface PipelineState {
  currentStage: PipelineStage
  completedStages: PipelineStage[]
  stageStartTime: number | null
  stageProgress: number // 0-100
  error: string | null
  canRetry: boolean
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "encrypting",
    label: "Encrypting Data",
    description: "Encrypting KYC payload with AES-256-GCM",
    estimatedDuration: 3,
    icon: "🔐",
    technicalDetail: "AES-256-GCM | 256-bit key derivation | PBKDF2",
  },
  {
    id: "uploading",
    label: "IPFS Storage",
    description: "Pinning encrypted blob to decentralized storage",
    estimatedDuration: 4,
    icon: "☁️",
    technicalDetail: "IPFS v0.1 | CIDv1 | Pinata Gateway",
  },
  {
    id: "generating_proof",
    label: "ZK Proof Generation",
    description: "Computing zero-knowledge proof via Compact circuit",
    estimatedDuration: 5,
    icon: "🔒",
    technicalDetail: "Groth16 | BN254 curve | ~2048 constraints",
  },
  {
    id: "risk_assessment",
    label: "Aura Risk Analysis",
    description: "AI agent evaluating creditworthiness from proof",
    estimatedDuration: 4,
    icon: "🤖",
    technicalDetail: "Aura v2.1.0 | Multi-factor scoring | Privacy-preserving",
  },
  {
    id: "lender_decision",
    label: "Lender Underwriting",
    description: "Automated underwriting engine processing decision",
    estimatedDuration: 3,
    icon: "📋",
    technicalDetail: "Policy Engine v1.4 | Risk-adjusted pricing",
  },
  {
    id: "settlement_pending",
    label: "On-Chain Settlement",
    description: "Broadcasting transaction to Cardano network",
    estimatedDuration: 8,
    icon: "⏳",
    technicalDetail: "Plutus V2 | Preprod | ~0.2 ADA fees",
  },
  {
    id: "settlement_confirmed",
    label: "Confirmed",
    description: "Transaction confirmed on blockchain",
    estimatedDuration: 0,
    icon: "✅",
    technicalDetail: "Finality achieved | Block confirmed",
  },
]

export function getStepByStage(stage: PipelineStage): PipelineStep | undefined {
  return PIPELINE_STEPS.find((s) => s.id === stage)
}

export function getStageIndex(stage: PipelineStage): number {
  return PIPELINE_STEPS.findIndex((s) => s.id === stage)
}
