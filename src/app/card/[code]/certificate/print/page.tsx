'use client';

import React, { useEffect, useState, use } from 'react';
import { CertificateCanvas } from '@/components/certificate/CertificateCanvas';
import { CertificateTemplateConfig } from '@/lib/certificate-types';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CertificatePrintPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [member, setMember] = useState<any | null>(null);
  const [template, setTemplate] = useState<CertificateTemplateConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [mRes, tRes] = await Promise.all([
          fetch(`/api/members/search?q=${encodeURIComponent(code)}`),
          fetch('/api/certificate/template'),
        ]);

        if (mRes.ok) {
          const mData = await mRes.json();
          if (mData.results?.length > 0) {
            setMember(mData.results[0]);
          }
        }

        if (tRes.ok) {
          const tData = await tRes.json();
          if (tData.template) {
            setTemplate(tData.template);
          }
        }
      } catch (err) {
        console.error('Failed to load certificate for print:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [code]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-bold text-rose-400 mb-2">Member Not Found</h1>
        <p className="text-slate-400 text-sm mb-6">Unable to load certificate for {code}.</p>
        <Link href={`/card/${encodeURIComponent(code)}`} className="text-amber-400 hover:underline text-sm">
          Return to Member Pass
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 print:bg-white print:text-black">
      {/* Non-printed Toolbar */}
      <div className="print:hidden p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between max-w-5xl mx-auto">
        <Link
          href={`/card/${encodeURIComponent(code)}`}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Member Pass</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Certificate Page */}
      <div className="max-w-5xl mx-auto p-4 sm:p-8 print:p-0 print:m-0 print:max-w-none flex items-center justify-center">
        <div className="w-full print:w-[100vw] print:h-[100vh] print:flex print:items-center print:justify-center">
          <CertificateCanvas member={member} template={template} />
        </div>
      </div>

      {/* Print Specific CSS */}
      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body {
            margin: 0;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
