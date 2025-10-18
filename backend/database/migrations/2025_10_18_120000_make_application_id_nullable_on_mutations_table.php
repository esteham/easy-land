<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop existing foreign key first
        Schema::table('mutations', function (Blueprint $table) {
            $table->dropForeign(['application_id']);
        });

        // Make column nullable using raw SQL to avoid requiring doctrine/dbal
        DB::statement('ALTER TABLE `mutations` MODIFY `application_id` BIGINT UNSIGNED NULL');

        // Re-add foreign key with null on delete
        Schema::table('mutations', function (Blueprint $table) {
            $table->foreign('application_id')
                ->references('id')->on('applications')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop FK first
        Schema::table('mutations', function (Blueprint $table) {
            $table->dropForeign(['application_id']);
        });

        // Make column NOT NULL again
        DB::statement('ALTER TABLE `mutations` MODIFY `application_id` BIGINT UNSIGNED NOT NULL');

        // Re-add FK with cascade delete (original state)
        Schema::table('mutations', function (Blueprint $table) {
            $table->foreign('application_id')
                ->references('id')->on('applications')
                ->onDelete('cascade');
        });
    }
};
