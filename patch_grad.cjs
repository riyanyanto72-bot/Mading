const fs = require('fs');
const content = fs.readFileSync('src/components/Graduation/GraduationPortal.tsx', 'utf8');

// remove onOpenSkl from props
let newContent = content.replace(/  onOpenSkl: \(student: StudentGraduation\) => void;\n/g, '');
newContent = newContent.replace(/  onOpenSkl,\n/g, '');

// replace the entire button section for SKL
newContent = newContent.replace(/<span className="text-\[10px\] text-slate-500 font-extrabold uppercase">Sertifikat SKL<\/span>[\s\S]*?<\/button>[\s\S]*?Buka File PDF\/Drive<\/span>[\s\S]*?<\/a>[\s\S]*?}\s*<\/div>/, `<span className="text-[10px] text-slate-500 font-extrabold uppercase">Sertifikat SKL</span>
                <div className="flex flex-col gap-1.5">
                  {searchResult.skl_custom_url && searchResult.status === 'LULUS' ? (
                    <a
                      href={searchResult.skl_custom_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1 px-3 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black rounded-lg text-[11px] flex items-center justify-center gap-1 border border-amber-300 uppercase tracking-wider"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Download SKL</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Belum tersedia</span>
                  )}
                </div>`);

newContent = newContent.replace(/<button\s*onClick={\(\) => onOpenSkl\(searchResult\)}[\s\S]*?<\/button>/, '');

fs.writeFileSync('src/components/Graduation/GraduationPortal.tsx', newContent);
