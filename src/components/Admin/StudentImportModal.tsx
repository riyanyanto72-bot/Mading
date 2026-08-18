import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { StudentGraduation, GradeLevel, GraduationStatus } from '../../types';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Database,
  TableProperties,
  ArrowDownToLine,
  HelpCircle
} from 'lucide-react';

interface StudentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingStudents: StudentGraduation[];
  onImportSuccess: (importedStudents: StudentGraduation[], mode: 'append' | 'replace' | 'merge') => void;
}

interface ParsedStudentRow {
  nisn: string;
  nis: string;
  full_name: string;
  class_name: GradeLevel;
  grade_level: GradeLevel;
  status: GraduationStatus | 'AKTIF';
  password?: string;
  skl_custom_url?: string;
  birth_place?: string;
  birth_date?: string;
  parent_name?: string;
  isValid: boolean;
  validationError?: string;
}

// Column Specification Definition
export const EXCEL_COLUMNS = [
  { col: 'A', name: 'NISN', key: 'nisn', required: true, example: '0088991122', desc: '10 Digit Nomor Induk Siswa Nasional' },
  { col: 'B', name: 'NIS', key: 'nis', required: false, example: '25263001', desc: 'Nomor Induk Siswa Sekolah' },
  { col: 'C', name: 'Nama Lengkap', key: 'full_name', required: true, example: 'Nabila Putri Pratama', desc: 'Nama Lengkap Siswa sesuai Akta/Ijazah' },
  { col: 'D', name: 'Kelas', key: 'class_name', required: true, example: 'VII / VIII / IX', desc: 'Jenjang Kelas (VII, VIII, atau IX)' },
  { col: 'E', name: 'Status', key: 'status', required: false, example: 'AKTIF / LULUS', desc: 'LULUS / TIDAK LULUS / DITANGGUHKAN / AKTIF' },
  { col: 'F', name: 'Password', key: 'password', required: false, example: 'siswa', desc: 'Kata Sandi Login (Default: siswa)' },
  { col: 'G', name: 'Link SKL', key: 'skl_custom_url', required: false, example: 'https://drive.google.com/file/d/skl-nabila', desc: 'Tautan Dokumen SKL PDF (Khusus Kelas IX)' },
  { col: 'H', name: 'Tempat Lahir', key: 'birth_place', required: false, example: 'Jakarta', desc: 'Kota / Kabupaten Tempat Lahir' },
  { col: 'I', name: 'Tanggal Lahir', key: 'birth_date', required: false, example: '2012-10-08', desc: 'Format YYYY-MM-DD atau DD/MM/YYYY' },
  { col: 'J', name: 'Nama Orang Tua', key: 'parent_name', required: false, example: 'Hendra Gunawan', desc: 'Nama Orang Tua / Wali Siswa' },
];

