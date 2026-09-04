"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { DateCandidate, ZeriReport } from "@/lib/zeri";

const deA = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
// The built-in PDF font has no CJK glyphs; strip Chinese chars from prose and tidy spacing.
const noCJK = (s: string) =>
  s
    .replace(/[\u3000-\u303f\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/g, "")
    .replace(/\(\s+/g, "(")
    .replace(/\s{2,}/g, " ")
    .trim();

const C = {
  ink: "#33302c",
  brand: "#7a2e1c",
  accent: "#b64b2f",
  muted: "#8a8078",
  line: "#eadfd2",
  panel: "#fbf3ea",
  green: "#3f7a4f",
};

const s = StyleSheet.create({
  page: { paddingVertical: 42, paddingHorizontal: 46, fontSize: 10, color: C.ink, fontFamily: "Helvetica" },
  eyebrow: { fontSize: 8, letterSpacing: 2, color: C.accent, textTransform: "uppercase", textAlign: "center" },
  h1: { fontSize: 20, color: C.brand, textAlign: "center", marginTop: 6, fontFamily: "Helvetica-Bold" },
  sub: { fontSize: 9, color: C.muted, textAlign: "center", marginTop: 4 },
  hr: { borderBottomWidth: 1, borderBottomColor: C.line, marginVertical: 12 },
  h2: { fontSize: 12, color: C.brand, marginBottom: 5, fontFamily: "Helvetica-Bold" },
  p: { fontSize: 10, lineHeight: 1.5, marginBottom: 4 },
  bold: { fontFamily: "Helvetica-Bold" },
  card: { borderWidth: 1, borderColor: C.line, borderRadius: 6, padding: 10, marginBottom: 10 },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 12, color: C.brand, fontFamily: "Helvetica-Bold" },
  badge: { fontSize: 7, color: C.green, fontFamily: "Helvetica-Bold" },
  meta: { fontSize: 8, color: C.muted, marginTop: 2 },
  panel: { backgroundColor: C.panel, borderRadius: 4, padding: 6, marginTop: 6, fontSize: 9 },
  label: { fontSize: 7, color: C.green, textTransform: "uppercase", letterSpacing: 1, marginTop: 6 },
  labelCaution: { fontSize: 7, color: C.accent, textTransform: "uppercase", letterSpacing: 1, marginTop: 6 },
  li: { fontSize: 9, lineHeight: 1.4, marginBottom: 1 },
  disclaimer: { fontSize: 8, color: C.muted, lineHeight: 1.4 },
});

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function niceDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function DateReportPdf({ report }: { report: ZeriReport }) {
  const r = report;
  const possessive = r.input.name?.trim() ? `${r.input.name.trim()}'s` : "Your";

  return (
    <Document title={`${possessive} ${r.event.label} Dates`}>
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Ze Ri - Auspicious Date Selection</Text>
        <Text style={s.h1}>{possessive} {r.event.label} Dates</Text>
        <Text style={s.sub}>
          Chosen for your chart - Chinese zodiac: {r.person.zodiacEn} - Favorable element: {r.person.primaryFavorable}
        </Text>
        <View style={s.hr} />

        <Text style={s.h2}>How these dates were chosen</Text>
        <Text style={s.p}>
          Unlike a generic &quot;lucky day&quot; calendar, these dates are selected against your own Chinese
          birth chart: days whose energy supports your favorable element ({r.person.primaryFavorable}), that
          fall on an auspicious (huang dao) day, that the traditional almanac marks suitable for a{" "}
          {r.event.label.toLowerCase()}, and that do not clash with your zodiac ({r.person.zodiacEn}).
        </Text>
        <View style={s.hr} />

        {r.candidates.length === 0 ? (
          <Text style={s.p}>
            No strongly auspicious dates were found in this range. Try widening the window or removing the
            weekends-only filter.
          </Text>
        ) : (
          r.candidates.map((c, i) => <Candidate key={c.solarDate} c={c} rank={i + 1} />)
        )}

        <View style={s.hr} />
        <Text style={s.disclaimer}>
          Disclaimer: For entertainment, cultural interest and self-reflection only. Not professional advice;
          no specific outcome is promised. All decisions remain your own.
        </Text>
        <Text style={[s.disclaimer, { marginTop: 4 }]}>
          Prepared by AuspiceEast - Method: personal BaZi favorable element + traditional almanac.
        </Text>
      </Page>
    </Document>
  );
}

function Candidate({ c, rank }: { c: DateCandidate; rank: number }) {
  return (
    <View style={s.card} wrap={false}>
      <View style={s.cardHead}>
        <Text style={s.cardTitle}>
          #{rank} - {niceDate(c.solarDate)} ({c.weekday})
        </Text>
        {c.huangdao ? <Text style={s.badge}>HUANG DAO</Text> : null}
      </View>
      <Text style={s.meta}>
        {c.lunarDate} - Day pillar {deA(c.ganzhiPinyin)} ({c.dayAnimalEn})
      </Text>
      {c.bestTimes.length > 0 && (
        <Text style={s.panel}>Best time of day: {c.bestTimes.join("   ")}</Text>
      )}
      <Text style={s.label}>Why this date suits you</Text>
      {c.reasons.map((x) => (
        <Text key={x} style={s.li}>
          - {noCJK(x)}
        </Text>
      ))}
      {c.cautions.length > 0 && (
        <>
          <Text style={s.labelCaution}>Gentle cautions</Text>
          {c.cautions.map((x) => (
            <Text key={x} style={s.li}>
              - {noCJK(x)}
            </Text>
          ))}
        </>
      )}
    </View>
  );
}
