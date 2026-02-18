import { GoogleGenAI } from "@google/genai";
import { GeneratedImageResponse } from "../types";

// Initialize the client
// The API key is guaranteed to be in process.env.API_KEY per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCarouselImage = async (prompt: string): Promise<GeneratedImageResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      // Config for image generation 
      config: {
        imageConfig: {
           aspectRatio: "1:1", // Square textures work best for carousel cards
        }
      }
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("No content generated");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType || 'image/png',
        };
      }
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};
