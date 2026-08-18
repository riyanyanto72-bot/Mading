import React, { useState } from 'react';
import { SchoolSettings, UserAccount, MadingPost, StudentGraduation } from '../../types';
import { 
  UserCheck, 
  UserCircle, 
  GraduationCap, 
  Send, 
  BookOpen, 
  Sparkles, 
  Lock, 
  LogOut, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  MessageSquare,
  Award,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  Search,
  School,
  IdCard,
  FileText,
  User,
  Users,
  MapPin,
  Download
} from 'lucide-react';

interface StudentProfileViewProps {
  settings: SchoolSettings;
  currentUser: UserAccount;
  posts: MadingPost[];
  students?: StudentGraduation[];
  onOpenSubmitModal: () => void;
  onSelectPost: (post: MadingPost) => void;
  onGoToGraduation?: () => void;
  onLoginSuccess?: (user: UserAccount) => void;
  onLogout?: () => void;
  onOpenStudentLoginModal?: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  settings,
  currentUser,
  posts,
  students = [],
  onOpenSubmitModal,
  onSelectPost,
  onGoToGraduation,
  onLoginSuccess,
  onLogout,
  onOpenStudentLoginModal,
}) => {
  // In-portal login form state
  const [nisnInput, setNisnInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [quickSelectSearch, setQuickSelectSearch] = useState('');
  const [quickSelectGrade, setQuickSelectGrade] = useState<'ALL' | 'VII' | 'VIII' | 'IX'>('ALL');

  const isUserStudent = currentUser.role === 'siswa';

  // Find active student data in database if logged in
  const matchedLoggedInStudent = students.find(
    (s) => s.nisn === currentUser.nisn || (currentUser.name && s.full_name.toLowerCase() === currentUser.name.toLowerCase())
  );

  const isClassIX = (cls?: string) => {
    if (!cls) return false;
    const clean = cls.toUpperCase();
    return clean.startsWith('IX') || clean.startsWith('9') || clean.includes('IX');
  };

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    const query = nisnInput.trim();
    if (!query) {
      setLoginError('Harap masukkan NISN atau NIS siswa.');
      return;
    }

    const found = students.find(
      (s) => s.nisn === query || s.nis === query || s.nisn.toLowerCase() === query.toLowerCase()
    );

    if (!found) {
      setLoginError('NISN atau NIS tidak ditemukan di database sekolah. Pastikan nomor sudah benar.');
      return;
    }

    const expectedPassword = found.password || 'siswa';
    if (
      passwordInput.trim() !== expectedPassword &&
      passwordInput.trim() !== 'siswa123' &&
      passwordInput.trim() !== 'siswa' &&
      passwordInput.trim() !== '123456'
    ) {
      setLoginError('Kata sandi salah. (Kata sandi default: "siswa123" atau "siswa")');
      return;
    }

    const newAcc: UserAccount = {
      id: `usr-${found.nisn}`,
      name: found.full_name,
      role: 'siswa',
      roleLabel: `Siswa Kelas ${found.class_name}`,
      identifier: `NISN: ${found.nisn} | Kelas ${found.class_name}`,
      class_name: found.class_name,
      nisn: found.nisn,
      avatar: found.avatar,
    };

    setLoginSuccess(`Login berhasil! Selamat datang, ${found.full_name}.`);
    if (onLoginSuccess) {
      onLoginSuccess(newAcc);
    }
  };

  const handleQuickLoginAsStudent = (std: StudentGraduation) => {
    const newAcc: UserAccount = {
      id: `usr-${std.nisn}`,
      name: std.full_name,
      role: 'siswa',
      roleLabel: `Siswa Kelas ${std.class_name}`,
      identifier: `NISN: ${std.nisn} | Kelas ${std.class_name}`,
      class_name: std.class_name,
      nisn: std.nisn,
      avatar: std.avatar,
    };
    if (onLoginSuccess) {
      onLoginSuccess(newAcc);
    }
  };

  // Filtered student posts
  const myPosts = posts.filter(
    (p) =>
      (currentUser.name && p.author.toLowerCase().includes(currentUser.name.toLowerCase())) ||
      (matchedLoggedInStudent && p.author.toLowerCase().includes(matchedLoggedInStudent.full_name.toLowerCase()))
  );

  // Quick select helper list
  const filteredQuickStudents = students.filter((s) => {
    if (quickSelectGrade !== 'ALL') {
      const cls = s.class_name.toUpperCase();
      if (quickSelectGrade === 'VII' && !cls.startsWith('VII') && !cls.startsWith('7')) return false;
      if (quickSelectGrade === 'VIII' && !cls.startsWith('VIII') && !cls.startsWith('8')) return false;
      if (quickSelectGrade === 'IX' && !cls.startsWith('IX') && !cls.startsWith('9')) return false;
    }
    if (quickSelectSearch.trim()) {
      const q = quickSelectSearch.toLowerCase();
      return (
        s.full_name.toLowerCase().includes(q) ||
        s.nisn.toLowerCase().includes(q) ||
        s.class_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800 border-l-4 border-l-amber-400 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full border border-amber-400/30">
              PROFIL SISWA & PORTAL PESERTA DIDIK
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <UserCircle className="w-8 h-8 text-amber-400" />
            <span>Profil Siswa {settings.school_name}</span>
          </h1>

          <p className="text-indigo-200 text-xs sm:text-sm max-w-xl leading-relaxed">
            Halaman profil data pribadi peserta didik. Siswa dapat login menggunakan NISN dan Kata Sandi untuk melihat biodata resmi, kartu pelajar, status kelulusan (kelas IX), dan karya mading.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap">
          {isUserStudent ? (
            <button
              onClick={onOpenSubmitModal}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 border border-amber-300 active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Karya Mading</span>
            </button>
          ) : (
            onOpenStudentLoginModal && (
              <button
                onClick={onOpenStudentLoginModal}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 border border-emerald-400 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Buka Pop-up Login</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KONDISI 1: JIKA SISWA SUDAH LOGIN */}
      {/* ========================================================================= */}
      {isUserStudent ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Status Bar / User Welcome Banner */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Foto Siswa" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-200/70 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Akun Siswa Sedang Aktif
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                  {currentUser.name}
                </h2>
                <p className="text-xs text-slate-600 font-mono">
                  {currentUser.identifier}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  else if (onOpenStudentLoginModal) onOpenStudentLoginModal();
                }}
                className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Keluar dari akun siswa ini"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Ganti / Logout Siswa</span>
              </button>
            </div>
          </div>

          {/* Kartu Profil & Pelajar Digital */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Kolom 1: Kartu Pelajar Digital Resmi */}
            <div className="md:col-span-1 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border-2 border-amber-400 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
              
              {/* Background Watermark Pattern */}
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
                <School className="w-48 h-48 text-white" />
              </div>

              {/* Card Header */}
              <div className="border-b border-indigo-700/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs flex-shrink-0">
                    {settings.logo_url ? (
                      <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <GraduationCap className="w-5 h-5 text-indigo-950" />
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-amber-300 uppercase tracking-widest block">
                      KARTU IDENTITAS SISWA
                    </span>
                    <h3 className="text-xs font-black tracking-tight leading-tight">
                      {settings.school_name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="py-4 space-y-3 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="w-20 h-24 rounded-xl bg-indigo-800/80 border-2 border-amber-400 overflow-hidden shadow flex-shrink-0 flex items-center justify-center">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-indigo-300" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                      KELAS {matchedLoggedInStudent?.class_name || currentUser.class_name || 'IX-A'}
                    </span>
                    <h4 className="font-black text-sm text-white leading-tight">
                      {currentUser.name}
                    </h4>
                    <p className="text-[11px] text-indigo-200 font-mono">
                      NISN: <strong>{matchedLoggedInStudent?.nisn || currentUser.nisn || '-'}</strong>
                    </p>
                    <p className="text-[11px] text-indigo-200 font-mono">
                      NIS: <strong>{matchedLoggedInStudent?.nis || '-'}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-900/60 rounded-xl p-2.5 border border-indigo-700/60 text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-indigo-300">Tahun Ajaran:</span>
                    <span className="font-bold text-white">{settings.academic_year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-300">NPSN:</span>
                    <span className="font-mono text-white">{settings.npsn}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-t border-indigo-700/80 pt-2.5 flex items-center justify-between text-[10px] text-indigo-300">
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Terverifikasi Sistem
                </span>
                <span>{settings.address.split(',')[0]}</span>
              </div>
            </div>

            {/* Kolom 2 & 3: Detail Biodata & Layanan Siswa */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Detail Biodata Lengkap */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <IdCard className="w-5 h-5 text-indigo-600" />
                    <span>Data Pokok Peserta Didik (Dapodik)</span>
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    Status: Siswa Aktif
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Nama Lengkap Siswa
                    </span>
                    <p className="font-black text-slate-900 text-sm">
                      {currentUser.name}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Kelas & Rombel
                    </span>
                    <p className="font-black text-indigo-950 text-sm">
                      Kelas {matchedLoggedInStudent?.class_name || currentUser.class_name || 'IX-A'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Nomor Induk Siswa Nasional (NISN)
                    </span>
                    <p className="font-mono font-bold text-slate-800">
                      {matchedLoggedInStudent?.nisn || currentUser.nisn || '-'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Nomor Induk Siswa (NIS)
                    </span>
                    <p className="font-mono font-bold text-slate-800">
                      {matchedLoggedInStudent?.nis || '-'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Tempat, Tanggal Lahir
                    </span>
                    <p className="font-medium text-slate-800">
                      {matchedLoggedInStudent?.birth_place ? `${matchedLoggedInStudent.birth_place}, ` : ''}
                      {matchedLoggedInStudent?.birth_date || '15 Mei 2009'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Nama Orang Tua / Wali
                    </span>
                    <p className="font-medium text-slate-800">
                      {matchedLoggedInStudent?.parent_name || 'H. Ahmad Supriyadi'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Kelulusan (Jika Siswa Kelas IX) */}
              {isClassIX(matchedLoggedInStudent?.class_name || currentUser.class_name) && (
                <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-2 border-amber-400 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center shadow-xs font-black">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                          LAYANAN SISWA KELAS IX
                        </span>
                        <h4 className="font-black text-slate-900 text-base">
                          Status Pengumuman Kelulusan & SKL
                        </h4>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                      matchedLoggedInStudent?.status === 'LULUS'
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : matchedLoggedInStudent?.status === 'TIDAK_LULUS'
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-amber-400 text-indigo-950 border-amber-500'
                    }`}>
                      {matchedLoggedInStudent?.status === 'LULUS' ? 'Dinyatakan LULUS' : matchedLoggedInStudent?.status || 'AKTIF / TERDAFTAR'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Siswa tingkat akhir kelas IX dapat memeriksa dokumen kelulusan resmi, transkrip nilai, dan mengunduh Surat Keterangan Lulus (SKL) Digital.
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    {onGoToGraduation && (
                      <button
                        onClick={onGoToGraduation}
                        className="px-4 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4 text-amber-400" />
                        <span>Buka Halaman Portal Kelulusan</span>
                      </button>
                    )}

                    {matchedLoggedInStudent?.skl_custom_url && (
                      <a
                        href={matchedLoggedInStudent.skl_custom_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-xs transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download SKL Siswa (PDF/Drive)</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bagian 2: Karya Mading Siswa */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <span>Karya & Tulisan Mading Saya</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar karya tulis, puisi, cerita pendek, atau artikel yang Anda terbitkan di Mading Digital.
                </p>
              </div>

              <button
                onClick={onOpenSubmitModal}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-indigo-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>+ Tulis Karya Baru</span>
              </button>
            </div>

            {myPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{post.date}</span>
                      </div>
                      <h4 className="font-black text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {post.excerpt || post.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-rose-500 font-bold">
                          <Heart className="w-3.5 h-3.5 fill-rose-500" /> {post.likes || 0}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 font-bold">
                          <MessageSquare className="w-3.5 h-3.5" /> {post.comments?.length || 0}
                        </span>
                      </div>
                      <span className="text-indigo-600 font-bold text-[11px] group-hover:underline">
                        Baca Selengkapnya →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-800">Belum Ada Karya yang Dipublikasikan</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Ayo bagikan puisi, cerpen, tips belajar, atau artikel prestasimu untuk ditampilkan di Mading Sekolah!
                  </p>
                </div>
                <button
                  onClick={onOpenSubmitModal}
                  className="px-4 py-2 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Kirim Karya Pertama Sekarang
                </button>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* KONDISI 2: JIKA BELUM LOGIN SEBAGAI SISWA (TAMPILKAN FORM LOGIN & SELECTOR) */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Formulir Login Siswa Langsung */}
            <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-900 shadow-xl space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-11 h-11 rounded-2xl bg-indigo-950 text-amber-400 flex items-center justify-center shadow font-black">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">
                    FORMULIR AUTENTIKASI SISWA
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    Masuk ke Profil Siswa
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Silakan masukkan <strong>NISN atau NIS</strong> dan <strong>Kata Sandi</strong> yang telah diberikan oleh sekolah.
              </p>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>{loginSuccess}</span>
                </div>
              )}

              <form onSubmit={handleInlineLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Nomor NISN atau NIS Siswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0081234567 atau 23240901"
                    value={nisnInput}
                    onChange={(e) => setNisnInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Tips: Anda bisa mencari nomor NISN pada daftar siswa di sebelah kanan.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Masukkan kata sandi akun"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Password bawaan/default: <strong>siswa123</strong> atau <strong>siswa</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-950 hover:bg-indigo-900 text-amber-300 hover:text-amber-200 font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 border border-indigo-800 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Masuk & Buka Profil Siswa</span>
                </button>
              </form>
            </div>

            {/* Right: Pemilih Akun Siswa Cepat (Quick Demo Selector) */}
            <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      AKSES CEPAT UJI COBA
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">
                      Pilih Siswa Langsung (Semua Kelas)
                    </h3>
                  </div>
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                    {students.length} Siswa
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2 mb-3">
                  Klik pada salah satu nama siswa di bawah untuk langsung menguji tampilan profil siswa:
                </p>

                {/* Filter Kelas */}
                <div className="flex items-center gap-1.5 mb-3 overflow-x-auto">
                  {(['ALL', 'VII', 'VIII', 'IX'] as const).map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setQuickSelectGrade(grade)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                        quickSelectGrade === grade
                          ? 'bg-indigo-950 text-amber-300 shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {grade === 'ALL' ? 'Semua' : `Kelas ${grade}`}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama atau NISN siswa..."
                    value={quickSelectSearch}
                    onChange={(e) => setQuickSelectSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                {/* Daftar Siswa Cepat */}
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {filteredQuickStudents.slice(0, 10).map((std) => (
                    <div
                      key={std.id}
                      onClick={() => handleQuickLoginAsStudent(std)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {std.full_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {std.full_name}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Kelas {std.class_name} • NISN: {std.nisn}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white px-2 py-1 rounded-md transition-all flex-shrink-0">
                        Pilih →
                      </span>
                    </div>
                  ))}

                  {filteredQuickStudents.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">
                      Tidak ditemukan data siswa yang cocok.
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-[11px] text-amber-900 space-y-1">
                <span className="font-black flex items-center gap-1 text-amber-950">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Info Akses Siswa:
                </span>
                <p>
                  Siswa dapat login kapan saja untuk melihat kartu pelajar, status kelulusan, dan mengirim karya ke mading sekolah.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
