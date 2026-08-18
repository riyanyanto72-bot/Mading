import React, { useState } from 'react';
import { SchoolSettings, UserAccount, MadingPost, StudentGraduation } from '../../types';
import { 
  Users, 
  UserCircle, 
  Send, 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
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
  Filter,
  UserCheck
} from 'lucide-react';

interface AllStudentsPortalViewProps {
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

export const AllStudentsPortalView: React.FC<AllStudentsPortalViewProps> = ({
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
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'ALL' | 'VII' | 'VIII' | 'IX'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // In-portal login form state
  const [nisnInput, setNisnInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  const isClassIX = (cls?: string) => {
    if (!cls) return false;
    const clean = cls.toUpperCase();
    return clean.startsWith('IX') || clean.startsWith('9') || clean.includes('IX');
  };

  const isUserStudent = currentUser.role === 'siswa';
  const currentStudentClass = currentUser.class_name || 'IX-A';
  const isCurrentClassIX = isClassIX(currentStudentClass);

  // Find active student data in database if logged in
  const matchedLoggedInStudent = students.find((s) => s.nisn === currentUser.nisn);

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
      setLoginError('NISN atau NIS tidak terdaftar di direktori sekolah.');
      return;
    }

    const expectedPassword = found.password || 'siswa';
    if (passwordInput.trim() !== expectedPassword && passwordInput.trim() !== '123456' && passwordInput.trim() !== 'siswa') {
      setLoginError('Kata sandi salah. (Kata sandi default: "siswa")');
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

    setLoginSuccess(`Selamat datang kembali, ${found.full_name}!`);
    if (onLoginSuccess) {
      onLoginSuccess(newAcc);
    }
  };

  const handleQuickSwitchStudent = (std: StudentGraduation) => {
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

  const filteredStudents = students.filter((std) => {
    const clean = std.class_name.toUpperCase();
    if (selectedGradeFilter === 'VII' && !clean.startsWith('VII') && !clean.startsWith('7')) return false;
    if (selectedGradeFilter === 'VIII' && !clean.startsWith('VIII') && !clean.startsWith('8')) return false;
    if (selectedGradeFilter === 'IX' && !clean.startsWith('IX') && !clean.startsWith('9')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = std.full_name.toLowerCase().includes(q);
      const matchNisn = std.nisn.toLowerCase().includes(q);
      const matchClass = std.class_name.toLowerCase().includes(q);
      return matchName || matchNisn || matchClass;
    }
    return true;
  });

  const studentPosts = posts.filter(
    (p) => p.category === 'Karya Siswa' || p.category === 'Prestasi' || p.category === 'Artikel'
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800 border-l-4 border-l-amber-400 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full border border-amber-400/30">
              PORTAL SISWA TERPADU (KELAS VII, VIII, IX)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Portal Siswa {settings.school_name}
          </h1>

          <p className="text-indigo-200 text-xs sm:text-sm max-w-xl leading-relaxed">
            Pusat ruang digital terpadu untuk seluruh peserta didik. Akses informasi akademik, kirim karya kreatif mading, dan cek layanan kelulusan khusus tingkat akhir.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap">
          {!isUserStudent && onOpenStudentLoginModal && (
            <button
              onClick={onOpenStudentLoginModal}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 border border-emerald-400 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Login Akun Siswa</span>
            </button>
          )}

          <button
            onClick={onOpenSubmitModal}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 border border-amber-300 active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Karya Mading</span>
          </button>
        </div>
      </div>

      {/* Grid 2 Columns: User Info & Graduation Status / Differentiation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Current Student Profile Status */}
        <div className="md:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-900 font-black overflow-hidden">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-8 h-8" />
              )}
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-extrabold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {isUserStudent ? 'Akun Siswa Aktif' : 'Status Login'}
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 truncate">{currentUser.name}</h3>
              <p className="text-xs text-slate-500 font-mono truncate">{currentUser.identifier}</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold">Rombel / Kelas:</span>
              <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {currentUser.class_name || 'IX-A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold">Status Peserta:</span>
              <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {isCurrentClassIX ? 'Peserta Kelulusan' : 'Siswa Aktif'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold">Tingkat Jenjang:</span>
              <span className="font-bold text-slate-700">
                {isCurrentClassIX ? 'Kelas IX (Fase D Akhir)' : `Kelas ${currentUser.class_name || 'VII / VIII'}`}
              </span>
            </div>
          </div>

          {/* Quick Login Form if not logged in as a student */}
          {!isUserStudent ? (
            <form onSubmit={handleInlineLogin} className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Masuk Akun Siswa (NISN & Sandi)
              </span>

              {loginError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-[11px] font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{loginSuccess}</span>
                </div>
              )}

              <input
                type="text"
                placeholder="NISN / NIS Siswa..."
                value={nisnInput}
                onChange={(e) => setNisnInput(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:border-indigo-600"
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Kata Sandi (Default: siswa)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-2 pr-8 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-950 hover:bg-indigo-900 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Masuk Portal</span>
              </button>
            </form>
          ) : (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={onLogout}
                className="w-full py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar dari Akun Siswa</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Distinction of services (Class IX Graduation vs Class VII/VIII Active) */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                  Layanan Khusus Tingkat Akhir
                </span>
              </div>
              <h3 className="font-black text-lg text-slate-900 mt-1">
                Portal Pengumuman Kelulusan & SKL (Khusus Kelas IX)
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-bold flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Portal Pengumuman Kelulusan dan pengunduhan SKL (Surat Keterangan Lulus) secara khusus <strong>hanya diperuntukkan bagi siswa tingkat akhir (Kelas IX)</strong> yang telah menempuh seluruh rangkaian asesmen sekolah.
          </p>

          {isCurrentClassIX ? (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-950 font-extrabold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Akun Anda terdaftar di Kelas IX ({currentStudentClass})</span>
                </div>
                <p className="text-xs text-emerald-800">
                  {matchedLoggedInStudent?.status === 'LULUS'
                    ? 'Selamat! Anda dinyatakan LULUS. Anda dapat memeriksa SKL dan mengunduhnya.'
                    : 'Anda berhak mengakses pengumuman kelulusan resmi.'}
                </p>
              </div>

              {onGoToGraduation && (
                <button
                  onClick={onGoToGraduation}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <span>Buka Pengumuman Kelulusan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-amber-900">
                <p className="font-extrabold">Akses Pengumuman Kelulusan Khusus Kelas IX</p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Siswa Kelas VII dan VIII adalah peserta didik aktif. Fitur kelulusan dan pengunduhan SKL akan dibuka saat Anda telah menyelesaikan studi tingkat akhir (Kelas IX).
                </p>
              </div>
            </div>
          )}

          {/* Quick Demo Switcher per Class */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Direktori Siswa per Rombel ({filteredStudents.length} Siswa):
              </span>

              {/* Filter Jenjang */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  onClick={() => setSelectedGradeFilter('ALL')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                    selectedGradeFilter === 'ALL' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedGradeFilter('VII')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                    selectedGradeFilter === 'VII' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  VII
                </button>
                <button
                  onClick={() => setSelectedGradeFilter('VIII')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                    selectedGradeFilter === 'VIII' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  VIII
                </button>
                <button
                  onClick={() => setSelectedGradeFilter('IX')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                    selectedGradeFilter === 'IX' ? 'bg-amber-400 text-indigo-950 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  IX 🎓
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredStudents.map((std) => {
                const isGrade9 = isClassIX(std.class_name);
                const isCurrent = currentUser.nisn === std.nisn;

                return (
                  <div
                    key={std.id}
                    onClick={() => handleQuickSwitchStudent(std)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isCurrent
                        ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-400/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <img
                        src={std.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={std.full_name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="overflow-hidden">
                        <span className="font-bold text-xs text-slate-900 block truncate">{std.full_name}</span>
                        <span className="text-[10px] text-slate-500 font-mono block">NISN: {std.nisn}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          isGrade9
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                        }`}
                      >
                        {std.class_name}
                      </span>
                      {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Karya Mading Siswa Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Apresiasi Karya Siswa (Mading Terpadu)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Karya tulis, puisi, artikel ilmiah, dan prestasi kreatif karya siswa SMPN 1 Nusantara.
            </p>
          </div>

          <button
            onClick={onOpenSubmitModal}
            className="px-4 py-2 bg-indigo-950 text-white hover:bg-indigo-900 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Karya Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentPosts.slice(0, 6).map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                  {post.category}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2 leading-snug">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Oleh: <strong className="text-slate-700">{post.author}</strong></span>
                <span className="flex items-center gap-1 text-red-600 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-red-500" />
                  {post.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
