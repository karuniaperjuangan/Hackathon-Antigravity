# Dokumen Spesifikasi Fungsional (Functional Specification Document)
## AI-Powered Personal Trainer Fitness/Gym Assistant (AuraFit AI)

---

## 1. Pendahuluan & Ringkasan Eksekutif

### 1.1 Latar Belakang
Mengunjungi gym untuk pertama kali sering kali mengintimidasi bagi pemula (*gym beginners*). Ketidaktahuan tentang cara kerja alat, kecemasan sosial (*gym-timidation*), serta kebingungan dalam merancang program latihan dan pola makan yang tepat sering kali membuat mereka menyerah dalam beberapa minggu pertama. 

**AuraFit AI** hadir sebagai asisten personal trainer digital berbasis web app yang terintegrasi dengan teknologi **Multimodal Computer Vision** (Gemini API / LLaVA). Aplikasi ini mendemokrasikan bimbingan kebugaran personal secara instan, aman, dan interaktif langsung dari smartphone pengguna.

### 1.2 Tujuan
Menyediakan panduan lengkap bagi pengembang (atau LLM lain) untuk membangun aplikasi web asisten kebugaran dengan fitur deteksi alat gym, analisis komposisi tubuh melalui selfie, dan pelacakan nutrisi makanan menggunakan kamera, demi menurunkan hambatan masuk bagi pemula di gym.

---

## 2. Profil Pengguna & Persona

| Karakteristik | Detail |
| :--- | :--- |
| **Persona Utama** | **Bagas (23 tahun, Karyawan Swasta)** - Baru pertama kali mendaftar gym. Ingin menurunkan berat badan dan membangun otot, tetapi tidak mampu menyewa Personal Trainer (PT) pribadi dan merasa malu bertanya pada orang lain di gym. |
| **Kebutuhan Utama** | Panduan instan saat berdiri di depan alat gym, program latihan yang realistis, estimasi lemak tubuh yang objektif, dan rekomendasi makanan sehat harian. |
| **Perilaku** | Lebih memilih memfoto secara diam-diam dibanding bertanya; bergantung pada smartphone untuk pelacakan progres. |

---

## 3. Fitur Utama & Alur Kerja Fungsional

### 3.1 Fitur 1: Penganalisis Alat Gym (Gym Equipment Analyzer)
Fitur berbasis kamera yang memungkinkan pengguna memfoto alat gym yang belum mereka ketahui fungsinya, lalu mendapatkan instruksi penggunaan dan variasi gerakan latihan yang cocok.

*   **Input**: Foto alat gym tunggal atau dalam sudut pandang luas.
*   **Proses Vision**:
    1. Sistem mendeteksi jenis alat (misal: *Lat Pulldown Machine*, *Leg Press Machine*, *Smith Machine*).
    2. Sistem mengekstrak bagian otot utama (*primary muscle*) dan otot pendukung (*secondary muscle*) yang dilatih.
*   **Output**:
    *   **Nama Alat**: Nama standar industri dan nama populer.
    *   **Panduan Video/Langkah**: Langkah demi langkah cara menggunakan alat dengan aman (posisi duduk, pegangan, pernapasan).
    *   **Rekomendasi Set & Repetisi**: Standar pemula (misal: 3 set x 12 repetisi dengan beban ringan).
    *   **Kesalahan Umum (*Common Mistakes*)**: Detail penting untuk menghindari cedera (misal: bahu tidak boleh naik, punggung tidak boleh melengkung).

### 3.2 Fitur 2: Analisis Selfie Seluruh Badan & Komposisi Tubuh (Full-Body Selfie Vision)
Fitur premium untuk menganalisis fisik pengguna guna merancang program latihan (*personalized workout plan*) dan kebutuhan gizi secara otomatis.

*   **Input**: Foto selfie satu badan penuh (*full-body*) dalam pakaian olahraga yang pas di badan (*form-fitting clothes*) tampak depan (dan opsional tampak samping), dikombinasikan dengan data biometrik dasar (Tinggi Badan, Berat Badan, Usia, Jenis Kelamin, Target Kebugaran).
*   **Proses Vision**:
    1. AI menganalisis siluet tubuh, rasio pinggang-ke-pinggul, dan definisi otot untuk mengestimasi **Persentase Lemak Tubuh (Body Fat %)** secara visual.
    2. AI memetakan **Distribusi Otot (Muscle Distribution)** dan mendeteksi postur dasar (misal: bahu miring, *anterior pelvic tilt* sederhana jika terlihat).
