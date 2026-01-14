<?php

namespace App\Mail;

use App\Models\FeedbackReply;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FeedbackReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public FeedbackReply $reply) {}

    public function build()
    {
        return $this
            ->subject('Réponse à votre avis')
            ->view('emails.feedback-reply')
            ->with([
                'customerName' => $this->reply->feedback->feedbackRequest->customer->name,
                'replyContent' => $this->reply->content,
            ]);
    }
}
