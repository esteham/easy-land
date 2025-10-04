<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'firstName' => ['required','string','max:255'],
            'lastName' => ['required','string','max:255'],
            'email' => ['required','email','unique:users,email'],
            'phone' => ['nullable','string','max:20'],
            'password' => ['required', Password::min(6)],
            'role' => ['required', 'in:admin,acland,user'],
        ]);

        $user = User::create([
            'name' => $data['firstName'] . ' ' . $data['lastName'],
            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);

        return response()->json([
            'message' => 'Registration successful, Please log in.',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required','email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        $user = Auth::user();
        $token = $user->createToken('spa-token')->accessToken; // Passport

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke(); // Passport
        return response()->json(['message' => 'Logged out']);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'email' => ['required','email','unique:users,email,'.$user->id],
            'phone' => ['nullable','string','max:20'],
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }
}
