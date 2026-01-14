<?php

namespace App\Jobs;

use App\Models\FeedbackReply;
use App\Mail\FeedbackReplyMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendFeedbackReplyJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public FeedbackReply $reply) {}

   public function handle(): void
{
    try {
        $feedback = $this->reply->feedback;
        $customer = $feedback->feedbackRequest->customer;

        if ($customer->email) {
            Mail::to($customer->email)
                ->send(new FeedbackReplyMail($this->reply));
        }

        $this->reply->update(['status' => 'completed']);

    } catch (\Throwable $e) {
        $this->reply->update(['status' => 'failed']);

        throw $e; // permet retry automatique
    }
}

}
