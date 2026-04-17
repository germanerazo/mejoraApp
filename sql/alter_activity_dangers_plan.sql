ALTER TABLE `activity_dangers` ADD COLUMN `idPlan` INT(11) DEFAULT NULL AFTER `danger_id`;
ALTER TABLE `activity_dangers` ADD CONSTRAINT `fk_ad_plan` FOREIGN KEY (`idPlan`) REFERENCES `annual_plans`(`idPlan`) ON DELETE CASCADE;
