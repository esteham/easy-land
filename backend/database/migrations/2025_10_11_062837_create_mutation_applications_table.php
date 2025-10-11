<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mutation_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('dag_id')->constrained()->onDelete('cascade');
            $table->enum('mutation_type', ['sale', 'inheritance', 'gift', 'partition', 'decree']);
            $table->text('reason')->nullable();
            $table->text('description')->nullable();
            $table->json('documents')->nullable(); // [{name, path}]
            $table->decimal('fee_amount', 12, 2)->default(0);
            $table->enum('payment_status', ['pending', 'paid'])->default('pending');
            $table->string('payment_method')->nullable(); // e.g., bKash, Nagad, Card/Bank
            $table->string('payer_identifier')->nullable(); // phone number or card number
            $table->string('transaction_id')->nullable();
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected', 'flagged'])->default('pending');
            $table->text('remarks')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mutation_applications');
    }
};
