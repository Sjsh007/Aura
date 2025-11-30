"use client"

import { useEffect, useRef } from "react"
import type { ProcessingLogEntry } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProcessingLogsProps {
  logs: ProcessingLogEntry[]
  className?: string
}

export function ProcessingLogs({ logs, className }: ProcessingLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const getLevelColor = (level: ProcessingLogEntry["level"]) => {
    switch (level) {
      case "success":
        return "text-emerald-400"
      case "error":
        return "text-rose-400"
      case "warning":
        return "text-amber-400"
      case "debug":
        return "text-zinc-500"
      default:
        return "text-zinc-300"
    }
  }

  const getLevelPrefix = (level: ProcessingLogEntry["level"]) => {
    switch (level) {
      case "success":
        return "[OK]"
      case "error":
        return "[ERR]"
      case "warning":
        return "[WARN]"
      case "debug":
        return "[DBG]"
      default:
        return "[INFO]"
    }
  }

  return (
    <div className={cn("gradient-border overflow-hidden", className)}>
      <div className="bg-[#0a0a12]">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/10">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/30" />
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
          </div>
          <span className="text-xs font-mono text-zinc-500 ml-2">aura-protocol — processing logs</span>
        </div>
        <div ref={scrollRef} className="p-4 h-64 overflow-y-auto font-mono text-xs space-y-1 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-zinc-600 animate-pulse">Waiting for processing to start...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-2 leading-relaxed">
                <span className="text-zinc-600 shrink-0">{log.timestamp}</span>
                <span className={cn("shrink-0 w-12", getLevelColor(log.level))}>{getLevelPrefix(log.level)}</span>
                <span className="text-violet-400 shrink-0">[{log.stage}]</span>
                <span className={getLevelColor(log.level)}>{log.message}</span>
                {log.data && <span className="text-zinc-600">{JSON.stringify(log.data)}</span>}
              </div>
            ))
          )}
          <div className="text-cyan-400 animate-pulse">█</div>
        </div>
      </div>
    </div>
  )
}
