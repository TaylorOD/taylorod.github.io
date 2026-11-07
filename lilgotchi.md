# lilgotchi on this site

Home and projects use the 0.3.0 widget in assets/lilgotchi/0.3.0. Both offer Original egg, Slice, Cypunk and Lilgotchi, with storage-key="taylor-pocket-pets" and explicit migrate-legacy.

The migration copies valid older full game saves only when the new save is absent. Existing saved progress keeps its original storage key. Switching families keeps separate pets.

The source is https://github.com/TaylorOD/lilgotchi. Build that project with npm run build, copy the complete distribution into a new versioned assets folder, and update both script paths together. Keep the storage key stable.

Version 0.3.0 passes 142 automated checks. Chrome review covers the four choice picker and game on home and projects at desktop and mobile sizes. Physical phone testing and human audio listening remain separate. File import validation is tested, but browser file picker verification remains blocked by extension file access settings.

Screenshots are in pr-screenshots. There is no AI dialogue or provider connection.
