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
        Schema::table('dags', function (Blueprint $table) {
            $table->foreignId('survey_type_id')->nullable()->constrained('survey_types')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dags', function (Blueprint $table) {
            $table->dropForeign(['survey_type_id']);
            $table->dropColumn('survey_type_id');
        });
    }
};
