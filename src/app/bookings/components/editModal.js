"use client";
import { useState, useEffect } from "react";
import { FiX, FiEdit2 } from "react-icons/fi";

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
    try {
      const res = await fetch("/api/recipes");
      const data = await res.json();
      setRecipes(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!open || !id) return;

    async function fetchData() {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        const data = await res.json();
        
        // data could be an array of multiple details for the same booking ID, 
        // but recipes_id is the same for all of them
        if (data && data.length > 0) {
          setFormData({
            recipes_id: data[0].recipes_id || "",
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data booking", error);
      }
    }
    fetchData();
  }, [open, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          recipes_id: parseInt(formData.recipes_id)
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui booking");
      }

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
              <FiEdit2 className="text-blue-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-800">
                Edit Booking
              </h2>
              <p className="text-gray-500 mt-1">
                Perbarui data tagihan resep pasien
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
          onSubmit={handleUpdate}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-8 space-y-6 overflow-y-auto flex-1">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Pilih Resep / Pasien
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="w-full h-14 px-5 border border-gray-200 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                value={formData.recipes_id}
                onChange={(e) =>
                  setFormData({ ...formData, recipes_id: e.target.value })
                }
                required
              >
                <option value="">-- Pilih Resep --</option>
                {recipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    Resep #{r.id} - Pasien: {r.pasien} (Dokter: {r.dokter})
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-400 mt-2">
                Mengubah resep akan menghitung ulang total harga secara otomatis.
              </p>
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
