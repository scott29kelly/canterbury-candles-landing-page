export type ProviderName = "gemini";

export interface GenerationRequest {
  prompt: string;
  referenceImage?: string;        // base64-encoded reference image
  referenceImageMimeType?: string; // e.g. "image/png"
}

export interface EditRequest {
  image: string;   // base64-encoded image
  prompt: string;
}

export interface GeneratedImage {
  provider: ProviderName;
  base64: string;
  mimeType: string;
  durationMs: number;
  success: boolean;
  error?: string;
}

export interface ImageProvider {
  name: ProviderName;
  generate(req: GenerationRequest): Promise<GeneratedImage>;
  edit(req: EditRequest): Promise<GeneratedImage>;
}
