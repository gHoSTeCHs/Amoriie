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
        Schema::table('valentines', function (Blueprint $table): void {
            $table->string('creator_email', 255)->nullable()->after('sender_name');
            $table->boolean('notify_on_response')->default(false)->after('creator_email');
            $table->timestamp('first_viewed_at')->nullable()->after('view_count');
            $table->unsignedInteger('total_time_spent_seconds')->default(0)->after('unique_view_count');
            $table->string('last_section_reached')->nullable()->after('total_time_spent_seconds');
            $table->boolean('completed')->default(false)->after('last_section_reached');
            $table->string('og_image_path', 255)->nullable()->after('completed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('valentines', function (Blueprint $table): void {
            $table->dropColumn([
                'creator_email',
                'notify_on_response',
                'first_viewed_at',
                'total_time_spent_seconds',
                'last_section_reached',
                'completed',
                'og_image_path',
            ]);
        });
    }
};
