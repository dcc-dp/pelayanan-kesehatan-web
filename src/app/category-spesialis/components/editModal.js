"use client";

import { useState, useEffect } from "react";
import { FiX, FiEdit2 } from "react-icons/fi";

export default function EditModal({
  open,
  onClose,
  onSuccess,
  id,
}) {
  const [formData, setFormData] = useState({
    specialis_name: "",
    description: "",
  });

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      const res = await fetch(
        `/api/category_spesialis/${id}`
      );

      const data = await res.json();

      setFormData({
        specialis_name: data.specialis_name || "",
        description: data.description || "",
      });
    }

    fetchData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "/api/category_spesialis",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id,
        }),
      }
    );

    if (res.ok) {
      onSuccess();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">

          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <FiEdit2 className="text-blue-600 text-3xl" />
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-gray-800">
                Edit Spesialis
              </h2>

              <p className="text-gray-500 mt-1">
                Perbarui data kategori spesialis
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

        {/* FORM */}
        <form onSubmit={handleUpdate}>

          <div className="p-8 space-y-6">

            {/* Nama */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Nama Spesialis
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="text"
                required
                value={formData.specialis_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialis_name:
                      e.target.value,
                  })
                }
                placeholder="Masukkan nama spesialis"
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
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Deskripsi
                <span className="text-red-500 ml-1">*</span>
              </label>

              <textarea
                rows={5}
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description:
                      e.target.value,
                  })
                }
                placeholder="Masukkan deskripsi spesialis"
                className="
                  w-full
                  px-5
                  py-4
                  border
                  border-gray-200
                  rounded-2xl
                  text-gray-700
                  resize-none
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-100
                  focus:border-blue-500
                "
              />
            </div>

          </div>

          {/* FOOTER */}
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
              Update
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}