# Land Tax Registration Implementation

## Completed Tasks

### Backend
- [x] Created migration for `land_tax_registrations` table with fields: user_id, division_id, district_id, upazila_id, mouza_id, survey_type_id, khatiyan_number, dag_number, status, submitted_at, reviewer_id, notes
- [x] Created `LandTaxRegistration` model with relationships to User, Division, District, Upazila, Mouza, SurveyType
- [x] Created `LandTaxRegistrationController` with index, store, update methods
- [x] Added API routes for land-tax-registrations (index, store, update)
- [x] Ran migration to create the table

### Frontend
- [x] Created `LandTaxRegistration.jsx` page with cascading dropdowns for location selection (Division -> District -> Upazila -> Mouza) and Survey Type, Khatiyan Number, Dag Number inputs
- [x] Added route `/land-tax` in App.jsx
- [x] Created `AdminLandTaxRegistrations.jsx` component for admin to view and manage registrations (approve, reject, flag)
- [x] Added admin route `/admin/land-tax-registrations` in App.jsx
- [x] Added sidebar link "Land Tax Register" in admin dashboard

### Features Implemented
- [x] User can register for land tax by selecting location hierarchy and entering khatiyan/dag numbers
- [x] Success alert: "Registration completed. The authority will review your registration and approve or reject it within 7 working days. Thank you for registering for Land Tax."
- [x] Admin can view all registrations in a table with user details, location, khatiyan/dag, status, submission date
- [x] Admin can approve, reject, or flag registrations with notes
- [x] Status colors: pending (yellow), approved (green), rejected (red), flagged (orange)
- [x] Reviewer tracking (who approved/rejected)

### Database Schema
- `land_tax_registrations` table includes all required fields for land tax registration process

### API Endpoints
- `GET /api/land-tax-registrations` - List registrations (admin only)
- `POST /api/land-tax-registrations` - Create new registration (authenticated users)
- `PUT /api/land-tax-registrations/{id}` - Update status (admin only)

### User Flow
1. User navigates to `/land-tax`
2. Selects Division, District, Upazila, Mouza from cascading dropdowns
3. Selects Survey Type
4. Enters Khatiyan Number and Dag Number
5. Submits registration
6. Receives success alert
7. Admin reviews in `/admin/land-tax-registrations`
8. Admin approves or rejects within 7 working days

## Notes
- Assumes existing location hierarchy (divisions, districts, upazilas, mouzas, survey_types) is already seeded
- Uses existing authentication and role-based access (admin/acland can manage)
- Frontend uses existing API client and error handling patterns
- Admin table shows reviewer name if status changed
- Flagged registrations can have notes for special attention
