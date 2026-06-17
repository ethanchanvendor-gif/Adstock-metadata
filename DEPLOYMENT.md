# DEPLOYMENT GUIDE - AdStock Token Transparency Hub

## 🚀 Complete Deployment Instructions

### Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment (Vercel/AWS/DigitalOcean)](#cloud-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Helius SDK Integration](#helius-sdk-integration)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
```bash
- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn >= 3.0.0
- Git >= 2.30.0
- Docker (optional, for containerized deployment)
```

### Verify Installation
```bash
node --version    # v18.0.0 or higher
npm --version     # 9.0.0 or higher
git --version     # 2.30.0 or higher
```

### Required API Keys
```
- VITE_HELIUS_API_KEY (from https://dev.helius.xyz)
- VERCEL_TOKEN (for Vercel deployment)
- GITHUB_TOKEN (for CI/CD)
```

---

## Local Development

### Step 1: Clone & Install
```bash
# Clone repository
git clone https://github.com/ethanchanvendor-gif/Adstock-metadata.git
cd Adstock-metadata

# Install all dependencies
npm install

# Install frontend dependencies
cd src/frontend
npm install
cd ../..
```

### Step 2: Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your keys
nano .env
```

**Required .env variables:**
```env
# Helius API Configuration
VITE_HELIUS_API_KEY=your_helius_api_key_here
VITE_HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_helius_api_key_here

# Solana Configuration
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_SOLANA_NETWORK=mainnet-beta

# Token Configuration (AdStock)
VITE_TOKEN_MINT=HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS

# Server Configuration
PORT=3001
NODE_ENV=development

# Optional Analytics
VITE_ANALYTICS_ENABLED=true
```

### Step 3: Get Helius API Key

1. Visit [https://dev.helius.xyz](https://dev.helius.xyz)
2. Sign up / Log in
3. Create new API key
4. Copy key to `.env` file
5. Note: Free tier includes 50,000 requests/month

### Step 4: Start Development Server
```bash
# Start both backend & frontend
npm run dev

# Or start separately:
# Terminal 1 - Backend (localhost:3001)
npm run dev:backend

# Terminal 2 - Frontend (localhost:5173)
cd src/frontend && npm run dev
```

### Step 5: Verify Setup
- Backend: http://localhost:3001/api/health
- Frontend: http://localhost:5173
- Token Page: http://localhost:5173 (should show AdStock data)

---

## Docker Deployment

### Create Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production

EXPOSE 3001 5173

CMD ["npm", "start"]
```

### Create docker-compose.yml
```yaml
version: '3.8'

services:
  adstock-hub:
    build: .
    ports:
      - "3001:3001"
      - "5173:5173"
    environment:
      - VITE_HELIUS_API_KEY=${HELIUS_API_KEY}
      - VITE_TOKEN_MINT=HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS
      - PORT=3001
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Build & Run with Docker
```bash
# Build image
docker build -t adstock-transparency:latest .

# Run container
docker run -d \
  -p 3001:3001 \
  -p 5173:5173 \
  -e VITE_HELIUS_API_KEY=your_key_here \
  -e VITE_TOKEN_MINT=HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS \
  --name adstock-hub \
  adstock-transparency:latest

# Or with docker-compose
docker-compose up -d

# Check logs
docker-compose logs -f adstock-hub
```

---

## Cloud Deployment

### Vercel Deployment (Recommended for Frontend)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Connect to Vercel
1. Visit https://vercel.com/import
2. Select your GitHub repository
3. Configure environment variables:
   - `VITE_HELIUS_API_KEY`
   - `VITE_TOKEN_MINT`
   - `VITE_SOLANA_NETWORK`
4. Click "Deploy"

#### Step 3: Add Environment Variables
```
VITE_HELIUS_API_KEY=your_key_here
VITE_TOKEN_MINT=HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS
VITE_SOLANA_NETWORK=mainnet-beta
API_URL=https://your-backend-url.com
```

### AWS EC2 Deployment

```bash
# 1. Launch EC2 Instance
# - Ubuntu 22.04 LTS
# - t3.medium (recommended)
# - Open ports 80, 443, 3001

# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 3. Install dependencies
sudo apt update
sudo apt install -y nodejs npm git nginx

# 4. Clone repo
git clone https://github.com/ethanchanvendor-gif/Adstock-metadata.git
cd Adstock-metadata

# 5. Install dependencies
npm install
cd src/frontend && npm install && cd ../..

# 6. Build
npm run build

# 7. Setup PM2
npm install -g pm2
pm2 start npm --name "adstock-backend" -- run start

