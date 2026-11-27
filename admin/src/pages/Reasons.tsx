import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';
import { apiFetch } from '../utils/api';
import { useToast } from '../context/ToastContext';

const Reasons = () => {
  const { showSuccess, showError } = useToast();
  const [reasons, setReasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch('/api/data')
      .then(res => res.json())
      .then(data => { setReasons(data.reasons || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const save = async (updated: any[]) => {
    const res = await apiFetch('/api/update/reasons', {
      method: 'POST',
      body: JSON.stringify(updated)
    });
    if (!res.ok) throw new Error('Gagal menyimpan data ke server');
  };

  const handleSave = async () => {
    if (!formData.title?.trim() || !formData.desc?.trim()) {
      showError('Gagal Menyimpan', 'Judul dan deskripsi keunggulan wajib diisi.');
      return;
    }

    setSaving(true);
    const updated = editingId === 0
      ? [...reasons, { ...formData, id: Date.now(), number: formData.number?.trim() || `0${reasons.length + 1}` }]
      : reasons.map(r => r.id === editingId ? formData : r);

    try {
      await save(updated);
      setReasons(updated);
      setEditingId(null);
      showSuccess('Berhasil Disimpan', `Keunggulan "${formData.title}" berhasil diperbarui.`);
    } catch (err: any) {
      showError('Gagal Menyimpan', err?.message || 'Terjadi kesalahan saat menyimpan data.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus poin keunggulan ini?')) return;
    const updated = reasons.filter(r => r.id !== id);
    try {
      await save(updated);
      setReasons(updated);
      showSuccess('Berhasil Dihapus', 'Poin keunggulan telah dihapus.');
    } catch (err: any) {
      showError('Gagal Menghapus', err?.message || 'Terjadi kesalahan saat menghapus data.');
    }
  };

  if (loading) return <div className="text-slate-500 text-sm py-8 text-center">Memuat data keunggulan...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Kenapa Memilih Kami</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Kelola kartu poin keunggulan yang tampil pada section "Kenapa Memilih Kami".</p>
        </div>
        <button
          onClick={() => { setEditingId(0); setFormData({ number: `0${reasons.length + 1}`, title: '', desc: '' }); }}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-semibold shadow-sm cursor-pointer"
        >
          <FiPlus /> <span>Tambah Keunggulan</span>
        </button>
      </div>

      {editingId !== null && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">{editingId === 0 ? 'Tambah Keunggulan Baru' : 'Edit Keunggulan'}</h3>
            <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <FiX size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nomor Urut (misal: 01)</label>
              <input
                type="text"
                value={formData.number || ''}
                onChange={e => setFormData({ ...formData, number: e.target.value })}
                className="border border-slate-300 px-3 py-2.5 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul Keunggulan *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="border border-slate-300 px-3 py-2.5 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Misal: Keunggulan Arsitektur"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Deskripsi *</label>
              <textarea
                value={formData.desc || ''}
                onChange={e => setFormData({ ...formData, desc: e.target.value })}
                className="border border-slate-300 p-3 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Jelaskan nilai keunggulan..."
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-semibold shadow-sm cursor-pointer"
            >
              <FiSave /> {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="flex-1 sm:flex-none justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <FiX /> Batal
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reasons.map(r => (
          <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                <span className="text-xl font-black text-blue-600">{r.number}</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{r.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{r.desc}</p>
            </div>
            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button onClick={() => { setEditingId(r.id); setFormData(r); }} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-semibold cursor-pointer"><FiEdit2 /> Edit</button>
              <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs font-semibold cursor-pointer"><FiTrash2 /> Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reasons;
