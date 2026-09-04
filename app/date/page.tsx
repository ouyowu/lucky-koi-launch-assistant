"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function DateForm() {
  const router = useRouter();
  const [hasTime, setHasTime] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // set default range on the client to avoid hydration mismatch
  useEffect(() => {
    const now = new Date();
    const later = new Date();
    later.setDate(now.getDate() + 60);
    setFrom(iso(now));
    setTo(iso(later));
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    params.set("name", String(data.get("name") || ""));
    params.set("gender", String(data.get("gender") || ""));
    params.set("date", String(data.get("date") || ""));
    if (hasTime) params.set("time", String(data.get("time") || ""));
    else params.set("notime", "1");
    params.set("event", String(data.get("event") || "general"));
    params.set("from", String(data.get("from") || ""));
    params.set("to", String(data.get("to") || ""));
    if (data.get("weekends")) params.set("weekends", "1");
    router.push(`/date/report?${params.toString()}`);
  }

  const field = "w-full rounded-lg border border-[#dcd0c2] bg-white px-3 py-2 outline-none focus:border-[#b64b2f]";

  return (
    <main className="min-h-full bg-[#f5efe6] text-[#1f1b18] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link href="/" className="text-sm font-semibold text-[#b64b2f] hover:underline">
            ← All tools
          </Link>
          <h1 className="mt-3 font-serif text-4xl font-bold text-[#7a2e1c]">Auspicious Date Selection</h1>
          <p className="mt-2 text-[#6c6259]">
            Find the best dates for an event, chosen for the client&rsquo;s Chinese birth chart.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-[#e2d5c6] bg-[#fffdf9] p-6 shadow-[0_18px_60px_rgba(65,43,27,0.08)] space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold mb-1">Client name (optional)</label>
            <input name="name" type="text" placeholder="e.g. Sarah" className={field} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Event *</label>
            <select name="event" defaultValue="wedding" className={field}>
              <option value="wedding">Wedding</option>
              <option value="engagement">Engagement</option>
              <option value="moving">Moving home</option>
              <option value="business">Business opening</option>
              <option value="signing">Signing / contract</option>
              <option value="travel">Travel</option>
              <option value="general">General / auspicious day</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Client date of birth *</label>
              <input name="date" type="date" required min="1900-01-01" max="2100-12-31" className={field} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Gender</label>
              <select name="gender" defaultValue="female" className={field}>
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
              <input name="time" type="time" defaultValue="12:00" className={field} />
            ) : (
              <p className="text-sm text-[#6c6259]">No problem — dates will still be selected from the day chart.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Search from *</label>
              <input name="from" type="date" required value={from} onChange={(e) => setFrom(e.target.value)} className={field} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Search to *</label>
              <input name="to" type="date" required value={to} onChange={(e) => setTo(e.target.value)} className={field} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="weekends" value="1" />
            Weekends only
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#b64b2f] px-4 py-3 font-semibold text-white transition hover:bg-[#9d3f27] disabled:opacity-60"
          >
            {submitting ? "Finding dates…" : "Find auspicious dates"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[#8a8078]">
          Range is capped at 120 days. For entertainment &amp; self-reflection only.
        </p>
      </div>
    </main>
  );
}
