"use client"

import { useEffect, useState } from "react"
import type { PipelineState } from "@/lib/pipeline-types"
import { PIPELINE_STEPS, getStepByStage } from "@/lib/pipeline-types"
import { cn } from "@/lib/utils"

interface ProcessingPipelineProps {
  state: PipelineState
  onRetry?: () => void
}

export function ProcessingPipeline({ state, onRetry }: ProcessingPipelineProps) {
  const { currentStage, completedStages, stageStartTime, error, canRetry } = state
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [progress, setProgress] = useState(0)

  const currentStep = getStepByStage(currentStage)

  useEffect(() => {
    if (
      !stageStartTime ||
      currentStage === "idle" ||
      currentStage === "error" ||
      currentStage === "settlement_confirmed"
    ) {
      setTimeElapsed(0)
      setProgress(0)
      return
    }

    const interval = setInterval(() => {
      const elapsed = (Date.now() - stageStartTime) / 1000
      setTimeElapsed(elapsed)

      if (currentStep) {
        const rawProgress = (elapsed / currentStep.estimatedDuration) * 100
        const easedProgress = Math.min(95, rawProgress * (1 - Math.exp(-rawProgress / 50)))
        setProgress(easedProgress)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [stageStartTime, currentStage, currentStep])

  if (currentStage === "error") {
    return (
      <div className="space-y-6">
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
          <h3 className="text-lg font-semibold text-rose-400 mb-2">Processing Error</h3>
          <p className="text-sm text-rose-300/80 mb-4 font-mono">{error}</p>
          {canRetry && onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2.5 bg-rose-500 hover:bg-rose-400 text-white rounded-lg transition font-medium text-sm shadow-lg shadow-rose-500/25"
            >
              Retry Operation
            </button>
          )}
        </div>
      </div>
    )
  }

  if (currentStage === "idle" && completedStages.length === 0) {
    return null
  }

  const processingSteps = PIPELINE_STEPS.filter((s) => s.id !== "settlement_pending" && s.id !== "settlement_confirmed")

  const stepColors = ["cyan", "violet", "pink", "emerald", "amber"] as const
  type StepColor = (typeof stepColors)[number]

  const getStepColor = (index: number): StepColor => stepColors[index % stepColors.length]

  return (
    <div className="space-y-6">
      <div className="gradient-border overflow-hidden">
        <div className="bg-[#12121f]">
          <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Processing Pipeline</h3>
            {currentStep && currentStage !== "idle" && (
              <span className="text-xs text-cyan-400 font-mono">{currentStep.technicalDetail}</span>
            )}
          </div>

          <div className="p-4 space-y-3">
            {processingSteps.map((step, index) => {
              const isCompleted = completedStages.includes(step.id)
              const isCurrent = currentStage === step.id
              const isPending = !isCompleted && !isCurrent
              const color = getStepColor(index)

              return (
                <div key={step.id} className="relative">
                  {index < processingSteps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-4 top-9 w-0.5 h-6 transition-colors duration-500",
                        isCompleted ? "bg-emerald-500" : "bg-white/10",
                      )}
                    />
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300",
                        isCompleted && "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30",
                        isCurrent &&
                          color === "cyan" &&
                          "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50 animate-pulse",
                        isCurrent &&
                          color === "violet" &&
                          "bg-violet-500 text-white shadow-lg shadow-violet-500/50 animate-pulse",
                        isCurrent &&
                          color === "pink" &&
                          "bg-pink-500 text-white shadow-lg shadow-pink-500/50 animate-pulse",
                        isCurrent &&
                          color === "emerald" &&
                          "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 animate-pulse",
                        isCurrent &&
                          color === "amber" &&
                          "bg-amber-500 text-white shadow-lg shadow-amber-500/50 animate-pulse",
                        isPending && "bg-white/10 text-zinc-600",
                      )}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isCurrent ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <h4
                          className={cn(
                            "font-medium text-sm transition-colors",
                            isCompleted && "text-emerald-400",
                            isCurrent && "text-white",
                            isPending && "text-zinc-600",
                          )}
                        >
                          {step.label}
                        </h4>
                        {isCompleted && <span className="text-xs text-emerald-400 font-mono">done</span>}
                        {isCurrent && (
                          <span
                            className={cn(
                              "text-xs font-mono",
                              color === "cyan" && "text-cyan-400",
                              color === "violet" && "text-violet-400",
                              color === "pink" && "text-pink-400",
                              color === "emerald" && "text-emerald-400",
                              color === "amber" && "text-amber-400",
                            )}
                          >
                            ~{Math.max(0, Math.ceil(step.estimatedDuration - timeElapsed))}s
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-xs mt-0.5 transition-colors",
                          isCurrent ? "text-zinc-400" : "text-zinc-600",
                        )}
                      >
                        {step.description}
                      </p>

                      {isCurrent && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-300 ease-out",
                                color === "cyan" && "bg-gradient-to-r from-cyan-500 to-cyan-400",
                                color === "violet" && "bg-gradient-to-r from-violet-500 to-violet-400",
                                color === "pink" && "bg-gradient-to-r from-pink-500 to-pink-400",
                                color === "emerald" && "bg-gradient-to-r from-emerald-500 to-emerald-400",
                                color === "amber" && "bg-gradient-to-r from-amber-500 to-amber-400",
                              )}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
