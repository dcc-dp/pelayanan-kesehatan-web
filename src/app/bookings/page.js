"use client";

import { useState, useEffect, useMemo } from "react";
<<<<<<< HEAD
import { FaClipboardList } from "react-icons/fa";
=======
import Link from "next/link";

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
import { FiSearch } from "react-icons/fi";

import Sidebar from "@/src/components/sidebar";
import EditModal from "../bookings/components/editModal";

const DataBookings = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔥 Fetch Data
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("./api/bookings");

      if (!response.ok) throw new Error("Gagal memuat data bookings");

      const data = await response.json();
      setBookingsData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
=======
  useEffect(() => {
    async function fetchBooking() {
      try {
        const response = await fetch("/api/bookings");
        const data = await response.json();

        setBookingData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
    }
  };

  useEffect(() => {
    loadData();
  }, []);

<<<<<<< HEAD
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus booking ini?")) return;

    try {
      const response = await fetch(`/api/bookings`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Gagal menghapus booking");

      // Hapus dari data frontend tanpa reload
      setBookingsData((prev) => prev.filter((item) => item.id !== id));

      alert("Booking berhasil dihapus!");
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus booking.");
      console.error(error);
    }
  };

  // 🔍 Search / Filtering
=======
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
  const filteredData = useMemo(() => {
    if (!searchQuery) return bookingsData;

    return bookingsData.filter((item) =>
      Object.values(item).some((val) =>
<<<<<<< HEAD
        String(val || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
=======
        String(val)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
    );
  }, [bookingsData, searchQuery]);

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus booking ini?"))
      return;

    try {
      await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });

      setBookingData((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fe]">
      <Sidebar />

<<<<<<< HEAD
      <main className="flex-1 bg-[#fefbff] p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-semibold flex items-center space-x-2">
            <FaClipboardList className="text-black" />
            <span className="text-black">Daftar Bookings</span>
          </h1>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            {/* Search Box */}
            <div className="flex items-center w-full border border-gray-300 rounded-md">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-1 rounded-l-md focus:outline-none text-black w-full"
=======
      <main className="flex-1">
        {/* TOPBAR */}
        <div className="bg-white px-8 py-5 border-b flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#1b2559]">
              Bookings
            </h1>

            <p className="text-gray-500 mt-1">
              Dashboard &gt; Bookings
            </p>
          </div>

          <div className="flex items-center gap-5">
            {/* SEARCH */}
            <div className="flex items-center bg-[#f4f7fe] px-5 py-3 rounded-2xl border w-[320px]">
              <FiSearch className="text-gray-400 mr-3" />

              <input
                type="text"
                placeholder="Search for..."
                className="bg-transparent outline-none w-full text-sm"
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
<<<<<<< HEAD
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-600">Memuat data...</div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-600">Error: {error}</div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-pink-300">
                <tr>
                  {[
                    "No",
                    "ID",
                    "id resep",
                    "Total",
                    "nama obat",
                    "harga",
                    "jumlah minum",
                    "jumlah hari",
                    "waktu minum",
                    "nama pembeli",
                    "nama dokter",
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

              <tbody className="bg-white text-black divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 text-sm">{index + 1}</td>
                      <td className="px-6 py-4 text-sm">{item.id}</td>
                      <td className="px-6 py-4 text-sm ">{item.recipes_id}</td>
                      <td className="px-6 py-4 text-sm">{item.total}</td>
                      <td className="px-6 py-4 text-sm">{item.obat}</td>
                      <td className="px-6 py-4 text-sm">{item.harga}</td>
                      <td className="px-6 py-4 text-sm">{item.jumlah_minum}</td>
                      <td className="px-6 py-4 text-sm">{item.jumlah_hari}</td>
                      <td className="px-6 py-4 text-sm">{item.waktu_minum}</td>
                      <td className="px-6 py-4 text-sm">{item.nm_pembeli}</td>
                      <td className="px-6 py-4 text-sm">{item.nm_dokter}</td>

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
                      colSpan={8}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Tidak ada data Booking.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
=======

            {/* ADMIN */}
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/45"
                alt="admin"
                className="w-12 h-12 rounded-full"
              />

              <div>
                <h3 className="font-semibold text-[#1b2559]">
                  Admin
                </h3>

                <p className="text-sm text-gray-500">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          {/* CARD STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* TOTAL */}
            <div className="bg-white rounded-3xl p-6 border shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">
                    Total Booking
                  </p>

                  <h2 className="text-4xl font-bold text-[#1b2559] mt-3">
                    {bookingData.length}
                  </h2>

                  <p className="text-green-500 text-sm mt-2">
                    ↑ 12.5% dari bulan lalu
                  </p>
                </div>

                <div className="bg-blue-100 p-5 rounded-full">
                  <FaCalendarAlt className="text-blue-600 text-3xl" />
                </div>
              </div>
            </div>

            {/* CONFIRMED */}
            <div className="bg-white rounded-3xl p-6 border shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">
                    Booking Confirmed
                  </p>

                  <h2 className="text-4xl font-bold text-[#1b2559] mt-3">
                    972
                  </h2>

                  <p className="text-green-500 text-sm mt-2">
                    ↑ 8.3% dari bulan lalu
                  </p>
                </div>

                <div className="bg-green-100 p-5 rounded-full">
                  <FaCheckCircle className="text-green-600 text-3xl" />
                </div>
              </div>
            </div>

            {/* PENDING */}
            <div className="bg-white rounded-3xl p-6 border shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">
                    Booking Pending
                  </p>

                  <h2 className="text-4xl font-bold text-[#1b2559] mt-3">
                    214
                  </h2>

                  <p className="text-red-400 text-sm mt-2">
                    ↓ 4.1% dari bulan lalu
                  </p>
                </div>

                <div className="bg-yellow-100 p-5 rounded-full">
                  <FaClock className="text-yellow-500 text-3xl" />
                </div>
              </div>
            </div>

            {/* CANCELLED */}
            <div className="bg-white rounded-3xl p-6 border shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">
                    Booking Cancelled
                  </p>

                  <h2 className="text-4xl font-bold text-[#1b2559] mt-3">
                    62
                  </h2>

                  <p className="text-red-400 text-sm mt-2">
                    ↓ 2.7% dari bulan lalu
                  </p>
                </div>

                <div className="bg-red-100 p-5 rounded-full">
                  <FaTimesCircle className="text-red-500 text-3xl" />
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            {/* HEADER */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-[#1b2559]">
                Bookings List
              </h2>

              <Link href="/tambah-bookings">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 transition">
                  <FaPlus />
                  New Booking
                </button>
              </Link>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f9fbfd]">
                  <tr>
                    {[
                      "#",
                      "ID Booking",
                      "Recipe",
                      "Total",
                      "Created",
                      "Updated",
                      "Status",
                      "Aksi",
                    ].map((head, i) => (
                      <th
                        key={i}
                        className="px-6 py-5 text-left text-sm font-semibold text-gray-500"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-10"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-5">
                          {index + 1}
                        </td>

                        <td className="px-6 py-5 font-semibold text-blue-600">
                          BK-{item.id}
                        </td>

                        <td className="px-6 py-5">
                          {item.recipes_id}
                        </td>

                        <td className="px-6 py-5">
                          Rp {item.total}
                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {item.updated_at
                            ? new Date(
                                item.updated_at
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                          <span className="bg-green-100 text-green-600 px-4 py-2 rounded-xl text-sm">
                            Confirmed
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="px-6 py-5">
                          <div className="flex gap-3">
                            <Link
                              href={`/booking/edit/${item.id}`}
                            >
                              <button className="w-10 h-10 rounded-xl border border-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
                                <FaEdit />
                              </button>
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(item.id)
                              }
                              className="w-10 h-10 rounded-xl border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center p-6 border-t">
              <p className="text-sm text-gray-500">
                Menampilkan {filteredData.length} data
              </p>

              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl border hover:bg-gray-100">
                  1
                </button>

                <button className="w-10 h-10 rounded-xl bg-blue-600 text-white">
                  2
                </button>

                <button className="w-10 h-10 rounded-xl border hover:bg-gray-100">
                  3
                </button>
              </div>
            </div>
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
          </div>
        </div>
      </main>

      {/* Modal Tambah */}

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

<<<<<<< HEAD
export default DataBookings;
=======
export default DataBooking;

>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
