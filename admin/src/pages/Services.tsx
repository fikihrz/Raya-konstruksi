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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Manajemen Layanan Keahlian</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Kelola daftar layanan arsitektur, konstruksi gedung, sipil, dan fabrikasi baja.</p>
        </div>
        <button 
          onClick={() => { setEditingId(0); setFormData({ title: '', desc: '', img: '' }); }} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 text-sm font-semibold whitespace-nowrap"
        >
          <FiPlus /> <span>Tambah Layanan</span>
        </button>
      </div>

      {editingId !== null && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{editingId === 0 ? 'Tambah Layanan Baru' : 'Edit Layanan'}</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Layanan *</label>
              <input type="text" placeholder="Misal: Perencanaan Arsitektur & Desain" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Layanan *</label>
              <textarea placeholder="Tulis rincian layanan dan jaminan mutu pengerjaan..." value={formData.desc || ''} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
            </div>
            <div className="border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 bg-slate-50">
              <div className="flex-1 w-full">
                <label className="text-xs font-bold text-slate-700 mb-2 block">Upload Gambar Layanan</label>
                <label className="cursor-pointer bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
                  <FiPlus className="text-slate-400 text-xl mb-1" />
                  <span className="text-xs text-slate-500 font-medium">Klik untuk pilih gambar layanan</span>
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
          </div>
          <div className="mt-4 flex space-x-3">
            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider shadow-md transition-all"><FiSave /> Simpan</button>
            <button onClick={() => setEditingId(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-xs transition-colors"><FiX /> Batal</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const imgSrc = service.img 
            ? (service.img.startsWith('http') ? service.img : encodeURI(service.img.startsWith('/') ? service.img : '/' + service.img)) 
            : 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80';
          return (
            <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <img src={imgSrc} alt={service.title} className="w-full h-44 object-cover" />
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-base sm:text-lg mb-2 text-slate-800">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-2 line-clamp-3 leading-relaxed">{service.desc}</p>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex space-x-3 bg-slate-50/70">
                <button onClick={() => { setEditingId(service.id); setFormData(service); }} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-xs"><FiEdit2 /> Edit</button>
                <button onClick={() => handleDelete(service.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold text-xs"><FiTrash2 /> Hapus</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
