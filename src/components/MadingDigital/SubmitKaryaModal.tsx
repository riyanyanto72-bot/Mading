import React, { useState, useEffect } from 'react';
import { MadingCategory, MadingPost, UserAccount } from '../../types';
import { X, Send, Image as ImageIcon, Sparkles, FileText, User, ShieldCheck } from 'lucide-react';

interface SubmitKaryaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<MadingPost, 'id' | 'date' | 'likes' | 'comments' | 'status'>) => void;
  currentUser: UserAccount;
}

export const SubmitKaryaModal: React.FC<SubmitKaryaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MadingCategory>('Karya Siswa');
  const [author, setAuthor] = useState('');
  const [authorRole, setAuthorRole] = useState('Siswa');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Sync default author with current logged-in role
  useEffect(() => {
    if (isOpen) {
      if (currentUser.role === 'siswa') {
        setAuthor(currentUser.name + (currentUser.class_name ? ` (${currentUser.class_name})` : ''));
        setAuthorRole('Siswa');
        setCategory('Karya Siswa');
      } else if (currentUser.role === 'guru') {
        setAuthor(currentUser.name);
        setAuthorRole('Guru / Tenaga Pendidik');
        setCategory('Pengumuman');
      } else {
        setAuthor(currentUser.name);
        setAuthorRole('Administrator');
        setCategory('Pengumuman');
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) return;

    const tags = tagsInput
      ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : ['MadingDigital', category];

    onSubmit({
      title: title.trim(),
      category,
      author: author.trim(),
      authorRole,
      excerpt: excerpt.trim() || content.substring(0, 120) + '...',
      content: `<p>${content.trim().replace(/\n/g, '</p><p>')}</p>`,
      coverImage: coverImage.trim() || undefined,
      tags,
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
      // Reset form
      setTitle('');
      setAuthor('');
      setContent('');
      setExcerpt('');
      setCoverImage('');
      setTagsInput('');
    }, 1500);
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold">Kirim Karya / Tulisan Mading</h2>
              <p className="text-xs text-slate-400">Bagikan puisi, cerita, artikel, atau prestasi ke mading sekolah</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {successMsg ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-900">Karya Berhasil Dikirim!</h3>
            <p className="text-sm text-slate-600">
              Terima kasih! Karya kamu telah tersimpan dan langsung dapat dibaca di Mading Digital Sekolah.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Karya <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MadingCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Karya Siswa">Karya Siswa (Puisi/Cerpen/Gambar)</option>
                  <option value="Pengumuman">Pengumuman Resmi</option>
                  <option value="Prestasi">Prestasi & Lomba</option>
                  <option value="Agenda">Agenda / Kegiatan</option>
                  <option value="Artikel">Artikel & Edukasi</option>
                  <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Peran Penulis
                </label>
                <select
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Siswa">Siswa</option>
                  <option value="Guru">Guru / Tenaga Pendidik</option>
                  <option value="Pembina OSIS">Pembina OSIS / Ekstrakurikuler</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Karya / Artikel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Puisi: Menatap Masa Depan di Ujung Kelas"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Penulis / Pembuat Karya <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap & Kelas (misal: Rian IX-B)"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Kunci / Tag (pisahkan koma)
                </label>
                <input
                  type="text"
                  placeholder="Puisi, Seni, IX-A, Lomba"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ringkasan Singkat (Excerpt)
              </label>
              <input
                type="text"
                placeholder="Ringkasan 1 kalimat yang muncul pada kartu mading..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Isi Lengkap Karya / Tulisan <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Tuliskan bait puisi, isi cerita, pesan pengumuman, atau artikel kamu di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Gambar Sampul (Opsional)
              </label>
              <div className="relative mb-2">
                <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs"
                />
              </div>
              <p className="text-[11px] text-slate-500 mb-1">Atau pilih salah satu gambar sampel berikut:</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sampleImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverImage(img)}
                    className={`relative rounded-lg overflow-hidden border-2 w-16 h-12 flex-shrink-0 transition-all ${
                      coverImage === img ? 'border-amber-500 scale-95 ring-2 ring-amber-400/30' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="sample" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Publikasikan Karya</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
