import React from 'react';
import { UserAccount, UserRole, StaffAccount } from '../../types';
import { presetAccounts, roleCapabilities } from '../../data/roleAccounts';
import { X, Shield, BookOpen, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSelectAccount: (account: UserAccount) => void;
  staffAccounts?: StaffAccount[];
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectAccount,
  staffAccounts,
}) => {
  if (!isOpen) return null;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5" />;
      case 'guru':
        return <BookOpen className="w-5 h-5" />;
      case 'siswa':
        return <GraduationCap className="w-5 h-5" />;
    }
  };

  // Build combined accounts list
  const activeStaffAsUserAccounts: UserAccount[] = (staffAccounts && staffAccounts.length > 0)
    ? staffAccounts.map((st) => ({
        id: st.id,
        name: st.full_name || st.name,
        role: st.role,
        roleLabel: st.role === 'admin' ? 'Administrator Sekolah' : (st.subject || 'Dewan Guru'),
        identifier: st.identifier || (st.nip ? `NIP. ${st.nip}` : st.username),
        nip: st.nip,
        username: st.username,
        password: st.password,
        email: st.email,
        avatar: st.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      }))
    : presetAccounts.filter((a) => a.role === 'admin' || a.role === 'guru');

  const studentAccounts = presetAccounts.filter((a) => a.role === 'siswa');
  const allDisplayAccounts = [...activeStaffAsUserAccounts, ...studentAccounts];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border-2 border-indigo-950 my-8">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-indigo-950 text-white flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-indigo-950 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">Pilih Peran Pengguna (Role Simulation)</h2>
              <p className="text-xs text-indigo-200">Ganti peran untuk menguji hak akses Admin, Guru, dan Siswa</p>
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
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Active User Status Banner */}
          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
              />
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">
                  Peran Aktif Saat Ini
                </span>
                <h4 className="font-extrabold text-sm text-slate-900">{currentUser.name}</h4>
                <p className="text-xs text-slate-600 font-mono">{currentUser.identifier}</p>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded bg-amber-400 text-indigo-950 border border-amber-300">
              {currentUser.role.toUpperCase()}
            </span>
          </div>

          {/* Preset Roles Cards */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
              Pilihan Akun & Hak Akses:
            </h3>

            {allDisplayAccounts.map((account) => {
              const isCurrent = account.id === currentUser.id;
              const cap = roleCapabilities[account.role];

              return (
                <div
                  key={account.id}
                  onClick={() => {
                    onSelectAccount(account);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCurrent
                      ? 'border-indigo-900 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-900/10'
                      : 'border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 mt-0.5 ${
                        account.role === 'admin'
                          ? 'bg-amber-400 text-indigo-950'
                          : account.role === 'guru'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {getRoleIcon(account.role)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-black text-sm text-slate-900">{account.name}</h4>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${cap.badgeColor}`}
                        >
                          {account.roleLabel}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Sedang Digunakan
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {cap.description}
                      </p>

                      <ul className="text-[11px] text-slate-500 list-disc list-inside space-y-0.5 pt-1">
                        {cap.permissions.slice(0, 2).map((perm, idx) => (
                          <li key={idx} className="leading-tight">{perm}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all flex-shrink-0 uppercase tracking-wider ${
                      isCurrent
                        ? 'bg-indigo-950 text-amber-300'
                        : 'bg-slate-100 hover:bg-indigo-900 hover:text-white text-slate-700'
                    }`}
                  >
                    <span>{isCurrent ? 'Aktif' : 'Gunakan Akun'}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <p className="text-[11px]">
            * Peran ini mengendalikan menu, tombol input, aksi hapus, dan hak akses pengeditan di seluruh aplikasi.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
