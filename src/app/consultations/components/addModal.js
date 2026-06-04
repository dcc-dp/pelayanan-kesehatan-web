"use client";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function AddModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    users_id: "",
    doctors_id: "",
  });

  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Fetch data users & doctors ketika modal dibuka
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/consultations", {
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
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100">
        
                  <div className="flex items-center gap-5">
        
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                      <span className="text-4xl text-blue-600">+</span>
                    </div>
        
                    <div>
                      <h2 className="text-3xl font-semibold text-gray-800">
                        Tambah Konsultasi
                      </h2>
        
                      <p className="text-gray-500 mt-1">
                        Tambahkan konsultasi baru
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

        <form onSubmit={handleSubmit}>

        <div className="p-8 space-y-6">
          
          {/* Dropdown Users */}
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
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Doctors */}
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
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
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
