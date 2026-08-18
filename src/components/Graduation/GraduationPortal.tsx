import React, { useState, useEffect } from 'react';
import { StudentGraduation, SchoolSettings, UserAccount } from '../../types';
import confetti from 'canvas-confetti';
import { GraduationCap, Search, CheckCircle2, AlertCircle, Clock, Lock, Sparkles, Download, RotateCcw, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

interface GraduationPortalProps {
  students: StudentGraduation[];
  settings: SchoolSettings;
  currentUser: UserAccount;
  onOpenRoleSwitcher?: () => void;
  onGoToAllStudentsPortal?: () => void;
}

export const GraduationPortal: React.FC<GraduationPortalProps> = ({
  students,
  settings,
  currentUser,
  onOpenRoleSwitcher,
  onGoToAllStudentsPortal,
}) => {
  const [nisnInput, setNisnInput] = useState('');
  const [searchResult, setSearchResult] = useState<StudentGraduation | null | 'NOT_FOUND' | 'NOT_CLASS_IX'>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isReleased, setIsReleased] = useState(true);

  // Check if current user is class IX
  const isClassIX = (cls?: string) => {
    if (!cls) return false;
    const clean = cls.toUpperCase();
    return clean.startsWith('IX') || clean.startsWith('9') || clean.includes('IX');
  };

  const isCurrentStudentNonClassIX = 
    currentUser.role === 'siswa' && !isClassIX(currentUser.class_name);

  useEffect(() => {
    let releaseTime = Date.now();
    if (settings.announcement_release_time) {
      const parsed = new Date(settings.announcement_release_time).getTime();
      if (!isNaN(parsed)) {
        releaseTime = parsed;
      }
    }

    const checkTime = () => {
      const now = Date.now();
      const diff = releaseTime - now;

      if (settings.is_release_unlocked || diff <= 0) {
        setIsReleased(true);
        setTimeLeft(null);
      } else {
        setIsReleased(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [settings.announcement_release_time, settings.is_release_unlocked]);

  // If current logged-in user is student in non-IX (e.g. VII or VIII), restrict view
  if (isCurrentStudentNonClassIX) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
        <div className="bg-white rounded-3xl p-8 border-2 border-amber-300 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto border border-amber-300 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              AKSES DIBATASI (KHUSUS KELAS IX)
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Portal Khusus Siswa Kelas IX (Tingkat Akhir)
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Halo <strong className="text-slate-900">{currentUser.name}</strong>, akun Anda terdeteksi sebagai siswa <strong>Kelas {currentUser.class_name}</strong>. 
              Portal pengumuman kelulusan dan unduh SKL hanya dapat diakses oleh siswa Kelas IX.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2 text-slate-700">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Ketentuan Akses Portal Kelulusan:</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              • Hanya siswa Kelas IX tahun ajaran 2025/2026 yang terdaftar dalam SK Kelulusan sekolah yang dapat mengakses portal ini.
            </p>
            <p className="text-slate-600 leading-relaxed">
              • Untuk siswa Kelas VII dan VIII, silakan mengakses <strong>Portal Semua Siswa</strong> untuk layanan mading dan kegiatan akademik aktif.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onGoToAllStudentsPortal && (
              <button
                onClick={onGoToAllStudentsPortal}
                className="px-5 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Buka Portal Semua Siswa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nisnInput.trim()) return;

    setHasSearched(true);
    const query = nisnInput.trim().toLowerCase();

    // Find student in graduation list (Class IX only)
    const found = students.find(
      (s) =>
        s.nisn.toLowerCase() === query ||
        s.nis.toLowerCase() === query ||
        s.full_name.toLowerCase().includes(query)
    );

    if (found) {
      // Ensure student belongs to class IX
      if (!isClassIX(found.class_name)) {
        setSearchResult('NOT_CLASS_IX');
        return;
      }

      setSearchResult(found);
      if (found.status === 'LULUS') {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
          });
        } catch {
          // ignore
        }
      }
    } else {
      setSearchResult('NOT_FOUND');
    }
  };

  const handleQuickDemo = (nisn: string) => {
    setNisnInput(nisn);
    const found = students.find((s) => s.nisn === nisn);
    if (found) {
      setHasSearched(true);
      setSearchResult(found);
      if (found.status === 'LULUS') {
        try {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }
    }
  };

  const resetSearch = () => {
    setNisnInput('');
    setSearchResult(null);
    setHasSearched(false);
  };

  const motivationMessage =
    settings.graduation_motivation ||
    'Selamat kepada seluruh siswa Kelas IX yang telah menyelesaikan pendidikan! Teruslah bermimpi, berusaha dengan gigih, dan jadilah kebanggaan orang tua serta almamater!';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Running Marquee Motivation Banner */}
      <div className="overflow-hidden bg-indigo-950 text-amber-300 py-3 px-4 rounded-2xl border border-indigo-900 shadow-md flex items-center gap-3">
        <div className="flex items-center gap-1 bg-amber-400 text-indigo-950 px-2.5 py-0.5 rounded-full text-xs font-black flex-shrink-0 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Motivasi</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <p className="animate-marquee font-bold tracking-wide text-sm text-amber-200">
            {motivationMessage} &nbsp;&nbsp;✦&nbsp;&nbsp; {motivationMessage}
          </p>
        </div>
      </div>

      {/* Header Portal Title */}
      <div className="text-center space-y-2.5 bg-indigo-950 text-white p-6 sm:p-10 rounded-2xl shadow-md border border-indigo-800 border-l-4 border-l-amber-400 relative overflow-hidden">
        <div className="w-12 h-12 bg-amber-400 text-indigo-950 rounded-xl flex items-center justify-center mx-auto border border-amber-300 mb-1 shadow-sm font-bold">
          <GraduationCap className="w-7 h-7" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/15 px-2.5 py-0.5 rounded border border-amber-400/30">
            PORTAL KHUSUS PENGUMUMAN KELULUSAN
          </span>
          <span className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-400/30">
            KHUSUS KELAS IX
          </span>
        </div>

        <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
          Pengumuman Kelulusan Siswa Kelas IX {settings.school_name}
        </h1>

        <p className="text-indigo-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Masukkan NISN (Nomor Induk Siswa Nasional) siswa <strong>Kelas IX</strong> untuk memeriksa status kelulusan dan mengunduh Surat Keterangan Lulus (SKL).
        </p>

        {/* Locked / Countdown Banner if not released */}
        {!isReleased && timeLeft && (
          <div className="mt-4 bg-amber-400/15 border border-amber-400/30 p-4 rounded-xl max-w-lg mx-auto text-amber-200 space-y-2">
            <div className="flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Pengumuman Belum Resmi Dibuka</span>
            </div>
            <p className="text-[11px] text-indigo-200">
              Pengumuman akan dibuka otomatis sesuai jadwal pada:
            </p>

            <div className="grid grid-cols-4 gap-2 pt-1 text-indigo-950">
              <div className="bg-amber-400 p-2 rounded text-center border border-amber-300">
                <span className="block text-xl font-black font-mono">{timeLeft.days}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">Hari</span>
              </div>
              <div className="bg-amber-400 p-2 rounded text-center border border-amber-300">
                <span className="block text-xl font-black font-mono">{timeLeft.hours}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">Jam</span>
              </div>
              <div className="bg-amber-400 p-2 rounded text-center border border-amber-300">
                <span className="block text-xl font-black font-mono">{timeLeft.minutes}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">Menit</span>
              </div>
              <div className="bg-amber-400 p-2 rounded text-center border border-amber-300">
                <span className="block text-xl font-black font-mono">{timeLeft.seconds}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">Detik</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Search Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        {!isReleased ? (
          <div className="text-center py-6 space-y-3">
            <Lock className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Sistem Pengumuman Sedang Dikunci</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Fitur pengecekan NISN akan aktif saat waktu pengumuman tiba.
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSearch} className="space-y-3.5 max-w-xl mx-auto">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Masukkan NISN Siswa Kelas IX <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0061234567 atau Nama Siswa Kelas IX"
                    value={nisnInput}
                    onChange={(e) => setNisnInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 focus:bg-white rounded-lg text-slate-900 font-mono font-bold text-base focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold rounded-lg text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-amber-300 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Lihat Pengumuman Kelulusan</span>
                </button>

                {hasSearched && (
                  <button
                    type="button"
                    onClick={resetSearch}
                    className="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Reset Pencarian"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </form>

            {/* Quick Demo Buttons */}
            <div className="pt-3 border-t border-slate-100 text-center space-y-2">
              <span className="text-xs font-bold text-slate-500">
                Uji Coba Data Siswa Kelas IX Cepat:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('0061234567')}
                  className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  🎓 Ahmad Rizky (IX-A) - LULUS
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('0064567890')}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  🎓 Dewa Ayu (IX-B) - LULUS
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('0065678901')}
                  className="px-2.5 py-1 bg-red-50 text-red-900 border border-red-300 rounded text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                >
                  ⚠️ Farhan (IX-C) - DITANGGUHKAN
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* SEARCH RESULT DISPLAY */}
      {hasSearched && searchResult === 'NOT_FOUND' && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-center space-y-2 animate-in fade-in duration-200">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
          <h3 className="text-base font-bold text-red-900">Data Siswa Tidak Terdaftar di Penetapan Kelulusan Kelas IX</h3>
          <p className="text-xs text-red-800 max-w-md mx-auto">
            Pastikan NISN yang dimasukkan adalah NISN siswa Kelas IX yang terdaftar dalam penetapan kelulusan tahun ini.
          </p>
        </div>
      )}

      {hasSearched && searchResult === 'NOT_CLASS_IX' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 text-center space-y-2 animate-in fade-in duration-200">
          <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-amber-900">NISN Ini Bukan Siswa Kelas IX</h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto">
            Hanya peserta didik Kelas IX yang memiliki data penetapan kelulusan dan SKL.
          </p>
        </div>
      )}

      {hasSearched && searchResult && typeof searchResult === 'object' && (
        <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Result Header */}
          <div
            className={`p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              searchResult.status === 'LULUS'
                ? 'bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900'
                : 'bg-gradient-to-r from-red-700 via-rose-800 to-red-900'
            }`}
          >
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded border border-white/20">
                PENGUMUMAN KELULUSAN RESMI KELAS IX
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                {searchResult.full_name}
              </h2>
              <p className="text-sm text-white/90 font-mono font-bold">
                NISN: {searchResult.nisn} &nbsp;|&nbsp; Kelas {searchResult.class_name}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0">
              {searchResult.status === 'LULUS' ? (
                <div className="bg-white text-emerald-900 px-6 py-3 rounded-2xl font-black text-xl shadow-lg flex items-center gap-2 border-2 border-emerald-400">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  <span>LULUS</span>
                </div>
              ) : (
                <div className="bg-white text-red-900 px-6 py-3 rounded-2xl font-black text-lg shadow-lg flex items-center gap-2 border-2 border-red-400">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <span>TIDAK LULUS</span>
                </div>
              )}
            </div>
          </div>

          {/* Simple Result Body */}
          <div className="p-6 space-y-6">
            {/* Simple Information Table (Nama, NISN, Kelas, Status) */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</span>
                  <span className="font-extrabold text-slate-900 text-base">{searchResult.full_name}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">NISN</span>
                  <span className="font-mono font-bold text-slate-900 text-base">{searchResult.nisn}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas</span>
                  <span className="font-bold text-slate-900 text-base">Kelas {searchResult.class_name}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Status Kelulusan</span>
                  <span className={`inline-block font-extrabold text-sm px-3 py-0.5 rounded-full ${
                    searchResult.status === 'LULUS'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {searchResult.status === 'LULUS' ? 'LULUS' : 'TIDAK LULUS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Motivational Moving Text Inside Result Card */}
            <div className="overflow-hidden bg-amber-50 border border-amber-300 py-2.5 px-4 rounded-xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 animate-pulse" />
              <div className="overflow-hidden whitespace-nowrap w-full">
                <p className="animate-marquee font-bold text-xs sm:text-sm text-amber-900">
                  {motivationMessage} &nbsp;&nbsp;✦&nbsp;&nbsp; {motivationMessage}
                </p>
              </div>
            </div>

            {/* Download SKL Section (Integrated with uploaded link) */}
            {searchResult.status === 'LULUS' && (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-extrabold text-emerald-950 text-base flex items-center justify-center sm:justify-start gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Surat Keterangan Lulus (SKL) Siswa Kelas IX</span>
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {searchResult.skl_custom_url
                      ? 'SKL resmi digital telah tersedia untuk diunduh melalui tautan yang diunggah oleh sekolah.'
                      : 'Tautan SKL sedang dalam proses unggah oleh pihak sekolah.'}
                  </p>
                </div>

                {searchResult.skl_custom_url ? (
                  <a
                    href={searchResult.skl_custom_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm uppercase tracking-wider shadow-md transition-all flex items-center gap-2 border border-emerald-400 active:scale-95 cursor-pointer flex-shrink-0"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download SKL</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="px-5 py-2.5 bg-slate-200 text-slate-500 font-bold rounded-xl text-xs flex items-center gap-2 cursor-not-allowed flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Link Belum Diunggah</span>
                  </button>
                )}
              </div>
            )}

            {searchResult.status !== 'LULUS' && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center sm:text-left">
                <p className="text-xs text-red-800 leading-relaxed font-medium">
                  {searchResult.note || 'Harap segera menghubungi pihak sekolah atau wali kelas untuk informasi lebih lanjut mengenai status kelulusan Anda.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
