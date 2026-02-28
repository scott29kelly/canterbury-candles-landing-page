"use client";

import { useState } from "react";

export default function AuthGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error || "Authentication failed");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="font-display text-2xl text-burgundy text-center mb-2">
          Canterbury Candles
        </h1>
        <p className="text-rose-gray text-center text-sm mb-6">Admin Access</p>

        <label htmlFor="admin-password" className="block text-sm font-medium text-charcoal mb-1">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-rose-gray/30 rounded-lg text-charcoal
                     focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold
                     transition-colors"
          autoFocus
          required
        />

        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full py-2.5 bg-burgundy text-blush rounded-lg font-medium
                     hover:bg-burgundy-light transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
