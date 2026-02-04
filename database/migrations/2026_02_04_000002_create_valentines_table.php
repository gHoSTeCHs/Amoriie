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
        Schema::create('valentines', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('template_id');
            $table->string('slug')->unique();
            $table->string('recipient_name');
            $table->string('sender_name')->nullable();
            $table->jsonb('customizations');
            $table->string('stats_secret', 64)->unique();
            $table->string('response')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->unsignedBigInteger('view_count')->default(0);
            $table->unsignedBigInteger('unique_view_count')->default(0);
            $table->unsignedTinyInteger('furthest_progress')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('template_id')->references('id')->on('templates')->restrictOnDelete();
            $table->index('slug');
            $table->index('stats_secret');
            $table->index('user_id');
            $table->index('published_at');
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('valentines');
    }
};
