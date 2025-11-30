-- Aura Protocol Database Initialization Script
-- PostgreSQL 15+

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE loan_status AS ENUM (
    'pending',
    'proof_generated',
    'risk_assessed',
    'approved',
    'rejected',
    'disbursed',
    'completed',
    'defaulted'
);

CREATE TYPE risk_level AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

-- Loan Applications table
CREATE TABLE IF NOT EXISTS loan_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(128) NOT NULL,
    ipfs_cid VARCHAR(64) NOT NULL,
    data_hash VARCHAR(64) NOT NULL,
    encryption_nonce VARCHAR(32) NOT NULL,
    requested_amount DECIMAL(18, 6) NOT NULL,
    tenure_months INTEGER NOT NULL,
    purpose VARCHAR(64),
    status loan_status DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index on wallet_address for faster lookups
CREATE INDEX idx_loan_applications_wallet ON loan_applications(wallet_address);
CREATE INDEX idx_loan_applications_status ON loan_applications(status);

-- ZK Proofs table
CREATE TABLE IF NOT EXISTS zk_proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
    proof_hash VARCHAR(64) NOT NULL UNIQUE,
    proof_data TEXT NOT NULL,
    public_signals JSONB NOT NULL,
    is_valid BOOLEAN NOT NULL,
    income_sufficient BOOLEAN NOT NULL,
    dti_acceptable BOOLEAN NOT NULL,
    no_compliance_flags BOOLEAN NOT NULL,
    circuit_id VARCHAR(64) NOT NULL,
    circuit_version VARCHAR(16) NOT NULL,
    proving_scheme VARCHAR(16) DEFAULT 'groth16' NOT NULL,
    curve VARCHAR(16) DEFAULT 'bn254' NOT NULL,
    num_constraints INTEGER NOT NULL,
    num_public_inputs INTEGER NOT NULL,
    num_private_inputs INTEGER NOT NULL,
    proving_time_ms INTEGER NOT NULL,
    proof_size_bytes INTEGER NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_zk_proofs_hash ON zk_proofs(proof_hash);
CREATE INDEX idx_zk_proofs_application ON zk_proofs(application_id);

-- Loan Decisions table
CREATE TABLE IF NOT EXISTS loan_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
    risk_score DECIMAL(5, 2) NOT NULL,
    risk_level risk_level NOT NULL,
    aura_recommendation VARCHAR(32) NOT NULL,
    aura_max_amount DECIMAL(18, 6),
    aura_confidence DECIMAL(4, 3) NOT NULL,
    aura_reasoning TEXT,
    is_approved BOOLEAN NOT NULL,
    approved_amount DECIMAL(18, 6),
    interest_rate DECIMAL(5, 2),
    adjusted_tenure INTEGER,
    monthly_payment DECIMAL(18, 6),
    lender_explanation TEXT,
    aura_model_version VARCHAR(32) NOT NULL,
    lender_model_version VARCHAR(32) NOT NULL,
    decided_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_loan_decisions_application ON loan_decisions(application_id);

-- Loan Transactions table
CREATE TABLE IF NOT EXISTS loan_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
    tx_hash VARCHAR(64) NOT NULL UNIQUE,
    from_address VARCHAR(128) NOT NULL,
    to_address VARCHAR(128) NOT NULL,
    amount_ada DECIMAL(18, 6) NOT NULL,
    amount_lovelace BIGINT NOT NULL,
    network VARCHAR(16) NOT NULL,
    block_height INTEGER,
    slot_number INTEGER,
    epoch INTEGER,
    fees_ada DECIMAL(18, 6),
    plutus_script_hash VARCHAR(64),
    datum_hash VARCHAR(64),
    redeemer_data JSONB,
    confirmations INTEGER DEFAULT 0,
    is_confirmed BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_loan_transactions_hash ON loan_transactions(tx_hash);
CREATE INDEX idx_loan_transactions_application ON loan_transactions(application_id);

-- Proof Verifications table
CREATE TABLE IF NOT EXISTS proof_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proof_id UUID NOT NULL REFERENCES zk_proofs(id) ON DELETE CASCADE,
    is_verified BOOLEAN NOT NULL,
    verification_time_ms INTEGER NOT NULL,
    verifier_address VARCHAR(128),
    verifier_type VARCHAR(32) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_proof_verifications_proof ON proof_verifications(proof_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_loan_applications_updated_at
    BEFORE UPDATE ON loan_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (preprod)
INSERT INTO loan_applications (wallet_address, ipfs_cid, data_hash, encryption_nonce, requested_amount, tenure_months, purpose, status)
VALUES (
    'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp',
    'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'aGVsbG93b3JsZDEyMzQ1Ng==',
    2000.00,
    12,
    'personal',
    'pending'
);

COMMIT;
