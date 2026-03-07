import { v2 as cloudinary, type ResourceApiResponse } from "cloudinary";

export interface MediaImage {
  publicId: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  base64: string,
  filename: string,
  mimeType: string = "image/png"
): Promise<{ url: string; publicId: string }> {
  const dataUri = `data:${mimeType};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "canterbury-candles/products",
    public_id: filename,
    overwrite: false,
    unique_filename: true,
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function listImages(
  cursor?: string
): Promise<{ images: MediaImage[]; nextCursor: string | undefined }> {
  const result: ResourceApiResponse = await cloudinary.api.resources({
    type: "upload",
    prefix: "canterbury-candles/products/",
    max_results: 24,
    next_cursor: cursor || undefined,
  });

  const images: MediaImage[] = result.resources.map((r) => ({
    publicId: r.public_id,
    url: r.secure_url,
    format: r.format,
    width: r.width,
    height: r.height,
    bytes: r.bytes,
    createdAt: r.created_at,
  }));

  return { images, nextCursor: result.next_cursor };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { invalidate: true });
}

export function getTransformUrl(
  publicId: string,
  transforms: Record<string, string | number>
): string {
  return cloudinary.url(publicId, {
    transformation: [transforms],
    secure: true,
  });
}

/* ── Slot assignment (landing page image management) ── */

export async function assignSlot(publicId: string, slot: string): Promise<void> {
  // Clear any existing image with the same slot
  try {
    const existing = await cloudinary.search
      .expression(`folder:canterbury-candles/products AND context.slot="${slot}"`)
      .with_field("context")
      .max_results(10)
      .execute();

    for (const resource of existing.resources || []) {
      if (resource.public_id !== publicId) {
        // Remove slot context from old image
        await cloudinary.api.update(resource.public_id, {
          context: { slot: "" },
        });
      }
    }
  } catch {
    // No existing images with this slot — that's fine
  }

  // Assign the slot to the new image
  await cloudinary.api.update(publicId, {
    context: { slot },
  });

  // Invalidate cache
  slotCache.expiresAt = 0;
}

// Simple in-memory cache for slot images
const slotCache: { data: Record<string, string>; expiresAt: number } = {
  data: {},
  expiresAt: 0,
};

export async function getSlotImage(slot: string): Promise<string | null> {
  const all = await getSlotImages([slot]);
  return all[slot] || null;
}

export async function getSlotImages(
  slots: string[]
): Promise<Record<string, string>> {
  const now = Date.now();

  // Return cached data if fresh
  if (now < slotCache.expiresAt) {
    const result: Record<string, string> = {};
    for (const slot of slots) {
      if (slotCache.data[slot]) result[slot] = slotCache.data[slot];
    }
    if (Object.keys(result).length === slots.length) return result;
  }

  try {
    // Search all slot-assigned images in one query
    const searchResult = await cloudinary.search
      .expression("folder:canterbury-candles/products AND context.slot:*")
      .with_field("context")
      .max_results(50)
      .execute();

    const map: Record<string, string> = {};
    for (const resource of searchResult.resources || []) {
      const slotValue = resource.context?.custom?.slot;
      if (slotValue) {
        map[slotValue] = resource.secure_url;
      }
    }

    // Update cache
    slotCache.data = map;
    slotCache.expiresAt = now + 60_000; // 60 seconds TTL

    const result: Record<string, string> = {};
    for (const slot of slots) {
      if (map[slot]) result[slot] = map[slot];
    }
    return result;
  } catch (err) {
    console.error("[cloudinary] Failed to fetch slot images:", err);
    return {};
  }
}
