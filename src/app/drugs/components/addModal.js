"use client";
import { useState } from "react";

export default function AddModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/drugs", {
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
<<<<<<< HEAD
        <h2 className="text-xl font-bold mb-4">Tambah Obat</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Nama Obat</label>
=======
        <h2 className="text-xl font-bold mb-4">Tambah obat</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Nama obat</label>
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
            <input
              className="border p-2 w-full rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
<<<<<<< HEAD
            <label>Type</label>
=======
            <label>type</label>
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
            <input
              className="border p-2 w-full rounded"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            />
          </div>

<<<<<<< HEAD
          <div>
            <label>Harga</label>
=======
           <div>
            <label>price</label>
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
            <input
              className="border p-2 w-full rounded"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
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
