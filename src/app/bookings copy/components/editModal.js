"use client";
import { useState, useEffect } from "react";

export default function EditModal({ open, onClose, onSuccess, id }) {
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState({
    recipes_id: "",
    total: "",
  });

  // Load resep untuk select dropdown
  const loadRecipes = async () => {
    const res = await fetch("/api/recipes");
    const data = await res.json();
    setRecipes(data);
  };

  // Load data booking berdasarkan ID
  useEffect(() => {
    if (!id || !open) return;

    async function fetchData() {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();

      setFormData({
        recipes_id: data.recipes_id,
        total: data.total,
      });
    }

    fetchData();
    loadRecipes();
  }, [id, open]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/bookings", {
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
        <h2 className="text-xl font-bold mb-4">Edit Booking</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
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
