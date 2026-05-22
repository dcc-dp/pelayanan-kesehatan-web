"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const menuItems = [
    {
      icon: <FaHome />,
      label: "Dashboard",
      url: "/admin",
    },
    {
      icon: <FaUserFriends />,
      label: "Data Pasien",
      url: "/admin/patients",
    },
    {
      icon: <FaUserMd />,
      label: "Data Dokter",
      url: "/admin/doctors",
    },
    {
      icon: <FaCalendarAlt />,
      label: "Jadwal Dokter",
      url: "/admin/schedule",
    },
    {
      icon: <FaClipboardList />,
      label: "Bookings",
      url: "/admin/bookings",
    },
    {
      icon: <FaFileMedical />,
      label: "Rekam Medis",
      url: "/admin/records",
    },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col transition-all duration-300 shadow-xl`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-blue-400">
        {!collapsed && (
          <div>
            <h1 className="text-2xl font-bold">MediCare</h1>
            <p className="text-xs text-blue-100">
              Hospital Management
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xl hover:text-gray-200 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item, index) => {
          const active = pathname === item.url;

          return (
            <Link key={index} href={item.url}>
              <div
                className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                  
                  ${
                    active
                      ? "bg-blue-900 shadow-lg"
                      : "hover:bg-blue-700"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>

                {!collapsed && (
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-blue-400">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-4 w-full px-4 py-3 rounded-xl hover:bg-red-500 transition"
        >
          <FiLogOut className="text-lg" />

          {!collapsed && (
            <span className="text-sm font-medium">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

