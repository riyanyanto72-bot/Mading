import React, { useState } from 'react';
import { MadingCategory, MadingPost, SchoolSettings, UserAccount } from '../../types';
import { MadingCard } from './MadingCard';
import { Sparkles, Pin, Newspaper, PlusCircle, Filter } from 'lucide-react';

interface MadingGridProps {
  posts: MadingPost[];
  searchQuery: string;
  settings?: SchoolSettings;
  currentUser: UserAccount;
  onSelectPost: (post: MadingPost) => void;
  onLikePost: (postId: string, e: React.MouseEvent) => void;
  onOpenSubmitModal: () => void;
  onGoToGraduation: () => void;
  onApprovePost: (postId: string) => void;
  onRejectPost: (postId: string) => void;
}

export const MadingGrid: React.FC<MadingGridProps> = ({
  posts,
  searchQuery,
  settings,
  currentUser,
  onSelectPost,
  onLikePost,
  onOpenSubmitModal,
  onGoToGraduation,
  onApprovePost,
  onRejectPost,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const heroBadge = settings?.hero_badge || 'Kreativitas & Prestasi Tanpa Batas';
  const heroTitle = settings?.hero_title || 'Mading Digital Resmi & Informasi Terpadu Sekolah';
  const heroDescription =
    settings?.hero_description ||
    'Wadah ekspresi karya siswa, artikel edukasi, pengumuman resmi sekolah, dan informasi pengumuman kelulusan siswa kelas IX.';
  const btnSubmitText = settings?.hero_btn_submit_text || 'Kirim Karya Siswa Baru';
  const btnSubmitShow = settings?.hero_btn_submit_show !== false;
  const btnGradText = settings?.hero_btn_grad_text || 'Cek Kelulusan (Khusus Kelas IX)';
  const btnGradShow = settings?.hero_btn_grad_show !== false;

  const categories = ['Semua', 'Pengumuman', 'Karya Siswa', 'Prestasi', 'Agenda', 'Artikel', 'Ekstrakurikuler'];

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    // Determine visibility based on status and role
    const isApproved = post.status !== 'pending' && post.status !== 'rejected';
    const isPending = post.status === 'pending';
    const canSeePending = currentUser.role === 'admin' || currentUser.role === 'guru';
    const isMyPending = isPending && currentUser.name === post.author && currentUser.role === 'siswa';

    if (!isApproved && !canSeePending && !isMyPending) return false;

    const matchesCategory = selectedCategory === 'Semua' || post.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Find pinned post
  const pinnedPost = posts.find((p) => p.pinned && p.status !== 'pending' && p.status !== 'rejected');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Banner / Hero Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white p-6 sm:p-8 shadow-md border border-indigo-800 border-l-4 border-l-amber-400">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          {heroBadge && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-400/15 border border-amber-400/30 text-amber-300 rounded text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{heroBadge}</span>
            </div>
          )}

          <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight text-white">
            {heroTitle}
          </h1>

          <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
            {heroDescription}
          </p>

          {(btnSubmitShow || btnGradShow) && (
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {btnSubmitShow && (
                <button
                  onClick={onOpenSubmitModal}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold rounded text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 active:scale-95 border border-amber-300 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{btnSubmitText}</span>
                </button>
              )}

              {btnGradShow && (
                <button
                  onClick={onGoToGraduation}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 active:scale-95 border border-emerald-500 cursor-pointer"
                >
                  <Newspaper className="w-4 h-4" />
                  <span>{btnGradText}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Featured Pinned Post Banner (If search isn't active) */}
      {!searchQuery && selectedCategory === 'Semua' && pinnedPost && (
        <section className="bg-amber-50/80 rounded-xl p-4 border-2 border-amber-400 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-indigo-950 font-extrabold text-xs uppercase tracking-wider mb-2.5">
            <Pin className="w-4 h-4 fill-current text-amber-600" />
            <span>Pengumuman Paling Penting & Disematkan</span>
          </div>

          <div
            onClick={() => onSelectPost(pinnedPost)}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 cursor-pointer group bg-white p-4 rounded-lg border border-amber-200 shadow-sm hover:border-indigo-400 transition-all"
          >
            {pinnedPost.coverImage && (
              <div className="lg:col-span-5 h-44 sm:h-52 rounded overflow-hidden bg-slate-100">
                <img
                  src={pinnedPost.coverImage}
                  alt={pinnedPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            <div className={`flex flex-col justify-between ${pinnedPost.coverImage ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
              <div className="space-y-1.5">
                <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                  {pinnedPost.category}
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {pinnedPost.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                  {pinnedPost.excerpt}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Diposting oleh: <strong className="text-slate-800">{pinnedPost.author}</strong></span>
                <span className="font-bold text-indigo-900 group-hover:underline flex items-center gap-1">
                  Baca Selengkapnya →
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          <span className="text-xs font-bold text-slate-500 mr-2 hidden sm:flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Kategori:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-950 text-amber-300 shadow-xs border border-indigo-900'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
          {filteredPosts.length} mading
        </span>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 space-y-2">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Tidak ada mading yang cocok</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau ganti kategori filter untuk melihat postingan lainnya.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Semua');
            }}
            className="mt-1 text-xs text-indigo-700 font-bold hover:underline"
          >
            Tampilkan Semua Mading
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <MadingCard
              key={post.id}
              post={post}
              onSelect={onSelectPost}
              onLike={onLikePost}
            />
          ))}
        </div>
      )}

    </div>
  );
};
