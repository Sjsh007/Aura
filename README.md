# Legend - Cardano Decentralized Lending dApp

A production-ready MVP implementing decentralized lending with privacy-preserving KYC verification on Cardano.

## Architecture Overview

### 1. User Layer (Next.js Frontend)
- Wallet connection: Nami & Eternl wallet support
- Loan application form with client-side validation
- Real-time status tracking through the lending pipeline

### 2. Privacy Layer
- **Client-side encryption**: AES-256-GCM encryption of sensitive KYC data
- **IPFS integration**: Encrypted data stored on decentralized IPFS
- **ZK-style proofs**: Deterministic eligibility verification without exposing raw data
  - Conditions checked:
    - Income ≥ 3× monthly repayment
    - Debt-to-income ratio < 40%
    - No compliance red flags
  - Outputs: Proof hash, validity flag, condition results

### 3. Intelligence Layer
- **Aura Agent**: Risk assessment based on:
  - Proof validity and condition checks
  - Income-to-loan ratio analysis
  - Risk score (0-100) calculation
  - Recommendation: approve, reduce_amount, reject
  
- **Lender Agent**: Final loan decision with:
  - Approval status determination
  - Interest rate calculation based on risk
  - Tenure adjustment
  - Human-readable explanation

### 4. Settlement Layer
- **Cardano on-chain disbursement**: Direct ADA transfer via Cardano testnet/preprod
- **Transaction verification**: On-chain confirmation tracking
- **Immutable record**: Loan agreement hash stored for audit trail

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Wallet Integration**: Nami & Eternl (mock for MVP)
- **Cardano**: Blockfrost API integration ready
- **Encryption**: Web Crypto API (AES-256-GCM)
- **Storage**: IPFS (mock for MVP)

## Project Structure

\`\`\`
app/
  ├── page.tsx              # Main landing page
  ├── layout.tsx            # Root layout
  ├── globals.css           # Global styles
  └── api/
      ├── proof/generate    # ZK proof generation
      ├── agents/
      │   ├── aura         # Risk assessment agent
      │   └── lender       # Loan decision agent
      ├── settlement/
      │   ├── disburse     # ADA disbursement
      │   └── verify       # Transaction verification
      └── ipfs/upload      # IPFS data upload

components/
  ├── wallet-provider.tsx   # Wallet context & connection
  ├── wallet-button.tsx     # Wallet UI component
  ├── loan-form.tsx         # Main application form
  ├── privacy-notice.tsx    # Privacy disclosure
  ├── settlement-info.tsx   # Settlement layer info
  └── status-tracker.tsx    # Application status tracker

lib/
  ├── types.ts              # TypeScript interfaces
  ├── crypto-utils.ts       # Encryption utilities
  ├── proof-logic.ts        # ZK proof generation
  ├── agents.ts             # Aura & Lender agents
  ├── cardano-service.ts    # Cardano integration
  ├── ipfs-service.ts       # IPFS operations
  ├── validation.ts         # Input validation
  └── encryption-service.ts # Web Crypto operations
\`\`\`

## Data Flow

1. **User submits loan application** → Form validation
2. **Client encrypts data** → IPFS upload
3. **Backend generates proof** → Eligibility verification
4. **Aura Agent analyzes** → Risk scoring
5. **Lender Agent decides** → Approval terms
6. **User confirms** → Decision acceptance
7. **Settlement layer processes** → On-chain ADA transfer
8. **Transaction verified** → Completion notification

## Environment Variables

\`\`\`bash
NEXT_PUBLIC_CARDANO_NETWORK=preprod          # Cardano network (testnet/preprod/mainnet)
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=xxx        # Blockfrost API key
IPFS_TOKEN=xxx                                # IPFS/web3.storage token
LENDER_PRIVATE_KEY=xxx                        # Server-side lender wallet key
\`\`\`

## Running Locally

\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

## API Endpoints

### Proof Generation
- **POST** `/api/proof/generate`
- Input: Loan application data, IPFS CID
- Output: ZK proof with validity & conditions

### Aura Assessment
- **POST** `/api/agents/aura`
- Input: ZK proof, financial data
- Output: Risk score, recommendation, max amount

### Lender Decision
- **POST** `/api/agents/lender`
- Input: Aura assessment, requested terms
- Output: Approval status, interest rate, explanation

### Settlement Disbursement
- **POST** `/api/settlement/disburse`
- Input: Wallet address, amount, decision ID
- Output: Transaction hash, status

### Transaction Verification
- **GET** `/api/settlement/verify?txHash=xxx`
- Output: Verification status, timestamp

## Security Considerations

1. **Private Data**: Never stored unencrypted on servers
2. **Proof Verification**: Hash-based validation prevents tampering
3. **Wallet Authentication**: Connected wallet address is trusted identifier
4. **On-Chain Record**: Immutable blockchain record of disbursements
5. **Rate Limiting**: To be implemented for production

## Future Enhancements

- [ ] Real Cardano SDK integration (Lucid/Mesh)
- [ ] Actual web3.storage IPFS integration
- [ ] Plutus smart contract for automated disbursement
- [ ] Multi-signature lender pool
- [ ] Real-time credit score integration
- [ ] Loan repayment tracking
- [ ] Insurance pool for defaults
- [ ] DAO governance for lender parameters
- [ ] Collateral management for larger loans
- [ ] Cross-chain settlement bridges

## Testing

### Manual Testing Flow

1. Connect wallet (Nami or Eternl mock)
2. Fill loan application:
   - Monthly income: 5000 ADA
   - Existing debt: 1000 ADA
   - Requested: 2000 ADA
   - Tenure: 12 months
3. Observe proof generation
4. Review risk assessment
5. Accept loan terms
6. Complete on-chain disbursement

### Test Scenarios

- **Approved**: Income 5000, Debt 1000, Request 2000, No flags
- **Conditional**: Income 3000, Debt 2000, Request 2000, No flags
- **Rejected**: Income 2000, Debt 1000, Request 5000, Has flags

## Deployment

### Vercel Deployment

\`\`\`bash
# Push to GitHub
git push origin main

# Deploy from Vercel dashboard
# Set environment variables in Vercel project settings
# Deployment automatically triggers on push
\`\`\`

### Cardano Mainnet Migration

1. Update `NEXT_PUBLIC_CARDANO_NETWORK=mainnet`
2. Generate mainnet lender wallet
3. Store `LENDER_PRIVATE_KEY` in production env
4. Test on preprod first
5. Deploy with updated environment

## Legal & Compliance

⚠️ **Hackathon MVP Disclaimer**

This MVP is for demonstration purposes in a hackathon context. For production:
- Implement AML/KYC compliance
- Add regulatory audit trails
- Implement data retention policies
- Add proper error handling & monitoring
- Implement rate limiting & DDoS protection
- Add logging for compliance audits
- Get legal review for lending terms

## Support & Documentation

- Cardano Docs: https://docs.cardano.org
- Blockfrost API: https://blockfrost.io
- Nami Wallet: https://namiwallet.io
- Eternl Wallet: https://eternlwallet.io

## License

MIT License - See LICENSE file for details
