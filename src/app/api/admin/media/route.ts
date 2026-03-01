import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { listImages, deleteImage } from "@/lib/admin/cloudinary";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const { images, nextCursor } = await listImages(cursor);
    return NextResponse.json({ images, nextCursor });
  } catch (err) {
    console.error("[media] List error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list images" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { publicId } = await req.json();

    if (!publicId || !publicId.startsWith("canterbury-candles/products/")) {
      return NextResponse.json(
        { error: "Invalid publicId" },
        { status: 400 }
      );
    }

    await deleteImage(publicId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[media] Delete error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Delete failed" },
      { status: 500 }
    );
  }
}
