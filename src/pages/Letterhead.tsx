import { useRef } from "react";
import bbsLogo from "@/assets/bbs-logo.png";
import cpdBadge from "@/assets/cpd-badge.png";

const Letterhead = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print/Download Button - hidden when printing */}
      <div className="fixed top-6 right-6 z-50 print:hidden flex gap-3">
        <button
          onClick={() => window.history.back()}
          className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
        >
          ← Back
        </button>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#243560] transition-colors text-sm shadow-lg"
        >
          Print / Download PDF
        </button>
      </div>

      {/* Letterhead */}
      <div
        ref={printRef}
        className="min-h-screen bg-white text-gray-900 print:bg-white"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        <div className="max-w-[210mm] mx-auto px-[25mm] py-[20mm] print:px-[20mm] print:py-[15mm]">
          {/* Header */}
          <header className="flex items-start justify-between border-b-2 border-[#1B2A4A] pb-6 mb-2">
            <div className="flex items-center gap-5">
              <img
                src={bbsLogo}
                alt="Bright Leadership Consulting"
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className="text-right text-sm leading-relaxed text-gray-700">
              <p className="font-semibold text-[#1B2A4A] text-base mb-1">Bright Leadership Consulting</p>
              <p>London, United Kingdom</p>
              <p>Tel: 0333 335 5045</p>
              <p>info@brightleadershipconsulting.com</p>
              <p className="text-[#C8A45A] font-medium">brightleadershipconsulting.com</p>
            </div>
          </header>

          {/* Sub-header credentials bar */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200 mb-12 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <img
                src={cpdBadge}
                alt="CPD Accredited Provider #50838"
                className="h-10 w-auto"
              />
              <span>CPD Accredited Provider — #50838</span>
            </div>
            <div className="flex gap-6">
              <span>Company Reg: 09876543</span>
              <span>VAT Reg: GB 123 4567 89</span>
            </div>
          </div>

          {/* Letter Body Area */}
          <div className="min-h-[500px] print:min-h-[600px]">
            <p className="text-gray-400 italic text-center mt-32 print:hidden">
              Your letter content goes here. Click "Print / Download PDF" to save as a PDF.
            </p>
          </div>

          {/* Footer */}
          <footer className="mt-auto pt-8 border-t border-gray-200">
            <div className="flex items-end justify-between">
              <div className="text-xs text-gray-500 leading-relaxed">
                <p className="font-semibold text-[#1B2A4A] text-sm mb-1">Bright Leadership Consulting</p>
                <p>Executive Leadership Coaching &amp; CPD-Accredited Training</p>
                <p>London, United Kingdom</p>
              </div>
              <div className="text-right text-xs text-gray-400 leading-relaxed">
                <p>Company Registration: 09876543</p>
                <p>VAT Registration: GB 123 4567 89</p>
                <p className="mt-1.5 text-[#C8A45A]">brightleadershipconsulting.com</p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Letterhead;
