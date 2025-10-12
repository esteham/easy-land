# Real-Time Updates for Land Tax Registrations

## Overview

Implementing real-time updates for approval requests between admin and user dashboards using Laravel Broadcasting with Pusher. This allows new submissions to appear instantly on the admin side and status changes to update on the user side without page refreshes.

## Steps

### Backend Setup

- [ ] Update `backend/composer.json` to add Pusher package (`"pusher/pusher-php-server": "^8.0"` under `require`).
- [ ] Configure `backend/config/broadcasting.php` to use Pusher driver with env variables.
- [ ] User: Add Pusher credentials to `backend/.env` (BROADCAST_DRIVER=pusher, PUSHER_APP_ID, PUSHER_APP_KEY, PUSHER_APP_SECRET, PUSHER_HOST, PUSHER_PORT=443, PUSHER_SCHEME=https).
- [ ] Run `composer install` in backend directory.
- [ ] Run `php artisan config:cache` to apply broadcasting config.

### Events

- [ ] Create `backend/app/Events/RegistrationCreated.php` (public event for new submissions).
- [ ] Create `backend/app/Events/RegistrationUpdated.php` (private event for status updates).

### Controller and Channels

- [ ] Update `backend/app/Http/Controllers/API/LandTaxRegistrationController.php` to fire events in `store` and `update` methods.
- [ ] Update `backend/routes/channels.php` to authorize private user channels.

### Frontend Setup

- [ ] Update `frontend/package.json` to add Laravel Echo and Pusher JS (`"laravel-echo": "^1.15.3"`, `"pusher-js": "^8.4.0-rc2"` under `dependencies`).
- [ ] Create `frontend/src/bootstrap.js` to configure Echo with Pusher.
- [ ] Run `npm install` in frontend directory.

### Component Updates

- [ ] Update `frontend/src/components/dashboard/admin/AdminLandTaxRegistrations.jsx` to listen for `registration.created` on public channel and add new registration to state.
- [ ] Update `frontend/src/components/dashboard/user/tabs/LDTTab.jsx` to listen for `registration.updated` on private user channel and update specific registration in state.

### Testing and Follow-up

- [ ] Start Laravel server (`php artisan serve`) and frontend dev server (`cd frontend && npm run dev`).
- [ ] Test: Submit new registration via `LandTaxRegistration.jsx` – verify it appears instantly in admin dashboard.
- [ ] Test: Update status in admin – verify it updates instantly in user's LDTTab.
- [ ] Check Pusher dashboard for event broadcasts, browser console for Echo connections, and Laravel logs for errors.
- [ ] Optional: Handle edge cases like auth failures or payload issues.

**Notes:**

- Assume user provides Pusher keys. If using Redis instead, adjust config accordingly.
- After all steps, restart servers to apply changes.
- Track progress by updating checkboxes here.
