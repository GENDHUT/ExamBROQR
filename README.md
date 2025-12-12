---

# 📘 **ExamBrow — Aplikasi Ujian Anti-Cheat Modern**

Sistem ujian digital dengan keamanan tinggi, anti-cheat, dan monitoring real-time.

![Badge](https://img.shields.io/badge/ExamBrow-AntiCheat-blue?style=for-the-badge)
![Expo](https://img.shields.io/badge/Expo-49+-black?style=for-the-badge)
![Platform](https://img.shields.io/badge/Android-Supported-green?style=for-the-badge)

---

## 🚀 Tentang ExamBrow

**ExamBrow** adalah aplikasi ujian berbasis **Expo/React Native** yang dirancang untuk mencegah kecurangan selama ujian.
Aplikasi ini memastikan peserta **tetap berada di dalam aplikasi**, memblokir perpindahan ke aplikasi lain, serta mendukung **monitoring realtime** sehingga pengawas dapat memantau peserta secara langsung.

Digunakan oleh sekolah, kampus, lembaga pelatihan, dan platform assessment digital.

---

## 🛡️ Fitur Utama

### 🔒 Anti–Cheat

* Tidak dapat keluar dari aplikasi selama ujian
* Deteksi tombol Home & Recent Apps
* Blokir screenshot dan screen recording
* Mode Secure Exam aktif otomatis
* Peringatan & kick otomatis jika mencoba cheat

### 📡 Monitoring Real-time

* Pantau aktivitas peserta secara langsung
* Status online/offline/keluar aplikasi
* Log lengkap aktivitas peserta selama ujian

### 📝 Sistem Ujian

* Soal pilihan ganda & essay
* Timer ujian
* Auto-submit saat waktu habis
* Validasi sesi & token ujian

---

# ⚙️ Instalasi & Menjalankan Aplikasi

## 1️⃣ Clone Repository

```bash
git clone https://github.com/USERNAME/exambrow.git
cd exambrow
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Menjalankan App

### Normal:

```bash
npx expo start
```

### Jika USB Debug:

```bash
adb reverse tcp:8081 tcp:8081
npx expo start
```

---

# 🛠️ Build APK/AAB via EAS

## Login

```bash
expo login
```

## Install EAS CLI

```bash
npm install -g eas-cli
```

## Konfigurasi

```bash
eas build:configure
```

## Build APK (Preview)

```bash
eas build -p android --profile preview
```

## Build AAB (Production)

```bash
eas build -p android --profile production
```

---

# 📥 **DOWNLOAD APLIKASI**

Klik tombol di bawah untuk mengunduh versi terbaru:

<p align="center">
  <a href="https://github.com/GENDHUT/ExamBROQR/releases">
    <img src="https://img.shields.io/badge/DOWNLOAD%20APP-Click%20Here-brightgreen?style=for-the-badge" />
  </a>
</p>

---

# 🤝 Kontribusi

Kontribusi sangat diterima!
Laporkan bug atau request fitur melalui tab **Issues**.

---

# ⭐ Dukung Project Ini

Jika bermanfaat, jangan lupa beri **⭐ star** pada repositori GitHub!

---
