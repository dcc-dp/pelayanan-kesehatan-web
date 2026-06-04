"use client";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function AddModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    users_id: "",
    category_spesialis_id: "",
    description: "",
    license: "",
    certificate: "",
  });

  const [users, setUsers] = useState([]);
  const [categorySpesialis, setCategorySpesialis] = useState([]);

  useEffect(() => {
    if (open) {
      // Reset form setiap kali modal dibuka
      setFormData({
        users_id: "",
        category_spesialis_id: "",
        description: "",
        license: "",
        certificate: "",
      });

      fetchUsers();
      fetchCategorySpesialis();
    }
  }, [open]);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const fetchCategorySpesialis = async () => {
    const res = await fetch("/api/category_spesialis");
    const data = await res.json();
    setCategorySpesialis(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/doctor", {
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                        {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100">
        
                  <div className="flex items-center gap-5">
        
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                      <span className="text-4xl text-blue-600">+</span>
                    </div>
        
                    <div>
                      <h2 className="text-3xl font-semibold text-gray-800">
                        Tambah doctor
                      </h2>
        
                      <p className="text-gray-500 mt-1">
                        Tambahkan doctor baru
                      </p>
                    </div>
        
                  </div>
        
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-3xl"
                  >
                    <FiX />
                  </button>
        
                </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-8 space-y-6 overflow-y-auto flex-1">
          <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Pilih nama dokter
                <span className="text-red-500 ml-1">*</span>
              </label>
            <select
                className="
                  w-full
                  h-14
                  px-5
                  border
                  border-gray-200
                  rounded-2xl
                  text-gray-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-100
                  focus:border-blue-500
                "
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

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Pilih kategori spesialis
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              className="
                w-full
                h-14
                px-5
                border
                border-gray-200
                rounded-2xl
                text-gray-700
                focus:outline-none
                focus:ring-2
                focus:ring-blue-100
                focus:border-blue-500
              "
              value={formData.category_spesialis_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category_spesialis_id: e.target.value,
                })
              }
            >
              <option value="">-- Pilih Kategori Spesialis --</option>
              {categorySpesialis.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.specialis_name}
                </option>
              ))}
            </select>
            </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Deskripsi
              <span className="text-red-500 ml-1">*</span>
            </label>

            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  description: e.target.value,
                });

                e.target.style.height = "auto";
                e.target.style.height =
                  e.target.scrollHeight + "px";
              }}
              className="
                w-full
                min-h-[120px]
                px-5
                py-4
                border
                border-gray-200
                rounded-2xl
                text-gray-700
                overflow-hidden
                resize-none
                focus:outline-none
                focus:ring-2
                focus:ring-blue-100
                focus:border-blue-500
              "
              placeholder="Masukkan deskripsi dokter..."
            />
          </div>
            <label>Lisensi</label>
            <input
                            className="
                w-full
                h-14
                px-5
                border
                border-gray-200
                rounded-2xl
                text-gray-700
                focus:outline-none
                focus:ring-2
                focus:ring-blue-100
                focus:border-blue-500
              "
              value={formData.license}
              onChange={(e) =>
                setFormData({ ...formData, license: e.target.value })
              }
            />

            <label>Sertifikat</label>
            <input
                           className="
                w-full
                h-14
                px-5
                border
                border-gray-200
                rounded-2xl
                text-gray-700
                focus:outline-none
                focus:ring-2
                focus:ring-blue-100
                focus:border-blue-500
              "
              value={formData.certificate}
              onChange={(e) =>
                setFormData({ ...formData, certificate: e.target.value })
              }
            />
          </div>

          <div className="border-t border-gray-100 p-6 flex justify-end gap-4">

          <button
            type="button"
            onClick={onClose}
            className="
              px-8
              py-3
              rounded-2xl
              border
              border-gray-200
              text-gray-600
              hover:bg-gray-50
              transition
            "
          >
            Batal
          </button>

          <button
            type="submit"
            className="
              px-8
              py-3
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-medium
              transition
            "
          >
            Simpan
          </button>

        </div>
        
        </form>
      </div>
    </div>
  );
}
