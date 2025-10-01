<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zil_id')->constrained()->cascadeOnDelete();
            $table->string('dag_no');
            $table->json('khotiyan')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index('zil_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dags');
    }
};
