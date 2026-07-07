<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Service;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Super Admin Raya',
            'email' => 'admin@rayakonstruksi.com',
            'password' => Hash::make('password123'),
        ]);

        // Services
        $services = [
            ['name' => 'Bangun Rumah', 'description' => 'Membangun rumah impian dengan desain modern dan material terbaik.'],
            ['name' => 'Renovasi Rumah', 'description' => 'Jasa perbaikan dan peningkatan kualitas bangunan lama menjadi seperti baru.'],
            ['name' => 'Gedung Perkantoran', 'description' => 'Konstruksi gedung perkantoran bertingkat dengan standar keamanan internasional.'],
            ['name' => 'Gudang', 'description' => 'Pembangunan struktur gudang industrial yang kokoh.'],
            ['name' => 'Jalan', 'description' => 'Pekerjaan pengaspalan dan infrastruktur jalan.'],
            ['name' => 'Jembatan', 'description' => 'Konstruksi jembatan penghubung berkualitas tinggi.'],
            ['name' => 'Interior', 'description' => 'Pengerjaan desain dan pemasangan interior ruangan mewah.'],
            ['name' => 'Konsultan', 'description' => 'Jasa konsultasi perencanaan arsitektur dan struktur bangunan.'],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
