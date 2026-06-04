"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";
import { FaLock, FaEnvelope, FaSignInAlt, FaHospitalUser } from "react-icons/fa";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.email === "" || form.password === "") {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Email dan password wajib diisi!",
      });
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: res.error,
      });
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 opacity-20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 opacity-20 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-4xl bg-white rounded-[32px] shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 border border-gray-100">
        
        {/* Left Side: Branding / Welcome */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center">
                <FaHospitalUser className="text-xl" />
              </div>
              <h1 className="text-2xl font-bold tracking-wide">MediCare</h1>
            </div>
            
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">
              Welcome Back to Your Dashboard
            </h2>
            <p className="text-blue-100 text-lg">
              Manage your patients, doctor schedules, and hospital administration seamlessly all in one place.
            </p>
          </div>

          {/* Decorative Circles inside left panel */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute left-10 top-1/2 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-12 bg-white flex flex-col justify-center">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h3>
            <p className="text-gray-500">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
                  placeholder="admin@medicare.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transform transition-all active:scale-[0.98] ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <FaSignInAlt />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <a href="#" className="text-blue-600 font-semibold hover:underline">Contact Administrator</a>
          </p>
        </div>

      </div>
    </div>
  );
}
