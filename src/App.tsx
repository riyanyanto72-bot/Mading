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
import { StudentLoginModal } from './components/StudentPortal/StudentLoginModal';
import { RoleSwitcherModal } from './components/Auth/RoleSwitcherModal';
import { Footer } from './components/Footer';
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
  batchImportStudentsToFirestore,
  deleteStudentFromFirestore,
  subscribeStaffAccounts,
  saveStaffAccountToFirestore,
  deleteStaffAccountFromFirestore,
  resetFirestoreToDemoData,
} from './services/firebaseService';

export default function App() {
  // Current logged in user / active role simulation
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('school_current_user_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return presetAccounts[0];
      }
    }
    return presetAccounts[0]; // Default: Admin
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
  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState(false);
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
    });

    // 3. Real-time subscriber for Mading Posts
    const unsubMading = subscribeMadingPosts((newPosts) => {
      if (newPosts.length > 0) {
        setPosts(newPosts);
        localStorage.setItem('school_mading_posts_v1', JSON.stringify(newPosts));
      }
    });

    // 4. Real-time subscriber for Students
    const unsubStudents = subscribeStudents((newStudents) => {
      if (newStudents.length > 0) {
        setStudents(newStudents);
        localStorage.setItem('school_students_v1', JSON.stringify(newStudents));
      }
    });

    // 5. Real-time subscriber for Staff Accounts (Guru & Admin)
    const unsubStaff = subscribeStaffAccounts((newStaff) => {
      if (newStaff.length > 0) {
        setStaffAccounts(newStaff);
        localStorage.setItem('school_staff_accounts_v1', JSON.stringify(newStaff));
      }
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
    const newPost: MadingPost = {
      id: 'post-' + Date.now(),
      title: newPostData.title,
      category: newPostData.category,
      author: newPostData.author,
      authorRole: currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'guru' ? 'Guru' : `Siswa (${newPostData.class_grade || 'Siswa'})`,
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
      status: 'published',
    };

    setPosts([newPost, ...posts]);
    saveMadingPostToFirestore(newPost).catch(console.error);
    setIsSubmitModalOpen(false);
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

  // Student portal logout
  const handleStudentLogout = () => {
    setCurrentUser(presetAccounts[0]); // Reset to admin/operator
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
        onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
      />

      {/* Main App Content View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'mading' && (
          <MadingGrid
            posts={posts}
            searchQuery={searchQuery}
            settings={settings}
            onSelectPost={(post) => setSelectedPost(post)}
            onLikePost={handleLikePost}
            onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
            onGoToGraduation={() => setActiveTab('graduation')}
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
          <StudentProfileView
            settings={settings}
            currentUser={currentUser}
            posts={posts}
            students={students}
            onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
            onSelectPost={(post) => setSelectedPost(post)}
            onGoToGraduation={() => setActiveTab('graduation')}
            onLoginSuccess={(acc) => setCurrentUser(acc)}
            onLogout={handleStudentLogout}
            onOpenStudentLoginModal={() => setIsStudentLoginOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
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
        )}
      </main>

      {/* Footer */}
      <Footer settings={settings} onSelectTab={setActiveTab} />

      {/* Modals */}
      {/* Mading Post Reading Modal */}
      <MadingDetailModal
        post={selectedPost}
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
        onSelectAccount={(account) => setCurrentUser(account)}
        staffAccounts={staffAccounts}
      />

      {/* Dedicated Student Login Modal */}
      <StudentLoginModal
        isOpen={isStudentLoginOpen}
        onClose={() => setIsStudentLoginOpen(false)}
        students={students}
        settings={settings}
        onLoginSuccess={(account) => {
          setCurrentUser(account);
          setActiveTab('student-portal');
        }}
      />
    </div>
  );
}
