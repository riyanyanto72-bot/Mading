import { MadingPost, StudentGraduation, SchoolSettings } from '../types';

export const initialSchoolSettings: SchoolSettings = {
  school_name: 'SMP Negeri 1 Nusantara',
  dinas_name: 'DINAS PENDIDIKAN KOTA NUSANTARA',
  npsn: '20101234',
  address: 'Jl. Merdeka Pendidikan No. 45, Kecamatan Cendekia, Kota Nusantara 10110',
  phone: '(021) 555-0192',
  email: 'info@smpn1nusantara.sch.id',
  website: 'www.smpn1nusantara.sch.id',
  principal_name: 'Dr. H. Bambang Hartono, M.Pd.',
  principal_nip: '19750812 199903 1 002',
  academic_year: '2025/2026',
  announcement_release_time: new Date(Date.now() - 3600000).toISOString(), // set to 1 hour ago so default is open
  is_release_unlocked: true,
  logo_url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80',
  graduation_motivation: 'Selamat kepada para siswa yang telah Lulus! Teruslah berkarya, pantang menyerah, dan jadilah kebanggaan bangsa. Sukses untuk langkah selanjutnya!',
  skl_custom_global_drive_url: 'https://drive.google.com/drive/folders/smpn1-nusantara-skl-2026',
  footer_copyright: 'Hak Cipta Dilindungi Undang-Undang.',
  hero_badge: 'Kreativitas & Prestasi Tanpa Batas',
  hero_title: 'Mading Digital Resmi & Informasi Terpadu Sekolah',
  hero_description: 'Wadah ekspresi karya siswa, artikel edukasi, pengumuman resmi sekolah, dan informasi pengumuman kelulusan siswa kelas IX.',
  hero_btn_submit_text: 'Kirim Karya Siswa Baru',
  hero_btn_submit_show: true,
  hero_btn_grad_text: 'Cek Kelulusan (Khusus Kelas IX)',
  hero_btn_grad_show: true,
  profile: {
    motto: 'Unggul dalam Prestasi, Berkarakter Pancasila, Berwawasan Global dan Berakar Budaya Bangsa',
    accreditation: 'A (Unggul) - BAN S/M',
    curriculum: 'Kurikulum Merdeka Mandiri Berbagi & Terintegrasi Digital',
    hero_image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80',
    principal_photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    welcome_message: `Assalamu'alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera, Om Swastiastu, Namo Buddhaya, Salam Kebajikan.\n\nPuji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa. Selamat datang di Portal Digital Resmi dan Mading Interaktif SMP Negeri 1 Nusantara. Sebagai satuan pendidikan pelopor, kami berkomitmen menghadirkan ekosistem belajar yang adaptif, mengedepankan integritas moral, serta menumbuhkan kecakapan teknologi abad ke-21 bagi seluruh peserta didik kami. Semoga portal ini menjadi jembatan transparansi informasi akademik, kelulusan, dan apresiasi karya kreatif generasi penerus bangsa.`,
    vision: 'Menjadi Lembaga Pendidikan Menengah Pertama Rujukan Nasional yang Menghasilkan Generasi Berakhlak Mulia, Cerdas, Kreatif, Berjiwa Pemimpin, dan Berwawasan Lingkungan Global pada Tahun 2030.',
    mission: [
      'Menyelenggarakan proses pembelajaran berkualitas berbasis Kurikulum Merdeka yang menumbuhkembangkan potensi holistik murid.',
      'Membina karakter Profil Pelajar Pancasila melalui keteladanan, pembiasaan religius, kedisiplinan, dan kegiatan sosial kemasyarakatan.',
      'Mengembangkan literasi sains, numerasi, riset teknologi, koding robotik, dan keterampilan kewirausahaan muda.',
      'Menyediakan sarana prasarana modern yang ramah anak, inklusif, sehat, dan berwawasan lingkungan hijau (*Adiwiyata Mandiri*).',
      'Membangun jejaring kolaborasi harmonis antara sekolah, komite, orang tua, alumni, dan dunia industri/global.'
    ],
    history: `SMP Negeri 1 Nusantara didirikan pada tahun 1978 di atas lahan seluas 1.8 hektar sebagai salah satu sekolah negeri pionir di Kota Nusantara. Berawal dari 6 ruang kelas sederhana, kini SMPN 1 Nusantara telah bertransformasi menjadi *Smart School* dengan 24 rombongan belajar modern, laboratorium sains terintegrasi, perpustakaan digital, studio mading multimedia, serta didukung oleh dewan pendidik berkualifikasi S2/S3 dan tenaga pendidik bersertifikasi nasional. Berbagai prestasi akademik maupun non-akademik tingkat kota, provinsi, hingga olimpiade internasional telah ditorehkan oleh para siswa dan alumni.`,
    facilities: [
      'Gedung Belajar Ber-AC & Dilengkapi Smart Projector Interaktif',
      'Laboratorium IPA Terpadu (Fisika, Biologi, Kimia)',
      'Laboratorium Komputer & Studio Robotika AI',
      'Perpustakaan Digital Cendekia (15.000+ Koleksi & E-Books)',
      'Aula Pertemuan Serbaguna Kapasitas 800 Orang',
      'Lapangan Olahraga Multifungsi (Basket, Futsal, Voli, Badminton)',
      'Studio Podcast, Musik, & Redaksi Mading Digital',
      'Masjid Sekolah & Ruang Ibadah Multi-Agama',
      'Kantin Sehat Higienis & Green House Hidroponik Adiwiyata',
      'Klinik UKS Siaga dengan Tenaga Medis Profesional'
    ]
  }
};

