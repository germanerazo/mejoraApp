CREATE TABLE IF NOT EXISTS `risk_consolidation_programs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idPlan` int(11) NOT NULL,
  `adc_id` int(11) NOT NULL,
  `programas` text DEFAULT NULL,
  `pve` text DEFAULT NULL,
  `subProgramas` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_plan_adc` (`idPlan`,`adc_id`),
  FOREIGN KEY (`idPlan`) REFERENCES `annual_plans`(`idPlan`) ON DELETE CASCADE,
  FOREIGN KEY (`adc_id`) REFERENCES `activity_danger_consequences`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
