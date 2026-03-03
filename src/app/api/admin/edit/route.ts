import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { geminiProvider } from "@/lib/admin/providers/gemini";
import { openaiProvider } from "@/lib/admin/providers/openai";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { image, prompt, mask, provider: requestedProvider } = await req.json();

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "image and prompt are required" },
        { status: 400 }
      );
    }

    // Auto-detect provider: mask → gpt-image, no mask → gemini
    const provider = requestedProvider || (mask ? "gpt-image" : "gemini");

    if (provider === "gpt-image") {
      const result = await openaiProvider.edit({ image, prompt, mask });
      return NextResponse.json(result);
    }

    // Default: gemini (ignores mask)
    const result = await geminiProvider.edit({ image, prompt });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Edit failed" },
      { status: 500 }
    );
  }
}
