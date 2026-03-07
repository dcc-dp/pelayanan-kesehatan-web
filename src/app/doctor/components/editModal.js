"use client";
import { useState, useEffect } from "react";

export default function EditModal({ open, onClose, onSuccess, id }) {
  const [formData, setFormData] = useState({
    users_id: "",
    category: "",
    description: "",
    license: "",
    certificate: "",
  });

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      const res = await fetch(`/api/doctor/${id}`);
      const data = await res.json();
      setFormData({
        users_id: data.users_id,
        category: data.category,
        description: data.description,
        license: data.license,
        certificate: data.certificate,
      });
    }
    fetchData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/doctor", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, id }),
    });

    if (res.ok) {
      onSuccess();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit dokter</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
     <label>ID user</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.users_id}
              onChange={(e) =>
                setFormData({ ...formData, users_id: e.target.value })
              }
            />
          </div>

          <div>
            <label>kategori</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

             <div>
            <label>deskripsi</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label>lisensi</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.license}
              onChange={(e) =>
                setFormData({ ...formData, license: e.target.value })
              }
            />
          </div>

          <div>
            <label>sertifikat</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.certificate}
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
