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
                'email_verified_at' => date('Y-m-d H:i:s'),
            ]
        );

        // Acland user
        User::updateOrCreate(
            ['email' => 'acland@example.com'],
            [
                'name' => 'Acland Officer',
                'password' => Hash::make('acland123'),
                'role' => 'acland',
                'email_verified_at' => date('Y-m-d H:i:s'),
            ]
        );

        //Custom user
        User::updateOrCreate(
            ['email' => 'acland@example.com'],
            [
                'name' => 'Custom User',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'email_verified_at' => date('Y-m-d H:i:s'),
            ]
        );
    }
}
