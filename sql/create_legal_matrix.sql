-- ============================================================
-- Tabla: legal_matrix
-- Descripción: Almacena los registros de la Matriz Legal
--              por empresa (CRUD completo desde la pantalla
--              front/planear/legal/legal.php)
-- ============================================================
CREATE TABLE IF NOT EXISTS `legal_matrix` (
  `idLegal`        int(11)      NOT NULL AUTO_INCREMENT,
  `idEmpresa`      int(11)      NOT NULL,
  `clasificacion`  char(1)      NOT NULL COMMENT 'H=Higiene, S=Seguridad, E=Empresarial',
  `norma`          varchar(255) NOT NULL,
  `anioEmision`    year(4)      DEFAULT NULL,
  `disposicion`    varchar(500) DEFAULT NULL COMMENT 'Disposición que regula',
  `articulos`      varchar(500) DEFAULT NULL COMMENT 'Artículos aplicables',
  `descripcion`    text         DEFAULT NULL COMMENT 'Descripción del requisito',
  `evidencia`      text         DEFAULT NULL COMMENT 'Evidencia de cumplimiento',
  `responsable`    varchar(255) DEFAULT NULL,
  `existeAct`      enum('SI','NO') NOT NULL DEFAULT 'NO' COMMENT '¿Existe actividad?',
  `observacion`    text         DEFAULT NULL,
  `fecha`          date         DEFAULT NULL,
  `fechaCreacion`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idLegal`),
  KEY `idx_legal_matrix_empresa`  (`idEmpresa`),
  KEY `idx_legal_matrix_clasif`   (`clasificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Matriz Legal por empresa';
