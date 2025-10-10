<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Application;
use App\Models\Mutation;

class MutationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the user
        $user = User::where('email', 'user@example.com')->first();
        if (!$user) return;

        // Create some applications for the user
        $applications = [];
        for ($i = 1; $i <= 5; $i++) {
            $applications[] = Application::create([
                'user_id' => $user->id,
                'dag_id' => 1, // Assuming dag exists
                'type' => 'land_registration',
                'description' => 'Sample application ' . $i,
                'status' => 'approved',
                'submitted_at' => now(),
                'fee_amount' => 1000.00,
                'payment_status' => 'paid',
            ]);
        }

        // Create mutations for these applications
        $statuses = ['pending', 'under_review', 'approved', 'rejected', 'flagged'];
        $types = ['sale', 'inheritance', 'gift', 'partition', 'decree'];

        foreach ($applications as $app) {
            for ($j = 0; $j < 2; $j++) { // 2 mutations per application
                Mutation::create([
                    'user_id' => $user->id,
                    'application_id' => $app->id,
                    'mutation_type' => $types[array_rand($types)],
                    'reason' => 'Sample reason for mutation',
                    'documents' => [],
                    'fee_amount' => rand(500, 2000),
                    'status' => $statuses[array_rand($statuses)],
                    'remarks' => 'Sample remarks',
                    'reviewed_by' => rand(1, 2), // admin or acland
                    'reviewed_at' => now(),
                ]);
            }
        }
    }
}
