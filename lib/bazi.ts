import { Solar } from "lunar-typescript";

export type ElementEn = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

type GanInfo = {
  cn: string;
  pinyin: string;
  element: ElementEn;
  yinYang: "Yang" | "Yin";
};

type ZhiInfo = {
  cn: string;
  pinyin: string;
  element: ElementEn;
  animalCn: string;
  animalEn: string;
};

const GAN: Record<string, GanInfo> = {
  甲: { cn: "甲", pinyin: "Jiǎ", element: "Wood", yinYang: "Yang" },
  乙: { cn: "乙", pinyin: "Yǐ", element: "Wood", yinYang: "Yin" },
  丙: { cn: "丙", pinyin: "Bǐng", element: "Fire", yinYang: "Yang" },
  丁: { cn: "丁", pinyin: "Dīng", element: "Fire", yinYang: "Yin" },
  戊: { cn: "戊", pinyin: "Wù", element: "Earth", yinYang: "Yang" },
  己: { cn: "己", pinyin: "Jǐ", element: "Earth", yinYang: "Yin" },
  庚: { cn: "庚", pinyin: "Gēng", element: "Metal", yinYang: "Yang" },
  辛: { cn: "辛", pinyin: "Xīn", element: "Metal", yinYang: "Yin" },
  壬: { cn: "壬", pinyin: "Rén", element: "Water", yinYang: "Yang" },
  癸: { cn: "癸", pinyin: "Guǐ", element: "Water", yinYang: "Yin" },
};

const ZHI: Record<string, ZhiInfo> = {
  子: { cn: "子", pinyin: "Zǐ", element: "Water", animalCn: "鼠", animalEn: "Rat" },
  丑: { cn: "丑", pinyin: "Chǒu", element: "Earth", animalCn: "牛", animalEn: "Ox" },
  寅: { cn: "寅", pinyin: "Yín", element: "Wood", animalCn: "虎", animalEn: "Tiger" },
  卯: { cn: "卯", pinyin: "Mǎo", element: "Wood", animalCn: "兔", animalEn: "Rabbit" },
  辰: { cn: "辰", pinyin: "Chén", element: "Earth", animalCn: "龙", animalEn: "Dragon" },
  巳: { cn: "巳", pinyin: "Sì", element: "Fire", animalCn: "蛇", animalEn: "Snake" },
  午: { cn: "午", pinyin: "Wǔ", element: "Fire", animalCn: "马", animalEn: "Horse" },
  未: { cn: "未", pinyin: "Wèi", element: "Earth", animalCn: "羊", animalEn: "Goat" },
  申: { cn: "申", pinyin: "Shēn", element: "Metal", animalCn: "猴", animalEn: "Monkey" },
  酉: { cn: "酉", pinyin: "Yǒu", element: "Metal", animalCn: "鸡", animalEn: "Rooster" },
  戌: { cn: "戌", pinyin: "Xū", element: "Earth", animalCn: "狗", animalEn: "Dog" },
  亥: { cn: "亥", pinyin: "Hài", element: "Water", animalCn: "猪", animalEn: "Pig" },
};

const ELEMENTS: ElementEn[] = ["Wood", "Fire", "Earth", "Metal", "Water"];

// Wood -> Fire -> Earth -> Metal -> Water -> Wood
const GENERATES: Record<ElementEn, ElementEn> = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood",
};
// Wood -> Earth -> Water -> Fire -> Metal -> Wood
const CONTROLS: Record<ElementEn, ElementEn> = {
  Wood: "Earth",
  Earth: "Water",
  Water: "Fire",
  Fire: "Metal",
  Metal: "Wood",
};

function generatedBy(e: ElementEn): ElementEn {
  return (Object.keys(GENERATES) as ElementEn[]).find((k) => GENERATES[k] === e)!;
}
function controlledBy(e: ElementEn): ElementEn {
  return (Object.keys(CONTROLS) as ElementEn[]).find((k) => CONTROLS[k] === e)!;
}

export const ELEMENT_STYLE: Record<
  ElementEn,
  { hex: string; colors: string; directions: string }
> = {
  Wood: { hex: "#3f9c5a", colors: "green, teal, emerald", directions: "East, Southeast" },
  Fire: { hex: "#c0392b", colors: "red, purple, orange", directions: "South" },
  Earth: { hex: "#b7950b", colors: "yellow, brown, beige", directions: "Center, Northeast, Southwest" },
  Metal: { hex: "#95a5a6", colors: "white, gold, silver, grey", directions: "West, Northwest" },
  Water: { hex: "#2c3e50", colors: "black, blue, navy", directions: "North" },
};

const DM_PROFILE: Record<
  ElementEn,
  { nature: string; strengths: string[]; watch: string[]; shine: string; career: string; wealth: string; love: string }
