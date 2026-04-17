CREATE TABLE `responsibility_types` (
  `idType` int(11) NOT NULL AUTO_INCREMENT,
  `typeName` varchar(150) NOT NULL,
  PRIMARY KEY (`idType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `responsibilities_catalog` (
  `idResp` int(11) NOT NULL AUTO_INCREMENT,
  `idType` int(11) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`idResp`),
  KEY `idx_resp_type` (`idType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Mock data suggest (Optional)
INSERT INTO `responsibility_types` (`typeName`) VALUES ('Responsabilidades'), ('Rendición de Cuentas');
