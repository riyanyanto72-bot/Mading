import React, { useState } from 'react';
import { StudentGraduation, SchoolSettings, UserAccount } from '../../types';
import { GraduationCap, Lock, User, CheckCircle2, AlertCircle, KeyRound, LogOut, Sparkles, Send, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentPortalViewProps {
  students: StudentGraduation[];
  onUpdateStudents: (students: StudentGraduation[]) => void;
  settings: SchoolSettings;
  currentUser: UserAccount;
  onOpenSubmitModal: () => void;
  onStudentLoggedInAsUser?: (student: StudentGraduation) => void;
  onLoginSuccess?: (student: StudentGraduation) => void;
  onLogout?: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  students,
  onUpdateStudents,
  settings,
  currentUser,
  onOpenSubmitModal,
  onStudentLoggedInAsUser,
  onLoginSuccess,
  onLogout,
}) => {
  // Login form state
  const [nisnInput, setNisnInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active logged in student in this portal session
  const [loggedStudent, setLoggedStudent] = useState<StudentGraduation | null>(() => {
    if (currentUser.role === 'siswa') {
      const match = students.find(
        (s) =>
          s.full_name === currentUser.name ||
          (currentUser.nisn && s.nisn === currentUser.nisn) ||
          s.nisn === currentUser.identifier.replace(/\D/g, '')
      );
      if (match) return match;
    }
    return null;
  });

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Handle Login Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const query = nisnInput.trim().toLowerCase();
    const student = students.find(
      (s) => s.nisn.toLowerCase() === query || s.nis.toLowerCase() === query
    );

    if (!student) {
      setLoginError('NISN tidak terdaftar di sistem.');
      return;
    }

    const validPassword = student.password || 'siswa';
    const cleanBirth = student.birth_date ? student.birth_date.replace(/-/g, '') : '';

    if (
      passwordInput !== validPassword &&
      passwordInput !== 'siswa' &&
      passwordInput !== cleanBirth &&
      passwordInput !== student.birth_date
    ) {
      setLoginError('Kata sandi salah. Gunakan kata sandi bawaan "siswa".');
      return;
    }

    setLoggedStudent(student);
    if (onLoginSuccess) {
      onLoginSuccess(student);
    }
    if (onStudentLoggedInAsUser) {
      onStudentLoggedInAsUser(student);
    }

    if (student.status === 'LULUS') {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setLoggedStudent(null);
    setNisnInput('');
    setPasswordInput('');
    setLoginError('');
    if (onLogout) {
      onLogout();
    }
  };

  // Handle Save New Password
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedStudent || !newPassword.trim()) return;

    const updated = students.map((s) => {
      if (s.id === loggedStudent.id) {
        return { ...s, password: newPassword.trim() };
      }
      return s;
    });

    onUpdateStudents(updated);
    setLoggedStudent({ ...loggedStudent, password: newPassword.trim() });
    setShowChangePassword(false);
    setNewPassword('');
    alert('Kata sandi akun Anda berhasil diperbarui!');
  };

  const motivationMessage =
    settings.graduation_motivation ||
    'Selamat kepada para siswa yang telah menyelesaikan masa studi! Raih cita-citamu setinggi langit!';

  // IF NOT LOGGED IN: SHOW LOGIN FORM
  if (!loggedStudent) {
    return (
      <div className="max-w-xl mx-auto py-6 px-4 space-y-6">
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

        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-indigo-950 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-md border-2 border-amber-400 font-bold">
            <GraduationCap className="w-8 h-8" />
          </div>
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-indigo-900 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
            PORTAL SISWA
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Login Portal Siswa
          </h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Masuk dengan NISN untuk mengecek status kelulusan dan mengunduh SKL.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                NISN Siswa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: 0061234567"
                  value={nisnInput}
                  onChange={(e) => setNisnInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl text-slate-900 font-mono font-bold text-sm focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Default: siswa"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl text-slate-900 text-sm focus:outline-none transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                *Kata sandi bawaan adalah <strong className="text-slate-700">siswa</strong>.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 border border-amber-300 active:scale-95 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Masuk Portal Siswa</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // IF LOGGED IN: SHOW STUDENT DASHBOARD
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

      {/* Student Welcome Header Card */}
      <div className="bg-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800 border-l-4 border-l-amber-400 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full border border-amber-400/30">
              DATA KELULUSAN SISWA
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            {loggedStudent.full_name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-200 font-mono">
            <span>NISN: <strong className="text-white">{loggedStudent.nisn}</strong></span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <button
            onClick={() => setShowChangePassword(true)}
            className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-indigo-100 rounded-xl text-xs font-bold border border-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Ubah kata sandi"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Ganti Sandi</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-900/80 hover:bg-red-800 text-red-100 rounded-xl text-xs font-bold border border-red-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Keluar dari akun siswa"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Graduation Status Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Siswa</span>
            <span className="font-extrabold text-slate-900 text-lg">{loggedStudent.full_name}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">NISN</span>
            <span className="font-mono font-bold text-slate-900 text-lg">{loggedStudent.nisn}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Status Kelulusan</span>
            <span className={`inline-block font-extrabold text-sm px-3.5 py-1 rounded-full mt-0.5 ${
              loggedStudent.status === 'LULUS'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {loggedStudent.status === 'LULUS' ? 'LULUS' : 'TIDAK LULUS'}
            </span>
          </div>
        </div>

        {/* Motivational Banner Inside Result */}
        <div className="overflow-hidden bg-amber-50 border border-amber-300 py-3 px-4 rounded-2xl flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 animate-pulse" />
          <div className="overflow-hidden whitespace-nowrap w-full">
            <p className="animate-marquee font-bold text-xs sm:text-sm text-amber-900">
              {motivationMessage} &nbsp;&nbsp;✦&nbsp;&nbsp; {motivationMessage}
            </p>
          </div>
        </div>

        {/* SKL Download Card */}
        {loggedStudent.status === 'LULUS' ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-extrabold text-emerald-950 text-base flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Unduh Surat Keterangan Lulus (SKL)</span>
              </h4>
              <p className="text-xs text-emerald-800">
                {loggedStudent.skl_custom_url
                  ? 'Dokumen SKL resmi Anda siap diunduh melalui tautan yang telah diunggah sekolah.'
                  : 'Tautan dokumen SKL sedang dipersiapkan oleh pihak sekolah.'}
              </p>
            </div>

            {loggedStudent.skl_custom_url ? (
              <a
                href={loggedStudent.skl_custom_url}
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
        ) : (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center sm:text-left">
            <p className="text-xs text-red-800 leading-relaxed font-medium">
              {loggedStudent.note || 'Harap segera menghubungi pihak sekolah atau wali kelas untuk informasi kelulusan Anda.'}
            </p>
          </div>
        )}
      </div>

      {/* Karya Mading Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h4 className="font-extrabold text-slate-900">Kirim Karya ke Mading Sekolah</h4>
          <p className="text-xs text-slate-500 mt-1">Bagikan kesan, puisi, atau artikel inspiratif untuk mading digital sekolah.</p>
        </div>
        <button
          onClick={onOpenSubmitModal}
          className="py-2.5 px-5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-amber-300 shadow-xs cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Kirim Karya Mading</span>
        </button>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Ubah Kata Sandi Akun Siswa</h3>
            <form onSubmit={handleSavePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandi baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-950 text-white rounded-xl text-xs font-extrabold cursor-pointer"
                >
                  Simpan Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
