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
            $table->string('mouza_name')->nullable()->after('reason');
            $table->string('khatian_number')->nullable()->after('mouza_name');
            $table->string('dag_number')->nullable()->after('khatian_number');
            $table->string('buyer_name')->nullable()->after('dag_number');
            $table->string('buyer_nid')->nullable()->after('buyer_name');
            $table->text('buyer_address')->nullable()->after('buyer_nid');
            $table->string('previous_owner_name')->nullable()->after('buyer_address');
            $table->string('previous_owner_nid')->nullable()->after('previous_owner_name');
            $table->text('previous_owner_address')->nullable()->after('previous_owner_nid');
            $table->string('deed_number')->nullable()->after('previous_owner_address');
            $table->date('deed_date')->nullable()->after('deed_number');
            $table->string('registry_office')->nullable()->after('deed_date');
            $table->enum('land_type', ['agricultural', 'non-agricultural'])->nullable()->after('registry_office');
            $table->string('contact_number')->nullable()->after('land_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mutations', function (Blueprint $table) {
            $table->dropColumn([
                'mouza_name',
                'khatian_number',
                'dag_number',
                'buyer_name',
                'buyer_nid',
                'buyer_address',
                'previous_owner_name',
                'previous_owner_nid',
                'previous_owner_address',
                'deed_number',
                'deed_date',
                'registry_office',
                'land_type',
                'contact_number',
            ]);
        });
    }
};
