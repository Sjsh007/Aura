"use client"

import type { ZKProof } from "@/lib/types"
import { truncateHash } from "@/lib/realistic-ids"
import { cn } from "@/lib/utils"

interface ProofDetailsProps {
  proof: ZKProof
  className?: string
}

export function ProofDetails({ proof, className }: ProofDetailsProps) {
  return (
    <div className={cn("gradient-border overflow-hidden", className)}>
      <div className="bg-[#12121f]">
        <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">ZK Proof Certificate</h3>
          <div
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-semibold",
              proof.valid
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/30",
            )}
          >
            {proof.valid ? "VALID" : "INVALID"}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Proof Hash */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 uppercase tracking-wide">Proof Hash</label>
            <div className="font-mono text-xs bg-white/5 px-3 py-2.5 rounded-lg border border-white/10 text-cyan-400 break-all">
              0x{proof.hash}
            </div>
          </div>

          {/* Circuit Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="text-xs text-zinc-500 mb-1">Circuit</div>
              <div className="text-sm font-medium text-cyan-400">{proof.metadata.circuitName}</div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="text-xs text-zinc-500 mb-1">Protocol</div>
              <div className="text-sm font-medium text-violet-400">{proof.metadata.protocol}</div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="text-xs text-zinc-500 mb-1">Constraints</div>
              <div className="text-sm font-medium text-pink-400">{proof.metadata.constraintCount.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="text-xs text-zinc-500 mb-1">Curve</div>
              <div className="text-sm font-medium text-emerald-400">{proof.metadata.curveType}</div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-zinc-500">Proving: </span>
              <span className="text-cyan-400 font-medium">{proof.metadata.provingTime}ms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <span className="text-zinc-500">Verification: </span>
              <span className="text-violet-400 font-medium">{proof.metadata.verificationTime}ms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              <span className="text-zinc-500">Size: </span>
              <span className="text-pink-400 font-medium">{proof.metadata.proofSize} bytes</span>
            </div>
          </div>

          {/* Conditions Verified */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 uppercase tracking-wide">Conditions Verified</label>
            <div className="space-y-1.5">
              {Object.entries(proof.conditions).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                      value
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30",
                    )}
                  >
                    {value ? "✓" : "✗"}
                  </div>
                  <span className="text-zinc-400 font-mono">{key.replace(/([A-Z])/g, "_$1").toLowerCase()}</span>
                  <span className={value ? "text-emerald-400" : "text-rose-400"}>{value ? "passed" : "failed"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* IPFS Reference */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 uppercase tracking-wide">IPFS Reference</label>
            <div className="font-mono text-xs text-zinc-400">{truncateHash(proof.cid, 12, 12)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
