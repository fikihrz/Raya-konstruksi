import React, { useState, useEffect } from 'react';
import { FiSave, FiChevronDown, FiChevronUp, FiUpload, FiLock, FiCheckCircle, FiAlertCircle, FiVideo, FiTrash2 } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import { processImageFile } from '../utils/imageUpload';
import { apiFetch } from '../utils/api';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '../utils/imageUrl';

const Section = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 sm:px-6 py-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
      >
        <h3 className="text-sm sm:text-base font-bold text-slate-800 text-left">{title}</h3>
        {open ? <FiChevronUp className="text-slate-400 flex-shrink-0" /> : <FiChevronDown className="text-slate-400 flex-shrink-0" />}
      </button>
      {open && <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">{children}</div>}
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder = '', multiline = false, type = 'text' }: any) => (
  <div>
    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
    {multiline ? (
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none bg-white"
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
      />
    )}
  </div>
);

const ImageField = ({ label, value, fieldKey, onChange }: { label: string; value: string; fieldKey: string; onChange: (key: string, url: string) => void }) => {
  const { showSuccess, showError } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const result = await processImageFile(file, {
        maxSizeMB: 10,
        maxWidth: 1920,
        maxHeight: 1280,
        quality: 0.85
      });

      if (!result.success || !result.dataUrl) {
        showError('Gagal Memproses Gambar', result.error || 'Gambar tidak valid.');
        return;
      }

      onChange(fieldKey, result.dataUrl);
      showSuccess(
        'Gambar Berhasil Diunggah!',
        `Foto "${label}" berhasil diupload (${result.width}x${result.height}px, ${result.compressedSizeKB} KB).`
      );
    } catch (err: any) {
      showError('Gagal Upload', err?.message || 'Terjadi kesalahan saat memproses gambar.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const previewSrc = value ? resolveImageUrl(value) : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="block text-xs sm:text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-[11px] text-slate-400">JPG, PNG, WEBP (Maks 10MB)</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {previewSrc && (
          <div className="relative group flex-shrink-0">
            <img
              src={previewSrc}
              alt="Preview"
              className="w-24 h-16 object-cover rounded-xl border border-slate-200 shadow-sm bg-slate-100"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
              }}
            />
            <button
              type="button"
              onClick={() => onChange(fieldKey, '')}
              className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow transition-colors cursor-pointer"
              title="Hapus gambar"
            >
              <FiTrash2 size={11} />
            </button>
          </div>
        )}
        <label className="cursor-pointer flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 border-2 border-dashed border-slate-300 hover:border-blue-400 text-slate-600 hover:text-blue-600 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all">
          <FiUpload />
          {uploading ? 'Memproses Gambar...' : 'Pilih Gambar Baru'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>
    </div>
  );
};

