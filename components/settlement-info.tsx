"use client"

export function SettlementInfo() {
  return (
    <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-3">
      <h4 className="font-semibold text-purple-900 dark:text-purple-100">⛓️ On-Chain Settlement</h4>
      <div className="text-sm text-purple-800 dark:text-purple-200 space-y-2">
        <p>
          <strong>Cardano Network:</strong> Transactions are submitted to Cardano{" "}
          {process.env.NEXT_PUBLIC_CARDANO_NETWORK || "preprod"} network.
        </p>
        <p>
          <strong>Direct Disbursement:</strong> Approved ADA is transferred directly to your connected wallet via
          Cardano's settlement layer.
        </p>
        <p>
          <strong>Transaction Verification:</strong> All disbursements are verified on-chain and can be tracked using
          the transaction hash.
        </p>
        <p>
          <strong>Immutable Record:</strong> Loan agreements are recorded on the blockchain via the associated ZK proof
          hash.
        </p>
      </div>
    </div>
  )
}
