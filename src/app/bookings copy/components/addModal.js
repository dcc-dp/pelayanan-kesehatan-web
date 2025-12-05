"use client";
import { useEffect, useState } from "react";

export default function AddModal({ open, onClose, onSuccess }) {
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState({
    recipes_id: "",
    total: "",
  });

  // Load daftar resep untuk dropdown
  const loadRecipes = async () => {
    const res = await fetch("/api/recipes");
    const data = await res.json();
    setRecipes(data);
  };

  useEffect(() => {
    if (open) loadRecipes();
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/bookings", {
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
        <h2 className="text-xl font-bold mb-4">Tambah Booking</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipes */}
          <div>
            <label>Pilih Resep</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.recipes_id}
              onChange={(e) =>
                setFormData({ ...formData, recipes_id: e.target.value })
              }
            >
              <option value="">-- pilih resep --</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  Resep #{r.id} - {r.user_name} → {r.doctor_name}
                </option>
              ))}
            </select>
          </div>

          {/* Total */}
          <div>
            <label>Total</label>
            <input
              type="number"
              className="border p-2 w-full rounded"
              value={formData.total}
              onChange={(e) =>
                setFormData({ ...formData, total: e.target.value })
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
