"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { ELEMENT_STYLE, type BaziReport, type ElementEn, type Pillar } from "@/lib/bazi";

const ELEMENTS: ElementEn[] = ["Wood", "Fire", "Earth", "Metal", "Water"];

// @react-pdf default fonts don't include CJK or tone marks; keep Latin-only.
const deA = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const C = {
  ink: "#33302c",
  brand: "#7a2e1c",
  accent: "#b64b2f",
  muted: "#8a8078",
  line: "#eadfd2",
  panel: "#fbf3ea",
  card: "#ffffff",
};

const s = StyleSheet.create({
  page: { paddingVertical: 42, paddingHorizontal: 46, fontSize: 10, color: C.ink, fontFamily: "Helvetica" },
  eyebrow: { fontSize: 8, letterSpacing: 2, color: C.accent, textTransform: "uppercase", textAlign: "center" },
  h1: { fontSize: 22, color: C.brand, textAlign: "center", marginTop: 6, fontFamily: "Helvetica-Bold" },
  sub: { fontSize: 9, color: C.muted, textAlign: "center", marginTop: 4 },
  hr: { borderBottomWidth: 1, borderBottomColor: C.line, marginVertical: 14 },
  h2: { fontSize: 13, color: C.brand, marginBottom: 6, fontFamily: "Helvetica-Bold" },
  p: { fontSize: 10, lineHeight: 1.5, marginBottom: 4 },
  bold: { fontFamily: "Helvetica-Bold" },
  pillarsRow: { flexDirection: "row", gap: 8 },
  pillar: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 6, padding: 8, alignItems: "center" },
  pillarDM: { borderColor: C.accent, backgroundColor: C.panel },
  pillarLabel: { fontSize: 7, color: C.muted, textTransform: "uppercase", letterSpacing: 1 },
  pillarMain: { fontSize: 12, marginTop: 3, fontFamily: "Helvetica-Bold" },
  pillarSmall: { fontSize: 8, color: C.muted, marginTop: 2 },
  panel: { backgroundColor: C.panel, borderRadius: 6, padding: 10, marginTop: 10 },
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  barLabel: { width: 46, fontSize: 9 },
  barTrack: { flex: 1, height: 8, backgroundColor: "#efe6da", borderRadius: 4 },
  barFill: { height: 8, borderRadius: 4 },
  barPct: { width: 34, textAlign: "right", fontSize: 9, color: C.muted },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  info: { width: "31.5%", borderWidth: 1, borderColor: C.line, borderRadius: 6, padding: 8 },
  infoLabel: { fontSize: 7, color: C.muted, textTransform: "uppercase", letterSpacing: 1 },
  infoValue: { fontSize: 10, marginTop: 3, textTransform: "capitalize" },
  li: { fontSize: 10, lineHeight: 1.4, marginBottom: 2 },
  disclaimer: { fontSize: 8, color: C.muted, lineHeight: 1.4 },
});

function pillarLine(p: Pillar) {
  return `${deA(p.gan.pinyin)} ${deA(p.zhi.pinyin)}`;
}

