import { v2 as cloudinary } from "cloudinary";

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
    overwrite: true,
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
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
