import React, { useState, useEffect } from 'react';
import { SchoolSettings, MadingPost, StudentGraduation, UserAccount, GraduationStatus, GradeLevel, StaffAccount } from '../../types';
import { initialStaffAccounts } from '../../data/roleAccounts';
import { 
  GraduationCap, 
  Newspaper, 
  Settings, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Printer, 
  Search, 
  Filter, 
  UserCheck, 
  Lock,
  ArrowRight,
  ShieldAlert,
  IdCard,
  FileSpreadsheet,
  UploadCloud,
  Pin,
  Heart,
  MessageSquare,
  Calendar,
  User,
  Tag,
  Share2,
  Check,
  AlertTriangle,
  Building2,
  Target,
  Award,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Globe,
  Image as ImageIcon,
  Layers,
  HelpCircle,
  Shield,
  PlusCircle,
  Clock,
  CheckCheck
} from 'lucide-react';
import { StudentImportModal } from './StudentImportModal';

interface AdminDashboardProps {
  settings: SchoolSettings;
  onUpdateSettings: (settings: SchoolSettings) => void;
  posts: MadingPost[];
  onUpdatePosts: (posts: MadingPost[]) => void;
  students: StudentGraduation[];
  onUpdateStudents: (students: StudentGraduation[]) => void;
  staffAccounts?: StaffAccount[];
  onUpdateStaffAccounts?: (staff: StaffAccount[]) => void;
  onResetDemoData: () => void;
  currentUser: UserAccount;
  onOpenRoleSwitcher?: () => void;
  onDirectLoginAsStudent?: (student: StudentGraduation) => void;
  onViewPublicProfile?: () => void;
  initialTab?: 'accounts' | 'kelulusan' | 'profil_sekolah' | 'pengaturan' | 'mading';
}

