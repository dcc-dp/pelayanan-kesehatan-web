"use client";
import { useState, useEffect } from "react";

export default function EditModal({ open, onClose, onSuccess, id }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch data tiap kali modal dibuka dan ada id
  useEffect(() => {
    if (!open || !id) return;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/drugs/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data obat");
        const data = await res.json();

        setFormData({
          name: data.name || "",
          type: data.type || "",
          price: data.price?.toString() || "",
        });
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data obat");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [open, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/drugs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui data");

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
        <h2 className="text-xl font-bold mb-4">Edit Obat</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label>Nama Obat</label>
              <input
                className="border p-2 w-full rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Tipe</label>
              <input
                className="border p-2 w-full rounded"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Harga</label>
              <input
                type="number"
                className="border p-2 w-full rounded"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <button className="w-full bg-pink-300 text-white p-2 rounded">
              Update
            </button>
          </form>
        )}

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
