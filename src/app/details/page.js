"use client";

import { useState, useEffect, useMemo } from "react";
import { FaClipboardList } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Sidebar from "@/src/components/sidebar";
import AddModal from "../details/components/addModal";
import EditModal from "../details/components/editModal";

const DataDetails = () => {
  const [detailsData, setDetailsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/details");

      if (!response.ok) throw new Error("Gagal memuat data");

      const data = await response.json();
      console.log("DATA DARI API:", data); // 🔥 TAMBAHKAN INI
      setDetailsData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔥 Hapus Data
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      const response = await fetch(`/api/details`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Gagal menghapus detail");

      setDetailsData((prev) => prev.filter((item) => item.id !== id));
      alert("detail berhasil dihapus!");
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus.");
      console.error(error);
    }
  };

  // 🔍 Filter Pencarian
  const filteredData = useMemo(() => {
    if (!searchQuery) return detailsData;

    return detailsData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [detailsData, searchQuery]);

  return (
    <div className="flex min-h-screen font-sans text-black">
      <Sidebar />

      <main className="flex-1 bg-[#fefbff] p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-semibold flex items-center space-x-2">
            <FaClipboardList className="text-black" />
            <span className="text-black">Daftar detail</span>
          </h1>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="flex items-center w-full border border-gray-300 rounded-md">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-1 rounded-l-md focus:outline-none text-black w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-pink-300 p-2 rounded-r-md text-white">
                <FiSearch />
              </button>
            </div>

            <button
              onClick={() => setOpenAdd(true)}
              className="bg-pink-300 text-white px-4 py-2 rounded"
            >
              Tambah detail
            </button>
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
                    "nama pasien",
                    "nama Dokter",
                    "jumlah minum",
                    "jumlah hari",
                    "waktu minum",
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
                      <td className="px-6 py-4 text-sm">{item.nm_pasien}</td>
                      <td className="px-6 py-4 text-sm">{item.nm_pasien}</td>
                      <td className="px-6 py-4 text-sm">{item.jumlah_minum}</td>
                      <td className="px-6 py-4 text-sm">{item.jumlah_hari}</td>
                      <td className="px-6 py-4 text-sm">{item.waktu_minum}</td>

                      <td className="px-6 py-4 text-sm">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {item.updated_at
                          ? new Date(item.updated_at).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => {
                            setEditId(item.id);
                            setOpenEdit(true);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
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
                      Tidak ada data kategori.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal Tambah */}
      <AddModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={loadData}
      />

      {/* Modal Edit */}
      <EditModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        id={editId}
        onSuccess={loadData}
      />
    </div>
  );
};

export default DataDetails;
