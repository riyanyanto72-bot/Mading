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
  Download,
  Camera,
  Upload,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { EditStudentPhotoModal } from './EditStudentPhotoModal';

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
  onUpdateStudentPhoto?: (studentId: string, newAvatarUrl: string) => void;
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
  onUpdateStudentPhoto,
}) => {
  // In-portal login form state
  const [nisnInput, setNisnInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Modal & Toast state for student self-service photo
  const [isEditPhotoModalOpen, setIsEditPhotoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isUserStudent = currentUser.role === 'siswa';

  // Find active student data in database if logged in
  const matchedLoggedInStudent = students.find(
    (s) =>
      s.id === currentUser.id ||
      (currentUser.nisn && s.nisn && s.nisn.replace(/\s+/g, '') === currentUser.nisn.replace(/\s+/g, '')) ||
      (currentUser.name && s.full_name && s.full_name.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
  );

  const isClassIX = (cls?: string) => {
    if (!cls) return false;
    const clean = cls.toUpperCase();
    return clean.startsWith('IX') || clean.startsWith('9') || clean.includes('IX');
  };

  const handleSaveStudentPhoto = (newAvatarUrl: string) => {
    const studentId = matchedLoggedInStudent?.id || currentUser.id;
    if (onUpdateStudentPhoto && studentId) {
      onUpdateStudentPhoto(studentId, newAvatarUrl);
    }
    setToastMessage('Foto profil Anda berhasil diperbarui!');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
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

  // Filtered student posts
  const myPosts = posts.filter(
    (p) =>
      (currentUser.name && p.author.toLowerCase().includes(currentUser.name.toLowerCase())) ||
      (matchedLoggedInStudent && p.author.toLowerCase().includes(matchedLoggedInStudent.full_name.toLowerCase()))
  );

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
          ) : null}
        </div>
      </div>

      {/* Toast Notification for Profile Photo Update */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <h5 className="font-black text-xs">Foto Siswa Berhasil Diperbarui</h5>
            <p className="text-[11px] text-emerald-100">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* KONDISI 1: JIKA SISWA SUDAH LOGIN */}
      {/* ========================================================================= */}
      {isUserStudent ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Status Bar / User Welcome Banner */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Foto Siswa" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditPhotoModalOpen(true)}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-900 hover:bg-indigo-800 text-white rounded-full flex items-center justify-center border-2 border-white shadow cursor-pointer transition-transform hover:scale-110"
                  title="Ganti Foto Profil"
                >
                  <Camera className="w-3 h-3 text-amber-300" />
                </button>
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
                type="button"
                onClick={() => setIsEditPhotoModalOpen(true)}
                className="flex-1 sm:flex-initial px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer border border-indigo-700"
                title="Ganti Pas Foto Siswa"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Ganti Foto Saya</span>
              </button>

              <button
                onClick={() => {
                  if (onLogout) onLogout();
                }}
                className="flex-1 sm:flex-initial px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Keluar dari akun siswa ini"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Logout Siswa</span>
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
                  {/* Foto Siswa dengan Interaktif Edit */}
                  <div className="relative group">
                    <div className="w-20 h-24 rounded-xl bg-indigo-800/80 border-2 border-amber-400 overflow-hidden shadow flex-shrink-0 flex items-center justify-center">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-indigo-300" />
                      )}
                    </div>
                    
                    {/* Hover Button on Avatar */}
                    <button
                      type="button"
                      onClick={() => setIsEditPhotoModalOpen(true)}
                      className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 rounded-xl flex flex-col items-center justify-center text-amber-300 text-[10px] font-black transition-opacity cursor-pointer p-1 text-center"
                      title="Klik untuk mengganti foto"
                    >
                      <Camera className="w-5 h-5 mb-0.5 text-amber-400" />
                      <span>Ganti Foto</span>
                    </button>
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

                {/* Quick Edit Photo Link on Card */}
                <button
                  type="button"
                  onClick={() => setIsEditPhotoModalOpen(true)}
                  className="w-full py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-indigo-950 text-[11px] font-black rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Kelola & Ganti Pas Foto</span>
                </button>
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
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditPhotoModalOpen(true)}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 rounded-lg text-xs font-black border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ganti Pas Foto</span>
                    </button>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      Status: Siswa Aktif
                    </span>
                  </div>
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
                   <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border-2 border-indigo-900 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 border-2 border-indigo-100 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                Akses Profil Siswa
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Silakan masuk menggunakan tombol <strong>Login</strong> di pojok kanan atas layar menggunakan NISN dan Kata Sandi Anda untuk melihat profil dan mencetak kartu pelajar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Pas Foto Siswa */}
      <EditStudentPhotoModal
        isOpen={isEditPhotoModalOpen}
        onClose={() => setIsEditPhotoModalOpen(false)}
        currentAvatar={matchedLoggedInStudent?.avatar || currentUser.avatar || ''}
        studentName={currentUser.name}
        studentClass={matchedLoggedInStudent?.class_name || currentUser.class_name || 'IX'}
        studentNisn={matchedLoggedInStudent?.nisn || currentUser.nisn || currentUser.identifier}
        onSavePhoto={handleSaveStudentPhoto}
      />

    </div>
  );
};
