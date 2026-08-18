export type UserRole = 'admin' | 'guru' | 'siswa' | 'tamu';

export interface UserAccount {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  identifier: string; // e.g. "Admin / IT Sekolah", "NIP. 1978...", "NISN: 0061234567"
  nisn?: string;
  class_name?: string;
  avatar?: string;
  username?: string;
  password?: string;
  email?: string;
  nip?: string;
}

export interface StaffAccount {
  id: string;
  name: string;
  full_name?: string;
  role: 'admin' | 'guru';
  roleLabel?: string;
  identifier?: string; // e.g. "NIP. 19780512 200604 2 008" atau "Operator IT"
  nip?: string;
  email?: string;
  username: string;
  password?: string;
  subject?: string; // Mapel yang diampu atau Divisi
  position?: string;
  avatar?: string;
}

export type MadingCategory = 
  | 'Pengumuman' 
  | 'Karya Siswa' 
  | 'Prestasi' 
  | 'Agenda' 
  | 'Artikel' 
  | 'Ekstrakurikuler';

export interface Comment {
  id: string;
  author: string;
  authorRole: string;
  text: string;
  date: string;
}

export interface MadingPost {
  id: string;
  title: string;
  category: MadingCategory;
  author: string;
  authorRole: string;
  date: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  pinned?: boolean;
  status: 'published' | 'pending';
}

export type GraduationStatus = 'LULUS' | 'TIDAK_LULUS' | 'DITANGGUHKAN' | 'BELUM_DIBUKA';

export interface SchoolProfile {
  vision: string;
  mission: string[];
  welcome_message: string;
  principal_photo_url: string;
  history: string;
  facilities: string[];
  accreditation: string;
  curriculum: string;
  motto: string;
  hero_image_url: string;
}

export interface GeneralStudent {
  id: string;
  nisn: string;
  nis: string;
  full_name: string;
  class_name: string; // e.g. 'VII-A', 'VIII-B', 'IX-A'
  birth_date: string;
  birth_place: string;
  parent_name: string;
  password?: string;
  avatar?: string;
}

export type GradeLevel = 'VII' | 'VIII' | 'IX';

export interface StudentGraduation {
  id: string;
  nisn: string;
  nis: string;
  full_name: string;
  class_name: string; // e.g. 'VII-A', 'VII-B', 'VIII-A', 'VIII-B', 'IX-A', 'IX-B', 'IX-C'
  grade_level?: GradeLevel;
  birth_date: string; // YYYY-MM-DD
  birth_place: string;
  parent_name: string;
  status: GraduationStatus | 'AKTIF';
  note?: string;
  password?: string; // Password login siswa (default: 'siswa')
  skl_custom_url?: string; // Link upload / Google Drive / Cloud SKL custom
  avatar?: string;
}

export interface SchoolSettings {
  school_name: string;
  dinas_name: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principal_name: string;
  principal_nip: string;
  academic_year: string;
  announcement_release_time: string; // ISO string
  is_release_unlocked: boolean;
  logo_url: string;
  profile: SchoolProfile;
  graduation_motivation?: string;
  skl_custom_global_drive_url?: string;
  footer_copyright?: string;
  hero_badge?: string;
  hero_title?: string;
  hero_description?: string;
  hero_btn_submit_text?: string;
  hero_btn_submit_show?: boolean;
  hero_btn_grad_text?: string;
  hero_btn_grad_show?: boolean;
}
