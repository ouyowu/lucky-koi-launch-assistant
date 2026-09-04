import { Solar } from "lunar-typescript";
import {
  computeBazi,
  GAN,
  ZHI,
  ELEMENT_STYLE,
  type BaziInput,
  type ElementEn,
} from "@/lib/bazi";

export type EventType =
  | "wedding"
  | "engagement"
  | "moving"
  | "business"
  | "signing"
  | "travel"
  | "general";

export const EVENTS: Record<EventType, { label: string; noun: string; keywords: string[] }> = {
  wedding: { label: "Wedding", noun: "wedding", keywords: ["嫁娶", "结婚", "订盟", "纳采"] },
  engagement: { label: "Engagement", noun: "engagement", keywords: ["订盟", "纳采", "嫁娶"] },
  moving: { label: "Moving home", noun: "move", keywords: ["入宅", "移徙"] },
  business: { label: "Business opening", noun: "opening", keywords: ["开市", "开业", "立券", "交易", "纳财"] },
  signing: { label: "Signing / contract", noun: "signing", keywords: ["立券", "交易", "纳财"] },
  travel: { label: "Travel", noun: "trip", keywords: ["出行"] },
  general: { label: "General / auspicious day", noun: "occasion", keywords: [] },
};

// Common 通书 terms -> English (for translating the day's 宜/忌)
const TERMS: Record<string, string> = {
  嫁娶: "marriage",
  结婚: "marriage",
  订盟: "engagement",
  纳采: "betrothal",
  纳婿: "welcoming a son-in-law",
  入宅: "moving into a home",
  移徙: "relocating",
  安床: "setting up the bed",
  开市: "opening a business",
  开业: "opening a business",
  立券: "signing contracts",
  交易: "trading",
  纳财: "receiving wealth",
  出行: "travel",
  动土: "ground-breaking",
  上梁: "raising the frame",
  修造: "construction",
  拆卸: "demolition",
  祭祀: "rituals",
  祈福: "praying for blessings",
  开光: "consecration",
  求嗣: "seeking children",
  会亲友: "meeting friends & family",
  沐浴: "bathing",
  安葬: "burial",
  行丧: "funeral matters",
  作灶: "kitchen-stove work",
  理发: "haircut",
  栽种: "planting",
  纳畜: "acquiring livestock",
  牧养: "herding",
  伐木: "logging",
  破土: "breaking ground (burial)",
  安门: "installing doors",
  挂匾: "hanging a plaque",
  进人口: "welcoming new household members",
};

function translateTerms(terms: string[], max = 4): string[] {
  const out: string[] = [];
  for (const t of terms) {
    const en = TERMS[t];
    if (en && !out.includes(en)) out.push(en);
    if (out.length >= max) break;
  }
  return out;
}

// 地支六冲 by branch char
const SIX_CLASH: Record<string, string> = {
  子: "午", 午: "子", 丑: "未", 未: "丑", 寅: "申", 申: "寅",
  卯: "酉", 酉: "卯", 辰: "戌", 戌: "辰", 巳: "亥", 亥: "巳",
};

// double-hour windows by branch
const HOUR_WINDOW: Record<string, string> = {
  子: "23:00–01:00", 丑: "01:00–03:00", 寅: "03:00–05:00", 卯: "05:00–07:00",
  辰: "07:00–09:00", 巳: "09:00–11:00", 午: "11:00–13:00", 未: "13:00–15:00",
  申: "15:00–17:00", 酉: "17:00–19:00", 戌: "19:00–21:00", 亥: "21:00–23:00",
};
// daytime-friendly branches (for real-world events)
const DAYTIME_ZHI = ["卯", "辰", "巳", "午", "未", "申", "酉"];

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const GOOD_ZHIXING = new Set(["成", "开", "定", "满"]);
const BAD_ZHIXING = new Set(["破", "危", "闭"]);

export type DateCandidate = {
  solarDate: string;
  weekday: string;
  lunarDate: string;
  ganzhiCn: string;
  ganzhiPinyin: string;
  dayAnimalEn: string;
  score: number;
  huangdao: boolean;
  bestTimes: string[];
  reasons: string[];
  cautions: string[];
};

export type ZeriInput = {
  name?: string;
  gender?: string;
  birth: BaziInput;
  event: EventType;
  fromISO: string; // YYYY-MM-DD
  toISO: string; // YYYY-MM-DD
  weekendsOnly?: boolean;
};

export type ZeriReport = {
  input: ZeriInput;
  person: {
    zodiacEn: string;
    zodiacCn: string;
    dayMasterElement: ElementEn;
    favorable: ElementEn[];
    primaryFavorable: ElementEn;
    primaryFavorableColors: string;
  };
  event: { type: EventType; label: string };
  candidates: DateCandidate[];
  scannedDays: number;
};

function parseISO(iso: string): { y: number; m: number; d: number } | null {
  const mt = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!mt) return null;
  return { y: Number(mt[1]), m: Number(mt[2]), d: Number(mt[3]) };
}

