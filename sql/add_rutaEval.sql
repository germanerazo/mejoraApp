-- Script para agregar el campo rutaEval a la tabla companies
-- Ejecutar una sola vez en phpMyAdmin o desde la consola MySQL

ALTER TABLE `companies`
    ADD COLUMN `rutaEval` VARCHAR(500) NULL DEFAULT NULL
    COMMENT 'Ruta del archivo de Evaluación Inicial';
