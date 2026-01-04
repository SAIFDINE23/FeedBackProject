<?php

namespace App\Jobs;

use App\Mail\FeedbackRequestMail;
use App\Models\FeedbackRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendFeedbackRequestEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public FeedbackRequest $feedbackRequest
    ) {}

    public function handle(): void
    {
        Mail::to($this->feedbackRequest->customer->email)
            ->send(new FeedbackRequestMail($this->feedbackRequest));

        $this->feedbackRequest->update([
            'status' => 'sent',
        ]);
    }
}