> = {
  Wood: {
    nature: "like a growing tree — upright, expansive, and quietly determined",
    strengths: ["Principled and idealistic", "A natural planner and grower", "Kind, cooperative, and forward-looking"],
    watch: ["Can be stubborn once rooted in a view", "May take on too much at once"],
    shine: "You shine when you're building something meaningful and helping others grow with you.",
    career: "Fields that reward vision and growth suit you — education, design, creative work, healthcare, and anything you can nurture over time.",
    wealth: "Money tends to grow steadily rather than overnight. Long-term, patient building works far better for you than quick bets.",
    love: "You value loyalty and shared growth. Give partners room and honesty, and you build something that lasts.",
  },
  Fire: {
    nature: "like a flame — warm, expressive, and full of energy",
    strengths: ["Charismatic and inspiring", "Passionate and quick to act", "Warm-hearted and generous"],
    watch: ["Energy can burn hot then fade — pace yourself", "May act before reflecting"],
    shine: "You shine in the spotlight — leading, presenting, and lighting up the people around you.",
    career: "Roles with visibility and people suit you — media, marketing, performance, hospitality, and leadership.",
    wealth: "Money often comes through your reputation and connections. Guard against impulse spending in high-energy moments.",
    love: "You love passionately and openly. A partner who matches your warmth without smothering your spark is ideal.",
  },
  Earth: {
    nature: "like the earth itself — steady, reliable, and nourishing",
    strengths: ["Dependable and grounded", "Patient and loyal", "A natural supporter others trust"],
    watch: ["Can overthink or resist change", "May put others' needs before your own"],
    shine: "You shine as the steady center that holds people, projects, and homes together.",
    career: "Stability-oriented fields fit you — real estate, operations, agriculture, care work, and trusted advisory roles.",
    wealth: "You build wealth slowly and safely. Saving and tangible assets suit you better than speculation.",
    love: "You offer security and devotion. You thrive with a partner who values your loyalty and returns it.",
  },
  Metal: {
    nature: "like refined metal — sharp, principled, and resolute",
    strengths: ["Decisive and disciplined", "Honest and high-standard", "Strong sense of justice and structure"],
    watch: ["Can be rigid or overly critical", "May struggle to let go"],
    shine: "You shine when clarity and integrity matter — cutting through noise to do things right.",
    career: "Precision fields suit you — finance, law, engineering, technology, and anything demanding rigor.",
    wealth: "You're good with money and structure. Clear systems and disciplined planning are your edge.",
    love: "You love with commitment and principle. Softening your standards a little lets closeness in.",
  },
  Water: {
    nature: "like flowing water — adaptable, perceptive, and deep",
    strengths: ["Clever and quick-thinking", "Flexible and diplomatic", "Perceptive, with strong intuition"],
    watch: ["Can be restless or over-analytical", "May avoid confrontation"],
    shine: "You shine when you can think, connect, and move freely between people and ideas.",
    career: "Fluid, communicative fields fit you — consulting, logistics, research, writing, and trade.",
    wealth: "Money flows in through ideas and networks. Keep some reserves, since your income can ebb and flow.",
    love: "You're emotionally attuned and adaptable. Openness about your own needs deepens your bonds.",
  },
};

export type Pillar = {
  label: string;
  gan: GanInfo;
  zhi: ZhiInfo;
  hidden: GanInfo[];
};

export type BaziInput = {
  name?: string;
  gender?: string;
  year: number;
  month: number;
  day: number;
  hour: number; // 0-23
  minute: number;
  hasTime: boolean;
  place?: string;
};

export type BaziReport = {
  input: BaziInput;
  zodiac: { cn: string; en: string };
  pillars: { year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null };
  dayMaster: GanInfo & { nature: string };
  elementCounts: Record<ElementEn, number>;
  elementPercents: Record<ElementEn, number>;
  strength: { label: "Strong" | "Weak" | "Balanced"; supportPct: number; explanation: string };
  favorable: ElementEn[];
  unfavorable: ElementEn[];
  primaryFavorable: ElementEn;
  luckyColors: string;
  avoidColors: string;
  directions: string;
  personality: { strengths: string[]; watch: string[]; shine: string };
  career: string;
  wealth: string;
  love: string;
  outlook2026: string;
};

function toPillar(label: string, ganCn: string, zhiCn: string, hiddenCns: string[]): Pillar {
  return {
    label,
    gan: GAN[ganCn],
    zhi: ZHI[zhiCn],
    hidden: hiddenCns.map((h) => GAN[h]).filter(Boolean),
  };
}

