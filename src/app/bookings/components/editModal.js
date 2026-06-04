"use client";
import { useState, useEffect } from "react";

export default function EditModal({ open, onClose, onSuccess, id }) {
  const [formData, setFormData] = useState({
    recipes_id: "",
  });

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (open) {
      fetchRecipes();
    }
  }, [open]);

  const fetchRecipes = async () => {
    const res = await fetch("/api/recipes");
    const data = await res.json();
    setRecipes(data);
  };

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();

      setFormData({
        recipes_id: data[0]?.recipes_id,
      });
    }
    fetchData();
  }, [id]);

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
        <h2 className="text-xl font-bold mb-4">Edit Bookings</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="font-semibold">Pilih User</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.users_id}
              onChange={(e) =>
                setFormData({ ...formData, recipes_id: e.target.value })
              }
            >
              <option value="">-- Pilih User --</option>
              {users.map((u, index) => (
                <option key={u.id || index} value={u.id}>
                  {u.name}
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
