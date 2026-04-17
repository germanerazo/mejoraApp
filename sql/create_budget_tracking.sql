-- Tabla de seguimiento mensual del presupuesto
-- Un registro por mes (1-12) por presupuesto (budget_year)
CREATE TABLE IF NOT EXISTS `budget_tracking` (
  `idTracking`  int(11)        NOT NULL AUTO_INCREMENT,
  `idBudget`    int(11)        NOT NULL,
  `month`       tinyint(2)     NOT NULL COMMENT '1=Enero ... 12=Diciembre',
  `budget`      decimal(15,2)  NOT NULL DEFAULT 0 COMMENT 'Valor presupuestado ese mes',
  `executed`    decimal(15,2)  NOT NULL DEFAULT 0 COMMENT 'Valor ejecutado ese mes',
  PRIMARY KEY (`idTracking`),
  UNIQUE KEY `uq_budget_month` (`idBudget`, `month`),
  FOREIGN KEY (`idBudget`) REFERENCES `budget_years`(`idBudget`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
