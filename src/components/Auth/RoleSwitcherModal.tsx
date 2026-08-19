import React, { useState } from 'react';
import { UserAccount, StaffAccount, StudentGraduation } from '../../types';
import { Shield, X, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { presetAccounts } from '../../data/roleAccounts';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSelectAccount: (account: UserAccount) => void;
  staffAccounts?: StaffAccount[];
  students?: StudentGraduation[];
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  staffAccounts,
  students,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Check in Staff Accounts (Admin & Guru)
    const activeStaff = staffAccounts && staffAccounts.length > 0
      ? staffAccounts
      : (presetAccounts.filter((a) => a.role === 'admin' || a.role === 'guru') as unknown as StaffAccount[]);

    const matchedStaff = activeStaff.find(
      (st) =>
        ((st.email && st.email.toLowerCase() === cleanInput) ||
         (st.username && st.username.toLowerCase() === cleanInput) ||
         (st.nip && st.nip.toLowerCase() === cleanInput) ||
         (st.nip && st.nip.replace(/\s+/g, '') === cleanInput.replace(/\s+/g, ''))) &&
        (st.password || 'admin123') === cleanPassword
    );

    if (matchedStaff) {
      const staffUserAccount: UserAccount = {
        id: matchedStaff.id,
        name: matchedStaff.full_name || matchedStaff.name,
        role: matchedStaff.role,
        roleLabel: matchedStaff.role === 'admin' ? 'Administrator Sekolah' : (matchedStaff.subject || 'Dewan Guru'),
        identifier: matchedStaff.identifier || (matchedStaff.nip ? `NIP. ${matchedStaff.nip}` : matchedStaff.username),
        nip: matchedStaff.nip,
        username: matchedStaff.username,
        password: matchedStaff.password,
        email: matchedStaff.email,
        avatar: matchedStaff.avatar || '',
      };
      onSelectAccount(staffUserAccount);
      onClose();
      return;
    }

    // 2. Check in Students List (from Admin Panel / Firestore database)
    if (students && students.length > 0) {
      const matchedStudent = students.find((std) => {
        const nisnMatch = std.nisn && (
          std.nisn.toLowerCase() === cleanInput ||
          std.nisn.replace(/\s+/g, '') === cleanInput.replace(/\s+/g, '')
        );
        const nisMatch = std.nis && (
          std.nis.toLowerCase() === cleanInput ||
          std.nis.replace(/\s+/g, '') === cleanInput.replace(/\s+/g, '')
        );
        const nameMatch = std.full_name && std.full_name.toLowerCase() === cleanInput;
        
        if (!nisnMatch && !nisMatch && !nameMatch) return false;

        const stdExpectedPass = (std.password || 'siswa').trim();
        return stdExpectedPass === cleanPassword;
      });

      if (matchedStudent) {
        const studentUserAccount: UserAccount = {
          id: matchedStudent.id,
          name: matchedStudent.full_name,
          role: 'siswa',
          roleLabel: `Siswa Kelas ${matchedStudent.class_name || 'IX'}`,
          identifier: `NISN: ${matchedStudent.nisn} | Kelas ${matchedStudent.class_name || 'IX'}`,
          nisn: matchedStudent.nisn,
          class_name: matchedStudent.class_name,
          username: matchedStudent.nisn,
          password: matchedStudent.password || 'siswa',
          avatar: matchedStudent.avatar || '',
        };
        onSelectAccount(studentUserAccount);
        onClose();
        return;
      }
    }

    // 3. Fallback check in presetAccounts
    const matchedPreset = presetAccounts.find(
      (acc) =>
        ((acc.email && acc.email.toLowerCase() === cleanInput) ||
         (acc.username && acc.username.toLowerCase() === cleanInput) ||
         (acc.nisn && acc.nisn.toLowerCase() === cleanInput) ||
         (acc.nip && acc.nip.toLowerCase() === cleanInput)) &&
        acc.password === cleanPassword
    );

    if (matchedPreset) {
      onSelectAccount(matchedPreset);
      onClose();
      return;
    }

    setError('Email/NISN atau Password tidak valid.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-2 border-indigo-950 my-8">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-indigo-950 text-white flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-indigo-950 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">Portal Login</h2>
              <p className="text-xs text-indigo-200">Silakan masukkan kredensial Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-1.5 rounded-lg bg-indigo-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleLogin} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Admin atau NISN Siswa
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email atau NISN"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
          >
            Masuk ke Sistem
          </button>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <p className="text-[11px]">
            * Pastikan kredensial Anda benar.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
