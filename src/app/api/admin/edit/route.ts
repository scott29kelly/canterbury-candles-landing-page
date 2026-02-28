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
    const { provider, image, mask, prompt } = await req.json();

    if (!provider || !image || !prompt) {
      return NextResponse.json(
        { error: "provider, image, and prompt are required" },
        { status: 400 }
      );
    }

    const impl = providers[provider as ProviderName];
    if (!impl) {
      return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
    }

    const result = await impl.edit({ image, mask: mask || "", prompt });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Edit failed" },
      { status: 500 }
    );
  }
}
