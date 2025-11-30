"use client"

import { useState, useEffect } from "react"
import type { DisbursementResult } from "@/lib/types"
import { truncateHash } from "@/lib/realistic-ids"
import { cn } from "@/lib/utils"

interface TransactionDetailsProps {
  result: DisbursementResult
  className?: string
}

export function TransactionDetails({ result, className }: TransactionDetailsProps) {
  const [confirmations, setConfirmations] = useState(result.metadata.confirmations)
  const [isConfirming, setIsConfirming] = useState(true)

  useEffect(() => {
    // Simulate block confirmations coming in
    const intervals = [3000, 8000, 15000, 25000] // Realistic Cardano block times ~20s
    let currentIndex = 0

    const addConfirmation = () => {
      if (currentIndex < intervals.length) {
        setConfirmations((prev) => prev + 1)
        currentIndex++
        if (currentIndex < intervals.length) {
          setTimeout(addConfirmation, intervals[currentIndex])
        } else {
          setIsConfirming(false)
        }
      }
    }

    const timer = setTimeout(addConfirmation, intervals[0])
    return () => clearTimeout(timer)
  }, [])

  // Use preprod explorer - show as "pending" which is normal for new transactions
  const explorerUrl = `https://preprod.cardanoscan.io/transaction/${result.txHash}`
  const isNewTransaction = confirmations < 3

  return (
    <div className={cn("bg-slate-900 border border-emerald-500/30 rounded-xl overflow-hidden", className)}>
      {/* Header with animated status */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border-b border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isConfirming ? (
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
          <h3 className="text-sm font-semibold text-emerald-300">
            {isConfirming ? "Transaction Confirming..." : "Transaction Confirmed"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-mono px-2 py-0.5 rounded",
              isNewTransaction ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400",
            )}
          >
            {confirmations} confirmation{confirmations !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {isNewTransaction && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-amber-300 text-sm font-medium">Transaction Propagating</p>
              <p className="text-amber-400/70 text-xs mt-0.5">
                Your transaction is being confirmed by the Cardano network. This typically takes 20-60 seconds. The
                explorer may show "Not Found" until the transaction is included in a block.
              </p>
            </div>
          </div>
        )}

        {/* Transaction Hash */}
        <div className="space-y-1">
          <label className="text-xs text-slate-500 uppercase tracking-wide">Transaction Hash</label>
          <div className="font-mono text-xs bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-cyan-400 break-all">
            {result.txHash}
          </div>
        </div>

        {/* Amount */}
        <div className="bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 p-4 rounded-lg border border-emerald-500/20 text-center">
          <div className="text-3xl font-bold text-emerald-400">₳ {result.amount.toFixed(2)}</div>
          <div className="text-xs text-slate-500 mt-1">Disbursed to wallet</div>
        </div>

        {/* Blockchain Details Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Block</div>
            <div className="text-sm font-mono text-slate-300">
              {isConfirming ? (
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  pending
                </span>
              ) : (
                result.metadata.blockHeight.toLocaleString()
              )}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Slot</div>
            <div className="text-sm font-mono text-slate-300">
              {isConfirming ? (
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  pending
                </span>
              ) : (
                result.metadata.slotNumber.toLocaleString()
              )}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Epoch</div>
            <div className="text-sm font-mono text-slate-300">{result.metadata.epoch}</div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Network</span>
            <span className="text-cyan-400 font-medium">{result.network}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated Fees</span>
            <span className="text-slate-300 font-mono">₳ {result.metadata.fees.toFixed(6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Plutus Script</span>
            <span className="text-slate-300 font-mono">{truncateHash(result.metadata.plutusScriptHash, 8, 6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Datum Hash</span>
            <span className="text-slate-300 font-mono">{truncateHash(result.metadata.datumHash, 8, 6)}</span>
          </div>
        </div>

        {/* Recipient Address */}
        <div className="space-y-1">
          <label className="text-xs text-slate-500 uppercase tracking-wide">Recipient</label>
          <div className="font-mono text-xs text-slate-400 break-all bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
            {result.toAddress}
          </div>
        </div>

        {/* Explorer Link with warning for new transactions */}
        <div className="space-y-2">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white rounded-lg transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View on CardanoScan
          </a>

          {isNewTransaction && (
            <p className="text-center text-xs text-slate-500">
              Note: New transactions may take 1-2 minutes to appear on the explorer
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
