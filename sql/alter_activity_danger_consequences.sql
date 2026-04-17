-- ═══════════════════════════════════════════════════════════
-- Actualización de la tabla: activity_danger_consequences
-- ═══════════════════════════════════════════════════════════

ALTER TABLE `activity_danger_consequences`
ADD COLUMN `existing_controls` TEXT DEFAULT NULL,
ADD COLUMN `deficiency_level` INT(11) DEFAULT NULL,
ADD COLUMN `exposure_level` INT(11) DEFAULT NULL,
ADD COLUMN `consequence_level` INT(11) DEFAULT NULL,
ADD COLUMN `exposed_count` INT(11) DEFAULT NULL,
ADD COLUMN `worst_consequence` TEXT DEFAULT NULL,
ADD COLUMN `legal_requirements` VARCHAR(2) DEFAULT NULL;
