# Adstock Token Transparency Hub

A comprehensive onchain verification and real-time token transparency platform for Solana tokens built with Kit SDK, Helius DAS API, and React.

## Features

### Verification Tab
- Trust Score (0-100) based on onchain metrics
- Mint & freeze authority status
- Live metadata from Helius

### Insights Tab (NEW)
- Market momentum analysis
- Liquidity scoring
- Volatility risk assessment
- Holder distribution analysis
- Transaction velocity tracking
- AI-powered trust indicators
- Risk warnings & recommendations

### Live Links
- One-click access to 8+ platforms
- Solscan, Explorer, Jupiter, Raydium, Birdeye

### Embed Tools
- Verified badge HTML
- Solana Pay URI
- Birdeye widget

### Transactions
- Real-time tx feed
- Last 10 onchain txs

### Share
- Verification link
- Twitter/Telegram sharing
- Listing submissions

## Tech Stack

**Backend**: Express.js + TypeScript + Solana Web3.js + Helius DAS
**Frontend**: React 18 + Tailwind CSS + Zustand
**Network**: Solana Mainnet

## Installation

```bash
git clone https://github.com/ethanchanvendor-gif/Adstock-metadata.git
cd Adstock-metadata
npm install
cp .env.example .env
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/token/metadata/:mint` - Token metadata
- `GET /api/token/verify/:mint` - Full verification
- `GET /api/token/transactions/:mint` - Recent transactions
- `GET /api/token/insights/:mint` - AI insights & analysis

## Token

Mint: `HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS`
Network: Solana Mainnet
Status: Live ✓
