"use client"

import type { ZKProof, AuraAssessment, LoanDecision } from "@/lib/types"
import type { PipelineState } from "@/lib/pipeline-types"
import { cn } from "@/lib/utils"

interface StatusTrackerProps {
  step: "form" | "processing" | "decision" | "disbursement"
  pipelineState?: PipelineState
  proof?: ZKProof | null
  assessment?: AuraAssessment | null
  decision?: LoanDecision | null
}

export function StatusTracker({ step, pipelineState }: StatusTrackerProps) {
  const steps = [
    { id: "form", label: "Application", color: "cyan" },
    { id: "processing", label: "Processing", color: "violet" },
    { id: "decision", label: "Decision", color: "pink" },
    { id: "disbursement", label: "Settlement", color: "emerald" },
  ]

  const currentIndex = steps.findIndex((s) => s.id === step)

  const getStepIcon = (id: string) => {
    switch (id) {
      case "form":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )
      case "processing":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case "decision":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        )
      case "disbursement":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-white/10 rounded-full" />

        <div
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {steps.map((s, idx) => {
          const isCompleted = idx < currentIndex
          const isCurrent = idx === currentIndex
          const isPending = idx > currentIndex

          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                  isCompleted && "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50",
                  isCurrent &&
                    s.color === "cyan" &&
                    "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white scale-110 ring-4 ring-cyan-500/30 shadow-lg shadow-cyan-500/50",
                  isCurrent &&
                    s.color === "violet" &&
                    "bg-gradient-to-br from-violet-500 to-violet-600 text-white scale-110 ring-4 ring-violet-500/30 shadow-lg shadow-violet-500/50",
                  isCurrent &&
                    s.color === "pink" &&
                    "bg-gradient-to-br from-pink-500 to-pink-600 text-white scale-110 ring-4 ring-pink-500/30 shadow-lg shadow-pink-500/50",
                  isCurrent &&
                    s.color === "emerald" &&
                    "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white scale-110 ring-4 ring-emerald-500/30 shadow-lg shadow-emerald-500/50",
                  isPending && "bg-white/10 text-zinc-500",
                )}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  getStepIcon(s.id)
                )}
              </div>
              <p
                className={cn(
                  "text-xs font-medium text-center mt-2 whitespace-nowrap transition-colors",
                  isCurrent && s.color === "cyan" && "text-cyan-400 font-semibold",
                  isCurrent && s.color === "violet" && "text-violet-400 font-semibold",
                  isCurrent && s.color === "pink" && "text-pink-400 font-semibold",
                  isCurrent && s.color === "emerald" && "text-emerald-400 font-semibold",
                  isCompleted && "text-emerald-400",
                  isPending && "text-zinc-600",
                )}
              >
                {s.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
