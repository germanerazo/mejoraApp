CREATE TABLE `processes` (
  `idProceso` int(11) NOT NULL AUTO_INCREMENT,
  `idEmpresa` int(11) NOT NULL,
  `tabName` varchar(100) NOT NULL COMMENT 'Estratégicos, Operacionales, De Apoyo',
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(100) NOT NULL,
  `sede` varchar(150) DEFAULT NULL,
  `created` date NOT NULL,
  `modified` date NOT NULL,
  PRIMARY KEY (`idProceso`),
  KEY `idx_process_company` (`idEmpresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
