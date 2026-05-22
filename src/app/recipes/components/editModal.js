"use client";
import { useState, useEffect } from "react";

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
      const res = await fetch(`/api/recipes/${id}`);
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

    const res = await fetch("/api/recipes", {
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit resep</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
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
              {users.map((u, index) => (
                <option key={u.id || index} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

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
              {doctors.map((d, index) => (
                <option key={d.id || index} value={d.id}>
                  {d.name}
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
