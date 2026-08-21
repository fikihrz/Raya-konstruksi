import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Clients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetch(`${API}/api/data`)
      .then(res => res.json())
      .then(data => { setClients(data.clients || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const save = async (updated: any[]) => {
    await fetch(`${API}/api/update/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  };

  const handleSave = async () => {
    const updated = editingId === 0
      ? [...clients, { ...formData, id: Date.now() }]
      : clients.map(c => c.id === editingId ? formData : c);
    try { await save(updated); setClients(updated); setEditingId(null); }
    catch { alert("Gagal menyimpan"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus klien ini?")) return;
    const updated = clients.filter(c => c.id !== id);
    try { await save(updated); setClients(updated); }
    catch { alert("Gagal menghapus"); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Klien & Mitra</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola daftar klien yang tampil di ticker website</p>
        </div>
        <button
          onClick={() => { setEditingId(0); setFormData({ name: '', abbr: '' }); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
        >
          <FiPlus /> Tambah Klien
        </button>
      </div>

      {editingId !== null && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-6">
          <h3 className="text-lg font-bold mb-4 text-slate-800">{editingId === 0 ? 'Tambah Klien Baru' : 'Edit Klien'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Nama Perusahaan</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="border border-slate-300 p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="PT Contoh Perusahaan"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Singkatan (Abbr)</label>
              <input
                type="text"
                value={formData.abbr}
                onChange={e => setFormData({ ...formData, abbr: e.target.value })}
                className="border border-slate-300 p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="CPR"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><FiSave /> Simpan</button>
            <button onClick={() => setEditingId(null)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><FiX /> Batal</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Preview</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Perusahaan</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Singkatan</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 bg-blue-900/10 border border-blue-200 rounded-xl px-4 py-2 w-fit">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-black text-blue-600 leading-none text-center">{client.abbr}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">{client.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{client.abbr}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { setEditingId(client.id); setFormData(client); }} className="text-blue-600 hover:text-blue-800 mr-4 inline-flex items-center gap-1 text-sm"><FiEdit2 /> Edit</button>
                  <button onClick={() => handleDelete(client.id)} className="text-red-500 hover:text-red-700 inline-flex items-center gap-1 text-sm"><FiTrash2 /> Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <div className="text-center py-12 text-slate-400">Belum ada klien. Tambahkan klien pertama!</div>
        )}
      </div>
    </div>
  );
};

export default Clients;
