import { createThirdwebClient } from "thirdweb";

let cachedClient: ReturnType<typeof createThirdwebClient> | null = null;

// Lazy initialization - only create client when actually needed
export const getClient = () => {
  if (cachedClient) return cachedClient;
  
  const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;
  
  if (!clientId) {
    console.error('Missing NEXT_PUBLIC_TEMPLATE_CLIENT_ID - set it in Vercel dashboard or .env');
    throw new Error('No client ID provided. Set NEXT_PUBLIC_TEMPLATE_CLIENT_ID in environment variables.');
  }
  
  cachedClient = createThirdwebClient({
    clientId: clientId,
  });
  
  return cachedClient;
};

// For backward compatibility, export a direct client (will throw if env var missing)
export const client = (() => {
  try {
    return getClient();
  } catch (e) {
    // Return a placeholder object that has the right shape
    // This prevents module load errors while still failing when actually used
    console.warn('Client will be unavailable - missing NEXT_PUBLIC_TEMPLATE_CLIENT_ID');
    return null as any;
  }
})();

// Price configuration
export const NFT_PRICE_ETH = "0.001"; // 0.001 ETH per NFT
