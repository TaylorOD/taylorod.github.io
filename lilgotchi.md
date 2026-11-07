# lilgotchi on this site

Home and projects load the same public widget from `assets/lilgotchi/0.1.0`. Both use `storage-key="taylor-pocket-pets"` and explicit `migrate-legacy`.

The migration copies valid full game saves only when the corresponding new save is absent. It keeps the original data. New or damaged destination saves are never silently replaced. The earlier simplified game save is untouched.

The source is https://github.com/TaylorOD/lilgotchi. Build that project with `npm run build`, then copy the complete distribution into a new versioned assets folder and update both script paths together. Keep the storage key stable.

Browser review covered the home and projects pages at desktop and phone sizes. A synthetic legacy child migrated, accepted a meal, and resumed with the updated hunger across navigation and reload. Its original save remained unchanged. The package passes 72 tests. File import validation is tested, but browser upload verification remains blocked by the test extension file access setting.

Screenshots are in `pr-screenshots/site-*.jpg`. Optional dialogue is not configured on this site and makes no provider calls.
