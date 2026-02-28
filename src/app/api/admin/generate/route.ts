import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { openaiProvider } from "@/lib/admin/providers/openai";
import { geminiProvider } from "@/lib/admin/providers/gemini";
import { seedreamProvider } from "@/lib/admin/providers/seedream";
import type { ProviderName } from "@/lib/admin/providers/types";

export const maxDuration = 60;

const providers = {
  openai: openaiProvider,
  gemini: geminiProvider,
  seedream: seedreamProvider,
};

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { provider, prompt, size, quality } = await req.json();

    if (!provider || !prompt) {
      return NextResponse.json({ error: "provider and prompt are required" }, { status: 400 });
    }

    const impl = providers[provider as ProviderName];
    if (!impl) {
      return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
    }

    const result = await impl.generate({ prompt, size, quality });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
