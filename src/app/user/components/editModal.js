"use client";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function EditModal({ open, onClose, onSuccess, id }) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birth: "",
    address: "",
    whatsapp: "",
    email: "",
    password: "",
    image: "",
    role: "",
  });

  // Fetch data user ketika modal dibuka atau id berubah
  useEffect(() => {
    if (!open || !id) return;

    async function fetchUser() {
      try {
        const res = await fetch(`/api/users`);
        const data = await res.json();

        const user = data.find((u) => u.id === Number(id));
        if (user) {
          setFormData({
            name: user.name || "",
            gender:
              user.gender === "laki_laki" || user.gender === "Laki-laki" || user.gender === "L"
                ? "Laki-laki"
                : user.gender === "perempuan" || user.gender === "Perempuan" || user.gender === "P"
                ? "Perempuan"
                : user.gender || "",  
            birth: user.birth ? user.birth.split("T")[0] : "",
            address: user.address || "",
            whatsapp: user.whatsapp || "",
            email: user.email || "",
            password: user.password || "",
            image: user.image || "",
            role: user.role || "",
          });
        }
      } catch (error) {
        console.error("Gagal fetch user:", error);
      }
    }

    fetchUser();
  }, [id, open]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Gagal update user:", error);
    }
  };

  if (!open) return null;

  const inputClassName = `
    w-full h-14 px-5 border border-gray-200 rounded-2xl text-gray-700
    focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500
  `;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-3xl text-blue-600">✎</span>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-800">Edit User</h2>
              <p className="text-gray-500 mt-1">Perbarui data user yang sudah ada</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">
            <FiX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="overflow-y-auto flex-1">
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Nama <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan nama"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Password
              </label>
              <input
                type="password"
                placeholder="Biarkan kosong jika tidak diubah"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className={inputClassName}
              >
                <option value="">-- Pilih gender --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">Tanggal Lahir</label>
              <input
                type="date"
                value={formData.birth}
                onChange={(e) => setFormData({ ...formData, birth: e.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">WhatsApp</label>
              <input
                type="text"
                placeholder="Masukkan no whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className={inputClassName}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-lg font-medium text-gray-700 mb-3">Alamat</label>
              <input
                type="text"
                placeholder="Masukkan alamat"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">Gambar URL</label>
              <input
                type="text"
                placeholder="URL Gambar"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={inputClassName}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-6 flex justify-end gap-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
