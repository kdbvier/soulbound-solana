import {
  generateSigner,
  percentAmount,
  publicKey,
  PublicKey,
} from "@metaplex-foundation/umi";
import {
  createV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";

const umi = createUmi("https://api.devnet.solana.com/");
const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
);
