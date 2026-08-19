import React, { useState } from 'react';
import { SchoolSettings, UserAccount, MadingPost, StaffAccount } from '../../types';
import { 
  GraduationCap, 
  Camera, 
  Trash2, 
  Pencil, 
  Save, 
  CheckCircle2, 
  User, 
  Mail, 
  BookOpen, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  Heart, 
  Sparkles, 
  Building2, 
  LogOut, 
  LayoutDashboard, 
  AlertCircle,
  IdCard
} from 'lucide-react';
import { EditTeacherPhotoModal } from './EditTeacherPhotoModal';

interface TeacherProfileViewProps {
  settings: SchoolSettings;
  currentUser: UserAccount;
  posts: MadingPost[];
  staffAccounts?: StaffAccount[];
  onOpenSubmitModal: () => void;
  onSelectPost: (post: MadingPost) => void;
  onGoToModeration?: () => void;
  onLogout?: () => void;
  onUpdateTeacherProfile?: (updatedStaff: StaffAccount) => void;
  onUpdateTeacherPhoto?: (newAvatarUrl: string) => void;
}

export const TeacherProfileView: React.FC<TeacherProfileViewProps> = ({
  settings,
  currentUser,
  posts,
  staffAccounts = [],
  onOpenSubmitModal,
  onSelectPost,
  onGoToModeration,
  onLogout,
  onUpdateTeacherProfile,
  onUpdateTeacherPhoto,
}) => {
  // Find current teacher in staffAccounts or construct from currentUser
  const matchedStaff = staffAccounts.find(
    (st) => st.id === currentUser.id || st.username === currentUser.username
  );

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(matchedStaff?.name || currentUser.name || '');
  const [nip, setNip] = useState(matchedStaff?.nip || currentUser.nip || '');
  const [subject, setSubject] = useState(matchedStaff?.subject || currentUser.roleLabel || 'Dewan Guru');
  const [email, setEmail] = useState(matchedStaff?.email || currentUser.email || '');
  const [password, setPassword] = useState(matchedStaff?.password || currentUser.password || '');
  const [showPassword, setShowPassword] = useState(false);

  // Photo modal state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSavePhoto = (newAvatarUrl: string) => {
    if (onUpdateTeacherPhoto) {
      onUpdateTeacherPhoto(newAvatarUrl);
    }
    if (onUpdateTeacherProfile && matchedStaff) {
      const updated: StaffAccount = {
        ...matchedStaff,
        avatar: newAvatarUrl,
      };
      onUpdateTeacherProfile(updated);
    }
    showToast('Foto profil guru berhasil diperbarui!');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama lengkap tidak boleh kosong.');
      return;
    }

    const updatedStaff: StaffAccount = {
      id: matchedStaff?.id || currentUser.id || `acc-guru-${Date.now()}`,
      name: name.trim(),
      role: 'guru',
      roleLabel: subject.trim() || 'Dewan Guru',
      identifier: nip.trim() ? `NIP. ${nip.trim()}` : (matchedStaff?.username || currentUser.username || 'Guru'),
      username: matchedStaff?.username || currentUser.username || 'guru',
      password: password.trim() || 'guru123',
      email: email.trim() || undefined,
      nip: nip.trim() || undefined,
      subject: subject.trim() || 'Dewan Guru',
      avatar: matchedStaff?.avatar || currentUser.avatar || '',
    };

    if (onUpdateTeacherProfile) {
      onUpdateTeacherProfile(updatedStaff);
    }

    setIsEditing(false);
    showToast('Biodata guru berhasil disimpan ke database Cloud Firestore!');
  };

  // Filter posts written by this teacher
  const teacherPosts = posts.filter(
    (p) =>
      p.author?.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      p.authorRole?.toLowerCase().includes('guru') ||
      p.authorRole?.toLowerCase().includes('pendidik')
  );

  const activeAvatar = matchedStaff?.avatar || currentUser.avatar || '';

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-950 text-white border-2 border-amber-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Cover Top Banner */}
        <div 
          className="h-36 sm:h-44 bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 p-6 flex flex-col justify-between relative overflow-hidden bg-cover bg-center"
          style={
            settings.profile?.hero_image_url
              ? {
                  backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92), rgba(30, 27, 75, 0.85)), url(${settings.profile.hero_image_url})`,
                }
              : undefined
          }
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-indigo-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{currentUser.role === 'admin' ? 'AKUN RESMI ADMINISTRATOR' : 'AKUN RESMI DEWAN PENDIDIK'}</span>
              </span>
              <span className="hidden sm:inline-block bg-indigo-800/80 text-indigo-100 text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-700">
                {settings.school_name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onGoToModeration && (
                <button
                  type="button"
                  onClick={onGoToModeration}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Panel Moderasi Mading</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content Area */}
        <div className="p-6 relative">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
              
              {/* Avatar Frame */}
              <div className="relative group">
                <div className="w-28 h-32 sm:w-32 sm:h-36 rounded-2xl bg-indigo-950 text-white border-4 border-slate-100 shadow-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                  {activeAvatar ? (
                    <img
                      src={activeAvatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-indigo-300 gap-1.5 p-2 text-center w-full h-full bg-gradient-to-b from-indigo-900 to-indigo-950">
                      <GraduationCap className="w-12 h-12 text-amber-400" />
                      <span className="text-[10px] font-bold text-slate-300">Foto Guru</span>
                    </div>
                  )}
                </div>

                {/* Floating Upload / Change Photo Button */}
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="absolute -bottom-2 -right-2 bg-amber-400 hover:bg-amber-300 text-indigo-950 p-2.5 rounded-2xl shadow-lg border-2 border-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  title="Unggah / Ganti Pas Foto Guru"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Identity Details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {matchedStaff?.name || currentUser.name}
                  </h1>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {currentUser.role === 'admin' ? 'ADMINISTRATOR UTAMA' : 'GURU AKTIF'}
                  </span>
                </div>
                
                <p className="text-xs sm:text-sm font-bold text-indigo-900">
                  {currentUser.role === 'admin'
                    ? 'Administrator Sistem & Pengelola Mading'
                    : (matchedStaff?.subject || currentUser.roleLabel || 'Tenaga Pendidik')}
                </p>
                
                <p className="text-xs text-slate-500 font-mono">
                  {matchedStaff?.nip ? `NIP. ${matchedStaff.nip}` : `Username: ${currentUser.username || 'guru'}`}
                </p>
              </div>

            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Batal Edit' : 'Edit Biodata'}</span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
                  title="Keluar / Ganti Akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              )}
            </div>

          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mata Pelajaran</span>
              <p className="text-xs font-black text-slate-900 mt-0.5 truncate">{matchedStaff?.subject || 'Bahasa Indonesia'}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status Kepegawaian</span>
              <p className="text-xs font-black text-emerald-700 mt-0.5">Pendidik Tetap / PNS</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Karya / Pengumuman</span>
              <p className="text-xs font-black text-indigo-950 mt-0.5">{teacherPosts.length} Postingan</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Hak Akses</span>
              <p className="text-xs font-black text-amber-700 mt-0.5">Moderator Mading</p>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Profile Form (Expanded if isEditing === true) */}
      {isEditing && (
        <div className="bg-white rounded-3xl border-2 border-indigo-900 shadow-xl p-6 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-indigo-950">
              <Pencil className="w-4 h-4 text-amber-500" />
              <h3 className="font-black text-base">Edit Biodata & Informasi Pendidik</h3>
            </div>
            <span className="text-[11px] text-slate-500">Tersinkronisasi ke Cloud Firestore</span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap & Gelar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NIP (Nomor Induk Pegawai)
                </label>
                <input
                  type="text"
                  placeholder="19780512 200604 2 008"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mata Pelajaran / Tugas Tambahan
                </label>
                <input
                  type="text"
                  placeholder="Bahasa Indonesia & Pembina Mading"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email Resmi
                </label>
                <input
                  type="email"
                  placeholder="nama.guru@sekolah.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password Akun Guru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all border border-amber-300"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan Biodata</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mading Karya & Pengumuman Diterbitkan Guru */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-900" />
            <h3 className="font-black text-slate-900 text-base">
              Karya & Pengumuman Guru ({teacherPosts.length})
            </h3>
          </div>
        </div>

        {teacherPosts.length === 0 ? (
          <div className="text-center py-10 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              Belum ada postingan atau pengumuman mading yang dibuat atas nama akun ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{post.date}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-950 line-clamp-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-3 text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      {post.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                      {post.comments?.length || 0}
                    </span>
                  </div>
                  <span className="text-indigo-700 font-bold group-hover:underline">
                    Baca Selengkapnya &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Edit Modal */}
      <EditTeacherPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentAvatar={activeAvatar}
        teacherName={matchedStaff?.name || currentUser.name}
        teacherNip={matchedStaff?.nip || currentUser.nip || ''}
        teacherSubject={matchedStaff?.subject || currentUser.roleLabel || ''}
        onSavePhoto={handleSavePhoto}
      />

    </div>
  );
};
