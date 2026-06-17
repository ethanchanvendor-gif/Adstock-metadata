import { solanaConnection } from '../config/solana';
import axios from 'axios';
import { publicKey } from '@solana/web3.js';

interface Transaction {
  signature: string;
  timestamp: number;
  type: string;
  from?: string;
  to?: string;
  amount?: string;
  blockTime?: number;
}

export async function getRecentTransactions(mint: string, limit: number = 100): Promise<Transaction[]> {
  try {
    const mintPubkey = publicKey(mint);
    const signatures = await solanaConnection.getSignaturesForAddress(mintPubkey, { limit });

    const transactions: Transaction[] = signatures.map((sig) => ({
      signature: sig.signature,
      timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
      type: sig.err ? 'failed' : 'success',
      blockTime: sig.blockTime || undefined,
    }));

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function getEnrichedTransactions(
  mint: string,
  limit: number = 10
): Promise<Transaction[]> {
  try {
    const response = await axios.post(
      `https://mainnet.helius-rpc.com/?api-key=${process.env.VITE_HELIUS_API_KEY}`,
      {
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'searchAssets',
        params: {
          tokenType: 'fungible',
          compressed: false,
          limit,
        },
      }
    );

    const transactions: Transaction[] = response.data?.result?.items?.map((item: any) => ({
      signature: item.id,
      timestamp: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
      type: 'transfer',
      amount: item.supply?.display_value,
    })) || [];

    return transactions;
  } catch (error) {
    console.error('Error fetching enriched transactions:', error);
    return [];
  }
}

export default {
  getRecentTransactions,
  getEnrichedTransactions,
};