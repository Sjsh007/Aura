# Aura Protocol - Privacy-Preserving Decentralized Lending on Cardano

<div align="center">
  <img src="aura-frontend/public/aura-logo.svg" alt="Aura Protocol" width="120" height="120" />
  <h3>Zero-Knowledge Lending for the Decentralized Future</h3>
  <p>Privacy-preserving credit assessment powered by ZK proofs and AI agents on Cardano</p>
</div>

---

## Architecture Overview

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AURA PROTOCOL ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                           USER LAYER                                      │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │   │
│  │  │   Next.js   │───▶│   Nami/     │    │   IPFS      │                   │   │
│  │  │   Frontend  │    │   Eternl    │    │   Vault     │                   │   │
│  │  └──────┬──────┘    └─────────────┘    └──────┬──────┘                   │   │
│  │         │                                      │                          │   │
│  │         │         encrypts private data        │                          │   │
│  │         └──────────────────────────────────────┘                          │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                       │                                          │
│                                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                          PRIVACY LAYER                                    │   │
│  │                                                                           │   │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │   │
│  │  │                     ZK CIRCUIT (Groth16/BN254)                      │ │   │
│  │  │  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐       │ │   │
│  │  │  │ Income Check  │    │  DTI Check    │    │  Compliance   │       │ │   │
│  │  │  │  ≥3x payment  │    │    <40%       │    │    Check      │       │ │   │
│  │  │  └───────────────┘    └───────────────┘    └───────────────┘       │ │   │
│  │  └─────────────────────────────────────────────────────────────────────┘ │   │
│  │                                   │                                       │   │
│  │                                   ▼                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │   │
│  │  │                        PROOF GENERATOR                              │ │   │
│  │  │  • 4096 R1CS constraints  • ~800ms proving time  • 192 byte proof  │ │   │
│  │  └─────────────────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                       │                                          │
│                                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                        INTELLIGENCE LAYER                                 │   │
│  │  ┌─────────────────────────┐      ┌─────────────────────────┐            │   │
│  │  │       AURA AGENT        │─────▶│      LENDER AGENT       │            │   │
│  │  │  • Risk Assessment      │      │  • Final Decision       │            │   │
│  │  │  • Score: 0-100         │      │  • Interest Rate        │            │   │
│  │  │  • Recommendation       │      │  • Loan Terms           │            │   │
│  │  │  • v2.3.1               │      │  • v1.8.2               │            │   │
│  │  └─────────────────────────┘      └─────────────────────────┘            │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                       │                                          │
│                                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                         SETTLEMENT LAYER                                  │   │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │   │
│  │  │                      PLUTUS SMART CONTRACT                          │ │   │
│  │  │  • Verify ZK proof on-chain    • Execute disbursement               │ │   │
│  │  │  • Record loan datum           • Immutable audit trail              │ │   │
│  │  └─────────────────────────────────────────────────────────────────────┘ │   │
│  │                                   │                                       │   │
│  │                                   ▼                                       │   │
│  │                        ┌─────────────────────┐                            │   │
│  │                        │   ADA DISBURSEMENT  │                            │   │
│  │                        │   via Blockfrost    │                            │   │
│  │                        └─────────────────────┘                            │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
\`\`\`

## Project Structure

\`\`\`
aura-protocol/
├── aura-frontend/                 # Next.js 14+ Frontend Application
│   ├── app/
│   │   ├── api/                   # API Routes (Next.js Route Handlers)
│   │   │   ├── proof/generate/    # ZK proof generation endpoint
│   │   │   ├── agents/
│   │   │   │   ├── aura/          # Aura risk assessment
│   │   │   │   └── lender/        # Lender decision engine
│   │   │   ├── settlement/
│   │   │   │   ├── disburse/      # ADA disbursement
│   │   │   │   └── verify/        # Transaction verification
│   │   │   └── ipfs/upload/       # IPFS data upload
│   │   ├── page.tsx               # Main application page
│   │   ├── layout.tsx             # Root layout with providers
│   │   └── globals.css            # Global styles & animations
│   ├── components/
│   │   ├── loan-form.tsx          # Loan application form
│   │   ├── processing-pipeline.tsx # Visual pipeline tracker
│   │   ├── proof-details.tsx      # ZK proof certificate display
│   │   ├── transaction-details.tsx # Blockchain transaction info
│   │   ├── wallet-provider.tsx    # Cardano wallet context
│   │   └── wallet-button.tsx      # Wallet connection UI
│   ├── lib/
│   │   ├── proof-logic.ts         # ZK proof generation logic
│   │   ├── agents.ts              # AI agent implementations
│   │   ├── cardano-service.ts     # Cardano/Blockfrost integration
│   │   ├── crypto-utils.ts        # Encryption utilities
│   │   ├── realistic-ids.ts       # Cryptographic ID generators
│   │   └── types.ts               # TypeScript interfaces
│   ├── hooks/
│   │   └── use-loan-pipeline.ts   # Loan processing orchestration
│   └── package.json
│
├── aura-backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py                # FastAPI application entry
│   │   ├── core/
│   │   │   ├── config.py          # Pydantic settings
│   │   │   ├── database.py        # SQLAlchemy async setup
│   │   │   └── redis.py           # Redis cache client
│   │   ├── models/
│   │   │   ├── loan.py            # Loan database models
│   │   │   └── proof.py           # ZK proof models
│   │   ├── schemas/
│   │   │   ├── loan.py            # Request/response schemas
│   │   │   ├── proof.py           # Proof schemas
│   │   │   └── settlement.py      # Settlement schemas
│   │   ├── services/
│   │   │   ├── zk_prover.py       # Groth16 proof generation
│   │   │   ├── agents.py          # Aura & Lender AI agents
│   │   │   ├── cardano.py         # Cardano blockchain service
│   │   │   └── ipfs.py            # IPFS storage service
│   │   └── api/v1/
│   │       └── endpoints/
│   │           ├── proof.py       # Proof endpoints
│   │           ├── agents.py      # Agent endpoints
│   │           ├── settlement.py  # Settlement endpoints
│   │           └── ipfs.py        # IPFS endpoints
│   ├── scripts/
│   │   └── init.sql               # Database initialization
│   ├── tests/
│   │   ├── test_proof.py          # ZK proof tests
│   │   └── test_agents.py         # Agent tests
│   ├── Dockerfile                 # Multi-stage Docker build
│   ├── docker-compose.yml         # Full stack deployment
│   ├── requirements.txt           # Python dependencies
│   └── prometheus.yml             # Monitoring config
│
└── README.md                      # This file
\`\`\`

## Technology Stack

### Frontend (aura-frontend)
| Technology | Purpose |
|------------|---------|
| Next.js 14+ | React framework with App Router |
| TypeScript | Type-safe development |
| Tailwind CSS v4 | Utility-first styling |
| Web Crypto API | Client-side AES-256-GCM encryption |
| Cardano Wallet API | Nami/Eternl wallet integration |

### Backend (aura-backend)
| Technology | Purpose |
|------------|---------|
| FastAPI | High-performance async API |
| SQLAlchemy 2.0 | Async PostgreSQL ORM |
| Redis | Proof caching & rate limiting |
| py_ecc | BN254 elliptic curve operations |
| PyCardano | Cardano transaction building |
| Blockfrost | Cardano blockchain API |
| Prometheus | Metrics & monitoring |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| PostgreSQL 15 | Primary database |
| Redis 7 | Caching layer |
| IPFS (Kubo) | Decentralized storage |
| Docker | Containerization |
| Grafana | Metrics visualization |

## Zero-Knowledge Proof System

### Circuit Specifications
- **Proving Scheme**: Groth16
- **Curve**: BN254 (alt_bn128)
- **Constraints**: 4,096 R1CS
- **Public Inputs**: 5 (condition flags + timestamp)
- **Private Inputs**: 8 (financial data)
- **Proof Size**: ~192 bytes
- **Proving Time**: ~800ms
- **Verification Time**: ~10ms

### Eligibility Conditions
The ZK circuit proves the following conditions without revealing actual values:

1. **Income Sufficiency**: `monthly_income ≥ 3 × monthly_repayment`
2. **DTI Threshold**: `(existing_debt + loan_amount) / (monthly_income × 12) < 0.4`
3. **Compliance**: `no_compliance_flags == true`

## AI Agent System

### Aura Agent (Risk Assessment)
\`\`\`
Input:  ZK proof validity, condition flags, financial ratios
Output: Risk score (0-100), risk level, recommendation, max amount
Model:  XGBoost classifier (v2.3.1)
\`\`\`

### Lender Agent (Decision Engine)
\`\`\`
Input:  Aura assessment, requested terms
Output: Approval status, interest rate, adjusted terms
Model:  Gradient boosting regressor (v1.8.2)
\`\`\`

## Quick Start

### Frontend Development
\`\`\`bash
cd aura-frontend
npm install
npm run dev
# Open http://localhost:3000
\`\`\`

### Backend Development
\`\`\`bash
cd aura-backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
# API docs at http://localhost:8000/api/docs
\`\`\`

### Full Stack (Docker)
\`\`\`bash
cd aura-backend
cp .env.example .env
# Edit .env with your credentials
docker-compose up -d
\`\`\`

## Environment Variables

### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_CARDANO_NETWORK=preprod
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=your_project_id
IPFS_TOKEN=your_web3storage_token
LENDER_PRIVATE_KEY=ed25519_sk1...
\`\`\`

### Backend (.env)
\`\`\`env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/aura_db
REDIS_URL=redis://localhost:6379/0
BLOCKFROST_PROJECT_ID=preprodXXXX
LENDER_PRIVATE_KEY=ed25519_sk1...
JWT_SECRET=your-secret-key
\`\`\`

## API Endpoints

### ZK Proof Generation
\`\`\`
POST /api/v1/proof/generate
\`\`\`
Generates Groth16 proof for loan eligibility.

### Risk Assessment
\`\`\`
POST /api/v1/agents/aura/assess
\`\`\`
Performs AI-powered risk assessment.

### Loan Decision
\`\`\`
POST /api/v1/agents/lender/decide
\`\`\`
Returns final lending decision with terms.

### Disbursement
\`\`\`
POST /api/v1/settlement/disburse
\`\`\`
Executes on-chain ADA transfer.

### Transaction Verification
\`\`\`
GET /api/v1/settlement/verify/{tx_hash}
\`\`\`
Verifies transaction confirmation status.

## Security Considerations

1. **Data Privacy**: All sensitive financial data is encrypted client-side with AES-256-GCM before transmission
2. **Zero-Knowledge**: Proof generation reveals only eligibility status, not underlying data
3. **On-Chain Audit**: All disbursements recorded immutably on Cardano blockchain
4. **Rate Limiting**: API endpoints protected against abuse
5. **Key Management**: Private keys stored securely in environment variables

## Deployment

### Vercel (Frontend)
\`\`\`bash
cd aura-frontend
vercel --prod
\`\`\`

### Docker (Backend)
\`\`\`bash
cd aura-backend
docker-compose -f docker-compose.yml up -d
\`\`\`

## Testing

### Frontend
\`\`\`bash
cd aura-frontend
npm run test
\`\`\`

### Backend
\`\`\`bash
cd aura-backend
pytest -v
\`\`\`

## Monitoring

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)
- **API Health**: http://localhost:8000/health
- **API Readiness**: http://localhost:8000/ready

## License

MIT License - See LICENSE file for details.

## Support

- Documentation: [docs.aura-protocol.io](https://docs.aura-protocol.io)
- Discord: [discord.gg/aura-protocol](https://discord.gg/aura-protocol)
- Twitter: [@AuraProtocol](https://twitter.com/AuraProtocol)

---

<div align="center">
  <p>Built with ❤️ for the Cardano ecosystem</p>
  <p>Hackathon MVP - Not for production use</p>
</div>