export function computeBazi(input: BaziInput): BaziReport {
  const solar = Solar.fromYmdHms(
    input.year,
    input.month,
    input.day,
    input.hasTime ? input.hour : 12,
    input.hasTime ? input.minute : 0,
    0
  );
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const year = toPillar("Year", ec.getYearGan(), ec.getYearZhi(), ec.getYearHideGan());
  const month = toPillar("Month", ec.getMonthGan(), ec.getMonthZhi(), ec.getMonthHideGan());
  const day = toPillar("Day", ec.getDayGan(), ec.getDayZhi(), ec.getDayHideGan());
  const hour = input.hasTime
    ? toPillar("Hour", ec.getTimeGan(), ec.getTimeZhi(), ec.getTimeHideGan())
    : null;

  const pillars = { year, month, day, hour };
  const dm = day.gan;

  // ---- Five-element weighted counts ----
  const counts: Record<ElementEn, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const add = (el: ElementEn, w: number) => {
    counts[el] += w;
  };
  const stems = [year.gan, month.gan, day.gan, hour?.gan].filter(Boolean) as GanInfo[];
  stems.forEach((g) => add(g.element, 1));
  // branch main element; month branch (月令) weighted heavier
  add(year.zhi.element, 1.2);
  add(month.zhi.element, 2.0);
  add(day.zhi.element, 1.2);
  if (hour) add(hour.zhi.element, 1.2);
  // hidden stems (lighter)
  [year, month, day, hour].forEach((p) => {
    if (!p) return;
    p.hidden.forEach((h) => add(h.element, 0.3));
  });

  const total = ELEMENTS.reduce((s, e) => s + counts[e], 0);
  const percents = {} as Record<ElementEn, number>;
  ELEMENTS.forEach((e) => (percents[e] = Math.round((counts[e] / total) * 100)));
  const rounded = {} as Record<ElementEn, number>;
  ELEMENTS.forEach((e) => (rounded[e] = Math.round(counts[e] * 10) / 10));

  // ---- Day master strength (simplified strengthen/restrain) ----
  const self = dm.element;
  const resource = generatedBy(self); // generates the DM (印)
  const output = GENERATES[self]; // DM generates (食伤)
  const wealth = CONTROLS[self]; // DM controls (财)
  const officer = controlledBy(self); // controls DM (官杀)

  const support = counts[self] + counts[resource] - 1; // minus the DM stem itself
  const drain = counts[output] + counts[wealth] + counts[officer];
  const supportPct = Math.round((support / (support + drain)) * 100);

  let label: "Strong" | "Weak" | "Balanced";
  if (supportPct >= 55) label = "Strong";
  else if (supportPct <= 45) label = "Weak";
  else label = "Balanced";

  let favorable: ElementEn[];
  let unfavorable: ElementEn[];
  if (label === "Strong") {
    favorable = uniq([output, wealth, officer]);
    unfavorable = uniq([self, resource]);
  } else if (label === "Weak") {
    favorable = uniq([resource, self]);
    unfavorable = uniq([output, wealth, officer]);
  } else {
    favorable = uniq([resource, output]);
    unfavorable = uniq([wealth]);
  }

  // primary favorable = the favorable element currently most lacking (best to boost)
  const primaryFavorable = [...favorable].sort((a, b) => counts[a] - counts[b])[0];
  const secondaryFavorable = favorable.find((f) => f !== primaryFavorable);

  const luckyColors = uniq(
    [primaryFavorable, secondaryFavorable].filter(Boolean).map((e) => ELEMENT_STYLE[e as ElementEn].colors)
  ).join("; ");
  const directions = uniq(
    [primaryFavorable, secondaryFavorable].filter(Boolean).map((e) => ELEMENT_STYLE[e as ElementEn].directions)
  ).join("; ");
  // avoid colors from the most overweight unfavorable element
  const avoidEl = [...unfavorable].sort((a, b) => counts[b] - counts[a])[0];
  const avoidColors = ELEMENT_STYLE[avoidEl].colors;

  const strengthExplanation =
    label === "Strong"
      ? `Your chart is well-supported in ${self}, so your Day Master is considered strong. You benefit from elements that gently express and balance that strength — ${favorable.join(", ")}.`
      : label === "Weak"
      ? `Your chart gives your Day Master less direct support, so it is considered weak. You benefit from elements that nourish and reinforce you — ${favorable.join(", ")}.`
      : `Your chart is fairly balanced. Lean gently on ${favorable.join(", ")} to keep your energy in harmony.`;

  const profile = DM_PROFILE[self];

  // 2026 = Bing-Wu (Fire Horse) year → dominant element Fire
  const year2026El: ElementEn = "Fire";
  let outlook2026: string;
  if (favorable.includes(year2026El)) {
    outlook2026 = `2026 is a Fire Horse year, and Fire is favorable for you — a year that can add momentum, visibility, and warmth to your plans. Lean into bold, people-facing moves, especially around your strongest months.`;
  } else if (unfavorable.includes(year2026El)) {
    outlook2026 = `2026 is a Fire Horse year, and Fire is an element you already carry plenty of — so pace yourself. Favor steadiness over big risks, protect your energy, and let ${primaryFavorable}-supporting habits (colors, directions, environments) keep you balanced.`;
  } else {
    outlook2026 = `2026 is a Fire Horse year with a lively, fast-moving energy. It's a fine year for measured progress — stay grounded in what supports you (${primaryFavorable}) and choose your timing deliberately.`;
  }

  return {
    input,
    zodiac: { cn: lunar.getYearShengXiao(), en: year.zhi.animalEn },
    pillars,
    dayMaster: { ...dm, nature: profile.nature },
    elementCounts: rounded,
    elementPercents: percents,
    strength: { label, supportPct, explanation: strengthExplanation },
    favorable,
    unfavorable,
    primaryFavorable,
    luckyColors,
    avoidColors,
    directions,
    personality: { strengths: profile.strengths, watch: profile.watch, shine: profile.shine },
    career: profile.career,
    wealth: profile.wealth,
    love: profile.love,
    outlook2026,
  };
}

function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
