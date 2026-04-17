CREATE TABLE IF NOT EXISTS `annual_plans` (
  `idPlan` int(11) NOT NULL AUTO_INCREMENT,
  `idEmpresa` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  PRIMARY KEY (`idPlan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `annual_objectives` (
  `idObjective` int(11) NOT NULL AUTO_INCREMENT,
  `idPlan` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `objective` text NOT NULL,
  `meta` text NOT NULL,
  PRIMARY KEY (`idObjective`),
  FOREIGN KEY (`idPlan`) REFERENCES `annual_plans`(`idPlan`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `annual_activities` (
  `idActivity` int(11) NOT NULL AUTO_INCREMENT,
  `idPlan` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `activity` text NOT NULL,
  `responsible` varchar(255) NOT NULL,
  `resources` varchar(255) NOT NULL,
  `target` varchar(255) NOT NULL,
  `planDate` date NOT NULL,
  `execDate` date DEFAULT NULL,
  `obs` text DEFAULT NULL,
  PRIMARY KEY (`idActivity`),
  FOREIGN KEY (`idPlan`) REFERENCES `annual_plans`(`idPlan`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `annual_signatures` (
  `idSignature` int(11) NOT NULL AUTO_INCREMENT,
  `idPlan` int(11) NOT NULL,
  `name1` varchar(255) DEFAULT '',
  `role1` varchar(255) DEFAULT '',
  `imgSrc1` longtext DEFAULT NULL,
  `name2` varchar(255) DEFAULT '',
  `role2` varchar(255) DEFAULT '',
  `imgSrc2` longtext DEFAULT NULL,
  PRIMARY KEY (`idSignature`),
  UNIQUE KEY `idPlan` (`idPlan`),
  FOREIGN KEY (`idPlan`) REFERENCES `annual_plans`(`idPlan`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
