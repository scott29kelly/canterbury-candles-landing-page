export type CandleSize = "8oz" | "16oz";

export interface Scent {
  name: string;
  tag: string;
  notes: string;
  accent: string;
  image: string;
  /** Optional CSS scale to adjust framing, e.g. "1.12" to zoom in */
  imageScale?: number;
}

export interface ProductDetails {
  wickType: string;
  waxType: string;
  burnTime: string;
  origin: string;
}

export const PRODUCT_DETAILS: ProductDetails = {
  wickType: "100% cotton wick",
  waxType: "Paraffin-free soy wax",
  burnTime: "100+ hour burn time",
  origin: "Hand-poured in USA",
};

export const SCENTS: Scent[] = [
  {
    name: "Aspen Woods",
    tag: "Woody",
    notes: "Earthy cedar, crisp mountain air, and warm amber",
    accent: "bg-[#5a6b4f]",
    image: "/images/product-aspen-woods.jpg",
  },
  {
    name: "Blueberry",
    tag: "Fruity",
    notes: "Sweet wild blueberries, fresh picked, juicy burst",
    accent: "bg-[#3a4a7a]",
    image: "/images/product-blueberry.png",
    imageScale: 1.12,
  },
  {
    name: "Blueberry Cheesecake",
    tag: "Bakery",
    notes: "Blueberry compote, rich cheesecake, buttery crust",
    accent: "bg-[#4a4a8a]",
    image: "/images/product-blueberry-cheesecake.png",
  },
  {
    name: "Blueberry Muffins",
    tag: "Bakery",
    notes: "Warm blueberry, buttery crumble, vanilla glaze",
    accent: "bg-[#4a5a8a]",
    image: "/images/product-blueberry-muffins.jpg",
  },
  {
    name: "Blueberry Pancakes",
    tag: "Bakery",
    notes: "Fresh blueberries, maple syrup, warm butter",
    accent: "bg-[#5a6a9a]",
    image: "/images/product-blueberry-pancakes.jpg",
  },
  {
    name: "Cherry Cheesecake",
    tag: "Bakery",
    notes: "Ripe cherries, creamy cheesecake, graham crust",
    accent: "bg-[#8a3a4a]",
    image: "/images/product-cherry-cheesecake.jpg",
  },
  {
    name: "Coastal Waters",
    tag: "Fresh",
    notes: "Ocean breeze, sea salt, sun-warmed driftwood",
    accent: "bg-[#3a8a9a]",
    image: "/images/product-coastal-waters.png",
  },
  {
    name: "Espresso",
    tag: "Classic",
    notes: "Rich dark roast, caramel undertones, smooth finish",
    accent: "bg-[#5a3a2a]",
    image: "/images/product-espresso.jpg",
  },
  {
    name: "Fruit Loops",
    tag: "Fruity",
    notes: "Bright citrus medley, sweet cereal, morning joy",
    accent: "bg-[#c4784a]",
    image: "/images/product-fruit-loops.jpg",
  },
  {
    name: "Gingerbread",
    tag: "Bakery",
    notes: "Warm ginger, cinnamon spice, dark molasses",
    accent: "bg-[#8a5a3a]",
    image: "/images/product-gingerbread.jpg",
  },
  {
    name: "Glazed Donuts",
    tag: "Bakery",
    notes: "Warm dough, sweet vanilla glaze, powdered sugar",
    accent: "bg-[#c4a44a]",
    image: "/images/product-glazed-donuts.jpg",
  },
  {
    name: "Honeydew & Coconut Cream",
    tag: "Tropical",
    notes: "Fresh honeydew melon, creamy coconut, tropical sweetness",
    accent: "bg-[#7ab47a]",
    image: "/images/product-honeydew-and-coconut-cream.png",
  },
  {
    name: "Honeysuckle",
    tag: "Floral",
    notes: "Sweet honeysuckle nectar, warm summer air, golden blooms",
    accent: "bg-[#c4a46a]",
    image: "/images/product-honeysuckle.png",
  },
  {
    name: "Lavender",
    tag: "Floral",
    notes: "Calming lavender fields, soft herbal notes, gentle floral",
    accent: "bg-[#7a6a9a]",
    image: "/images/product-lavander.png",
  },
  {
    name: "Lemon Pound Cake",
    tag: "Bakery",
    notes: "Bright lemon zest, buttery pound cake, sweet cream",
    accent: "bg-[#c4b44a]",
    image: "/images/product-lemon-pound-cake.jpg",
  },
  {
    name: "Pumpkin Pecan Waffles",
    tag: "Bakery",
    notes: "Spiced pumpkin, toasted pecans, maple drizzle",
    accent: "bg-[#b47a3a]",
    image: "/images/product-pumpkin-pecan-waffles.png",
  },
  {
    name: "Snickerdoodle",
    tag: "Bakery",
    notes: "Cinnamon sugar, warm vanilla, fresh-baked cookies",
    accent: "bg-[#c49a6a]",
    image: "/images/product-snickerdoodle.jpg",
  },
  {
    name: "Spiced Vanilla & Cinnamon",
    tag: "Classic",
    notes: "Rich vanilla bean, warm cinnamon bark, star anise",
    accent: "bg-[#9a6a4a]",
    image: "/images/product-spiced-vanilla-and-cinnamon.png",
  },
  {
    name: "Spring Flowers",
    tag: "Floral",
    notes: "Jasmine, lily of the valley, soft green stems",
    accent: "bg-[#7a9a6a]",
    image: "/images/product-spring-flowers.jpg",
  },
  {
    name: "Strawberry Pound Cake",
    tag: "Bakery",
    notes: "Ripe strawberries, vanilla cake, whipped cream",
    accent: "bg-[#c45a6a]",
    image: "/images/product-strawberry-pound-cake.jpg",
  },
  {
    name: "Vanilla Wafflecone Sundae",
    tag: "Bakery",
    notes: "Crispy wafflecone, creamy vanilla, caramel drizzle",
    accent: "bg-[#c4944a]",
    image: "/images/product-vanilla-wafflecone-sundae.jpg",
  },
  {
    name: "Watermelon Lemonade",
    tag: "Fruity",
    notes: "Sweet watermelon, tart lemon, summer breeze",
    accent: "bg-[#6a9a5a]",
    image: "/images/product-watermelon-lemonade.jpg",
  },
  {
    name: "Wild Sage",
    tag: "Herbal",
    notes: "Fresh wild sage, earthy herbs, open meadow breeze",
    accent: "bg-[#6a8a5a]",
    image: "/images/product-wild-sage.png",
  },
];

export const PRICES: Record<CandleSize, number> = { "8oz": 15, "16oz": 25 };

export const SCENT_NAMES: string[] = SCENTS.map((s) => s.name);
