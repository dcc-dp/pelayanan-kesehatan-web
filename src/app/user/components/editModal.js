"use client";
import { useState, useEffect } from "react";

export default function EditModal({ open, onClose, onSuccess, id }) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birth: "",
    address: "",
    whatsapp: "",
    email: "",
    password: "",
    image: "",
    role: "",
  });

  // Fetch data user ketika modal dibuka atau id berubah
  useEffect(() => {
    if (!open || !id) return;

    async function fetchUser() {
      try {
        const res = await fetch(`/api/users`);
        const data = await res.json();

        const user = data.find((u) => u.id === Number(id));
        if (user) {
          setFormData({
            name: user.name || "",
            gender:
              user.gender === "L"
                ? "Laki-laki"
                : user.gender === "P"
                ? "Perempuan"
                : user.gender || "", // jika sudah Laki-laki / Perempuan
            birth: user.birth ? user.birth.split("T")[0] : "",
            address: user.address || "",
            whatsapp: user.whatsapp || "",
            email: user.email || "",
            password: user.password || "",
            image: user.image || "",
            role: user.role || "",
          });
        }
      } catch (error) {
        console.error("Gagal fetch user:", error);
      }
    }

    fetchUser();
  }, [id, open]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Gagal update user:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="font-semibold">Nama</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Gender */}
          <div>
            <label className="font-semibold">Gender</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="">-- Pilih gender --</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="font-semibold">Tanggal Lahir</label>
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={formData.birth}
              onChange={(e) =>
                setFormData({ ...formData, birth: e.target.value })
              }
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="font-semibold">Alamat</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {/* Whatsapp */}
          <div>
            <label className="font-semibold">Whatsapp</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.whatsapp}
              onChange={(e) =>
                setFormData({ ...formData, whatsapp: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              className="border p-2 w-full rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-semibold">Password</label>
            <input
              type="password"
              className="border p-2 w-full rounded"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {/* Gambar */}
          <div>
            <label className="font-semibold">Gambar</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />
          </div>

          {/* Role */}
          <div>
            <label className="font-semibold">Role</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />
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
