CREATE TABLE `legal_procedures` (
  `idLegal`       int(11)      NOT NULL AUTO_INCREMENT,
  `idEmpresa`     int(11)      NOT NULL,
  `titulo`        varchar(255) NOT NULL,
  `descripcion`   text         DEFAULT NULL,
  `rutaArchivo`   varchar(500) DEFAULT NULL,
  `fechaCreacion` date         NOT NULL,
  PRIMARY KEY (`idLegal`),
  KEY `idx_legal_empresa` (`idEmpresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
