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
            $table->decimal('land_area', 10, 2)->nullable()->after('land_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mutations', function (Blueprint $table) {
            $table->dropColumn('land_area');
        });
    }
};
