<?php
namespace App\Services;

use App\Models\FeedbackReply;
use App\Mail\FeedbackReplyMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ReplyNotificationService
{
    public function send(FeedbackReply $reply): void
    {
        try {
            $customer = $reply->feedback
                ->feedbackRequest
                ->customer;

            if (!$customer || !$customer->email) {
                return;
            }

            Mail::to($customer->email)
                ->send(new FeedbackReplyMail($reply));

        } catch (\Throwable $e) {
            Log::error('Reply send failed', [
                'reply_id' => $reply->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
