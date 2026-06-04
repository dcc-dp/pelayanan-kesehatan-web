"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/src/components/sidebar";
import { 
  FaUserFriends, 
  FaUserMd, 
  FaCalendarAlt, 
  FaClipboardList,
  FaArrowRight
} from "react-icons/fa";
import Link from "next/link";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    schedules: 0,
    bookings: 0,
  });
  const [recentSchedules, setRecentSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all endpoints concurrently
        const [usersRes, doctorsRes, schedulesRes, bookingsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/doctor"),
          fetch("/api/schedules"),
          fetch("/api/bookings"),
        ]);

        const users = await usersRes.json();
        const doctors = await doctorsRes.json();
        const schedules = await schedulesRes.json();
        const bookings = await bookingsRes.json();

        // Calculate unique bookings since the bookings API returns flatMapped items
        const uniqueBookings = new Set(Array.isArray(bookings) ? bookings.map(b => b.id) : []).size;

        setStats({
          users: Array.isArray(users) ? users.length : 0,
          doctors: Array.isArray(doctors) ? doctors.length : 0,
          schedules: Array.isArray(schedules) ? schedules.length : 0,
          bookings: uniqueBookings,
        });

        // Get 5 most recent schedules (assuming descending id or date)
        if (Array.isArray(schedules)) {
          // Sort by ID descending as a proxy for newest
          const sorted = [...schedules].sort((a, b) => b.id - a.id);
          setRecentSchedules(sorted.slice(0, 5));
        }

      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Patients",
      value: stats.users,
      icon: <FaUserFriends size={28} className="text-blue-600" />,
      bg: "bg-blue-50",
      url: "/user"
    },
    {
      title: "Total Doctors",
      value: stats.doctors,
      icon: <FaUserMd size={28} className="text-teal-600" />,
      bg: "bg-teal-50",
      url: "/doctor"
    },
    {
      title: "Appointments",
      value: stats.schedules,
      icon: <FaCalendarAlt size={28} className="text-purple-600" />,
      bg: "bg-purple-50",
      url: "/schedules"
    },
    {
      title: "Total Bookings",
      value: stats.bookings,
      icon: <FaClipboardList size={28} className="text-orange-600" />,
      bg: "bg-orange-50",
      url: "/bookings"
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Welcome Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-blue-100 max-w-xl">
              Here is what's happening at MediCare Hospital today. Check the latest appointments, patient registrations, and doctor availability.
            </p>
          </div>
          {/* Decorative Circles */}
          <div className="absolute -right-10 -top-24 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute right-32 -bottom-20 w-48 h-48 bg-white opacity-10 rounded-full blur-xl"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card, idx) => (
                <Link href={card.url} key={idx}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-full ${card.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        {card.icon}
                      </div>
                      <FaArrowRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-gray-800 mb-1">
                        {card.value}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                        {card.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Schedules & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Schedules Table */}
              <div className="lg:col-span-2 bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Recent Appointments</h2>
                  <Link href="/schedules" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    View All <FaArrowRight size={12} />
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f8fafc] rounded-xl">
                      <tr>
                        <th className="px-5 py-4 text-left text-[14px] font-semibold text-gray-600 rounded-l-xl">Pasien</th>
                        <th className="px-5 py-4 text-left text-[14px] font-semibold text-gray-600">Dokter</th>
                        <th className="px-5 py-4 text-left text-[14px] font-semibold text-gray-600">Jadwal</th>
                        <th className="px-5 py-4 text-left text-[14px] font-semibold text-gray-600 rounded-r-xl">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSchedules.length > 0 ? (
                        recentSchedules.map((schedule) => (
                          <tr key={schedule.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                            <td className="px-5 py-4 font-medium text-gray-800">
                              {schedule.nama_pasien || "-"}
                            </td>
                            <td className="px-5 py-4 text-gray-600">
                              {schedule.nama_dokter || "-"}
                            </td>
                            <td className="px-5 py-4">
                              <div className="text-sm font-medium text-gray-800">
                                {schedule.date ? new Date(schedule.date).toLocaleDateString() : "-"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {schedule.time ? new Date(schedule.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                                schedule.status === 'terima' ? 'bg-green-100 text-green-700' :
                                schedule.status === 'tolak' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {schedule.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-gray-500 text-sm">
                            Belum ada jadwal konsultasi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Summary / Side Panel */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[24px] shadow-sm p-6 text-white relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Hospital Status</h3>
                  <p className="text-indigo-100 text-sm mb-6">
                    Sistem beroperasi dengan normal. Server API dalam keadaan stabil.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex justify-between items-center border border-white/20">
                      <span className="font-medium text-sm">System Health</span>
                      <span className="flex items-center gap-2 text-sm font-bold text-green-300">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        100% Online
                      </span>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex justify-between items-center border border-white/20">
                      <span className="font-medium text-sm">Database Sync</span>
                      <span className="text-sm font-bold text-blue-200">
                        Up to date
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 -right-12 w-24 h-24 bg-purple-400 opacity-20 rounded-full blur-xl"></div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