# 8. Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/default
```

**Nginx Configuration:**
```nginx
server {
    listen 80 default_server;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### DigitalOcean App Platform

```bash
# 1. Create app.yaml
name: adstock-transparency
services:
- name: backend
  github:
    repo: ethanchanvendor-gif/Adstock-metadata
  build_command: npm install && npm run build:backend
  run_command: npm run start
  envs:
  - key: VITE_HELIUS_API_KEY
    value: ${HELIUS_API_KEY}
  - key: VITE_TOKEN_MINT
    value: HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS
  http_port: 3001

# 2. Deploy
doctl apps create --spec app.yaml
```

---

## Environment Configuration

### Development (.env)
```env
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_SOLANA_NETWORK=mainnet-beta
VITE_HELIUS_API_KEY=dev_key_here
VITE_TOKEN_MINT=HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS
PORT=3001
NODE_ENV=development
```

### Production (.env.production)
```env
VITE_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_key
VITE_SOLANA_NETWORK=mainnet-beta
VITE_HELIUS_API_KEY=prod_key_here
VITE_TOKEN_MINT=HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS
PORT=3001
NODE_ENV=production
VITE_ANALYTICS_ENABLED=true
```

---

## Helius SDK Integration

### Install Helius SDK
```bash
npm install helius-sdk
```

### Enhanced Backend with Helius SDK
```typescript
// src/backend/services/heliusService.ts
import { Helius } from 'helius-sdk';

const helius = new Helius(process.env.VITE_HELIUS_API_KEY);

export async function getTokenMetadataWithHelius(mint: string) {
  try {
    // Using Helius SDK for enhanced data
    const asset = await helius.rpc.getAsset({
      id: mint,
    });

    return {
      mint,
      name: asset.content?.metadata?.name,
      symbol: asset.content?.metadata?.symbol,
      decimals: asset.decimals,
      image: asset.content?.links?.image,
      description: asset.content?.metadata?.description,
      creators: asset.creators,
      verified: asset.verified,
    };
  } catch (error) {
    console.error('Helius SDK Error:', error);
    throw error;
  }
}

export async function getTokenAccountsByOwner(owner: string) {
  try {
    const accounts = await helius.rpc.getTokenAccounts({
      owner,
      mint: process.env.VITE_TOKEN_MINT,
    });

    return accounts;
  } catch (error) {
    console.error('Error fetching token accounts:', error);
    throw error;
  }
}

export async function getTokenHolders(mint: string) {
  try {
    const holders = await helius.rpc.getTokenAccounts({
      mint,
      limit: 10000,
    });

    return holders;
  } catch (error) {
    console.error('Error fetching holders:', error);
    return [];
  }
}

export async function searchAssets(query: {
  tokenType?: string;
  limit?: number;
  page?: number;
}) {
  try {
    const results = await helius.rpc.searchAssets(query);
    return results;
  } catch (error) {
    console.error('Search assets error:', error);
    throw error;
  }
}
```

### Use in Routes
```typescript
import { getTokenMetadataWithHelius, getTokenHolders } from '../services/heliusService';

router.get('/metadata/:mint', async (req, res) => {
  try {
    const metadata = await getTokenMetadataWithHelius(req.params.mint);
    const holders = await getTokenHolders(req.params.mint);
    
    res.json({
      success: true,
      data: { metadata, holders },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## Monitoring & Maintenance

### Health Checks
```bash
# Check backend
curl http://localhost:3001/api/health

# Check token verification
curl http://localhost:3001/api/token/verify/HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS
```

### PM2 Monitoring (Production)
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "adstock" -- run start

# Monitor
pm2 monit

# View logs
pm2 logs adstock

# Restart
pm2 restart adstock

# Stop
pm2 stop adstock
```

### Performance Monitoring
```bash
# Check bundle size
npm run build
npm install -g bundlesize
bundlesize

# Check dependencies
npm audit
npm outdated
```

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update all
npm update

# Update specific package
npm install package@latest
```

---

## Troubleshooting

### Issue: "VITE_HELIUS_API_KEY not found"
```bash
# Solution 1: Check .env file exists
ls -la .env

# Solution 2: Reload environment
source .env
echo $VITE_HELIUS_API_KEY

# Solution 3: Verify key format
# Key should be: your_api_key_string (no quotes in .env)
```

### Issue: "Cannot fetch token metadata"
```bash
# Check Helius connectivity
curl -X POST https://mainnet.helius-rpc.com/?api-key=YOUR_KEY \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"1","method":"getHealth"}'

# Verify token mint exists
curl -X GET https://solscan.io/api/account/HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS
```

### Issue: "Port 3001 already in use"
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or use different port
PORT=3002 npm run start
```

### Issue: "Frontend can't reach backend"
```bash
# Check backend is running
curl http://localhost:3001/api/health

# Check CORS configuration
# Verify backend allows origin in cors() middleware

# Check API endpoint in frontend
# Should be: /api/token/... (relative path)
```

### Issue: "Token data not updating"
```bash
# Check Helius rate limits
# Free tier: 50,000 requests/month
# Upgrade at: https://dev.helius.xyz

# Check network status
curl https://api.mainnet-beta.solana.com -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"1","method":"getHealth"}'
```

---

## Performance Optimization

### Frontend
```bash
# Code splitting
npm run build  # Vite auto-optimizes

# Analyze bundle
npm install -g vite-plugin-visualizer
```

### Backend
```bash
# Enable compression
npm install compression

# Add to index.ts
import compression from 'compression';
app.use(compression());
```

### Caching Strategy
```typescript
// Cache token metadata for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
const cache = new Map();

export function getCachedMetadata(mint: string) {
  const cached = cache.get(mint);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}
```

---

## Production Checklist

- [ ] Environment variables configured
- [ ] HTTPS/SSL certificate installed
- [ ] Database backups configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Logging configured
- [ ] Monitoring setup
- [ ] CI/CD pipeline active
- [ ] DNS pointing to server
- [ ] Security headers configured
- [ ] Performance testing completed
- [ ] Load testing completed

---

## Support & Resources

- **Helius Docs**: https://docs.helius.xyz
- **Solana Docs**: https://docs.solana.com
- **GitHub Issues**: https://github.com/ethanchanvendor-gif/Adstock-metadata/issues
- **Email**: ethanchanvendor@gmail.com

---

**Deployed with ❤️ for AdStock Token (HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS)**
