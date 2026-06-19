# 🏋️‍♂️ AuraFit AI - Personal Trainer Gym Assistant

> Asisten kebugaran/gym pintar berbasis **Multimodal Vision AI (Gemini 1.5/2.5 Flash)** yang dirancang khusus untuk mendampingi pemula (*gym beginners*) melewati sesi latihan perdana mereka di gym dengan percaya diri.

Cetak biru arsitektur lengkap, spesifikasi fungsional, dan alur kerja aplikasi dapat dilihat di folder `docs/`.

---

## ✨ Fitur Utama yang Berfungsi Penuh
1.  **Deteksi Alat Gym via Kamera (Gym Equipment Vision)**: Foto alat gym apa saja untuk mendapatkan nama alat, sasaran otot utama/pendukung, panduan keselamatan langkah-demi-langkah, dan daftar kesalahan umum yang sering diabaikan pemula.
2.  **Mulai Latihan Langsung**: Integrasi tombol latihan instan setelah deteksi alat untuk mencatat set, repetisi, berat beban (kg), dan intensitas (RPE). Setiap logging memberikan **+15 XP** untuk gamifikasi!
3.  **Sinkronisasi Selfie Seluruh Badan (Body Composition Sync)**: Analisis visi AI terenkripsi yang mendeteksi jenis tubuh (*somatotype*), estimasi lemak tubuh (*body fat %*), analisis otot spasial, serta penyusunan target gizi harian otomatis (+50 XP).
4.  **Sensor Wajah Otomatis (Privacy-First Face Blur)**: Sensor wajah otomatis opsional di sisi frontend sebelum foto badan diunggah untuk keamanan privasi maksimal.
5.  **Scan Kalori Makanan (Food Plate Vision)**: Foto makanan di piring Anda untuk mengestimasi kalori, protein, lemak, dan karbohidrat secara instan harian, lengkap dengan ulasan kompatibilitas target diet serta saran perbaikan gizi (+10 XP).
6.  **Sistem Gamifikasi & Streak**: Catat aktivitas harian Anda untuk melipatgandakan *daily streak* 🔥 dan tingkatkan skor XP Anda!

---

## 🛠️ Persyaratan Lingkungan (Prerequisites)
Sebelum menjalankan aplikasi, pastikan Anda memiliki:
*   **Node.js** (v18 atau lebih baru)
*   **Python** (v3.9 atau lebih baru)
*   **Gemini API Key**: Variabel lingkungan `GEMINI_API_KEY` sudah terdeteksi di perangkat Anda.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi terbagi menjadi dua bagian: **Backend (FastAPI)** dan **Frontend (Vite + React)**.

### 1. Menjalankan Backend (FastAPI)
Buka terminal baru di direktori root proyek ini, kemudian jalankan langkah berikut:

```bash
# Pindah ke direktori backend
cd backend

# Buat virtual environment python (opsional namun disarankan)
python3 -m venv venv
source venv/bin/activate

# Instal dependensi backend
pip install -r requirements.txt

# Jalankan server lokal backend
uvicorn main:app --reload --port 8000
```
Server backend akan berjalan di **`http://localhost:8000`**. Dokumentasi Swagger API otomatis dapat diakses di `http://localhost:8000/docs`.

### 2. Menjalankan Frontend (Vite + React)
Buka terminal baru kedua di direktori root proyek ini, kemudian jalankan langkah berikut:

```bash
# Pindah ke direktori frontend
cd frontend

# Instal dependensi npm
npm install

# Jalankan server pengembangan frontend
npm run dev
```
Aplikasi web AuraFit AI akan berjalan secara otomatis di **`http://localhost:5173`**.

---

## 🗂️ Struktur Direktori Proyek

```text
├── docs/                      # Dokumen spesifikasi desain & user flow (FSD, ADR, Alur)
├── backend/                   # Logika Server FastAPI (Python)
│   ├── database.py            # Konfigurasi basis data SQLite lokal
│   ├── models.py              # Definisi skema tabel data (SQLAlchemy)
│   ├── schemas.py             # Validasi tipe data request/response (Pydantic)
│   ├── auth.py                # Enkripsi sandi & otentikasi sesi token JWT
│   ├── ai_service.py          # Integrasi Multimodal Vision Google Gemini API
│   ├── main.py                # Endpoint server & logika penilai XP/Streak
│   └── requirements.txt       # Daftar pustaka python harian
├── frontend/                  # Antarmuka Pengguna Seluler (React TS + Tailwind)
│   ├── index.html             # Bootstrap HTML & Google Fonts
│   ├── src/
│   │   ├── main.tsx           # Entrypoint bundling react
│   │   ├── index.css          # Inisialisasi Tailwind & scrollbar premium
│   │   └── App.tsx            # Halaman otentikasi & dashboard interaktif
│   ├── package.json           # Dependensi pustaka frontend
│   ├── tailwind.config.js     # Skema warna Sleek Nike-Athletic Volt Green
│   └── vite.config.ts         # Setel port & server lokal
└── README.md                  # Panduan Memulai Cepat
```
