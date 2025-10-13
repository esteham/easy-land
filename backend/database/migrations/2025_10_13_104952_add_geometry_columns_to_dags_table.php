<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('dags', function (Blueprint $table) {
            $table->longText('geojson_data')->nullable()->after('document'); // FeatureCollection/Feature
            $table->json('bbox')->nullable()->after('geojson_data');        // [minLng,minLat,maxLng,maxLat]
            $table->decimal('centroid_lat', 10, 7)->nullable()->after('bbox');
            $table->decimal('centroid_lng', 10, 7)->nullable()->after('centroid_lat');
            $table->index(['dag_no']); // Faster search
        });
    }
    public function down(): void {
        Schema::table('dags', function (Blueprint $table) {
            $table->dropColumn(['geojson_data','bbox','centroid_lat','centroid_lng']);
        });
    }
};
