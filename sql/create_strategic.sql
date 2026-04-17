-- Tabla principal del Plan Estratégico (Política)
CREATE TABLE `strategic_plan` (
  `idPlan` int(11) NOT NULL AUTO_INCREMENT,
  `idEmpresa` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `status` varchar(50) NOT NULL,
  `nature` text,
  `content` text,
  PRIMARY KEY (`idPlan`),
  KEY `idx_strategic_company` (`idEmpresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para los Principios
CREATE TABLE `strategic_principles` (
  `idPrincipio` int(11) NOT NULL AUTO_INCREMENT,
  `idPlan` int(11) NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`idPrincipio`),
  KEY `idx_principles_plan` (`idPlan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para los Objetivos y sus Indicadores
CREATE TABLE `strategic_objectives` (
  `idObjetivo` int(11) NOT NULL AUTO_INCREMENT,
  `idPlan` int(11) NOT NULL,
  `text` text NOT NULL,
  `indFormula` varchar(255) DEFAULT NULL,
  `indResponsible` varchar(150) DEFAULT NULL,
  `indExpected` varchar(150) DEFAULT NULL,
  `indCritical` varchar(150) DEFAULT NULL,
  `indSource` varchar(150) DEFAULT NULL,
  `indPeriodicity` varchar(100) DEFAULT NULL,
  `indType` varchar(100) DEFAULT NULL,
  `indLimitType` varchar(100) DEFAULT NULL,
  `indTarget` varchar(150) DEFAULT NULL,
  `indDate` date DEFAULT NULL,
  PRIMARY KEY (`idObjetivo`),
  KEY `idx_objectives_plan` (`idPlan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
