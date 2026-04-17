-- ============================================================
-- EPP Catálogo (Elementos de Protección Personal)
-- ============================================================
CREATE TABLE IF NOT EXISTS `epp_catalog` (
    `id`          INT(11) NOT NULL AUTO_INCREMENT,
    `idEmpresa`   INT(11) NOT NULL,
    `name`        VARCHAR(255) NOT NULL,
    `standard`    VARCHAR(255) DEFAULT NULL COMMENT 'Norma técnica (Ej: ANSI Z89.1)',
    `createdAt`   DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_epp_empresa` (`idEmpresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