const SAMPLE_STUDENTS_EXCEL = [
  {
    "NISN": "0088991122",
    "NIS": "25263001",
    "Nama Lengkap": "Nabila Putri Pratama",
    "Kelas": "VII",
    "Status": "AKTIF",
    "Password": "siswa",
    "Link SKL": "",
    "Tempat Lahir": "Jakarta",
    "Tanggal Lahir": "2012-10-08",
    "Nama Orang Tua": "Hendra Gunawan"
  },
  {
    "NISN": "0088991123",
    "NIS": "25263002",
    "Nama Lengkap": "Muhammad Fajar Ramadhan",
    "Kelas": "VII",
    "Status": "AKTIF",
    "Password": "siswa",
    "Link SKL": "",
    "Tempat Lahir": "Bandung",
    "Tanggal Lahir": "2012-07-15",
    "Nama Orang Tua": "Agus Ramadhan"
  },
  {
    "NISN": "0077881133",
    "NIS": "24252002",
    "Nama Lengkap": "Anisa Zahra Lestari",
    "Kelas": "VIII",
    "Status": "AKTIF",
    "Password": "siswa",
    "Link SKL": "",
    "Tempat Lahir": "Yogyakarta",
    "Tanggal Lahir": "2011-09-03",
    "Nama Orang Tua": "Tri Lestari"
  },
  {
    "NISN": "0077881134",
    "NIS": "24252003",
    "Nama Lengkap": "Kevin Pratama Wijaya",
    "Kelas": "VIII",
    "Status": "AKTIF",
    "Password": "siswa",
    "Link SKL": "",
    "Tempat Lahir": "Malang",
    "Tanggal Lahir": "2011-06-18",
    "Nama Orang Tua": "Surya Wijaya"
  },
  {
    "NISN": "0061234567",
    "NIS": "23241001",
    "Nama Lengkap": "Ahmad Rizky Pratama",
    "Kelas": "IX",
    "Status": "LULUS",
    "Password": "siswa",
    "Link SKL": "https://drive.google.com/file/d/sample-skl-ahmad",
    "Tempat Lahir": "Nusantara",
    "Tanggal Lahir": "2010-05-14",
    "Nama Orang Tua": "Bambang Pratama"
  },
  {
    "NISN": "0062345678",
    "NIS": "23241002",
    "Nama Lengkap": "Siti Nurhaliza",
    "Kelas": "IX",
    "Status": "LULUS",
    "Password": "siswa",
    "Link SKL": "https://drive.google.com/file/d/sample-skl-siti",
    "Tempat Lahir": "Bandung",
    "Tanggal Lahir": "2010-08-22",
    "Nama Orang Tua": "Asep Ridwan"
  },
  {
    "NISN": "0065678901",
    "NIS": "23241005",
    "Nama Lengkap": "Farhan Ardiansyah",
    "Kelas": "IX",
    "Status": "DITANGGUHKAN",
    "Password": "siswa",
    "Link SKL": "",
    "Tempat Lahir": "Medan",
    "Tanggal Lahir": "2010-01-30",
    "Nama Orang Tua": "Rahmat Ardiansyah"
  }
];

const normalizeClass = (rawClass?: any): GradeLevel => {
  if (!rawClass) return 'IX';
  const clean = String(rawClass).trim().toUpperCase();
  if (clean.includes('VII') || clean.startsWith('7')) {
    return 'VII';
  }
  if (clean.includes('VIII') || clean.startsWith('8')) {
    return 'VIII';
  }
  return 'IX';
};

const normalizeStatus = (rawStatus?: any, grade?: GradeLevel): GraduationStatus | 'AKTIF' => {
  if (!rawStatus) {
    return grade === 'IX' ? 'LULUS' : 'AKTIF';
  }
  const clean = String(rawStatus).trim().toUpperCase();
  if (clean.includes('TIDAK') || clean === 'TIDAK_LULUS' || clean === 'GAGAL') {
    return 'TIDAK_LULUS';
  }
  if (clean.includes('TANGGUH') || clean === 'DITANGGUHKAN' || clean === 'PENDING') {
    return 'DITANGGUHKAN';
  }
  if (clean.includes('LULUS')) {
    return 'LULUS';
  }
  return 'AKTIF';
};

