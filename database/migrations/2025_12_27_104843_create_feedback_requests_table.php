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
        Schema::create('feedback_requests', function (Blueprint $table) {
    $table->id();

    $table->foreignId('company_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('customer_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->uuid('token')->unique();

    $table->enum('channel', ['sms', 'email', 'qr']);

    $table->enum('status', [
        'pending',
        'sent',
        'completed',
        'failed',
        'responded'
    ])->default('pending');

    // Tracking provider (SMS / WhatsApp)
    $table->string('provider')->nullable();
    $table->string('provider_message_id')->nullable();
    $table->text('provider_response')->nullable();

    $table->timestamp('sent_at')->nullable();
    $table->timestamp('responded_at')->nullable();

    $table->timestamps();

    // Index dashboard
    $table->index(['company_id', 'status']);
    $table->index('channel');
});


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback_requests');
    }
};
