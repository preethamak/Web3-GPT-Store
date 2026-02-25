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

// IMPORTANT: Don't export eager client - use getClient() function instead
// This ensures client initialization only happens at runtime, not during static generation

// Price configuration
export const NFT_PRICE_ETH = "0.001"; // 0.001 ETH per NFT
