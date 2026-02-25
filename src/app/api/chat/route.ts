import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getSystemPrompt } from '@/lib/prompts';
import { getContract, readContract } from 'thirdweb';
import { sepolia } from 'thirdweb/chains';
import { client } from '@/app/client';
import { CONTRACT_ADDRESS, MODEL_TO_TOKEN_ID } from '@/lib/constants';

export const runtime = 'edge';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, modelId, address, tokenId } = await req.json() as { 
      messages: ChatMessage[]; 
      modelId: string;
      address?: string;
      tokenId?: number;
    };

    // Validate required parameters
    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Wallet address is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get tokenId from modelId if not provided
    const nftTokenId = tokenId ?? MODEL_TO_TOKEN_ID[modelId];
    
    // Skip NFT verification for basic model (tokenId -1)
    if (nftTokenId !== undefined && nftTokenId !== -1) {
      // Verify NFT ownership using thirdweb SDK
      try {
        const contract = getContract({
          client,
          chain: sepolia,
          address: CONTRACT_ADDRESS,
        });

        // Check balance of the NFT
        const balance = await readContract({
          contract,
          method: "function balanceOf(address account, uint256 id) view returns (uint256)",
          params: [address, BigInt(nftTokenId)],
        });

        // Check if user owns at least one of this NFT
        if (balance === 0n) {
          return new Response(
            JSON.stringify({ 
              error: 'You do not own this AI model NFT. Please purchase it from the marketplace first.',
              tokenId: nftTokenId 
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } catch (error) {
        console.error('NFT ownership verification error:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to verify NFT ownership. Please ensure you are connected to Sepolia network.',
            details: error instanceof Error ? error.message : 'Unknown error'
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (nftTokenId === undefined && modelId !== 'basic') {
      return new Response(
        JSON.stringify({ error: 'Invalid model ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Google API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the appropriate system prompt
    const systemPrompt = getSystemPrompt(modelId);

    // Configure the model
    const model = google('gemini-3-flash-preview');

    // Stream the response
    const result = streamText({
      model,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
      maxRetries: 2,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
