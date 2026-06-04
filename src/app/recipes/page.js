"use client";

import { useState, useEffect, useMemo } from "react";
<<<<<<< HEAD
import { FaClipboardList } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Sidebar from "@/src/components/sidebar";
<<<<<<<< HEAD:src/app/recipes/page.js
import AddModal from "../recipes/components/addModal";
import EditModal from "../recipes/components/editModal";
========
import AddModal from "../details/components/addModal";
import EditModal from "../details/components/editModal";
>>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877:src/app/details/page.js

const DataRecipes = () => {
=======
import { useRouter } from "next/navigation";
import { FaClipboardList } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Sidebar from "@/src/components/sidebar";
import AddModal from "../recipes/components/addModal";
import EditModal from "../recipes/components/editModal";

const DataRecipes = () => {
  const router = useRouter();

>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
  const [recipesData, setRecipesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);

<<<<<<< HEAD
  const loadData = async () => {
    try {
      setLoading(true);
<<<<<<<< HEAD:src/app/recipes/page.js
      const response = await fetch("/api/recipes");
========
      const response = await fetch("/api/details");
>>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877:src/app/details/page.js
=======
  // 🔄 Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/recipes");
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877

      if (!response.ok) throw new Error("Gagal memuat data");

      const data = await response.json();
<<<<<<< HEAD
<<<<<<<< HEAD:src/app/recipes/page.js
      setRecipesData(data);
========
      console.log("DATA DARI API:", data); // 🔥 TAMBAHKAN INI
      setDetailsData(data);
>>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877:src/app/details/page.js
=======
      setRecipesData(data);
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
<<<<<<< HEAD
<<<<<<<< HEAD:src/app/recipes/page.js
========

  // 🔥 Hapus Data
=======

  // 🗑️ Hapus Data
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
<<<<<<< HEAD
      const response = await fetch(`/api/details`, {
=======
      const response = await fetch("/api/recipes", {
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

<<<<<<< HEAD
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
>>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877:src/app/details/page.js

  // 🔥 Hapus Data
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      const response = await fetch(`/api/recipes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Gagal menghapus konsultasi");

      setConsultationsData((prev) => prev.filter((item) => item.id !== id));
      alert("konsultasi berhasil dihapus!");
=======
      if (!response.ok) throw new Error("Gagal menghapus resep");

      setRecipesData((prev) => prev.filter((item) => item.id !== id));
      alert("Resep berhasil dihapus!");
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus.");
      console.error(error);
    }
  };

  // 🔍 Filter Pencarian
  const filteredData = useMemo(() => {
    if (!searchQuery) return recipesData;

    return recipesData.filter((item) =>
      Object.values(item).some((val) =>
<<<<<<< HEAD
        String(val).toLowerCase().includes(searchQuery.toLowerCase()),
      ),
=======
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
    );
  }, [recipesData, searchQuery]);

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen font-sans text-black">
      <Sidebar />

      <main className="flex-1 bg-[#fefbff] p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-semibold flex items-center space-x-2">
            <FaClipboardList className="text-black" />
<<<<<<<< HEAD:src/app/recipes/page.js
            <span className="text-black">Daftar Resep Obat</span>
========
            <span className="text-black">Daftar detail</span>
>>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877:src/app/details/page.js
          </h1>

          <div className="flex items-center space-x-2 w-full md:w-auto">
=======
    <div className="flex min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 bg-[#fefbff] p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-black">
            <FaClipboardList />
            Daftar Resep
          </h1>

          <div className="flex items-center gap-2 w-full md:w-auto">
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
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
<<<<<<< HEAD
<<<<<<<< HEAD:src/app/recipes/page.js
              Tambah Resep
========
              Tambah detail
>>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877:src/app/details/page.js
=======
              Tambah Resep
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
            </button>
          </div>
        </div>

<<<<<<< HEAD
        {loading && (
          <div className="text-center text-gray-600">Memuat data...</div>
        )}
=======
        {/* Loading & Error */}
        {loading && (
          <div className="text-center text-gray-600">Memuat data...</div>
        )}

>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
        {error && (
          <div className="text-center text-red-600">Error: {error}</div>
        )}

<<<<<<< HEAD
        {!loading && !error && (
          <div className="overflow-x-auto shadow-md rounded-lg">
=======
        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto shadow-md rounded-lg text-black">
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-pink-300">
                <tr>
                  {[
                    "No",
                    "ID",
<<<<<<< HEAD
<<<<<<<< HEAD:src/app/recipes/page.js
                    "users_id",
                    "doctors_id",
========
                    "nama pasien",
                    "nama Dokter",
                    "jumlah minum",
                    "jumlah hari",
                    "waktu minum",
>>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877:src/app/details/page.js
=======
                    "Pasien",
                    "Dokter",
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
                    "Tgl Buat",
                    "Tgl Ubah",
                    "Aksi",
                  ].map((header, i) => (
                    <th
                      key={i}
<<<<<<< HEAD
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
=======
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase"
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

<<<<<<< HEAD
              <tbody className="bg-white text-black divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 text-sm">{index + 1}</td>
                      <td className="px-6 py-4 text-sm">{item.id}</td>
<<<<<<<< HEAD:src/app/recipes/page.js
                      <td className="px-6 py-4 text-sm">{item.pasien}</td>
                      <td className="px-6 py-4 text-sm">{item.dokter}</td>
========
                      <td className="px-6 py-4 text-sm">{item.nm_pasien}</td>
                      <td className="px-6 py-4 text-sm">{item.nm_pasien}</td>
                      <td className="px-6 py-4 text-sm">{item.jumlah_minum}</td>
                      <td className="px-6 py-4 text-sm">{item.jumlah_hari}</td>
                      <td className="px-6 py-4 text-sm">{item.waktu_minum}</td>
>>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877:src/app/details/page.js

                      <td className="px-6 py-4 text-sm">
=======
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{item.id}</td>
                      <td className="px-6 py-4">{item.pasien}</td>
                      <td className="px-6 py-4">{item.dokter}</td>
                      <td className="px-6 py-4">
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : "-"}
                      </td>
<<<<<<< HEAD

                      <td className="px-6 py-4 text-sm">
=======
                      <td className="px-6 py-4">
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
                        {item.updated_at
                          ? new Date(item.updated_at).toLocaleString()
                          : "-"}
                      </td>

<<<<<<< HEAD
                      <td className="px-6 py-4 text-sm flex gap-2">
=======
                      {/* 🔘 AKSI */}
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() =>
                            router.push(`../recipes/${item.id}/details`)
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Detail
                        </button>

>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
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
<<<<<<< HEAD
<<<<<<<< HEAD:src/app/recipes/page.js
                      Tidak ada data Konsultasi.
========
                      Tidak ada data kategori.
>>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877:src/app/details/page.js
=======
                      Tidak ada data resep.
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
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

export default DataRecipes;
