"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FaClipboardList, FaPlusSquare } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Sidebar from "@/src/components/sidebar";

const DataConsultations = () => {
  const [consultationsData, setConsultationsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConsultations() {
      try {
        setLoading(true);
        const response = await fetch("/api/consultations");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("consultations dari API:", data);
        setConsultationsData(data);
      } catch (error) {
        console.error("Error fetching consultations:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchConsultations();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus consultations ini?")) return;

    try {
      const response = await fetch(`/api/consultations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus consultations");
      }

      setConsultationsData((prev) => prev.filter((item) => item.id !== id));
      alert("consultations berhasil dihapus!");
    } catch (error) {
      console.error("Gagal menghapus consultations:", error);
      alert("Terjadi kesalahan saat menghapus consultations.");
    }
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return consultationsData;

    return consultationsData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [consultationsData, searchQuery]);

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 bg-[#fefbff] p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-semibold flex items-center space-x-2">
            <FaClipboardList className="text-black" />
            <span className="text-black">Daftar consultations</span>
          </h1>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="flex items-center w-full border border-gray-300 rounded-md">
              <input
                type="text"
                placeholder="Search for..."
                className="px-4 py-1 rounded-l-md focus:outline-none text-black w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-pink-300 p-2 rounded-r-md text-white">
                <FiSearch />
              </button>
            </div>

            <Link href="/tambah-consultations">
              <button className="flex items-center bg-pink-300 hover:bg-pink-200 text-white px-3 py-2 rounded-md whitespace-nowrap">
                <FaPlusSquare className="mr-2" />
                Tambah 
              </button>
            </Link>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-600">Memuat data...</div>
        )}

        {error && (
          <div className="text-center text-red-600">Error: {error}</div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-pink-300">
                <tr>
                  {[
                    "No",
                    "ID",
                    "users_id",
                    "doctors_id",
                    "Tgl Buat",
                    "Tgl Ubah",
                    "Aksi",
                  ].map((header, i) => (
                    <th
                      key={i}
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 text-sm">{index + 1}</td>
                      <td className="px-6 py-4 text-sm">{item.id}</td>
                      <td className="px-6 py-4 text-sm">{item.users_id}</td>
                      <td className="px-6 py-4 text-sm">{item.doctors_id}</td>
                      <td className="px-6 py-4 text-sm">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.updated_at
                          ? new Date(item.updated_at).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <Link href={`/consultations/edit/${item.id}`}>
                          <button className="bg-blue-400 hover:bg-blue-300 text-white px-5 py-1 rounded-md text-sm">
                            Edit
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 mt-2 rounded-md text-sm"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Tidak ada consultations ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default DataConsultations;
