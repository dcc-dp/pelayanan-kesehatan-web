"use client";
import { useState, useEffect } from "react";

export default function AddModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    recipes_id: "",
    drugs_id: "",
  });

  const [recipes, setRecipes] = useState([]);
  const [drugs, setDrugs] = useState([]);

  // Fetch data users & doctors ketika modal dibuka
  useEffect(() => {
    if (open) {
      fetchRecipes();
      fetchDrugs();
    }
  }, [open]);

  const fetchRecipes = async () => {
    const res = await fetch("/api/recipes");
    const data = await res.json();
    setRecipes(data);
  };

  const fetchDrugs = async () => {
    const res = await fetch("/api/drugs");
    const data = await res.json();
    setDrugs(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/details", {
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
        <h2 className="text-xl font-bold mb-4">Tambah detail</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropdown Users */}
          <div>
            <label className="font-semibold">Pilih resep</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.recipes_id}
              onChange={(e) =>
                setFormData({ ...formData, recipes_id: e.target.value })
              }
            >
              <option value="">-- Pilih resep --</option>
              {users.map((u) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Doctors */}
          <div>
            <label className="font-semibold">Pilih obat</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.drugs_id}
              onChange={(e) =>
                setFormData({ ...formData, drugs_id: e.target.value })
              }
            >
              <option value="">-- Pilih obat --</option>
              {doctors.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
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
