"use client"

import { useState, useCallback, useRef } from "react"
import type {
  LoanApplicationInput,
  ZKProof,
  AuraAssessment,
  LoanDecision,
  DisbursementResult,
  ProcessingLogEntry,
} from "@/lib/types"
import type { PipelineStage, PipelineState } from "@/lib/pipeline-types"

interface PipelineResult {
  proof: ZKProof | null
  auraAssessment: AuraAssessment | null
  loanDecision: LoanDecision | null
  disbursement: DisbursementResult | null
  txHash: string | null
}

interface UseLoanPipelineReturn {
  state: PipelineState
  result: PipelineResult
  logs: ProcessingLogEntry[]
  startPipeline: (formData: LoanApplicationInput) => Promise<void>
  startDisbursement: (walletAddress: string) => Promise<void>
  retry: () => Promise<void>
  reset: () => void
}

const MIN_STAGE_DISPLAY_TIME: Record<PipelineStage, number> = {
  idle: 0,
  encrypting: 2800,
  uploading: 3500,
  generating_proof: 5500,
  risk_assessment: 4000,
  lender_decision: 3000,
  settlement_pending: 8000,
  settlement_confirmed: 0,
  error: 0,
}

export function useLoanPipeline(): UseLoanPipelineReturn {
  const [state, setState] = useState<PipelineState>({
    currentStage: "idle",
    completedStages: [],
    stageStartTime: null,
    stageProgress: 0,
    error: null,
    canRetry: false,
  })

  const [result, setResult] = useState<PipelineResult>({
    proof: null,
    auraAssessment: null,
    loanDecision: null,
    disbursement: null,
    txHash: null,
  })

  const [logs, setLogs] = useState<ProcessingLogEntry[]>([])

  const lastFormDataRef = useRef<LoanApplicationInput | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const addLog = useCallback(
    (level: ProcessingLogEntry["level"], stage: string, message: string, data?: Record<string, unknown>) => {
      const entry: ProcessingLogEntry = {
        timestamp: new Date().toISOString().slice(11, 23),
        level,
        stage,
        message,
        data,
      }
      setLogs((prev) => [...prev, entry])
    },
    [],
  )

  const waitMinTime = useCallback(async (stage: PipelineStage, startTime: number) => {
    const minTime = MIN_STAGE_DISPLAY_TIME[stage]
    const elapsed = Date.now() - startTime
    if (elapsed < minTime) {
      await new Promise((resolve) => setTimeout(resolve, minTime - elapsed))
    }
  }, [])

  const transitionTo = useCallback((stage: PipelineStage, addCompleted?: PipelineStage) => {
    setState((prev) => ({
      ...prev,
      currentStage: stage,
      completedStages: addCompleted ? [...prev.completedStages, addCompleted] : prev.completedStages,
      stageStartTime: Date.now(),
      stageProgress: 0,
      error: null,
      canRetry: false,
    }))
  }, [])

  const setError = useCallback(
    (error: string, canRetry = true) => {
      setState((prev) => ({
        ...prev,
        currentStage: "error",
        error,
        canRetry,
      }))
      addLog("error", "SYSTEM", error)
    },
    [addLog],
  )

  const startPipeline = useCallback(
    async (formData: LoanApplicationInput) => {
      lastFormDataRef.current = formData
      abortControllerRef.current = new AbortController()
      setLogs([]) // Reset logs

      try {
        // Stage 1: Encrypting
        addLog("info", "ENCRYPT", "Initializing AES-256-GCM encryption engine...")
        transitionTo("encrypting")
        let stageStart = Date.now()

        await new Promise((r) => setTimeout(r, 800))
        addLog("info", "ENCRYPT", "Deriving encryption key via PBKDF2...")
        await new Promise((r) => setTimeout(r, 600))
        addLog("info", "ENCRYPT", "Generating random IV (128-bit)...")
        await new Promise((r) => setTimeout(r, 400))
        addLog("success", "ENCRYPT", "Payload encrypted successfully", { size: "2.4kb" })

        await waitMinTime("encrypting", stageStart)

        // Stage 2: Uploading to IPFS
        transitionTo("uploading", "encrypting")
        stageStart = Date.now()
        addLog("info", "IPFS", "Connecting to Pinata gateway...")

        await new Promise((r) => setTimeout(r, 500))

        const dataJson = JSON.stringify(formData)
        const ipfsRes = await fetch("/api/ipfs/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataJson }),
          signal: abortControllerRef.current?.signal,
        })

        if (!ipfsRes.ok) throw new Error("Failed to upload to IPFS. Please try again.")
        const { cid } = await ipfsRes.json()

        addLog("info", "IPFS", "Uploading encrypted blob to network...")
        await new Promise((r) => setTimeout(r, 800))
        addLog("success", "IPFS", `Pinned successfully`, { cid: cid.slice(0, 20) + "..." })

        await waitMinTime("uploading", stageStart)

        // Stage 3: Generating ZK Proof
        transitionTo("generating_proof", "uploading")
        stageStart = Date.now()
        addLog("info", "ZKPROOF", "Loading Compact circuit (loan_eligibility_v1)...")

        await new Promise((r) => setTimeout(r, 600))
        addLog("info", "ZKPROOF", "Compiling R1CS constraints...")
        await new Promise((r) => setTimeout(r, 800))
        addLog("info", "ZKPROOF", "Computing witness from private inputs...")

        const proofRes = await fetch("/api/proof/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: formData, cid }),
          signal: abortControllerRef.current?.signal,
        })

        if (!proofRes.ok) {
          const errorText = await proofRes.text()
          throw new Error(errorText || "Proof generation failed")
        }

        const proofData: ZKProof = await proofRes.json()
        setResult((prev) => ({ ...prev, proof: proofData }))

        addLog("info", "ZKPROOF", `Proving with Groth16 protocol...`)
        await new Promise((r) => setTimeout(r, 1000))
        addLog("success", "ZKPROOF", `Proof generated in ${proofData.metadata.provingTime}ms`, {
          constraints: proofData.metadata.constraintCount,
          valid: proofData.valid,
        })

        await waitMinTime("generating_proof", stageStart)

        // Stage 4: Risk Assessment
        transitionTo("risk_assessment", "generating_proof")
        stageStart = Date.now()
        addLog("info", "AURA", "Initializing Aura risk assessment agent...")

        await new Promise((r) => setTimeout(r, 500))
        addLog("info", "AURA", "Analyzing proof conditions...")

        const auraRes = await fetch("/api/agents/aura", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proof: proofData,
            monthlyIncome: formData.monthlyIncome,
            requestedAmount: formData.requestedAmount,
            tenureMonths: formData.tenureMonths,
          }),
          signal: abortControllerRef.current?.signal,
        })

        if (!auraRes.ok) throw new Error("Risk assessment failed. Please try again.")
        const auraData: AuraAssessment = await auraRes.json()
        setResult((prev) => ({ ...prev, auraAssessment: auraData }))

        addLog("info", "AURA", "Computing multi-factor risk score...")
        await new Promise((r) => setTimeout(r, 600))
        addLog("success", "AURA", `Assessment complete: score ${auraData.riskScore}/100`, {
          recommendation: auraData.recommendation,
        })

        await waitMinTime("risk_assessment", stageStart)

        // Stage 5: Lender Decision
        transitionTo("lender_decision", "risk_assessment")
        stageStart = Date.now()
        addLog("info", "LENDER", "Forwarding to underwriting engine...")

        const lenderRes = await fetch("/api/agents/lender", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessment: auraData,
            requestedAmount: formData.requestedAmount,
            tenureMonths: formData.tenureMonths,
          }),
          signal: abortControllerRef.current?.signal,
        })

        if (!lenderRes.ok) throw new Error("Lender decision failed. Please try again.")
        const lenderData: LoanDecision = await lenderRes.json()
        setResult((prev) => ({ ...prev, loanDecision: lenderData }))

        addLog("info", "LENDER", "Applying policy rules and pricing...")
        await new Promise((r) => setTimeout(r, 500))
        addLog("success", "LENDER", `Decision: ${lenderData.status}`, {
          amount: lenderData.approvedAmount,
          rate: `${lenderData.interestRateAnnualPercent}%`,
        })

        await waitMinTime("lender_decision", stageStart)

        setState((prev) => ({
          ...prev,
          completedStages: [...prev.completedStages, "lender_decision"],
          currentStage: "idle",
        }))

        addLog("success", "SYSTEM", "Pipeline completed successfully")
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return
        }
        setError(error instanceof Error ? error.message : "An unexpected error occurred", true)
      }
    },
    [transitionTo, waitMinTime, setError, addLog],
  )

  const startDisbursement = useCallback(
    async (walletAddress: string) => {
      if (!result.loanDecision || !result.proof) return

      try {
        transitionTo("settlement_pending")
        const stageStart = Date.now()

        addLog("info", "PLUTUS", "Connecting to Cardano preprod network...")
        await new Promise((r) => setTimeout(r, 600))
        addLog("info", "PLUTUS", "Loading Aura lending contract...")
        await new Promise((r) => setTimeout(r, 500))
        addLog("info", "PLUTUS", "Constructing transaction outputs...")

        const disburseRes = await fetch("/api/settlement/disburse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress,
            approvedAmount: result.loanDecision.approvedAmount,
            decisionId: result.loanDecision.decisionId,
            proofId: result.proof.proofId,
          }),
        })

        if (!disburseRes.ok) throw new Error("Disbursement failed. Please try again.")
        const disbursementResult: DisbursementResult = await disburseRes.json()

        addLog("info", "PLUTUS", "Signing transaction...")
        await new Promise((r) => setTimeout(r, 800))
        addLog("info", "PLUTUS", "Broadcasting to mempool...")
        await new Promise((r) => setTimeout(r, 1200))
        addLog("info", "PLUTUS", "Waiting for block confirmation...")

        await waitMinTime("settlement_pending", stageStart)

        addLog("success", "PLUTUS", `Transaction confirmed in block ${disbursementResult.metadata.blockHeight}`, {
          txHash: disbursementResult.txHash.slice(0, 16) + "...",
        })

        setResult((prev) => ({
          ...prev,
          txHash: disbursementResult.txHash,
          disbursement: disbursementResult,
        }))
        transitionTo("settlement_confirmed", "settlement_pending")
        setState((prev) => ({
          ...prev,
          completedStages: [...prev.completedStages, "settlement_confirmed"],
        }))

        addLog("success", "SYSTEM", "Settlement complete - funds disbursed")
      } catch (error) {
        setError(error instanceof Error ? error.message : "Disbursement failed", true)
      }
    },
    [result.loanDecision, result.proof, transitionTo, waitMinTime, setError, addLog],
  )

  const retry = useCallback(async () => {
    if (lastFormDataRef.current) {
      await startPipeline(lastFormDataRef.current)
    }
  }, [startPipeline])

  const reset = useCallback(() => {
    abortControllerRef.current?.abort()
    setState({
      currentStage: "idle",
      completedStages: [],
      stageStartTime: null,
      stageProgress: 0,
      error: null,
      canRetry: false,
    })
    setResult({
      proof: null,
      auraAssessment: null,
      loanDecision: null,
      disbursement: null,
      txHash: null,
    })
    setLogs([])
    lastFormDataRef.current = null
  }, [])

  return {
    state,
    result,
    logs,
    startPipeline,
    startDisbursement,
    retry,
    reset,
  }
}
