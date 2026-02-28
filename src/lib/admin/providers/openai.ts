import OpenAI from "openai";
import { toFile } from "openai";
import type { ImageProvider, GenerationRequest, EditRequest, GeneratedImage } from "./types";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function sizeToOpenAI(size?: string): "1024x1024" | "1024x1536" | "1536x1024" {
  switch (size) {
    case "portrait": return "1024x1536";
    case "landscape": return "1536x1024";
    default: return "1024x1024";
  }
}

export const openaiProvider: ImageProvider = {
  name: "openai",

  async generate(req: GenerationRequest): Promise<GeneratedImage> {
    const start = Date.now();
    try {
      const res = await getClient().images.generate({
        model: "gpt-image-1",
        prompt: req.prompt,
        size: sizeToOpenAI(req.size),
        quality: req.quality === "hd" ? "high" : "medium",
      });

      const b64 = res.data?.[0]?.b64_json;
      if (!b64) throw new Error("No image data in response");

      return {
        provider: "openai",
        base64: b64,
        mimeType: "image/png",
        durationMs: Date.now() - start,
        success: true,
      };
    } catch (err) {
      return {
        provider: "openai",
        base64: "",
        mimeType: "",
        durationMs: Date.now() - start,
        success: false,
        error: err instanceof Error ? err.message : "OpenAI generation failed",
      };
    }
  },

  async edit(req: EditRequest): Promise<GeneratedImage> {
    const start = Date.now();
    try {
      const imageFile = await toFile(Buffer.from(req.image, "base64"), "image.png", { type: "image/png" });
      const maskFile = await toFile(Buffer.from(req.mask, "base64"), "mask.png", { type: "image/png" });

      const res = await getClient().images.edit({
        model: "gpt-image-1",
        image: imageFile,
        mask: maskFile,
        prompt: req.prompt,
      });

      const b64 = res.data?.[0]?.b64_json;
      if (!b64) throw new Error("No image data in edit response");

      return {
        provider: "openai",
        base64: b64,
        mimeType: "image/png",
        durationMs: Date.now() - start,
        success: true,
      };
    } catch (err) {
      return {
        provider: "openai",
        base64: "",
        mimeType: "",
        durationMs: Date.now() - start,
        success: false,
        error: err instanceof Error ? err.message : "OpenAI edit failed",
      };
    }
  },
};
