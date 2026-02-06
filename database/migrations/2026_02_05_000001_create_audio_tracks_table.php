<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audio_tracks', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 100);
            $table->string('artist', 100)->nullable();
            $table->unsignedInteger('duration_seconds');
            $table->string('file_path', 500);
            $table->string('category', 50)->default('romantic');
            $table->string('mood', 50)->default('gentle');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['category', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audio_tracks');
    }
};
