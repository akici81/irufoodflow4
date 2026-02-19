"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
 const router = useRouter();
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");

 const handleLogin = async (e: React.FormEvent) => {
 e.preventDefault();
 setError("");

 const { data, error: dbError } = await supabase
 .from("kullanicilar")
 .select("*")
 .eq("username", username)
 .eq("password_hash", password)
 .single();

 if (dbError || !data) {
 setError("Kullanıcı adı veya şifre hatalı.");
 return;
 }

 localStorage.setItem("aktifKullaniciId", String(data.id));
 localStorage.setItem("role", data.role);
 localStorage.setItem("username", data.username);

 const rota: Record<string, string> = {
 admin: "/admin",
 ogretmen: "/ogretmen",
 satin_alma: "/satin",
 stok: "/stok",
 bolum_baskani: "/bolum-baskani",
 };
 router.push(rota[data.role] ?? "/");
 };

 return (
 <div className="min-h-screen bg-red-700 flex items-center justify-center p-4">
 <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10">
 <div className="flex flex-col items-center mb-8">
 <div className="w-16 h-16 bg-red-700 rounded-2xl flex items-center justify-center mb-4">
 <span className="text-white font-bold text-lg">İRÜ</span>
 </div>
 <h1 className="text-2xl font-bold text-gray-800">İRÜFoodFlow</h1>
 <p className="text-gray-500 text-sm mt-1">Alışveriş Yönetim Platformu</p>
 </div>

 {error && (
 <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5 text-center">
 {error}
 </div>
 )}

 <form onSubmit={handleLogin} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-600 mb-1.5">Kullanıcı Adı</label>
 <input
 type="text"
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 placeholder="Kullanıcı adınızı giriniz"
 className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500"
 required
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-600 mb-1.5">Şifre</label>
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="Şifrenizi giriniz"
 className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500"
 required
 />
 </div>
 <button
 type="submit"
 className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3.5 rounded-xl transition text-sm mt-2"
 >
 Giriş Yap
 </button>
 </form>

 <p className="text-center text-xs text-gray-500 mt-8">
 System Administrator'a iletişime geçiniz.<br />
 <span className="font-medium">İRÜFoodFlow v2.0</span>
 </p>
 </div>
 </div>
 );
}