const getYouTubeEmbedId = (url?: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const VideoField = ({
  label,
  value,
  fieldKey,
  onChange,
  tips
}: {
  label: string;
  value: string;
  fieldKey: string;
  onChange: (key: string, url: string) => void;
  tips?: string;
}) => {
  const { showSuccess, showError } = useToast();
  const [uploading, setUploading] = useState(false);
  const [inputUrl, setInputUrl] = useState(value || '');

  useEffect(() => {
    setInputUrl(value || '');
  }, [value]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExts = ['mp4', 'webm', 'ogg', 'mov'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!validExts.includes(ext) && !file.type.startsWith('video/')) {
      showError('Format Tidak Didukung', 'Harap pilih file video berformat MP4, WebM, atau MOV.');
      return;
    }

    const maxMB = 4.0;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxMB) {
      showError(
        'Ukuran Video Melebihi 4MB',
        'File video Anda berukuran ' + fileSizeMB.toFixed(1) + 'MB. Untuk menjaga kecepatan loading website, upload video lokal dibatasi maksimal 4MB. Jika video Anda berukuran besar, silakan gunakan link YouTube.'
      );
      e.target.value = '';
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onChange(fieldKey, dataUrl);
      setInputUrl(dataUrl);
      showSuccess(
        'Video Berhasil Dimuat!',
        'Video lokal "' + file.name + '" (' + fileSizeMB.toFixed(1) + 'MB) berhasil dipilih dan siap disimpan!'
      );
      setUploading(false);
    };
    reader.onerror = () => {
      showError('Gagal Membaca File', 'Terjadi kesalahan saat membaca file video dari perangkat Anda.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const isDataUrl = typeof value === 'string' && value.startsWith('data:video');
  const ytId = getYouTubeEmbedId(value);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs sm:text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-[11px] text-slate-400">MP4, WebM (Maks 4MB) atau Link YouTube</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-sm">
          <FiUpload size={16} />
          <span>{uploading ? 'Memproses Video...' : 'Pilih File Video dari Komputer / HP'}</span>
          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            onChange={handleVideoUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(fieldKey, '');
              setInputUrl('');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all cursor-pointer"
            title="Hapus video saat ini"
          >
            <FiTrash2 size={13} />
            <span>Hapus Video</span>
          </button>
        )}
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
          ATAU Masukkan Link Video (YouTube URL / MP4 URL Online):
        </label>
        <input
          type="text"
          value={isDataUrl ? '[File Video Lokal Tersimpan]' : inputUrl}
          disabled={isDataUrl}
          onChange={(e) => {
            setInputUrl(e.target.value);
            onChange(fieldKey, e.target.value);
          }}
          placeholder="Misal: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
          className={'w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ' + (isDataUrl ? 'bg-slate-100 text-slate-500 cursor-not-allowed italic' : 'bg-white')}
        />
        {isDataUrl && (
          <p className="text-[11px] text-blue-600 mt-1">
            * File video dari komputer Anda sedang aktif. Klik tombol "Hapus Video" di atas jika ingin mengganti ke link YouTube.
          </p>
        )}
      </div>

      {value && (
        <div className="p-3 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 px-1">
            <span className="font-semibold flex items-center gap-1.5">
              <FiVideo className="text-blue-400" />
              {isDataUrl ? 'Preview File Video Lokal' : ytId ? 'Preview YouTube Video' : 'Preview Video URL'}
            </span>
            <span className="text-[10px] text-slate-400">Loop & Muted</span>
          </div>

          <div className="relative rounded-xl overflow-hidden aspect-video bg-black max-h-56 flex items-center justify-center">
            {ytId ? (
              <iframe
                src={'https://www.youtube.com/embed/' + ytId + '?controls=1&mute=1'}
                className="w-full h-full border-0"
                title="Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <video
                src={value}
                controls
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}

      {tips && (
        <p className="text-xs text-slate-500 leading-relaxed">
          💡 <strong>Tips:</strong> {tips}
        </p>
      )}
    </div>
  );
};

const Settings = () => {
  const { showSuccess, showError } = useToast();
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    apiFetch('/api/data')
      .then(res => res.json())
      .then(data => { setSettings(data.settings || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = (key: string, value: string) => setSettings((prev: any) => ({ ...prev, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await apiFetch('/api/update/settings', {
        method: 'POST',
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Gagal menyimpan ke server');
      setSavedSuccess(true);
      showSuccess('Pengaturan Tersimpan', 'Semua perubahan pengaturan & gambar berhasil disimpan ke database!');
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch {
      showError('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan pengaturan ke server.');
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok' });
      return;
    }

    if (newPassword.length < 6) {
      setPwdMsg({ type: 'error', text: 'Kata sandi minimal 6 karakter' });
      return;
    }

    setPwdLoading(true);

    try {
      const storedUser = localStorage.getItem('admin_user');
      const email = storedUser ? JSON.parse(storedUser).email : 'admin@rayakonstruksi.com';

      const res = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPwdMsg({ type: 'error', text: data.error || 'Gagal mengubah kata sandi' });
      } else {
        setPwdMsg({ type: 'success', text: 'Kata sandi akun admin berhasil diperbarui!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPwdMsg({ type: 'error', text: 'Gagal menghubungi server' });
    }

    setPwdLoading(false);
  };

  if (loading) return <div className="text-slate-500 text-sm py-8 text-center">Memuat data pengaturan...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Pengaturan Lengkap Website</h2>
        <p className="text-slate-500 mt-1 text-xs sm:text-sm leading-relaxed">
          Selaraskan seluruh teks, gambar banner hero, bagian Tentang Kami, judul section, gambar popup, dan info kontak website.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm">
          <FiCheckCircle className="text-emerald-600 flex-shrink-0" size={18} />
          <span>Semua pengaturan berhasil disimpan dan langsung aktif di website!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">

        {/* 1. Hero Section Banners */}
        <Section title="1. Hero Banner Slider (3 Slide Utama)" defaultOpen>
          <div className="space-y-6">
            {/* Slide 1 */}
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/70 px-2.5 py-1 rounded-md">Slide 1</span>
              <Field label="Tagline Label Atas (Badge)" value={settings.heroTag1} onChange={(v: string) => set('heroTag1', v)} placeholder="ARSITEKTUR & DESAIN" />
              <Field label="Judul Utama Slide 1" value={settings.heroTitle} onChange={(v: string) => set('heroTitle', v)} placeholder="Membangun Masa Depan Presisi & Berkualitas" />
              <Field label="Deskripsi / Sub-judul Slide 1" value={settings.heroDesc} onChange={(v: string) => set('heroDesc', v)} placeholder="Deskripsi singkat slide 1..." multiline />
              <ImageField label="Foto Background Slide 1" value={settings.heroImage} fieldKey="heroImage" onChange={set} />
            </div>

            {/* Slide 2 */}
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/70 px-2.5 py-1 rounded-md">Slide 2</span>
              <Field label="Tagline Label Atas (Badge)" value={settings.heroTag2} onChange={(v: string) => set('heroTag2', v)} placeholder="PENGEMBANGAN KOMERSIAL" />
              <Field label="Judul Utama Slide 2" value={settings.heroTitle2} onChange={(v: string) => set('heroTitle2', v)} placeholder="Konstruksi Megah Komersial & Perkantoran" />
              <Field label="Deskripsi / Sub-judul Slide 2" value={settings.heroDesc2} onChange={(v: string) => set('heroDesc2', v)} placeholder="Deskripsi singkat slide 2..." multiline />
              <ImageField label="Foto Background Slide 2" value={settings.heroImage2} fieldKey="heroImage2" onChange={set} />
            </div>

            {/* Slide 3 */}
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/70 px-2.5 py-1 rounded-md">Slide 3</span>
              <Field label="Tagline Label Atas (Badge)" value={settings.heroTag3} onChange={(v: string) => set('heroTag3', v)} placeholder="INFRASTRUKTUR INDUSTRI" />
              <Field label="Judul Utama Slide 3" value={settings.heroTitle3} onChange={(v: string) => set('heroTitle3', v)} placeholder="Infrastruktur Vital & Fabrikasi Industri" />
              <Field label="Deskripsi / Sub-judul Slide 3" value={settings.heroDesc3} onChange={(v: string) => set('heroDesc3', v)} placeholder="Deskripsi singkat slide 3..." multiline />
              <ImageField label="Foto Background Slide 3" value={settings.heroImage3} fieldKey="heroImage3" onChange={set} />
            </div>
          </div>
        </Section>

        {/* 2. About Section & Video Showcase */}
        <Section title="2. Tentang Kami & Video Showcase (About Us)" defaultOpen>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                <FiVideo size={18} />
                <span>Video Showcase Tentang Kami</span>
              </div>
              <VideoField
                label="Video Profil Perusahaan"
                value={settings.aboutVideo}
                fieldKey="aboutVideo"
                onChange={set}
                tips="Video ini ditampilkan di kolom kiri section Tentang Kami. Bisa upload video lokal atau masukkan link YouTube."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Judul Kiri (Di Atas Video)" value={settings.aboutHeading} onChange={(v: string) => set('aboutHeading', v)} placeholder="Tentang Kami" />
              <Field label="Heading Kanan (Nama Perusahaan)" value={settings.aboutTitle} onChange={(v: string) => set('aboutTitle', v)} placeholder="Raya Konstruksi Jaya" />
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">4 Poin Keunggulan Tentang Kami (Grid 2x2)</h4>
                <span className="text-[11px] text-slate-400">Kosongkan untuk memakai teks bawaan website</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                  <span className="text-[11px] font-bold text-blue-600 uppercase">Poin 1</span>
                  <Field label="Judul Poin 1" value={settings.aboutFeature1Title} onChange={(v: string) => set('aboutFeature1Title', v)} placeholder="Presisi Arsitektur" />
                  <Field label="Deskripsi Poin 1" value={settings.aboutFeature1Desc} onChange={(v: string) => set('aboutFeature1Desc', v)} placeholder="Perencanaan matang dari gambar kerja hingga finishing." multiline />
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                  <span className="text-[11px] font-bold text-blue-600 uppercase">Poin 2</span>
                  <Field label="Judul Poin 2" value={settings.aboutFeature2Title} onChange={(v: string) => set('aboutFeature2Title', v)} placeholder="Tepat Waktu" />
                  <Field label="Deskripsi Poin 2" value={settings.aboutFeature2Desc} onChange={(v: string) => set('aboutFeature2Desc', v)} placeholder="Manajemen jadwal terukur dan laporan progres jelas." multiline />
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                  <span className="text-[11px] font-bold text-blue-600 uppercase">Poin 3</span>
                  <Field label="Judul Poin 3" value={settings.aboutFeature3Title} onChange={(v: string) => set('aboutFeature3Title', v)} placeholder="Standar Mutu & K3" />
                  <Field label="Deskripsi Poin 3" value={settings.aboutFeature3Desc} onChange={(v: string) => set('aboutFeature3Desc', v)} placeholder="Prioritas keselamatan kerja dan material teruji." multiline />
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                  <span className="text-[11px] font-bold text-blue-600 uppercase">Poin 4</span>
                  <Field label="Judul Poin 4" value={settings.aboutFeature4Title} onChange={(v: string) => set('aboutFeature4Title', v)} placeholder="Konstruksi Kokoh" />
                  <Field label="Deskripsi Poin 4" value={settings.aboutFeature4Desc} onChange={(v: string) => set('aboutFeature4Desc', v)} placeholder="Bangunan berdaya tahan tinggi untuk investasi jangka panjang." multiline />
                </div>
              </div>

              <Field label="Teks Tombol CTA Tentang Kami (Mengarah ke Layanan)" value={settings.aboutCtaText} onChange={(v: string) => set('aboutCtaText', v)} placeholder="Jelajahi Layanan" />
            </div>
          </div>
        </Section>

        {/* 3. Section Titles & Descriptions */}
        <Section title="3. Judul & Deskripsi Bagian Lain (Headings)">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-600 uppercase">Kenapa Memilih Kami (Why Us)</span>
              <Field label="Judul Section" value={settings.whyTitle} onChange={(v: string) => set('whyTitle', v)} placeholder="Kenapa Memilih Kami?" />
              <Field label="Deskripsi Section" value={settings.whyDesc} onChange={(v: string) => set('whyDesc', v)} multiline />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-600 uppercase">Bidang Keahlian / Layanan</span>
              <Field label="Judul Section" value={settings.servicesTitle} onChange={(v: string) => set('servicesTitle', v)} placeholder="Bidang Keahlian Kami" />
              <Field label="Deskripsi Section" value={settings.servicesDesc} onChange={(v: string) => set('servicesDesc', v)} multiline />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-600 uppercase">Portofolio Proyek</span>
              <Field label="Judul Section" value={settings.projectsTitle} onChange={(v: string) => set('projectsTitle', v)} placeholder="Mahakarya Arsitektur" />
              <Field label="Deskripsi Section" value={settings.projectsDesc} onChange={(v: string) => set('projectsDesc', v)} placeholder="Eksplorasi portofolio karya arsitektur dan konstruksi presisi tinggi yang telah kami selesaikan." multiline />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-600 uppercase">Ulasan Klien & Mitra</span>
              <Field label="Judul Utama Ulasan" value={settings.clientsTitle} onChange={(v: string) => set('clientsTitle', v)} placeholder="Dipercaya Oleh Klien & Mitra Industri" />
              <Field label="Deskripsi Section Ulasan" value={settings.clientsDesc} onChange={(v: string) => set('clientsDesc', v)} placeholder="Pengalaman nyata para pemilik proyek dan mitra usaha yang bekerja sama dengan kami." multiline />
              <Field label="Label Baris Logo Perusahaan Mitra" value={settings.clientsTickerTitle} onChange={(v: string) => set('clientsTickerTitle', v)} placeholder="Dipercaya Oleh Berbagai Perusahaan Terkemuka:" />
            </div>
          </div>
        </Section>

        {/* 4. Gambar Popup / Modal Website */}
        <Section title="4. Gambar Popup / Modal Website">
          <div className="space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              Gambar ini akan ditampilkan pada popup email, popup konsultasi layanan, dan popup tulis ulasan di website. Upload gambar yang menampilkan proyek atau kegiatan konstruksi perusahaan.
            </p>
            <ImageField
              label="Gambar Header Popup Website"
              value={settings.popupImage}
              fieldKey="popupImage"
              onChange={set}
            />
          </div>
        </Section>

        {/* 5. Informasi Kontak & Perusahaan */}
        <Section title="5. Informasi Kontak & Perusahaan">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 block">Tipe Background Banner Kontak</span>
                  <span className="text-[11px] text-slate-400">Pilih apakah banner kontak menggunakan gambar atau video</span>
                </div>
                <div className="inline-flex p-1 bg-slate-200/80 rounded-xl gap-1 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => set('contactBgType', 'image')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      (settings.contactBgType || 'image') !== 'video'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Gambar
                  </button>
                  <button
                    type="button"
                    onClick={() => set('contactBgType', 'video')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      settings.contactBgType === 'video'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Video
                  </button>
                </div>
              </div>

              {settings.contactBgType === 'video' ? (
                <div className="space-y-4 pt-2 border-t border-slate-200/60">
                  <VideoField
                    label="Video Background Banner Kontak"
                    value={settings.contactVideo}
                    fieldKey="contactVideo"
                    onChange={set}
                    tips="Video akan otomatis diputar berulang-ulang tanpa suara (loop, muted, autoplay) sebagai latar belakang banner kontak."
                  />
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-200/60">
                  <ImageField
                    label="Gambar Background Banner Kontak"
                    value={settings.contactImage}
                    fieldKey="contactImage"
                    onChange={set}
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 block">Tingkat Kegelapan Overlay Background</span>
                  <span className="text-[11px] text-slate-400">Atur seberapa terang/jelas video atau gambar latar belakang kontak</span>
                </div>
                <select
                  value={settings.contactOverlayOpacity ?? '35'}
                  onChange={(e) => set('contactOverlayOpacity', e.target.value)}
                  className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="20">Sangat Jelas & Terang (20% Gelap)</option>
                  <option value="35">Jelas & Kontras Seimbang (35% Gelap) - Rekomendasi</option>
                  <option value="50">Sedang (50% Gelap)</option>
                  <option value="70">Cukup Gelap (70% Gelap)</option>
                  <option value="90">Sangat Gelap (90% Gelap)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Judul Kontak" value={settings.contactTitle} onChange={(v: string) => set('contactTitle', v)} placeholder="Siap Memulai Proyek Anda?" />
              <Field label="Nama Resmi Perusahaan" value={settings.companyName} onChange={(v: string) => set('companyName', v)} placeholder="Raya Konstruksi Jaya" />
            </div>
            <Field label="Deskripsi Kontak" value={settings.contactDesc} onChange={(v: string) => set('contactDesc', v)} multiline />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Field label="Nomor WhatsApp Resmi (tanpa +)" value={settings.whatsappNumber} onChange={(v: string) => set('whatsappNumber', v)} placeholder="6281234567890" type="tel" />
              <Field label="Alamat Email Resmi" value={settings.emailAddress} onChange={(v: string) => set('emailAddress', v)} placeholder="contact@rayakonstruksi.com" type="email" />
              <Field label="Akun Instagram (tanpa @)" value={settings.instagram} onChange={(v: string) => set('instagram', v)} placeholder="rayakonstruksijaya" />
              <Field label="Akun TikTok (tanpa @)" value={settings.tiktok} onChange={(v: string) => set('tiktok', v)} placeholder="rayakonstruksijaya" />
              <Field label="Slogan / Brand Tagline (Footer)" value={settings.brandTagline} onChange={(v: string) => set('brandTagline', v)} placeholder="Membangun Keunggulan Mutu" />
              <Field label="Alamat Kantor Pusat" value={settings.companyAddress} onChange={(v: string) => set('companyAddress', v)} placeholder="Surakarta, Jawa Tengah, Indonesia" />
              <Field label="Link Google Maps (Buka Peta)" value={settings.mapsUrl} onChange={(v: string) => set('mapsUrl', v)} placeholder="https://maps.app.goo.gl/RZbeLE6SmbqKgyN78" />
              <Field label="Link Embed Google Maps (Iframe)" value={settings.mapsEmbedUrl} onChange={(v: string) => set('mapsEmbedUrl', v)} placeholder="https://maps.google.com/maps?q=-7.5017637,111.0782002+(Raya+Konstruksi)&t=&z=16&ie=UTF8&iwloc=&output=embed" />
            </div>
          </div>
        </Section>

        {/* Sticky Save All Changes Bar */}
        <div className="sticky bottom-3 sm:bottom-4 z-20 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/30 text-xs sm:text-base cursor-pointer"
          >
            <FiSave size={18} />
            <span>{saving ? 'Menyimpan Perubahan...' : 'Simpan Semua Perubahan Konten'}</span>
          </button>
        </div>
      </form>

      {/* 6. Change Password Form (Secure) */}
      <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
          <FiLock className="text-blue-600" />
          <span>Keamanan: Ganti Kata Sandi Akun Admin</span>
        </div>

        {pwdMsg && (
          <div className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            pwdMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {pwdMsg.type === 'success' ? <FiCheckCircle className="flex-shrink-0" /> : <FiAlertCircle className="flex-shrink-0" />}
            <span>{pwdMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Konfirmasi Sandi Baru</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Ulangi sandi baru"
                className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwdLoading}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {pwdLoading ? 'Memproses...' : 'Perbarui Kata Sandi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
