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
        Schema::table('land_tax_registrations', function (Blueprint $table) {
            $table->string('land_type')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('land_tax_registrations', function (Blueprint $table) {
            $table->dropColumn('land_type');
        });
    }
};