export const StudentImportModal: React.FC<StudentImportModalProps> = ({
  isOpen,
  onClose,
  existingStudents,
  onImportSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'column_guide'>('upload');
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace' | 'merge'>('append');
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Download Template XLSX (per-kolom format)
  const handleDownloadXlsxTemplate = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(SAMPLE_STUDENTS_EXCEL);

      // Set specific column widths for neat appearance in Excel
      worksheet['!cols'] = [
        { wch: 14 }, // Kolom A: NISN
        { wch: 12 }, // Kolom B: NIS
        { wch: 28 }, // Kolom C: Nama Lengkap
        { wch: 10 }, // Kolom D: Kelas (VII, VIII, IX)
        { wch: 16 }, // Kolom E: Status
        { wch: 14 }, // Kolom F: Password
        { wch: 38 }, // Kolom G: Link SKL
        { wch: 18 }, // Kolom H: Tempat Lahir
        { wch: 16 }, // Kolom I: Tanggal Lahir
        { wch: 24 }  // Kolom J: Nama Orang Tua
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data_Siswa');

      // Add a guidance sheet
      const guideData = [
        { "KOLOM": "Kolom A", "NAMA FIELD": "NISN", "SIFAT": "WAJIB", "DESKRIPSI & FORMAT": "10 Digit Nomor Induk Siswa Nasional. Wajib unik." },
        { "KOLOM": "Kolom B", "NAMA FIELD": "NIS", "SIFAT": "OPSIONAL", "DESKRIPSI & FORMAT": "Nomor Induk Siswa di sekolah (misal: 25263001)" },
        { "KOLOM": "Kolom C", "NAMA FIELD": "Nama Lengkap", "SIFAT": "WAJIB", "DESKRIPSI & FORMAT": "Nama Lengkap Siswa sesuai raport / akta kelahiran." },
        { "KOLOM": "Kolom D", "NAMA FIELD": "Kelas", "SIFAT": "WAJIB", "DESKRIPSI & FORMAT": "Isi dengan: VII, VIII, atau IX." },
        { "KOLOM": "Kolom E", "NAMA FIELD": "Status", "SIFAT": "OPSIONAL", "DESKRIPSI & FORMAT": "Khusus Kelas IX: LULUS, TIDAK LULUS, DITANGGUHKAN. Kelas VII & VIII otomatis AKTIF." },
        { "KOLOM": "Kolom F", "NAMA FIELD": "Password", "SIFAT": "OPSIONAL", "DESKRIPSI & FORMAT": "Kata sandi login siswa (default: siswa jika dikosongkan)." },
        { "KOLOM": "Kolom G", "NAMA FIELD": "Link SKL", "SIFAT": "OPSIONAL", "DESKRIPSI & FORMAT": "Tautan dokumen SKL resmi (Google Drive / URL file)." },
        { "KOLOM": "Kolom H", "NAMA FIELD": "Tempat Lahir", "SIFAT": "OPSIONAL", "DESKRIPSI & FORMAT": "Kota atau Kabupaten tempat lahir." },
        { "KOLOM": "Kolom I", "NAMA FIELD": "Tanggal Lahir", "SIFAT": "OPSIONAL", "DESKRIPSI & FORMAT": "Format tanggal YYYY-MM-DD (contoh: 2010-05-14) atau DD/MM/YYYY." },
        { "KOLOM": "Kolom J", "NAMA FIELD": "Nama Orang Tua", "SIFAT": "OPSIONAL", "DESKRIPSI & FORMAT": "Nama Orang Tua / Wali murid." }
      ];
      const guideSheet = XLSX.utils.json_to_sheet(guideData);
      guideSheet['!cols'] = [
        { wch: 12 },
        { wch: 18 },
        { wch: 12 },
        { wch: 55 }
      ];
      XLSX.utils.book_append_sheet(workbook, guideSheet, 'Petunjuk_Pengisian');

      XLSX.writeFile(workbook, 'Template_Import_Siswa_SMP.xlsx');
    } catch (err) {
      console.error('Error generating template xlsx:', err);
      alert('Gagal mengunduh template XLSX.');
    }
  };

  // Export Current Existing Students to XLSX
  const handleExportCurrentStudentsXlsx = () => {
    try {
      const rows = existingStudents.map((s) => ({
        "NISN": s.nisn || '',
        "NIS": s.nis || '',
        "Nama Lengkap": s.full_name || '',
        "Kelas": s.class_name || 'IX',
        "Status": s.status || 'AKTIF',
        "Password": s.password || 'siswa',
        "Link SKL": s.skl_custom_url || '',
        "Tempat Lahir": s.birth_place || '',
        "Tanggal Lahir": s.birth_date || '',
        "Nama Orang Tua": s.parent_name || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet['!cols'] = [
        { wch: 14 },
        { wch: 12 },
        { wch: 28 },
        { wch: 10 },
        { wch: 16 },
        { wch: 14 },
        { wch: 38 },
        { wch: 18 },
        { wch: 16 },
        { wch: 24 }
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data_Siswa');
      XLSX.writeFile(workbook, `Data_Siswa_Export_${Date.now()}.xlsx`);
    } catch (err) {
      console.error('Export error:', err);
      alert('Gagal mengekspor data siswa.');
    }
  };

  // Process Excel Workbook Array / ArrayBuffer
  const processWorkbookBuffer = (buffer: ArrayBuffer, name: string) => {
    setIsProcessing(true);
    setParseError(null);
    try {
      const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        setParseError('Berkas Excel tidak memiliki lembar kerja (worksheet).');
        setIsProcessing(false);
        return;
      }

      // Read the first sheet (or the one named Data_Siswa if available)
      const targetSheetName = workbook.SheetNames.includes('Data_Siswa')
        ? 'Data_Siswa'
        : workbook.SheetNames[0];

      const worksheet = workbook.Sheets[targetSheetName];
      const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });

      if (!rawRows || rawRows.length === 0) {
        setParseError('Lembar kerja kosong atau tidak memiliki data.');
        setIsProcessing(false);
        return;
      }

      // Check Header row
      const firstRow = rawRows[0] || [];
      const firstRowStr = firstRow.map((c) => String(c || '').toLowerCase()).join(' ');

      const hasHeader =
        firstRowStr.includes('nisn') ||
        firstRowStr.includes('nama') ||
        firstRowStr.includes('kelas');

      const dataRows = hasHeader ? rawRows.slice(1) : rawRows;

      if (dataRows.length === 0) {
        setParseError('Berkas hanya berisi baris header tanpa baris data siswa.');
        setIsProcessing(false);
        return;
      }

      // Build header column map if header exists
      let colMap = {
        nisn: 0,
        nis: 1,
        full_name: 2,
        class_name: 3,
        status: 4,
        password: 5,
        skl_custom_url: 6,
        birth_place: 7,
        birth_date: 8,
        parent_name: 9,
      };

      if (hasHeader) {
        firstRow.forEach((colVal: any, idx: number) => {
          const s = String(colVal || '').trim().toLowerCase();
          if (s.includes('nisn')) colMap.nisn = idx;
          else if (s === 'nis' || s.includes('nomor induk siswa')) colMap.nis = idx;
          else if (s.includes('nama') && !s.includes('orang') && !s.includes('wali')) colMap.full_name = idx;
          else if (s.includes('kelas') || s.includes('tingkat') || s.includes('grade')) colMap.class_name = idx;
          else if (s.includes('status') || s.includes('kelulusan')) colMap.status = idx;
          else if (s.includes('pass') || s.includes('sandi') || s.includes('kata sandi')) colMap.password = idx;
          else if (s.includes('skl') || s.includes('link') || s.includes('surat')) colMap.skl_custom_url = idx;
          else if (s.includes('tempat') || s.includes('kota lahir')) colMap.birth_place = idx;
          else if (s.includes('tanggal') || s.includes('tgl') || s.includes('lahir')) colMap.birth_date = idx;
          else if (s.includes('orang') || s.includes('tua') || s.includes('wali') || s.includes('ayah') || s.includes('ibu')) colMap.parent_name = idx;
        });
      }

      const results: ParsedStudentRow[] = [];

      dataRows.forEach((row: any[]) => {
        // Filter out empty trailing rows
        if (!row || row.every((c) => String(c || '').trim() === '')) {
          return;
        }

        const rawNisn = String(row[colMap.nisn] ?? '').trim();
        const rawNis = String(row[colMap.nis] ?? '').trim() || `2526${Math.floor(1000 + Math.random() * 9000)}`;
        const rawFullName = String(row[colMap.full_name] ?? '').trim();
        const rawClass = row[colMap.class_name];
        const grade = normalizeClass(rawClass);
        const rawStatus = row[colMap.status];
        const status = normalizeStatus(rawStatus, grade);
        const rawPassword = String(row[colMap.password] ?? '').trim() || 'siswa';
        const rawSkl = String(row[colMap.skl_custom_url] ?? '').trim();
        const rawBirthPlace = String(row[colMap.birth_place] ?? '').trim() || 'Nusantara';

        let rawBirthDate = row[colMap.birth_date];
        if (rawBirthDate instanceof Date) {
          rawBirthDate = rawBirthDate.toISOString().split('T')[0];
        } else {
          rawBirthDate = String(rawBirthDate ?? '').trim() || '2010-01-01';
        }

        const rawParentName = String(row[colMap.parent_name] ?? '').trim() || '-';

        let isValid = true;
        let validationError = '';

        if (!rawNisn) {
          isValid = false;
          validationError = 'Kolom NISN kosong';
        } else if (!rawFullName) {
          isValid = false;
          validationError = 'Kolom Nama Lengkap kosong';
        }

        results.push({
          nisn: rawNisn,
          nis: rawNis,
          full_name: rawFullName,
          class_name: grade,
          grade_level: grade,
          status,
          password: rawPassword,
          skl_custom_url: rawSkl,
          birth_place: rawBirthPlace,
          birth_date: rawBirthDate,
          parent_name: rawParentName,
          isValid,
          validationError: validationError || undefined,
        });
      });

      if (results.length === 0) {
        setParseError('Tidak ditemukan baris data siswa yang dapat diproses dari berkas.');
      } else {
        setParsedRows(results);
        setFileName(name);
      }
    } catch (err: any) {
      console.error('Error reading excel:', err);
      setParseError(`Gagal membaca berkas Excel: ${err?.message || 'Format berkas tidak sesuai.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle File Input Change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      processWorkbookBuffer(buffer, file.name);
    };
    reader.onerror = () => {
      setParseError('Gagal membaca berkas. Pastikan berkas berformat .xlsx, .xls, atau .csv');
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      processWorkbookBuffer(buffer, file.name);
    };
    reader.readAsArrayBuffer(file);
  };

  // Execute Import
  const handleExecuteImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      alert('Tidak ada baris data siswa yang valid untuk disimpan.');
      return;
    }

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    ];

    const formattedStudents: StudentGraduation[] = validRows.map((r, i) => ({
      id: `std-imp-${Date.now()}-${i}`,
      nisn: r.nisn,
      nis: r.nis,
      full_name: r.full_name,
      class_name: r.class_name,
      grade_level: r.grade_level,
      status: r.class_name === 'IX' ? r.status : 'AKTIF',
      password: r.password || 'siswa',
      skl_custom_url: r.skl_custom_url || '',
      birth_place: r.birth_place || 'Nusantara',
      birth_date: r.birth_date || '2010-01-01',
      parent_name: r.parent_name || '-',
      avatar: '',
    }));

    onImportSuccess(formattedStudents, importMode);
    onClose();
  };

  const countValid = parsedRows.filter((r) => r.isValid).length;
  const countInvalid = parsedRows.filter((r) => !r.isValid).length;
  const countVII = parsedRows.filter((r) => r.isValid && r.class_name === 'VII').length;
  const countVIII = parsedRows.filter((r) => r.isValid && r.class_name === 'VIII').length;
  const countIX = parsedRows.filter((r) => r.isValid && r.class_name === 'IX').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border-2 border-indigo-950 my-6 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-indigo-950 text-white flex items-center justify-between border-b-2 border-amber-400 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-indigo-900 px-2 py-0.5 rounded border border-indigo-700">
                  FORMAT EXCEL (.XLSX) PER-KOLOM
                </span>
              </div>
              <h3 className="font-black text-lg text-white">Import Data Siswa Microsoft Excel (.xlsx)</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-2 rounded-xl bg-indigo-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          
          {/* Top Banner: Download Template XLSX & Export Current */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <h4 className="text-sm font-black text-slate-900">
                  Template Excel Resmi (.xlsx)
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                Unduh template Excel dengan kolom baku <strong>A s.d J</strong> (NISN, NIS, Nama Lengkap, Kelas VII/VIII/IX, Status, Password, Link SKL, Tempat & Tanggal Lahir, Orang Tua).
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
              <button
                type="button"
                onClick={handleDownloadXlsxTemplate}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Template (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={handleExportCurrentStudentsXlsx}
                className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Ekspor data siswa yang tersimpan saat ini ke format Excel"
              >
                <ArrowDownToLine className="w-4 h-4 text-indigo-600" />
                <span>Ekspor Data Saat Ini</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'border-indigo-600 text-indigo-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Unggah Berkas Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => setActiveTab('column_guide')}
              className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'column_guide'
                  ? 'border-indigo-600 text-indigo-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <TableProperties className="w-4 h-4" />
              <span>Struktur & Panduan 10 Kolom</span>
            </button>
          </div>

          {/* TAB 1: UPLOAD EXCEL */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              
              {/* Drag & Drop Box */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/30 hover:bg-emerald-50/70 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                />
                <div className="w-14 h-14 bg-white text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-emerald-200">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-900">
                    {fileName ? `Berkas Terpilih: ${fileName}` : 'Klik untuk memilih berkas Excel (.xlsx) atau Drag & Drop ke sini'}
                  </p>
                  <p className="text-xs text-slate-500">
                    Mendukung format Microsoft Excel <strong>.xlsx</strong>, <strong>.xls</strong>, atau Spreadsheet <strong>.csv</strong>
                  </p>
                </div>
              </div>

              {/* Parsing State */}
              {isProcessing && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-800 text-xs font-bold flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span>Sedang memproses dan memvalidasi lembar kerja Excel...</span>
                </div>
              )}

              {/* Error Notice */}
              {parseError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Parsed Result Preview */}
              {parsedRows.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-slate-200">
                  
                  {/* Summary Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-slate-800">
                        Hasil Pembacaan: <strong className="text-indigo-950">{parsedRows.length} Siswa</strong>
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ {countValid} Valid
                      </span>
                      {countInvalid > 0 && (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-red-100 text-red-800 border border-red-300">
                          ⚠ {countInvalid} Tidak Valid
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded font-black text-[11px]">
                        Kelas VII: {countVII}
                      </span>
                      <span className="bg-teal-100 text-teal-900 px-2 py-0.5 rounded font-black text-[11px]">
                        Kelas VIII: {countVIII}
                      </span>
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-black text-[11px]">
                        Kelas IX: {countIX}
                      </span>
                    </div>
                  </div>

                  {/* Mode Import */}
                  <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-indigo-950">
                      Pilih Metode Penyimpanan ke Database:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <label className={`p-3 rounded-xl border-2 flex items-start gap-2.5 cursor-pointer transition-all ${
                        importMode === 'append' ? 'bg-white border-indigo-600 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-70'
                      }`}>
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'append'}
                          onChange={() => setImportMode('append')}
                          className="mt-0.5"
                        />
                        <div className="text-xs">
                          <strong className="block text-slate-900">Tambahkan (Append)</strong>
                          <span className="text-[11px] text-slate-500">Tambah ke data siswa yang sudah ada.</span>
                        </div>
                      </label>

                      <label className={`p-3 rounded-xl border-2 flex items-start gap-2.5 cursor-pointer transition-all ${
                        importMode === 'merge' ? 'bg-white border-indigo-600 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-70'
                      }`}>
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'merge'}
                          onChange={() => setImportMode('merge')}
                          className="mt-0.5"
                        />
                        <div className="text-xs">
                          <strong className="block text-slate-900">Sinkronkan (Merge)</strong>
                          <span className="text-[11px] text-slate-500">Update bila NISN cocok, tambah jika baru.</span>
                        </div>
                      </label>

                      <label className={`p-3 rounded-xl border-2 flex items-start gap-2.5 cursor-pointer transition-all ${
                        importMode === 'replace' ? 'bg-white border-red-600 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-70'
                      }`}>
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="mt-0.5"
                        />
                        <div className="text-xs">
                          <strong className="block text-red-700">Ganti Semua (Replace)</strong>
                          <span className="text-[11px] text-slate-500">Hapus data lama & ganti data dari Excel.</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Table Preview */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">No</th>
                          <th className="p-2.5">Kolom A (NISN)</th>
                          <th className="p-2.5">Kolom B (NIS)</th>
                          <th className="p-2.5">Kolom C (Nama Lengkap)</th>
                          <th className="p-2.5">Kolom D (Kelas)</th>
                          <th className="p-2.5">Kolom E (Status)</th>
                          <th className="p-2.5">Kolom F (Password)</th>
                          <th className="p-2.5">Kolom G (Link SKL)</th>
                          <th className="p-2.5">Validasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {parsedRows.map((row, idx) => (
                          <tr key={idx} className={row.isValid ? 'hover:bg-slate-50' : 'bg-red-50/50'}>
                            <td className="p-2.5 text-slate-400 font-mono">{idx + 1}</td>
                            <td className="p-2.5 font-mono font-bold text-slate-900">{row.nisn || '-'}</td>
                            <td className="p-2.5 font-mono text-slate-600">{row.nis || '-'}</td>
                            <td className="p-2.5 font-bold text-slate-800">{row.full_name || '-'}</td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                                row.class_name === 'IX' ? 'bg-amber-100 text-amber-900' : row.class_name === 'VIII' ? 'bg-teal-100 text-teal-900' : 'bg-indigo-100 text-indigo-900'
                              }`}>
                                Kelas {row.class_name}
                              </span>
                            </td>
                            <td className="p-2.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                {row.class_name === 'IX' ? row.status : 'AKTIF'}
                              </span>
                            </td>
                            <td className="p-2.5 font-mono text-[11px] text-slate-500">{row.password || 'siswa'}</td>
                            <td className="p-2.5 text-slate-500 max-w-[120px] truncate text-[11px]">
                              {row.skl_custom_url ? 'Tersedia' : '-'}
                            </td>
                            <td className="p-2.5">
                              {row.isValid ? (
                                <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>OK</span>
                                </span>
                              ) : (
                                <span className="text-red-600 font-bold flex items-center gap-1 text-[11px]">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>{row.validationError}</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 2: COLUMN GUIDE & STRUCTURE */}
          {activeTab === 'column_guide' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  Format Isian Spreadsheet Excel (.xlsx) per Kolom
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Berikut adalah urutan posisi kolom baku dari <strong>Kolom A</strong> sampai <strong>Kolom J</strong> yang diproses oleh sistem:
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-indigo-950 text-white font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Posisi Kolom</th>
                      <th className="p-3">Nama Header</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Contoh Isian</th>
                      <th className="p-3">Penjelasan & Format</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {EXCEL_COLUMNS.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-indigo-900 font-mono">
                          <span className="bg-indigo-100 text-indigo-950 px-2 py-0.5 rounded font-black text-xs">
                            Kolom {item.col}
                          </span>
                        </td>
                        <td className="p-3 font-black text-slate-900">{item.name}</td>
                        <td className="p-3">
                          {item.required ? (
                            <span className="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded border border-red-300">
                              WAJIB
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                              Opsional
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-slate-600 text-[11px]">{item.example}</td>
                        <td className="p-3 text-slate-600 text-xs">{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={countValid === 0}
            onClick={handleExecuteImport}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-all ${
              countValid > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Simpan & Import ({countValid} Siswa)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
