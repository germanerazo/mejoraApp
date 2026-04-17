CREATE TABLE IF NOT EXISTS `risk_process_periods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idEmpresa` int(11) NOT NULL,
  `idFicha` int(11) NOT NULL,
  `idPlan` int(11) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_rp_ficha_plan` (`idFicha`, `idPlan`),
  FOREIGN KEY (`idFicha`) REFERENCES `process_sheet`(`idFicha`) ON DELETE CASCADE,
  FOREIGN KEY (`idPlan`) REFERENCES `annual_plans`(`idPlan`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
