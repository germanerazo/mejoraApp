-- Agregar campo de frecuencia de rendición de cuentas a la tabla process_personnel
ALTER TABLE `process_personnel`
  ADD COLUMN `accountabilityFrequency` varchar(100) DEFAULT NULL AFTER `accountabilities`;
