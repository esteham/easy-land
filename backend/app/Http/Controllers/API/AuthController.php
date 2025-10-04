<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'firstName' => ['required','string','max:255'],
            'lastName'  => ['required','string','max:255'],
            'email'     => ['required','email','unique:users,email'],
            'phone'     => ['nullable','string','max:20'],
            'password'  => ['required', Password::min(8)], // 8 better
            'role'      => ['required','in:admin,acland,user'],
        ]);

        $user = User::create([
            'name'       => $data['firstName'].' '.$data['lastName'],
            'first_name' => $data['firstName'],
            'last_name'  => $data['lastName'],
            'email'      => $data['email'],
            'phone'      => $data['phone'] ?? null,
            'password'   => Hash::make($data['password']),
            'role'       => $data['role'],
        ]);

        return response()->json([
            'message' => 'Registration successful, Please log in.',
            'user'    => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $cred = $request->validate([
            'email'    => ['required','email'],
            'password' => ['required'],
        ]);

        // Manual check to avoid session side-effects
        $user = User::where('email', $cred['email'])->first();
        if (!$user || !Hash::check($cred['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        // Passport personal access token
        $tokenResult = $user->createToken('spa-token');
        $accessToken = $tokenResult->accessToken;
        $expiresAt   = optional($tokenResult->token->expires_at)->toDateTimeString();

        return response()->json([
            'user'       => $user,
            'token'      => $accessToken,
            'token_type' => 'Bearer',
            'expires_at' => $expiresAt,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        // Revoke only current token
        $request->user()->token()->revoke();
        return response()->json(['message' => 'Logged out']);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'  => ['required','string','max:255'],
            'email' => ['required','email','unique:users,email,'.$user->id],
            'phone' => ['nullable','string','max:20'],
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $user,
        ]);
    }

    public function changePassword(Request $request)
    {
        $rules = [
            // IMPORTANT: guard specify for Passport
            'current_password' => ['required','current_password:api'],
            'password'         => ['required','string','min:8','confirmed'],
        ];
        $request->validate($rules);

        $user = $request->user();
        $user->forceFill([
            'password' => Hash::make($request->input('password')),
        ])->save();

        // (Optional) revoke other tokens on password change:
        // foreach ($user->tokens()->where('id','<>',$request->user()->token()->id)->get() as $t) {
        //     $t->revoke();
        // }

        return response()->json(['message' => 'Password updated successfully.']);
    }
}
