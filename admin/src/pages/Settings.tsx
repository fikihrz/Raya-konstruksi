import React, { useState, useEffect } from 'react';
import { FiSave, FiChevronDown, FiChevronUp, FiUpload } from 'react-icons/fi';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Section = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        {open ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
      </button>
      {open && <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">{children}</div>}
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder = '', multiline = false, type = 'text' }: any) => (
  <div>
    <label className="block text-sm font-semibold text-slate-600 mb-1.5">{label}</label>
    {multiline ? (
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
    )}
  </div>
);

const ImageField = ({ label, value, fieldKey, onChange }: { label: string; value: string; fieldKey: string; onChange: (key: string, url: string) => void }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${API}/api/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) onChange(fieldKey, data.url);
    } catch {
      alert('Gagal upload gambar');
    }
    setUploading(false);
  };

  const previewSrc = value 
    ? (value.startsWith('http') ? value : encodeURI(value.startsWith('/') ? value : '/' + value))
    : null;

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-1.5">{label}</label>
      <div className="flex items-center gap-4">
        {previewSrc && (
          <img src={previewSrc} alt="Preview" className="w-24 h-16 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
        )}
        <label className="cursor-pointer flex items-center gap-2 bg-slate-100 hover:bg-blue-50 border-2 border-dashed border-slate-300 hover:border-blue-400 text-slate-600 hover:text-blue-600 rounded-lg px-4 py-2.5 text-sm font-medium transition-all">
          <FiUpload />
          {uploading ? 'Mengupload...' : 'Pilih Gambar Baru'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>
    </div>
  );
};

