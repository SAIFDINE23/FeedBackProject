<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedbackReply extends Model
{
    use HasFactory;

    protected $fillable = [
        'feedback_id',
        'responder_type', // 'admin' ou 'ai'
        'responder_id',   // si admin => user_id, si IA => null
        'content',
        'status',         // pending / completed / failed
        'provider',       // pour IA: 'gemini', 'openai', etc.
        'provider_response', // stocke JSON brut retour IA
    ];

    public function feedback()
    {
        return $this->belongsTo(Feedback::class);
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'responder_id');
    }
}
