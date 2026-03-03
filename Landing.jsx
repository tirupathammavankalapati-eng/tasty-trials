import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const url = mode === "login" ? "/auth/login" : "/auth/signup";
    const payload = mode === "login" ? { email: form.email, password: form.password } : form;
    const { data } = await api.post(url, payload);
    localStorage.setItem("token", data.token);
    nav("/home");
  }

  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1600&auto=format&fit=crop&q=60)' }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 min-h-screen grid place-items-center p-4">
        <div className="w-full max-w-md p-6 sm:p-8 bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-[#ffad33]">
          <div className="text-center text-2xl font-extrabold mb-6 text-gray-900">Food App</div>
          <div className="flex justify-center gap-3 mb-5">
            <button
              className={`px-4 py-2 rounded-full border ${mode==="login"?"bg-[#ffad33] text-white border-[#ffad33]":"border-[#ffad33] text-[#ffad33] bg-white hover:bg-[#ffad33]/10"}`}
              onClick={() => setMode("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded-full border ${mode==="signup"?"bg-[#ffad33] text-white border-[#ffad33]":"border-[#ffad33] text-[#ffad33] bg-white hover:bg-[#ffad33]/10"}`}
              onClick={() => setMode("signup")}
              type="button"
            >
              Sign Up
            </button>
          </div>
          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input className="w-full border border-[#ffad33] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#ffad33]" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            )}
            <input className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
            <input className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
            <button className="w-full px-4 py-2 rounded bg-[#ffad33] hover:bg-[#ffa31a] text-white font-semibold shadow">
              {mode==="login"?"Login":"Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
