<?php

namespace App\Mail;

use App\Models\FeedbackRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FeedbackRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public FeedbackRequest $feedbackRequest
    ) {}

    public function build()
    {
        $link = config('app.url') . '/feedback/' . $this->feedbackRequest->token;

        return $this
            ->subject('We value your feedback')
            ->view('emails.feedback-request')
            ->with([
                'link' => $link,
                'company' => $this->feedbackRequest->company->name,
                'customer' => $this->feedbackRequest->customer->name,
            ]);
    }
}