const getSafeReleaseTimeInput = (timeStr?: string): string => {
  const formatLocal = (d: Date) => {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  if (!timeStr) {
    return formatLocal(new Date());
  }
  const d = new Date(timeStr);
  if (isNaN(d.getTime())) {
    return formatLocal(new Date());
  }
  return formatLocal(d);
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  onUpdateSettings,
  posts,
  onUpdatePosts,
  students,
  onUpdateStudents,
  staffAccounts,
  onUpdateStaffAccounts,
  onResetDemoData,
  currentUser,
  onDirectLoginAsStudent,
  onViewPublicProfile,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'kelulusan' | 'accounts' | 'pengaturan' | 'mading' | 'profil_sekolah'>(
    initialTab || 'accounts'
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Student editor state
  const [editingStudent, setEditingStudent] = useState<StudentGraduation | null>(null);

  // Staff accounts state & editor
  const [staffList, setStaffList] = useState<StaffAccount[]>(() =>
    staffAccounts && staffAccounts.length > 0 ? staffAccounts : initialStaffAccounts
  );

  useEffect(() => {
    if (staffAccounts && staffAccounts.length > 0) {
      setStaffList(staffAccounts);
    }
  }, [staffAccounts]);

  const [editingStaff, setEditingStaff] = useState<StaffAccount | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<StaffAccount | null>(null);
  const [resetStaffPasswordTarget, setResetStaffPasswordTarget] = useState<StaffAccount | null>(null);
  const [visibleStaffPasswords, setVisibleStaffPasswords] = useState<{ [staffId: string]: boolean }>({});

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Accounts tab filters
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'ALL' | 'VII' | 'VIII' | 'IX' | 'STAFF_GURU' | 'STAFF_ADMIN'>('ALL');
  const [accountSearchQuery, setAccountSearchQuery] = useState<string>('');
  const [visiblePasswords, setVisiblePasswords] = useState<{ [studentId: string]: boolean }>({});

  // Print Card Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printClassFilter, setPrintClassFilter] = useState<string>('ALL');

  // Mading Management States
  const [madingSearchQuery, setMadingSearchQuery] = useState<string>('');
  const [madingCategoryFilter, setMadingCategoryFilter] = useState<string>('ALL');
  const [madingStatusFilter, setMadingStatusFilter] = useState<'ALL' | 'pending' | 'published'>('ALL');
  const [postToDelete, setPostToDelete] = useState<MadingPost | null>(null);
  const [previewPost, setPreviewPost] = useState<MadingPost | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentGraduation | null>(null);
  const [resetPasswordTarget, setResetPasswordTarget] = useState<{ id: string; name: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Add new mading post modal by admin
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<MadingPost['category']>('Pengumuman');
  const [newPostAuthor, setNewPostAuthor] = useState(currentUser.name || 'Admin Sekolah');
  const [newPostExcerpt, setNewPostExcerpt] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCoverImage, setNewPostCoverImage] = useState('');

  // Settings form states
  const [schoolName, setSchoolName] = useState(settings.school_name || '');
  const [releaseTime, setReleaseTime] = useState(() => getSafeReleaseTimeInput(settings.announcement_release_time));
  const [logoUrl, setLogoUrl] = useState(settings.logo_url || '');
  const [motivation, setMotivation] = useState(settings.graduation_motivation || '');
  const [footerCopyright, setFooterCopyright] = useState(settings.footer_copyright || '');
  const [isUnlocked, setIsUnlocked] = useState(settings.is_release_unlocked ?? true);

  // Hero Banner & Action Buttons Customizer States
  const [heroBadge, setHeroBadge] = useState(settings.hero_badge || 'Kreativitas & Prestasi Tanpa Batas');
  const [heroTitle, setHeroTitle] = useState(settings.hero_title || 'Mading Digital Resmi & Informasi Terpadu Sekolah');
  const [heroDescription, setHeroDescription] = useState(
    settings.hero_description ||
      'Wadah ekspresi karya siswa, artikel edukasi, pengumuman resmi sekolah, dan informasi pengumuman kelulusan siswa kelas IX.'
  );
  const [heroBtnSubmitText, setHeroBtnSubmitText] = useState(settings.hero_btn_submit_text || 'Kirim Karya Siswa Baru');
  const [heroBtnSubmitShow, setHeroBtnSubmitShow] = useState(settings.hero_btn_submit_show !== false);
  const [heroBtnGradText, setHeroBtnGradText] = useState(settings.hero_btn_grad_text || 'Cek Kelulusan (Khusus Kelas IX)');
  const [heroBtnGradShow, setHeroBtnGradShow] = useState(settings.hero_btn_grad_show !== false);

  // ==========================================
  // School Profile Full Editor States
  // ==========================================
  const [profileSchoolName, setProfileSchoolName] = useState(settings.school_name || '');
  const [profileDinasName, setProfileDinasName] = useState(settings.dinas_name || '');
  const [profileNpsn, setProfileNpsn] = useState(settings.npsn || '');
  const [profileAcademicYear, setProfileAcademicYear] = useState(settings.academic_year || '2025/2026');
  const [profileAccreditation, setProfileAccreditation] = useState(settings.profile?.accreditation || 'A (Unggul) - BAN S/M');
  const [profileCurriculum, setProfileCurriculum] = useState(
    settings.profile?.curriculum || 'Kurikulum Merdeka Mandiri Berbagi & Terintegrasi Digital'
  );
  const [profileMotto, setProfileMotto] = useState(settings.profile?.motto || '');
  const [profileLogoUrl, setProfileLogoUrl] = useState(settings.logo_url || '');
  const [profileHeroImageUrl, setProfileHeroImageUrl] = useState(settings.profile?.hero_image_url || '');

  // Principal & Welcome
  const [profilePrincipalName, setProfilePrincipalName] = useState(settings.principal_name || '');
  const [profilePrincipalNip, setProfilePrincipalNip] = useState(settings.principal_nip || '');
  const [profilePrincipalPhotoUrl, setProfilePrincipalPhotoUrl] = useState(settings.profile?.principal_photo_url || '');
  const [profileWelcomeMessage, setProfileWelcomeMessage] = useState(settings.profile?.welcome_message || '');

  // Vision & Missions
  const [profileVision, setProfileVision] = useState(settings.profile?.vision || '');
  const [profileMissions, setProfileMissions] = useState<string[]>(() =>
    settings.profile?.mission && settings.profile.mission.length > 0
      ? [...settings.profile.mission]
      : ['Menyelenggarakan proses pembelajaran berkualitas berbasis Kurikulum Merdeka.']
  );
  const [newMissionInput, setNewMissionInput] = useState('');

  // History & Facilities
  const [profileHistory, setProfileHistory] = useState(settings.profile?.history || '');
  const [profileFacilities, setProfileFacilities] = useState<string[]>(() =>
    settings.profile?.facilities && settings.profile.facilities.length > 0
      ? [...settings.profile.facilities]
      : [
          'Gedung Belajar Ber-AC & Smart Projector',
          'Laboratorium Komputer & Studio AI',
          'Perpustakaan Digital Cendekia',
          'Lapangan Olahraga Multifungsi',
        ]
  );
  const [newFacilityInput, setNewFacilityInput] = useState('');

  // Contact Info
  const [profileAddress, setProfileAddress] = useState(settings.address || '');
  const [profilePhone, setProfilePhone] = useState(settings.phone || '');
  const [profileEmail, setProfileEmail] = useState(settings.email || '');
  const [profileWebsite, setProfileWebsite] = useState(settings.website || '');
  const [profileFooterCopyright, setProfileFooterCopyright] = useState(settings.footer_copyright || '');

  // Sync state if settings prop changes from outside (e.g. reset)
  useEffect(() => {
    setSchoolName(settings.school_name || '');
    setProfileSchoolName(settings.school_name || '');
    setProfileDinasName(settings.dinas_name || '');
    setProfileNpsn(settings.npsn || '');
    setProfileAcademicYear(settings.academic_year || '2025/2026');
    setProfileAccreditation(settings.profile?.accreditation || 'A (Unggul) - BAN S/M');
    setProfileCurriculum(settings.profile?.curriculum || 'Kurikulum Merdeka Mandiri Berbagi');
    setProfileMotto(settings.profile?.motto || '');
    setLogoUrl(settings.logo_url || '');
    setProfileLogoUrl(settings.logo_url || '');
    setProfileHeroImageUrl(settings.profile?.hero_image_url || '');
    setProfilePrincipalName(settings.principal_name || '');
    setProfilePrincipalNip(settings.principal_nip || '');
    setProfilePrincipalPhotoUrl(settings.profile?.principal_photo_url || '');
    setProfileWelcomeMessage(settings.profile?.welcome_message || '');
    setProfileVision(settings.profile?.vision || '');
    setProfileMissions(settings.profile?.mission || []);
    setProfileHistory(settings.profile?.history || '');
    setProfileFacilities(settings.profile?.facilities || []);
    setProfileAddress(settings.address || '');
    setProfilePhone(settings.phone || '');
    setProfileEmail(settings.email || '');
    setProfileWebsite(settings.website || '');
    setFooterCopyright(settings.footer_copyright || '');
    setProfileFooterCopyright(settings.footer_copyright || '');
    setMotivation(settings.graduation_motivation || '');
    setHeroBadge(settings.hero_badge || 'Kreativitas & Prestasi Tanpa Batas');
    setHeroTitle(settings.hero_title || 'Mading Digital Resmi & Informasi Terpadu Sekolah');
    setHeroDescription(
      settings.hero_description ||
        'Wadah ekspresi karya siswa, artikel edukasi, pengumuman resmi sekolah, dan informasi pengumuman kelulusan siswa kelas IX.'
    );
    setHeroBtnSubmitText(settings.hero_btn_submit_text || 'Kirim Karya Siswa Baru');
    setHeroBtnSubmitShow(settings.hero_btn_submit_show !== false);
    setHeroBtnGradText(settings.hero_btn_grad_text || 'Cek Kelulusan (Khusus Kelas IX)');
    setHeroBtnGradShow(settings.hero_btn_grad_show !== false);
  }, [settings]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const isClassIX = (cls?: string) => {
    if (!cls) return false;
    const clean = cls.toUpperCase();
    return clean.includes('IX') || clean.startsWith('9');
  };

  const getGradeLevel = (cls?: string): GradeLevel => {
    if (!cls) return 'IX';
    const clean = cls.toUpperCase();
    if (clean.includes('VII') || clean.startsWith('7')) return 'VII';
    if (clean.includes('VIII') || clean.startsWith('8')) return 'VIII';
    return 'IX';
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    let safeIsoTime = new Date().toISOString();
    if (releaseTime) {
      const parsed = new Date(releaseTime);
      if (!isNaN(parsed.getTime())) {
        safeIsoTime = parsed.toISOString();
      }
    }

    onUpdateSettings({
      ...settings,
      school_name: schoolName,
      announcement_release_time: safeIsoTime,
      is_release_unlocked: isUnlocked,
      logo_url: logoUrl,
      graduation_motivation: motivation,
      footer_copyright: footerCopyright,
      hero_badge: heroBadge,
      hero_title: heroTitle,
      hero_description: heroDescription,
      hero_btn_submit_text: heroBtnSubmitText,
      hero_btn_submit_show: heroBtnSubmitShow,
      hero_btn_grad_text: heroBtnGradText,
      hero_btn_grad_show: heroBtnGradShow,
    });
    showToast('Pengaturan banner mading & informasi sekolah berhasil disimpan!', 'success');
  };

  // Handle Save School Profile
  const handleSaveSchoolProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedSettings: SchoolSettings = {
      ...settings,
      school_name: profileSchoolName.trim() || settings.school_name,
      dinas_name: profileDinasName.trim() || settings.dinas_name,
      npsn: profileNpsn.trim() || settings.npsn,
      academic_year: profileAcademicYear.trim() || settings.academic_year,
      address: profileAddress.trim() || settings.address,
      phone: profilePhone.trim() || settings.phone,
      email: profileEmail.trim() || settings.email,
      website: profileWebsite.trim() || settings.website,
      principal_name: profilePrincipalName.trim() || settings.principal_name,
      principal_nip: profilePrincipalNip.trim() || settings.principal_nip,
      logo_url: profileLogoUrl.trim() || settings.logo_url,
      footer_copyright: profileFooterCopyright.trim() || settings.footer_copyright,
      profile: {
        ...settings.profile,
        accreditation: profileAccreditation.trim() || 'A (Unggul) - BAN S/M',
        curriculum: profileCurriculum.trim(),
        motto: profileMotto.trim(),
        hero_image_url: profileHeroImageUrl.trim() || settings.profile?.hero_image_url || '',
        principal_photo_url: profilePrincipalPhotoUrl.trim() || settings.profile?.principal_photo_url || '',
        welcome_message: profileWelcomeMessage.trim(),
        vision: profileVision.trim(),
        mission: profileMissions.filter((m) => m.trim().length > 0),
        history: profileHistory.trim(),
        facilities: profileFacilities.filter((f) => f.trim().length > 0),
      },
    };

    onUpdateSettings(updatedSettings);
    // Sync local basic state
    setSchoolName(updatedSettings.school_name);
    setLogoUrl(updatedSettings.logo_url);
    setFooterCopyright(updatedSettings.footer_copyright || '');
    showToast('Profil sekolah berhasil disimpan dan diperbarui!', 'success');
  };

  const handleAddMission = () => {
    if (!newMissionInput.trim()) return;
    setProfileMissions([...profileMissions, newMissionInput.trim()]);
    setNewMissionInput('');
  };

  const handleRemoveMission = (index: number) => {
    setProfileMissions(profileMissions.filter((_, i) => i !== index));
  };

  const handleUpdateMission = (index: number, val: string) => {
    const updated = [...profileMissions];
    updated[index] = val;
    setProfileMissions(updated);
  };

  const handleAddFacility = () => {
    if (!newFacilityInput.trim()) return;
    if (profileFacilities.includes(newFacilityInput.trim())) {
      showToast('Fasilitas tersebut sudah ada di daftar.', 'info');
      return;
    }
    setProfileFacilities([...profileFacilities, newFacilityInput.trim()]);
    setNewFacilityInput('');
  };

  const handleRemoveFacility = (index: number) => {
    setProfileFacilities(profileFacilities.filter((_, i) => i !== index));
  };

  const handleAddPresetFacility = (name: string) => {
    if (profileFacilities.includes(name)) {
      showToast(`Fasilitas "${name}" sudah ada di daftar.`, 'info');
      return;
    }
    setProfileFacilities([...profileFacilities, name]);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const grade = getGradeLevel(editingStudent.class_name);
    const updatedStudent: StudentGraduation = {
      ...editingStudent,
      class_name: grade,
      grade_level: grade,
      status: isClassIX(grade) ? editingStudent.status : 'AKTIF',
    };

    const exists = students.find((s) => s.id === updatedStudent.id);
    if (exists) {
      onUpdateStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
      showToast(`Data siswa ${updatedStudent.full_name} berhasil diperbarui!`, 'success');
    } else {
      onUpdateStudents([...students, updatedStudent]);
      showToast(`Siswa baru ${updatedStudent.full_name} berhasil ditambahkan!`, 'success');
    }
    setEditingStudent(null);
  };

  const handleAddNewStudent = (defaultGrade: GradeLevel = 'IX') => {
    setEditingStudent({
      id: `std-${Date.now()}`,
      nisn: '',
      nis: `2526${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: '',
      class_name: defaultGrade,
      grade_level: defaultGrade,
      birth_date: '2010-01-01',
      birth_place: 'Nusantara',
      parent_name: '-',
      status: defaultGrade === 'IX' ? 'LULUS' : 'AKTIF',
      skl_custom_url: '',
      password: 'siswa',
      avatar: '',
    });
  };

  const confirmResetPassword = () => {
    if (!resetPasswordTarget) return;
    onUpdateStudents(
      students.map((s) => (s.id === resetPasswordTarget.id ? { ...s, password: 'siswa' } : s))
    );
    showToast(`Kata sandi ${resetPasswordTarget.name} berhasil direset menjadi: siswa`, 'success');
    setResetPasswordTarget(null);
  };

  const confirmDeleteStudent = () => {
    if (!studentToDelete) return;
    onUpdateStudents(students.filter((s) => s.id !== studentToDelete.id));
    showToast(`Data siswa ${studentToDelete.full_name} telah dihapus dari sistem.`, 'info');
    setStudentToDelete(null);
  };

  // Staff (Guru / Admin) Handlers
  const handleSaveStaff = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingStaff) return;

    const displayName = editingStaff.full_name || editingStaff.name || 'Staf';
    const staffToSave: StaffAccount = {
      ...editingStaff,
      name: displayName,
      full_name: displayName,
      roleLabel: editingStaff.role === 'admin' ? 'Administrator / Operator IT' : 'Dewan Guru / Pengajar',
      identifier: editingStaff.nip && editingStaff.nip !== '-' ? `NIP. ${editingStaff.nip}` : (editingStaff.position || 'Staf Sekolah'),
    };

    const exists = staffList.find((s) => s.id === staffToSave.id);
    let updatedList: StaffAccount[];
    if (exists) {
      updatedList = staffList.map((s) => (s.id === staffToSave.id ? staffToSave : s));
      showToast(`Akun ${staffToSave.role === 'admin' ? 'Admin' : 'Guru'} (${displayName}) berhasil diperbarui!`, 'success');
    } else {
      updatedList = [...staffList, staffToSave];
      showToast(`Akun baru (${displayName}) berhasil ditambahkan!`, 'success');
    }

    setStaffList(updatedList);
    if (onUpdateStaffAccounts) {
      onUpdateStaffAccounts(updatedList);
    }
    setEditingStaff(null);
  };

  const handleAddNewStaff = (role: 'guru' | 'admin' = 'guru') => {
    setEditingStaff({
      id: `acc-${role}-${Date.now()}`,
      name: '',
      full_name: '',
      username: `${role}${Math.floor(100 + Math.random() * 900)}`,
      password: `${role}123`,
      role: role,
      roleLabel: role === 'admin' ? 'Administrator / Operator IT' : 'Dewan Guru / Pengajar',
      identifier: role === 'admin' ? 'Operator IT & Tata Usaha' : 'Dewan Guru',
      nip: '-',
      position: role === 'admin' ? 'Operator & Admin Mading' : 'Guru Mata Pelajaran',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    });
  };

  const confirmDeleteStaff = () => {
    if (!staffToDelete) return;
    const staffName = staffToDelete.full_name || staffToDelete.name;
    const updatedList = staffList.filter((s) => s.id !== staffToDelete.id);
    setStaffList(updatedList);
    if (onUpdateStaffAccounts) {
      onUpdateStaffAccounts(updatedList);
    }
    showToast(`Akun ${staffToDelete.role.toUpperCase()} "${staffName}" telah dihapus.`, 'info');
    setStaffToDelete(null);
  };

  const confirmResetStaffPassword = () => {
    if (!resetStaffPasswordTarget) return;
    const staffName = resetStaffPasswordTarget.full_name || resetStaffPasswordTarget.name;
    const defaultPass = resetStaffPasswordTarget.role === 'admin' ? 'admin123' : 'guru123';
    const updatedList = staffList.map((s) =>
      s.id === resetStaffPasswordTarget.id ? { ...s, password: defaultPass } : s
    );
    setStaffList(updatedList);
    if (onUpdateStaffAccounts) {
      onUpdateStaffAccounts(updatedList);
    }
    showToast(`Kata sandi ${staffName} berhasil direset ke "${defaultPass}"`, 'success');
    setResetStaffPasswordTarget(null);
  };

  const toggleStaffPasswordVisibility = (staffId: string) => {
    setVisibleStaffPasswords((prev) => ({
      ...prev,
      [staffId]: !prev[staffId],
    }));
  };

  const confirmDeletePost = () => {
    if (!postToDelete) return;
    onUpdatePosts(posts.filter((p) => p.id !== postToDelete.id));
    showToast(`Postingan mading "${postToDelete.title}" berhasil dihapus.`, 'info');
    setPostToDelete(null);
  };

  const handleTogglePinPost = (postId: string, currentPinStatus?: boolean) => {
    onUpdatePosts(
      posts.map((p) => (p.id === postId ? { ...p, pinned: !currentPinStatus } : p))
    );
    showToast(
      !currentPinStatus ? 'Postingan berhasil disematkan ke bagian atas!' : 'Sematkan postingan dinonaktifkan.',
      'info'
    );
  };

  const handleApprovePost = (postId: string) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;
    const updatedPosts = posts.map((p) =>
      p.id === postId ? { ...p, status: 'published' as const } : p
    );
    onUpdatePosts(updatedPosts);
    showToast(`Karya "${target.title}" berhasil disetujui dan kini resmi tayang di Mading!`, 'success');
  };

  const handleRejectPost = (postId: string) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;
    onUpdatePosts(posts.filter((p) => p.id !== postId));
    showToast(`Karya "${target.title}" telah ditolak dan dihapus.`, 'info');
  };

  const handleCreateNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: MadingPost = {
      id: `post-${Date.now()}`,
      title: newPostTitle.trim(),
      category: newPostCategory,
      author: newPostAuthor.trim() || 'Admin Sekolah',
      authorRole: 'Administrator',
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      content: newPostContent.trim(),
      excerpt: newPostExcerpt.trim() || newPostContent.trim().slice(0, 140) + '...',
      coverImage: newPostCoverImage.trim() || undefined,
      tags: ['Mading', newPostCategory],
      likes: 0,
      comments: [],
      pinned: newPostCategory === 'Pengumuman' || newPostCategory === 'Berita Sekolah',
      status: 'published',
    };

    onUpdatePosts([newPost, ...posts]);
    showToast(`Postingan mading "${newPost.title}" berhasil dipublikasikan!`, 'success');
    
    // Reset form
    setNewPostTitle('');
    setNewPostExcerpt('');
    setNewPostContent('');
    setNewPostCoverImage('');
    setIsNewPostModalOpen(false);
  };

  const togglePasswordVisibility = (studentId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleImportSuccess = (importedStudents: StudentGraduation[], mode: 'append' | 'replace' | 'merge') => {
    if (mode === 'replace') {
      onUpdateStudents(importedStudents);
      showToast(`Berhasil mengimpor ${importedStudents.length} siswa. Seluruh data lama telah digantikan.`, 'success');
    } else if (mode === 'merge') {
      const existingMap = new Map<string, StudentGraduation>(students.map((s) => [s.nisn, s]));
      importedStudents.forEach((newStd) => {
        const existing = existingMap.get(newStd.nisn);
        if (existing) {
          existingMap.set(newStd.nisn, {
            ...existing,
            ...newStd,
          });
        } else {
          existingMap.set(newStd.nisn, newStd);
        }
      });
      const merged = Array.from(existingMap.values());
      onUpdateStudents(merged);
      showToast(`Berhasil menyinkronkan data siswa. Total saat ini: ${merged.length} siswa.`, 'success');
    } else {
      // Append mode
      const existingNisns = new Set(students.map((s) => s.nisn));
      const newOnly = importedStudents.filter((s) => !existingNisns.has(s.nisn));
      onUpdateStudents([...students, ...newOnly]);
      showToast(`Berhasil menambahkan ${newOnly.length} siswa baru ke dalam sistem.`, 'success');
    }
  };

  // Filtered Students for Account List
  const filteredAccounts = (selectedGradeFilter === 'STAFF_GURU' || selectedGradeFilter === 'STAFF_ADMIN')
    ? []
    : students.filter((s) => {
        const grade = getGradeLevel(s.class_name);
        
        // Grade filter
        if (selectedGradeFilter !== 'ALL' && grade !== selectedGradeFilter) {
          return false;
        }

        // Search query filter
        if (accountSearchQuery.trim()) {
          const q = accountSearchQuery.toLowerCase();
          const matchName = s.full_name.toLowerCase().includes(q);
          const matchNisn = s.nisn.toLowerCase().includes(q);
          const matchNis = s.nis.toLowerCase().includes(q);
          const matchClass = s.class_name.toLowerCase().includes(q);
          return matchName || matchNisn || matchNis || matchClass;
        }

        return true;
      });

  // Filtered Staff for Account List
  const filteredStaffAccounts = (selectedGradeFilter === 'VII' || selectedGradeFilter === 'VIII' || selectedGradeFilter === 'IX')
    ? []
    : staffList.filter((st) => {
        if (selectedGradeFilter === 'STAFF_GURU' && st.role !== 'guru') return false;
        if (selectedGradeFilter === 'STAFF_ADMIN' && st.role !== 'admin') return false;

        if (accountSearchQuery.trim()) {
          const q = accountSearchQuery.toLowerCase();
          const matchName = st.full_name.toLowerCase().includes(q);
          const matchUser = st.username.toLowerCase().includes(q);
          const matchNip = (st.nip || '').toLowerCase().includes(q);
          const matchPos = (st.position || '').toLowerCase().includes(q);
          return matchName || matchUser || matchNip || matchPos;
        }

        return true;
      });

  // Filtered Students for Graduation SKL Tab (Only Class IX)
  const graduationStudentsList = students.filter((s) => isClassIX(s.class_name));

  // Count Statistics
  const totalAllStudents = students.length;
  const countGrade7 = students.filter((s) => getGradeLevel(s.class_name) === 'VII').length;
  const countGrade8 = students.filter((s) => getGradeLevel(s.class_name) === 'VIII').length;
  const countGrade9 = students.filter((s) => getGradeLevel(s.class_name) === 'IX').length;
  const countGuru = staffList.filter((s) => s.role === 'guru').length;
  const countAdmin = staffList.filter((s) => s.role === 'admin').length;
  const totalAllAccounts = totalAllStudents + staffList.length;

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar gap-2">
        <button
          onClick={() => {
            setActiveTab('accounts');
            setEditingStudent(null);
            setEditingStaff(null);
          }}
          className={`py-3 px-5 text-xs font-extrabold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'accounts'
              ? 'bg-white border-t-2 border-l border-r border-slate-200 text-indigo-950 shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Akun Login Siswa, Guru & Admin</span>
          <span className="bg-indigo-100 text-indigo-900 text-[10px] px-2 py-0.5 rounded-full font-black">
            {totalAllAccounts}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('kelulusan');
            setEditingStudent(null);
            setEditingStaff(null);
          }}
          className={`py-3 px-5 text-xs font-extrabold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'kelulusan'
              ? 'bg-white border-t-2 border-l border-r border-slate-200 text-indigo-950 shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-500" />
          <span>Kelulusan & SKL (Kelas IX)</span>
          <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-black">
            {countGrade9}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('profil_sekolah');
            setEditingStudent(null);
            setEditingStaff(null);
          }}
          className={`py-3 px-5 text-xs font-extrabold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'profil_sekolah'
              ? 'bg-white border-t-2 border-l border-r border-slate-200 text-indigo-950 shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span>Edit Profil Sekolah</span>
          <span className="bg-emerald-100 text-emerald-900 text-[10px] px-2 py-0.5 rounded-full font-black">
            Lengkap
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('pengaturan');
            setEditingStudent(null);
            setEditingStaff(null);
          }}
          className={`py-3 px-5 text-xs font-extrabold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'pengaturan'
              ? 'bg-white border-t-2 border-l border-r border-slate-200 text-indigo-950 shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-600" />
          <span>Pengaturan & Motivasi</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('mading');
            setEditingStudent(null);
            setEditingStaff(null);
          }}
          className={`py-3 px-5 text-xs font-extrabold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'mading'
              ? 'bg-white border-t-2 border-l border-r border-slate-200 text-indigo-950 shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Newspaper className="w-4 h-4 text-blue-600" />
          <span>Kelola Mading & Moderasi</span>
          {posts.filter((p) => p.status === 'pending').length > 0 ? (
            <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse flex items-center gap-1 shadow-xs">
              <Clock className="w-2.5 h-2.5" />
              <span>{posts.filter((p) => p.status === 'pending').length} Menunggu</span>
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-900 text-[10px] px-2 py-0.5 rounded-full font-black">
              {posts.length}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AKUN LOGIN SISWA, GURU & ADMIN */}
      {/* ========================================================================= */}
      {activeTab === 'accounts' && !editingStudent && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          
          {/* Top Header & Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded border border-indigo-200">
                  MANAJEMEN KREDENSIAL LENGKAP
                </span>
              </div>
              <h3 className="font-black text-xl text-slate-900 mt-1">
                Pengelolaan Akun Siswa, Dewan Guru & Administrator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola login akun siswa (VII, VIII, IX), Guru, dan Admin. Anda dapat mengedit username, nama, sandi, import excel, dan mencetak kartu login.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Import Siswa Massal format Microsoft Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Import Siswa (.xlsx)</span>
              </button>

              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-300 cursor-pointer"
                title="Cetak Kartu Login Siswa per Kelas"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Kartu Login</span>
              </button>

              <button
                onClick={() => handleAddNewStaff('guru')}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Tambah Akun Guru / Admin Baru"
              >
                <Shield className="w-4 h-4" />
                <span>+ Guru / Admin</span>
              </button>

              <button
                onClick={() => handleAddNewStudent(selectedGradeFilter === 'VII' || selectedGradeFilter === 'VIII' || selectedGradeFilter === 'IX' ? selectedGradeFilter : 'IX')}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Siswa</span>
              </button>
            </div>
          </div>

          {/* Statistics Badges by Category */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Total Akun</span>
              <span className="text-xl font-black text-slate-900">{totalAllAccounts}</span>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-700 block">Kelas VII</span>
              <span className="text-xl font-black text-indigo-950">{countGrade7}</span>
            </div>

            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-2xl">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-teal-700 block">Kelas VIII</span>
              <span className="text-xl font-black text-teal-950">{countGrade8}</span>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-800 block">Kelas IX</span>
              <span className="text-xl font-black text-amber-950">{countGrade9}</span>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-800 block">Dewan Guru</span>
              <span className="text-xl font-black text-purple-950">{countGuru}</span>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-800 block">Admin</span>
              <span className="text-xl font-black text-rose-950">{countAdmin}</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              
              {/* Category & Grade Tabs Filter */}
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto">
                <button
                  onClick={() => setSelectedGradeFilter('ALL')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedGradeFilter === 'ALL'
                      ? 'bg-indigo-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({totalAllAccounts})
                </button>

                <button
                  onClick={() => setSelectedGradeFilter('VII')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedGradeFilter === 'VII'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kelas VII ({countGrade7})
                </button>

                <button
                  onClick={() => setSelectedGradeFilter('VIII')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedGradeFilter === 'VIII'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kelas VIII ({countGrade8})
                </button>

                <button
                  onClick={() => setSelectedGradeFilter('IX')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedGradeFilter === 'IX'
                      ? 'bg-amber-500 text-indigo-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kelas IX ({countGrade9})
                </button>

                <button
                  onClick={() => setSelectedGradeFilter('STAFF_GURU')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedGradeFilter === 'STAFF_GURU'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50'
                  }`}
                >
                  Dewan Guru ({countGuru})
                </button>

                <button
                  onClick={() => setSelectedGradeFilter('STAFF_ADMIN')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedGradeFilter === 'STAFF_ADMIN'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-rose-700 hover:text-rose-900 hover:bg-rose-50'
                  }`}
                >
                  Admin ({countAdmin})
                </button>
              </div>

              {/* Quick Import Shortcut */}
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer flex-shrink-0"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Excel Siswa</span>
              </button>
            </div>

            {/* Search query input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari akun berdasarkan Nama, NISN/NIP, Username, atau Kelas..."
                value={accountSearchQuery}
                onChange={(e) => setAccountSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Table of Accounts (Students & Staff) */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Nama & Foto Profil</th>
                  <th className="p-3.5">Identitas (NISN/NIP/User)</th>
                  <th className="p-3.5">Peran / Kelas</th>
                  <th className="p-3.5">Kredensial Password</th>
                  <th className="p-3.5">Status Hak Akses</th>
                  <th className="p-3.5 text-right">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredStaffAccounts.length === 0 && filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 text-xs font-medium">
                      Tidak ada data akun yang cocok dengan filter atau kata kunci yang dipilih.
                    </td>
                  </tr>
                ) : (
                  <>
                    {/* Render Staff Accounts (Guru & Admin) */}
                    {filteredStaffAccounts.map((st) => {
                      const isVisible = visibleStaffPasswords[st.id] || false;
                      const isAdmin = st.role === 'admin';

                      return (
                        <tr key={st.id} className="bg-purple-50/20 hover:bg-purple-50/50 transition-colors">
                          {/* Name & Avatar */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={st.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'}
                                alt={st.full_name}
                                className="w-9 h-9 rounded-xl object-cover border border-purple-200 flex-shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-slate-900 block leading-snug">
                                    {st.full_name}
                                  </span>
                                  <span
                                    className={`text-[9px] font-black px-1.5 py-0.2 rounded border uppercase ${
                                      isAdmin
                                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                                        : 'bg-purple-100 text-purple-800 border-purple-300'
                                    }`}
                                  >
                                    {isAdmin ? 'ADMIN' : 'GURU'}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-500 block">
                                  {st.position || (isAdmin ? 'Operator Sistem' : 'Dewan Guru')}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* NIP & Username */}
                          <td className="p-3.5">
                            <div className="font-mono text-xs space-y-0.5">
                              <span className="font-bold text-slate-900 block">
                                User: <span className="text-purple-700">{st.username}</span>
                              </span>
                              <span className="text-slate-500 text-[11px] block">
                                NIP: {st.nip || '-'}
                              </span>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="p-3.5">
                            <span
                              className={`inline-block text-xs font-black px-2.5 py-1 rounded-lg border ${
                                isAdmin
                                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                                  : 'bg-purple-100 text-purple-900 border-purple-300'
                              }`}
                            >
                              {isAdmin ? 'Administrator' : 'Dewan Guru'}
                            </span>
                          </td>

                          {/* Password Column */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                {isVisible ? st.password : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleStaffPasswordVisibility(st.id)}
                                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                                title={isVisible ? 'Sembunyikan' : 'Lihat Sandi'}
                              >
                                {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => setResetStaffPasswordTarget(st)}
                                className="text-[10px] font-bold text-purple-700 hover:underline px-1 cursor-pointer"
                                title="Reset kata sandi staff ke default"
                              >
                                Reset
                              </button>
                            </div>
                          </td>

                          {/* Status Access */}
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              <Shield className="w-3 h-3 text-purple-600" />
                              <span>{isAdmin ? 'Akses Penuh Mading & Kelulusan' : 'Akses Guru & Editor Mading'}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => setEditingStaff(st)}
                              className="p-1.5 text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit Akun & Sandi Staff"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setStaffToDelete(st)}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Akun Staff"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Render Student Accounts */}
                    {filteredAccounts.map((std) => {
                      const grade = getGradeLevel(std.class_name);
                      const isVisible = visiblePasswords[std.id] || false;
                      const isGrade9 = grade === 'IX';

                      return (
                        <tr key={std.id} className="hover:bg-slate-50/90 transition-colors">
                          {/* Name & Avatar */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              {std.avatar ? (
                                <img
                                  src={std.avatar}
                                  alt={std.full_name}
                                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
                                  {std.full_name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <span className="font-extrabold text-slate-900 block leading-snug">
                                  {std.full_name}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  ID: {std.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* NISN & NIS */}
                          <td className="p-3.5">
                            <div className="font-mono text-xs space-y-0.5">
                              <span className="font-bold text-slate-900 block">
                                NISN: {std.nisn || '-'}
                              </span>
                              <span className="text-slate-500 text-[11px] block">
                                NIS: {std.nis || '-'}
                              </span>
                            </div>
                          </td>

                          {/* Class Badge */}
                          <td className="p-3.5">
                            <span
                              className={`inline-block text-xs font-black px-2.5 py-1 rounded-lg border ${
                                grade === 'IX'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : grade === 'VIII'
                                  ? 'bg-teal-100 text-teal-900 border-teal-300'
                                  : 'bg-indigo-100 text-indigo-900 border-indigo-300'
                              }`}
                            >
                              Kelas {grade}
                            </span>
                          </td>

                          {/* Password Column */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                {isVisible ? std.password || 'siswa' : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(std.id)}
                                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                                title={isVisible ? 'Sembunyikan' : 'Lihat Sandi'}
                              >
                                {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => setResetPasswordTarget({ id: std.id, name: std.full_name })}
                                className="text-[10px] font-bold text-indigo-600 hover:underline px-1 cursor-pointer"
                                title="Reset kata sandi ke 'siswa'"
                              >
                                Reset
                              </button>
                            </div>
                          </td>

                          {/* Status Access */}
                          <td className="p-3.5">
                            {isGrade9 ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                <GraduationCap className="w-3 h-3 text-amber-600" />
                                <span>Portal Kelulusan & SKL</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Siswa Aktif (Mading)</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                            {onDirectLoginAsStudent && (
                              <button
                                onClick={() => onDirectLoginAsStudent(std)}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                                title="Simulasi login langsung sebagai siswa ini"
                              >
                                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Login Siswa</span>
                              </button>
                            )}

                            <button
                              onClick={() => setEditingStudent(std)}
                              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Data Siswa & Sandi"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setStudentToDelete(std)}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Data Siswa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DATA KELULUSAN & LINK SKL (KHUSUS KELAS IX) */}
      {/* ========================================================================= */}
      {activeTab === 'kelulusan' && !editingStudent && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                  TINGKAT AKHIR (KELAS IX)
                </span>
              </div>
              <h3 className="font-black text-xl text-slate-900 mt-1">Data Kelulusan & Link Dokumen SKL</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola penetapan status kelulusan (LULUS / TIDAK LULUS) dan tautan dokumen SKL resmi siswa Kelas IX.
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Import Excel (.xlsx)</span>
              </button>

              <button
                onClick={() => handleAddNewStudent('IX')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Siswa Kelas IX</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Nama Siswa</th>
                  <th className="p-3.5">NISN</th>
                  <th className="p-3.5">Kelas</th>
                  <th className="p-3.5">Status Kelulusan</th>
                  <th className="p-3.5">Link SKL Online</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {graduationStudentsList.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{std.full_name}</td>
                    <td className="p-3.5 font-mono text-slate-700">{std.nisn}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-xs bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                        Kelas IX
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          std.status === 'LULUS'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : std.status === 'DITANGGUHKAN'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {std.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {std.skl_custom_url ? (
                        <a
                          href={std.skl_custom_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                        >
                          <span>Buka Link SKL</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Belum diunggah</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setEditingStudent(std)}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Data & SKL"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setStudentToDelete(std)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Data Siswa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORM EDIT / TAMBAH SISWA (KELAS VII, VIII, IX) */}
      {/* ========================================================================= */}
      {editingStudent && (
        <form onSubmit={handleSaveStudent} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-xl text-slate-900">
                {students.some((s) => s.id === editingStudent.id) ? 'Edit Data Siswa & Kata Sandi' : 'Tambah Akun Siswa Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Lengkapi identitas, pilihan kelas (VII, VIII, IX), kata sandi login, dan tautan SKL (khusus kelas IX).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditingStudent(null)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nama Lengkap Siswa <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={editingStudent.full_name}
                onChange={(e) => setEditingStudent({ ...editingStudent, full_name: e.target.value })}
                placeholder="Contoh: Nabila Putri"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                NISN (Nomor Induk Siswa Nasional) <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={editingStudent.nisn}
                onChange={(e) => setEditingStudent({ ...editingStudent, nisn: e.target.value })}
                placeholder="Contoh: 0088991122"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-mono font-bold focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                NIS (Nomor Induk Sekolah)
              </label>
              <input
                value={editingStudent.nis}
                onChange={(e) => setEditingStudent({ ...editingStudent, nis: e.target.value })}
                placeholder="Contoh: 25263001"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-mono font-bold focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kelas <span className="text-red-500">*</span>
              </label>
              <select
                value={editingStudent.class_name || 'IX'}
                onChange={(e) => setEditingStudent({ ...editingStudent, class_name: e.target.value as GradeLevel })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:outline-none focus:border-indigo-600 bg-white"
              >
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX (Tingkat Akhir & Kelulusan)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kata Sandi Login (Password) <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={editingStudent.password || 'siswa'}
                onChange={(e) => setEditingStudent({ ...editingStudent, password: e.target.value })}
                placeholder="Default: siswa"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:outline-none focus:border-indigo-600 bg-slate-50"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                *Kata sandi yang digunakan siswa untuk masuk ke portal siswa.
              </span>
            </div>

            {isClassIX(editingStudent.class_name) && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Status Kelulusan (Khusus Kelas IX) <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingStudent.status}
                  onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value as GraduationStatus })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="LULUS">LULUS</option>
                  <option value="TIDAK_LULUS">TIDAK LULUS</option>
                  <option value="DITANGGUHKAN">DITANGGUHKAN</option>
                </select>
              </div>
            )}

            {isClassIX(editingStudent.class_name) && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Link Upload SKL (Google Drive / Link PDF)
                </label>
                <input
                  value={editingStudent.skl_custom_url || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, skl_custom_url: e.target.value })}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-600"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  *Masukkan tautan dokumen SKL resmi siswa yang telah di-upload ke Google Drive / PDF online.
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingStudent(null)}
              className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Siswa</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB: EDIT PROFIL SEKOLAH LENGKAP */}
      {/* ========================================================================= */}
      {activeTab === 'profil_sekolah' && (
        <form onSubmit={handleSaveSchoolProfile} className="space-y-6">
          
          {/* Header & Quick Action Bar */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  PROFIL & IDENTITAS RESMI
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  NPSN: {profileNpsn || settings.npsn}
                </span>
              </div>
              <h3 className="font-black text-xl sm:text-2xl text-slate-900 mt-1.5 flex items-center gap-2">
                Edit Profil Sekolah
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Kelola identitas resmi, legalitas, sambutan kepala sekolah, visi & misi, fasilitas, sejarah, hingga kontak sekolah. Perubahan akan langsung tampil di halaman Profil Sekolah publik dan kop surat SKL.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              {onViewPublicProfile && (
                <button
                  type="button"
                  onClick={onViewPublicProfile}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-200"
                >
                  <Eye className="w-4 h-4 text-slate-600" />
                  <span>Lihat Tampilan Publik</span>
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>

          {/* BAGIAN 1: IDENTITAS & LEGALITAS SEKOLAH */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-950 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5 text-indigo-700" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">1. Identitas & Legalitas Sekolah</h4>
                  <p className="text-xs text-slate-500">Nama resmi, naungan dinas pendidikan, akreditasi, dan logo satuan pendidikan.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nama Resmi Sekolah <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={profileSchoolName}
                  onChange={(e) => setProfileSchoolName(e.target.value)}
                  placeholder="Contoh: SMP Negeri 1 Nusantara"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Instansi / Dinas Pendidikan Naungan <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={profileDinasName}
                  onChange={(e) => setProfileDinasName(e.target.value)}
                  placeholder="Contoh: DINAS PENDIDIKAN KOTA NUSANTARA"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-semibold uppercase text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  NPSN (Nomor Pokok Sekolah Nasional) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={profileNpsn}
                  onChange={(e) => setProfileNpsn(e.target.value)}
                  placeholder="Contoh: 20101234"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tahun Pelajaran Aktif
                </label>
                <input
                  value={profileAcademicYear}
                  onChange={(e) => setProfileAcademicYear(e.target.value)}
                  placeholder="Contoh: 2025/2026"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Status Akreditasi & Lembaga
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={profileAccreditation}
                    onChange={(e) => setProfileAccreditation(e.target.value)}
                    placeholder="Contoh: A (Unggul) - BAN S/M"
                    className="flex-1 border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setProfileAccreditation('A (Unggul) - BAN S/M')}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200"
                    >
                      Preset: A (Unggul)
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileAccreditation('A (Amat Baik)')}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200"
                    >
                      Preset: A (Amat Baik)
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileAccreditation('B (Baik)')}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200"
                    >
                      Preset: B (Baik)
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Kurikulum Pembelajaran
                </label>
                <input
                  value={profileCurriculum}
                  onChange={(e) => setProfileCurriculum(e.target.value)}
                  placeholder="Contoh: Kurikulum Merdeka Mandiri Berbagi & Terintegrasi Digital"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Motto / Slogan Resmi Sekolah
                </label>
                <input
                  value={profileMotto}
                  onChange={(e) => setProfileMotto(e.target.value)}
                  placeholder="Contoh: Unggul dalam Prestasi, Berkarakter Pancasila, Berwawasan Global"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm italic text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Logo URL with Live Preview */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  URL Logo Sekolah
                </label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-1">
                    <input
                      value={profileLogoUrl}
                      onChange={(e) => setProfileLogoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-600 font-mono text-xs"
                    />
                    <span className="text-[11px] text-slate-400 block">
                      *Gunakan URL gambar berformat PNG/JPG transparan untuk hasil terbaik.
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                    {profileLogoUrl ? (
                      <img
                        src={profileLogoUrl}
                        alt="Preview Logo"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                </div>
              </div>

              {/* Hero Banner Image URL with Live Preview */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  URL Foto Gedung / Banner Hero
                </label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-1">
                    <input
                      value={profileHeroImageUrl}
                      onChange={(e) => setProfileHeroImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-600 font-mono text-xs"
                    />
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() =>
                          setProfileHeroImageUrl(
                            'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80'
                          )
                        }
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 underline font-medium"
                      >
                        Gunakan Foto Gedung Modern
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() =>
                          setProfileHeroImageUrl(
                            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80'
                          )
                        }
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 underline font-medium"
                      >
                        Gunakan Foto Kampus Edukasi
                      </button>
                    </div>
                  </div>
                  <div className="w-20 h-14 rounded-xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {profileHeroImageUrl ? (
                      <img
                        src={profileHeroImageUrl}
                        alt="Preview Banner"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 2: KEPALA SEKOLAH & SAMBUTAN RESMI */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-950 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">2. Pimpinan & Sambutan Kepala Sekolah</h4>
                  <p className="text-xs text-slate-500">Nama lengkap pimpinan sekolah, NIP resmi, foto, dan pesan sambutan.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nama Lengkap Kepala Sekolah & Gelar <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={profilePrincipalName}
                  onChange={(e) => setProfilePrincipalName(e.target.value)}
                  placeholder="Contoh: Dr. H. Bambang Hartono, M.Pd."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  NIP Kepala Sekolah <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={profilePrincipalNip}
                  onChange={(e) => setProfilePrincipalNip(e.target.value)}
                  placeholder="Contoh: 19750812 199903 1 002"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  URL Foto Resmi Kepala Sekolah
                </label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-1">
                    <input
                      value={profilePrincipalPhotoUrl}
                      onChange={(e) => setProfilePrincipalPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-600 font-mono text-xs"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setProfilePrincipalPhotoUrl(
                            'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'
                          )
                        }
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 underline font-medium"
                      >
                        Gunakan Foto Pria Formal
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() =>
                          setProfilePrincipalPhotoUrl(
                            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
                          )
                        }
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 underline font-medium"
                      >
                        Gunakan Foto Wanita Formal
                      </button>
                    </div>
                  </div>
                  <div className="w-16 h-20 rounded-xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                    {profilePrincipalPhotoUrl ? (
                      <img
                        src={profilePrincipalPhotoUrl}
                        alt="Foto Kepala Sekolah"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Teks Sambutan Resmi Kepala Sekolah
                </label>
                <textarea
                  rows={5}
                  value={profileWelcomeMessage}
                  onChange={(e) => setProfileWelcomeMessage(e.target.value)}
                  placeholder="Tuliskan kata sambutan hangat dari kepala sekolah untuk seluruh warga sekolah, siswa, dan orang tua..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  *Pesan ini akan disematkan di kartu sambutan kepala sekolah pada halaman Profil Sekolah.
                </span>
              </div>
            </div>
          </div>

          {/* BAGIAN 3: VISI & MISI SEKOLAH */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-950 flex items-center justify-center font-bold">
                  <Target className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">3. Visi & Misi Satuan Pendidikan</h4>
                  <p className="text-xs text-slate-500">Cita-cita luhur dan butir-butir misi pencapaian mutu pendidikan sekolah.</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>Visi Sekolah</span>
                </label>
                <textarea
                  rows={2}
                  value={profileVision}
                  onChange={(e) => setProfileVision(e.target.value)}
                  placeholder="Contoh: Terwujudnya Generasi Emas yang Beriman, Unggul dalam IPTEK, Berkarakter Profil Pelajar Pancasila, dan Berwawasan Lingkungan Global."
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Daftar Butir Misi Sekolah ({profileMissions.length} Butir)</span>
                </label>

                <div className="space-y-2.5">
                  {profileMissions.map((missionText, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        value={missionText}
                        onChange={(e) => handleUpdateMission(idx, e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMission(idx)}
                        title="Hapus Butir Misi"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add New Mission Input */}
                  <div className="flex gap-2 pt-2">
                    <input
                      value={newMissionInput}
                      onChange={(e) => setNewMissionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMission();
                        }
                      }}
                      placeholder="Ketik butir misi baru lalu tekan Tambah..."
                      className="flex-1 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddMission}
                      disabled={!newMissionInput.trim()}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Misi</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 4: SEJARAH & SARANA PRASARANA */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-950 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">4. Sejarah Singkat & Sarana Prasarana</h4>
                  <p className="text-xs text-slate-500">Rekam jejak pendirian sekolah dan daftar fasilitas unggulan yang dimiliki.</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Sejarah Singkat Satuan Pendidikan
                </label>
                <textarea
                  rows={4}
                  value={profileHistory}
                  onChange={(e) => setProfileHistory(e.target.value)}
                  placeholder="Tuliskan sejarah berdirinya sekolah, tonggak pencapaian, dan perkembangannya hingga saat ini..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Daftar Fasilitas & Sarana Unggulan ({profileFacilities.length})</span>
                  </label>
                </div>

                {/* Facilities Badges */}
                <div className="flex flex-wrap gap-2 mb-3 min-h-[44px] p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  {profileFacilities.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">Belum ada fasilitas yang ditambahkan.</span>
                  ) : (
                    profileFacilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-indigo-950 font-bold text-xs border border-indigo-200 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{fac}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(idx)}
                          className="text-slate-400 hover:text-red-500 ml-1 rounded-full p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Custom Facility */}
                <div className="flex gap-2 mb-3">
                  <input
                    value={newFacilityInput}
                    onChange={(e) => setNewFacilityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFacility();
                      }
                    }}
                    placeholder="Tambah fasilitas baru (misal: Studio Robotika, Green House)..."
                    className="flex-1 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    disabled={!newFacilityInput.trim()}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah</span>
                  </button>
                </div>

                {/* Quick Add Presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 block">Pilihan Cepat Fasilitas Standar (Klik untuk menambahkan):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Gedung Belajar Ber-AC & Smart Projector',
                      'Laboratorium Komputer & Studio AI',
                      'Studio Robotika & Coding',
                      'Perpustakaan Digital Cendekia',
                      'Studio Podcast & Mading Digital',
                      'Laboratorium IPA Terpadu (Fisika & Biologi)',
                      'Lapangan Olahraga Multifungsi (Futsal, Basket, Voli)',
                      'Masjid Sekolah & Ruang Ibadah',
                      'Kantin Sehat & Green House Hidroponik',
                      'Klinik UKS & Ruang Medis Siswa',
                      'Gedung Aula Serbaguna Graha Widya',
                    ].map((presetName, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddPresetFacility(presetName)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          profileFacilities.includes(presetName)
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 opacity-60 cursor-default'
                            : 'bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border-slate-200 hover:border-indigo-300 cursor-pointer'
                        }`}
                      >
                        + {presetName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 5: INFORMASI KONTAK & ALAMAT RESMI */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-950 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">5. Kontak Resmi & Alamat Satuan Pendidikan</h4>
                  <p className="text-xs text-slate-500">Alamat domisili, nomor telepon pelayanan, email, website, dan teks copyright footer.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span>Alamat Lengkap Sekolah</span>
                </label>
                <input
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  placeholder="Contoh: Jl. Pendidikan No. 45, Kecamatan Cerdas, Kota Nusantara, Provinsi Jawa Barat 10110"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-purple-600" />
                  <span>Nomor Telepon Kantor / WhatsApp</span>
                </label>
                <input
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="Contoh: (021) 555-0199 / 0812-3456-7890"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span>Email Resmi Sekolah</span>
                </label>
                <input
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="Contoh: info@smpn1nusantara.sch.id"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span>Website / Domain Resmi</span>
                </label>
                <input
                  value={profileWebsite}
                  onChange={(e) => setProfileWebsite(e.target.value)}
                  placeholder="Contoh: https://smpn1nusantara.sch.id"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Teks Hak Cipta Footer (Copyright)
                </label>
                <input
                  value={profileFooterCopyright}
                  onChange={(e) => setProfileFooterCopyright(e.target.value)}
                  placeholder="Contoh: © 2026 SMP Negeri 1 Nusantara. All rights reserved."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* BOTTOM SUBMIT BAR */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-30">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pastikan seluruh data dan identitas sekolah telah diisi dengan akurat.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => {
                  setProfileSchoolName(settings.school_name || '');
                  setProfileDinasName(settings.dinas_name || '');
                  setProfileNpsn(settings.npsn || '');
                  setProfileAcademicYear(settings.academic_year || '2025/2026');
                  setProfileAccreditation(settings.profile?.accreditation || 'A (Unggul) - BAN S/M');
                  setProfileCurriculum(settings.profile?.curriculum || 'Kurikulum Merdeka Mandiri Berbagi');
                  setProfileMotto(settings.profile?.motto || '');
                  setProfileLogoUrl(settings.logo_url || '');
                  setProfileHeroImageUrl(settings.profile?.hero_image_url || '');
                  setProfilePrincipalName(settings.principal_name || '');
                  setProfilePrincipalNip(settings.principal_nip || '');
                  setProfilePrincipalPhotoUrl(settings.profile?.principal_photo_url || '');
                  setProfileWelcomeMessage(settings.profile?.welcome_message || '');
                  setProfileVision(settings.profile?.vision || '');
                  setProfileMissions(settings.profile?.mission || []);
                  setProfileHistory(settings.profile?.history || '');
                  setProfileFacilities(settings.profile?.facilities || []);
                  setProfileAddress(settings.address || '');
                  setProfilePhone(settings.phone || '');
                  setProfileEmail(settings.email || '');
                  setProfileWebsite(settings.website || '');
                  setProfileFooterCopyright(settings.footer_copyright || '');
                  showToast('Form telah direset ke data tersimpan saat ini.', 'info');
                }}
                className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Reset Perubahan
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Profil Sekolah</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PENGATURAN & MOTIVASI */}
      {/* ========================================================================= */}
      {activeTab === 'pengaturan' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          {/* BAGIAN 1: KUSTOMISASI BANNER HEADER MADING & CALL TO ACTION */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-950 flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900">
                    Kustomisasi Banner & Tombol Header Mading Digital
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ubah judul utama, deskripsi pengantar, label badge, serta teks tombol aksi di halaman depan Mading.
                  </p>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Preset Teks:</span>
                <button
                  type="button"
                  onClick={() => {
                    setHeroBadge('Kreativitas & Prestasi Tanpa Batas');
                    setHeroTitle('Mading Digital Resmi & Informasi Terpadu Sekolah');
                    setHeroDescription(
                      'Wadah ekspresi karya siswa, artikel edukasi, pengumuman resmi sekolah, dan informasi pengumuman kelulusan siswa kelas IX.'
                    );
                    setHeroBtnSubmitText('Kirim Karya Siswa Baru');
                    setHeroBtnSubmitShow(true);
                    setHeroBtnGradText('Cek Kelulusan (Khusus Kelas IX)');
                    setHeroBtnGradShow(true);
                    showToast('Preset Standar diterapkan!', 'info');
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all border border-slate-200"
                >
                  Standar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHeroBadge('Bulan Bahasa & Literasi Digital');
                    setHeroTitle('Ruang Kreasi Puisi, Cerpen & Jurnalistik Siswa');
                    setHeroDescription(
                      'Apresiasi karya literasi terbaik civitas akademika sekolah. Tuangkan inspirasi, tulisan inspiratif, dan prestasi hebatmu di sini!'
                    );
                    setHeroBtnSubmitText('Unggah Karya Tulisan');
                    setHeroBtnSubmitShow(true);
                    setHeroBtnGradText('Lihat Galeri Prestasi');
                    setHeroBtnGradShow(true);
                    showToast('Preset Bulan Bahasa & Literasi diterapkan!', 'info');
                  }}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-lg transition-all border border-indigo-200"
                >
                  Bulan Literasi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHeroBadge('Tahun Ajaran Baru 2026/2027');
                    setHeroTitle('Selamat Datang Peserta Didik Baru & Civitas Sekolah');
                    setHeroDescription(
                      'Pusat informasi kegiatan MPLS, jadwal pembelajaran digital, ekstrakurikuler unggulan, dan karya inspirasi siswa.'
                    );
                    setHeroBtnSubmitText('Kirim Karya Siswa Baru');
                    setHeroBtnSubmitShow(true);
                    setHeroBtnGradText('Informasi Siswa');
                    setHeroBtnGradShow(false);
                    showToast('Preset Tahun Ajaran Baru diterapkan!', 'info');
                  }}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg transition-all border border-emerald-200"
                >
                  Tahun Ajaran Baru
                </button>
              </div>
            </div>

            {/* LIVE PREVIEW OF THE BANNER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Pratinjau Langsung Tampilan Banner Publik:</span>
                </span>
                <span className="text-[11px] text-slate-400 italic">Otomatis menyesuaikan saat Anda mengetik</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white p-5 sm:p-6 shadow-md border border-indigo-800 border-l-4 border-l-amber-400">
                <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl space-y-2.5">
                  {heroBadge && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-400/15 border border-amber-400/30 text-amber-300 rounded text-[11px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{heroBadge || 'Kreativitas & Prestasi'}</span>
                    </div>
                  )}

                  <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-snug text-white">
                    {heroTitle || 'Judul Utama Banner Mading'}
                  </h2>

                  <p className="text-indigo-200 text-xs sm:text-xs leading-relaxed">
                    {heroDescription || 'Deskripsi singkat mading sekolah...'}
                  </p>

                  {(heroBtnSubmitShow || heroBtnGradShow) && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {heroBtnSubmitShow && (
                        <div className="px-3 py-1.5 bg-amber-400 text-indigo-950 font-extrabold rounded text-[11px] uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-amber-300 pointer-events-none">
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>{heroBtnSubmitText || 'Kirim Karya Siswa'}</span>
                        </div>
                      )}

                      {heroBtnGradShow && (
                        <div className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold rounded text-[11px] uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-emerald-500 pointer-events-none">
                          <Newspaper className="w-3.5 h-3.5" />
                          <span>{heroBtnGradText || 'Cek Kelulusan'}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FORM INPUTS FOR BANNER & CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  1. Tagline Badge / Label Mini Atas
                </label>
                <input
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  placeholder="Contoh: Kreativitas & Prestasi Tanpa Batas"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  *Label teks kecil dengan ikon kilau di atas judul utama (kosongkan jika tidak ingin menampilkan badge).
                </span>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  2. Judul Utama Banner Mading <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Contoh: Mading Digital Resmi & Informasi Terpadu Sekolah"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-black text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  3. Deskripsi / Teks Pengantar Banner <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  placeholder="Wadah ekspresi karya siswa, artikel edukasi, pengumuman resmi sekolah, dan informasi pengumuman kelulusan..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>

              {/* Tombol 1: Kirim Karya */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-amber-600" />
                    <span>Tombol Aksi 1 (Kuning)</span>
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroBtnSubmitShow}
                      onChange={(e) => setHeroBtnSubmitShow(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-amber-900">Tampilkan</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Teks Tombol Kirim Karya
                  </label>
                  <input
                    value={heroBtnSubmitText}
                    onChange={(e) => setHeroBtnSubmitText(e.target.value)}
                    disabled={!heroBtnSubmitShow}
                    placeholder="Contoh: Kirim Karya Siswa Baru"
                    className={`w-full border rounded-xl p-2 text-xs font-bold ${
                      heroBtnSubmitShow
                        ? 'bg-white border-amber-300 text-slate-900 focus:outline-none focus:border-amber-500'
                        : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    *Membuka formulir unggah kirim karya siswa / guru baru.
                  </span>
                </div>
              </div>

              {/* Tombol 2: Cek Kelulusan */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <Newspaper className="w-4 h-4 text-emerald-600" />
                    <span>Tombol Aksi 2 (Hijau)</span>
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroBtnGradShow}
                      onChange={(e) => setHeroBtnGradShow(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-emerald-900">Tampilkan</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Teks Tombol Kelulusan / Portal
                  </label>
                  <input
                    value={heroBtnGradText}
                    onChange={(e) => setHeroBtnGradText(e.target.value)}
                    disabled={!heroBtnGradShow}
                    placeholder="Contoh: Cek Kelulusan (Khusus Kelas IX)"
                    className={`w-full border rounded-xl p-2 text-xs font-bold ${
                      heroBtnGradShow
                        ? 'bg-white border-emerald-300 text-slate-900 focus:outline-none focus:border-emerald-500'
                        : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    *Mengarahkan pengunjung ke tab Informasi Kelulusan & SKL Kelas IX.
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* BAGIAN 2: IDENTITAS SEKOLAH & WAKTU KELULUSAN */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-black text-xl text-slate-900">Pengaturan Sekolah & Waktu Rilis Kelulusan</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sesuaikan nama sekolah, logo, dan waktu pembukaan pengumuman kelulusan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nama Sekolah <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Logo URL (Opsional)
                </label>
                <input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Waktu Rilis Pengumuman Kelulusan
                </label>
                <input
                  type="datetime-local"
                  value={releaseTime}
                  onChange={(e) => setReleaseTime(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="isUnlockedCheck"
                  checked={isUnlocked}
                  onChange={(e) => setIsUnlocked(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="isUnlockedCheck" className="text-sm font-bold text-slate-800 cursor-pointer">
                  Buka Pengumuman Langsung (Bypass Waktu Hitung Mundur)
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Teks Motivasi Bergerak (Marquee Running Text)</span>
                </label>
                <textarea
                  rows={3}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Tulis kalimat motivasi untuk siswa..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Teks Footer Copyright
                </label>
                <input
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                  placeholder="© 2026 SMP Negeri 1 Nusantara. All rights reserved."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onResetDemoData}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Data Sampel</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Pengaturan</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: KELOLA MADING & MODERASI */}
      {/* ========================================================================= */}
      {activeTab === 'mading' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          {/* Header & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <Newspaper className="w-4 h-4" />
                </span>
                <h3 className="font-black text-xl text-slate-900">Kelola Postingan & Moderasi Mading</h3>
              </div>
              <p className="text-xs text-slate-500">
                Tinjau dan setujui karya kiriman siswa (moderasi), terbitkan berita resmi sekolah, dan kelola artikel mading.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab('pengaturan')}
                className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Edit Banner Judul, Deskripsi & Tombol Header Mading"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Edit Banner & Tombol</span>
              </button>

              <button
                onClick={() => setIsNewPostModalOpen(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tulis Postingan Baru</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">Total Mading</span>
              <span className="text-xl font-black text-slate-900">{posts.length}</span>
            </div>

            <div 
              onClick={() => setMadingStatusFilter('pending')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                posts.filter((p) => p.status === 'pending').length > 0
                  ? 'bg-amber-50 border-amber-300 hover:border-amber-400 hover:shadow-xs'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 block uppercase">Menunggu Moderasi</span>
                {posts.filter((p) => p.status === 'pending').length > 0 && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </div>
              <span className="text-xl font-black text-amber-950">
                {posts.filter((p) => p.status === 'pending').length} Karya
              </span>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-emerald-800 block uppercase">Sudah Terbit</span>
              <span className="text-xl font-black text-emerald-900">{posts.filter((p) => p.status !== 'pending').length} Post</span>
            </div>

            <div className="bg-rose-50/60 border border-rose-200/80 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-rose-800 block uppercase">Total Apresiasi</span>
              <span className="text-xl font-black text-rose-900">{posts.reduce((acc, p) => acc + (p.likes || 0), 0)} Suka</span>
            </div>
          </div>

          {/* Pending Moderation Alert Banner */}
          {posts.filter((p) => p.status === 'pending').length > 0 && (
            <div className="bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0 font-bold">
                  <Clock className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-amber-950">
                    Ada {posts.filter((p) => p.status === 'pending').length} Karya Siswa Menunggu Moderasi & Persetujuan
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Karya ini belum ditampilkan ke publik. Klik <strong>"Setujui & Publikasikan"</strong> untuk menayangkan karya ke seluruh warga sekolah.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMadingStatusFilter('pending')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-colors whitespace-nowrap shadow-xs cursor-pointer flex-shrink-0"
              >
                Tampilkan Karya Menunggu Moderasi ({posts.filter((p) => p.status === 'pending').length})
              </button>
            </div>
          )}

          {/* Filter Status & Kategori Toolbar */}
          <div className="space-y-3 pt-1">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
                Filter Status:
              </span>
              <button
                onClick={() => setMadingStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  madingStatusFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Post ({posts.length})
              </button>
              <button
                onClick={() => setMadingStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  madingStatusFilter === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Menunggu Moderasi ({posts.filter((p) => p.status === 'pending').length})</span>
              </button>
              <button
                onClick={() => setMadingStatusFilter('published')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  madingStatusFilter === 'published'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Sudah Terbit ({posts.filter((p) => p.status !== 'pending').length})</span>
              </button>
            </div>

            {/* Category Filter & Search Box */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-1.5 flex-1">
                {['ALL', 'Pengumuman', 'Berita Sekolah', 'Karya Siswa', 'Opini & Esai', 'Prestasi & Lomba', 'Literasi & Puisi'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMadingCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      madingCategoryFilter === cat
                        ? 'bg-indigo-950 text-amber-300 shadow-xs font-black'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'Semua Kategori' : cat}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari judul, penulis, isi..."
                  value={madingSearchQuery}
                  onChange={(e) => setMadingSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Mading Posts Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Judul & Isi Singkat</th>
                  <th className="p-3.5">Status & Kategori</th>
                  <th className="p-3.5">Penulis & Tanggal</th>
                  <th className="p-3.5">Interaksi</th>
                  <th className="p-3.5 text-right">Aksi Moderasi & Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {posts
                  .filter((p) => {
                    // Status Filter
                    if (madingStatusFilter === 'pending' && p.status !== 'pending') {
                      return false;
                    }
                    if (madingStatusFilter === 'published' && p.status === 'pending') {
                      return false;
                    }
                    // Category Filter
                    if (madingCategoryFilter !== 'ALL' && p.category !== madingCategoryFilter) {
                      return false;
                    }
                    // Search Query
                    if (madingSearchQuery.trim()) {
                      const query = madingSearchQuery.toLowerCase();
                      const matchTitle = p.title.toLowerCase().includes(query);
                      const matchAuthor = p.author.toLowerCase().includes(query);
                      const matchContent = p.content?.toLowerCase().includes(query) || false;
                      return matchTitle || matchAuthor || matchContent;
                    }
                    return true;
                  })
                  .map((p) => {
                    const isPending = p.status === 'pending';

                    return (
                      <tr 
                        key={p.id} 
                        className={`transition-colors ${
                          isPending 
                            ? 'bg-amber-50/50 hover:bg-amber-50/80' 
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Title & Cover */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            {p.coverImage ? (
                              <img
                                src={p.coverImage}
                                alt={p.title}
                                className="w-11 h-11 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                              />
                            ) : (
                              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                                isPending ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-slate-100 border-slate-200 text-slate-400'
                              }`}>
                                <Newspaper className="w-5 h-5" />
                              </div>
                            )}
                            <div className="max-w-md">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-extrabold text-slate-900 leading-snug">
                                  {p.title}
                                </h4>
                                {p.pinned && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                    <Pin className="w-2.5 h-2.5 fill-amber-600" />
                                    <span>Pin</span>
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                {p.excerpt || p.content.replace(/<[^>]*>?/gm, '').slice(0, 70) + '...'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Status & Category */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            {isPending ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap animate-pulse">
                                <Clock className="w-3 h-3" />
                                <span>Menunggu Moderasi</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 whitespace-nowrap">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Sudah Terbit</span>
                              </span>
                            )}
                            <div>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 inline-block">
                                {p.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Author & Date */}
                        <td className="p-3.5">
                          <div className="text-xs">
                            <span className="font-bold text-slate-900 block">{p.author}</span>
                            <span className="text-[11px] text-slate-400 block">{p.date}</span>
                          </div>
                        </td>

                        {/* Interactions */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                            <span className="flex items-center gap-1" title={`${p.likes} suka`}>
                              <Heart className="w-3.5 h-3.5 text-rose-500" />
                              <span>{p.likes}</span>
                            </span>
                            <span className="flex items-center gap-1" title={`${p.comments?.length || 0} komentar`}>
                              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                              <span>{p.comments?.length || 0}</span>
                            </span>
                          </div>
                        </td>

                        {/* Action buttons */}
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Tombol Khusus Moderasi: Setujui */}
                            {isPending && (
                              <button
                                type="button"
                                onClick={() => handleApprovePost(p.id)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                title="Setujui Karya Siswa & Publikasikan ke Mading"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Setujui</span>
                              </button>
                            )}

                            {/* Tombol Khusus Moderasi: Tolak */}
                            {isPending && (
                              <button
                                type="button"
                                onClick={() => handleRejectPost(p.id)}
                                className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Tolak & Hapus Kiriman Karya"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Tolak</span>
                              </button>
                            )}

                            {/* Preview button */}
                            <button
                              type="button"
                              onClick={() => setPreviewPost(p)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Lihat Detail Artikel"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Pin toggle button (only for published posts) */}
                            {!isPending && (
                              <button
                                type="button"
                                onClick={() => handleTogglePinPost(p.id, p.pinned)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  p.pinned
                                    ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                                    : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                }`}
                                title={p.pinned ? 'Lepas Sematan (Unpin)' : 'Sematkan ke Atas (Pin)'}
                              >
                                <Pin className={`w-4 h-4 ${p.pinned ? 'fill-amber-600' : ''}`} />
                              </button>
                            )}

                            {/* Delete post button */}
                            <button
                              type="button"
                              onClick={() => setPostToDelete(p)}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Postingan Mading"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                {posts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 text-xs font-medium">
                      Belum ada postingan mading yang tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PRINT KARTU LOGIN SISWA PER KELAS */}
      {/* ========================================================================= */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border-2 border-indigo-950 my-6">
            <div className="p-5 bg-indigo-950 text-white flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-bold">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">Kartu Akses & Login Siswa (Cetak)</h3>
                  <p className="text-xs text-indigo-200">Format kartu login siap cetak untuk dibagikan ke siswa Kelas VII, VIII, IX.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={printClassFilter}
                  onChange={(e) => setPrintClassFilter(e.target.value)}
                  className="bg-indigo-900 text-white border border-indigo-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
                >
                  <option value="ALL">Semua Kelas ({students.length})</option>
                  <option value="VII">Kelas VII</option>
                  <option value="VIII">Kelas VIII</option>
                  <option value="IX">Kelas IX</option>
                </select>

                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="text-indigo-200 hover:text-white p-2 rounded-xl bg-indigo-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {students
                  .filter((s) => (printClassFilter === 'ALL' ? true : s.class_name === printClassFilter))
                  .map((std) => (
                    <div
                      key={std.id}
                      className="border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 space-y-2 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div>
                          <span className="text-[10px] font-black text-indigo-900 uppercase block">{settings.school_name}</span>
                          <span className="text-[9px] text-slate-500 font-bold uppercase">KARTU AKSES PORTAL DIGITAL SISWA</span>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-950 text-amber-300">
                          Kelas {std.class_name}
                        </span>
                      </div>

                      <div className="pt-1 flex items-center gap-3">
                        {std.avatar ? (
                          <img
                            src={std.avatar}
                            alt={std.full_name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-300 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-base flex-shrink-0">
                            {std.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="space-y-0.5 overflow-hidden text-xs">
                          <h4 className="font-black text-slate-900 truncate">{std.full_name}</h4>
                          <p className="font-mono text-slate-600 text-[11px]">NISN: <strong>{std.nisn}</strong></p>
                          <p className="font-mono text-slate-600 text-[11px]">NIS: <strong>{std.nis}</strong></p>
                        </div>
                      </div>

                      <div className="bg-white p-2 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                        <span className="text-slate-500 font-bold text-[11px]">Kata Sandi Login:</span>
                        <span className="font-mono font-black text-indigo-950 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {std.password || 'siswa'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Gunakan tombol print browser (Ctrl+P) untuk mencetak kartu.</span>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 bg-indigo-950 text-white font-extrabold rounded-xl text-xs uppercase"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL KONFIRMASI HAPUS POSTINGAN MADING */}
      {/* ========================================================================= */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Hapus Postingan Mading?</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <p className="font-extrabold text-slate-900 text-sm">{postToDelete.title}</p>
              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <span className="bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded">
                  {postToDelete.category}
                </span>
                <span>Oleh: {postToDelete.author}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus artikel mading ini secara permanen dari mading sekolah?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeletePost}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Postingan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL KONFIRMASI HAPUS SISWA */}
      {/* ========================================================================= */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Hapus Akun Siswa?</h3>
                <p className="text-xs text-slate-500">Data siswa akan dihapus dari sistem.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="font-extrabold text-slate-900 text-sm">{studentToDelete.full_name}</p>
              <p className="text-slate-600 font-mono text-[11px]">
                NISN: {studentToDelete.nisn} | Kelas: {studentToDelete.class_name}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteStudent}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Data Siswa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL KONFIRMASI RESET PASSWORD SISWA */}
      {/* ========================================================================= */}
      {resetPasswordTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Reset Kata Sandi Siswa?</h3>
                <p className="text-xs text-slate-500">Kata sandi akan diatur ulang ke standar.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="font-extrabold text-slate-900 text-sm">{resetPasswordTarget.name}</p>
              <p className="text-slate-600 text-[11px]">
                Kata sandi baru: <strong className="font-mono text-indigo-700">siswa</strong>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetPasswordTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmResetPassword}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                <span>Ya, Reset Sandi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PREVIEW DETAIL POSTINGAN MADING */}
      {/* ========================================================================= */}
      {previewPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                  {previewPost.category}
                </span>
                <h3 className="text-lg font-black text-white mt-1.5 leading-snug">{previewPost.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>Oleh: {previewPost.author}</span>
                  <span>•</span>
                  <span>{previewPost.date}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewPost(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {previewPost.coverImage && (
                <img
                  src={previewPost.coverImage}
                  alt={previewPost.title}
                  className="w-full max-h-60 object-cover rounded-2xl border border-slate-200"
                />
              )}
              <div
                className="prose prose-slate max-w-none text-sm text-slate-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: previewPost.content }}
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-slate-500 font-bold">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose-500" /> {previewPost.likes} Suka
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-teal-600" /> {previewPost.comments?.length || 0} Komentar
                </span>
              </div>
              <button
                onClick={() => setPreviewPost(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL TULIS POSTINGAN MADING BARU OLEH ADMIN */}
      {/* ========================================================================= */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateNewPost}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col"
          >
            <div className="p-5 bg-indigo-950 text-white flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-bold">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">Tulis Postingan Mading Baru</h3>
                  <p className="text-xs text-indigo-200">Publikasikan pengumuman atau artikel sekolah ke mading digital.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="text-indigo-200 hover:text-white p-2 rounded-xl bg-indigo-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Judul Postingan <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Ujian Sekolah dan Pengumuman Kelulusan"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Kategori Mading <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value as MadingPost['category'])}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:outline-none focus:border-indigo-600 bg-white"
                  >
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Berita Sekolah">Berita Sekolah</option>
                    <option value="Karya Siswa">Karya Siswa</option>
                    <option value="Opini & Esai">Opini & Esai</option>
                    <option value="Prestasi & Lomba">Prestasi & Lomba</option>
                    <option value="Literasi & Puisi">Literasi & Puisi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nama Penulis / Redaksi
                  </label>
                  <input
                    value={newPostAuthor}
                    onChange={(e) => setNewPostAuthor(e.target.value)}
                    placeholder="Contoh: Admin Sekolah / Panitia Kelulusan"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  URL Gambar Sampul (Opsional)
                </label>
                <input
                  type="url"
                  value={newPostCoverImage}
                  onChange={(e) => setNewPostCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-mono focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Isi Artikel / Postingan <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Tuliskan berita, informasi, atau pengumuman lengkap di sini..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600 leading-relaxed font-sans"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl cursor-pointer shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Publikasikan ke Mading</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL EDIT / TAMBAH AKUN GURU & ADMIN */}
      {/* ========================================================================= */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 bg-indigo-950 text-white flex items-center justify-between border-b-2 border-purple-400">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">
                    {staffList.some((s) => s.id === editingStaff.id) ? 'Edit Akun Staf' : 'Tambah Akun Staf Baru'}
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Kredensial login untuk Dewan Guru dan Administrator Sekolah
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="text-indigo-200 hover:text-white p-2 rounded-xl bg-indigo-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveStaff}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Peran / Hak Akses */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Peran / Hak Akses <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editingStaff.role}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        role: e.target.value as 'guru' | 'admin',
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-indigo-600 bg-white"
                  >
                    <option value="guru">Dewan Guru (Editor Mading & Guru)</option>
                    <option value="admin">Administrator (Akses Penuh Sistem)</option>
                  </select>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Username Login <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStaff.username}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        username: e.target.value.toLowerCase().replace(/\s+/g, ''),
                      })
                    }
                    placeholder="misal: guru_matematika"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nama Lengkap Beserta Gelar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingStaff.full_name}
                  onChange={(e) =>
                    setEditingStaff({
                      ...editingStaff,
                      full_name: e.target.value,
                    })
                  }
                  placeholder="misal: Drs. Ahmad Fauzi, M.Pd"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Kata Sandi */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Kata Sandi Login <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStaff.password}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        password: e.target.value,
                      })
                    }
                    placeholder="Sandi login"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-indigo-600 bg-amber-50/50"
                  />
                </div>

                {/* NIP */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    NIP / No. Induk Pegawai
                  </label>
                  <input
                    type="text"
                    value={editingStaff.nip || ''}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        nip: e.target.value,
                      })
                    }
                    placeholder="198001012005011001"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Jabatan / Mata Pelajaran */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Jabatan / Guru Mapel
                  </label>
                  <input
                    type="text"
                    value={editingStaff.position || ''}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        position: e.target.value,
                      })
                    }
                    placeholder="misal: Guru Bahasa Indonesia"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Kontak
                  </label>
                  <input
                    type="email"
                    value={editingStaff.email || ''}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        email: e.target.value,
                      })
                    }
                    placeholder="email@sekolah.sch.id"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* URL Foto Avatar */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  URL Foto Profil / Avatar
                </label>
                <input
                  type="url"
                  value={editingStaff.avatar || ''}
                  onChange={(e) =>
                    setEditingStaff({
                      ...editingStaff,
                      avatar: e.target.value,
                    })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 text-xs -mx-6 -mb-6 mt-6 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Akun Staf</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL KONFIRMASI HAPUS STAFF */}
      {/* ========================================================================= */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-black text-lg text-slate-900">Hapus Akun Staf?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus akun{' '}
                <strong className="text-slate-800">{staffToDelete.full_name}</strong> (Username: {staffToDelete.username})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer flex-1"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteStaff}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs cursor-pointer flex-1 shadow-sm"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL KONFIRMASI RESET PASSWORD STAFF */}
      {/* ========================================================================= */}
      {resetStaffPasswordTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-black text-lg text-slate-900">Reset Kata Sandi Staf?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kata sandi untuk <strong className="text-slate-800">{resetStaffPasswordTarget.full_name}</strong> akan direset ke:{' '}
                <span className="font-mono font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {resetStaffPasswordTarget.role === 'admin' ? 'admin123' : 'guru123'}
                </span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetStaffPasswordTarget(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer flex-1"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmResetStaffPassword}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs cursor-pointer flex-1 shadow-sm"
              >
                Reset Kata Sandi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOAST ALERT NOTIFICATION */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold ${
              toastMessage.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : toastMessage.type === 'info'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-emerald-950 text-emerald-100 border-emerald-700'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : toastMessage.type === 'info' ? (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL IMPORT DATA SISWA EXCEL / CSV */}
      {/* ========================================================================= */}
      <StudentImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        existingStudents={students}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
};

