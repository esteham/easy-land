# TODO: Implement Match Endpoint for Land Tax Registrations

## Steps to Complete

- [x] Add custom route for `/land-tax-registrations/{id}/match` in `backend/routes/api.php` inside the `auth:api` middleware group.
- [x] Implement the `match` method in `backend/app/Http/Controllers/API/LandTaxRegistrationController.php` to check if dag_number exists in mouza's dags with matching survey_type_id and khatiyan_number is in the dag's khotiyan array.
- [x] Optimize the match method to use a single query with exists() and whereJsonContains for better performance.
- [x] Update route parameter to use model binding: `{land_tax_registration}` instead of `{id}`.
- [x] Update controller method to use model binding: `LandTaxRegistration $land_tax_registration` instead of `$id`.
- [x] Testing skipped as per user request.

## Notes
- The route should be added after the existing `land-tax-registrations` resource route.
- The match method should query Dag via mouza->zils->dags relationship.
- Ensure the response is JSON with 'matched' key as boolean.
