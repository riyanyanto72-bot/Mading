import React from 'react';
import { MadingPost } from '../../types';
import { Heart, MessageSquare, Pin, Calendar, User, Tag, ArrowRight } from 'lucide-react';

interface MadingCardProps {
  post: MadingPost;
  onSelect: (post: MadingPost) => void;
  onLike: (postId: string, e: React.MouseEvent) => void;
}

export const MadingCard: React.FC<MadingCardProps> = ({ post, onSelect, onLike }) => {
  const categoryColors: Record<string, string> = {
    Pengumuman: 'bg-red-100 text-red-800 border-red-300',
    'Karya Siswa': 'bg-purple-100 text-purple-800 border-purple-300',
    Prestasi: 'bg-amber-100 text-amber-900 border-amber-300',
    Agenda: 'bg-blue-100 text-blue-800 border-blue-300',
    Artikel: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Ekstrakurikuler: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  };

  return (
    <article
      onClick={() => onSelect(post)}
      className={`group bg-white rounded-xl border transition-all duration-200 hover:shadow-md hover:border-indigo-400 cursor-pointer flex flex-col overflow-hidden relative ${
        post.pinned ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-xs' : 'border-slate-200/90 shadow-xs'
      }`}
    >
      {/* Pinned Badge */}
      {post.pinned && (
        <div className="absolute top-2.5 left-2.5 z-10 bg-amber-400 text-indigo-950 font-black text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow border border-amber-300">
          <Pin className="w-3 h-3 fill-current" />
          <span>SEMATKAN UTAMA</span>
        </div>
      )}

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-slate-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-50" />
          
          <span
            className={`absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded border shadow-xs ${
              categoryColors[post.category] || 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {post.category}
          </span>
        </div>
      )}

      {/* Post Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {!post.coverImage && (
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mb-2 ${
                categoryColors[post.category] || 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              {post.category}
            </span>
          )}

          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2 mb-1.5">
            {post.title}
          </h3>

          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Post Footer Metadata */}
        <div>
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {post.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium border border-slate-200">
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-slate-700 font-semibold truncate max-w-[100px]" title={post.author}>
                <User className="w-3 h-3 text-slate-400" />
                {post.author}
              </span>
              <span className="flex items-center gap-1 text-slate-400 font-mono">
                <Calendar className="w-3 h-3 text-slate-400" />
                {post.date}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => onLike(post.id, e)}
                className="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors p-0.5"
                title="Sukai Mading"
              >
                <Heart className={`w-3.5 h-3.5 ${post.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="font-mono font-bold text-xs">{post.likes}</span>
              </button>

              <span className="flex items-center gap-1 text-slate-500">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="font-mono text-xs">{post.comments ? post.comments.length : 0}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
