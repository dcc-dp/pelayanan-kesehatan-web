"use client";
import { useState, useEffect } from "react";

export default function AddModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    recipes_id: "",
    drugs_id: "",
    jumlah_minum: "",
    jumlah_hari: "",
    waktu_minum: "",
  });

  const [recipes_id, setRecipes] = useState([]);
  const [drugs, setDrugs] = useState([]);

  // Fetch data recipes & drugs ketika modal dibuka
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Tambah detail obat</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropdown Users */}
          <div>
            <label className="font-semibold">Pilih User</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.users_id}
              onChange={(e) =>
                setFormData({ ...formData, users_id: e.target.value })
              }
            >
              <option value="">-- Pilih User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Doctors */}
          <div>
            <label className="font-semibold">Pilih Dokter</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.doctors_id}
              onChange={(e) =>
                setFormData({ ...formData, doctors_id: e.target.value })
              }
            >
              <option value="">-- Pilih Dokter --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
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
