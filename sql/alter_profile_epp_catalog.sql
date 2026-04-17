-- Agregar FK al catálogo EPP en la tabla profile_epp
ALTER TABLE `profile_epp`
    ADD COLUMN `idEppCatalog` INT(11) NULL COMMENT 'FK -> epp_catalog.id'
    AFTER `idProfile`;
