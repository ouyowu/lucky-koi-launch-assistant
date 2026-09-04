import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-full bg-[#f5efe6] text-[#1f1b18] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-block rounded-full bg-[#f0dccb] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#b64b2f]">
            AuspiceEast · Internal Tool
          </div>
          <h1 className="mt-4 font-serif text-4xl font-bold text-[#7a2e1c]">Report Generators</h1>
          <p className="mt-2 text-[#6c6259]">
            Pick a tool. Enter the client&rsquo;s details, then copy the delivery message and download the PDF.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ToolCard
            href="/bazi"
            title="BaZi Reading"
            desc="Personalized Four Pillars reading: Day Master, five elements, personality, lucky colors, and 2026 outlook."
            cta="Create BaZi report"
          />
          <ToolCard
            href="/date"
            title="Auspicious Date Selection"
            desc="Ranked lucky dates for a wedding, move, business opening, or trip — chosen for the client's chart, with best times."
            cta="Find auspicious dates"
          />
        </div>

        <p className="mt-6 text-center text-xs text-[#8a8078]">For entertainment &amp; self-reflection only.</p>
      </div>
    </main>
  );
}

function ToolCard({ href, title, desc, cta }: { href: string; title: string; desc: string; cta: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-[#e2d5c6] bg-[#fffdf9] p-6 shadow-[0_18px_60px_rgba(65,43,27,0.08)] transition hover:border-[#b64b2f]"
    >
      <h2 className="font-serif text-2xl font-semibold text-[#7a2e1c]">{title}</h2>
      <p className="mt-2 flex-1 text-sm text-[#6c6259]">{desc}</p>
      <span className="mt-4 inline-block rounded-lg bg-[#b64b2f] px-4 py-2 text-center text-sm font-semibold text-white transition group-hover:bg-[#9d3f27]">
        {cta}
      </span>
    </Link>
  );
}
