import React, { useState, useEffect, useRef } from 'react';
import { MadingCategory, MadingPost, UserAccount } from '../../types';
import { 
  X, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  User, 
  Upload, 
  Trash2, 
  Link as LinkIcon, 
  RefreshCw, 
  AlertCircle, 
  Check, 
  Camera 
} from 'lucide-react';

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
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Process & compress image uploaded from gallery / device
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageError('Format berkas tidak didukung. Harap pilih gambar (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setImageError('Ukuran gambar terlalu besar. Maksimal 15MB.');
      return;
    }

    setIsProcessingImage(true);
    setImageError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 1200px width/height for fast loading & compact database storage
        const canvas = document.createElement('canvas');
        const maxDimension = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setCoverImage(compressedDataUrl);
        } else {
          setCoverImage(e.target?.result as string);
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        setImageError('Gagal memproses gambar. Silakan coba gambar lain.');
        setIsProcessingImage(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setImageError('Gagal membaca berkas gambar.');
      setIsProcessingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

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
      setImageError(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5 text-indigo-950" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Kirim Karya / Tulisan Mading</h2>
              <p className="text-xs text-slate-300">Bagikan karya puisi, cerpen, artikel, lukisan, atau prestasi ke mading sekolah</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {successMsg ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
              ✓
            </div>
            <h3 className="text-xl font-black text-slate-900">Karya Berhasil Dikirim!</h3>
            <p className="text-sm text-slate-600">
              Terima kasih! Karya Anda telah tersimpan dan siap dibaca di Mading Digital Sekolah.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori Karya <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MadingCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peran Penulis
                </label>
                <select
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Siswa">Siswa</option>
                  <option value="Guru">Guru / Tenaga Pendidik</option>
                  <option value="Pembina OSIS">Pembina OSIS / Ekstrakurikuler</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Karya / Tulisan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Puisi: Menatap Masa Depan di Ujung Kelas"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
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
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Kunci / Tag (pisahkan koma)
                </label>
                <input
                  type="text"
                  placeholder="Puisi, Seni, IX-A, Lomba"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ringkasan Singkat (Excerpt)
              </label>
              <input
                type="text"
                placeholder="Ringkasan 1 kalimat yang muncul pada kartu mading..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Isi Lengkap Karya / Tulisan <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Tuliskan bait puisi, isi cerita, pesan pengumuman, atau artikel kamu di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Upload Gambar Karya (Galeri / URL) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Gambar / Ilustrasi Karya (Opsional)
                </label>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                  <button
                    type="button"
                    onClick={() => { setImageInputMode('upload'); setImageError(null); }}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      imageInputMode === 'upload'
                        ? 'bg-white text-indigo-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Galeri HP / Komputer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setImageInputMode('url'); setImageError(null); }}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      imageInputMode === 'url'
                        ? 'bg-white text-indigo-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>Tautan URL</span>
                  </button>
                </div>
              </div>

              {imageError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{imageError}</span>
                </div>
              )}

              {/* Mode Upload Galeri */}
              {imageInputMode === 'upload' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {coverImage ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-900 bg-slate-950 flex items-center justify-center group h-52">
                      <img
                        src={coverImage}
                        alt="Preview Karya"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-amber-400 text-indigo-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:bg-amber-300 transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Ganti Gambar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverImage('')}
                          className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-indigo-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Gambar Siap Dipublikasikan</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-indigo-300 hover:border-indigo-600 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">
                          Klik untuk memilih foto dari galeri / kamera
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          atau seret foto karya ke area ini (JPG, PNG, WEBP)
                        </p>
                      </div>
                    </div>
                  )}

                  {isProcessingImage && (
                    <div className="text-center py-1.5 text-xs font-bold text-indigo-600 flex items-center justify-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengoptimalkan gambar karya...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Mode Tautan URL */}
              {imageInputMode === 'url' && (
                <div className="space-y-2">
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... atau https://drive.google.com/..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs"
                    />
                  </div>
                  {coverImage && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-950 flex items-center justify-center">
                      <img src={coverImage} alt="Preview URL" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setCoverImage('')}
                        className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg text-xs shadow-md hover:bg-rose-700 cursor-pointer"
                        title="Hapus URL Gambar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black rounded-xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer border border-amber-300 active:scale-95"
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
