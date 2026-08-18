const fs = require('fs');
let content = fs.readFileSync('src/components/Admin/AdminDashboard.tsx', 'utf8');

// I will just replace the whole Tab 2 content to clean it up since we don't need subjects grading anymore.
const startTab2 = content.indexOf('{/* TAB 2: DATA KELULUSAN & NILAI */}');
const endTab2 = content.indexOf('{/* ========================================================= */}', startTab2 + 100);

const tab2Replacement = `{/* TAB 2: DATA KELULUSAN */}
      {/* ========================================================= */}
      {activeTab === 'kelulusan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  Data Siswa & Status Kelulusan
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kelola data siswa, NISN, status kelulusan, dan tautan SKL khusus.
                </p>
              </div>
              <button
                onClick={() => setEditingStudent({
                  id: \`std-\${Date.now()}\`,
                  nisn: '', nis: '', full_name: '', class_name: '', birth_date: '', birth_place: '', parent_name: '', status: 'BELUM_DIBUKA'
                })}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Siswa</span>
              </button>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-100 text-slate-700 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nama / Kelas</th>
                    <th className="py-3 px-4">NISN / NIS</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{student.full_name}</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">Kelas {student.class_name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-700 font-semibold">{student.nisn}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{student.nis}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={\`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider \${
                          student.status === 'LULUS'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : student.status === 'DITANGGUHKAN'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : student.status === 'TIDAK_LULUS'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }\`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="p-1.5 bg-slate-100 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Data Dasar Siswa"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Yakin ingin menghapus siswa ini?')) {
                              onUpdateStudents(students.filter((s) => s.id !== student.id));
                            }
                          }}
                          className="p-1.5 bg-slate-100 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 italic">
                        Belum ada data siswa
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      `;

let preTab2 = content.substring(0, startTab2);
let postTab2 = content.substring(endTab2);
fs.writeFileSync('src/components/Admin/AdminDashboard.tsx', preTab2 + tab2Replacement + postTab2);
