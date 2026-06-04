"use client";
import { useState, useEffect } from "react";
import { FiX, FiPlusCircle } from "react-icons/fi";

export default function AddModal({ open, onClose, onSuccess, recipesId }) {
  const [formData, setFormData] = useState({
    drugs_id: "",
    jumlah: "",
    jumlah_minum: "",
    jumlah_hari: "",
    waktu_minum: "before_eat",
  });

  const [drugs, setDrugs] = useState([]);

  useEffect(() => {
    if (!open) return;
    
    setFormData({
      drugs_id: "",
      jumlah: "",
      jumlah_minum: "",
      jumlah_hari: "",
      waktu_minum: "before_eat",
    });

    const fetchDrugs = async () => {
      try {
        const res = await fetch("/api/drugs");
        const data = await res.json();
        setDrugs(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDrugs();
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recipes_id: parseInt(recipesId)
        }),
      });

      if (!res.ok) throw new Error("Gagal menambah data detail resep");

      onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <FiPlusCircle className="text-blue-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-800">
                Tambah Obat
              </h2>
              <p className="text-gray-500 mt-1">
                Masukkan detail obat untuk resep ini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX size={30} />
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-8 space-y-6 overflow-y-auto flex-1">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Pilih Obat
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="w-full h-14 px-5 border border-gray-200 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                value={formData.drugs_id}
                onChange={(e) =>
                  setFormData({ ...formData, drugs_id: e.target.value })
                }
                required
              >
                <option value="">-- Pilih Obat --</option>
                {drugs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Total Obat (Jumlah)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                className="w-full h-14 px-5 border border-gray-200 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                value={formData.jumlah}
                onChange={(e) =>
                  setFormData({ ...formData, jumlah: e.target.value })
                }
                required
                placeholder="Contoh: 15"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Jumlah Minum
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                className="w-full h-14 px-5 border border-gray-200 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                value={formData.jumlah_minum}
                onChange={(e) =>
                  setFormData({ ...formData, jumlah_minum: e.target.value })
                }
                required
                placeholder="Contoh: 3"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Jumlah Hari
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                className="w-full h-14 px-5 border border-gray-200 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                value={formData.jumlah_hari}
                onChange={(e) =>
                  setFormData({ ...formData, jumlah_hari: e.target.value })
                }
                required
                placeholder="Contoh: 5"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Waktu Minum
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="w-full h-14 px-5 border border-gray-200 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                value={formData.waktu_minum}
                onChange={(e) =>
                  setFormData({ ...formData, waktu_minum: e.target.value })
                }
                required
              >
                <option value="before_eat">Sebelum Makan (before_eat)</option>
                <option value="after_eat">Sesudah Makan (after_eat)</option>
              </select>
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-100 p-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
