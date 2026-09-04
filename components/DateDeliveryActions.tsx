"use client";

import { useState } from "react";
import type { ZeriReport } from "@/lib/zeri";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function niceDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function buildDeliveryMessage(r: ZeriReport): string {
  const name = r.input.name?.trim() || "there";
  const lines = r.candidates
    .map((c, i) => {
      const time = c.bestTimes[0] ? ` — best time ${c.bestTimes[0].split(" · ")[0]}` : "";
      return `${i + 1}. ${niceDate(c.solarDate)} (${c.weekday})${time}`;
    })
    .join("\n");
  return `Hi ${name}, your auspicious ${r.event.label.toLowerCase()} date report is ready! 🎉

Based on your Chinese birth chart, here are your best dates:
${lines}

Each date is chosen to support your chart (favorable element: ${r.person.primaryFavorable}) and to avoid clashing with your zodiac (${r.person.zodiacEn}). Full explanations and the best time of day for each are in the attached PDF.

Any questions, just ask — happy to help! ✨

(For entertainment & self-reflection only.)`;
}

export function DateDeliveryActions({ report }: { report: ZeriReport }) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleDownload() {
    setBusy(true);
    try {
      const [{ pdf }, { DateReportPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/pdf/DateReportPdf"),
      ]);
      const blob = await pdf(<DateReportPdf report={report} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeName = (report.input.name?.trim() || "client").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      a.href = url;
      a.download = `auspicious-dates-${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Sorry, the PDF could not be generated. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    const msg = buildDeliveryMessage(report);
    try {
      await navigator.clipboard.writeText(msg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your delivery message:", msg);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleCopy}
        className="rounded-lg border border-[#b64b2f] bg-white px-4 py-2 text-sm font-semibold text-[#b64b2f] transition hover:bg-[#fbeee7]"
      >
        {copied ? "Copied ✓" : "Copy delivery message"}
      </button>
      <button
        onClick={handleDownload}
        disabled={busy}
        className="rounded-lg bg-[#b64b2f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9d3f27] disabled:opacity-60"
      >
        {busy ? "Preparing PDF…" : "Download PDF"}
      </button>
    </div>
  );
}
