import React, { useState, useEffect } from 'react';
import { 
  FiShield, 
  FiUserPlus, 
  FiTrash2, 
  FiKey, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiMail, 
  FiUser, 
  FiLock, 
  FiX, 
  FiClock,
  FiAlertTriangle
} from 'react-icons/fi';
import { apiFetch } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin';
  createdAt?: string;
}

const Users = () => {
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal State for Adding New Admin
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Modal State for Reset Password
  const [resetTargetUser, setResetTargetUser] = useState<AdminUser | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState('');

  // Delete Confirmation State
  const [deleteTargetUser, setDeleteTargetUser] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
    fetchUsers();
  }, []);

  const isSuperAdmin = currentUser?.role === 'superadmin' || currentUser?.email?.toLowerCase().trim() === 'fikihrz3135@gmail.com';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/users');
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users || []);
      } else {
        showError('Gagal Mengambil Data', data.error || 'Terjadi kesalahan');
      }
    } catch {
      showError('Gagal Menghubungi Server', 'Koneksi ke backend bermasalah.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newEmail || !newPassword) {
      setFormError('Email dan kata sandi wajib diisi');
      return;
    }

    if (newPassword.length < 6) {
      setFormError('Kata sandi minimal 6 karakter');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          name: newName || 'Admin',
          email: newEmail,
          password: newPassword
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error || 'Gagal menambahkan admin baru');
      } else {
        showSuccess('Admin Baru Berhasil Ditambahkan!', `Akun ${newEmail} telah dibuat dengan role Admin.`);
        setIsAddModalOpen(false);
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        fetchUsers();
      }
    } catch {
      setFormError('Gagal menghubungi server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser) return;
    setResetError('');

    if (!resetPasswordVal || resetPasswordVal.length < 6) {
      setResetError('Kata sandi baru minimal 6 karakter');
      return;
    }

    setResetting(true);
    try {
      const res = await apiFetch(`/api/admin/users/${resetTargetUser._id}/password`, {
        method: 'POST',
        body: JSON.stringify({ newPassword: resetPasswordVal })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setResetError(data.error || 'Gagal mengubah kata sandi');
      } else {
        showSuccess('Kata Sandi Diperbarui', `Kata sandi akun ${resetTargetUser.email} berhasil diubah.`);
        setResetTargetUser(null);
        setResetPasswordVal('');
      }
    } catch {
      setResetError('Gagal menghubungi server');
    } finally {
      setResetting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTargetUser) return;
    setDeleting(true);

    try {
      const res = await apiFetch(`/api/admin/users/${deleteTargetUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showError('Gagal Menghapus', data.error || 'Terjadi kesalahan saat menghapus pengguna');
      } else {
        showSuccess('Pengguna Dihapus', `Akun ${deleteTargetUser.email} berhasil dihapus.`);
        setDeleteTargetUser(null);
        fetchUsers();
      }
    } catch {
      showError('Gagal Menghubungi Server', 'Koneksi ke backend bermasalah.');
    } finally {
      setDeleting(false);
    }
  };

  // If not superadmin, render Access Denied guard
  if (!loading && !isSuperAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-red-200">
          <FiAlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Akses Dibatasi</h2>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-md mx-auto">
          Halaman <strong>Kelola Akses Admin</strong> hanya dapat diakses oleh akun Superadmin (<code>fikihrz3135@gmail.com</code>).
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Kelola Akses Admin</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300/80">
              Superadmin Only
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">
            Hanya Anda (Superadmin) yang berhak menambah atau menghapus staf yang memiliki akses ke panel admin ini.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormError('');
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <FiUserPlus size={16} />
          <span>Tambah Admin Baru</span>
        </button>
      </div>

      {/* Role Notice Card */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
          <FiShield size={20} />
        </div>
        <div className="text-xs sm:text-sm text-slate-700 space-y-1">
          <p className="font-bold text-slate-900">Kebijakan Hak Akses (Role-Based Access Control):</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>
              <strong>fikihrz3135@gmail.com (Superadmin):</strong> Memiliki kontrol penuh, termasuk menambah, mengganti kata sandi, dan menghapus akun admin lainnya.
            </li>
            <li>
              <strong>Admin yang Ditambahkan (Role Admin):</strong> Hanya dapat mengelola konten website (Proyek, Layanan, Review, Pengaturan), dan <em>tidak memiliki akses</em> ke menu Kelola Admin ini.
            </li>
          </ul>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FiUser className="text-blue-600" />
            <span>Daftar Pengguna Panel Admin ({users.length})</span>
          </h2>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {loading ? 'Memuat...' : 'Muat Ulang'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Nama & Pengguna</th>
                <th className="px-5 py-3.5">Email Akun</th>
                <th className="px-5 py-3.5">Hak Akses (Role)</th>
                <th className="px-5 py-3.5">Tanggal Dibuat</th>
                <th className="px-5 py-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Memuat daftar pengguna admin...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Belum ada pengguna admin terdaftar.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isMainSuper = u.email.toLowerCase().trim() === 'fikihrz3135@gmail.com';
                  const isCurrent = currentUser?.email?.toLowerCase().trim() === u.email.toLowerCase().trim();

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0 ${
                            isMainSuper 
                              ? 'bg-gradient-to-tr from-amber-500 to-yellow-600 text-white' 
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {u.name ? u.name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name || 'Admin'}</span>
                            {isCurrent && (
                              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                                Akun Anda Saat Ini
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-700 text-xs sm:text-sm">
                        {u.email}
                      </td>
                      <td className="px-5 py-4">
                        {isMainSuper ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300/80">
                            <FiShield size={12} className="text-amber-600" />
                            Superadmin (Owner)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <FiUser size={12} className="text-blue-500" />
                            Admin (Staf)
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs">
                        <span className="flex items-center gap-1">
                          <FiClock size={12} className="text-slate-400" />
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Reset Password Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setResetError('');
                              setResetPasswordVal('');
                              setResetTargetUser(u);
                            }}
                            className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Ganti Kata Sandi"
                          >
                            <FiKey size={15} />
                          </button>

                          {/* Delete Button (Disabled for Main Superadmin & Self) */}
                          {isMainSuper ? (
                            <span 
                              className="px-2 py-1 text-[11px] font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed select-none"
                              title="Akun Superadmin Utama tidak dapat dihapus"
                            >
                              Permanen
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteTargetUser(u)}
                              disabled={isCurrent}
                              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                isCurrent
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                              }`}
                              title={isCurrent ? 'Tidak bisa menghapus akun sendiri saat login' : 'Hapus Akun Admin'}
                            >
                              <FiTrash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah Admin Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FiUserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Tambah Akun Admin Baru</h3>
                  <p className="text-xs text-slate-400">Pengguna akan mendapatkan role Admin</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <FiX size={18} />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <FiAlertCircle className="flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap / Panggilan</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Misal: Staf Estimator / Budi"
                    className="w-full border border-slate-300 pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Login Admin</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="staf@rayakonstruksi.com"
                    className="w-full border border-slate-300 pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Awal</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full border border-slate-300 pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Role Info Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <FiShield size={14} className="text-blue-600" />
                  Role Ditetapkan: <span className="text-blue-600 font-bold">Admin</span>
                </span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Pengguna ini dapat mengedit konten website namun tidak dapat menambah akun admin lain.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  {submitting ? 'Menyimpan...' : 'Buat Akun Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reset Password */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <FiKey size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Ubah Kata Sandi</h3>
                  <p className="text-xs text-slate-400">{resetTargetUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setResetTargetUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <FiX size={18} />
              </button>
            </div>

            {resetError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <FiAlertCircle className="flex-shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="password"
                    value={resetPasswordVal}
                    onChange={(e) => setResetPasswordVal(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full border border-slate-300 pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={resetting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  {resetting ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Hapus User */}
      {deleteTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
              <FiTrash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Hapus Akun Admin Ini?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menghapus akses admin untuk <strong>{deleteTargetUser.email}</strong>? Pengguna ini tidak akan bisa login lagi ke panel admin.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetUser(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 cursor-pointer"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus Akun'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
