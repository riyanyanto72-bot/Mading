import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Check, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  User,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface EditStudentPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  studentName: string;
  studentClass: string;
  studentNisn: string;
  onSavePhoto: (newAvatarUrl: string) => void;
}

const PRESET_AVATARS = [
  { id: 'av-1', label: 'Siswa Putra 1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80' },
  { id: 'av-2', label: 'Siswa Putri 1', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
  { id: 'av-3', label: 'Siswa Putra 2', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80' },
  { id: 'av-4', label: 'Siswa Putri 2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { id: 'av-5', label: 'Siswa Putra 3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { id: 'av-6', label: 'Siswa Putri 3', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
  { id: 'av-7', label: 'Siswa Putra 4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
  { id: 'av-8', label: 'Siswa Putri 4', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80' },
];

export const EditStudentPhotoModal: React.FC<EditStudentPhotoModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  studentName,
  studentClass,
  studentNisn,
  onSavePhoto,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [previewPhoto, setPreviewPhoto] = useState<string>(currentAvatar || '');
  const [urlInput, setUrlInput] = useState<string>(currentAvatar || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Compress & convert file to Web-friendly Data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Format berkas tidak didukung. Harap pilih gambar (JPG, PNG, WEBP).');
      return;
    }

    // Limit raw upload to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Ukuran berkas terlalu besar. Maksimal 10MB.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to resize image (max 480x480 for ultra fast rendering & compact storage)
        const canvas = document.createElement('canvas');
        const maxDimension = 480;
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
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPreviewPhoto(compressedDataUrl);
          setIsProcessing(false);
        } else {
          setPreviewPhoto(e.target?.result as string);
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setErrorMessage('Gagal memproses gambar. Silakan coba gambar lain.');
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setErrorMessage('Gagal membaca berkas gambar.');
      setIsProcessing(false);
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

  const handleApplyUrl = () => {
    setErrorMessage(null);
    if (!urlInput.trim()) {
      setErrorMessage('Harap masukkan URL tautan foto yang valid.');
      return;
    }
    setPreviewPhoto(urlInput.trim());
  };

  const handleSave = () => {
    onSavePhoto(previewPhoto);
    onClose();
  };

  const handleResetToEmpty = () => {
    setPreviewPhoto('');
    setUrlInput('');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-indigo-950 my-6 flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="p-5 bg-indigo-950 text-white flex items-center justify-between border-b-2 border-amber-400 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-bold shadow-sm">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-indigo-900 px-2 py-0.5 rounded border border-indigo-700">
                  HAK AKSES SISWA
                </span>
              </div>
              <h3 className="font-black text-lg text-white">Ganti Pas Foto Siswa</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-2 rounded-xl bg-indigo-900 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Identity & Preview Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            {/* Foto Avatar Preview */}
            <div className="relative group">
              <div className="w-24 h-28 rounded-2xl bg-indigo-900 text-white border-2 border-amber-400 overflow-hidden shadow-md flex items-center justify-center flex-shrink-0">
                {previewPhoto ? (
                  <img 
                    src={previewPhoto} 
                    alt={studentName} 
                    className="w-full h-full object-cover"
                    onError={() => {
                      setErrorMessage('Gagal memuat gambar dari tautan. Pastikan link gambar dapat diakses publik.');
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-indigo-300 gap-1 p-2 text-center">
                    <User className="w-10 h-10" />
                    <span className="text-[9px] font-bold text-slate-300">Belum Ada Foto</span>
                  </div>
                )}
              </div>

              {previewPhoto && (
                <button
                  type="button"
                  onClick={handleResetToEmpty}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white text-xs cursor-pointer transition-transform hover:scale-110"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Info Siswa */}
            <div className="space-y-1 text-center sm:text-left flex-1">
              <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 inline-block">
                Kelas {studentClass || 'IX'}
              </span>
              <h4 className="font-black text-slate-900 text-base leading-tight">
                {studentName}
              </h4>
              <p className="text-xs text-slate-600 font-mono">
                NISN: <strong>{studentNisn || '-'}</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                Foto ini akan tampil di Kartu Pelajar Digital, Profil Siswa, dan karya Mading.
              </p>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => { setActiveTab('upload'); setErrorMessage(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'upload' 
                  ? 'bg-white text-indigo-950 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Berkas</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('url'); setErrorMessage(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'url' 
                  ? 'bg-white text-indigo-950 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Tautan / URL</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('presets'); setErrorMessage(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'presets' 
                  ? 'bg-white text-indigo-950 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pilihan Avatar</span>
            </button>
          </div>

          {/* Tab 1: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-300 hover:border-indigo-600 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">
                    Klik untuk memilih foto dari galeri / komputer
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    atau seret (drag & drop) berkas foto ke area ini
                  </p>
                </div>
                <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100/70 px-2.5 py-0.5 rounded-full mt-1">
                  Format: JPG, PNG, WEBP (Otomatis Dioptimasi)
                </span>
              </div>

              {isProcessing && (
                <div className="text-center py-2 text-xs font-bold text-indigo-600 flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses dan mengoptimalkan foto...</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Alamat / Link Gambar Foto
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... atau https://drive.google.com/..."
                    className="flex-1 border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-4 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Pasang</span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  *Pastikan tautan dapat dibuka untuk umum tanpa batasan login.
                </span>
              </div>
            </div>
          )}

          {/* Tab 3: Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <p className="text-xs text-slate-600 font-medium">
                Pilih salah satu karakter avatar resmi jika belum memiliki pas foto:
              </p>
              <div className="grid grid-cols-4 gap-3">
                {PRESET_AVATARS.map((av) => {
                  const isSelected = previewPhoto === av.url;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setPreviewPhoto(av.url);
                        setUrlInput(av.url);
                        setErrorMessage(null);
                      }}
                      className={`group relative rounded-2xl p-1.5 border-2 transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-400' 
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100">
                        <img src={av.url} alt={av.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 text-center truncate w-full">
                        {av.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleResetToEmpty}
            className="px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan Foto</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 border border-amber-300 active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Foto Profil</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
