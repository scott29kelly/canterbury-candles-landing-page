import OpenAI, { toFile } from "openai";
import type { ImageProvider, GenerationRequest, EditRequest, GeneratedImage } from "./types";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

/** Convert a base64 string to a Buffer */
function base64ToBuffer(b64: string): Buffer {
  return Buffer.from(b64, "base64");
}

export const openaiProvider: ImageProvider = {
  name: "gpt-image",

  async generate(_req: GenerationRequest): Promise<GeneratedImage> {
    return {
      provider: "gpt-image",
      base64: "",
      mimeType: "",
      durationMs: 0,
      success: false,
      error: "GPT Image generation not supported — use Gemini for generation",
    };
  },

  async edit(req: EditRequest): Promise<GeneratedImage> {
    const start = Date.now();
    try {
      const client = getClient();

      const imageFile = await toFile(base64ToBuffer(req.image), "image.png", {
        type: "image/png",
      });

      const params: OpenAI.Images.ImageEditParams = {
        model: "gpt-image-1",
        image: imageFile,
        prompt: req.prompt,
        size: "auto" as "1024x1024", // TS workaround — API accepts "auto" for GPT image models
        response_format: "b64_json",
      };

      if (req.mask) {
        const maskFile = await toFile(base64ToBuffer(req.mask), "mask.png", {
          type: "image/png",
        });
        params.mask = maskFile;
      }

      const response = await client.images.edit(params);

      const imageData = response.data?.[0];
      if (!imageData?.b64_json) {
        throw new Error("No image data in GPT Image response");
      }

      return {
        provider: "gpt-image",
        base64: imageData.b64_json,
        mimeType: "image/png",
        durationMs: Date.now() - start,
        success: true,
      };
    } catch (err) {
      return {
        provider: "gpt-image",
        base64: "",
        mimeType: "",
        durationMs: Date.now() - start,
        success: false,
        error: err instanceof Error ? err.message : "GPT Image edit failed",
      };
    }
  },
};
