import { isAdminAuthenticated } from "@/lib/admin/auth";
import AuthGate from "@/components/admin/AuthGate";

export const metadata = {
  title: "Admin — Canterbury Candles",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return <AuthGate />;
  }

  return (
    <div className="min-h-screen bg-parchment">
      <header className="border-b border-burgundy/10 bg-white/60 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg text-burgundy">Canterbury Candles</span>
            <span className="text-xs text-rose-gray bg-burgundy/5 px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
