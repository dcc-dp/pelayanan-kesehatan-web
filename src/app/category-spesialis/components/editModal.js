"use client";
import { useState, useEffect } from "react";

export default function EditModal({ open, onClose, onSuccess, id }) {
  const [formData, setFormData] = useState({
    specialis_name: "",
    description: "",
  });

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      const res = await fetch(`/api/category_spesialis/${id}`);
      const data = await res.json();
      setFormData({
        specialis_name: data.specialis_name,
        description: data.description,
      });
    }
    fetchData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/category_spesialis", {
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
        <h2 className="text-xl font-bold mb-4">Edit Spesialis</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
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
