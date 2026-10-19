import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiStar, FiMessageSquare } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

interface ReviewItem {
  id: number;
  name: string;
  company: string;
  role: string;
  projectType: string;
  rating: number;
  review: string;
  date: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ReviewItem>>({});
  const [saving, setSaving] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API}/api/data`);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let updated: ReviewItem[];

    if (editingId === 0) {
      // Add new
      const newReview: ReviewItem = {
        id: Date.now(),
        name: formData.name || '',
        company: formData.company || '',
        role: formData.role || '',
        projectType: formData.projectType || 'Residensial',
        rating: Number(formData.rating) || 5,
        review: formData.review || '',
        date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
      };
      updated = [newReview, ...reviews];
    } else {
      // Update existing
      updated = reviews.map(r => r.id === editingId ? { ...r, ...formData } as ReviewItem : r);
    }

    try {
      await fetch(`${API}/api/update/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setReviews(updated);
      setEditingId(null);
    } catch (err) {
      alert('Gagal menyimpan ulasan');
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) return;
    const updated = reviews.filter(r => r.id !== id);
    try {
      await fetch(`${API}/api/update/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setReviews(updated);
    } catch (err) {
      alert('Gagal menghapus ulasan');
    }
  };

  if (loading) return <div className="text-slate-500 text-sm py-8 text-center">Loading ulasan klien...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Manajemen Ulasan & Testimoni</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Kelola dan moderasi ulasan testimoni klien yang tampil di halaman depan website.</p>
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
              review: ''
            });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 text-sm font-semibold whitespace-nowrap"
        >
          <FiPlus /> <span>Tambah Testimoni</span>
        </button>
      </div>

      {/* Form Modal / Panel */}
      {editingId !== null && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">
              {editingId === 0 ? 'Tambah Testimoni Baru' : 'Edit Testimoni'}
            </h3>
            <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600 p-1">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Klien / Tokoh *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Ir. Budi Santoso"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Perusahaan / Instansi</label>
                <input
                  type="text"
                  placeholder="Misal: PT Waskita Karya (Persero)"
                  value={formData.company || ''}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Jabatan / Peran</label>
                <input
                  type="text"
                  placeholder="Misal: Project Manager / Owner"
                  value={formData.role || ''}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori Proyek</label>
                <select
                  value={formData.projectType || 'Residensial'}
                  onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Residensial">Residensial / Villa</option>
                  <option value="Komersial">Komersial / Kantor</option>
                  <option value="Infrastruktur">Infrastruktur / Pabrik</option>
                  <option value="Industri">Industri</option>
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
                      className="p-1 text-2xl transition-transform hover:scale-110"
                    >
                      <FaStar className={(formData.rating || 5) >= star ? 'text-amber-400' : 'text-slate-300'} />
                    </button>
                  ))}
                  <span className="text-xs text-slate-500 font-semibold ml-2">
                    {formData.rating || 5} dari 5 Bintang
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
                  className="w-full border border-slate-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
              >
                <FiSave /> {saving ? 'Menyimpan...' : 'Simpan Ulasan'}
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{item.name}</h4>
                  <p className="text-xs text-slate-500">{item.role ? `${item.role}, ` : ''}{item.company}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  {item.projectType || 'Konstruksi'}
                </span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {Array.from({ length: item.rating || 5 }).map((_, i) => (
                  <FaStar key={i} />
                ))}
                <span className="text-slate-400 text-[10px] ml-1">({item.rating || 5}/5)</span>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic line-clamp-4">
                "{item.review}"
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">{item.date || 'Testimoni Resmi'}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingId(item.id);
                    setFormData(item);
                  }}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
