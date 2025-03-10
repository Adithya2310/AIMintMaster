import OpenAI from "openai";
import { getAllListedNFTs } from "./contractUtils";

const token = import.meta.env.VITE_OPENAI_4o_ACCESS_KEY;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

const client = new OpenAI({ 
  baseURL: endpoint, 
  apiKey: token,
  dangerouslyAllowBrowser: true
});

export async function getNFTRecommendations(userQuery: string) {
  try {
    // Get all listed NFTs
    const listedNFTs = await getAllListedNFTs();
    
    const systemPrompt = `You are an NFT recommendation assistant. Analyze the following NFTs and the user's query to recommend the most suitable NFTs. Only respond with the NFT IDs that best match the query. Format your response as a comma-separated list of IDs.

Available NFTs:
${listedNFTs.map(nft => `ID: ${nft.id}
Name: ${nft.name}
Description: ${nft.description}
Price: ${nft.price} SONIC
`).join('\n')}`;

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuery }
      ],
      temperature: 0.7,
      top_p: 1.0,
      max_tokens: 1000,
      model: modelName
    });

    const recommendedIds = response.choices[0].message.content?.split(',').map(id => id.trim()) || [];
    return listedNFTs.filter(nft => recommendedIds.includes(nft.id));
  } catch (error) {
    console.error("Error getting NFT recommendations:", error);
    throw error;
  }
} 