"use client";

import { useState } from "react";
import type { BaziReport } from "@/lib/bazi";

export function DownloadPdfButton({ report }: { report: BaziReport }) {
  const [busy, setBusy] = useState(false);

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

  return (
    <button
      onClick={handleDownload}
      disabled={busy}
      className="rounded-lg bg-[#b64b2f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9d3f27] disabled:opacity-60"
    >
      {busy ? "Preparing PDF…" : "Download PDF"}
    </button>
  );
}
