"use client";
import { useState, useEffect } from "react";

export default function AddModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    users_id: "",
    category_spesialis_id: "",
    description: "",
    license: "",
    certificate: "",
  });

  const [users, setUsers] = useState([]);
  const [categorySpesialis, setCategorySpesialis] = useState([]);

  useEffect(() => {
    if (open) {
      // Reset form setiap kali modal dibuka
      setFormData({
        users_id: "",
        category_spesialis_id: "",
        description: "",
        license: "",
        certificate: "",
      });

      fetchUsers();
      fetchCategorySpesialis();
    }
  }, [open]);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const fetchCategorySpesialis = async () => {
    const res = await fetch("/api/category_spesialis");
    const data = await res.json();
    setCategorySpesialis(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onSuccess();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Tambah Dokter</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold">Pilih User</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.users_id}
              onChange={(e) =>
                setFormData({ ...formData, users_id: e.target.value })
              }
            >
              <option value="">-- Pilih User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Pilih Kategori Spesialis</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.category_spesialis_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category_spesialis_id: e.target.value,
                })
              }
            >
              <option value="">-- Pilih Kategori Spesialis --</option>
              {categorySpesialis.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.specialis_name}
                </option>
              ))}
            </select>

            <label>Deskripsi</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <label>Lisensi</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.license}
              onChange={(e) =>
                setFormData({ ...formData, license: e.target.value })
              }
            />

            <label>Sertifikat</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.certificate}
              onChange={(e) =>
                setFormData({ ...formData, certificate: e.target.value })
              }
            />
          </div>

          <button className="w-full bg-pink-300 text-white p-2 rounded">
            Simpan
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-3 w-full p-2 bg-gray-300 rounded"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
