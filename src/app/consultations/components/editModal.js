"use client";
import { useState, useEffect } from "react";
import { FiX, FiEdit2 } from "react-icons/fi";

export default function EditModal({ open, onClose, onSuccess, id }) {
  const [formData, setFormData] = useState({
    users_id: "",
    doctors_id: "",
  });

  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchDoctors();
    }
  }, [open]);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const fetchDoctors = async () => {
    const res = await fetch("/api/doctor");
    const data = await res.json();
    setDoctors(data);
  };

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      const res = await fetch(`/api/consultations/${id}`);
      const data = await res.json();

      setFormData({
        users_id: data[0]?.users_id,
        doctors_id: data[0]?.doctors_id,
      });
    }
    fetchData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/consultations", {
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
                Edit Konsultasi
              </h2>

              <p className="text-gray-500 mt-1">
                Perbarui data konsultasi
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

         <form onSubmit={handleUpdate}>
          <div className="p-8 space-y-6">
          <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                Pilih Pasien
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
              {users.map((u, index) => (
                <option key={u.id || index} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-lg font-medium text-gray-700 mb-3">
              Pilih Dokter
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
              value={formData.doctors_id}
              onChange={(e) =>
                setFormData({ ...formData, doctors_id: e.target.value })
              }
            >
              <option value="">-- Pilih Dokter --</option>
              {doctors.map((d, index) => (
                <option key={d.id || index} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
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
