# Panduan Instalasi (Installation Guide)

Sistem ini menggunakan arsitektur Decoupled (Frontend terpisah dari Backend).

## 1. Backend (Laravel 12 API)

*Catatan: File inti (Models, Controllers, Migrations, Routes) telah disediakan di dalam folder \`backend/\`. Namun, Anda perlu meng-generate skeleton Laravel terlebih dahulu untuk dapat menjalankan server.*

Langkah-langkah instalasi:
1. Pastikan Anda memiliki PHP dan Composer terinstal.
2. Buka terminal di folder \`construction-company\`.
3. Buat skeleton aplikasi Laravel (opsional, jika Anda ingin menggunakan file ini sebagai drop-in replacement):
   \`\`\`bash
   composer create-project laravel/laravel:^12.0 temp_backend
   \`\`\`
4. Salin seluruh isi folder \`temp_backend\` ke dalam folder \`backend/\`, **kecuali** file-file yang sudah digenerate (app/Models, database/migrations, app/Http/Controllers/Api, routes/api.php).
5. Masuk ke folder backend: \`cd backend\`
6. Salin environment file: \`cp .env.example .env\`
7. Sesuaikan konfigurasi database (DB_DATABASE, DB_USERNAME, DB_PASSWORD) di file \`.env\`.
8. Generate API key: \`php artisan key:generate\`
9. Jalankan migrasi: \`php artisan migrate --seed\`
10. Tautkan storage untuk upload gambar: \`php artisan storage:link\`
11. Jalankan server: \`php artisan serve\` (akan berjalan di port 8000)

## 2. Frontend (React + Vite Landing Page)

1. Masuk ke folder frontend: \`cd frontend\`
2. Install dependensi (Sudah otomatis dilakukan oleh sistem AI, namun jalankan ulang jika terjadi error):
   \`\`\`bash
   npm install
   \`\`\`
3. Jalankan development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Akses website di browser Anda (biasanya \`http://localhost:5173\`).

## 3. Admin (React + Vite Dashboard)

1. Masuk ke folder admin: \`cd admin\`
2. Install dependensi:
   \`\`\`bash
   npm install
   \`\`\`
3. Jalankan development server:
   \`\`\`bash
   npm run dev -- --port 5174
   \`\`\`
4. Akses Dashboard Admin di browser (biasanya \`http://localhost:5174\`).
   Login dapat menggunakan email bebas untuk versi mockup ini.

## Dokumentasi API (Singkat)

API menggunakan prefix \`/api/v1\` (atau sesuaikan dengan konfigurasi Laravel 12 API route Anda).

**Endpoints Utama:**
- \`GET /api/services\` - List semua layanan aktif
- \`POST /api/services\` - Buat layanan baru (Membutuhkan Bearer Token Admin)
- \`GET /api/projects\` - List semua project portfolio
- \`POST /api/projects\` - Tambah project
- \`POST /api/contacts\` - Mengirim pesan (Contact Form)
- \`POST /api/login\` - Autentikasi Admin (Sanctum)

*Gunakan Postman atau Insomnia untuk melakukan testing API.*
