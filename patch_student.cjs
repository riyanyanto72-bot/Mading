const fs = require('fs');
const content = fs.readFileSync('src/components/StudentPortal/StudentPortalView.tsx', 'utf8');
const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">'));
const endIdx = lines.findIndex(l => l.includes('{/* CHANGE PASSWORD MODAL */}'));

if (startIdx !== -1 && endIdx !== -1) {
  const newSection = `        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {loggedStudent.status === 'LULUS' ? (
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            ) : loggedStudent.status === 'TIDAK_LULUS' ? (
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <AlertCircle className="w-7 h-7" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <AlertCircle className="w-7 h-7" />
              </div>
            )}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                STATUS KELULUSAN
              </span>
              <h3 className={\`text-xl sm:text-2xl font-black \${
                loggedStudent.status === 'LULUS' ? 'text-emerald-900' : loggedStudent.status === 'TIDAK_LULUS' ? 'text-red-900' : 'text-amber-900'
              }\`}>
                {loggedStudent.status === 'LULUS' ? 'DINYATAKAN LULUS' : loggedStudent.status === 'TIDAK_LULUS' ? 'TIDAK LULUS' : 'DITANGGUHKAN SEMENTARA'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {loggedStudent.status === 'LULUS'
                  ? \`Selamat! Anda telah menyelesaikan seluruh program studi di \${settings.school_name}.\`
                  : loggedStudent.note || 'Harap segera menghubungi wali kelas untuk informasi lebih lanjut.'}
              </p>
            </div>
          </div>
          {loggedStudent.status === 'LULUS' && loggedStudent.skl_custom_url && (
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={loggedStudent.skl_custom_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm uppercase tracking-wider shadow-md transition-all flex items-center gap-2 border border-emerald-400 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download SKL</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {settings.graduation_motivation && (
        <div className="overflow-hidden bg-indigo-950 text-amber-300 py-3 rounded-2xl border border-indigo-900 shadow-sm flex items-center px-4">
          <Sparkles className="w-5 h-5 flex-shrink-0 mr-3 animate-pulse text-amber-400" />
          <div className="overflow-hidden whitespace-nowrap w-full">
            <p className="inline-block animate-marquee font-bold tracking-wide text-sm">
              {settings.graduation_motivation}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h4 className="font-extrabold text-slate-900">Kirim Artikel atau Karya</h4>
          <p className="text-xs text-slate-500 mt-1">Bagikan momen kelulusanmu atau tulis artikel inspiratif untuk mading sekolah.</p>
        </div>
        <button
          onClick={onOpenSubmitModal}
          className="py-2.5 px-5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-amber-300 shadow-xs"
        >
          <Send className="w-4 h-4" />
          <span>Kirim Karya Mading</span>
        </button>
      </div>

      `;

  const newLines = [
    ...lines.slice(0, startIdx),
    newSection,
    ...lines.slice(endIdx)
  ];

  fs.writeFileSync('src/components/StudentPortal/StudentPortalView.tsx', newLines.join('\n'));
} else {
  console.error("Could not find start or end index");
}
