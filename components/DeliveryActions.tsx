"use client";

import { useState } from "react";
import type { BaziReport } from "@/lib/bazi";

function buildDeliveryMessage(report: BaziReport): string {
  const name = report.input.name?.trim() || "there";
  const dm = `${report.dayMaster.yinYang} ${report.dayMaster.element}`;
  return `Hi ${name}, your personalized BaZi reading is ready! 🎉

Inside you'll find your Four Pillars & Day Master (${dm}), your Five-Element balance & personality, career/wealth/relationship notes, and your 2026 outlook.

Your lucky colors to wear more: ${report.luckyColors}.
Supportive directions: ${report.directions}.

Have a read and send me any questions — I'm happy to go deeper on anything. Thank you so much for trusting me with this! ✨

(For entertainment & self-reflection only.)`;
}

export function DeliveryActions({ report }: { report: BaziReport }) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleDownload() {
    setBusy(true);
    try {
      const [{ pdf }, { ReportPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/pdf/ReportPdf"),
      ]);
      const blob = await pdf(<ReportPdf report={report} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeName = (report.input.name?.trim() || "client")
        .replace(/[^a-z0-9]+/gi, "-")
        .toLowerCase();
      a.href = url;
      a.download = `bazi-reading-${safeName}.pdf`;
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
      // Fallback for browsers/contexts without clipboard permission
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
