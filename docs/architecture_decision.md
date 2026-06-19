# Dokumen Keputusan Arsitektur (Architecture Decision Record - ADR)
## Proyek: AuraFit AI (Personal Trainer Fitness/Gym Assistant)

---

## 1. ADR 01: Pemisahan Frontend & Backend (Decoupled Client-Server Architecture)

### 1.1 Status
**DISETUJUI (APPROVED)**

### 1.2 Konteks
Aplikasi AuraFit AI sangat bergantung pada interaksi visual seluler langsung di lapangan (lantai gym) serta pemrosesan kecerdasan buatan (*multimodal computer vision*) yang berat di sisi backend. Kita membutuhkan arsitektur yang tangguh, responsif, dan dapat dikembangkan secara independen antara antarmuka pengguna (UI) dan mesin AI.

### 1.3 Keputusan
Menerapkan arsitektur **Decoupled Client-Server (Pemisahan Frontend & Backend)**:
*   **Frontend**: Single Page Application (SPA) berbasis **React (TypeScript) + Vite** yang dioptimalkan untuk perangkat seluler (*mobile-first*).
*   **Backend**: Layanan API berbasis **Python (FastAPI)** untuk menangani otentikasi, basis data, integrasi API Vision, dan logika bisnis.
*   **Protokol Komunikasi**: RESTful API berbasis HTTPS dengan format pertukaran data JSON.

### 1.4 Konsekuensi
*   **Positif**: 
    *   Pengalaman pengguna (UX) yang sangat mulus tanpa memuat ulang halaman (*zero page-reloads*).
    *   Beban pemrosesan backend terisolasi dari rendering UI.
    *   Memudahkan tim developer frontend dan backend untuk bekerja secara paralel.
*   **Negatif**:
    *   Diperlukan penanganan keamanan ekstra seperti konfigurasi CORS (*Cross-Origin Resource Sharing*) dan otentikasi berbasis token (JWT).

---

## 2. ADR 02: Pilihan Backend Framework - Python (FastAPI)

### 1.1 Status
**DISETUJUI (APPROVED)**

### 1.2 Konteks
Sistem memerlukan integrasi erat dengan SDK Multimodal AI (Google GenAI SDK untuk Gemini, OpenCV untuk prapemrosesan gambar opsional, dll.). Kita memerlukan framework backend yang berkinerja tinggi, mendukung operasi asinkron (*asynchronous*), dan ramah terhadap ekosistem Python ML/AI.

### 1.3 Keputusan
Menggunakan **FastAPI (Python)** sebagai framework backend utama.
*   Menggunakan **Uvicorn** sebagai server ASGI.
*   Menggunakan **SQLModel** atau **SQLAlchemy** sebagai ORM (*Object-Relational Mapping*) untuk interaksi dengan basis data PostgreSQL.

### 1.4 Konsekuensi
*   **Positif**:
    *   **Kinerja Sangat Cepat**: Salah satu framework Python tercepat berkat integrasi dengan Starlette dan Pydantic.
    *   **Asynchronous Support**: Menangani permintaan unggahan gambar dan pemrosesan API AI yang bersifat I/O-bound secara asinkron tanpa memblokir utas (*thread*) utama.
    *   **Auto-generated Docs**: Dokumentasi API interaktif otomatis (Swagger UI & ReDoc) yang memudahkan developer/LLM dalam melakukan pengujian.
*   **Negatif**:
    *   Developer harus disiplin menggunakan sintaksis `async/await` agar tidak menyebabkan hambatan kinerja (*bottleneck*).

---

## 3. ADR 03: Pilihan Model Multimodal AI - Gemini API dengan Opsi Fallback LLaVA

### 1.1 Status
**DISETUJUI (APPROVED)**

### 1.2 Konteks
Fitur utama asisten ini mengandalkan analisis gambar: deteksi jenis alat gym, estimasi persentase lemak tubuh visual dari selfie, dan pengenalan makanan secara visual. Kita membutuhkan model multimodal vision yang memiliki akurasi tinggi, latency rendah, dan mendukung ekstraksi data terstruktur (JSON).

