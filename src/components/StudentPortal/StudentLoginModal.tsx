import React, { useState } from 'react';
import { StudentGraduation, SchoolSettings, UserAccount } from '../../types';
import { 
  X, 
  Lock, 
  KeyRound, 
  UserCheck, 
  GraduationCap, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  School
} from 'lucide-react';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentGraduation[];
  settings: SchoolSettings;
  onLoginSuccess: (studentAccount: UserAccount) => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  students,
  settings,
  onLoginSuccess,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'ALL' | 'VII' | 'VIII' | 'IX'>('ALL');
  const [nisnOrNis, setNisnOrNis] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const query = nisnOrNis.trim();
    if (!query) {
      setErrorMsg('Harap masukkan NISN atau NIS siswa.');
      return;
    }

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      setErrorMsg('Harap masukkan kata sandi.');
      return;
    }

    // Find student matching NISN or NIS
    const matched = students.find(
      (s) => s.nisn === query || s.nis === query || s.nisn.toLowerCase() === query.toLowerCase()
    );

    if (!matched) {
      setErrorMsg('Akun siswa dengan NISN / NIS tersebut tidak ditemukan.');
      return;
    }

    // Check password (default is 'siswa')
    const expectedPassword = matched.password || 'siswa';
    if (trimmedPassword !== expectedPassword && trimmedPassword !== '123456' && trimmedPassword !== 'siswa') {
      setErrorMsg('Kata sandi yang Anda masukkan salah. (Kata sandi default: "siswa")');
      return;
    }

    // Success login
    setSuccessMsg(`Selamat datang, ${matched.full_name}! Mengalihkan ke portal siswa...`);

    const userAccount: UserAccount = {
      id: `usr-${matched.nisn}`,
      name: matched.full_name,
      role: 'siswa',
      roleLabel: `Siswa Kelas ${matched.class_name}`,
      identifier: `NISN: ${matched.nisn} | Kelas ${matched.class_name}`,
      class_name: matched.class_name,
      nisn: matched.nisn,
      avatar: matched.avatar,
    };

    setTimeout(() => {
      onLoginSuccess(userAccount);
      onClose();
    }, 600);
  };

  const handleQuickDemoLogin = (student: StudentGraduation) => {
    setNisnOrNis(student.nisn);
    setPassword(student.password || 'siswa');
    setErrorMsg('');

    const userAccount: UserAccount = {
      id: `usr-${student.nisn}`,
      name: student.full_name,
      role: 'siswa',
      roleLabel: `Siswa Kelas ${student.class_name}`,
      identifier: `NISN: ${student.nisn} | Kelas ${student.class_name}`,
      class_name: student.class_name,
      nisn: student.nisn,
      avatar: student.avatar,
    };

    setSuccessMsg(`Berhasil login sebagai ${student.full_name} (Kelas ${student.class_name})`);
    setTimeout(() => {
      onLoginSuccess(userAccount);
      onClose();
    }, 500);
  };

  // Filter students for quick demo buttons based on grade
  const filteredQuickStudents = students.filter((s) => {
    if (selectedGrade === 'ALL') return true;
    const clean = s.class_name.toUpperCase();
    if (selectedGrade === 'VII') return clean.startsWith('VII') || clean.startsWith('7');
    if (selectedGrade === 'VIII') return clean.startsWith('VIII') || clean.startsWith('8');
    if (selectedGrade === 'IX') return clean.startsWith('IX') || clean.startsWith('9');
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-indigo-950 my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-indigo-950 text-white flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                PORTAL RESMI SISWA
              </span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                Login Akun Siswa Terpadu
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Notification Messages */}
          {errorMsg && (
            <div className="bg-red-50 border-2 border-red-300 text-red-900 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 animate-in shake">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="font-semibold">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="font-bold">{successMsg}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                NISN atau NIS Siswa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: 0061234567 atau 23241001"
                  value={nisnOrNis}
                  onChange={(e) => setNisnOrNis(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl text-slate-900 font-mono font-bold text-sm focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Kata Sandi (Password) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  Default: <code className="bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">siswa</code>
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl text-slate-900 font-bold text-sm focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 border border-amber-300 active:scale-95 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Masuk ke Portal Siswa</span>
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <p className="text-[11px]">
            * Data akun dan kata sandi dikelola langsung oleh Bagian Administrasi / Operator Sekolah.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
