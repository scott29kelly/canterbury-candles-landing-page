export interface PromptTemplate {
  name: string;
  prompt: string;
}

export const promptTemplates: PromptTemplate[] = [
  {
    name: "Standard Product Shot",
    prompt:
      "Professional e-commerce product photo of a hand-poured candle in a clear mason jar with a bronze lid. Clean white background, soft studio lighting, slight shadow beneath. The candle wax is a natural cream color. Shot at eye level, sharp focus, high resolution.",
  },
  {
    name: "Lifestyle Scene",
    prompt:
      "Cozy lifestyle photo of a hand-poured candle in a mason jar with a bronze lid, placed on a wooden table beside a soft knitted blanket and an open book. Warm golden-hour light streaming through a window, shallow depth of field, inviting and relaxing atmosphere.",
  },
  {
    name: "Flat Lay",
    prompt:
      "Overhead flat lay photo of a hand-poured candle in a mason jar with bronze lid, surrounded by dried flowers, eucalyptus sprigs, a small wooden tray, and natural linen fabric. Soft diffused lighting, neutral earth tones, minimalist editorial styling.",
  },
  {
    name: "Close-Up Detail",
    prompt:
      "Macro close-up photo of a hand-poured candle showing the texture of the wax surface, the cotton wick, and the edge of the mason jar. Soft bokeh background, warm lighting highlighting the natural wax texture and imperfections that show it's handmade.",
  },
];
