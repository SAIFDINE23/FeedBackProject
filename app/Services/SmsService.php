<?php

namespace App\Services;

use Twilio\Rest\Client;

class SmsService
{
    protected Client $client;

    public function __construct()
    {
        $this->client = new Client(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );
    }

    public function send(string $to, string $message): array
    {
        $sms = $this->client->messages->create($to, [
            'from' => config('services.twilio.from'),
            'body' => $message,
        ]);

        return [
            'sid' => $sms->sid,
            'status' => $sms->status,
        ];
    }
}
