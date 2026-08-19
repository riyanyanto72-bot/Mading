import React, { useState, useEffect } from 'react';
import { MadingPost, StudentGraduation, SchoolSettings, UserAccount, StaffAccount } from './types';
import { initialSchoolSettings, initialMadingPosts, initialGraduationStudents } from './data/initialData';
import { presetAccounts, initialStaffAccounts } from './data/roleAccounts';
import { Header, NavigationTab } from './components/Header';
import { MadingGrid } from './components/MadingDigital/MadingGrid';
import { MadingDetailModal } from './components/MadingDigital/MadingDetailModal';
import { SubmitKaryaModal } from './components/MadingDigital/SubmitKaryaModal';
import { GraduationPortal } from './components/Graduation/GraduationPortal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { SchoolProfileView } from './components/Profile/SchoolProfileView';
import { StudentProfileView } from './components/StudentPortal/StudentProfileView';
import { TeacherProfileView } from './components/TeacherPortal/TeacherProfileView';
import { RoleSwitcherModal } from './components/Auth/RoleSwitcherModal';
import { Footer } from './components/Footer';
import { ShieldAlert } from 'lucide-react';
import {
  initializeFirestoreDataIfEmpty,
  subscribeSchoolSettings,
  saveSchoolSettingsToFirestore,
  subscribeMadingPosts,
  saveMadingPostToFirestore,
  deleteMadingPostFromFirestore,
  likeMadingPostInFirestore,
  addCommentToMadingPostInFirestore,
  subscribeStudents,
  saveStudentToFirestore,
  batchImportStudentsToFirestore,
  deleteStudentFromFirestore,
  subscribeStaffAccounts,
  saveStaffAccountToFirestore,
  deleteStaffAccountFromFirestore,
  resetFirestoreToDemoData,
} from './services/firebaseService';

const GUEST_ACCOUNT: UserAccount = {
  id: 'guest',
  name: 'Tamu / Pengunjung',
  role: 'tamu',
  roleLabel: 'Pengunjung Publik',
  identifier: 'Tamu',
  avatar: '',
};

