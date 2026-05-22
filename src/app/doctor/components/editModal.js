"use client";
import { useState, useEffect } from "react";

export default function EditModal({ open, onClose, onSuccess, doctorId }) {
  const [formData, setFormData] = useState({
    users_id: "",
    category_spesialis_id: "",
    description: "",
    license: "",
    certificate: "",
  });

  const [users, setUsers] = useState([]);
  const [categorySpesialis, setCategorySpesialis] = useState([]);

  // Fetch dropdown options
  // Fetch data dokter untuk edit
  useEffect(() => {
    if (!open || !doctorId) return;

    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctor/${doctorId}`);
        if (!res.ok) throw new Error("Gagal mengambil data dokter");
        const data = await res.json();

        setFormData({
          users_id: data.users_id || "",
          category_spesialis_id: data.category_spesialis_id || "",
          description: data.description || "",
          license: data.license || "",
          certificate: data.certificate || "",
        });
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data dokter");
      }
    };

    fetchDoctor();
  }, [open, doctorId]);
  // Fetch data dokter untuk edit
  useEffect(() => {
    if (!open || !doctorId) return;

    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctor/${doctorId}`);
        if (!res.ok) throw new Error("Gagal mengambil data dokter");
        const data = await res.json();

        setFormData({
          users_id: data.users_id || "",
          category_spesialis_id: data.category_spesialis_id || "",
          description: data.description || "",
          license: data.license || "",
          certificate: data.certificate || "",
        });
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data dokter");
      }
    };

    fetchDoctor();
  }, [open, doctorId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/doctor", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: doctorId }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui data dokter");

      onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Dokter</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label>Pilih User</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.users_id || ""}
              onChange={(e) =>
                setFormData({ ...formData, users_id: e.target.value })
              }
              required
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
            <label>Pilih Kategori Spesialis</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.category_spesialis_id || ""}
              onChange={(e) =>
                setFormData({ ...formData, category_spesialis_id: e.target.value })
              }
              required
            >
              <option value="">-- Pilih Kategori Spesialis --</option>
              {categorySpesialis.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.specialis_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Deskripsi</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label>Lisensi</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.license || ""}
              onChange={(e) =>
                setFormData({ ...formData, license: e.target.value })
              }
            />
          </div>

          <div>
            <label>Sertifikat</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.certificate || ""}
              onChange={(e) =>
                setFormData({ ...formData, certificate: e.target.value })
              }
            />
          </div>

          <button className="w-full bg-pink-300 text-white p-2 rounded">
            Update
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
