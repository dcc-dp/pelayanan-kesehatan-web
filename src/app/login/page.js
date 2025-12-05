"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.username === "" || form.password === "") {
      alert("Username dan password wajib diisi!");
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-4">
          <FaUserCircle className="text-6xl text-blue-700" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6 text-black">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-black"
              placeholder="Masukkan username"
            />
          </div>

          <div className="mb-6">
            <label className="block text-black mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-black"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
