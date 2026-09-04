import { ELEMENT_STYLE, type BaziReport, type ElementEn, type Pillar } from "@/lib/bazi";

const ELEMENTS: ElementEn[] = ["Wood", "Fire", "Earth", "Metal", "Water"];

export function ReportView({ report }: { report: BaziReport }) {
  const r = report;
  const displayName = r.input.name?.trim() || "Your";
  const possessive = r.input.name?.trim() ? `${r.input.name.trim()}'s` : "Your";

  return (
    <article className="rounded-2xl border border-[#e2d5c6] bg-[#fffdf9] p-8 shadow-[0_18px_60px_rgba(65,43,27,0.08)] print:border-0 print:shadow-none">
      {/* Header */}
      <header className="text-center border-b border-[#eadfd2] pb-6">
        <div className="inline-block rounded-full bg-[#f0dccb] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#b64b2f]">
          BaZi · Four Pillars of Destiny
        </div>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#7a2e1c]">
          {possessive} BaZi Reading
        </h1>
        <p className="mt-2 text-sm text-[#6c6259]">
          {formatBirth(r)} · Chinese zodiac: <strong>{r.zodiac.en}</strong> ({r.zodiac.cn})
        </p>
      </header>

      {/* Intro */}
      <Section title="Introduction">
        <p>
          Your Chinese zodiac animal is only one of eight characters in your chart. BaZi
          (八字) reads all four pillars of your birth to paint a far more personal picture
          of who you are and the rhythms of your timing. Here is {displayName.toLowerCase() === "your" ? "your" : `${r.input.name?.trim()}'s`} chart,
          in plain English.
        </p>
      </Section>

      {/* Four Pillars */}
      <Section title="Your Four Pillars">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <PillarCard pillar={r.pillars.year} isDayMaster={false} />
          <PillarCard pillar={r.pillars.month} isDayMaster={false} />
          <PillarCard pillar={r.pillars.day} isDayMaster />
          {r.pillars.hour ? (
            <PillarCard pillar={r.pillars.hour} isDayMaster={false} />
          ) : (
            <div className="rounded-xl border border-dashed border-[#dcd0c2] p-3 text-center text-xs text-[#8a8078] flex items-center justify-center">
              Hour unknown
            </div>
          )}
        </div>
        <div className="mt-4 rounded-xl bg-[#fbf3ea] p-4">
          <p className="text-sm">
            <strong>Your Day Master:</strong> {r.dayMaster.yinYang} {r.dayMaster.element}{" "}
            <span className="text-[#8a8078]">
              ({r.dayMaster.cn} {r.dayMaster.pinyin})
            </span>{" "}
            — you are {r.dayMaster.nature}.
          </p>
        </div>
      </Section>

      {/* Five Elements */}
      <Section title="Your Five-Element Balance">
        <div className="space-y-2">
          {ELEMENTS.map((el) => (
            <div key={el} className="flex items-center gap-3">
              <span className="w-16 text-sm font-medium">{el}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#efe6da]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${r.elementPercents[el]}%`,
                    backgroundColor: ELEMENT_STYLE[el].hex,
                  }}
                />
              </div>
              <span className="w-10 text-right text-sm text-[#6c6259]">
                {r.elementPercents[el]}%
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm">{r.strength.explanation}</p>
      </Section>

      {/* Favorable / colors / directions */}
      <Section title="What Supports You">
        <div className="grid gap-3 sm:grid-cols-3">
          <InfoCard label="Favorable elements" value={r.favorable.join(", ")} />
          <InfoCard label="Lucky colors — wear more" value={r.luckyColors} />
          <InfoCard label="Ease off on" value={r.avoidColors} />
          <InfoCard label="Supportive directions" value={r.directions} />
          <InfoCard
            label="Day Master strength"
            value={`${r.strength.label} (${r.strength.supportPct}% support)`}
          />
          <InfoCard label="Primary favorable" value={r.primaryFavorable} />
        </div>
      </Section>

      {/* Personality */}
      <Section title="Who You Are">
        <p className="mb-2 text-sm font-semibold text-[#7a2e1c]">Natural strengths</p>
        <ul className="mb-4 list-disc pl-5 text-sm space-y-1">
          {r.personality.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mb-2 text-sm font-semibold text-[#7a2e1c]">Tendencies to watch</p>
        <ul className="mb-4 list-disc pl-5 text-sm space-y-1">
          {r.personality.watch.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="text-sm italic">{r.personality.shine}</p>
      </Section>

      {/* Life areas */}
      <Section title="Career, Wealth & Relationships">
        <LabeledPara label="Career" text={r.career} />
        <LabeledPara label="Wealth" text={r.wealth} />
        <LabeledPara label="Relationships" text={r.love} />
      </Section>

      {/* 2026 */}
      <Section title="2026 Outlook (Year of the Fire Horse)">
        <p className="text-sm">{r.outlook2026}</p>
      </Section>

      {/* Disclaimer */}
      <footer className="mt-8 border-t border-[#eadfd2] pt-4 text-xs text-[#8a8078]">
        <p>
          <strong>Disclaimer:</strong> This reading is provided for entertainment, cultural
          interest and self-reflection only. It is not professional medical, legal, financial,
          or psychological advice, and no specific outcome is promised. All decisions remain
          your own.
        </p>
        <p className="mt-2">Prepared by AuspiceEast · Chart method: simplified strengthen/restrain (扶抑).</p>
      </footer>
    </article>
  );
}

function formatBirth(r: BaziReport): string {
  const { year, month, day } = r.input;
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const timeStr = r.input.hasTime
    ? ` ${String(r.input.hour).padStart(2, "0")}:${String(r.input.minute).padStart(2, "0")}`
    : " (time unknown)";
  const place = r.input.place ? ` · ${r.input.place}` : "";
  return `Born ${dateStr}${timeStr}${place}`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[#eadfd2] py-6">
      <h2 className="mb-3 font-serif text-xl font-semibold text-[#7a2e1c]">{title}</h2>
      <div className="text-[#33302c] leading-relaxed">{children}</div>
    </section>
  );
}

function PillarCard({ pillar, isDayMaster }: { pillar: Pillar; isDayMaster: boolean }) {
  return (
    <div
      className={`rounded-xl border p-3 text-center ${
        isDayMaster ? "border-[#b64b2f] bg-[#fbeee7]" : "border-[#e2d5c6] bg-white"
      }`}
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-[#8a8078]">
        {pillar.label}
        {isDayMaster ? " · Day Master" : ""}
      </div>
      <div className="mt-1 font-serif text-2xl text-[#33302c]">
        {pillar.gan.cn}
        {pillar.zhi.cn}
      </div>
      <div className="text-[11px] text-[#8a8078]">
        {pillar.gan.pinyin} {pillar.zhi.pinyin}
      </div>
      <div className="mt-1 text-xs">
        <span style={{ color: ELEMENT_STYLE[pillar.gan.element].hex }}>
          {pillar.gan.yinYang} {pillar.gan.element}
        </span>
      </div>
      <div className="text-[11px] text-[#6c6259]">{pillar.zhi.animalEn}</div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#e2d5c6] bg-white p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-[#8a8078]">
        {label}
      </div>
      <div className="mt-1 text-sm capitalize">{value}</div>
    </div>
  );
}

function LabeledPara({ label, text }: { label: string; text: string }) {
  return (
    <p className="mb-3 text-sm">
      <span className="font-semibold text-[#7a2e1c]">{label}: </span>
      {text}
    </p>
  );
}
