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
