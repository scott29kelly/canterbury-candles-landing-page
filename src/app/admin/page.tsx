import Link from "next/link";

const CARDS = [
  {
    title: "Inventory",
    description: "Manage stock quantities for all 24 scents",
    href: "/admin/inventory",
  },
  {
    title: "Promo Codes",
    description: "Create, edit, and manage discount codes",
    href: "/admin/promo-codes",
  },
  {
    title: "Image Generator",
    description: "Generate product images with AI",
    href: "/admin/image-generator",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-2xl text-burgundy mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-xl shadow-sm border border-rose-gray/10 p-6 hover:shadow-md hover:border-burgundy/20 transition-all group"
          >
            <h2 className="font-display text-lg text-burgundy group-hover:text-burgundy-light transition-colors">
              {card.title}
            </h2>
            <p className="text-sm text-rose-gray mt-1">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
