<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SurveyType;

class SurveyTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $surveyTypes = [
            ['code' => 'CS', 'name_en' => 'Cadastral Survey', 'name_bn' => 'ক্যাডাস্ট্রাল সার্ভে', 'description' => 'Cadastral Survey type'],
            ['code' => 'SA', 'name_en' => 'Settlement Survey A', 'name_bn' => 'সেটেলমেন্ট সার্ভে এ', 'description' => 'Settlement Survey A type'],
            ['code' => 'RS', 'name_en' => 'Resurvey', 'name_bn' => 'রিসার্ভে', 'description' => 'Resurvey type'],
            ['code' => 'BS', 'name_en' => 'Boundary Survey', 'name_bn' => 'বাউন্ডারি সার্ভে', 'description' => 'Boundary Survey type'],
            ['code' => 'BRS', 'name_en' => 'Boundary Resurvey', 'name_bn' => 'বাউন্ডারি রিসার্ভে', 'description' => 'Boundary Resurvey type'],
            // Add more survey types as needed
        ];

        foreach ($surveyTypes as $type) {
            SurveyType::updateOrCreate(['code' => $type['code']], $type);
        }
    }
}
