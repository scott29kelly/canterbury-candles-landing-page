export type ProviderName = "openai" | "gemini" | "seedream";

export interface GenerationRequest {
  prompt: string;
  size?: string;
  quality?: string;
}

export interface EditRequest {
  image: string;   // base64-encoded image
  mask: string;    // base64-encoded mask (white = edit region)
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
