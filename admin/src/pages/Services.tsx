import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/api/data`);
      const data = await res.json();
      setServices(data.services || []);
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
      updated = [...services, { ...formData, id: Date.now() }];
    } else {
      updated = services.map(s => s.id === editingId ? formData : s);
    }

    try {
      await fetch(`${API}/api/update/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setServices(updated);
      setEditingId(null);
    } catch (err) {
      alert("Failed to save");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    const updated = services.filter(s => s.id !== id);
    try {
      await fetch(`${API}/api/update/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setServices(updated);
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
        <h2 className="text-3xl font-bold text-gray-800">Manajemen Layanan</h2>
        <button onClick={() => { setEditingId(0); setFormData({ title: '', desc: '', img: '' }); }} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <FiPlus /> <span>Tambah Layanan</span>
        </button>
      </div>

      {editingId !== null && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
          <h3 className="text-xl font-bold mb-4">{editingId === 0 ? 'Tambah Layanan' : 'Edit Layanan'}</h3>
          <div className="grid grid-cols-1 gap-4">
            <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="border p-2 rounded" />
            <textarea placeholder="Description" value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="border p-2 rounded" rows={3}></textarea>
            <div className="border p-4 rounded-xl flex items-center gap-6 bg-slate-50">
              <div className="flex-1">
                <label className="text-sm font-bold text-slate-700 mb-2 block">Upload Gambar Layanan</label>
                <label className="cursor-pointer bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg p-4 flex flex-col items-center justify-center transition-colors">
                  <FiPlus className="text-slate-400 text-2xl mb-2" />
                  <span className="text-sm text-slate-500 font-medium">Klik untuk pilih gambar</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              {formData.img && (
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0 relative shadow-inner">
                  <img 
                    src={formData.img.startsWith('/') ? `https://frontend-lilac-xi-27.vercel.app${formData.img}` : formData.img} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 font-medium"><FiSave /> Simpan</button>
            <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2 font-medium"><FiX /> Batal</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => {
          const imgSrc = service.img 
            ? (service.img.startsWith('/') ? `https://frontend-lilac-xi-27.vercel.app${service.img}` : service.img) 
            : 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80';
          return (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between">
              <div>
                <img src={imgSrc} alt={service.title} className="w-full h-44 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-slate-800">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">{service.desc}</p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex space-x-3 bg-gray-50/50">
                <button onClick={() => { setEditingId(service.id); setFormData(service); }} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 font-medium text-sm"><FiEdit2 /> Edit</button>
                <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1 font-medium text-sm"><FiTrash2 /> Hapus</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
