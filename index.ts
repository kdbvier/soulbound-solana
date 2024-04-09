import {
  keypairIdentity,
  Metaplex,
  sol,
  toBigNumber,
} from "@metaplex-foundation/js";
// import type { TokenMetadata } from "@solana/spl-token-metadata";
import { TokenMetadata } from "@solana/spl-token-metadata";
import {
  TOKEN_2022_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createInitializeNonTransferableMintInstruction,
  createInitializeMintInstruction,
  getMintLen,
  ExtensionType,
  tokenMetadataInitialize,
  TYPE_SIZE,
  LENGTH_SIZE,
  createInitializeMetadataPointerInstruction,
} from "@solana/spl-token";
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createInitializeInstruction,
  pack,
  createUpdateFieldInstruction,
  createRemoveKeyInstruction,
} from "@solana/spl-token-metadata";
import base58 from "bs58";
import * as dotenv from "dotenv";
dotenv.config();
const privateKey = process.env.PRIVATE_KEY;

async function createSoulBond() {
  const connection = new Connection(
    "https://api.devnet.solana.com/",
    "confirmed"
  );
  const secretKey = base58.decode(`${privateKey}`);
  const payer = Keypair.fromSecretKey(secretKey);
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  const metadata: TokenMetadata = {
    mint: mint,
    name: "xxxxxxx",
    symbol: "SMBL",
    uri: "",
    additionalMetadata: [],
  };
  const mintLen = getMintLen([
    ExtensionType.NonTransferable,
    ExtensionType.MetadataPointer,
  ]);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length + 1000;
  const lamports = await connection.getMinimumBalanceForRentExemption(
    // mintLen
    mintLen + metadataLen
  );
  console.log("lamports: ", lamports);
  // return;
  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeNonTransferableMintInstruction(mint, TOKEN_2022_PROGRAM_ID),
    createInitializeMetadataPointerInstruction(
      mint,
      payer.publicKey,
      mint,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mint,
      0,
      payer.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeInstruction({
      metadata: mint,
      name: "xxxxxxx",
      symbol: "MSBT",
      uri: "",
      programId: TOKEN_2022_PROGRAM_ID,
      mint,
      mintAuthority: payer.publicKey,
      updateAuthority: payer.publicKey,
    }),
    createUpdateFieldInstruction({
      metadata: mint,
      updateAuthority: payer.publicKey,
      programId: TOKEN_2022_PROGRAM_ID,
      field: "image",
      value:
        "https://lh3.googleusercontent.com/vG0A5p-vA5ovAJkPYNRDFV3s1RuVIoVPVi4sqwUWqU1hB4g_LCLCxtGOu2ProLsbqz77kMvs7SbxsAPsHu4X0G2sFcfD7QfM8rc=k",
    }),
    createUpdateFieldInstruction({
      metadata: mint,
      updateAuthority: payer.publicKey,
      programId: TOKEN_2022_PROGRAM_ID,
      field: "name",
      value: "yyyyyyyyyy",
    })
  );
  const transactionHash = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, mintKeypair]
  );
  console.log("transactionHash: ", transactionHash);
}
// createSoulBond();

async function mintNft() {
  const connection = new Connection(
    "https://api.devnet.solana.com/",
    "confirmed"
  );
  const secretKey = base58.decode(`${privateKey}`);
  const payer = Keypair.fromSecretKey(secretKey);
  const mintPublicKey = new PublicKey(
    "C8Dd6tbcyabYT4e9jcNqDdMrnjwRxsDoaJf4KmRHQy66"
  );
  const associatedToken = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mintPublicKey,
    payer.publicKey,
    undefined,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  const signature = await mintTo(
    connection,
    payer,
    mintPublicKey,
    associatedToken.address,
    payer,
    1,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log("signature: ", signature);
}

mintNft();
//
