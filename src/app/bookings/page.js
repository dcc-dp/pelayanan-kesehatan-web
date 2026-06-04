"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/src/components/sidebar";
import AddModal from "../bookings/components/addModal";
import EditModal from "../bookings/components/editModal";
import { FiSearch, FiFilter } from "react-icons/fi";

const DataBookings = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings");

      if (!response.ok) {
        throw new Error("Gagal memuat data bookings");
      }

      const data = await response.json();
      setBookingsData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus booking ini?")) return;

    try {
      const response = await fetch(`/api/bookings`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus booking");
      }

      setBookingsData((prev) => prev.filter((item) => item.id !== id));
      alert("Booking berhasil dihapus!");
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus.");
      console.error(error);
    }
  };

  const filteredData = useMemo(() => {
    return bookingsData.filter((item) => {
      if (!searchQuery) return true;
      return Object.values(item).some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });
  }, [bookingsData, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Compute unique bookings for the summary card since API returns multiple lines per booking
  const uniqueBookingsCount = new Set(bookingsData.map(b => b.id)).size;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Booking Management
          </h1>
          <div className="flex items-center gap-3 mt-2 text-sm">
            <span className="text-blue-600 font-medium">Dashboard</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-500">Booking Management</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 w-[430px]">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <h2 className="text-4xl font-semibold text-gray-900">
                {uniqueBookingsCount}
              </h2>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden mt-2">
          <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-[22px] font-semibold text-gray-800">
              Booking List
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search booking..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[260px] h-[46px] border border-gray-200 rounded-xl pl-4 pr-12 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              </div>

              <button
                onClick={() => setOpenAdd(true)}
                className="h-[46px] px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 font-medium transition"
              >
                <span className="text-lg">+</span>
                Add Booking
              </button>
            </div>
          </div>

          {loading && (
            <div className="p-10 text-center text-gray-500">Memuat data...</div>
          )}

          {error && (
            <div className="p-10 text-center text-red-500">{error}</div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <th className="px-6 py-5 text-left text-[15px] font-semibold text-gray-700">#</th>
                    <th className="px-6 py-5 text-left text-[15px] font-semibold text-gray-700">ID</th>
                    <th className="px-6 py-5 text-left text-[15px] font-semibold text-gray-700">Pasien</th>
                    <th className="px-6 py-5 text-left text-[15px] font-semibold text-gray-700">Dokter</th>
                    <th className="px-6 py-5 text-left text-[15px] font-semibold text-gray-700">Nama Obat</th>
                    <th className="px-6 py-5 text-left text-[15px] font-semibold text-gray-700">Total Harga</th>
                    <th className="px-6 py-5 text-left text-[15px] font-semibold text-gray-700">Tgl Buat</th>
                    <th className="px-6 py-5 text-left text-[15px] font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={`${item.id}-${index}`} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4 text-black">{startIndex + index + 1}</td>
                        <td className="px-6 py-4 text-black font-semibold text-blue-600">#{item.id}</td>
                        <td className="px-6 py-4 font-medium text-black">{item.nm_pembeli}</td>
                        <td className="px-6 py-4 text-gray-600">{item.nm_dokter}</td>
                        <td className="px-6 py-4 text-black">
                           {item.obat ? item.obat : <span className="text-gray-400 italic">Tidak ada obat</span>}
                        </td>
                        <td className="px-6 py-4 text-green-600 font-semibold">
                          {item.total ? `Rp ${item.total.toLocaleString("id-ID")}` : "-"}
                        </td>
                        <td className="px-6 py-4 text-black">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => {
                              setEditId(item.id);
                              setOpenEdit(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-gray-500">
                        <div className="h-[260px] flex flex-col items-center justify-center">
                          <div className="text-6xl mb-5 opacity-30">📂</div>
                          <h3 className="font-semibold text-gray-700">Tidak ada data booking.</h3>
                          <p className="text-gray-400 mt-2">
                            Klik tombol "Add Booking" untuk membuat billing baru.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex justify-between items-center px-8 py-6 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {filteredData.length === 0 ? 0 : startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="w-10 h-10 border border-gray-200 rounded-lg disabled:opacity-50"
                  >
                    «
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="w-10 h-10 border border-gray-200 rounded-lg disabled:opacity-50"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {openAdd && (
        <AddModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onSuccess={loadData}
        />
      )}

      {openEdit && (
        <EditModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          id={editId}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};

export default DataBookings;