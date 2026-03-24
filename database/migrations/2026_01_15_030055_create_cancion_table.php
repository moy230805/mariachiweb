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
        Schema::create('cancion', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('artista');
            $table->string('categoria');
            $table->string('url');
            $table->string('tipo_url')->default('link');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancion');
    }
};
