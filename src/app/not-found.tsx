import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-8 shadow-xl border border-emerald-100">
          🕌
        </div>
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl mb-6">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">404 — Page Not Found</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          This path does<br />not exist.
        </h1>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          The page you are looking for may have been moved or doesn&apos;t exist. Let&apos;s take you back to your halal wealth journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-emerald-700 hover:-translate-y-0.5 transition-all shadow-lg"
          >
            Go to Dashboard →
          </Link>
          <Link
            href="/"
            className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black hover:border-emerald-300 hover:-translate-y-0.5 transition-all shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