*   **Output**:
    *   **Estimasi Komposisi Tubuh**: Persentase Body Fat, Kategori Fisik (Ectomorph/Mesomorph/Endomorph), dan Massa Otot Relatif.
    *   **Program Latihan Personalisasi (30 Hari)**: Jadwal mingguan yang disesuaikan dengan tipe tubuh hasil deteksi.
    *   **Rekomendasi Gizi (Daily Macros)**: Target Kalori, Protein, Karbohidrat, dan Lemak harian (misal: Surplus Kalori untuk *bulking*, Defisit Kalori untuk *cutting*).
    *   **Rencana Makanan Harian**: Contoh menu sarapan, makan siang, makan malam, dan camilan yang disesuaikan dengan preferensi lokal.

### 3.3 Fitur 3: Penganalisis Makanan Multimodal (Food Nutrition Vision)
Fitur untuk menghitung nilai gizi makanan secara langsung dari piring makan pengguna.

*   **Input**: Foto hidangan makanan atau minuman sebelum dikonsumsi.
*   **Proses Vision**:
    1. AI melakukan segmentasi objek pada piring makanan untuk mengidentifikasi komponen makanan (misal: nasi putih, dada ayam panggang, tumis kangkung).
    2. Estimasi porsi (*portion sizing*) secara visual berdasarkan perspektif piring standar.
*   **Output**:
    *   **Estimasi Nutrisi**: Total Kalori, Protein (g), Karbohidrat (g), Lemak (g).
    *   **Analisis Kesesuaian Diet**: Peringatan apakah makanan ini mendukung target harian mereka (misal: "Sangat bagus, kaya protein!" atau "Hati-hati, kandungan garam/lemak jenuh terlalu tinggi untuk target cutting Anda").
    *   **Saran Alternatif**: Saran penyesuaian jika makanan kurang seimbang (misal: "Tambahkan sayuran hijau untuk serat").

### 3.4 Fitur 4: Buku Harian Kebugaran Pemula (Beginner Fitness Diary)
Fitur penunjang untuk mempertahankan konsistensi pengguna di gym.

*   **Log Latihan Terintegrasi**: Pengguna dapat mencatat beban (*weight*), set, dan repetisi yang mereka selesaikan setelah mengidentifikasi alat gym.
*   **Sistem Gamifikasi (AuraXP)**:
    *   **Streak Harian**: Reward XP jika login dan melakukan log aktivitas/foto makanan harian.
    *   **Badge Pencapaian**: Membuka lencana seperti "Gym Pioneer" (foto alat pertama), "Macro Master" (mencatat makan 3 hari berturut-turut), dan "Form Perfect" (menyelesaikan program minggu pertama).
*   **Asisten Suara Real-time (Form Audio Coach)**: Fitur text-to-speech opsional yang membacakan instruksi keselamatan latihan di telinga pengguna saat mereka bersiap di depan alat.

---

## 4. Persyaratan Non-Fungsional (Non-Functional Requirements)

*   **4.1 Keamanan & Privasi Data (Sangat Kritis)**:
    *   Foto selfie seluruh badan (*full-body*) harus dienkripsi saat transit (HTTPS/TLS) dan saat disimpan di penyimpanan objek (*Object Storage*).
    *   Wajib menyediakan fitur "Wajah Disamarkan" (*auto-blur face*) pada sisi klien sebelum foto dikirim ke backend demi kenyamanan privasi maksimal pengguna.
    *   Pengguna dapat menghapus semua data foto mereka secara permanen dari server kapan saja.
*   **4.2 Performa & Latensi**:
    *   Waktu analisis gambar oleh multimodal model (Gemini API) maksimal **3-5 detik** untuk memberikan pengalaman waktu nyata (*real-time feels*).
    *   Optimasi ukuran gambar pada sisi klien (kompresi gambar sebelum diunggah) untuk menghemat bandwidth data seluler pengguna saat di dalam gym.
*   **4.3 Kompatibilitas Perangkat**:
    *   Aplikasi harus dioptimalkan untuk perangkat mobile (*Mobile-First Responsive*) karena 95% interaksi dilakukan langsung di lantai gym menggunakan ponsel pintar (iOS & Android) melalui web browser.

---

## 5. UI/UX & Panduan Estetika (Sleek Athletic - Nike/Apple Fitness Style)

