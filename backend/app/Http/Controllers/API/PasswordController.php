<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordController extends Controller
{
    // Request reset link to email
    public function sendResetLink(Request $request)
    {
        // You can skip 'exists' to avoid user enumeration; here we keep generic response anyway
        $request->validate(['email' => ['required','email']]);

        $status = Password::sendResetLink($request->only('email'));

        // Always return generic message (security best practice)
        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'If an account exists for that email, a reset link has been sent.']);
        }

        // Still return generic message
        return response()->json(['message' => 'If an account exists for that email, a reset link has been sent.']);
    }

    // Perform the reset
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'                 => ['required','email'],
            'token'                 => ['required','string'],
            'password'              => ['required','string','min:8','confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email','password','password_confirmation','token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password'       => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));

                // OPTIONAL: revoke all existing Passport tokens after reset
                foreach ($user->tokens as $token) $token->revoke();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password has been reset successfully.']);
        }

        return response()->json([
            'message' => 'Invalid or expired reset token.',
        ], 422);
    }
}
