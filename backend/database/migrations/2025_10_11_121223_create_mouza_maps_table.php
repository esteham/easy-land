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
        Schema::create('mouza_maps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zil_id')->constrained()->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->string('document')->nullable(); // storage/app/public/mouza_maps/...
            $table->timestamps();

            $table->index('zil_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mouza_maps');
    }
};
