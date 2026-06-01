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
    url: "/dashboard",
  },
  {
    icon: <FaClipboardList />,
    label: "Bookings",
    url: "/bookings",
  },
  {
    icon: <FaClipboardList />,
    label: "Category Specialist",
    url: "/category-spesialis",
  },
  {
    icon: <FaUserFriends />,
    label: "Consultations",
    url: "/consultations",
  },
  {
    icon: <FaFileMedical />,
    label: "Details",
    url: "/details",
  },
  {
    icon: <FaUserMd />,
    label: "Doctor",
    url: "/doctor",
  },
  {
    icon: <FaFileMedical />,
    label: "Drugs",
    url: "/drugs",
  },
  {
    icon: <FaFileMedical />,
    label: "Recipes",
    url: "/recipes",
  },
  {
    icon: <FaCalendarAlt />,
    label: "Schedules",
    url: "/schedules",
  },
];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-[280px]"
      } min-h-screen bg-gradient-to-b from-[#1f6feb] via-[#1b5fd8] to-[#1547b8] text-white flex flex-col transition-all duration-300 shadow-xl`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-blue-400/30">
        {!collapsed && (
          <div>
            <h1 className="text-[18px] font-bold tracking-tight">MediCare</h1>
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
      <nav className="flex-1 px-4 py-8 space-y-3">
        {menuItems.map((item, index) => {
          const active =
          pathname === item.url ||
          pathname.startsWith(item.url + "/");

          return (
            <Link key={index} href={item.url}>
              <div
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200
                  
                  ${
                    active
                      ? "bg-blue-800 shadow-md"
                      : "hover:bg-blue-700/60"
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
      <div className="p-4 border-t border-blue-400/30">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
         className="flex items-center gap-4 w-full px-4 py-3 rounded-xl hover:bg-red-500/90 transition-all duration-200"
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

