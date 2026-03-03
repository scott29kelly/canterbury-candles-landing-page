export interface PromptTemplate {
  name: string;
  prompt: string;
}

// Shared core used by every hero-shot variant — only the scene direction changes.
function heroPrompt(sceneRules: string): string {
  return `You are creating a production-ready hero product image for the
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

${sceneRules}

OUTPUT
Return a single image only: a new hero product placement shot featuring
the remastered label from Image A, with scent-appropriate background
variation (still on a wooden kitchen table, still in the Canterbury Candles
photo style).`;
}

export const promptTemplates: PromptTemplate[] = [
  {
    name: "Hero Shot — Auto (match scent)",
    prompt: heroPrompt(`BACKGROUND / SCENE VARIATION RULES
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
  focus.`),
  },
  {
    name: "Hero Shot — Bakery & Warm Spices",
    prompt: heroPrompt(`BACKGROUND / SCENE DIRECTION — BAKERY & WARM SPICES
- Setting: warm, inviting kitchen baking scene.
- Wooden kitchen table with a light dusting of flour.
- Props (soft-focus, secondary): cinnamon sticks, vanilla pods, a small
  bowl of brown sugar, a wire cooling rack with fresh pastries, a wooden
  rolling pin, scattered star anise or cloves.
- Warm amber/golden lighting from the side, as if from an oven or
  afternoon sun through a kitchen window.
- Color palette: warm browns, creamy whites, golden honey tones.
- Background: soft bokeh of kitchen shelves, a mixing bowl, or a window
  with warm light streaming in.
- Keep the jar as the clear hero subject; props remain secondary and out of
  focus.`),
  },
  {
    name: "Hero Shot — Fresh Fruit & Citrus",
    prompt: heroPrompt(`BACKGROUND / SCENE DIRECTION — FRESH FRUIT & CITRUS
- Setting: bright, airy kitchen with a fresh summer feel.
- Wooden kitchen table, lighter tone (birch or maple feel).
- Props (soft-focus, secondary): sliced citrus fruits (lemon, orange, lime),
  a glass of iced water with fruit slices, fresh mint sprigs, a small bowl
  of mixed berries, droplets of condensation on surfaces.
- Bright, clean natural lighting — slightly cooler and crisper than other
  variants, as if morning sun is flooding through an open window.
- Color palette: vibrant yellows, oranges, greens against the natural wood.
- Background: soft bokeh of a bright window, a fruit bowl, or garden
  greenery visible outside.
- Keep the jar as the clear hero subject; props remain secondary and out of
  focus.`),
  },
  {
    name: "Hero Shot — Floral & Garden",
    prompt: heroPrompt(`BACKGROUND / SCENE DIRECTION — FLORAL & GARDEN
- Setting: soft, botanical, garden-adjacent kitchen scene.
- Wooden kitchen table draped with a linen runner or cloth.
- Props (soft-focus, secondary): a small vase of fresh-cut flowers
  (lavender, roses, wildflowers), eucalyptus sprigs, dried botanicals,
  a ceramic dish with loose petals, a sprig of rosemary or thyme.
- Warm but gentle diffused lighting — soft golden-hour glow as if near
  a garden window, slightly hazy and romantic.
- Color palette: soft greens, muted purples, blush pinks, cream, sage.
- Background: soft bokeh of window with garden-light glow, potted herbs,
  or trailing greenery.
- Keep the jar as the clear hero subject; props remain secondary and out of
  focus.`),
  },
  {
    name: "Hero Shot — Coffee & Rich",
    prompt: heroPrompt(`BACKGROUND / SCENE DIRECTION — COFFEE & RICH
- Setting: warm, moody coffee-house-meets-kitchen scene.
- Dark-toned wooden kitchen table (walnut or espresso finish).
- Props (soft-focus, secondary): scattered roasted coffee beans, a small
  espresso cup on a saucer, a burlap coffee sack, a square of dark
  chocolate, a wooden scoop, a cinnamon stick or two.
- Warm, low-angled side lighting with deeper shadows — slightly moodier
  and more dramatic than other variants, rich and intimate.
- Color palette: deep browns, espresso, chocolate, warm caramel, cream.
- Background: soft bokeh of dark kitchen shelves, a French press, or a
  dimly lit window with warm amber glow.
- Keep the jar as the clear hero subject; props remain secondary and out of
  focus.`),
  },
  {
    name: "Hero Shot — Cozy & Fireside",
    prompt: heroPrompt(`BACKGROUND / SCENE DIRECTION — COZY & FIRESIDE
- Setting: warm, intimate winter-evening kitchen scene.
- Wooden kitchen table with a chunky knit table runner or wool texture.
- Props (soft-focus, secondary): a soft knitted blanket draped nearby,
  a ceramic mug of cocoa or tea, a small stack of old books, pinecones,
  a strand of warm fairy lights, a cinnamon stick.
- Warm golden-amber lighting as if from a fireplace or candlelight —
  rich, glowing, and enveloping.
- Color palette: deep burgundy, burnt orange, warm ivory, rich caramel,
  forest green accents.
- Background: soft bokeh of warm fairy lights, a fireplace glow, or
  frosted window panes with warm interior light.
- Keep the jar as the clear hero subject; props remain secondary and out of
  focus.`),
  },
  {
    name: "Hero Shot — Clean & Spa",
    prompt: heroPrompt(`BACKGROUND / SCENE DIRECTION — CLEAN & SPA
- Setting: serene, minimalist spa-like kitchen scene.
- Light-toned wooden kitchen table (natural oak or ash).
- Props (soft-focus, secondary): a smooth stone or two, a small white
  ceramic dish with sea salt, a sprig of eucalyptus, a folded white
  linen towel, a small glass bottle of clear oil, a single green leaf.
- Bright, even, diffused natural lighting — clean and calming, no harsh
  shadows.
- Color palette: whites, soft greys, pale greens, natural wood, touches
  of seafoam or sky blue.
- Background: soft bokeh of a bright, airy space — white walls, a
  window with sheer curtains, or a simple shelf with a green plant.
- Keep the jar as the clear hero subject; props remain secondary and out of
  focus.`),
  },
];
