import { Connection, clusterApiUrl } from '@solana/web3.js';

const SOLANA_RPC_URL = process.env.VITE_HELIUS_RPC_URL || clusterApiUrl('mainnet-beta');
const HELIUS_API_KEY = process.env.VITE_HELIUS_API_KEY;
const TOKEN_MINT = process.env.VITE_TOKEN_MINT || 'HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS';

export const solanaConnection = new Connection(SOLANA_RPC_URL, 'confirmed');

export const solanaConfig = {
  rpcUrl: SOLANA_RPC_URL,
  heliusApiKey: HELIUS_API_KEY,
  tokenMint: TOKEN_MINT,
  network: 'mainnet-beta' as const,
};

export const getHeliusRpcUrl = () => {
  if (!HELIUS_API_KEY) {
    console.warn('Helius API key not configured, using public RPC');
    return SOLANA_RPC_URL;
  }
  return `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
};