"use client";

import { useState, useEffect, useMemo } from "react";
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

import { FiSearch } from "react-icons/fi";

import Sidebar from "@/src/components/sidebar";

const DataBooking = () => {
  const [bookingData, setBookingData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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
    }

    fetchBooking();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return bookingData;

    return bookingData.filter((item) =>
      Object.values(item).some((val) =>
        String(val)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [bookingData, searchQuery]);

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
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>

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
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataBooking;

