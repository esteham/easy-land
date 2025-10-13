<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Mutation;

class MutationApproved extends Notification implements ShouldQueue
{
    use Queueable;

    protected $mutation;

    /**
     * Create a new notification instance.
     */
    public function __construct(Mutation $mutation)
    {
        $this->mutation = $mutation;
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
            ->subject('Mutation Application Approved')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your mutation application has been approved.')
            ->line('Type: ' . $this->mutation->mutation_type)
            ->action('View Details', url('/dashboard?tab=mutations'))
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
