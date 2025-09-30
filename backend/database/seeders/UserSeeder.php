<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // Acland user
        User::updateOrCreate(
            ['email' => 'acland@example.com'],
            [
                'name' => 'Acland Officer',
                'password' => Hash::make('acland123'),
                'role' => 'acland',
            ]
        );
    }
}
