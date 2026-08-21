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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manajemen Project</h2>
        <button onClick={() => { setEditingId(0); setFormData({ title: '', location: '', year: 2026, category: 'Residential', budget: '', duration: '', fullDesc: '', img: '' }); }} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <FiPlus /> <span>Tambah Project</span>
        </button>
      </div>

      {editingId !== null && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
          <h3 className="text-xl font-bold mb-4">{editingId === 0 ? 'Tambah Project' : 'Edit Project'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="border p-2 rounded" />
            <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="border p-2 rounded" />
            <input type="text" placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="border p-2 rounded" />
            <input type="number" placeholder="Year" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="border p-2 rounded" />
            <input type="text" placeholder="Client" value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} className="border p-2 rounded" />
            <input type="text" placeholder="Budget" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} className="border p-2 rounded" />
            <input type="text" placeholder="Duration" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="border p-2 rounded" />
            <div className="border p-4 rounded-xl col-span-2 flex items-center gap-6 bg-slate-50">
              <div className="flex-1">
                <label className="text-sm font-bold text-slate-700 mb-2 block">Upload Gambar Project</label>
                <label className="cursor-pointer bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg p-4 flex flex-col items-center justify-center transition-colors">
                  <FiPlus className="text-slate-400 text-2xl mb-2" />
                  <span className="text-sm text-slate-500 font-medium">Klik untuk pilih gambar</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              {formData.img && (
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0 relative shadow-inner">
                  <img 
                    src={formData.img.startsWith('http') ? formData.img : `https://rayakonstruksi.vercel.app${encodeURI(formData.img.startsWith('/') ? formData.img : '/' + formData.img)}`} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>
            <textarea placeholder="Description" value={formData.fullDesc} onChange={e => setFormData({ ...formData, fullDesc: e.target.value })} className="border p-2 rounded col-span-2" rows={3}></textarea>
          </div>
          <div className="mt-4 flex space-x-3">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 font-medium"><FiSave /> Simpan</button>
            <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2 font-medium"><FiX /> Batal</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => {
              const imgSrc = project.img 
                ? (project.img.startsWith('/') ? `https://rayakonstruksi.vercel.app${project.img}` : project.img) 
                : 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=200&q=80';
              return (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={imgSrc} 
                      alt={project.title} 
                      className="w-16 h-12 rounded-lg object-cover border border-slate-200 shadow-sm" 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => { setEditingId(project.id); setFormData(project); }} className="text-indigo-600 hover:text-indigo-900 mr-4"><FiEdit2 size={18} /></button>
                    <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-900"><FiTrash2 size={18} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
