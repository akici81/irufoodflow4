import { supabase } from "./supabase";
import type { Kullanici, Ders, Urun, Siparis } from "./types";

// ── Kullanıcılar ──────────────────────────────────────────
export const getKullanicilar = async (): Promise<Kullanici[]> => {
  const { data, error } = await supabase.from("kullanicilar").select("*");
  if (error) throw error;
  return (data || []).map((k: any) => ({
    id: k.id,
    username: k.username,
    adSoyad: k.ad_soyad,
    password: k.password_hash,
    role: k.role,
    dersler: k.dersler || [],
  }));
};

export const setKullanicilar = async (liste: Kullanici[]) => {
  // Tüm kullanıcıları sil ve yeniden ekle (basit yöntem)
  await supabase.from("kullanicilar").delete().neq("id", 0);
  const rows = liste.map((k) => ({
    id: k.id,
    username: k.username,
    ad_soyad: k.adSoyad,
    password_hash: k.password,
    role: k.role,
    dersler: k.dersler || [],
  }));
  await supabase.from("kullanicilar").insert(rows);
};

export const getAktifKullanici = async (id: string): Promise<Kullanici | null> => {
  const { data, error } = await supabase
    .from("kullanicilar")
    .select("*")
    .eq("id", Number(id))
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    username: data.username,
    adSoyad: data.ad_soyad,
    password: data.password_hash,
    role: data.role,
    dersler: data.dersler || [],
  };
};

export const login = async (username: string, password: string): Promise<Kullanici | null> => {
  const { data, error } = await supabase
    .from("kullanicilar")
    .select("*")
    .eq("username", username)
    .eq("password_hash", password)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    username: data.username,
    adSoyad: data.ad_soyad,
    password: data.password_hash,
    role: data.role,
    dersler: data.dersler || [],
  };
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("aktifKullaniciId");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  }
};

// ── Dersler ───────────────────────────────────────────────
export const getDersler = async (): Promise<Ders[]> => {
  const { data, error } = await supabase.from("dersler").select("*");
  if (error) throw error;
  return data || [];
};

export const setDersler = async (liste: Ders[]) => {
  await supabase.from("dersler").delete().neq("id", "");
  await supabase.from("dersler").insert(liste);
};

export const getOgretmenDersleri = async (ogretmenId: number): Promise<Ders[]> => {
  const { data: kullanici } = await supabase
    .from("kullanicilar")
    .select("dersler")
    .eq("id", ogretmenId)
    .single();
  if (!kullanici?.dersler?.length) return [];
  const { data } = await supabase.from("dersler").select("*").in("id", kullanici.dersler);
  return data || [];
};

// ── Ürünler ───────────────────────────────────────────────
export const getUrunler = async (): Promise<Urun[]> => {
  const { data, error } = await supabase.from("urunler").select("*");
  if (error) throw error;
  return (data || []).map((u: any) => ({
    id: u.id,
    urunAdi: u.urun_adi,
    marka: u.marka || "",
    fiyat: Number(u.fiyat) || 0,
    olcu: u.olcu || "Kg",
    kategori: u.kategori || "",
    market: u.market || "",
    stok: Number(u.stok) || 0,
    kod: u.kod || "",
    notlar: u.notlar || "",
  }));
};

export const setUrunler = async (liste: Urun[]) => {
  await supabase.from("urunler").delete().neq("id", "");
  const rows = liste.map((u) => ({
    id: u.id,
    urun_adi: u.urunAdi,
    marka: u.marka,
    fiyat: u.fiyat,
    olcu: u.olcu,
    kategori: u.kategori,
    market: u.market,
    stok: u.stok,
    kod: u.kod,
    notlar: u.notlar,
  }));
  await supabase.from("urunler").insert(rows);
};

// ── Siparişler ────────────────────────────────────────────
export const getSiparisler = async (): Promise<Siparis[]> => {
  const { data, error } = await supabase.from("siparisler").select("*");
  if (error) throw error;
  return (data || []).map((s: any) => ({
    id: s.id,
    ogretmenId: s.ogretmen_id,
    ogretmenAdi: s.ogretmen_adi,
    dersId: s.ders_id,
    dersAdi: s.ders_adi,
    hafta: s.hafta,
    urunler: s.urunler,
    genelToplam: Number(s.genel_toplam),
    tarih: s.tarih,
    durum: s.durum,
  }));
};

export const setSiparisler = async (liste: Siparis[]) => {
  await supabase.from("siparisler").delete().neq("id", "");
  const rows = liste.map((s) => ({
    id: s.id,
    ogretmen_id: s.ogretmenId,
    ogretmen_adi: s.ogretmenAdi,
    ders_id: s.dersId,
    ders_adi: s.dersAdi,
    hafta: s.hafta,
    urunler: s.urunler,
    genel_toplam: s.genelToplam,
    tarih: s.tarih,
    durum: s.durum,
  }));
  await supabase.from("siparisler").insert(rows);
};

export const getSiparisByOgretmen = async (ogretmenId: number): Promise<Siparis[]> => {
  const { data } = await supabase.from("siparisler").select("*").eq("ogretmen_id", ogretmenId);
  return (data || []).map((s: any) => ({
    id: s.id,
    ogretmenId: s.ogretmen_id,
    ogretmenAdi: s.ogretmen_adi,
    dersId: s.ders_id,
    dersAdi: s.ders_adi,
    hafta: s.hafta,
    urunler: s.urunler,
    genelToplam: Number(s.genel_toplam),
    tarih: s.tarih,
    durum: s.durum,
  }));
};

// ── İstatistikler ─────────────────────────────────────────
export const getIstatistikler = async () => {
  const [kullanicilar, urunler, dersler, siparisler] = await Promise.all([
    getKullanicilar(),
    getUrunler(),
    getDersler(),
    getSiparisler(),
  ]);
  return {
    kullaniciSayisi: kullanicilar.length,
    urunSayisi: urunler.length,
    dersSayisi: dersler.length,
    siparisSayisi: siparisler.length,
  };
};
