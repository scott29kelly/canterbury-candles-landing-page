import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { uploadImage } from "@/lib/admin/cloudinary";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { base64, mimeType, filename } = await req.json();

    if (!base64 || !filename) {
      return NextResponse.json(
        { error: "base64 and filename are required" },
        { status: 400 }
      );
    }

    const result = await uploadImage(base64, filename, mimeType);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[save] Cloudinary upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Save failed" },
      { status: 500 }
    );
  }
}
