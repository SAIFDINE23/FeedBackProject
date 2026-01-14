<?php
namespace App\Jobs;

use App\Models\Feedback;
use App\Models\FeedbackReply;
use App\Services\AIReplyService;
use App\Services\ReplyNotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateAIReplyJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private Feedback $feedback) {}

    public function handle(
        AIReplyService $aiService,
        ReplyNotificationService $notificationService
    ): void {
        // Ensure relations are loaded when job is processed
        $this->feedback->loadMissing('feedbackRequest.customer', 'feedbackRequest.company');

        $customerName = $this->feedback->feedbackRequest?->customer?->name ?? null;
        $companyName = $this->feedback->feedbackRequest?->company?->name ?? null;
        $channel = $this->feedback->feedbackRequest?->channel ?? null;

        $contextParts = [];
        if ($companyName) $contextParts[] = "Société: $companyName";
        if ($channel) $contextParts[] = "Canal: $channel";
        $context = count($contextParts) ? implode(' | ', $contextParts) : null;

        $content = $aiService->generate(
            $this->feedback->comment ?? '',
            $this->feedback->rating,
            $customerName,
            $context
        );

        $reply = FeedbackReply::create([
            'feedback_id'    => $this->feedback->id,
            'responder_type' => 'ai',
            'responder_id'   => null,
            'content'        => $content,
            'status'         => 'completed',
        ]);

        // Envoi du mail
        $notificationService->send($reply);
    }
}
