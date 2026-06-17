# API Reference & Solana Integration Guide - AdStock Token Hub

## 🔌 Backend API Endpoints

### Base URL
```
Development:  http://localhost:3001
Production:   https://your-domain.com
```

---

## Health Check

### GET `/api/health`
Check backend status

**Request:**
```bash
curl http://localhost:3001/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-17T02:40:00.000Z"
}
```

**Status Codes:**
- `200` - Backend healthy
- `503` - Backend unavailable

---

## Token Metadata

### GET `/api/token/metadata/:mint`
Fetch token metadata from Helius DAS API

**Parameters:**
```
mint (string, required) - Token mint address
```

**Example Request:**
```bash
curl "http://localhost:3001/api/token/metadata/HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mint": "HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS",
    "name": "AdStock",
    "symbol": "ADS",
    "decimals": 6,
    "uri": "https://example.com/metadata.json",
    "supply": "1000000000.000000"
  }
}
```

**Status Codes:**
- `200` - Success
- `500` - Metadata fetch error

---

## Token Verification

### GET `/api/token/verify/:mint`
Full token verification with trust score calculation

**Parameters:**
```
mint (string, required) - Token mint address
```

**Example Request:**
```bash
curl "http://localhost:3001/api/token/verify/HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "metadata": {
      "mint": "HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS",
      "name": "AdStock",
      "symbol": "ADS",
      "decimals": 6,
      "uri": "https://example.com/metadata.json",
      "supply": "1000000000.000000"
    },
    "authorities": {
      "mintAuthority": null,
      "freezeAuthority": null,
      "isInitialized": true,
      "lamports": 2039280
    },
    "holders": 287,
    "trustScore": 90,
    "isVerified": true
  }
}
```

**Trust Score Calculation:**
```
Base Score: 50 points

+ 20 points if mint authority is revoked
+ 20 points if freeze authority is revoked
+ 10 points if contract is initialized

Maximum Score: 100
```

**Status Codes:**
- `200` - Verification successful
- `500` - Verification error

---

## Token Insights (AI Analysis)

### GET `/api/token/insights/:mint`
Advanced AI-powered token analysis

**Parameters:**
```
mint (string, required) - Token mint address
```

**Example Request:**
```bash
curl "http://localhost:3001/api/token/insights/HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "marketMomentum": "bullish",
    "liquidityScore": 85,
    "volatilityRisk": "low",
    "holderDistribution": "distributed",
    "transactionVelocity": "highly_active",
    "trustIndicators": [
      "Mint authority revoked - supply is fixed",
      "Freeze authority revoked - tokens cannot be frozen",
      "Good holder distribution"
    ],
    "riskWarnings": [],
    "recommendations": [
      "Token shows strong transparency indicators - safe for long-term holding",
      "Excellent liquidity and holder distribution"
    ]
  }
}
```

**Field Definitions:**

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| marketMomentum | string | bullish, neutral, bearish | Based on 24h transaction volume |
| liquidityScore | number | 0-100 | Percentage of successful transactions |
| volatilityRisk | string | low, medium, high | Risk assessment based on tx velocity |
| holderDistribution | string | centralized, balanced, distributed | Concentration analysis |
| transactionVelocity | string | slow, active, highly_active | Transaction activity level |

**Status Codes:**
- `200` - Insights generated successfully
- `500` - Insight generation error

---

## Transactions

### GET `/api/token/transactions/:mint`
Fetch recent token transactions

**Parameters:**
```
mint (string, required) - Token mint address
limit (number, optional) - Max transactions to return (default: 10, max: 100)
```

**Example Request:**
```bash
curl "http://localhost:3001/api/token/transactions/HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS?limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "signature": "5h6XWSWe2dBelqwqoZz3wxWEkv5iZnhHaQ4VeYcYiCDr9z1Q4...",
      "timestamp": 1718616000000,
      "type": "success",
      "blockTime": 1718616000,
      "amount": "1000000"
    },
    {
      "signature": "4aG5UPVd1cGelrqwqoZz3wxWEkv5iZnhHaQ4VeYcYiCDr9z1Q...",
      "timestamp": 1718615000000,
      "type": "success",
      "blockTime": 1718615000,
      "amount": "500000"
    }
  ]
}
```

**Status Codes:**
- `200` - Transactions retrieved successfully
- `500` - Transaction fetch error

---

## 🔗 Solana Integration

### Web3.js Integration

