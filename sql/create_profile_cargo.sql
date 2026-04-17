-- ============================================================
-- PERFIL DE CARGO
-- Fuente de "cargo" y "reportsTo": process_personnel (idPersonnel, role, reportsTo)
-- ============================================================

-- Tabla principal del perfil de cargo
CREATE TABLE IF NOT EXISTS `profile_cargo` (
    `id`            INT(11) NOT NULL AUTO_INCREMENT,
    `idEmpresa`     INT(11) NOT NULL,
    `idPersonnel`   INT(11) NOT NULL COMMENT 'FK -> process_personnel.idPersonnel (cargo)',
    `reportsTo`     VARCHAR(200) DEFAULT NULL COMMENT 'Cargo al que reporta (texto libre o role de personnel)',
    `createdAt`     DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_pc_empresa` (`idEmpresa`),
    KEY `idx_pc_personnel` (`idPersonnel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Responsabilidades del cargo
CREATE TABLE IF NOT EXISTS `profile_responsibilidades` (
    `id`            INT(11) NOT NULL AUTO_INCREMENT,
    `idProfile`     INT(11) NOT NULL,
    `descripcion`   TEXT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_pr_profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Educación
CREATE TABLE IF NOT EXISTS `profile_educacion` (
    `id`            INT(11) NOT NULL AUTO_INCREMENT,
    `idProfile`     INT(11) NOT NULL,
    `descripcion`   TEXT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_pe_profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Formación
CREATE TABLE IF NOT EXISTS `profile_formacion` (
    `id`            INT(11) NOT NULL AUTO_INCREMENT,
    `idProfile`     INT(11) NOT NULL,
    `descripcion`   TEXT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_pf_profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Experiencia
CREATE TABLE IF NOT EXISTS `profile_experiencia` (
    `id`            INT(11) NOT NULL AUTO_INCREMENT,
    `idProfile`     INT(11) NOT NULL,
    `descripcion`   TEXT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_pex_profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Profesiograma
CREATE TABLE IF NOT EXISTS `profile_profesiograma` (
    `id`            INT(11) NOT NULL AUTO_INCREMENT,
    `idProfile`     INT(11) NOT NULL,
    `descripcion`   TEXT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_pp_profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Matriz de Competencias y Habilidades
CREATE TABLE IF NOT EXISTS `profile_competencias` (
    `id`            INT(11) NOT NULL AUTO_INCREMENT,
    `idProfile`     INT(11) NOT NULL,
    `descripcion`   TEXT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_pco_profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Perfil SST: Identificación de Peligros y Riesgos
CREATE TABLE IF NOT EXISTS `profile_sst_riesgos` (
    `id`            INT(11) NOT NULL AUTO_INCREMENT,
    `idProfile`     INT(11) NOT NULL,
    `descripcion`   TEXT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_psr_profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Perfil SST: Responsabilidades SST
CREATE TABLE IF NOT EXISTS `profile_sst_responsabilidades` (
    `id`            INT(11) NOT NULL AUTO_INCREMENT,
    `idProfile`     INT(11) NOT NULL,
    `descripcion`   TEXT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_psrs_profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Elementos de Protección Personal (EPP)
CREATE TABLE IF NOT EXISTS `profile_epp` (
    `id`            INT(11) NOT NULL AUTO_INCREMENT,
    `idProfile`     INT(11) NOT NULL,
    `descripcion`   TEXT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_pepp_profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
