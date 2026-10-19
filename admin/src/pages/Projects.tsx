import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/api/data`);
      const data = await res.json();
      setProjects(data.projects || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    let updated;
    if (editingId === 0) {
      // Add new
      updated = [...projects, { ...formData, id: Date.now() }];
    } else {
      // Update existing
      updated = projects.map(p => p.id === editingId ? formData : p);
    }

    try {
      await fetch(`${API}/api/update/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setProjects(updated);
      setEditingId(null);
    } catch (err) {
      alert("Failed to save");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    const updated = projects.filter(p => p.id !== id);
    try {
      await fetch(`${API}/api/update/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setProjects(updated);
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('image', file);

    try {
      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        body: formDataObj
      });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, img: data.url });
      }
    } catch (err) {
      alert("Failed to upload image");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Manajemen Proyek Portofolio</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Tambah, edit foto, lokasi, anggaran, dan deskripsi proyek mahakarya konstruksi.</p>
        </div>
        <button 
          onClick={() => { setEditingId(0); setFormData({ title: '', location: '', year: 2026, category: 'Residential', budget: '', duration: '', fullDesc: '', img: '' }); }} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 text-sm font-semibold whitespace-nowrap"
        >
          <FiPlus /> <span>Tambah Proyek</span>
        </button>
      </div>

      {editingId !== null && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{editingId === 0 ? 'Tambah Proyek Baru' : 'Edit Proyek'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Judul Proyek *</label>
              <input type="text" placeholder="Misal: The Glass Horizon Villa" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori Proyek</label>
              <select value={formData.category || 'Residential'} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Lokasi Proyek</label>
              <input type="text" placeholder="Misal: Jakarta / Surakarta" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tahun Selesai</label>
              <input type="number" placeholder="2026" value={formData.year || 2026} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Klien</label>
              <input type="text" placeholder="Misal: PT Total Bangun Persada" value={formData.client || ''} onChange={e => setFormData({ ...formData, client: e.target.value })} className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nilai Anggaran (Budget)</label>
              <input type="text" placeholder="Misal: Rp 18,5 Miliar" value={formData.budget || ''} onChange={e => setFormData({ ...formData, budget: e.target.value })} className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Durasi Pengerjaan</label>
              <input type="text" placeholder="Misal: 14 Bulan" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="border border-slate-200 p-4 rounded-xl sm:col-span-2 flex flex-col sm:flex-row items-center gap-4 bg-slate-50">
              <div className="flex-1 w-full">
                <label className="text-xs font-bold text-slate-700 mb-2 block">Upload Gambar Proyek</label>
                <label className="cursor-pointer bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
                  <FiPlus className="text-slate-400 text-xl mb-1" />
                  <span className="text-xs text-slate-500 font-medium">Klik untuk pilih gambar foto proyek</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              {formData.img && (
                <div className="w-28 h-24 rounded-xl overflow-hidden border border-slate-200 bg-white flex-shrink-0 relative shadow-sm">
                  <img 
                    src={formData.img.startsWith('http') ? formData.img : encodeURI(formData.img.startsWith('/') ? formData.img : '/' + formData.img)} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Lengkap Proyek</label>
              <textarea placeholder="Tulis rincian pekerjaan dan spesifikasi struktur proyek..." value={formData.fullDesc || ''} onChange={e => setFormData({ ...formData, fullDesc: e.target.value })} className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider shadow-md transition-all"><FiSave /> Simpan</button>
            <button onClick={() => setEditingId(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-xs transition-colors"><FiX /> Batal</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Gambar</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Nama Project</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Kategori</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Lokasi</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {projects.map((project) => {
                const imgSrc = project.img 
                  ? (project.img.startsWith('http') ? project.img : encodeURI(project.img.startsWith('/') ? project.img : '/' + project.img)) 
                  : 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=200&q=80';
                return (
                  <tr key={project.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <img 
                        src={imgSrc} 
                        alt={project.title} 
                        className="w-16 h-12 rounded-lg object-cover border border-slate-200 shadow-sm" 
                      />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm font-semibold text-slate-800">{project.title}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-500 font-medium">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">{project.category}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-slate-500">{project.location}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => { setEditingId(project.id); setFormData(project); }} className="text-blue-600 hover:text-blue-800 mr-3 p-1"><FiEdit2 size={16} /></button>
                      <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-700 p-1"><FiTrash2 size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;