const Settings = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/data`)
      .then(res => res.json())
      .then(data => { setSettings(data.settings || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = (key: string, value: string) => setSettings((prev: any) => ({ ...prev, [key]: value }));

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await fetch(`${API}/api/update/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      alert('Gagal menyimpan pengaturan');
    }
    setSaving(false);
  };

  if (loading) return <div className="text-slate-500 text-sm py-8 text-center">Loading pengaturan...</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Pengaturan Website</h2>
        <p className="text-slate-500 mt-1 text-sm">Ubah semua teks, gambar, dan informasi kontak di seluruh website. Klik "Simpan Semua" setelah selesai mengedit.</p>
      </div>

      {savedSuccess && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium transition-all">
          Pengaturan berhasil disimpan.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">

        {/* Hero Section Banners (Slider 3 Slide) */}
        <Section title="Hero Banner Slider (Halaman Utama)" defaultOpen>
          <div className="space-y-6">
            {/* Slide 1 */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">Banner Slide 1</span>
              <ImageField label="Foto Background Slide 1" value={settings.heroImage} fieldKey="heroImage" onChange={set} />
              <Field label="Judul Utama Slide 1" value={settings.heroTitle} onChange={(v: string) => set('heroTitle', v)} placeholder="Misal: Membangun Masa Depan Presisi & Berkualitas" />
              <Field label="Deskripsi / Sub-judul Slide 1" value={settings.heroDesc} onChange={(v: string) => set('heroDesc', v)} placeholder="Deskripsi singkat slide 1..." multiline />
            </div>

            {/* Slide 2 */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">Banner Slide 2</span>
              <ImageField label="Foto Background Slide 2" value={settings.heroImage2} fieldKey="heroImage2" onChange={set} />
              <Field label="Judul Utama Slide 2" value={settings.heroTitle2} onChange={(v: string) => set('heroTitle2', v)} placeholder="Misal: Konstruksi Megah Komersial & Perkantoran" />
              <Field label="Deskripsi / Sub-judul Slide 2" value={settings.heroDesc2} onChange={(v: string) => set('heroDesc2', v)} placeholder="Deskripsi singkat slide 2..." multiline />
            </div>

            {/* Slide 3 */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">Banner Slide 3</span>
              <ImageField label="Foto Background Slide 3" value={settings.heroImage3} fieldKey="heroImage3" onChange={set} />
              <Field label="Judul Utama Slide 3" value={settings.heroTitle3} onChange={(v: string) => set('heroTitle3', v)} placeholder="Misal: Infrastruktur Vital & Fabrikasi Industri" />
              <Field label="Deskripsi / Sub-judul Slide 3" value={settings.heroDesc3} onChange={(v: string) => set('heroDesc3', v)} placeholder="Deskripsi singkat slide 3..." multiline />
            </div>
          </div>
        </Section>

        {/* About Section */}
        <Section title="Tentang Kami (About Section)">
          <div className="grid grid-cols-2 gap-4">
            <ImageField label="Foto Kiri (Besar)" value={settings.aboutImage1} fieldKey="aboutImage1" onChange={set} />
            <ImageField label="Foto Kanan (Kecil)" value={settings.aboutImage2} fieldKey="aboutImage2" onChange={set} />
          </div>
          <Field label="Badge Label" value={settings.aboutBadge} onChange={(v: string) => set('aboutBadge', v)} placeholder="Behind The Blueprint" />
          <Field label="Nama Perusahaan (Heading)" value={settings.aboutTitle} onChange={(v: string) => set('aboutTitle', v)} placeholder="Raya Konstruksi" />
          <Field label="Cerita Perusahaan (Paragraf 1)" value={settings.aboutStory} onChange={(v: string) => set('aboutStory', v)} multiline />
          <Field label="Cerita Perusahaan (Paragraf 2)" value={settings.aboutStory2} onChange={(v: string) => set('aboutStory2', v)} multiline />
          <Field label="Judul Visi" value={settings.visionTitle} onChange={(v: string) => set('visionTitle', v)} placeholder="Pioneering Sustainable Horizons" />
          <Field label="Isi Visi" value={settings.visionDesc} onChange={(v: string) => set('visionDesc', v)} multiline />
          <Field label="Misi Poin 1" value={settings.mission1} onChange={(v: string) => set('mission1', v)} multiline />
          <Field label="Misi Poin 2" value={settings.mission2} onChange={(v: string) => set('mission2', v)} multiline />
          <Field label="Misi Poin 3" value={settings.mission3} onChange={(v: string) => set('mission3', v)} multiline />
        </Section>

        {/* Why Choose Us */}
        <Section title="Kenapa Memilih Kami (Why Choose Us)">
          <Field label="Judul Section" value={settings.whyTitle} onChange={(v: string) => set('whyTitle', v)} placeholder="Kenapa Memilih Kami?" />
          <Field label="Deskripsi Section" value={settings.whyDesc} onChange={(v: string) => set('whyDesc', v)} multiline />
          <p className="text-xs text-slate-400 bg-slate-50 rounded p-2">Untuk mengedit kartu alasan (nomor, judul, isi), pergi ke menu <strong>Reasons</strong> di sidebar.</p>
        </Section>

        {/* Services Section */}
        <Section title="Layanan (Services Section)">
          <Field label="Judul Section Layanan" value={settings.servicesTitle} onChange={(v: string) => set('servicesTitle', v)} placeholder="Bidang Keahlian Kami" />
          <Field label="Deskripsi Section Layanan" value={settings.servicesDesc} onChange={(v: string) => set('servicesDesc', v)} multiline />
          <p className="text-xs text-slate-400 bg-slate-50 rounded p-2">Untuk mengedit kartu layanan (gambar, judul, deskripsi), pergi ke menu <strong>Services</strong> di sidebar.</p>
        </Section>

        {/* Clients Section */}
        <Section title="Klien & Mitra (Clients Section)">
          <Field label="Judul Section Klien" value={settings.clientsTitle} onChange={(v: string) => set('clientsTitle', v)} placeholder="Klien & Mitra Kami" />
          <Field label="Deskripsi Section Klien" value={settings.clientsDesc} onChange={(v: string) => set('clientsDesc', v)} multiline />
        </Section>

        {/* Contact Section */}
        <Section title="Kontak (Contact Section)">
          <ImageField label="Gambar Background Kontak" value={settings.contactImage} fieldKey="contactImage" onChange={set} />
          <Field label="Judul Kontak" value={settings.contactTitle} onChange={(v: string) => set('contactTitle', v)} placeholder="Siap Memulai Proyek Anda?" />
          <Field label="Deskripsi Kontak" value={settings.contactDesc} onChange={(v: string) => set('contactDesc', v)} multiline />
        </Section>

        {/* Company Info */}
        <Section title="Informasi Perusahaan">
          <Field label="Nama Perusahaan" value={settings.companyName} onChange={(v: string) => set('companyName', v)} placeholder="Raya Konstruksi" />
          <Field label="Nomor WhatsApp (tanpa +)" value={settings.whatsappNumber} onChange={(v: string) => set('whatsappNumber', v)} placeholder="6281234567890" type="tel" />
          <Field label="Alamat Email" value={settings.emailAddress} onChange={(v: string) => set('emailAddress', v)} placeholder="contact@rayakonstruksi.com" type="email" />
          <Field label="Akun Instagram (misal: rayakonstruksi atau link)" value={settings.instagram} onChange={(v: string) => set('instagram', v)} placeholder="rayakonstruksi" />
          <Field label="Alamat Kantor" value={settings.companyAddress} onChange={(v: string) => set('companyAddress', v)} placeholder="Surakarta, Indonesia" />
        </Section>

        {/* Save Button */}
        <div className="sticky bottom-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
          >
            <FiSave />
            {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
