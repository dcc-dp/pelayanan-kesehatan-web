"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaBars,
  FaHome,
  FaUserFriends,
  FaUserMd,
  FaCalendarAlt,
  FaClipboardList,
  FaFileMedical,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const MenuItem = ({ icon, label, collapsed, url }) => (
    <div className="flex items-center space-x-4 text-white hover:text-pink-300 cursor-pointer">
      <span className="text-lg">{icon}</span>
      {!collapsed && (
        <Link href={url}>
          <span className="text-sm">{label}</span>
        </Link>
      )}
    </div>
  );

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-[#1a1313] text-white flex flex-col transition-all duration-300`}
    >
      
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700 text-pink-300">
        <div
          className={`text-xl italic font-semibold ${
            collapsed ? "hidden" : "block"
          }`}
        >
          Pelayanan Kesehatan Web
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white text-xl focus:outline-none"
        >
          <FaBars />
        </button>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 mt-6 space-y-6 px-4">
        <MenuItem
          icon={<FaHome />}
          label="Dashboard"
          collapsed={collapsed}
          url="/admin"
        />

        <MenuItem
          icon={<FaUserFriends />}
          label="Data Pasien"
          collapsed={collapsed}
          url="/admin/patients"
        />

        <MenuItem
          icon={<FaUserMd />}
          label="Data Dokter"
          collapsed={collapsed}
          url="/admin/doctors"
        />

        <MenuItem
          icon={<FaCalendarAlt />}
          label="Jadwal Dokter"
          collapsed={collapsed}
          url="/admin/schedule"
        />

        <MenuItem
          icon={<FaClipboardList />}
          label="Daftar Booking"
          collapsed={collapsed}
          url="/admin/bookings"
        />

        <MenuItem
          icon={<FaFileMedical />}
          label="Rekam Medis / Resep"
          collapsed={collapsed}
          url="/admin/records"
        />

       
        <div className="mt-auto">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-4 text-white hover:text-pink-300"
          >
            <FiLogOut /> {!collapsed && "Logout"}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