export const initialMadingPosts: MadingPost[] = [
  {
    id: 'post-1',
    title: 'Petunjuk Teknis Pengambilan Surat Keterangan Lulus (SKL) T.A 2025/2026',
    category: 'Pengumuman',
    author: 'Panitia Kelulusan OSIS & Kurikulum',
    authorRole: 'Guru / Panitia',
    date: '12 Agustus 2026',
    excerpt: 'Diberitahukan kepada seluruh siswa kelas IX yang dinyatakan LULUS agar memperhatikan jadwal dan tata tertib pengambilan fisik SKL di sekolah.',
    content: `
      <p>Yth. Bapak/Ibu Orang Tua/Wali dan Siswa Kelas IX SMP Negeri 1 Nusantara,</p>
      <p>Sehubungan dengan telah ditetapkannya kelulusan siswa Kelas IX Tahun Ajaran 2025/2026, berikut kami sampaikan beberapa ketentuan penting mengenai verifikasi dan pengambilan Surat Keterangan Lulus (SKL) fisik:</p>
      <ul>
        <li><strong>Pengunduhan Mandiri:</strong> SKL Digital dapat diunduh langsung melalui Portal Pengumuman Kelulusan web ini dengan memasukkan NISN siswa.</li>
        <li><strong>Pengambilan Dokumen Fisik:</strong> Fisik SKL asli bernomor resmi dan cap basah dapat diambil mulai hari Kamis, 14 Agustus 2026 di Ruang Tata Usaha.</li>
        <li><strong>Ketentuan Pakaian:</strong> Siswa wajib hadir didampingi Orang Tua/Wali menggunakan Seragam Seragam Sekolah rapi dan sopan.</li>
        <li><strong>Persyaratan Administrasi:</strong> Telah menyelesaikan pengembalian seluruh buku perpustakaan dan bebas dari pinjaman inventaris sekolah.</li>
      </ul>
      <p>Selamat kepada seluruh siswa yang telah menyelesaikan masa studi dengan luar biasa!</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    tags: ['Kelulusan', 'SKL', 'Pengumuman Resmi', 'Kelas IX'],
    likes: 42,
    pinned: true,
    status: 'published',
    comments: [
      {
        id: 'c1',
        author: 'Siti Nurhaliza (Siswa IX-A)',
        authorRole: 'Siswa',
        text: 'Alhamdulillah, terima kasih bapak ibu guru untuk bimbingannya selama 3 tahun ini!',
        date: '12 Aug 2026, 10:15'
      },
      {
        id: 'c2',
        author: 'Bapak Gunawan',
        authorRole: 'Orang Tua Siswa',
        text: 'Terima kasih atas informasinya yang sangat jelas dan rapi.',
        date: '12 Aug 2026, 11:30'
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Bangga! Tim Robotik SMPN 1 Nusantara Rebut Emas di Olympiade Robotik Nasional 2026',
    category: 'Prestasi',
    author: 'Tim Jurnalistik Siswa (Mading Club)',
    authorRole: 'Pembina OSIS',
    date: '10 Agustus 2026',
    excerpt: 'Inovasi robot pemilah sampah otomatis berbasis AI karya siswa SMPN 1 Nusantara berhasil menyisihkan 120 tim dari seluruh Indonesia.',
    content: `
      <p>Prestasi membanggakan kembali diukir oleh kontingen SMP Negeri 1 Nusantara dalam ajang <strong>Olimpiade Robotik Pelajar Nasional 2026</strong> yang berlangsung di Jakarta Convention Center.</p>
      <p>Tim yang beranggotakan Dewa Ayu Putu Cantika (IX-B) dan Ahmad Rizky Pratama (IX-A) berhasil meraih Juara 1 Gold Medal dalam kategori <em>Eco-Innovation Automation</em>.</p>
      <p>"Kami menciptakan robot bernama <em>EcoSort Bot</em> yang mampu memilah sampah organik, anorganik, dan B3 secara otomatis menggunakan kamera sensor AI dan lengan robotik," ujar Ayu dalam wawancara bersama Tim Mading Digital.</p>
      <p>Kepala Sekolah Bapak Dr. H. Bambang Hartono menyampaikan apresiasi setinggi-tingginya dan berharap karya inovasi ini terus dikembangkan untuk keberlanjutan lingkungan sekolah.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    tags: ['Prestasi', 'Robotik', 'Juara 1', 'Inovasi'],
    likes: 68,
    pinned: false,
    status: 'published',
    comments: [
      {
        id: 'c3',
        author: 'Fajar Nugraha',
        authorRole: 'Siswa IX-C',
        text: 'Keren banget Ayu dan Rizky! Selamat mendunia!',
        date: '10 Aug 2026, 14:20'
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Puisi Siswa: "Di Ujung Lorong Sekolah Ini"',
    category: 'Karya Siswa',
    author: 'Anisa Rahmawati (Kelas IX-C)',
    authorRole: 'Siswa',
    date: '08 Agustus 2026',
    excerpt: 'Sebuah puisi perpisahan manis yang melukiskan kenangan, jejak langkah, dan cita-cita di bangku sekolah SMP.',
    content: `
      <div style="font-style: italic; line-height: 1.8; text-align: center; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
        <p>Di ujung lorong sekolah ini,<br/>
        Tercatat ribuan tawa dan cerita kita.<br/>
        Papan tulis hitam yang menjadi saksi,<br/>
        Bagaimana mimpi-mimpi digoreskan penuh warna.</p>
        
        <p>Bapak dan Ibu guru yang tak kenal lelah,<br/>
        Menuntun langkah kami di tengah gulita.<br/>
        Menempa jiwa agar tak gampang menyerah,<br/>
        Menjadikan kami pribadi yang penuh makna.</p>
        
        <p>Kini lonceng kelulusan telah berbunyi,<br/>
        Menandai awal dari perjalanan yang baru.<br/>
        Terima kasih wahai almamater suci,<br/>
        Baktiku akan selalu menyertaimu.</p>
      </div>
    `,
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    tags: ['Puisi', 'Sastra', 'Karya Kreatif', 'Perpisahan'],
    likes: 54,
    pinned: false,
    status: 'published',
    comments: []
  },
  {
    id: 'post-4',
    title: 'Agenda Pameran Karya P5: Gelar Karya Kearifan Lokal & Kewirausahaan Muda',
    category: 'Agenda',
    author: 'Tim Koordinasi P5',
    authorRole: 'Guru',
    date: '05 Agustus 2026',
    excerpt: 'Saksikan pameran hasil karya Projek Penguatan Profil Pelajar Pancasila (P5) yang menampilkan kuliner tradisional, batik sibori, dan produk daur ulang.',
    content: `
      <p>Dalam rangka mengimplementasikan Kurikulum Merdeka, SMP Negeri 1 Nusantara akan menggelar acara rutin tahunan <strong>"Gelar Karya & Festival P5 2026"</strong>.</p>
      <p><strong>Detail Acara:</strong></p>
      <ul>
        <li>📅 <strong>Hari/Tanggal:</strong> Jumat, 21 Agustus 2026</li>
        <li>⏰ <strong>Waktu:</strong> 08:00 - 15:00 WIB</li>
        <li>📍 <strong>Lokasi:</strong> Lapangan & Aula Utama SMPN 1 Nusantara</li>
        <li>🎯 <strong>Tema:</strong> <em>"Menjaga Tradisi, Mendorong Inovasi, Berkarakter Pancasila"</em></li>
      </ul>
      <p>Seluruh warga sekolah, alumni, dan orang tua wali diundang untuk meramaikan dan mengapresiasi stan-stan wirausaha kreatif siswa!</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    tags: ['P5', 'Pameran Karya', 'Kurikulum Merdeka', 'Agenda Sekolah'],
    likes: 31,
    pinned: false,
    status: 'published',
    comments: []
  },
  {
    id: 'post-5',
    title: 'Tips & Panduan Memilih Sekolah Lanjutan (SMA/SMK/MA) Sesuai Minat dan Bakat',
    category: 'Artikel',
    author: 'Dra. Endang Rahayu (Guru BK)',
    authorRole: 'Guru',
    date: '01 Agustus 2026',
    excerpt: 'Tips dari Bimbingan Konseling untuk adik-adik kelas IX agar tidak bingung memilih jalur pendidikan setelah lulus SMP.',
    content: `
      <p>Kelulusan adalah pintu gerbang menuju jenjang pendidikan yang lebih tinggi. Agar tidak salah pilih jurusan atau sekolah lanjutan, simak panduan penting dari Tim BK berikut ini:</p>
      <ol>
        <li><strong>Kenali Potensi Diri:</strong> Apakah kamu lebih menyukai teori akademik (SMA), keterampilan praktis langsung kerja (SMK), atau ilmu keagamaan yang mendalam (MA)?</li>
        <li><strong>Riset Jalur PPDB:</strong> Pahami jalur zonasi, prestasi, afirmasi, dan perpindahan orang tua. Siapkan sertifikat prestasi yang valid.</li>
        <li><strong>Konsultasi Orang Tua & Guru BK:</strong> Komunikasikan impianmu dengan orang tua dan guru konseling untuk mendapatkan saran objektif.</li>
      </ol>
      <p>Semoga sukses meraih sekolah impian kalian semua!</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    tags: ['Bimbingan Konseling', 'PPDB', 'Pendidikan', 'Karir'],
    likes: 29,
    pinned: false,
    status: 'published',
    comments: []
  },
  {
    id: 'post-6',
    title: 'Open Recruitment Ekstrakurikuler Paskibra & Pramuka Angkatan 2026/2027',
    category: 'Ekstrakurikuler',
    author: 'Pembina Paskibra Sekolah',
    authorRole: 'Pembina OSIS',
    date: '28 Juli 2026',
    excerpt: 'Bagi adik-adik kelas VII dan VIII yang berminat melatih kedisiplinan dan kepemimpinan, pendaftaran telah dibuka!',
    content: `
      <p>Salam Pramuka & Salam Pemuda!</p>
      <p>Ekstrakurikuler Paskibra (Pasukan Pengibar Bendera) dan Pramuka Gudep SMPN 1 Nusantara membuka pendaftaran anggota baru.</p>
      <p><strong>Manfaat Bergabung:</strong></p>
      <ul>
        <li>Melatih mental disiplin, kepemimpinan, dan kerjasama tim.</li>
        <li>Kesempatan tampil di upacara hari besar nasional.</li>
        <li>Perolehan nilai ekstrakurikuler serta poin portofolio prestasi.</li>
      </ul>
      <p>Daftar online melalui sekre OSIS atau langsung temui Kak Budi di Sanggar Pramuka.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    tags: ['Ekskul', 'Paskibra', 'Pramuka', 'OSIS'],
    likes: 19,
    pinned: false,
    status: 'published',
    comments: []
  }
];

export const initialGraduationStudents: StudentGraduation[] = [
  // KELAS VII
  {
    id: 'std-701',
    nisn: '0088991122',
    nis: '25263001',
    full_name: 'Nabila Putri',
    class_name: 'VII',
    grade_level: 'VII',
    birth_date: '2012-10-08',
    birth_place: 'Jakarta',
    parent_name: 'Hendra Gunawan',
    status: 'AKTIF',
    password: 'siswa',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-702',
    nisn: '0088991123',
    nis: '25263002',
    full_name: 'Muhammad Fajar Ramadhan',
    class_name: 'VII',
    grade_level: 'VII',
    birth_date: '2012-07-15',
    birth_place: 'Bandung',
    parent_name: 'Agus Ramadhan',
    status: 'AKTIF',
    password: 'siswa',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-703',
    nisn: '0088993344',
    nis: '25263003',
    full_name: 'Dimas Wicaksono',
    class_name: 'VII',
    grade_level: 'VII',
    birth_date: '2012-03-22',
    birth_place: 'Semarang',
    parent_name: 'Budi Wicaksono',
    status: 'AKTIF',
    password: 'siswa',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-704',
    nisn: '0088993345',
    nis: '25263004',
    full_name: 'Siti Aisyah Putri',
    class_name: 'VII',
    grade_level: 'VII',
    birth_date: '2012-11-19',
    birth_place: 'Surabaya',
    parent_name: 'Lukman Hakim',
    status: 'AKTIF',
    password: 'siswa',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },

  // KELAS VIII
  {
    id: 'std-801',
    nisn: '0077881133',
    nis: '24252002',
    full_name: 'Anisa Zahra Lestari',
    class_name: 'VIII',
    grade_level: 'VIII',
    birth_date: '2011-09-03',
    birth_place: 'Yogyakarta',
    parent_name: 'Tri Lestari',
    status: 'AKTIF',
    password: 'siswa',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-802',
    nisn: '0077881134',
    nis: '24252003',
    full_name: 'Kevin Pratama Wijaya',
    class_name: 'VIII',
    grade_level: 'VIII',
    birth_date: '2011-06-18',
    birth_place: 'Malang',
    parent_name: 'Surya Wijaya',
    status: 'AKTIF',
    password: 'siswa',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-803',
    nisn: '0077889901',
    nis: '24252001',
    full_name: 'Rian Kusuma',
    class_name: 'VIII',
    grade_level: 'VIII',
    birth_date: '2011-04-12',
    birth_place: 'Semarang',
    parent_name: 'Kusuma Wardhana',
    status: 'AKTIF',
    password: 'siswa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-804',
    nisn: '0077889902',
    nis: '24252004',
    full_name: 'Putri Ayu Lestari',
    class_name: 'VIII',
    grade_level: 'VIII',
    birth_date: '2011-12-05',
    birth_place: 'Surakarta',
    parent_name: 'Bagus Lestari',
    status: 'AKTIF',
    password: 'siswa',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },

  // KELAS IX (PESERTA KELULUSAN & SKL)
  {
    id: 'std-101',
    nisn: '0061234567',
    nis: '23241001',
    full_name: 'Ahmad Rizky Pratama',
    class_name: 'IX',
    grade_level: 'IX',
    birth_date: '2010-05-14',
    birth_place: 'Nusantara',
    parent_name: 'Bambang Pratama',
    status: 'LULUS',
    password: 'siswa',
    skl_custom_url: 'https://drive.google.com/file/d/sample-skl-ahmad-rizky/view?usp=sharing',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-102',
    nisn: '0062345678',
    nis: '23241002',
    full_name: 'Siti Nurhaliza',
    class_name: 'IX',
    grade_level: 'IX',
    birth_date: '2010-08-22',
    birth_place: 'Bandung',
    parent_name: 'Asep Ridwan',
    status: 'LULUS',
    password: 'siswa',
    skl_custom_url: 'https://drive.google.com/file/d/sample-skl-siti-nurhaliza/view?usp=sharing',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-103',
    nisn: '0063456789',
    nis: '23241003',
    full_name: 'Budi Santoso',
    class_name: 'IX',
    grade_level: 'IX',
    birth_date: '2010-03-10',
    birth_place: 'Surabaya',
    parent_name: 'Suharto Santoso',
    status: 'LULUS',
    password: 'siswa',
    skl_custom_url: '',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-104',
    nisn: '0064567890',
    nis: '23241004',
    full_name: 'Dewa Ayu Putu Cantika',
    class_name: 'IX',
    grade_level: 'IX',
    birth_date: '2010-11-05',
    birth_place: 'Denpasar',
    parent_name: 'I Wayan Sudarma',
    status: 'LULUS',
    password: 'siswa',
    skl_custom_url: 'https://drive.google.com/file/d/sample-skl-dewa-ayu/view?usp=sharing',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-105',
    nisn: '0065678901',
    nis: '23241005',
    full_name: 'Farhan Ardiansyah',
    class_name: 'IX',
    grade_level: 'IX',
    birth_date: '2010-01-30',
    birth_place: 'Medan',
    parent_name: 'Rahmat Ardiansyah',
    status: 'DITANGGUHKAN',
    password: 'siswa',
    note: 'Pengumuman SKL ditangguhkan sementara. Harap mendampingi Orang Tua/Wali datang ke ruang Bimbingan Konseling (BK) pada hari Jumat, 14 Agustus 2026 Pukul 09:00 WIB untuk penyelesaian berkas administrasi ujian dan kelengkapan nilai.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-106',
    nisn: '0066789012',
    nis: '23241006',
    full_name: 'Gita Gutawa Putri',
    class_name: 'IX',
    grade_level: 'IX',
    birth_date: '2010-09-18',
    birth_place: 'Yogyakarta',
    parent_name: 'Joko Widodo',
    status: 'LULUS',
    password: 'siswa',
    skl_custom_url: 'https://drive.google.com/file/d/sample-skl-gita-gutawa/view?usp=sharing',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  }
];
