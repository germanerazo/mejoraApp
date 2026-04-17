CREATE TABLE `annual_plans` (
  `idPlan` int(11) NOT NULL AUTO_INCREMENT,
  `idEmpresa` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `fechaCreacion` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idPlan`),
  KEY `idx_annual_company` (`idEmpresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `annual_objectives` (
  `idObjective` int(11) NOT NULL AUTO_INCREMENT,
  `idPlan` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `objective` text NOT NULL,
  `meta` text NOT NULL,
  PRIMARY KEY (`idObjective`),
  KEY `idx_obj_plan` (`idPlan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `annual_activities` (
  `idActivity` int(11) NOT NULL AUTO_INCREMENT,
  `idPlan` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `activity` text NOT NULL,
  `responsible` varchar(255) NOT NULL,
  `resources` text,
  `target` varchar(255),
  `planDate` date DEFAULT NULL,
  `execDate` date DEFAULT NULL,
  `obs` text,
  PRIMARY KEY (`idActivity`),
  KEY `idx_act_plan` (`idPlan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `annual_signatures` (
  `idPlan` int(11) NOT NULL,
  `name1` varchar(255) DEFAULT NULL,
  `role1` varchar(150) DEFAULT NULL,
  `imgSrc1` longtext DEFAULT NULL,
  `name2` varchar(255) DEFAULT NULL,
  `role2` varchar(150) DEFAULT NULL,
  `imgSrc2` longtext DEFAULT NULL,
  PRIMARY KEY (`idPlan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
