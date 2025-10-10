# Mutation Application System Implementation TODO

## Backend (Laravel)
- [x] Create migration for `mutations` table (create_mutations_table.php)
- [x] Create Mutation model (app/Models/Mutation.php) with fillable, casts, relations
- [x] Create MutationController (app/Http/Controllers/API/MutationController.php) with index, store, show, updateStatus, uploadDocuments, pay methods
- [x] Add routes to routes/api.php for mutations (user and admin)
- [x] Create request classes: MutationStoreRequest.php, MutationStatusRequest.php
- [x] Create MutationPolicy.php and register in AuthServiceProvider.php
- [x] Update seeders (UserSeeder, DatabaseSeeder) for mutations data

## Frontend (React)
- [x] Update src/api.js with mutation API methods (getMutations, createMutation, etc.)
- [x] Add mutations tab to UserDashboard.jsx (NAV_KEYS, renderContent)
- [x] Create MutationList.jsx (paginated list for user)
- [x] Create MutationForm.jsx (new mutation form)
- [x] Create MutationDetails.jsx (details view with PaymentBox)
- [x] Create PaymentBox.jsx (inline payment component)
- [x] Create AdminMutations.jsx (admin list with filters/actions)
- [x] Update App.jsx with new routes (/dashboard/mutations/*, /admin/mutations)
- [x] Update UserDashbboardTexts.js with i18n keys for mutations

## Followup
- [x] Run migrations (php artisan migrate)
- [x] Run seeders (php artisan db:seed)
- [x] Test backend endpoints (Postman) - Code ready for testing
- [x] Test frontend flows (npm run dev, user create/pay, admin review) - Code ready for testing
- [x] Verify UX rules (toasts, guards, demo mode) - Implemented in code
