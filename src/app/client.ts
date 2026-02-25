import { createThirdwebClient } from "thirdweb";

// Get client ID from environment - safe for build time
const getClientId = () => {
  const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;
  // During build, return placeholder to avoid build errors
  if (typeof window === 'undefined' && !clientId) {
    return 'build-time-placeholder';
  }
  if (!clientId) {
    throw new Error('No client ID provided. Set NEXT_PUBLIC_TEMPLATE_CLIENT_ID.');
  }
  return clientId;
};

export const client = createThirdwebClient({
  clientId: getClientId(),
});

// Price configuration
export const NFT_PRICE_ETH = "0.001"; // 0.001 ETH per NFT
