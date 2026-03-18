export type Role = 'superadmin' | 'bendahara'

export type JenisTransaksi = 'pemasukan' | 'pengeluaran'

export type KategoriTransaksi =
  | 'iuran'
  | 'konsumsi'
  | 'hadiah_guru'
  | 'dekorasi'
  | 'transportasi'
  | 'lainnya'

export type StatusPembayaran = 'menunggu' | 'lunas' | 'ditolak'

export type TipeTagihan = 'rutin' | 'per_acara'

export interface Admin {
  id: string
  nama: string
  email: string
  role: Role
  created_at: string
}

export interface Anggota {
  id: string
  nama: string
  kontak?: string
  created_at: string
}

export interface TransaksiKas {
  id: string
  tanggal: string
  jenis: JenisTransaksi
  jumlah: number
  keterangan: string
  kategori: KategoriTransaksi
  foto_bukti_url?: string
  dicatat_oleh?: string
  created_at: string
}

export interface Tagihan {
  id: string
  judul: string
  nominal: number
  tipe: TipeTagihan
  event_id?: string
  batas_bayar?: string
  visibilitas: 'publik' | 'admin_only'
  created_at: string
}

export interface PembayaranIuran {
  id: string
  anggota_id: string
  tagihan_id: string
  jumlah_bayar: number
  tanggal_bayar: string
  status: StatusPembayaran
  foto_bukti_url?: string
  diverifikasi_oleh?: string
  created_at: string
  anggota?: Anggota
  tagihan?: Tagihan
}

export interface Event {
  id: string
  nama_event: string
  tanggal: string
  lokasi?: string
  deskripsi?: string
  foto_cover_url?: string
  created_by?: string
  created_at: string
}

export interface GaleriFoto {
  id: string
  event_id: string
  foto_url: string
  caption?: string
  diupload_oleh?: string
  created_at: string
  event?: Event
}