#### Import & Initialize
```typescript
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

// Connect to Solana mainnet
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

// Or use Helius RPC for better performance
const heliusConnection = new Connection(
  `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
  'confirmed'
);
```

#### Get Account Info
```typescript
const mint = new PublicKey('HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS');
const accountInfo = await connection.getAccountInfo(mint);

console.log('Lamports:', accountInfo?.lamports);
console.log('Owner:', accountInfo?.owner.toString());
console.log('Executable:', accountInfo?.executable);
```

#### Get Token Supply
```typescript
import { getMint } from '@solana/spl-token';

const mintInfo = await getMint(connection, mint);
console.log('Decimals:', mintInfo.decimals);
console.log('Supply:', mintInfo.supply.toString());
console.log('Mint Authority:', mintInfo.mintAuthority?.toString());
console.log('Freeze Authority:', mintInfo.freezeAuthority?.toString());
```

#### Get Token Holders
```typescript
// Using Helius API for efficient holder lookup
const holders = await heliusConnection.getTokenLargestAccounts(mint);

holders.value.forEach((account) => {
  console.log('Address:', account.address.toString());
  console.log('Amount:', account.uiAmount);
});
```

---

### Helius SDK Integration

#### Setup Helius
```typescript
import { Helius } from 'helius-sdk';

const helius = new Helius(process.env.VITE_HELIUS_API_KEY);
```

#### Get Asset (Token Metadata)
```typescript
const asset = await helius.rpc.getAsset({
  id: 'HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS',
});

console.log('Name:', asset.content?.metadata?.name);
console.log('Symbol:', asset.content?.metadata?.symbol);
console.log('Image:', asset.content?.links?.image);
console.log('Decimals:', asset.decimals);
console.log('Verified:', asset.verified);
```

#### Search Assets
```typescript
const results = await helius.rpc.searchAssets({
  tokenType: 'fungible',
  limit: 100,
  page: 1,
});

console.log('Total found:', results.total);
console.log('Items:', results.items);
```

#### Get Signature Details
```typescript
const signatures = await connection.getSignaturesForAddress(mint);

signatures.forEach((sig) => {
  console.log('Signature:', sig.signature);
  console.log('Block Time:', sig.blockTime);
  console.log('Error:', sig.err); // null if successful
});
```

---

### SPL Token Integration

#### Get Token Accounts
```typescript
import { getTokenAccountsByOwner, TokenAccountsFilter } from '@solana/spl-token';

const wallet = new PublicKey('wallet_address_here');

const tokenAccounts = await getTokenAccountsByOwner(
  connection,
  wallet,
  {
    mint: new PublicKey('HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS'),
  }
);

tokenAccounts.value.forEach((account) => {
  console.log('Token Account:', account.pubkey.toString());
  console.log('Balance:', account.account.data.parsed.info.tokenAmount.uiAmount);
});
```

#### Create Token Account
```typescript
import { createAssociatedTokenAccountIdempotent } from '@solana/spl-token';

const tokenAccount = await createAssociatedTokenAccountIdempotent(
  connection,
  payer,
  mint,
  owner
);

console.log('Token Account Created:', tokenAccount.toString());
```

---

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React)                 │
│  (localhost:5173)                        │
│                                          │
│  - Verification Tab                      │
│  - Insights Tab                          │
│  - Live Links Tab                        │
│  - Embed Tools Tab                       │
│  - Transactions Tab                      │
│  - Share Tab                             │
└────────────────┬────────────────────────┘
                 │
                 │ HTTP Requests
                 ▼
┌─────────────────────────────────────────┐
│    Backend (Express + TypeScript)        │
│    (localhost:3001)                      │
│                                          │
│  - Token Metadata Service               │
│  - Transaction Service                  │
│  - Insight Service                      │
│  - Token Routes                         │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
    ┌─────────┐      ┌──────────┐
    │ Helius  │      │ Solana   │
    │ DAS API │      │ RPC      │
    │         │      │          │
    │ Token   │      │ Account  │
    │ Metadata│      │ Info     │
    │ Holders │      │ Txs      │
    └─────────┘      └──────────┘
         │                │
         └────────┬───────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Solana Mainnet │
         │  Blockchain     │
         └─────────────────┘
```

---

## 🔐 Security Best Practices

### API Security
```typescript
// 1. Use environment variables for API keys
const apiKey = process.env.VITE_HELIUS_API_KEY;

// 2. Never expose secrets in frontend
// Keep sensitive operations in backend only

// 3. Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// 4. Input validation
import { param, validationResult } from 'express-validator';

router.get('/verify/:mint', [
  param('mint')
    .isLength({ min: 43, max: 44 })
    .matches(/^[A-HJ-NP-Z0-9]+$/) // Base58 validation
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});

// 5. CORS configuration
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));
```