### 1.3 Keputusan
*   **Model Utama**: **Google Gemini 2.5 Flash** (via Google GenAI SDK). Dipilih karena harganya yang sangat terjangkau, kemampuan memahami konteks gambar yang sangat tinggi, kecepatan respons (<3 detik), dan dukungan fitur asli *Structured Outputs* (JSON Schema).
*   **Model Alternatif/Komersial Premium**: **Gemini 2.5 Pro** untuk analisis selfie seluruh badan yang membutuhkan akurasi estimasi spasial lebih kompleks.
*   **Model Open-Source (Self-hosted Fallback)**: **LLaVA-v1.6 (Large Language and Vision Assistant)** yang dijalankan pada server GPU mandiri menggunakan *Ollama* atau *vLLM* jika ada kebutuhan kepatuhan data privat (on-premise).

### 1.4 Konsekuensi
*   **Positif**:
    *   Akurasi analisis visual yang sangat tinggi melampaui model deteksi objek tradisional (*YOLO* atau *SSD*) karena memahami konteks semantik dari peralatan gym yang beraneka ragam.
    *   Kemudahan pemeliharaan: Tidak perlu melatih (*train*) model visi dari awal, cukup melakukan *prompt engineering* terstruktur.
*   **Negatif**:
    *   Bergantung pada koneksi internet dan API key pihak ketiga (untuk Gemini). Biaya API dihitung per token input/output.

---

## 4. ADR 04: Basis Data - PostgreSQL (Relational Database)

### 1.1 Status
**DISETUJUI (APPROVED)**

### 1.2 Konteks
Aplikasi membutuhkan penyimpanan data pengguna, program latihan terpersonalisasi, data log harian (berat badan, makanan, repetisi set latihan), serta relasi yang kuat antara pengguna dan riwayat kebugaran mereka.

### 1.3 Keputusan
Menggunakan **PostgreSQL** sebagai basis data relasional utama, yang terhubung dengan backend FastAPI via Prisma atau SQLAlchemy.

### 1.4 Konsekuensi
*   **Positif**:
    *   Integritas data terjamin tinggi melalui relasi kunci asing (*Foreign Key*) dan transaksi ACID.
    *   Ekosistem yang sangat matang dengan skalabilitas horizontal dan vertikal yang mumpuni.
    *   Dukungan tipe data JSONB jika diperlukan penyimpanan data dinamis hasil ekstraksi AI.
*   **Negatif**:
    *   Skema data bersifat kaku (*rigid*), sehingga perubahan struktur tabel memerlukan proses migrasi basis data (*database migration*) yang terencana.

---

## 5. ADR 05: Keamanan & Enkripsi Data Gambar (Full-Body Selfie Protection)

### 1.1 Status
**DISETUJUI (APPROVED)**

### 1.2 Konteks
Foto selfie seluruh badan (*full-body*) dalam pakaian olahraga sangat sensitif bagi privasi pengguna. Kebocoran data foto ini dapat menghancurkan kepercayaan pengguna terhadap aplikasi secara instan.

### 1.3 Keputusan
Menerapkan protokol keamanan berlapis:
1.  **Client-Side Auto-Blurring**: Frontend mendeteksi area wajah menggunakan library ringan di browser (seperti Canvas API atau face-api.js) dan menyamarkan wajah secara otomatis sebelum foto diunggah ke backend.
2.  **Encrypted Object Storage**: Foto disimpan dalam Object Storage (misalnya AWS S3 atau Supabase Storage) dengan izin akses terkunci (*Private Bucket*). URL gambar hanya dapat diakses melalui *Presigned URL* berdurasi pendek (maksimal 5 menit) untuk dikirim ke Gemini API.
3.  **Data Purge Policy**: Foto selfie komposisi tubuh akan dihapus secara otomatis setelah analisis visual selesai dan data numerik (persentase lemak, tipe tubuh) telah disimpan ke basis data, kecuali jika pengguna mengaktifkan opsi "Simpan Foto untuk Galeri Progres Visual".

### 1.4 Konsekuensi
*   **Positif**:
    *   Perlindungan privasi tingkat tinggi yang membuat pengguna merasa aman melakukan selfie.
    *   Mengurangi tanggung jawab hukum (*legal liability*) terkait penyimpanan data wajah pengguna (*biometric data laws*).
*   **Negatif**:
    *   Menambah kompleksitas komputasi di sisi frontend (untuk deteksi & blur wajah).
