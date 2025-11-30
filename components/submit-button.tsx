"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface SubmitButtonProps {
  isLoading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: "submit" | "button"
  variant?: "primary" | "secondary" | "success"
  className?: string
}

export function SubmitButton({
  isLoading,
  disabled,
  children,
  onClick,
  type = "submit",
  variant = "primary",
  className,
}: SubmitButtonProps) {
  const baseStyles =
    "w-full px-4 py-3.5 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 hover:from-cyan-400 hover:via-violet-400 hover:to-pink-400 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
    secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10",
    success:
      "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        (disabled || isLoading) && "opacity-70 cursor-not-allowed",
        className,
      )}
    >
      {isLoading && (
        <>
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Spinner */}
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </>
      )}

      {/* Loading dots */}
      {isLoading ? (
        <span className="flex items-center gap-1">
          Processing
          <span className="flex gap-0.5">
            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}
