<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Kyc;

class KycRejected extends Notification implements ShouldQueue
{
    use Queueable;

    protected $kyc;

    /**
     * Create a new notification instance.
     */
    public function __construct(Kyc $kyc)
    {
        $this->kyc = $kyc;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('KYC Verification Rejected')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your KYC verification has been rejected.')
            ->line('Reason: ' . $this->kyc->rejection_reason)
            ->line('Please upload correct documents and try again.')
            ->action('Update KYC', url('/dashboard?tab=profileKyc'))
            ->line('Thank you for using our service!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
