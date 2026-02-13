<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Programa de Gestión</title>
    <!-- Common CSS -->
    <link rel="stylesheet" href="/mejoraApp/front/styles/colors.css">
    <link rel="stylesheet" href="/mejoraApp/front/planear/risk/risk.css?v=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>

    <div class="page-header">
        <h1 class="page-title" id="programTitle">PROGRAMA DE GESTIÓN</h1>
        <div class="breadcrumbs">Planear > Gestión de Riesgos > Consolidación > Programa de Gestión</div>
    </div>

    <!-- Content Card -->
    <div class="content-card">
        <!-- Objetivo Section -->
        <div class="form-section" style="margin-bottom: 25px;">
            <h3 class="section-subtitle">Objetivo</h3>
            <textarea id="objetivo" class="form-textarea" rows="4" placeholder="Descripción del objetivo del programa..."></textarea>
        </div>

        <!-- Marco Legal Section -->
        <div class="form-section" style="margin-bottom: 25px;">
            <h3 class="section-subtitle">Marco Legal Regulatorio</h3>
            <textarea id="marcoLegal" class="form-textarea" rows="3" placeholder="Normatividad aplicable..."></textarea>
        </div>

        <!-- Peligros Asociados Section -->
        <div class="form-section" style="margin-bottom: 25px;">
            <h3 class="section-subtitle">Peligros Asociados</h3>
            <div id="peligrosContainer" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                <!-- Populated by JS -->
            </div>
            <button class="btn-new-record" onclick="addPeligro()" style="padding: 6px 12px;">
                <i class="fas fa-plus"></i> Agregar Peligro
            </button>
        </div>

        <!-- Indicadores de Gestión Section -->
        <div class="form-section" style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 class="section-subtitle" style="margin: 0;">Indicadores de Gestión</h3>
                <button class="btn-new-record" onclick="addIndicador()">
                    <i class="fas fa-plus"></i> Nuevo Registro
                </button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="indicadoresTable">
                    <thead>
                        <tr>
                            <th style="width: 80px;">Acción</th>
                            <th style="width: 250px;">Descripción de Fórmula</th>
                            <th style="width: 120px;">Límite Esperado</th>
                            <th style="width: 120px;">Límite Crítico</th>
                            <th style="width: 150px;">Fuente de Información</th>
                            <th style="width: 120px;">Periodicidad</th>
                            <th style="width: 150px;">Dirigido A</th>
                        </tr>
                    </thead>
                    <tbody id="indicadoresBody">
                        <!-- Populated by JS -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Medidas de Prevención y Control Section -->
        <div class="form-section" style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 class="section-subtitle" style="margin: 0;">Medidas de Prevención y Control</h3>
                <button class="btn-new-record" onclick="addMedida()">
                    <i class="fas fa-plus"></i> Nuevo Registro
                </button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="medidasTable">
                    <thead>
                        <tr>
                            <th style="width: 80px;">Acción</th>
                            <th style="width: 300px;">Medidas de Prevención y Control</th>
                            <th style="width: 150px;">Responsable</th>
                            <th style="width: 120px;">Recurso</th>
                            <th style="width: 150px;">Fecha de Planeación</th>
                            <th style="width: 150px;">Cargos Dirigidos</th>
                        </tr>
                    </thead>
                    <tbody id="medidasBody">
                        <!-- Populated by JS -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; justify-content: center; gap: 15px; margin-top: 30px;">
            <button class="btn-new-record" onclick="savePrograma()" style="padding: 12px 30px;">
                <i class="fas fa-save"></i> Guardar
            </button>
            <button class="btn-secondary-premium" onclick="goBackToConsolidation()" style="padding: 12px 30px;">
                <i class="fas fa-arrow-left"></i> Volver
            </button>
        </div>
    </div>

    <!-- Script -->
    <script type="module" src="/mejoraApp/front/planear/riskConsolidation/riskActions.js?v=1.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>