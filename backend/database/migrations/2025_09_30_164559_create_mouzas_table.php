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
    Schema::create('mouzas', function (Blueprint $table) {
        $table->id();
        $table->foreignId('upazila_id')->constrained()->cascadeOnDelete();
        $table->string('name_en')->nullable();
        $table->string('name_bn');
        $table->string('jl_no')->nullable();
        $table->string('mouza_code')->nullable();
        $table->json('meta')->nullable();
        $table->timestamps();

        $table->index(['upazila_id','name_bn']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mouzas');
    }
};
