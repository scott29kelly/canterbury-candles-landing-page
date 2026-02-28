import { GoogleGenAI, type Part } from "@google/genai";
import type { ImageProvider, GenerationRequest, EditRequest, GeneratedImage } from "./types";

function getClient() {
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });
}

export const geminiProvider: ImageProvider = {
  name: "gemini",

  async generate(req: GenerationRequest): Promise<GeneratedImage> {
    const start = Date.now();
    try {
      const ai = getClient();
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: req.prompt,
        config: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts) throw new Error("No response parts from Gemini");

      const imagePart = parts.find((p: Part) => p.inlineData);
      if (!imagePart?.inlineData) throw new Error("No image in Gemini response");

      return {
        provider: "gemini",
        base64: imagePart.inlineData.data as string,
        mimeType: (imagePart.inlineData.mimeType as string) || "image/png",
        durationMs: Date.now() - start,
        success: true,
      };
    } catch (err) {
      return {
        provider: "gemini",
        base64: "",
        mimeType: "",
        durationMs: Date.now() - start,
        success: false,
        error: err instanceof Error ? err.message : "Gemini generation failed",
      };
    }
  },

  async edit(req: EditRequest): Promise<GeneratedImage> {
    const start = Date.now();
    try {
      const ai = getClient();

      // Gemini uses multimodal conversation for editing — no explicit mask support.
      // We send the image + text prompt describing the desired edit.
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: req.image,
                  mimeType: "image/png",
                },
              },
              {
                text: `Edit this image: ${req.prompt}`,
              },
            ],
          },
        ],
        config: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts) throw new Error("No response parts from Gemini edit");

      const imagePart = parts.find((p: Part) => p.inlineData);
      if (!imagePart?.inlineData) throw new Error("No image in Gemini edit response");

      return {
        provider: "gemini",
        base64: imagePart.inlineData.data as string,
        mimeType: (imagePart.inlineData.mimeType as string) || "image/png",
        durationMs: Date.now() - start,
        success: true,
      };
    } catch (err) {
      return {
        provider: "gemini",
        base64: "",
        mimeType: "",
        durationMs: Date.now() - start,
        success: false,
        error: err instanceof Error ? err.message : "Gemini edit failed",
      };
    }
  },
};