export function ReportPdf({ report }: { report: BaziReport }) {
  const r = report;
  const possessive = r.input.name?.trim() ? `${r.input.name.trim()}'s` : "Your";
  const birth = `${r.input.year}-${String(r.input.month).padStart(2, "0")}-${String(
    r.input.day
  ).padStart(2, "0")}${
    r.input.hasTime
      ? ` ${String(r.input.hour).padStart(2, "0")}:${String(r.input.minute).padStart(2, "0")}`
      : " (time unknown)"
  }${r.input.place ? ` - ${r.input.place}` : ""}`;

  const pillars: (Pillar | null)[] = [r.pillars.year, r.pillars.month, r.pillars.day, r.pillars.hour];

  return (
    <Document title={`${possessive} BaZi Reading`}>
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>BaZi - Four Pillars of Destiny</Text>
        <Text style={s.h1}>{possessive} BaZi Reading</Text>
        <Text style={s.sub}>
          Born {birth} - Chinese zodiac: {r.zodiac.en}
        </Text>
        <View style={s.hr} />

        <Text style={s.h2}>Introduction</Text>
        <Text style={s.p}>
          Your Chinese zodiac animal is only one of eight characters in your chart. BaZi reads
          all four pillars of your birth to paint a far more personal picture of who you are and
          the rhythms of your timing. Here is your chart, in plain English.
        </Text>

        <View style={s.hr} />
        <Text style={s.h2}>Your Four Pillars</Text>
        <View style={s.pillarsRow}>
          {pillars.map((p, i) =>
            p ? (
              <View key={i} style={[s.pillar, p.label === "Day" ? s.pillarDM : {}]}>
                <Text style={s.pillarLabel}>{p.label === "Day" ? "Day - Master" : p.label}</Text>
                <Text style={s.pillarMain}>{pillarLine(p)}</Text>
                <Text style={s.pillarSmall}>
                  {p.gan.yinYang} {p.gan.element}
                </Text>
                <Text style={s.pillarSmall}>{p.zhi.animalEn}</Text>
              </View>
            ) : (
              <View key={i} style={s.pillar}>
                <Text style={s.pillarLabel}>Hour</Text>
                <Text style={s.pillarSmall}>unknown</Text>
              </View>
            )
          )}
        </View>
        <View style={s.panel}>
          <Text style={s.p}>
            <Text style={s.bold}>Your Day Master: </Text>
            {r.dayMaster.yinYang} {r.dayMaster.element} ({deA(r.dayMaster.pinyin)}) - you are{" "}
            {r.dayMaster.nature}.
          </Text>
        </View>

        <View style={s.hr} />
        <Text style={s.h2}>Your Five-Element Balance</Text>
        {ELEMENTS.map((el) => (
          <View key={el} style={s.barRow}>
            <Text style={s.barLabel}>{el}</Text>
            <View style={s.barTrack}>
              <View
                style={[
                  s.barFill,
                  { width: `${r.elementPercents[el]}%`, backgroundColor: ELEMENT_STYLE[el].hex },
                ]}
              />
            </View>
            <Text style={s.barPct}>{r.elementPercents[el]}%</Text>
          </View>
        ))}
        <Text style={[s.p, { marginTop: 6 }]}>{r.strength.explanation}</Text>

        <View style={s.hr} />
        <Text style={s.h2}>What Supports You</Text>
        <View style={s.grid}>
          <Info label="Favorable elements" value={r.favorable.join(", ")} />
          <Info label="Lucky colors - wear more" value={r.luckyColors} />
          <Info label="Ease off on" value={r.avoidColors} />
          <Info label="Supportive directions" value={r.directions} />
          <Info label="Day Master strength" value={`${r.strength.label} (${r.strength.supportPct}%)`} />
          <Info label="Primary favorable" value={r.primaryFavorable} />
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h2}>Who You Are</Text>
        <Text style={[s.p, s.bold]}>Natural strengths</Text>
        {r.personality.strengths.map((x) => (
          <Text key={x} style={s.li}>
            - {x}
          </Text>
        ))}
        <Text style={[s.p, s.bold, { marginTop: 6 }]}>Tendencies to watch</Text>
        {r.personality.watch.map((x) => (
          <Text key={x} style={s.li}>
            - {x}
          </Text>
        ))}
        <Text style={[s.p, { marginTop: 6, fontStyle: "italic" }]}>{r.personality.shine}</Text>

        <View style={s.hr} />
        <Text style={s.h2}>Career, Wealth & Relationships</Text>
        <Text style={s.p}>
          <Text style={s.bold}>Career: </Text>
          {r.career}
        </Text>
        <Text style={s.p}>
          <Text style={s.bold}>Wealth: </Text>
          {r.wealth}
        </Text>
        <Text style={s.p}>
          <Text style={s.bold}>Relationships: </Text>
          {r.love}
        </Text>

        <View style={s.hr} />
        <Text style={s.h2}>2026 Outlook (Year of the Fire Horse)</Text>
        <Text style={s.p}>{r.outlook2026}</Text>

        <View style={s.hr} />
        <Text style={s.disclaimer}>
          Disclaimer: This reading is provided for entertainment, cultural interest and
          self-reflection only. It is not professional medical, legal, financial, or
          psychological advice, and no specific outcome is promised. All decisions remain your
          own.
        </Text>
        <Text style={[s.disclaimer, { marginTop: 6 }]}>
          Prepared by AuspiceEast - Chart method: simplified strengthen/restrain.
        </Text>
      </Page>
    </Document>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.info}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}
