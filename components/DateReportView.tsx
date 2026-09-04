import type { DateCandidate, ZeriReport } from "@/lib/zeri";

export function DateReportView({ report }: { report: ZeriReport }) {
  const r = report;
  const possessive = r.input.name?.trim() ? `${r.input.name.trim()}'s` : "Your";

  return (
    <article className="rounded-2xl border border-[#e2d5c6] bg-[#fffdf9] p-8 shadow-[0_18px_60px_rgba(65,43,27,0.08)] print:border-0 print:shadow-none">
      <header className="text-center border-b border-[#eadfd2] pb-6">
        <div className="inline-block rounded-full bg-[#f0dccb] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#b64b2f]">
          擇日 · Auspicious Date Selection
        </div>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#7a2e1c]">
          {possessive} {r.event.label} Dates
        </h1>
        <p className="mt-2 text-sm text-[#6c6259]">
          Chosen for your chart · Chinese zodiac: <strong>{r.person.zodiacEn}</strong> ({r.person.zodiacCn}) ·
          Favorable element: <strong>{r.person.primaryFavorable}</strong>
        </p>
      </header>

      <section className="border-t border-[#eadfd2] py-6">
        <h2 className="mb-3 font-serif text-xl font-semibold text-[#7a2e1c]">How these dates were chosen</h2>
        <p className="text-sm leading-relaxed text-[#33302c]">
          Unlike a generic &ldquo;lucky day&rdquo; calendar, these dates are selected against{" "}
          <strong>your own Chinese birth chart</strong>. I look for days whose energy supports your
          favorable element ({r.person.primaryFavorable}), that fall on a 黄道 (auspicious) day, that the
          traditional almanac marks suitable for a {r.event.label.toLowerCase()}, and that do not clash with
          your zodiac ({r.person.zodiacEn}). I scanned {r.scannedDays} day{r.scannedDays === 1 ? "" : "s"} in your
          range and ranked the best below.
        </p>
      </section>

      {r.candidates.length === 0 ? (
        <section className="border-t border-[#eadfd2] py-6">
          <p className="text-sm">
            No strongly auspicious dates were found in this range for your chart. Try widening the search
            window or removing the &ldquo;weekends only&rdquo; filter.
          </p>
        </section>
      ) : (
        r.candidates.map((c, i) => <CandidateCard key={c.solarDate} c={c} rank={i + 1} />)
      )}

      <footer className="mt-8 border-t border-[#eadfd2] pt-4 text-xs text-[#8a8078]">
        <p>
          <strong>Disclaimer:</strong> This report is provided for entertainment, cultural interest and
          self-reflection only. It is not professional advice, and no specific outcome is promised. All
          decisions remain your own.
        </p>
        <p className="mt-2">Prepared by AuspiceEast · Method: personal BaZi favorable element + traditional almanac (黄道 / 宜忌 / 生肖冲).</p>
      </footer>
    </article>
  );
}

function CandidateCard({ c, rank }: { c: DateCandidate; rank: number }) {
  return (
    <section className="border-t border-[#eadfd2] py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl font-semibold text-[#7a2e1c]">
          #{rank} · {formatNice(c.solarDate)} ({c.weekday})
        </h2>
        {c.huangdao && (
          <span className="rounded-full bg-[#e7f0e7] px-2 py-0.5 text-xs font-semibold text-[#3f7a4f]">
            黄道 auspicious day
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-[#6c6259]">
        {c.lunarDate} · Day pillar {c.ganzhiCn}{" "}
        <span className="text-[#8a8078]">({c.ganzhiPinyin} · {c.dayAnimalEn})</span>
      </p>

      {c.bestTimes.length > 0 && (
        <div className="mt-3 rounded-xl bg-[#fbf3ea] p-3 text-sm">
          <span className="font-semibold text-[#7a2e1c]">Best time of day: </span>
          {c.bestTimes.join("  ·  ")}
        </div>
      )}

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#3f7a4f]">Why this date suits you</p>
          <ul className="mt-1 list-disc pl-5 text-sm space-y-1">
            {c.reasons.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        {c.cautions.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#b64b2f]">Gentle cautions</p>
            <ul className="mt-1 list-disc pl-5 text-sm space-y-1">
              {c.cautions.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function formatNice(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[m - 1]} ${d}, ${y}`;
}
