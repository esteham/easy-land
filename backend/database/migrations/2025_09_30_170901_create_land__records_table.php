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
        Schema::create('land__records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('division_id')->constrained('divisions')->cascadeOnDelete();
            $table->foreignId('district_id')->constrained('districts')->cascadeOnDelete();
            $table->foreignId('upazila_id')->constrained('upazilas')->cascadeOnDelete();
            $table->foreignId('mouza_id')->constrained('mouzas')->cascadeOnDelete();
            $table->unsignedBigInteger('survey_type_id');
            $table->string('khatiyan_number');
            $table->string('dag_number');
            $table->decimal('land_area', 10, 2)->nullable();
            $table->timestamps();

            $table->index(['division_id', 'district_id', 'upazila_id', 'mouza_id']);
            $table->index(['khatiyan_number', 'dag_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('land__records');
    }
};
