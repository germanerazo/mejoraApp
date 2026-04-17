-- ═══════════════════════════════════════════════════════════
-- Actualización de la tabla: activity_danger_consequence_measures
-- ═══════════════════════════════════════════════════════════

ALTER TABLE `activity_danger_consequence_measures`
ADD COLUMN `elimination` TINYINT(1) DEFAULT 0,
ADD COLUMN `substitution` TINYINT(1) DEFAULT 0,
ADD COLUMN `engineering_control` TINYINT(1) DEFAULT 0,
ADD COLUMN `administrative_control` TINYINT(1) DEFAULT 0,
ADD COLUMN `ppe` TINYINT(1) DEFAULT 0;