export default function App() {
  // Current logged in user / active role simulation
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('school_current_user_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return GUEST_ACCOUNT;
      }
    }
    return GUEST_ACCOUNT; // Default: Tamu
  });

  // Navigation active tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('mading');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Persisted state initialization (with local fast-cache)
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('school_settings_v1');
    return saved ? JSON.parse(saved) : initialSchoolSettings;
  });

  // Sync document title
  useEffect(() => {
    if (settings?.schoolName) {
      document.title = `${settings.schoolName} - Portal Mading & Kelulusan`;
    }
  }, [settings?.schoolName]);

  const [posts, setPosts] = useState<MadingPost[]>(() => {
    const saved = localStorage.getItem('school_mading_posts_v1');
    return saved ? JSON.parse(saved) : initialMadingPosts;
  });

  const [students, setStudents] = useState<StudentGraduation[]>(() => {
    const saved = localStorage.getItem('school_students_v1');
    return saved ? JSON.parse(saved) : initialGraduationStudents;
  });

  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>(() => {
    const saved = localStorage.getItem('school_staff_accounts_v1');
    return saved ? JSON.parse(saved) : initialStaffAccounts;
  });

  // Modal states
  const [selectedPost, setSelectedPost] = useState<MadingPost | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'accounts' | 'kelulusan' | 'profil_sekolah' | 'pengaturan' | 'mading'>('accounts');

  // ==========================================
  // Cloud Firestore Real-time Subscriptions
  // ==========================================
  useEffect(() => {
    // 1. Ensure Firestore has initial collections populated
    initializeFirestoreDataIfEmpty().catch(console.error);

    // 2. Real-time subscriber for School Settings
    const unsubSettings = subscribeSchoolSettings((newSettings) => {
      setSettings(newSettings);
      localStorage.setItem('school_settings_v1', JSON.stringify(newSettings));
      if (newSettings?.school_name) {
        document.title = `${newSettings.school_name} - Portal Mading & Kelulusan`;
      }
    });

    // 3. Real-time subscriber for Mading Posts
    const unsubMading = subscribeMadingPosts((newPosts) => {
      setPosts(newPosts);
      localStorage.setItem('school_mading_posts_v1', JSON.stringify(newPosts));
    });

    // 4. Real-time subscriber for Students
    const unsubStudents = subscribeStudents((newStudents) => {
      setStudents(newStudents);
      localStorage.setItem('school_students_v1', JSON.stringify(newStudents));
    });

    // 5. Real-time subscriber for Staff Accounts (Guru & Admin)
    const unsubStaff = subscribeStaffAccounts((newStaff) => {
      setStaffAccounts(newStaff);
      localStorage.setItem('school_staff_accounts_v1', JSON.stringify(newStaff));
    });

    return () => {
      unsubSettings();
      unsubMading();
      unsubStudents();
      unsubStaff();
    };
  }, []);

  // Save current user to localStorage
  useEffect(() => {
    localStorage.setItem('school_current_user_v1', JSON.stringify(currentUser));
  }, [currentUser]);

  // Handle Update Staff Accounts (Local + Cloud Firestore)
  const handleUpdateStaffAccounts = (newStaffList: StaffAccount[]) => {
    // Delete removed staff accounts from Firestore
    const currentIds = new Set(newStaffList.map((s) => s.id));
    staffAccounts.forEach((oldStaff) => {
      if (!currentIds.has(oldStaff.id)) {
        deleteStaffAccountFromFirestore(oldStaff.id).catch(console.error);
      }
    });

    setStaffAccounts(newStaffList);
    localStorage.setItem('school_staff_accounts_v1', JSON.stringify(newStaffList));
    newStaffList.forEach((s) => {
      saveStaffAccountToFirestore(s).catch((err) => {
        console.error('Failed to save staff account to Firestore:', err);
      });
    });
  };

  // Handle Update Settings (Local + Cloud Firestore)
  const handleUpdateSettings = (newSettings: SchoolSettings) => {
    setSettings(newSettings);
    localStorage.setItem('school_settings_v1', JSON.stringify(newSettings));
    saveSchoolSettingsToFirestore(newSettings).catch((err) => {
      console.error('Failed to save settings to Firestore:', err);
    });
  };

  // Handle Update Posts (Local + Cloud Firestore)
  const handleUpdatePosts = (newPosts: MadingPost[]) => {
    // Delete removed posts from Firestore
    const currentIds = new Set(newPosts.map((p) => p.id));
    posts.forEach((oldPost) => {
      if (!currentIds.has(oldPost.id)) {
        deleteMadingPostFromFirestore(oldPost.id).catch(console.error);
      }
    });

    setPosts(newPosts);
    localStorage.setItem('school_mading_posts_v1', JSON.stringify(newPosts));
    newPosts.forEach((p) => {
      saveMadingPostToFirestore(p).catch(console.error);
    });
  };

  // Handle Update Students (Local + Cloud Firestore)
  const handleUpdateStudents = (newStudents: StudentGraduation[]) => {
    // Delete removed students from Firestore
    const currentIds = new Set(newStudents.map((s) => s.id));
    students.forEach((oldStudent) => {
      if (!currentIds.has(oldStudent.id)) {
        deleteStudentFromFirestore(oldStudent.id).catch(console.error);
      }
    });

    setStudents(newStudents);
    localStorage.setItem('school_students_v1', JSON.stringify(newStudents));
    batchImportStudentsToFirestore(newStudents).catch((err) => {
      console.error('Failed to batch save students to Firestore:', err);
    });
  };

  // Handle Update Student Photo (Directly by student, synced to Firestore & Local state)
  const handleUpdateStudentPhoto = (studentId: string, newAvatar: string) => {
    const updatedStudents = students.map((s) => (s.id === studentId ? { ...s, avatar: newAvatar } : s));
    setStudents(updatedStudents);
    localStorage.setItem('school_students_v1', JSON.stringify(updatedStudents));

    const targetStudent = updatedStudents.find((s) => s.id === studentId);
    if (targetStudent) {
      saveStudentToFirestore(targetStudent).catch((err) => {
        console.error('Failed to save updated student photo to Firestore:', err);
      });
    }

    // If active currentUser is this student, also update their currentUser profile avatar
    if (currentUser.role === 'siswa') {
      const updatedUser: UserAccount = {
        ...currentUser,
        avatar: newAvatar,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('school_current_user_v1', JSON.stringify(updatedUser));
    }
  };

  // Handle Update Teacher Photo (Directly by teacher, synced to Firestore & Local state)
  const handleUpdateTeacherPhoto = (newAvatar: string) => {
    const updatedUser: UserAccount = {
      ...currentUser,
      avatar: newAvatar,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('school_current_user_v1', JSON.stringify(updatedUser));

    // Update in staff accounts array
    const updatedStaffList = staffAccounts.map((st) =>
      st.id === currentUser.id || st.username === currentUser.username
        ? { ...st, avatar: newAvatar }
        : st
    );
    setStaffAccounts(updatedStaffList);
    localStorage.setItem('school_staff_accounts_v1', JSON.stringify(updatedStaffList));

    const matchedStaff = updatedStaffList.find(
      (st) => st.id === currentUser.id || st.username === currentUser.username
    );
    if (matchedStaff) {
      saveStaffAccountToFirestore(matchedStaff).catch((err) => {
        console.error('Failed to save updated teacher photo to Firestore:', err);
      });
    }
  };

  // Handle Update Teacher Profile (Biodata, NIP, Mapel, etc.)
  const handleUpdateTeacherProfile = (updatedStaff: StaffAccount) => {
    const updatedStaffList = staffAccounts.some((s) => s.id === updatedStaff.id)
      ? staffAccounts.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
      : [...staffAccounts, updatedStaff];

    setStaffAccounts(updatedStaffList);
    localStorage.setItem('school_staff_accounts_v1', JSON.stringify(updatedStaffList));
    saveStaffAccountToFirestore(updatedStaff).catch((err) => {
      console.error('Failed to save updated staff account to Firestore:', err);
    });

    const updatedUser: UserAccount = {
      ...currentUser,
      name: updatedStaff.name,
      roleLabel: updatedStaff.subject || updatedStaff.roleLabel || 'Dewan Guru',
      identifier: updatedStaff.nip ? `NIP. ${updatedStaff.nip}` : (updatedStaff.identifier || updatedStaff.username),
      nip: updatedStaff.nip,
      email: updatedStaff.email,
      password: updatedStaff.password,
      avatar: updatedStaff.avatar || '',
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('school_current_user_v1', JSON.stringify(updatedUser));
  };

  // Handle Like Mading Post (Local + Cloud Firestore)
  const handleLikePost = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          return { ...p, likes: (p.likes || 0) + 1 };
        }
        return p;
      })
    );
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null));
    }
    likeMadingPostInFirestore(postId).catch(console.error);
  };

  // Handle Add Comment (Local + Cloud Firestore)
  const handleAddComment = (postId: string, author: string, text: string) => {
    const newComment = {
      id: 'comment-' + Date.now(),
      author,
      authorRole:
        currentUser.role === 'admin'
          ? 'Administrator'
          : currentUser.role === 'guru'
          ? 'Guru'
          : 'Siswa',
      text,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const updatedComments = p.comments ? [...p.comments, newComment] : [newComment];
          return { ...p, comments: updatedComments };
        }
        return p;
      })
    );

    addCommentToMadingPostInFirestore(postId, newComment).catch(console.error);
  };

  // Handle submit new mading karya (Local + Cloud Firestore)
  const handleSubmitNewPost = (newPostData: {
    title: string;
    category: MadingPost['category'];
    author: string;
    class_grade?: string;
    content: string;
    excerpt: string;
    cover_image?: string;
  }) => {
    // Siswa submissions need approval ('pending'), Guru and Admin auto-approve ('published')
    const initialStatus = currentUser.role === 'siswa' ? 'pending' : 'published';

    const newPost: MadingPost = {
      id: 'post-' + Date.now(),
      title: newPostData.title,
      category: newPostData.category,
      author: newPostData.author,
      authorRole: currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'guru' ? 'Guru' : `Siswa ${currentUser.class_name ? `(Kelas ${currentUser.class_name})` : ''}`,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      content: newPostData.content,
      excerpt: newPostData.excerpt,
      coverImage: newPostData.cover_image,
      tags: ['Mading', newPostData.category],
      likes: 0,
      comments: [],
      pinned: false,
      status: initialStatus,
    };

    setPosts([newPost, ...posts]);
    saveMadingPostToFirestore(newPost).catch(console.error);
    setIsSubmitModalOpen(false);

    if (initialStatus === 'pending') {
      alert('Karya Anda berhasil dikirim dan sedang menunggu persetujuan (moderasi) dari Guru / Admin.');
    }
    
    setActiveTab('mading');
  };

  // Reset database back to default initial values in Firestore + LocalStorage
  const handleResetDemoData = async () => {
    if (confirm('Kembalikan semua data mading, kelulusan, dan pengaturan ke data awal di Cloud Firestore?')) {
      try {
        await resetFirestoreToDemoData();
        localStorage.removeItem('school_settings_v1');
        localStorage.removeItem('school_mading_posts_v1');
        localStorage.removeItem('school_students_v1');
        localStorage.removeItem('school_staff_accounts_v1');
        localStorage.removeItem('school_current_user_v1');
        setSettings(initialSchoolSettings);
        setPosts(initialMadingPosts);
        setStudents(initialGraduationStudents);
        setStaffAccounts(initialStaffAccounts);
        setCurrentUser(presetAccounts[0]);
        alert('Data sistem berhasil direset ke pengaturan default Cloud Firestore.');
      } catch (err) {
        console.error('Error resetting Firestore demo data:', err);
        alert('Terjadi kesalahan saat mereset data cloud.');
      }
    }
  };

  // Direct login as student from admin panel
  const handleDirectLoginAsStudent = (student: StudentGraduation) => {
    const studentAccount: UserAccount = {
      id: `usr-${student.nisn}`,
      name: student.full_name,
      role: 'siswa',
      roleLabel: `Siswa Kelas ${student.class_name}`,
      identifier: `NISN: ${student.nisn} | Kelas ${student.class_name}`,
      class_name: student.class_name,
      nisn: student.nisn,
      avatar: student.avatar,
    };
    setCurrentUser(studentAccount);
    setActiveTab('student-portal');
  };

  // Global logout
  const handleLogout = () => {
    setCurrentUser(GUEST_ACCOUNT);
    localStorage.removeItem('school_current_user_v1');
    if (activeTab === 'admin' || activeTab === 'student-portal' || activeTab === 'graduation') {
      setActiveTab('mading');
    }
  };

  const handleApprovePost = (postId: string) => {
    if (confirm('Setujui karya ini untuk dipublikasikan di mading utama?')) {
      const updatedPosts = posts.map((p) => (p.id === postId ? { ...p, status: 'published' as const } : p));
      setPosts(updatedPosts);
      const postToUpdate = updatedPosts.find((p) => p.id === postId);
      if (postToUpdate) saveMadingPostToFirestore(postToUpdate).catch(console.error);
    }
  };

  const handleRejectPost = (postId: string) => {
    if (confirm('Tolak dan hapus karya ini? Karya akan dihapus secara permanen.')) {
      const updatedPosts = posts.filter((p) => p.id !== postId);
      setPosts(updatedPosts);
      deleteMadingPostFromFirestore(postId).catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Official School Header */}
      <Header
        settings={settings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main App Content View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'mading' && (
          <MadingGrid
            posts={posts}
            searchQuery={searchQuery}
            settings={settings}
            currentUser={currentUser}
            onSelectPost={(post) => setSelectedPost(post)}
            onLikePost={handleLikePost}
            onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
            onGoToGraduation={() => setActiveTab('graduation')}
            onApprovePost={handleApprovePost}
            onRejectPost={handleRejectPost}
          />
        )}

        {activeTab === 'graduation' && (
          <GraduationPortal
            students={students}
            settings={settings}
            currentUser={currentUser}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            onGoToAllStudentsPortal={() => setActiveTab('student-portal')}
          />
        )}

        {activeTab === 'profil' && (
          <SchoolProfileView
            settings={settings}
            currentUser={currentUser}
            onGoToEditProfile={() => {
              setAdminInitialTab('profil_sekolah');
              setActiveTab('admin');
            }}
            onEditProfileClick={() => {
              setAdminInitialTab('profil_sekolah');
              setActiveTab('admin');
            }}
          />
        )}

        {activeTab === 'student-portal' && (
          (currentUser.role === 'guru' || currentUser.role === 'admin') ? (
            <TeacherProfileView
              settings={settings}
              currentUser={currentUser}
              posts={posts}
              staffAccounts={staffAccounts}
              onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
              onSelectPost={(post) => setSelectedPost(post)}
              onGoToModeration={() => {
                setAdminInitialTab('mading');
                setActiveTab('admin');
              }}
              onLogout={handleLogout}
              onUpdateTeacherProfile={handleUpdateTeacherProfile}
              onUpdateTeacherPhoto={handleUpdateTeacherPhoto}
            />
          ) : (
            <StudentProfileView
              settings={settings}
              currentUser={currentUser}
              posts={posts}
              students={students}
              onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
              onSelectPost={(post) => setSelectedPost(post)}
              onGoToGraduation={() => setActiveTab('graduation')}
              onLoginSuccess={(acc) => setCurrentUser(acc)}
              onLogout={handleLogout}
              onUpdateStudentPhoto={handleUpdateStudentPhoto}
            />
          )
        )}

        {activeTab === 'admin' && (
          (currentUser.role === 'admin' || currentUser.role === 'guru') ? (
            <AdminDashboard
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              posts={posts}
              onUpdatePosts={handleUpdatePosts}
              students={students}
              onUpdateStudents={handleUpdateStudents}
              staffAccounts={staffAccounts}
              onUpdateStaffAccounts={handleUpdateStaffAccounts}
              onResetDemoData={handleResetDemoData}
              currentUser={currentUser}
              onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
              onDirectLoginAsStudent={handleDirectLoginAsStudent}
              onViewPublicProfile={() => setActiveTab('profil')}
              initialTab={adminInitialTab}
            />
          ) : (
            <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Akses Dibatasi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Panel ini hanya dapat diakses oleh akun resmi Guru atau Administrator Sekolah.
              </p>
              <button
                onClick={() => setActiveTab('mading')}
                className="px-5 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-amber-300 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Kembali ke Mading Utama
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer settings={settings} onSelectTab={setActiveTab} currentUser={currentUser} />

      {/* Modals */}
      {/* Mading Post Reading Modal */}
      <MadingDetailModal
        post={selectedPost}
        currentUser={currentUser}
        onClose={() => setSelectedPost(null)}
        onLike={(postId) => handleLikePost(postId)}
        onAddComment={handleAddComment}
      />

      {/* Submit Karya Siswa Modal */}
      <SubmitKaryaModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmitNewPost}
        currentUser={currentUser}
      />

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        currentUser={currentUser}
        onSelectAccount={(account) => {
          setCurrentUser(account);
          if (account.role === 'siswa') {
            setActiveTab('student-portal');
          }
        }}
        staffAccounts={staffAccounts}
        students={students}
      />

      {/* Global Modals (Alerts, Overlays) can be added here if needed */}
    </div>
  );
}
