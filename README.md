# Raya Konstruksi - Enterprise Construction Platform

Selamat datang di repository sistem perusahaan jasa konstruksi "Raya Konstruksi". 
Proyek ini dibangun menggunakan **Clean Architecture** dan standar profesional yang terdiri dari 3 service utama:

1. \`frontend/\` : Landing Page website menggunakan React, Vite, Tailwind CSS, Framer Motion.
2. \`admin/\` : Dashboard Admin panel menggunakan React, Vite, Tailwind CSS.
3. \`backend/\` : REST API menggunakan Laravel 12.

## Fitur Utama

- **Public Landing Page**: Responsif, animasi (Framer Motion), dan interaktif.
- **Admin Dashboard**: Manajemen CRUD lengkap (Layanan, Project, Testimoni, Blog, dll) dengan Chart.js.
- **Backend API**: Secure REST API, Eloquent ORM, Sanctum auth.

## Prasyarat (Requirements)
- PHP >= 8.2 & Composer (Untuk Backend)
- Node.js >= 20.x & NPM/Yarn (Untuk Frontend & Admin)
- MySQL/MariaDB

## Panduan Instalasi
Silakan baca panduan lengkap di file [INSTALL.md](./INSTALL.md).

## Struktur Repositori
\`\`\`
construction-company/
├── backend/            # Laravel REST API (Models, Controllers, Migrations)
├── frontend/           # React + Tailwind Landing Page
├── admin/              # React + Tailwind Dashboard Admin
├── generate_*.js       # Script generator (Boilerplate Scaffolders)
├── README.md           # Info Proyek
└── INSTALL.md          # Panduan Instalasi Lengkap
\`\`\`
