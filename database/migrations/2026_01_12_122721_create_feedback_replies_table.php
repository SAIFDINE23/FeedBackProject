<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('feedback_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feedback_id')->constrained()->onDelete('cascade');

            $table->enum('responder_type', ['admin', 'ai']);
            $table->foreignId('responder_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->text('content');
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->string('provider')->nullable(); // ex: 'gemini', 'openai'
            $table->json('provider_response')->nullable(); // stocker JSON brut de l'IA

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('feedback_replies');
    }
};
