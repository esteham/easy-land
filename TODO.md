# TODO: Add Editable Land Type to Land Tax Registration

## Frontend Changes
- [x] Add landType state in LandTaxRegistration.jsx
- [x] Add input field for landType in the form
- [x] Include landType in the submit payload

## Backend Changes
- [x] Create new migration to add land_type column (string, nullable) to land_tax_registrations table
- [x] Add land_type to $fillable in LandTaxRegistration model
- [x] Add validation and storage of land_type in LandTaxRegistrationController store method

## Database
- [x] Run the migration to update the database schema

## Testing
- [ ] Test frontend form submission with landType
- [ ] Verify backend stores and retrieves land_type correctly
