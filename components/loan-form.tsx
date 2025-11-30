"use client"

import type React from "react"
import { useState } from "react"
import type { LoanApplicationInput } from "@/lib/types"
import { validateLoanApplication } from "@/lib/validation"
import { useWallet } from "./wallet-provider"
import { PrivacyNotice } from "./privacy-notice"
import { StatusTracker } from "./status-tracker"
import { SettlementInfo } from "./settlement-info"
import { ProcessingPipeline } from "./processing-pipeline"
import { SettlementPipeline } from "./settlement-pipeline"
import { ProcessingLogs } from "./processing-logs"
import { ProofDetails } from "./proof-details"
import { useLoanPipeline } from "@/hooks/use-loan-pipeline"
import { cn } from "@/lib/utils"

export function LoanForm() {
  const { walletAddress, isConnected } = useWallet()
  const [formData, setFormData] = useState<LoanApplicationInput>({
    fullName: "",
    email: "",
    monthlyIncome: 0,
    existingDebt: 0,
    requestedAmount: 0,
    tenureMonths: 12,
    purpose: "",
    hasRedFlags: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [viewStep, setViewStep] = useState<"form" | "processing" | "decision" | "disbursement">("form")

  const { state: pipelineState, result, logs, startPipeline, startDisbursement, retry, reset } = useLoanPipeline()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const val = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: val }))
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: value === "" ? 0 : Number.parseFloat(value) }))
    } else if (type === "select-one" && name === "tenureMonths") {
      setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value, 10) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validationErrors = validateLoanApplication(formData)
    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce(
        (acc, err) => {
          acc[err.field] = err.message
          return acc
        },
        {} as Record<string, string>,
      )
      setErrors(errorMap)
      return
    }

    setViewStep("processing")
    await startPipeline(formData)

    if (result.loanDecision || pipelineState.completedStages.includes("lender_decision")) {
      setViewStep("decision")
    }
  }

  const isProcessingComplete =
    pipelineState.completedStages.includes("lender_decision") && pipelineState.currentStage === "idle"

  if (isProcessingComplete && viewStep === "processing") {
    setViewStep("decision")
  }

  const handleDisbursement = async () => {
    if (!result.loanDecision || !walletAddress) return
    setViewStep("disbursement")
    await startDisbursement(walletAddress)
  }

  const handleReset = () => {
    reset()
    setViewStep("form")
    setFormData({
      fullName: "Demo User",
      email: "",
      monthlyIncome: 0,
      existingDebt: 0,
      requestedAmount: 0,
      tenureMonths: 12,
      purpose: "",
      hasRedFlags: false,
    })
    setErrors({})
  }

  if (!isConnected || !walletAddress) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
            />
          </svg>
        </div>
        <p className="text-zinc-400">Connect your Cardano wallet to apply for a loan</p>
        <PrivacyNotice />
      </div>
    )
  }

  // Form step
  if (viewStep === "form") {
    return (
      <div className="space-y-6">
        <StatusTracker step="form" pipelineState={pipelineState} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <PrivacyNotice />

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-zinc-600 transition"
            />
            {errors.fullName && <p className="text-rose-400 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 text-white placeholder-zinc-600 transition"
            />
            {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Monthly Income (ADA)</label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white transition"
              />
              {errors.monthlyIncome && <p className="text-rose-400 text-xs mt-1">{errors.monthlyIncome}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Existing Debt (ADA)</label>
              <input
                type="number"
                name="existingDebt"
                value={formData.existingDebt || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 text-white transition"
              />
              {errors.existingDebt && <p className="text-rose-400 text-xs mt-1">{errors.existingDebt}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Requested Amount (ADA)</label>
              <input
                type="number"
                name="requestedAmount"
                value={formData.requestedAmount || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white transition"
              />
              {errors.requestedAmount && <p className="text-rose-400 text-xs mt-1">{errors.requestedAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Tenure (Months)</label>
              <select
                name="tenureMonths"
                value={formData.tenureMonths}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 text-white transition"
              >
                {[6, 12, 24, 36, 48, 60].map((m) => (
                  <option key={m} value={m} className="bg-[#1a1a2e]">
                    {m} months
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Purpose</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g., Business expansion, home improvement"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-zinc-600 transition"
              rows={3}
            />
            {errors.purpose && <p className="text-rose-400 text-xs mt-1">{errors.purpose}</p>}
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg">
            <input
              type="checkbox"
              name="hasRedFlags"
              checked={formData.hasRedFlags}
              onChange={handleChange}
              className="rounded bg-white/10 border-white/20 text-violet-500 focus:ring-violet-500/50"
            />
            <label className="text-sm text-zinc-400">I have credit/compliance red flags</label>
          </div>

          {errors.submit && <p className="text-rose-400 text-sm">{errors.submit}</p>}

          <button
            type="submit"
            className="w-full px-4 py-3.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:from-cyan-400 hover:via-violet-400 hover:to-pink-400 text-white font-semibold rounded-lg transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
          >
            Submit Application
          </button>
        </form>
      </div>
    )
  }

  // Processing step
  if (viewStep === "processing") {
    return (
      <div className="space-y-6">
        <StatusTracker step="processing" pipelineState={pipelineState} />
        <ProcessingPipeline state={pipelineState} onRetry={retry} />
        <ProcessingLogs logs={logs} />
      </div>
    )
  }

  // Decision step
  if (viewStep === "decision" && result.loanDecision) {
    const { loanDecision, proof, auraAssessment } = result

    return (
      <div className="space-y-6">
        <StatusTracker step="decision" pipelineState={pipelineState} />

        {proof && <ProofDetails proof={proof} />}

        {auraAssessment && (
          <div className="gradient-border overflow-hidden">
            <div className="bg-[#12121f]">
              <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Risk Assessment</h3>
                <span className="text-xs text-zinc-600 font-mono">{auraAssessment.metadata.modelVersion}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Risk Score</div>
                    <div
                      className={cn(
                        "text-4xl font-bold",
                        auraAssessment.riskScore <= 50
                          ? "text-emerald-400"
                          : auraAssessment.riskScore <= 70
                            ? "text-amber-400"
                            : "text-rose-400",
                      )}
                    >
                      {auraAssessment.riskScore}
                      <span className="text-lg text-zinc-600">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-500 mb-1">Recommendation</div>
                    <div
                      className={cn(
                        "text-sm font-medium px-3 py-1.5 rounded-lg",
                        auraAssessment.recommendation === "approve" &&
                          "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
                        auraAssessment.recommendation === "reduce_amount" &&
                          "bg-amber-500/20 text-amber-400 border border-amber-500/30",
                        auraAssessment.recommendation === "reject" &&
                          "bg-rose-500/20 text-rose-400 border border-rose-500/30",
                      )}
                    >
                      {auraAssessment.recommendation.replace("_", " ").toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-center">
                    <div className="text-zinc-500">Confidence</div>
                    <div className="text-cyan-400 font-semibold mt-1">{auraAssessment.metadata.confidenceScore}%</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-center">
                    <div className="text-zinc-500">Factors</div>
                    <div className="text-violet-400 font-semibold mt-1">{auraAssessment.metadata.factorsAnalyzed}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-center">
                    <div className="text-zinc-500">Time</div>
                    <div className="text-pink-400 font-semibold mt-1">{auraAssessment.metadata.processingTime}ms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={cn(
            "rounded-xl border overflow-hidden",
            loanDecision.status === "APPROVED" && "bg-emerald-500/10 border-emerald-500/30",
            loanDecision.status === "CONDITIONAL" && "bg-amber-500/10 border-amber-500/30",
            loanDecision.status === "REJECTED" && "bg-rose-500/10 border-rose-500/30",
          )}
        >
          <div
            className={cn(
              "px-4 py-3 border-b flex items-center gap-3",
              loanDecision.status === "APPROVED" && "bg-emerald-500/10 border-emerald-500/30",
              loanDecision.status === "CONDITIONAL" && "bg-amber-500/10 border-amber-500/30",
              loanDecision.status === "REJECTED" && "bg-rose-500/10 border-rose-500/30",
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                loanDecision.status === "APPROVED" && "bg-emerald-500 shadow-lg shadow-emerald-500/50",
                loanDecision.status === "CONDITIONAL" && "bg-amber-500 shadow-lg shadow-amber-500/50",
                loanDecision.status === "REJECTED" && "bg-rose-500 shadow-lg shadow-rose-500/50",
              )}
            >
              {loanDecision.status === "APPROVED" && (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {loanDecision.status === "CONDITIONAL" && (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
              {loanDecision.status === "REJECTED" && (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h3
              className={cn(
                "font-bold text-lg",
                loanDecision.status === "APPROVED" && "text-emerald-400",
                loanDecision.status === "CONDITIONAL" && "text-amber-400",
                loanDecision.status === "REJECTED" && "text-rose-400",
              )}
            >
              {loanDecision.status === "APPROVED"
                ? "APPROVED"
                : loanDecision.status === "CONDITIONAL"
                  ? "CONDITIONAL APPROVAL"
                  : "REJECTED"}
            </h3>
          </div>
          <div className="p-4">
            <p
              className={cn(
                "text-sm",
                loanDecision.status === "APPROVED" && "text-emerald-300/80",
                loanDecision.status === "CONDITIONAL" && "text-amber-300/80",
                loanDecision.status === "REJECTED" && "text-rose-300/80",
              )}
            >
              {loanDecision.explanation}
            </p>
          </div>
        </div>

        {loanDecision.status !== "REJECTED" && (
          <div className="gradient-border overflow-hidden">
            <div className="bg-[#12121f]">
              <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white">Loan Terms</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-sm">Approved Amount</span>
                  <span className="text-3xl font-bold gradient-text">₳ {loanDecision.approvedAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Interest Rate (Annual)</span>
                  <span className="text-cyan-400 font-medium">{loanDecision.interestRateAnnualPercent}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Tenure</span>
                  <span className="text-violet-400 font-medium">{loanDecision.tenureMonths} months</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Risk Tier</span>
                  <span className="text-pink-400 font-medium capitalize">{loanDecision.metadata.riskTier}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {loanDecision.status !== "REJECTED" && (
          <>
            <SettlementInfo />
            <button
              onClick={handleDisbursement}
              className="w-full px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold rounded-lg transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              Confirm & Disburse to Wallet
            </button>
          </>
        )}

        {loanDecision.status === "REJECTED" && (
          <button
            onClick={handleReset}
            className="w-full px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition border border-white/10"
          >
            Start New Application
          </button>
        )}
      </div>
    )
  }

  // Disbursement step
  if (viewStep === "disbursement") {
    return (
      <div className="space-y-6">
        <StatusTracker step="disbursement" pipelineState={pipelineState} />
        <SettlementPipeline
          state={pipelineState}
          txHash={result.txHash}
          disbursement={result.disbursement}
          onRetry={() => startDisbursement(walletAddress!)}
        />
        <ProcessingLogs logs={logs} />

        {result.txHash && (
          <button
            onClick={handleReset}
            className="w-full px-4 py-3.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:from-cyan-400 hover:via-violet-400 hover:to-pink-400 text-white font-semibold rounded-lg transition-all shadow-lg shadow-violet-500/25"
          >
            Start New Application
          </button>
        )}
      </div>
    )
  }

  return null
}
