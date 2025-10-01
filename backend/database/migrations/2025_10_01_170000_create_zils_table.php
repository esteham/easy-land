<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('zils', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mouza_id')->constrained()->cascadeOnDelete();
            $table->string('zil_no');
            $table->string('map_url')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index('mouza_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('zils');
    }
};
