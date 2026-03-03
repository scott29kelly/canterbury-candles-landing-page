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
];
