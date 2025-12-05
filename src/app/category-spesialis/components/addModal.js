"use client";
import { useState } from "react";

export default function AddModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    specialis_name: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/category_spesialis", {
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Tambah Spesialis</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Nama Spesialis</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.specialis_name}
              onChange={(e) =>
                setFormData({ ...formData, specialis_name: e.target.value })
              }
            />
          </div>

          <div>
            <label>Deskripsi</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
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
