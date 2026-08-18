import React from 'react';
import { SchoolSettings, UserAccount } from '../types';
import { Newspaper, GraduationCap, LayoutDashboard, PlusCircle, Search, Sparkles, Shield, BookOpen, UserCheck, ChevronDown, Building2, UserCircle } from 'lucide-react';

export type NavigationTab = 'mading' | 'graduation' | 'profil' | 'student-portal' | 'admin';

interface HeaderProps {
  settings: SchoolSettings;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenSubmitModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentUser: UserAccount;
  onOpenRoleSwitcher: () => void;
  onOpenStudentLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activeTab,
  setActiveTab,
  onOpenSubmitModal,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenRoleSwitcher,
  onOpenStudentLogin,
}) => {
  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'admin':
        return {
          icon: <Shield className="w-3.5 h-3.5" />,
          label: 'Admin',
          style: 'bg-amber-400 text-indigo-950 border-amber-300',
        };
      case 'guru':
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          label: 'Guru',
          style: 'bg-emerald-600 text-white border-emerald-500',
        };
      case 'siswa':
        return {
          icon: <GraduationCap className="w-3.5 h-3.5" />,
          label: 'Siswa',
          style: 'bg-blue-600 text-white border-blue-400',
        };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="bg-indigo-950 text-white shadow-md sticky top-0 z-40 border-b-4 border-amber-400">
      {/* Top Bar / Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & School Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('mading')}>
            <div className="w-11 h-11 rounded-xl bg-white text-indigo-950 p-1.5 shadow flex-shrink-0 flex items-center justify-center font-bold border-2 border-amber-400 overflow-hidden">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <GraduationCap className="w-6 h-6 text-indigo-950" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded border border-amber-400/30">
                  {settings.dinas_name}
                </span>
                <span className="text-[10px] text-indigo-200 font-mono">NPSN: {settings.npsn}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                {settings.school_name}
              </h1>
            </div>
          </div>

          {/* User Role Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input for Mading */}
            {activeTab === 'mading' && (
              <div className="relative flex-1 md:w-52">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-indigo-300" />
                <input
                  type="text"
                  placeholder="Cari mading..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 bg-indigo-900/90 border border-indigo-700/80 rounded text-xs text-white placeholder-indigo-300 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>
            )}

            {/* Quick Submit Work Button */}
            <button
              onClick={onOpenSubmitModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold rounded text-xs tracking-wider uppercase shadow-xs transition-all active:scale-95 flex-shrink-0 border border-amber-300 cursor-pointer"
              title="Kirim artikel/karya siswa"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Kirim Karya</span>
            </button>

            {/* Quick Student Login Portal Button */}
            {onOpenStudentLogin && (
              <button
                onClick={onOpenStudentLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded text-xs tracking-wider uppercase shadow-xs transition-all active:scale-95 flex-shrink-0 border border-emerald-400 cursor-pointer"
                title="Buka Portal Login Akun Siswa (NISN & Sandi)"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Login Siswa</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-indigo-900 border-t border-indigo-800/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 sm:space-x-1.5 py-1.5">
            
            <button
              onClick={() => setActiveTab('mading')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'mading'
                  ? 'bg-amber-400 text-indigo-950 shadow-xs'
                  : 'text-indigo-100 hover:text-white hover:bg-indigo-800'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              Mading Digital
            </button>

            <button
              onClick={() => setActiveTab('graduation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap relative ${
                activeTab === 'graduation'
                  ? 'bg-amber-400 text-indigo-950 shadow-xs'
                  : 'text-indigo-100 hover:text-white hover:bg-indigo-800'
              }`}
              title="Portal Pengumuman Kelulusan Khusus Siswa Kelas IX"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Pengumuman Kelulusan (Kelas IX)</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profil')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'profil'
                  ? 'bg-amber-400 text-indigo-950 shadow-xs'
                  : 'text-indigo-100 hover:text-white hover:bg-indigo-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Profil Sekolah</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-amber-400 text-indigo-950 shadow-xs'
                  : 'text-indigo-100 hover:text-white hover:bg-indigo-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {currentUser.role === 'admin' ? 'Panel Admin' : currentUser.role === 'guru' ? 'Panel Guru (Nilai)' : 'Panel Pengelola'}
            </button>

            {/* Tab Profil Siswa (Diletakkan di Paling Kanan) */}
            <button
              onClick={() => setActiveTab('student-portal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'student-portal'
                  ? 'bg-amber-400 text-indigo-950 shadow-xs'
                  : 'text-indigo-100 hover:text-white hover:bg-indigo-800'
              }`}
              title="Profil Pribadi Siswa & Kartu Pelajar (Login Siswa)"
            >
              <UserCircle className="w-3.5 h-3.5" />
              <span>Profil Siswa</span>
            </button>

          </nav>
        </div>
      </div>
    </header>
  );
};
