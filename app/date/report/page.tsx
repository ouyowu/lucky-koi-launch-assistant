import Link from "next/link";
import { computeZeri, EVENTS, type EventType, type ZeriInput } from "@/lib/zeri";
import type { BaziInput } from "@/lib/bazi";
import { DateReportView } from "@/components/DateReportView";
import { DateDeliveryActions } from "@/components/DateDeliveryActions";

function str(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export default async function DateReportPage({ searchParams }: PageProps<"/date/report">) {
  const sp = await searchParams;
  const name = str(sp.name);
  const gender = str(sp.gender);
  const dateStr = str(sp.date);
  const timeStr = str(sp.time);
  const hasTime = str(sp.notime) !== "1" && timeStr !== "";
  const from = str(sp.from);
  const to = str(sp.to);
  const eventRaw = str(sp.event) || "general";
  const event = (eventRaw in EVENTS ? eventRaw : "general") as EventType;
  const weekendsOnly = str(sp.weekends) === "1";

  const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  const fromOk = /^\d{4}-\d{2}-\d{2}$/.test(from);
  const toOk = /^\d{4}-\d{2}-\d{2}$/.test(to);
  if (!dm || !fromOk || !toOk) {
    return <ErrorState message="Missing or invalid inputs. Please go back and fill in the birth date and search range." />;
  }

  let hour = 12;
  let minute = 0;
  if (hasTime) {
    const t = /^(\d{2}):(\d{2})$/.exec(timeStr);
    if (t) {
      hour = Number(t[1]);
      minute = Number(t[2]);
    }
  }

  const birth: BaziInput = {
    name,
    gender,
    year: Number(dm[1]),
    month: Number(dm[2]),
    day: Number(dm[3]),
    hour,
    minute,
    hasTime,
  };

  const zeriInput: ZeriInput = { name, gender, birth, event, fromISO: from, toISO: to, weekendsOnly };

  let report;
  try {
    report = computeZeri(zeriInput);
  } catch {
    return <ErrorState message="Could not compute dates. Please check the inputs and try again." />;
  }

  return (
    <main className="min-h-full bg-[#f5efe6] px-4 py-10 text-[#1f1b18] print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href="/date" className="text-sm font-semibold text-[#b64b2f] hover:underline">
            ← New search
          </Link>
          <DateDeliveryActions report={report} />
        </div>
        <DateReportView report={report} />
      </div>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-full bg-[#f5efe6] flex items-center justify-center px-4 py-20 text-center">
      <div>
        <p className="text-[#7a2e1c] font-serif text-2xl mb-3">Something went wrong</p>
        <p className="text-[#6c6259] mb-6">{message}</p>
        <Link href="/date" className="rounded-lg bg-[#b64b2f] px-4 py-2 font-semibold text-white hover:bg-[#9d3f27]">
          Back to form
        </Link>
      </div>
    </main>
  );
}
