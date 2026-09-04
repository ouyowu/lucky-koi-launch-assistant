"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BaziForm() {
  const router = useRouter();
  const [hasTime, setHasTime] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    params.set("name", String(data.get("name") || ""));
    params.set("gender", String(data.get("gender") || ""));
    params.set("date", String(data.get("date") || ""));
    params.set("place", String(data.get("place") || ""));
    if (hasTime) params.set("time", String(data.get("time") || ""));
    else params.set("notime", "1");
    router.push(`/report?${params.toString()}`);
  }

  return (
    <main className="min-h-full bg-[#f5efe6] text-[#1f1b18] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link href="/" className="text-sm font-semibold text-[#b64b2f] hover:underline">
            ← All tools
          </Link>
          <h1 className="mt-3 font-serif text-4xl font-bold text-[#7a2e1c]">BaZi Report</h1>
          <p className="mt-2 text-[#6c6259]">
            Enter a client&rsquo;s birth details to generate a personalized Four Pillars reading.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-[#e2d5c6] bg-[#fffdf9] p-6 shadow-[0_18px_60px_rgba(65,43,27,0.08)] space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold mb-1">Client name (optional)</label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Sarah"
              className="w-full rounded-lg border border-[#dcd0c2] bg-white px-3 py-2 outline-none focus:border-[#b64b2f]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Date of birth *</label>
              <input
                name="date"
                type="date"
                required
                min="1900-01-01"
                max="2100-12-31"
                className="w-full rounded-lg border border-[#dcd0c2] bg-white px-3 py-2 outline-none focus:border-[#b64b2f]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Gender</label>
              <select
                name="gender"
                defaultValue="female"
                className="w-full rounded-lg border border-[#dcd0c2] bg-white px-3 py-2 outline-none focus:border-[#b64b2f]"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <input type="checkbox" checked={hasTime} onChange={(e) => setHasTime(e.target.checked)} />
              Birth time is known
            </label>
            {hasTime ? (
              <input
                name="time"
                type="time"
                defaultValue="12:00"
                className="w-full rounded-lg border border-[#dcd0c2] bg-white px-3 py-2 outline-none focus:border-[#b64b2f]"
              />
            ) : (
              <p className="text-sm text-[#6c6259]">
                No problem — an honest 3-pillar reading will be produced (no Hour pillar).
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Birth city & country</label>
            <input
              name="place"
              type="text"
              placeholder="e.g. London, UK"
              className="w-full rounded-lg border border-[#dcd0c2] bg-white px-3 py-2 outline-none focus:border-[#b64b2f]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#b64b2f] px-4 py-3 font-semibold text-white transition hover:bg-[#9d3f27] disabled:opacity-60"
          >
            {submitting ? "Generating…" : "Generate report"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[#8a8078]">For entertainment &amp; self-reflection only.</p>
      </div>
    </main>
  );
}
