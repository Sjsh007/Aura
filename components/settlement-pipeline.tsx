"use client"

import { useEffect, useState } from "react"
import type { PipelineState } from "@/lib/pipeline-types"
import type { DisbursementResult } from "@/lib/types"
import { TransactionDetails } from "./transaction-details"
import { cn } from "@/lib/utils"

interface SettlementPipelineProps {
  state: PipelineState
  txHash: string | null
  disbursement: DisbursementResult | null
  onRetry?: () => void
}

export function SettlementPipeline({ state, txHash, disbursement, onRetry }: SettlementPipelineProps) {
  const { currentStage, error, canRetry, stageStartTime } = state
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [progress, setProgress] = useState(0)

  const isPending = currentStage === "settlement_pending"
  const isConfirmed = currentStage === "settlement_confirmed" || txHash !== null

  useEffect(() => {
    if (!stageStartTime || !isPending) {
      return
    }

    const interval = setInterval(() => {
      const elapsed = (Date.now() - stageStartTime) / 1000
      setTimeElapsed(elapsed)
      const rawProgress = (elapsed / 8) * 100
      setProgress(Math.min(95, rawProgress * (1 - Math.exp(-rawProgress / 50))))
    }, 100)

    return () => clearInterval(interval)
  }, [stageStartTime, isPending])

  if (currentStage === "error" && error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/50">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-rose-400 mb-2">Settlement Failed</h3>
        <p className="text-sm text-rose-300/80 mb-4 font-mono">{error}</p>
        {canRetry && onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-400 text-white rounded-lg transition font-medium text-sm shadow-lg shadow-rose-500/25"
          >
            Retry Settlement
          </button>
        )}
      </div>
    )
  }

  if (isConfirmed && disbursement) {
    return <TransactionDetails result={disbursement} />
  }

  return (
    <div className="space-y-4">
      <div className="gradient-border overflow-hidden">
        <div className="bg-[#12121f]">
          <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">On-Chain Settlement</h3>
            <span className="text-xs text-emerald-400 font-mono">Plutus V2 | Preprod</span>
          </div>

          <div className="p-4 space-y-3">
            {/* Broadcasting */}
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300",
                  isConfirmed && "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50",
                  isPending && "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50 animate-pulse",
                  !isPending && !isConfirmed && "bg-white/10 text-zinc-600",
                )}
              >
                {isConfirmed ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isPending ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <span className="text-xs">1</span>
                )}
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <h4
                    className={cn(
                      "font-medium text-sm",
                      isConfirmed ? "text-emerald-400" : isPending ? "text-white" : "text-zinc-600",
                    )}
                  >
                    Broadcasting Transaction
                  </h4>
                  {isPending && (
                    <span className="text-xs text-cyan-400 font-mono">~{Math.max(0, Math.ceil(8 - timeElapsed))}s</span>
                  )}
                  {isConfirmed && <span className="text-xs text-emerald-400 font-mono">done</span>}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">Submitting to Cardano mempool</p>
                {isPending && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={cn("ml-4.5 w-0.5 h-4", isConfirmed ? "bg-emerald-500" : "bg-white/10")} />

            {/* Confirmation */}
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300",
                  isConfirmed && "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50",
                  !isConfirmed && "bg-white/10 text-zinc-600",
                )}
              >
                {isConfirmed ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs">2</span>
                )}
              </div>
              <div className="flex-1 pt-0.5">
                <h4 className={cn("font-medium text-sm", isConfirmed ? "text-emerald-400" : "text-zinc-600")}>
                  Block Confirmation
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {isConfirmed ? "Transaction included in block" : "Waiting for network confirmation"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