export function computeZeri(input: ZeriInput): ZeriReport {
  const person = computeBazi(input.birth);
  const favorable = person.favorable;
  const unfavorable = person.unfavorable;
  const primaryFav = person.primaryFavorable;
  const personYearZhi = person.pillars.year.zhi.cn;
  const personAnimalCn = person.pillars.year.zhi.animalCn;

  const from = parseISO(input.fromISO);
  const to = parseISO(input.toISO);
  if (!from || !to) throw new Error("Invalid date range");

  const start = new Date(Date.UTC(from.y, from.m - 1, from.d));
  const end = new Date(Date.UTC(to.y, to.m - 1, to.d));
  const evt = EVENTS[input.event];

  const candidates: DateCandidate[] = [];
  let scanned = 0;
  const MAX_DAYS = 120;

  for (
    let t = start.getTime(), i = 0;
    t <= end.getTime() && i < MAX_DAYS;
    t += 86400000, i++
  ) {
    const dt = new Date(t);
    const y = dt.getUTCFullYear();
    const m = dt.getUTCMonth() + 1;
    const d = dt.getUTCDate();
    const weekdayIdx = dt.getUTCDay();

    if (input.weekendsOnly && weekdayIdx !== 0 && weekdayIdx !== 6) continue;
    scanned++;

    const lunar = Solar.fromYmd(y, m, d).getLunar();
    const dayGanCn = lunar.getDayGan();
    const dayZhiCn = lunar.getDayZhi();
    const gan = GAN[dayGanCn];
    const zhi = ZHI[dayZhiCn];
    if (!gan || !zhi) continue;

    const chongAnimalCn = lunar.getDayChongShengXiao();
    // Hard skip: the day clashes the person's own zodiac
    if (chongAnimalCn && chongAnimalCn === personAnimalCn) continue;

    const yi = lunar.getDayYi() || [];
    const ji = lunar.getDayJi() || [];
    const zhixing = lunar.getZhiXing();
    const huangdao = lunar.getDayTianShenType() === "黄道";

    let score = 0;
    const reasons: string[] = [];
    const cautions: string[] = [];

    // element of the day's stem
    if (gan.element === primaryFav) {
      score += 3;
      reasons.push(`The day's energy (${gan.element}) directly supports your favorable element.`);
    } else if (favorable.includes(gan.element)) {
      score += 2;
      reasons.push(`The day carries ${gan.element}, which is favorable for you.`);
    } else if (unfavorable.includes(gan.element)) {
      score -= 2;
    }
    // element of the day's branch
    if (favorable.includes(zhi.element)) score += 1;
    else if (unfavorable.includes(zhi.element)) score -= 1;

    // 黄道 / 黑道
    if (huangdao) {
      score += 2;
      reasons.push("A 黄道 (auspicious) day in the traditional almanac.");
    } else {
      score -= 2;
    }

    // 建除十二值星
    if (GOOD_ZHIXING.has(zhixing)) score += 1;
    else if (BAD_ZHIXING.has(zhixing)) score -= 2;

    // event-specific 宜 / 忌
    if (evt.keywords.length) {
      const yiHit = evt.keywords.some((k) => yi.includes(k));
      const jiHit = evt.keywords.some((k) => ji.includes(k));
      // Hard skip: never recommend a day the almanac explicitly marks unsuitable for this event.
      if (jiHit) continue;
      if (yiHit) {
        score += 3;
        reasons.push(`The almanac marks this day suitable for your ${evt.noun}.`);
      }
    }

    reasons.push(`No clash with your zodiac (${person.zodiac.en}).`);

    // relevant cautions from the day's 忌 (translated)
    const jiEn = translateTerms(ji, 3);
    if (jiEn.length) cautions.push(`Traditionally avoid: ${jiEn.join(", ")}.`);

    // best times: favorable, non-clashing, daytime double-hours
    const bestTimes = pickBestTimes(dayZhiCn, personYearZhi, favorable);

    candidates.push({
      solarDate: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      weekday: WEEKDAYS[weekdayIdx],
      lunarDate: `Lunar ${Math.abs(lunar.getMonth())}/${lunar.getDay()}${
        lunar.getMonth() < 0 ? " (leap)" : ""
      }`,
      ganzhiCn: `${gan.cn}${zhi.cn}`,
      ganzhiPinyin: `${gan.pinyin} ${zhi.pinyin}`,
      dayAnimalEn: zhi.animalEn,
      score,
      huangdao,
      bestTimes,
      reasons,
      cautions,
    });
  }

  candidates.sort((a, b) => (b.score - a.score) || (a.solarDate < b.solarDate ? -1 : 1));
  const top = candidates.slice(0, 5);

  return {
    input,
    person: {
      zodiacEn: person.zodiac.en,
      zodiacCn: person.zodiac.cn,
      dayMasterElement: person.dayMaster.element,
      favorable,
      primaryFavorable: primaryFav,
      primaryFavorableColors: ELEMENT_STYLE[primaryFav].colors,
    },
    event: { type: input.event, label: evt.label },
    candidates: top,
    scannedDays: scanned,
  };
}

function pickBestTimes(
  dayZhi: string,
  personYearZhi: string,
  favorable: ElementEn[]
): string[] {
  const results: { zhi: string; favorable: boolean }[] = [];
  for (const z of DAYTIME_ZHI) {
    if (SIX_CLASH[z] === dayZhi) continue; // clashes the day
    if (SIX_CLASH[z] === personYearZhi) continue; // clashes the person
    results.push({ zhi: z, favorable: favorable.includes(ZHI[z].element) });
  }
  // prefer favorable-element hours, keep at most 2
  results.sort((a, b) => Number(b.favorable) - Number(a.favorable));
  return results.slice(0, 2).map((r) => {
    const z = ZHI[r.zhi];
    return `${HOUR_WINDOW[r.zhi]} · ${z.animalEn} hour${r.favorable ? " (supports you)" : ""}`;
  });
}
