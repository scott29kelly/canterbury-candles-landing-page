import { fal } from "@fal-ai/client";
import type { ImageProvider, GenerationRequest, EditRequest, GeneratedImage } from "./types";

let configured = false;
function ensureConfig() {
  if (!configured) {
    fal.config({ credentials: () => process.env.FAL_KEY! });
    configured = true;
  }
}

function sizeToFal(size?: string): string {
  switch (size) {
    case "portrait": return "portrait_4_3";
    case "landscape": return "landscape_4_3";
    default: return "square";
  }
}

async function urlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const mimeType = res.headers.get("content-type") || "image/png";
  return {
    base64: Buffer.from(buffer).toString("base64"),
    mimeType,
  };
}

export const seedreamProvider: ImageProvider = {
  name: "seedream",

  async generate(req: GenerationRequest): Promise<GeneratedImage> {
    ensureConfig();
    const start = Date.now();
    try {
      const result = await fal.subscribe("fal-ai/bytedance/seedream/v4.5/text-to-image", {
        input: {
          prompt: req.prompt,
          image_size: sizeToFal(req.size),
          num_images: 1,
        },
      }) as { data: { images: { url: string }[] } };

      const imageUrl = result.data?.images?.[0]?.url;
      if (!imageUrl) throw new Error("No image URL in Seedream response");

      const { base64, mimeType } = await urlToBase64(imageUrl);

      return {
        provider: "seedream",
        base64,
        mimeType,
        durationMs: Date.now() - start,
        success: true,
      };
    } catch (err) {
      return {
        provider: "seedream",
        base64: "",
        mimeType: "",
        durationMs: Date.now() - start,
        success: false,
        error: err instanceof Error ? err.message : "Seedream generation failed",
      };
    }
  },

  async edit(req: EditRequest): Promise<GeneratedImage> {
    ensureConfig();
    const start = Date.now();
    try {
      // Upload image to fal temporary storage
      const imageBlob = new Blob([Buffer.from(req.image, "base64")], { type: "image/png" });
      const imageUrl = await fal.storage.upload(new File([imageBlob], "image.png", { type: "image/png" }));

      const result = await fal.subscribe("fal-ai/bytedance/seedream/v4.5/edit", {
        input: {
          image_urls: [imageUrl],
          prompt: req.prompt,
        },
      }) as { data: { images: { url: string }[] } };

      const resultUrl = result.data?.images?.[0]?.url;
      if (!resultUrl) throw new Error("No image URL in Seedream edit response");

      const { base64, mimeType } = await urlToBase64(resultUrl);

      return {
        provider: "seedream",
        base64,
        mimeType,
        durationMs: Date.now() - start,
        success: true,
      };
    } catch (err) {
      return {
        provider: "seedream",
        base64: "",
        mimeType: "",
        durationMs: Date.now() - start,
        success: false,
        error: err instanceof Error ? err.message : "Seedream edit failed",
      };
    }
  },
};
