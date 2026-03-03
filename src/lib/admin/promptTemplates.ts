export interface PromptTemplate {
  name: string;
  prompt: string;
}

export const promptTemplates: PromptTemplate[] = [
  {
    name: "Product Shot — White Background",
    prompt:
      "Professional e-commerce product photo of a hand-poured candle in a clear mason jar with a bronze lid, using the attached label design. Clean white background, soft studio lighting, slight shadow beneath. Shot at eye level, sharp focus, high resolution.",
  },
  {
    name: "Product Shot — Kitchen Scene",
    prompt:
      "Generate a product photo of a candle with this label design in a warm kitchen setting. The candle is in a mason jar with a bronze lid, placed on a marble countertop next to fresh herbs and a wooden cutting board. Warm natural lighting, inviting atmosphere.",
  },
  {
    name: "Lifestyle — Cozy Evening",
    prompt:
      "Cozy lifestyle photo of a hand-poured candle in a mason jar with a bronze lid, using this label. Placed on a wooden table beside a soft knitted blanket and an open book. Warm golden-hour light streaming through a window, shallow depth of field, inviting and relaxing atmosphere.",
  },
  {
    name: "Flat Lay — Editorial",
    prompt:
      "Overhead flat lay photo of a hand-poured candle in a mason jar with bronze lid, featuring this label design. Surrounded by dried flowers, eucalyptus sprigs, a small wooden tray, and natural linen fabric. Soft diffused lighting, neutral earth tones, minimalist editorial styling.",
  },
  {
    name: "Gift Set — Holiday",
    prompt:
      "Festive product photo of a candle gift set. A hand-poured candle in a mason jar with this label, wrapped with a ribbon, placed on a rustic wooden surface with pinecones, cinnamon sticks, and fairy lights. Warm holiday atmosphere, soft bokeh background.",
  },
  {
    name: "Hero Product Shot — Lineup",
    prompt: `You are creating a production-ready hero product image for the
"Canterbury Candles" lineup using TWO input images.

INPUTS
- Image A = NEW SCENT LABEL (flat/proof artwork).
- Image B = REFERENCE HERO SHOT (example of finished quality and jar/label realism).

GOAL
Generate ONE new image that matches the Canterbury Candles "hero product
photo" look (premium, warm, shallow depth of field, kitchen-table product
photography), featuring the jar with the remastered label from Image A.

CRITICAL CLARIFICATION ABOUT IMAGE B
- Image B is a QUALITY + COMPOSITION reference, not a mandate to reuse the
  exact same background/environment every time.
- Maintain the overall hero-shot style and basic composition, BUT vary the
  background/staging to match the specific scent theme in Image A.

HARD REQUIREMENTS (do not deviate)
1) Keep the hero-shot composition consistent across the lineup:
   - single jar centered (or near-centered) on a wooden kitchen table
   - similar camera distance and angle (product-forward)
   - shallow depth of field with tasteful bokeh
2) The jar must look photoreal and consistent with the lineup (glass jar,
   creamy wax, centered wick, metal lid).
3) Apply the label so it looks physically printed and adhered to the jar:
   correct perspective + curvature wrap, realistic edge contact, subtle
   paper texture, natural shadows, and slight glass reflections over the
   label (no "sticker pasted on" look).
4) Preserve the label's structure from Image A:
   - Upper half: Canterbury logo/wordmark area
   - Lower half: scent image/art area
   Do not swap these regions or redesign brand identity.
5) All label text must be clean, correctly spelled, and legible (no warped,
   garbled, or invented letters). Keep "Canterbury" and "CANDLES" exact.
6) No dirt, no peeling corners, no wrinkles, no watermarks, no borders,
   no extra jars.

LABEL REMASTERING (make Image A production-ready)
- Rebuild the label layout to match the polish of the finished lineup:
  consistent margins, clean alignment, balanced spacing, correct kerning,
  crisp edges, accurate rounded-corner label shape, print-quality clarity.
- Keep the scent name exactly as shown in Image A (same wording/spelling),
  but render it sharp and readable.

BACKGROUND / SCENE VARIATION RULES (this is the fix)
- The scene MUST vary per scent while staying "on-brand":
  wooden kitchen table + warm natural light + soft background blur.
- Choose background props and color mood that match the scent theme and
  the label's lower-image content (examples):
  - baked goods: pastries/ingredients, flour, cinnamon sticks, mixing tools
  - fruit/citrus: fresh fruit, slices, juice glass, mint, condensation/ice
  - floral/herbal: flowers, greenery, linen, garden-window light
  - coffee: beans, espresso cup, burlap sack, dark wood tones
- Do NOT reuse the exact same background arrangement across different
  scents. Change at least 2-3 of the following each time:
  - prop set (objects and placement)
  - background surface details (cutting board vs bare plank vs linen runner)
  - lighting direction/intensity (still warm and natural)
  - background depth cues (window glow, shelves, kitchen items, etc.)
  - color palette to complement the scent image
- Keep the jar as the clear hero subject; props remain secondary and out of
  focus.

OUTPUT
Return a single image only: a new hero product placement shot featuring
the remastered label from Image A, with scent-appropriate background
variation (still on a wooden kitchen table, still in the Canterbury Candles
photo style).`,
  },
];
