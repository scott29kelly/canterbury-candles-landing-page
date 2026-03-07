import { getSlotImages } from "@/lib/admin/cloudinary";
import { SCENTS } from "@/data/products";
import HomeClient from "./HomeClient";

// All slot IDs we want to check
const SLOT_IDS = [
  "hero",
  "story-prepare",
  "story-blend",
  "story-pour",
  ...SCENTS.map(
    (s) => `product-${s.name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "-")}`
  ),
];

export default async function Home() {
  let slotImages: Record<string, string> = {};
  try {
    slotImages = await getSlotImages(SLOT_IDS);
  } catch {
    // Fall back to defaults if Cloudinary is unavailable
  }

  // Split into props for each component
  const heroImageUrl = slotImages["hero"] || undefined;

  const storyOverrides: Record<string, string> = {};
  if (slotImages["story-prepare"]) storyOverrides["prepare"] = slotImages["story-prepare"];
  if (slotImages["story-blend"]) storyOverrides["blend"] = slotImages["story-blend"];
  if (slotImages["story-pour"]) storyOverrides["pour"] = slotImages["story-pour"];

  const productImageOverrides: Record<string, string> = {};
  for (const [key, url] of Object.entries(slotImages)) {
    if (key.startsWith("product-")) {
      productImageOverrides[key.replace("product-", "")] = url;
    }
  }

  return (
    <HomeClient
      heroImageUrl={heroImageUrl}
      storyImageOverrides={Object.keys(storyOverrides).length > 0 ? storyOverrides : undefined}
      productImageOverrides={Object.keys(productImageOverrides).length > 0 ? productImageOverrides : undefined}
    />
  );
}
