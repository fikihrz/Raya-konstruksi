import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiUploadCloud, FiImage, FiSearch } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { apiFetch } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { processImageFile } from '../utils/imageUpload';
import { resolveImageUrl } from '../utils/imageUrl';

interface ReviewItem {
  id: number;
  name: string;
  company: string;
  role: string;
  projectType: string;
  rating: number;
  review: string;
  avatar?: string;
  date: string;
}

const Reviews = () => {
  const { showSuccess, showError } = useToast();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ReviewItem>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  const fetchReviews = async () => {
    try {
      const res = await apiFetch('/api/data');
      const data = await res.json();
      setReviews(data.reviews || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);

    try {
      const result = await processImageFile(file, {
        maxSizeMB: 10,
        maxWidth: 360,
        maxHeight: 360,
        quality: 0.82
      });

      if (!result.success || !result.dataUrl) {
        showError('Gagal Memproses Foto', result.error || 'Foto profil tidak valid.');
        return;
      }

      setFormData(prev => ({ ...prev, avatar: result.dataUrl }));
      showSuccess(
        'Foto Profil Berhasil Dimuat',
        `Foto profil siap digunakan (${result.width}x${result.height}px, ${result.compressedSizeKB} KB). Klik Simpan Ulasan untuk menerapkan.`
      );
    } catch (err: any) {
      showError('Gagal Upload Foto', err?.message || 'Terjadi kesalahan saat memproses foto.');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.review?.trim()) {
      showError('Gagal Menyimpan', 'Nama dan ulasan wajib diisi.');
      return;
    }

    setSaving(true);
    let updated: ReviewItem[];

    if (editingId === 0) {
      const newReview: ReviewItem = {
        id: Date.now(),
        name: formData.name.trim(),
        company: formData.company?.trim() || 'Klien Privat',
        role: formData.role?.trim() || 'Owner Proyek',
        projectType: formData.projectType || 'Residensial',
        rating: Number(formData.rating) || 5,
        review: formData.review.trim(),
        avatar: formData.avatar?.trim() || '',
        date: formData.date?.trim() || new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
      };
      updated = [newReview, ...reviews];
    } else {
      updated = reviews.map(r => r.id === editingId ? {
        ...r,
        ...formData,
        name: formData.name?.trim() || r.name,
        company: formData.company?.trim() || 'Klien Privat',
        role: formData.role?.trim() || '',
        review: formData.review?.trim() || r.review,
        avatar: formData.avatar?.trim() || '',
        rating: Number(formData.rating) || 5
      } as ReviewItem : r);
    }

    try {
      const res = await apiFetch('/api/update/reviews', {
        method: 'POST',
        body: JSON.stringify(updated)
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Gagal menyimpan ulasan ke database');
      }
      setReviews(updated);
      setEditingId(null);
      showSuccess('Berhasil Disimpan', 'Ulasan & foto profil klien berhasil diperbarui!');
    } catch (err: any) {
      showError('Gagal Menyimpan', err?.message || 'Terjadi kesalahan saat menyimpan ulasan.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) return;
    const updated = reviews.filter(r => r.id !== id);
    try {
      const res = await apiFetch('/api/update/reviews', {
        method: 'POST',
        body: JSON.stringify(updated)
      });
      if (!res.ok) {
        throw new Error('Gagal menghapus ulasan dari database');
      }
      setReviews(updated);
      showSuccess('Ulasan Dihapus', 'Data ulasan berhasil dihapus.');
    } catch (err: any) {
      showError('Gagal Menghapus', err?.message || 'Terjadi kesalahan saat menghapus ulasan.');
    }
  };

  const filteredReviews = reviews.filter(item => {
    const matchCat = filterCat === 'All' || (item.projectType || '').toLowerCase().includes(filterCat.toLowerCase());
    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q ||
      (item.name || '').toLowerCase().includes(q) ||
      (item.company || '').toLowerCase().includes(q) ||
      (item.role || '').toLowerCase().includes(q) ||
      (item.review || '').toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (loading) return <div className="text-slate-500 text-sm py-8 text-center">Memuat ulasan klien...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Manajemen Ulasan & Testimoni</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Kelola ulasan klien dan atur foto profil pemberi ulasan yang tampil pada carousel halaman depan.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(0);
            setFormData({
              name: '',
              company: '',
              role: '',
              projectType: 'Residensial',
              rating: 5,
              review: '',
              avatar: ''
            });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 text-sm font-semibold whitespace-nowrap cursor-pointer"
        >
          <FiPlus /> <span>Tambah Testimoni</span>
        </button>
      </div>

      {/* Form Modal / Panel */}
      {editingId !== null && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">
              {editingId === 0 ? 'Tambah Testimoni Baru' : 'Edit Testimoni & Foto Profil'}
            </h3>
            <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left: Circular Avatar Photo Uploader */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Foto Profil Klien</span>
                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 border-2 border-blue-500 shadow-md flex items-center justify-center">
                  {formData.avatar ? (
                    <img
                      src={resolveImageUrl(formData.avatar)}
                      alt={formData.name || 'Avatar Preview'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                      {formData.name ? formData.name.trim().charAt(0).toUpperCase() : 'K'}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <label className="cursor-pointer bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-400 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all">
                    <FiUploadCloud size={15} className="text-blue-600" />
                    <span>{uploadingAvatar ? 'Memproses...' : 'Upload Foto'}</span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploadingAvatar} />
                  </label>

                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: '' })}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <FiTrash2 size={13} />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>

                <div className="w-full pt-1">
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Atau Link Foto (Opsional)</label>
                  <div className="relative">
                    <FiImage className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    <input
                      type="text"
                      value={formData.avatar?.startsWith('data:') ? '' : (formData.avatar || '')}
                      onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder={formData.avatar?.startsWith('data:') ? '[Foto Lokal Terupload]' : 'https://...'}
                      className="w-full border border-slate-300 bg-white pl-8 pr-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Review Details */}
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Klien / Tokoh *</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Ir. Budi Santoso"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Perusahaan / Instansi</label>
                  <input
                    type="text"
                    placeholder="Misal: PT Waskita Karya (Persero)"
                    value={formData.company || ''}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full border border-slate-300 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Jabatan / Peran</label>
                  <input
                    type="text"
                    placeholder="Misal: Project Manager / Business Owner"
                    value={formData.role || ''}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full border border-slate-300 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori Proyek</label>
                  <select
                    value={formData.projectType || 'Residensial'}
                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full border border-slate-300 px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Residensial">Residensial / Villa</option>
                    <option value="Komersial">Komersial / Kantor</option>
                    <option value="Industri">Industri / Gudang</option>
                    <option value="Infrastruktur">Infrastruktur Sipil</option>
                    <option value="Renovasi">Renovasi & Fabrikasi</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Rating Bintang (1 - 5)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                      >
                        <FaStar className={(formData.rating || 5) >= star ? 'text-amber-400' : 'text-slate-300'} />
                      </button>
                    ))}
                    <span className="text-xs text-slate-500 font-semibold ml-2">
                      {(Number(formData.rating) || 5).toFixed(1)} dari 5.0
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Isi Ulasan / Testimoni *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tulis testimoni lengkap pengalaman klien..."
                    value={formData.review || ''}
                    onChange={e => setFormData({ ...formData, review: e.target.value })}
                    className="w-full border border-slate-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving || uploadingAvatar}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <FiSave /> {saving ? 'Menyimpan...' : 'Simpan Ulasan'}
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama klien, perusahaan, atau ulasan..."
            className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Residensial', 'Komersial', 'Industri', 'Infrastruktur', 'Renovasi'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                filterCat === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Cards Grid */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          Tidak ada ulasan yang sesuai dengan filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReviews.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      {item.avatar ? (
                        <img
                          src={resolveImageUrl(item.avatar)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                          {item.name ? item.name.charAt(0).toUpperCase() : 'K'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{item.role ? `${item.role}, ` : ''}{item.company}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex-shrink-0">
                    {item.projectType || 'Konstruksi'}
                  </span>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                  <span className="text-slate-600 font-semibold text-xs ml-1.5">
                    {(Number(item.rating) || 5).toFixed(1)}
                  </span>
                  {!item.avatar && (
                    <span className="ml-auto text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Belum ada foto
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-4">
                  "{item.review}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">{item.date || 'Testimoni Resmi'}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setFormData(item);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors cursor-pointer"
                    title="Edit & Upload Foto Profil"
                  >
                    <FiEdit2 size={14} />
                    <span>Edit / Foto</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
