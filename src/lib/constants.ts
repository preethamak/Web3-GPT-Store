export const CHAIN = "sepolia";
export const CHAIN_ID = 11155111; // Sepolia chain ID
export const CONTRACT_ADDRESS = "0xFa41D7a572152878F2bdBA7B4Dbe6D391042D4F9";

// Token ID mappings
export const TOKEN_IDS = {
  AUDITOR: 0,
  DEVELOPER: 1,
} as const;

// Model to Token ID mapping
export const MODEL_TO_TOKEN_ID: Record<string, number> = {
  'auditor': TOKEN_IDS.AUDITOR,
  'developer': TOKEN_IDS.DEVELOPER,
};
