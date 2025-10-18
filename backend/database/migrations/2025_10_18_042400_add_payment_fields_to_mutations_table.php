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
        Schema::table('mutations', function (Blueprint $table) {
            $table->enum('payment_status', ['pending', 'paid'])->default('pending')->after('status');
            $table->enum('payment_method', ['bkash', 'nagad', 'card', 'bank'])->nullable()->after('payment_status');
            $table->string('payer_identifier')->nullable()->after('payment_method');
            $table->string('transaction_id')->nullable()->after('payer_identifier');
            $table->timestamp('paid_at')->nullable()->after('transaction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mutations', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'payment_method', 'payer_identifier', 'transaction_id', 'paid_at']);
        });
    }
};