### Frontend Security
```typescript
// 1. Sanitize user input
import DOMPurify from 'dompurify';

const clean = DOMPurify.sanitize(userInput);

// 2. Use HTTPS in production
// Configured via server/proxy

// 3. Content Security Policy
// Configure in server headers

// 4. No sensitive data in localStorage
// Use httpOnly cookies for auth tokens (future)

// 5. XSS prevention
// React auto-escapes by default, use dangerouslySetInnerHTML cautiously
```

---

## 📈 Performance Optimization

### Caching Strategy
```typescript
// Cache token metadata for 5 minutes
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();

function getCachedData(key, fetcher) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }
  return fetcher();
}

// Redis for production (optional)
import redis from 'redis';
const client = redis.createClient();

async function getCachedWithRedis(key, fetcher) {
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetcher();
  await client.setEx(key, 300, JSON.stringify(data)); // 5 min TTL
  return data;
}
```

### Query Optimization
```typescript
// Use Helius batch methods for better performance
const batchResults = await helius.rpc.getAssetBatch({
  ids: ['mint1', 'mint2', 'mint3'],
});

// Minimize RPC calls
const [metadata, holders, txs] = await Promise.all([
  getTokenMetadataViaHelius(mint),
  getTokenHolders(mint),
  getEnrichedTransactions(mint, 100),
]);
```

---

## ⚠️ Error Handling

### Backend Error Codes
```typescript
// 200 - Success
res.json({ success: true, data: {} });

// 400 - Bad Request (invalid mint address)
res.status(400).json({ success: false, error: 'Invalid mint address' });

// 404 - Not Found
res.status(404).json({ success: false, error: 'Token not found' });

// 429 - Rate Limited
res.status(429).json({ success: false, error: 'Rate limit exceeded' });

// 500 - Server Error
res.status(500).json({ success: false, error: 'Internal server error' });

// 503 - Service Unavailable (RPC down)
res.status(503).json({ success: false, error: 'Solana RPC unavailable' });
```

### Frontend Error Handling
```typescript
try {
  const response = await fetch(`/api/token/verify/${mint}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  
  setVerification(data.data);
} catch (error) {
  console.error('Error:', error);
  setError('Failed to fetch token data. Please try again.');
}
```

---

## 📚 Resources

### Solana Documentation
- [Solana Documentation](https://docs.solana.com)
- [Web3.js Reference](https://solana-labs.github.io/solana-web3.js)
- [SPL Token Program](https://spl.solana.com/token)
- [Metaplex Token Metadata](https://developers.metaplex.com/token-metadata)

### Helius Documentation
- [Helius API Docs](https://docs.helius.xyz)
- [DAS API Guide](https://docs.helius.xyz/api-reference/das-api)
- [RPC Methods](https://docs.helius.xyz/solana-rpc-methods)

### GitHub Repositories
- [Solana Labs](https://github.com/solana-labs/solana)
- [Solana Program Library](https://github.com/solana-labs/solana-program-library)
- [Metaplex Program Library](https://github.com/metaplex-foundation/mpl-token-metadata)

---

## 🧪 Testing API Endpoints

### cURL Examples
```bash
# Health check
curl http://localhost:3001/api/health

# Get metadata
curl "http://localhost:3001/api/token/metadata/HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS"

# Get verification
curl "http://localhost:3001/api/token/verify/HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS"

# Get insights
curl "http://localhost:3001/api/token/insights/HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS"

# Get transactions
curl "http://localhost:3001/api/token/transactions/HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS?limit=10"
```

### Postman Collection
```json
{
  "info": {
    "name": "AdStock Token API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/health"
      }
    },
    {
      "name": "Token Verification",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/token/verify/HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS"
      }
    }
  ]
}
```

---

## 🚀 Production Deployment Checklist

- [x] All endpoints tested
- [x] Error handling implemented
- [x] Rate limiting configured
- [x] API keys secured
- [x] CORS configured
- [x] Helius DAS API integrated
- [x] Solana Web3.js integrated
- [x] Caching strategy implemented
- [x] Monitoring setup
- [x] Documentation complete

---

**AdStock Token Hub - API Reference Complete** ✨

**Token Mint**: `HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS`
**Network**: Solana Mainnet
**Status**: 🟢 Production Ready
