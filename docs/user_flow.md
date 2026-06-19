# Alur Pengguna (User Flow Document)
## AuraFit AI - Personal Trainer Fitness/Gym Assistant

Dokumen ini memetakan alur interaksi pengguna (User Flow) dalam bentuk diagram alur langkah demi langkah menggunakan **Mermaid.js**. Diagram ini dirancang untuk memandu LLM atau pengembang frontend dalam membangun rute navigasi dan antarmuka pengguna (UI) yang mulus.

---

## 1. Alur Orientasi Pengguna Baru (Onboarding & Full-Body Selfie Flow)
Alur ini dilewati pengguna saat pertama kali masuk ke aplikasi untuk mendapatkan analisis tubuh dan program latihan perdana mereka.

```mermaid
graph TD
    A[Mulai: Pengguna Membuka Web App] --> B[Registrasi / Login Akun]
    B --> C[Isi Data Biometrik Dasar<br>Tinggi, Berat, Usia, Target]
    C --> D[Halaman Pengambilan Selfie Seluruh Badan]
    D --> E{Apakah bersedia Selfie?}
    E -- Tidak --> F[Gunakan Kuesioner Saja<br>Program Latihan Standar]
    E -- Ya --> G[Kamera Aktif: Panduan Pose & Pakaian]
    G --> H[Pengguna Mengambil / Mengunggah Foto]
    H --> I[Client-Side: Auto-blur wajah untuk privasi]
    I --> J[Kirim Foto + Data Biometrik ke Backend FastAPI]
    J --> K[Backend memanggil Gemini API untuk Analisis Vision]
    K --> L[Prosesing Hasil Vision oleh AI]
    L --> M[Simpan Hasil Analisis Komposisi Tubuh & Makro Gizi ke DB]
    M --> N[Tampilkan Dashboard Utama AuraFit AI dengan Program Latihan 30 Hari]
    F --> N
```

---

## 2. Alur Deteksi Alat Gym & Pencatatan Latihan (Gym Equipment Vision Flow)
Alur harian ketika pemula berdiri di depan alat gym, bingung cara menggunakannya, lalu ingin merekam aktivitas latihan mereka.

```mermaid
graph TD
    A[Buka Dashboard AuraFit] --> B[Klik Tombol Scan Alat Gym]
    B --> C[Kamera Aktif: Arahkan ke Alat Gym]
    C --> D[Pengguna Memfoto Alat Gym]
    D --> E[Unggah Foto ke Backend FastAPI]
    E --> F[Backend Mengirim Gambar ke Gemini API]
    F --> G[Gemini API Mengembalikan Data JSON Terstruktur Nama Alat, Otot, Panduan]
    G --> H[Tampilkan Visual Nike-Style Card Detail Alat Gym]
    H --> I{Apakah ingin mulai latihan dengan alat ini?}
    I -- Tidak --> J[Kembali ke Dashboard / Cari Alat Lain]
    I -- Ya --> K[Aktifkan Lembar Pencatatan Log Set & Repetisi]
    K --> L[Pengguna Melakukan Latihan & Mengisi Angka Beban & Reps]
    L --> M[Klik Selesai Latihan]
    M --> N[Backend Menyimpan Log Latihan & Menambah AuraXP]
    N --> O[Tampilkan Pop-up Keberhasilan Streak / Badge]
    O --> J
```

---

## 3. Alur Deteksi Makanan & Pelacakan Nutrisi (Food Nutrition Vision Flow)
Alur di mana pengguna memfoto makanan mereka untuk melacak asupan kalori dan makronutrisi harian secara otomatis.

```mermaid
graph TD
    A[Buka Dashboard AuraFit] --> B[Klik Tombol Catat Makanan via Foto]
    B --> C[Kamera Aktif: Arahkan ke Piring Makanan]
    C --> D[Pengguna Memfoto Makanan]
    D --> E[Unggah Gambar ke Backend FastAPI]
    E --> F[Backend Mengirim Gambar ke Gemini API untuk Analisis Nutrisi]
    F --> G[Gemini API Mengembalikan Estimasi Bahan, Kalori, Protein, Karbohidrat, Lemak]
    G --> H[Tampilkan Ringkasan Nutrisi di Layar dengan Slider Edit Porsi]
    H --> I{Apakah estimasi porsi AI sudah sesuai?}
    I -- Tidak --> J[Pengguna Menyesuaikan Porsi via Form]
    I -- Ya --> K[Klik Konfirmasi Tambah ke Jurnal Makanan]
    J --> K
    K --> L[Backend Menambahkan Kalori & Makro ke Total Asupan Harian di Database]
    L --> M[Tampilkan Progress Bar Nutrisi Harian yang Diperbarui]
    M --> N[Kembali ke Dashboard]
```
