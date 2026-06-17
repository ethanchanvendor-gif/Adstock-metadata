import { publicKey } from '@solana/web3.js';
import { solanaConnection, solanaConfig } from '../config/solana';
import axios from 'axios';

interface TokenMetadata {
  mint: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  uri?: string;
  supply?: string;
  holders?: number;
  isFrozen?: boolean;
  mintAuthority?: string | null;
  freezeAuthority?: string | null;
}

export async function getTokenMetadataViaHelius(mint: string): Promise<TokenMetadata> {
  try {
    const response = await axios.post(
      `https://mainnet.helius-rpc.com/?api-key=${process.env.VITE_HELIUS_API_KEY}`,
      {
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAsset',
        params: {
          id: mint,
        },
      }
    );

    const asset = response.data?.result;
    if (!asset) throw new Error('Asset not found');

    return {
      mint,
      name: asset.content?.metadata?.name,
      symbol: asset.content?.metadata?.symbol,
      decimals: asset.decimals,
      uri: asset.content?.links?.image,
      supply: asset.supply?.display_value,
    };
  } catch (error) {
    console.error('Helius metadata fetch failed:', error);
    return { mint };
  }
}

export async function getMintAccountInfo(mint: string) {
  try {
    const mintPubkey = publicKey(mint);
    const accountInfo = await solanaConnection.getAccountInfo(mintPubkey);
    
    if (!accountInfo) {
      throw new Error(`Mint account ${mint} not found`);
    }

    const parsedData = {
      mintAuthority: accountInfo.owner?.toString(),
      isInitialized: accountInfo.data.length > 0,
      lamports: accountInfo.lamports,
    };

    return parsedData;
  } catch (error) {
    console.error('Error fetching mint info:', error);
    throw error;
  }
}

export async function getTokenHolders(mint: string): Promise<number> {
  try {
    const response = await axios.post(
      `https://mainnet.helius-rpc.com/?api-key=${process.env.VITE_HELIUS_API_KEY}`,
      {
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getTokenAccounts',
        params: {
          mint,
          limit: 10000,
        },
      }
    );

    return response.data?.result?.token_accounts?.length || 0;
  } catch (error) {
    console.error('Error fetching holder count:', error);
    return 0;
  }
}

export function calculateTrustScore(metadata: any): number {
  let score = 50;

  if (metadata.mintAuthority === null) score += 20;
  if (metadata.freezeAuthority === null) score += 20;
  if (metadata.isInitialized) score += 10;

  return Math.min(score, 100);
}

export default {
  getTokenMetadataViaHelius,
  getMintAccountInfo,
  getTokenHolders,
  calculateTrustScore,
};