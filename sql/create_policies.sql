CREATE TABLE `policies` (
  `idPolitica` int(11) NOT NULL AUTO_INCREMENT,
  `idEmpresa` int(11) NOT NULL,
  `nomPolitica` varchar(255) NOT NULL,
  `fechaCreacion` date NOT NULL,
  `rutaArchivo` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idPolitica`),
  KEY `idx_policies_company` (`idEmpresa`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
