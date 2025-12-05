"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaClipboardCheck } from "react-icons/fa";

const TambahBooking = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    recipes_id: "",
    total: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.recipes_id || !formData.total) {
      setError("Semua field wajib diisi!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menambahkan booking");

      setSuccess(true);
      setTimeout(() => router.push("/bookings"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start bg-gray-100 p-8 min-h-screen">
      <main className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl text-black border border-gray-200">

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-pink-400 flex justify-center items-center gap-3">
            <FaClipboardCheck className="text-pink-400" />
            Tambah Booking
          </h1>
      
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

        
          <FormGroup
            label="ID Resep"
            name="recipes_id"
            type="number"
            value={formData.recipes_id}
            onChange={handleInputChange}
          />

       
          <FormGroup
            label="Total"
            name="total"
            type="number"
            value={formData.total}
            onChange={handleInputChange}
          />

         
          {loading && <p className="text-blue-600 text-sm">Menyimpan booking...</p>}
          {error && <p className="text-red-600 text-sm">Error: {error}</p>}
          {success && <p className="text-green-600 text-sm">Booking berhasil ditambahkan. Mengalihkan...</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-pink-500 hover:bg-pink-400 transition text-white font-semibold px-6 py-2 rounded-lg shadow-sm"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Booking"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 hover:bg-gray-300 transition text-gray-700 font-semibold px-6 py-2 rounded-lg shadow-sm"
            >
              Kembali
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};


const FormGroup = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
    />
  </div>
);

export default TambahBooking;