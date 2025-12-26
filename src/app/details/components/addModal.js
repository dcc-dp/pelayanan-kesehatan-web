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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.recipes_id ||
      !formData.drugs_id ||
      !formData.jumlah_minum ||
      !formData.jumlah_hari ||
      !formData.waktu_minum
    ) {
      alert("Semua field wajib diisi!");
      return;
    }

    const res = await fetch("/api/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipes_id: Number(formData.recipes_id),
        drugs_id: Number(formData.drugs_id),
        jumlah_minum: Number(formData.jumlah_minum),
        jumlah_hari: Number(formData.jumlah_hari),
        waktu_minum: formData.waktu_minum,
      }),
    });

    if (res.ok) {
      onSuccess();
      onClose();
      setFormData({
        recipes_id: "",
        drugs_id: "",
        jumlah_minum: "",
        jumlah_hari: "",
        waktu_minum: "",
      });
    } else {
      alert("Gagal menyimpan data");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Tambah Detail</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipes */}
          <div>
            <label className="font-semibold">Pilih Resep</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.recipes_id}
              onChange={(e) =>
                setFormData({ ...formData, recipes_id: e.target.value })
              }
            >
              <option value="">-- ID Resep --</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.pasien} - {r.dokter}
                </option>
              ))}
            </select>
          </div>

          {/* Drugs */}
          <div>
            <label className="font-semibold">Pilih Obat</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.drugs_id}
              onChange={(e) =>
                setFormData({ ...formData, drugs_id: e.target.value })
              }
            >
              <option value="">-- ID obat --</option>
              {drugs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Jumlah Minum */}
          <div>
            <label className="font-semibold">Jumlah Minum</label>
            <input
              type="number"
              min="1"
              className="border p-2 w-full rounded"
              value={formData.jumlah_minum}
              onChange={(e) =>
                setFormData({ ...formData, jumlah_minum: e.target.value })
              }
            />
          </div>

          {/* Jumlah Hari */}
          <div>
            <label className="font-semibold">Jumlah Hari</label>
            <input
              type="number"
              min="1"
              className="border p-2 w-full rounded"
              value={formData.jumlah_hari}
              onChange={(e) =>
                setFormData({ ...formData, jumlah_hari: e.target.value })
              }
            />
          </div>

          {/* Waktu Minum */}
          <div>
            <label className="font-semibold">Waktu Minum</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.waktu_minum}
              onChange={(e) =>
                setFormData({ ...formData, waktu_minum: e.target.value })
              }
            >
              <option value="">-- Pilih Waktu --</option>
              <option value="before_eat">Sebelum Makan</option>
              <option value="after_eat">Sesudah Makan</option>
            </select>
          </div>

          <button className="w-full bg-pink-400 text-white p-2 rounded">
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
