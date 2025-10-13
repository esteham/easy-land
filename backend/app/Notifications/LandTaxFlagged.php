<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\LandTaxRegistration;

class LandTaxFlagged extends Notification implements ShouldQueue
{
    use Queueable;

    protected $registration;

    /**
     * Create a new notification instance.
     */
    public function __construct(LandTaxRegistration $registration)
    {
        $this->registration = $registration;
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
        $message = (new MailMessage)
            ->subject('Land Tax Registration Flagged')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your land tax registration has been flagged for review.')
            ->line('Khatiyan: ' . $this->registration->khatiyan_number)
            ->line('Dag: ' . $this->registration->dag_number);

        if ($this->registration->notes) {
            $message->line('Notes: ' . $this->registration->notes);
        }

        $message->action('View Details', url('/dashboard?tab=ldt'))
            ->line('Thank you for using our service!');

        return $message;
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
