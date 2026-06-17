import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getSignatureFromTransaction,
  type Instruction,
  type TransactionSigner,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit';
import { 
  updateMetadata,
  fetchDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata-kit';
import { createSolanaRpc, createSolanaRpcSubscriptions, generateKeyPairSigner } from '@solana/kit';

// Helius RPC endpoint
const HELIUS_API_KEY = '067b7074-56c0-4c76-bdd5-9360b0a2cbae';
const rpc = createSolanaRpc(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`);
const rpcSubscriptions = createSolanaRpcSubscriptions(`wss://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`);

async function sendAndConfirm(options: {
  instructions: Instruction[];
  payer: TransactionSigner;
}) {
  const { instructions, payer } = options;
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(payer.address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  );

  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

  const sendAndConfirmTx = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  await sendAndConfirmTx(signedTransaction, { commitment: 'confirmed' });

  return getSignatureFromTransaction(signedTransaction);
}

async function updateTokenMetadata(
  mintAddress: string,
  authority: TransactionSigner,
  updates: {
    name?: string;
    symbol?: string;
    uri?: string;
    sellerFeeBasisPoints?: number;
  }
) {
  const asset = await fetchDigitalAsset(rpc, mintAddress);

  const updateIx = await updateMetadata({
    mint: mintAddress,
    authority,
    payer: authority,
    data: {
      name: updates.name ?? asset.metadata.name,
      symbol: updates.symbol ?? asset.metadata.symbol,
      uri: updates.uri ?? asset.metadata.uri,
      sellerFeeBasisPoints: updates.sellerFeeBasisPoints ?? asset.metadata.sellerFeeBasisPoints,
      creators: asset.metadata.creators,
      collection: asset.metadata.collection,
      uses: asset.metadata.uses,
    },
  });

  const signature = await sendAndConfirm({
    instructions: [updateIx],
    payer: authority,
  });

  console.log('Metadata updated:', signature);
  return signature;
}

// Usage
async function main() {
  const authority = await generateKeyPairSigner();
  
  await updateTokenMetadata(
    'HTEjWCCRSUnp2nHdiAEoVPJDDaWYcRozmZUCRsREBAGS',
    authority,
    {
      name: 'Adstock',
      uri: 'https://example.com/adstock-metadata.json',
    }
  );
}

main().catch(console.error);