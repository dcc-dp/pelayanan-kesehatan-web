"use client";
import { useState, useEffect } from "react";

export default function EditModal({ open, onClose, onSuccess, id }) {
  const [formData, setFormData] = useState({
    recipes_id: "",
    drugs_id: "",
  });

  const [recipes, setRecipes] = useState([]);
  const [drugs, setDrugs] = useState([]);

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

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      const res = await fetch(`/api/details/${id}`);
      const data = await res.json();

      setFormData({
        recipes_id: data[0]?.recipes_id,
        drugs_id: data[0]?.drugs_id,
      });
    }
    fetchData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/details", {
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit detail</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="font-semibold">Pilih Resep</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.recipes_id}
              onChange={(e) =>
                setFormData({ ...formData, recipes_id: e.target.value })
              }
            >
              <option value="">-- Pilih Resep --</option>
              {recipes.map((r, index) => (
                <option key={r.id || index} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

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
              {drugs.map((d, index) => (
                <option key={d.id || index} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
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
