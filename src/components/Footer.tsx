import React from 'react';
import { SchoolSettings, UserAccount } from '../types';
import { GraduationCap, MapPin, Phone, Mail, Globe, Heart, Building2, UserCircle } from 'lucide-react';
import { NavigationTab } from './Header';

interface FooterProps {
  settings: SchoolSettings;
  onSelectTab: (tab: NavigationTab) => void;
  currentUser?: UserAccount;
}

export const Footer: React.FC<FooterProps> = ({ settings, onSelectTab, currentUser }) => {
  return (
    <footer className="bg-indigo-950 text-indigo-200 text-xs border-t-4 border-amber-400 pt-8 pb-6 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Col 1: School Identity */}
          <div className="space-y-2 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-white text-indigo-950 p-1 font-black flex items-center justify-center border border-amber-400 overflow-hidden">
                {settings.logo_url ? (
                  <img
                    src={settings.logo_url}
                    alt="Logo"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <GraduationCap className="w-5 h-5 text-indigo-950" />
                )}
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">{settings.school_name}</span>
            </div>
            <p className="text-[11px] text-indigo-300 leading-relaxed">
              Mading Digital Terpadu & Portal Layanan Pengumuman Kelulusan Resmi Sekolah.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-1.5">
            <h4 className="font-black text-amber-300 text-[10px] uppercase tracking-wider">Navigasi Utama</h4>
            <ul className="space-y-1 text-xs">
              <li>
                <button onClick={() => onSelectTab('mading')} className="hover:text-amber-300 transition-colors font-medium">
                  Mading Digital & Karya Siswa
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('graduation')} className="hover:text-amber-300 transition-colors font-medium">
                  Pengumuman Kelulusan (Khusus Kelas IX)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('profil')} className="hover:text-amber-300 transition-colors font-medium">
                  Profil & Visi Misi Sekolah
                </button>
              </li>
              {currentUser?.role === 'admin' && (
                <li>
                  <button onClick={() => onSelectTab('admin')} className="hover:text-amber-300 transition-colors font-medium">
                    Panel Administrator
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => onSelectTab('student-portal')} className="hover:text-amber-300 transition-colors font-medium">
                  Profil Siswa & Kartu Pelajar
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="space-y-1.5">
            <h4 className="font-black text-amber-300 text-[10px] uppercase tracking-wider">Kontak Sekolah</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-indigo-200">{settings.address}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-indigo-200">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-indigo-200">{settings.email}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-4 border-t border-indigo-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-indigo-300 gap-2">
          <p>© {new Date().getFullYear()} {settings.school_name}. {settings.footer_copyright || 'Hak Cipta Dilindungi Undang-Undang.'}</p>
          <div className="flex items-center gap-1 text-amber-300 font-bold">
            <span>Mading Digital & Portal Kelulusan Resmi</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

