import { GoogleGenAI } from "@google/genai";
import { Restaurant } from "../types";

// Initialize Gemini Client
// @ts-ignore - Env variable is injected by the runtime environment
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const findRestaurantsNearLocation = async (postcode: string): Promise<{ text: string, restaurants: Restaurant[] }> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Explicit prompt to get a good list based on postcode
    const prompt = `
      Find 10 highly-rated restaurants near ${postcode}, UK.
      Focus on a diverse mix of cuisines (e.g., British, Italian, Indian, Asian Fusion).
      For each restaurant, give a very brief 1-sentence description of what makes it special.
      
      Important: Ensure you use the Google Maps tool to find real places.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        // Note: We removed the retrievalConfig with latLng because we are searching by text location (postcode)
      }
    });

    const text = response.text || "No details found.";
    
    // Extract grounding chunks to build the structured list
    const candidates = response.candidates?.[0];
    const chunks = candidates?.groundingMetadata?.groundingChunks || [];
    
    const restaurants: Restaurant[] = [];
    const seenTitles = new Set<string>();

    chunks.forEach((chunk, index) => {
      // We prioritize Maps chunks
      if (chunk.maps) {
        const title = chunk.maps.title;
        const uri = chunk.maps.uri;
        
        if (title && uri && !seenTitles.has(title)) {
          seenTitles.add(title);
          restaurants.push({
            id: `place-${index}-${Date.now()}`,
            name: title,
            uri: uri,
            address: '' // Maps grounding chunk usually doesn't give address directly in the chunk object, primarily title/uri
          });
        }
      }
      // Fallback to Web chunks if Maps fails
      else if (chunk.web) {
        const title = chunk.web.title;
        const uri = chunk.web.uri;
        if (title && uri && !seenTitles.has(title)) {
           // Basic heuristic to filter out generic search pages like "Top 10..."
           if (!title.includes("Best Restaurants") && !title.includes("Top 10")) {
              seenTitles.add(title);
              restaurants.push({
                id: `web-${index}-${Date.now()}`,
                name: title,
                uri: uri
              });
           }
        }
      }
    });

    return { text, restaurants };

  } catch (error) {
    console.error("Error fetching from Gemini:", error);
    throw new Error("Failed to find restaurants. Please try again.");
  }
};