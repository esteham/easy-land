# TODO: Add khatiyan_number to dags table

- [x] Modify migration file `backend/database/migrations/2025_10_01_170100_create_dags_table.php` to add `khatiyan_number` string column before `dag_no`.
- [x] Update seeder file `backend/database/seeders/GeographicalSeeder.php` to include `khatiyan_number` in Dag creation.
- [ ] Run `php artisan migrate:fresh` to apply migration changes (user denied, pending).
- [ ] Run `php artisan db:seed` to populate data with new field (user denied, pending).
