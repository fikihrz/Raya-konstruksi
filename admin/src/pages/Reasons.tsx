import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Reasons = () => {
  const [reasons, setReasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetch(`${API}/api/data`)
      .then(res => res.json())
      .then(data => { setReasons(data.reasons || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const save = async (updated: any[]) => {
    await fetch(`${API}/api/update/reasons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  };

  const handleSave = async () => {
    const updated = editingId === 0
      ? [...reasons, { ...formData, id: Date.now() }]
      : reasons.map(r => r.id === editingId ? formData : r);
    try { await save(updated); setReasons(updated); setEditingId(null); }
    catch { alert("Gagal menyimpan"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus alasan ini?")) return;
    const updated = reasons.filter(r => r.id !== id);
    try { await save(updated); setReasons(updated); }
    catch { alert("Gagal menghapus"); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Kenapa Memilih Kami</h2>
          <p className="text-slate-500 text-sm mt-1">Edit kartu alasan yang muncul di section "Why Choose Us"</p>
        </div>
        <button
          onClick={() => { setEditingId(0); setFormData({ number: `0${reasons.length + 1}`, title: '', desc: '' }); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
        >
          <FiPlus /> Tambah Alasan
        </button>
      </div>

      {editingId !== null && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-6">
          <h3 className="text-lg font-bold mb-4 text-slate-800">{editingId === 0 ? 'Tambah Alasan Baru' : 'Edit Alasan'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Nomor (misal: 01)</label>
              <input type="text" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} className="border border-slate-300 p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Judul</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="border border-slate-300 p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Architectural Excellence" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Deskripsi</label>
              <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="border border-slate-300 p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><FiSave /> Simpan</button>
            <button onClick={() => setEditingId(null)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><FiX /> Batal</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reasons.map(r => (
          <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              <span className="text-xl font-black text-blue-600">{r.number}</span>
            </div>
            <h3 className="font-bold text-slate-800 mb-2">{r.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">{r.desc}</p>
            <div className="flex gap-3">
              <button onClick={() => { setEditingId(r.id); setFormData(r); }} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"><FiEdit2 /> Edit</button>
              <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"><FiTrash2 /> Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reasons;
