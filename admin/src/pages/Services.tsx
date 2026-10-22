import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiUploadCloud } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import { processImageFile } from '../utils/imageUpload';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Services = () => {
  const { showSuccess, showError } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    if (!formData.title?.trim()) {
      showError('Gagal Menyimpan', 'Nama layanan keahlian wajib diisi.');
      return;
    }

    let updated;
    if (editingId === 0) {
      updated = [...services, { ...formData, id: Date.now() }];
    } else {
      updated = services.map(s => s.id === editingId ? formData : s);
    }

    try {
      const res = await fetch(`${API}/api/update/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error('Gagal menyimpan ke server');
      setServices(updated);
      setEditingId(null);
      showSuccess('Berhasil Disimpan', `Layanan "${formData.title}" berhasil diperbarui ke database!`);
    } catch (err: any) {
      showError('Gagal Menyimpan', err?.message || 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;
    const updated = services.filter(s => s.id !== id);
    try {
      await fetch(`${API}/api/update/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setServices(updated);
      showSuccess('Layanan Dihapus', 'Data layanan berhasil dihapus.');
    } catch (err) {
      showError('Gagal Menghapus', 'Terjadi kesalahan saat menghapus layanan.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const result = await processImageFile(file, {
        maxSizeMB: 10,
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.85
      });

      if (!result.success || !result.dataUrl) {
        showError('Gagal Memproses Gambar', result.error || 'Gambar tidak valid.');
        return;
      }

      setFormData((prev: any) => ({ ...prev, img: result.dataUrl }));
      showSuccess(
        'Gambar Berhasil Diupload!',
        `Foto layanan "${file.name}" siap digunakan (${result.width}x${result.height}px, dioptimasi ke ${result.compressedSizeKB} KB).`
      );
    } catch (err: any) {
      showError('Error Upload', err?.message || 'Terjadi kesalahan tidak terduga saat memproses gambar.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
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
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700">Upload Gambar Layanan</label>
                  <span className="text-[11px] text-slate-400">JPG, PNG, WEBP (Maks 10MB)</span>
                </div>
                <label className={`cursor-pointer bg-white border-2 border-dashed ${uploadingImage ? 'border-blue-400 bg-blue-50/50' : 'border-slate-300 hover:border-blue-500'} rounded-xl p-4 flex flex-col items-center justify-center transition-all`}>
                  {uploadingImage ? (
                    <div className="flex flex-col items-center py-1">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-1.5" />
                      <span className="text-xs text-blue-600 font-semibold">Memproses & mengompres gambar...</span>
                    </div>
                  ) : (
                    <>
                      <FiUploadCloud className="text-slate-400 text-2xl mb-1 text-blue-500" />
                      <span className="text-xs text-slate-600 font-semibold">Klik untuk pilih gambar layanan</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">Otomatis dioptimasi & dikompresi beresolusi tajam</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploadingImage} />
                </label>
              </div>
              {formData.img && (
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-28 h-24 rounded-xl overflow-hidden border border-slate-200 bg-white relative shadow-sm">
                    <img 
                      src={formData.img.startsWith('http') || formData.img.startsWith('data:') ? formData.img : encodeURI(formData.img.startsWith('/') ? formData.img : '/' + formData.img)} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, img: '' })}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-medium hover:underline flex items-center gap-1"
                  >
                    <FiTrash2 className="text-xs" /> Hapus Foto
                  </button>
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
