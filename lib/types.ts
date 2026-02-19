// ============================================================
// IRÜFoodFlow - Merkezi Tip Tanımları
// ============================================================

export type Rol = "admin" | "ogretmen" | "satin_alma" | "stok";

export type Kullanici = {
  id: number;
  username: string;
  adSoyad: string;
  password: string;
  role: Rol;
  dersler?: string[]; // ders id listesi
};

export type Ders = {
  id: string;
  kod: string;       // örn: ASC112
  ad: string;        // örn: Yöresel Mutfaklar
  ogretmenId?: number;
};

export type Urun = {
  id: string;
  urunAdi: string;
  marka: string;
  fiyat: number;
  olcu: string;
  kategori: string;
  market: string;
  stok: number;
  kod: string;
  notlar: string;
};

export type SiparisUrun = {
  urunId: string;
  urunAdi: string;
  marka: string;
  miktar: number;
  olcu: string;
  birimFiyat: number;
  toplam: number;
};

export type Siparis = {
  id: string;
  ogretmenId: number;
  ogretmenAdi: string;
  dersId: string;
  dersAdi: string;
  hafta: string;       // örn: "1. Hafta"
  urunler: SiparisUrun[];
  genelToplam: number;
  tarih: string;
  durum: "bekliyor" | "onaylandi" | "teslim_alindi";
};
