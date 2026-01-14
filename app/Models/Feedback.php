<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'feedback_request_id',
        'rating',
        'comment',
        'is_public',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_public' => 'boolean',
    ];

    public function feedbackRequest()
    {
        return $this->belongsTo(FeedbackRequest::class);
    }

    public function replies()
    {
        return $this->hasMany(FeedbackReply::class);
    }

}

