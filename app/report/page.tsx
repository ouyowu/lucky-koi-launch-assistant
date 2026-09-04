import Link from "next/link";
import { computeBazi, type BaziInput } from "@/lib/bazi";
import { ReportView } from "@/components/ReportView";
import { DownloadPdfButton } from "@/components/DownloadPdfButton";

function str(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export default async function ReportPage({ searchParams }: PageProps<"/report">) {
  const sp = await searchParams;
  const name = str(sp.name);
  const gender = str(sp.gender);
  const place = str(sp.place);
  const dateStr = str(sp.date);
  const timeStr = str(sp.time);
  const hasTime = str(sp.notime) !== "1" && timeStr !== "";

  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!dateMatch) {
    return (
      <ErrorState message="Missing or invalid date of birth. Please go back and try again." />
    );
  }
  const [, y, m, d] = dateMatch;
  let hour = 12;
  let minute = 0;
  if (hasTime) {
    const t = /^(\d{2}):(\d{2})$/.exec(timeStr);
    if (t) {
      hour = Number(t[1]);
      minute = Number(t[2]);
    }
  }

  const input: BaziInput = {
    name,
    gender,
    year: Number(y),
    month: Number(m),
    day: Number(d),
    hour,
    minute,
    hasTime,
    place,
  };

  let report;
  try {
    report = computeBazi(input);
  } catch {
    return <ErrorState message="Could not compute this chart. Please check the birth details." />;
  }

  return (
    <main className="min-h-full bg-[#f5efe6] px-4 py-10 text-[#1f1b18] print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link href="/" className="text-sm font-semibold text-[#b64b2f] hover:underline">
            ← New report
          </Link>
          <DownloadPdfButton report={report} />
        </div>
        <ReportView report={report} />
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
        <Link
          href="/"
          className="rounded-lg bg-[#b64b2f] px-4 py-2 font-semibold text-white hover:bg-[#9d3f27]"
        >
          Back to form
        </Link>
      </div>
    </main>
  );
}
