<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Nuevo Indicador</title>
    <!-- Common CSS -->
    <link rel="stylesheet" href="/mejoraApp/front/styles/colors.css">
    <link rel="stylesheet" href="/mejoraApp/front/planear/risk/risk.css?v=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .form-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .form-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
            vertical-align: middle;
        }
        .form-label-cell {
            background-color: #f8f9fa;
            width: 30%;
            font-weight: 600;
            color: #2c3e50;
            text-align: left;
        }
        .form-input-cell {
            width: 70%;
        }
        .form-control {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        .form-control:focus {
            border-color: #329bd6;
            outline: none;
        }
        .limit-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .limit-select {
            width: 80px;
        }
        .section-header {
            background-color: #343a40;
            color: white;
            padding: 10px 15px;
            font-weight: bold;
            text-transform: uppercase;
            border-radius: 4px 4px 0 0;
            text-align: center;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>

    <div class="page-header">
        <h1 class="page-title">NUEVO INDICADOR</h1>
        <div class="breadcrumbs">Planear > Gestión de Riesgos > Consolidación > Programa de Gestión > Nuevo Indicador</div>
    </div>

    <div class="content-card" style="max-width: 900px; margin: 0 auto;">
        
        <div class="section-header">INDICADORES</div>
        
        <form id="indicatorForm">
            <table class="form-table">
                <tr>
                    <td class="form-label-cell">Descripción de Formula</td>
                    <td class="form-input-cell">
                        <input type="text" id="formula" class="form-control" name="formula">
                    </td>
                </tr>
                <tr>
                    <td class="form-label-cell">Responsable</td>
                    <td class="form-input-cell">
                        <select id="responsable" class="form-control" name="responsable">
                            <option value="">Seleccione</option>
                            <option value="Auxiliar Administrativa y contable - Bogotá">Auxiliar Administrativa y contable - Bogotá</option>
                            <option value="Auxiliar Administrativo - Plantación">Auxiliar Administrativo - Plantación</option>
                            <option value="Auxiliar de Campo">Auxiliar de Campo</option>
                            <option value="Auxiliar de Sanidad">Auxiliar de Sanidad</option>
                            <option value="Campamentero">Campamentero</option>
                            <option value="Carguero">Carguero</option>
                            <option value="Cosechero">Cosechero</option>
                            <option value="Director Contable y Administrativo">Director Contable y Administrativo</option>
                            <option value="Director Plantación">Director Plantación</option>
                            <option value="Gerente">Gerente</option>
                            <option value="Mantenimiento de instalaciones">Mantenimiento de instalaciones</option>
                            <option value="Plateo Mecánico">Plateo Mecánico</option>
                            <option value="Plateo Químico - Mantenimiento">Plateo Químico - Mantenimiento</option>
                            <option value="Responsable del SG-SST">Responsable del SG-SST</option>
                            <option value="Soldador">Soldador</option>
                            <option value="Supervisor de campo">Supervisor de campo</option>
                            <option value="Supervisor de mantenimiento">Supervisor de mantenimiento</option>
                            <option value="Supervisor Sanidad">Supervisor Sanidad</option>
                            <option value="Tractorista - Cable aéreo">Tractorista - Cable aéreo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="form-label-cell">Limite Esperado</td>
                    <td class="form-input-cell">
                        <div class="limit-group">
                            <select id="limiteOperador" class="form-control limit-select">
                                <option value=">=">>=</option>
                                <option value="<="><=</option>
                                <option value="=">=</option>
                            </select>
                            <span>a</span>
                            <input type="text" id="limiteEsperado" class="form-control" style="width: 150px;">
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="form-label-cell">Limite Critico No Cumplimiento</td>
                    <td class="form-input-cell">
                        <input type="text" id="limiteCritico" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td class="form-label-cell">Fuente de Información</td>
                    <td class="form-input-cell">
                        <input type="text" id="fuenteInformacion" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td class="form-label-cell">Periodicidad</td>
                    <td class="form-input-cell">
                        <select id="periodicidad" class="form-control">
                            <option value="Diario">Diario</option>
                            <option value="Semanal">Semanal</option>
                            <option value="Quincenal">Quincenal</option>
                            <option value="Mensual">Mensual</option>
                            <option value="Bimestral">Bimestral</option>
                            <option value="Trimestral">Trimestral</option>
                            <option value="Semestral">Semestral</option>
                            <option value="Anual">Anual</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="form-label-cell">Tipo de Indicador</td>
                    <td class="form-input-cell">
                        <select id="tipoIndicador" class="form-control">
                            <option value="Indicador de Proceso">Indicador de Proceso</option>
                            <option value="Indicador de Resultado">Indicador de Resultado</option>
                            <option value="Indicador de Estructura">Indicador de Estructura</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="form-label-cell">Tipo Limite</td>
                    <td class="form-input-cell">
                        <select id="tipoLimite" class="form-control">
                            <option value="Mayor o Igual">Mayor o Igual</option>
                            <option value="Menor o Igual">Menor o Igual</option>
                            <option value="Igual">Igual</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="form-label-cell">Dirigido A</td>
                    <td class="form-input-cell">
                        <input type="text" id="dirigidoA" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td class="form-label-cell">Fecha</td>
                    <td class="form-input-cell">
                        <input type="date" id="fecha" class="form-control">
                    </td>
                </tr>
            </table>

            <div style="display: flex; gap: 15px; margin-top: 30px;">
                <button type="button" class="btn-new-record" onclick="saveIndicador()" style="padding: 10px 25px;">
                    Guardar
                </button>
                <button type="button" class="btn-secondary-premium" onclick="goBack()" style="padding: 10px 25px;">
                    Volver
                </button>
            </div>
        </form>
    </div>

    <!-- Script -->
    <script type="module" src="/mejoraApp/front/planear/riskConsolidation/riskIndicator.js?v=1.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>
