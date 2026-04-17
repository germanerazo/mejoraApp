-- Tabla cabecera: un presupuesto por año por empresa
CREATE TABLE IF NOT EXISTS `budget_years` (
  `idBudget`  int(11)     NOT NULL AUTO_INCREMENT,
  `idEmpresa` int(11)     NOT NULL,
  `year`      year(4)     NOT NULL,
  `createdAt` timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idBudget`),
  UNIQUE KEY `uq_empresa_year` (`idEmpresa`, `year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla detalle: ítems (actividades) del presupuesto
CREATE TABLE IF NOT EXISTS `budget_items` (
  `idItem`     int(11)        NOT NULL AUTO_INCREMENT,
  `idBudget`   int(11)        NOT NULL,
  `activity`   varchar(500)   NOT NULL DEFAULT '',
  `unitValue`  decimal(15,2)  NOT NULL DEFAULT 0,
  `quantity`   decimal(10,2)  NOT NULL DEFAULT 0,
  `unit`       varchar(50)    NOT NULL DEFAULT '',
  PRIMARY KEY (`idItem`),
  FOREIGN KEY (`idBudget`) REFERENCES `budget_years`(`idBudget`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
