CREATE TABLE `process_sheet` (
  `idFicha` int(11) NOT NULL AUTO_INCREMENT,
  `idEmpresa` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `objeto` text,
  `responsable` varchar(150),
  PRIMARY KEY (`idFicha`),
  KEY `idx_sheet_empresa` (`idEmpresa`),
  KEY `idx_sheet_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `process_activity` (
  `idActivity` int(11) NOT NULL AUTO_INCREMENT,
  `idFicha` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `area` varchar(150),
  `routine` varchar(50),
  `highRisk` varchar(50),
  PRIMARY KEY (`idActivity`),
  KEY `idx_act_ficha` (`idFicha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `process_resource` (
  `idResource` int(11) NOT NULL AUTO_INCREMENT,
  `idFicha` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`idResource`),
  KEY `idx_res_ficha` (`idFicha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `process_input` (
  `idInput` int(11) NOT NULL AUTO_INCREMENT,
  `idFicha` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`idInput`),
  KEY `idx_inp_ficha` (`idFicha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `process_procedure` (
  `idProcedure` int(11) NOT NULL AUTO_INCREMENT,
  `idFicha` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `file` varchar(255),
  PRIMARY KEY (`idProcedure`),
  KEY `idx_proc_ficha` (`idFicha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `process_personnel` (
  `idPersonnel` int(11) NOT NULL AUTO_INCREMENT,
  `idFicha` int(11) NOT NULL,
  `role` varchar(150) NOT NULL,
  `reportsTo` varchar(150),
  `quantity` varchar(50),
  `responsibilities` text,
  `accountabilities` text,
  PRIMARY KEY (`idPersonnel`),
  KEY `idx_pers_ficha` (`idFicha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
