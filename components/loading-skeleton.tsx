"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%]",
        className,
      )}
      style={{
        animation: "shimmer 1.5s infinite",
      }}
    />
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Privacy notice skeleton */}
      <div className="rounded-xl border border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>

      {/* Form fields skeleton */}
      <div className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Grid row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>

        {/* Grid row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>

        {/* Checkbox */}
        <Skeleton className="h-14 w-full rounded-lg" />

        {/* Submit button */}
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function ProcessingSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Status tracker skeleton */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              {i < 4 && <Skeleton className="w-8 h-0.5" />}
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline skeleton */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="px-4 py-3 bg-white/5 border-b border-white/10">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs skeleton */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="px-4 py-3 bg-white/5 border-b border-white/10">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="p-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-16 h-3" />
              <Skeleton className="w-12 h-3" />
              <Skeleton className="flex-1 h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
