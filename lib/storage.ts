import type { Kullanici, Ders, Urun, Siparis } from "./types";

// ── Kullanıcılar ──────────────────────────────────────────
export const getKullanicilar = (): Kullanici[] =>
  JSON.parse(localStorage.getItem("kullanicilar") || "[]");

export const setKullanicilar = (v: Kullanici[]) =>
  localStorage.setItem("kullanicilar", JSON.stringify(v));

export const getAktifKullanici = (): Kullanici | null => {
  const id = localStorage.getItem("aktifKullaniciId");
  if (!id) return null;
  return getKullanicilar().find((u) => u.id === Number(id)) ?? null;
};

export const login = (username: string, password: string): Kullanici | null => {
  const kullanici = getKullanicilar().find(
    (u) => u.username === username && u.password === password
  );
  if (!kullanici) return null;
  localStorage.setItem("aktifKullaniciId", String(kullanici.id));
  localStorage.setItem("role", kullanici.role);
  localStorage.setItem("username", kullanici.username);
  return kullanici;
};

export const logout = () => {
  localStorage.removeItem("aktifKullaniciId");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
};

// ── Dersler ───────────────────────────────────────────────
export const getDersler = (): Ders[] =>
  JSON.parse(localStorage.getItem("dersler") || "[]");

export const setDersler = (v: Ders[]) =>
  localStorage.setItem("dersler", JSON.stringify(v));

export const getOgretmenDersleri = (ogretmenId: number): Ders[] => {
  const kullanici = getKullanicilar().find((u) => u.id === ogretmenId);
  if (!kullanici?.dersler?.length) return [];
  const tumDersler = getDersler();
  return tumDersler.filter((d) => kullanici.dersler!.includes(d.id));
};

// ── Ürünler ───────────────────────────────────────────────
export const getUrunler = (): Urun[] =>
  JSON.parse(localStorage.getItem("urunler") || "[]");

export const setUrunler = (v: Urun[]) =>
  localStorage.setItem("urunler", JSON.stringify(v));

// ── Siparişler ────────────────────────────────────────────
export const getSiparisler = (): Siparis[] =>
  JSON.parse(localStorage.getItem("siparisler") || "[]");

export const setSiparisler = (v: Siparis[]) =>
  localStorage.setItem("siparisler", JSON.stringify(v));

export const getSiparisByOgretmen = (ogretmenId: number): Siparis[] =>
  getSiparisler().filter((s) => s.ogretmenId === ogretmenId);

// ── İstatistikler ─────────────────────────────────────────
export const getIstatistikler = () => ({
  kullaniciSayisi: getKullanicilar().length,
  urunSayisi: getUrunler().length,
  dersSayisi: getDersler().length,
  siparisSayisi: getSiparisler().length,
});
