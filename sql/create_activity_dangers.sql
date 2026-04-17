-- ═══════════════════════════════════════════════════════════
-- Tablas de asociación: Actividad → Peligro → Consecuencia → Medida
-- ═══════════════════════════════════════════════════════════

-- Vincula una actividad del proceso con un peligro del catálogo
CREATE TABLE IF NOT EXISTS `activity_dangers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idActivity` int(11) NOT NULL,
  `danger_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ad_activity` (`idActivity`),
  KEY `idx_ad_danger` (`danger_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Vincula un activity_danger con una consecuencia del catálogo
CREATE TABLE IF NOT EXISTS `activity_danger_consequences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_danger_id` int(11) NOT NULL,
  `consequence_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_adc_ad` (`activity_danger_id`),
  KEY `idx_adc_consequence` (`consequence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Vincula un activity_danger_consequence con una medida preventiva
CREATE TABLE IF NOT EXISTS `activity_danger_consequence_measures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_danger_consequence_id` int(11) NOT NULL,
  `preventive_measure_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_adcm_adc` (`activity_danger_consequence_id`),
  KEY `idx_adcm_measure` (`preventive_measure_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
