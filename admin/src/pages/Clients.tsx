import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiImage, FiUploadCloud } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import { processImageFile } from '../utils/imageUpload';
import { apiFetch } from '../utils/api';
import { resolveImageUrl } from '../utils/imageUrl';

const Clients = () => {
  const { showSuccess, showError } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    apiFetch('/api/data')
      .then(res => res.json())
      .then(data => { setClients(data.clients || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const save = async (updated: any[]) => {
    await apiFetch('/api/update/clients', {
      method: 'POST',
      body: JSON.stringify(updated)
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const result = await processImageFile(file, {
        maxSizeMB: 10,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.85
      });

      if (!result.success || !result.dataUrl) {
        showError('Gagal Memproses Foto', result.error || 'Gambar tidak valid.');
        return;
      }

      setFormData((prev: any) => ({ ...prev, logo: result.dataUrl }));
      showSuccess(
        'Foto Profil Klien Berhasil Diupload!',
        `Foto logo/profil "${file.name}" berhasil diunggah (${result.width}x${result.height}px, ${result.compressedSizeKB} KB).`
      );
    } catch (err: any) {
      showError('Gagal Upload', err?.message || 'Terjadi kesalahan saat memproses foto.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      showError('Validasi Gagal', 'Nama klien / perusahaan wajib diisi.');
      return;
    }
    const updated = editingId === 0
      ? [...clients, { ...formData, id: Date.now() }]
      : clients.map(c => c.id === editingId ? formData : c);
    try { 
      await save(updated); 
      setClients(updated); 
      setEditingId(null); 
      showSuccess('Berhasil Disimpan', `Data klien "${formData.name}" berhasil diperbarui ke database!`);
    } catch { 
      showError('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan data klien.'); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus klien ini?")) return;
    const updated = clients.filter(c => c.id !== id);
    try { 
      await save(updated); 
      setClients(updated); 
    } catch { 
      alert("Gagal menghapus"); 
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Memuat data klien...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Klien & Mitra</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola foto profil (PP profile) dan nama mitra yang tampil di running ticker beranda</p>
        </div>
        <button
          onClick={() => { 
            setEditingId(0); 
            setFormData({ name: '', logo: '', abbr: '' }); 
          }}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium shadow-sm"
        >
          <FiPlus /> Tambah Klien
        </button>
      </div>

      {editingId !== null && (
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-slate-200 mb-6">
          <h3 className="text-lg font-bold mb-4 text-slate-800">
            {editingId === 0 ? 'Tambah Klien Baru' : 'Edit Foto Profil & Data Klien'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PP Profile Live Preview & Upload */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-3">Foto Profil (PP Preview)</label>
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-200 border-2 border-blue-500 shadow-md flex items-center justify-center mb-3">
                {formData.logo ? (
                  <img src={resolveImageUrl(formData.logo)} alt="Preview PP" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl font-bold">
                    {formData.abbr || (formData.name ? formData.name.charAt(0).toUpperCase() : '?')}
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all">
                <FiUploadCloud size={14} className="text-blue-600" />
                <span>{uploading ? 'Mengupload...' : 'Upload Foto PP'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
              </label>
              <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, SVG rekomendasi 1:1</span>
            </div>

            {/* Form Fields */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Nama Perusahaan / Klien</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="border border-slate-300 p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: PT Waskita Karya"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                  URL Foto Profil / Logo (PP Profile)
                </label>
                <div className="relative">
                  <FiImage className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={formData.logo || ''}
                    onChange={e => setFormData({ ...formData, logo: e.target.value })}
                    className="border border-slate-300 pl-9 pr-3 py-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://... atau upload file melalui tombol di samping"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Singkatan Cadangan (Fallback)</label>
                <input
                  type="text"
                  value={formData.abbr || ''}
                  onChange={e => setFormData({ ...formData, abbr: e.target.value })}
                  className="border border-slate-300 p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Inisial jika foto profil tidak tampil (contoh: WK)"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
            <button onClick={handleSave} className="flex-1 sm:flex-none justify-center bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
              <FiSave /> Simpan Klien
            </button>
            <button onClick={() => setEditingId(null)} className="flex-1 sm:flex-none justify-center bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
              <FiX /> Batal
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Foto Profil (PP)</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Perusahaan</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status Foto PP</th>
                <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-300 flex items-center justify-center flex-shrink-0 shadow-sm">
                        {client.logo ? (
                          <img src={resolveImageUrl(client.logo)} alt={client.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xs font-bold">
                            {client.abbr || (client.name ? client.name.charAt(0).toUpperCase() : 'K')}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{client.name}</td>
                  <td className="px-6 py-4">
                    {client.logo ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Ada Foto PP
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Belum Ada PP
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button 
                      onClick={() => { setEditingId(client.id); setFormData(client); }} 
                      className="text-blue-600 hover:text-blue-800 mr-4 inline-flex items-center gap-1 text-sm font-medium"
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(client.id)} 
                      className="text-red-500 hover:text-red-700 inline-flex items-center gap-1 text-sm font-medium"
                    >
                      <FiTrash2 /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {clients.length === 0 && (
          <div className="text-center py-12 text-slate-400">Belum ada klien. Tambahkan klien pertama!</div>
        )}
      </div>
    </div>
  );
};

export default Clients;
