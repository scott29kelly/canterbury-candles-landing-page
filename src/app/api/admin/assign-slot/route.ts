import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { assignSlot } from "@/lib/admin/cloudinary";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { publicId, slot } = await req.json();

    if (!publicId || !slot) {
      return NextResponse.json(
        { error: "publicId and slot are required" },
        { status: 400 }
      );
    }

    await assignSlot(publicId, slot);
    revalidatePath("/");

    return NextResponse.json({ success: true, slot });
  } catch (err) {
    console.error("[assign-slot] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Assign failed" },
      { status: 500 }
    );
  }
}
