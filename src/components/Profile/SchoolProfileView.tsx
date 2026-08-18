import React from 'react';
import { SchoolSettings, UserAccount } from '../../types';
import { Building2, Award, BookOpen, Target, CheckCircle2, User, Phone, Mail, Globe, MapPin, Sparkles, Edit3, Shield, GraduationCap } from 'lucide-react';

interface SchoolProfileViewProps {
  settings: SchoolSettings;
  currentUser: UserAccount;
  onGoToEditProfile?: () => void;
  onEditProfileClick?: () => void;
}

export const SchoolProfileView: React.FC<SchoolProfileViewProps> = ({
  settings,
  currentUser,
  onGoToEditProfile,
  onEditProfileClick,
}) => {
  const { profile } = settings;
  const handleEditProfile = onGoToEditProfile || onEditProfileClick;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Hero School Identity Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-indigo-800 bg-indigo-950 text-white">
        {/* Background Decorative Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src={profile?.hero_image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80'}
            alt={settings.school_name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 md:p-12 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 shadow-2xl flex-shrink-0 flex items-center justify-center border-4 border-amber-400">
                <img
                  src={settings.logo_url}
                  alt="Logo Sekolah"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full border border-amber-400/30">
                  {settings.dinas_name}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  {settings.school_name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-200 font-mono">
                  <span>NPSN: <strong className="text-white font-bold">{settings.npsn}</strong></span>
                  <span>•</span>
                  <span>Akreditasi: <strong className="text-amber-300 font-bold">{profile?.accreditation || 'A (Unggul)'}</strong></span>
                  <span>•</span>
                  <span>T.A {settings.academic_year}</span>
                </div>
              </div>
            </div>

            {currentUser.role === 'admin' && handleEditProfile && (
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 border border-amber-300 active:scale-95 flex-shrink-0 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profil Sekolah</span>
              </button>
            )}
          </div>

          {/* Motto Box */}
          <div className="p-4 rounded-2xl bg-indigo-900/70 border border-indigo-700/80 backdrop-blur-sm">
            <p className="text-xs sm:text-sm italic text-amber-200 text-center font-medium">
              "{profile?.motto || 'Unggul dalam Prestasi, Berkarakter Pancasila, Berwawasan Global'}"
            </p>
          </div>
        </div>
      </div>

      {/* Sambutan Kepala Sekolah & Profil Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sambutan Kepala Sekolah */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-indigo-950 border-b pb-3">
            <User className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">
              Sambutan Kepala Sekolah
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-28 sm:w-36 flex-shrink-0 text-center space-y-2 mx-auto sm:mx-0">
              <div className="w-28 h-36 sm:w-36 sm:h-44 rounded-2xl overflow-hidden shadow-md border-2 border-indigo-950 bg-slate-100 mx-auto">
                <img
                  src={profile?.principal_photo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'}
                  alt={settings.principal_name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {settings.principal_name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  NIP. {settings.principal_nip}
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {(profile?.welcome_message || '').split('\n\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Info Cepat & Kurikulum */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-gradient-to-br from-indigo-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-7 shadow-sm border border-indigo-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                Kurikulum & Sistem Pembelajaran
              </h3>
            </div>

            <p className="text-xs text-indigo-100 leading-relaxed">
              {profile?.curriculum || 'Kurikulum Merdeka Mandiri Berbagi dengan penguatan literasi digital, robotika, dan Projek Penguatan Profil Pelajar Pancasila (P5).'}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-indigo-900/80 p-3 rounded-xl border border-indigo-700 text-center">
                <span className="text-[10px] text-indigo-300 font-bold uppercase block">Status Akreditasi</span>
                <span className="text-base font-black text-amber-300">{profile?.accreditation || 'A (Unggul)'}</span>
              </div>
              <div className="bg-indigo-900/80 p-3 rounded-xl border border-indigo-700 text-center">
                <span className="text-[10px] text-indigo-300 font-bold uppercase block">Tahun Pelajaran</span>
                <span className="text-base font-black text-white">{settings.academic_year}</span>
              </div>
            </div>
          </div>

          {/* Kontak & Lokasi */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3.5 text-xs text-slate-700">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Kontak & Lokasi Resmi</span>
            </h3>

            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{settings.website}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Visi & Misi Sekolah */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Visi */}
        <div className="md:col-span-5 bg-gradient-to-br from-amber-500 to-amber-600 text-indigo-950 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3 border border-amber-400">
          <div className="flex items-center gap-2 text-indigo-950">
            <Target className="w-6 h-6" />
            <h3 className="text-lg font-black uppercase tracking-wider">
              Visi Sekolah
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-bold leading-relaxed">
            "{profile?.vision || 'Menjadi Lembaga Pendidikan Menengah Pertama Rujukan Nasional yang Menghasilkan Generasi Berakhlak Mulia, Cerdas, dan Kreatif.'}"
          </p>
        </div>

        {/* Misi */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-950 border-b pb-3">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
              Misi Satuan Pendidikan
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {(profile?.mission || []).map((m, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Sejarah & Fasilitas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sejarah */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-950 border-b pb-3">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black uppercase tracking-tight">
              Sejarah Singkat Sekolah
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            {profile?.history || 'SMP Negeri 1 Nusantara berdiri sejak 1978 dan senantiasa berinovasi melahirkan generasi unggul.'}
          </p>
        </div>

        {/* Sarana & Prasarana */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-950 border-b pb-3">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black uppercase tracking-tight">
              Sarana & Prasarana Unggulan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {(profile?.facilities || []).map((fac, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-slate-800 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                <span className="truncate" title={fac}>{fac}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
