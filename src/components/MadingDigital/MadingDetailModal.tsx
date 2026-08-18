import React, { useState } from 'react';
import { MadingPost } from '../../types';
import { X, Heart, MessageSquare, Calendar, User, Tag, Send, Share2, Pin, CheckCircle2 } from 'lucide-react';

interface MadingDetailModalProps {
  post: MadingPost | null;
  onClose: () => void;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, commentAuthor: string, text: string) => void;
}

export const MadingDetailModal: React.FC<MadingDetailModalProps> = ({
  post,
  onClose,
  onLike,
  onAddComment,
}) => {
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const authorName = commentAuthor.trim() || 'Siswa / Pengunjung';
    onAddComment(post.id, authorName, commentText.trim());
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4 sticky top-0 z-20 shadow-sm border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {post.category}
              </span>
              {post.pinned && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                  <Pin className="w-3 h-3" /> Disematkan
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-bold leading-tight text-white">{post.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                {post.author} ({post.authorRole})
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {post.date}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="rounded-xl overflow-hidden shadow-md max-h-80 w-full bg-slate-100">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Formatted Article Content */}
          <div 
            className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <Tag className="w-3.5 h-3.5" /> Topik:
              </span>
              {post.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions: Like & Share */}
          <div className="flex items-center justify-between py-3 border-y border-slate-200">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors active:scale-95"
            >
              <Heart className={`w-4 h-4 ${post.likes > 0 ? 'fill-red-600' : ''}`} />
              <span>Sukai Mading ({post.likes})</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan Link</span>
                </>
              )}
            </button>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              Komentar & Tanggapan ({post.comments ? post.comments.length : 0})
            </h3>

            {/* Existing Comments */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {(!post.comments || post.comments.length === 0) ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">
                  Belum ada komentar. Jadilah yang pertama memberikan apresiasi!
                </p>
              ) : (
                post.comments.map((c) => (
                  <div key={c.id} className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-slate-900">{c.author}</span>
                      <span className="text-[10px] text-slate-400">{c.date}</span>
                    </div>
                    <p className="text-xs text-slate-700">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-2 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nama Lengkap / Kelas (opsional)"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Tulis komentar atau apresiasi karya ini..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition-all flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