Aplikasi harus didesain dengan visual yang sangat premium untuk membangkitkan motivasi olahraga:

*   **Skema Warna**:
    *   **Latar Belakang**: Hitam Pekat (`#09090B`) dan Abu-abu Gelap (`#18181B`).
    *   **Warna Aksen**: Volt Green (`#CCFF00`) - memberikan kesan energi tinggi dan fokus atletis, atau Electric Orange (`#FF5500`) untuk tombol aksi utama (*Primary Call to Action*).
    *   **Tipografi**: Font sans-serif tebal dan modern seperti **Outfit** atau **Inter** dari Google Fonts. Judul halaman menggunakan gaya *uppercase* tebal (e.g., `font-extrabold tracking-wider`).
*   **Komponen Visual**:
    *   **Kartu Minimalis**: Menggunakan batas tipis (*border*) berwarna abu-abu redup dengan efek bayangan halus, memberikan kedalaman estetika tanpa terlihat berantakan.
    *   **Transisi Halus**: Efek *fade-in* saat memuat hasil deteksi visual, animasi progress bar melingkar saat memproses gambar.
    *   **State Kosong (*Empty State*)**: Ilustrasi minimalis yang memandu pengguna untuk segera mengaktifkan kamera mereka.

---

## 6. Prompt Engineering Blueprint (Untuk Integrasi LLM / Vision)

Untuk memastikan LLM lain dapat memprogram respons Computer Vision dengan konsisten, gunakan struktur prompt terstruktur berikut di tingkat API:

### 6.1 Prompt untuk Deteksi Alat Gym (Gym Equipment Prompt)
```text
System: Anda adalah Personal Trainer profesional bersertifikasi NASM.
Input: Gambar dari alat olahraga/gym.
Task: Analisis gambar tersebut dan kembalikan output dalam format JSON mentah tanpa markdown block (no ```json):
{
  "equipment_name": "Nama Alat",
  "primary_muscle": "Otot Utama yang Dilatih",
  "secondary_muscle": "Otot Pendukung",
  "how_to_use": [
    "Langkah 1...",
    "Langkah 2..."
  ],
  "common_mistakes": [
    "Kesalahan 1...",
    "Kesalahan 2..."
  ],
  "recommended_schema": {
    "sets": 3,
    "reps": 12,
    "rpe": "6-7 (beban ringan ke sedang)"
  }
}
```

### 6.2 Prompt untuk Analisis Selfie Tubuh (Full-Body Selfie Prompt)
```text
System: Anda adalah Ahli Kinesiologi dan Spesialis Komposisi Tubuh Kebugaran.
Input: Gambar selfie satu badan penuh dari depan + Data Biometrik: Tinggi {height} cm, Berat {weight} kg, Gender {gender}, Target {goal}.
Task: Lakukan estimasi visual persentase lemak tubuh dan buat analisis fisik. Kembalikan respons dalam format JSON mentah:
{
  "estimated_body_fat": "X%",
  "somatotype": "Ectomorph / Mesomorph / Endomorph",
  "muscle_distribution_analysis": "Analisis singkat tentang kekuatan relatif otot tubuh bagian atas vs bawah berdasarkan proporsi visual",
  "biometric_assessment": "Evaluasi berat badan terhadap tinggi (BMI kontekstual otot)",
  "recommended_workout_focus": "Fokus latihan yang cocok untuk tipe tubuh ini (misal: Hypertrophy, Fat Loss)",
  "macronutrient_targets": {
    "calories": 2300,
    "protein": 140,
    "carbs": 250,
    "fat": 65
  }
}
```

### 6.3 Prompt untuk Analisis Makanan (Food Analysis Prompt)
```text
System: Anda adalah Ahli Gizi Olahraga bersertifikat.
Input: Gambar piring makanan.
Task: Identifikasi jenis makanan dan estimasikan nilai gizinya secara visual. Kembalikan respons dalam format JSON mentah:
{
  "identified_items": ["Bahan 1", "Bahan 2"],
  "estimated_portion": "Keterangan porsi visual",
  "nutrition": {
    "calories": 450,
    "protein_g": 35,
    "carbohydrates_g": 40,
    "fats_g": 12
  },
  "fitness_compatibility": "Analisis apakah makanan ini baik untuk program pembentukan otot atau pembakaran lemak.",
  "improvement_tips": "Saran gizi tambahan"
}
```
