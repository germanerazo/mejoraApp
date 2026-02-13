<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Consolidación de Riesgos</title>
    <!-- Common CSS -->
    <link rel="stylesheet" href="/mejoraApp/front/styles/colors.css">
    <link rel="stylesheet" href="/mejoraApp/front/planear/risk/risk.css?v=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>

<body>

    <div class="page-header">
        <h1 class="page-title">CONSOLIDACIÓN DE RIESGOS</h1>
        <div class="breadcrumbs">Planear > Gestión de Riesgos > Consolidación</div>
    </div>

    <!-- LIST VIEW: Períodos -->
    <div id="listView" class="content-card">
        <div style="margin-bottom: 20px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Seleccione un Período</h2>
        </div>

        <div class="table-responsive">
            <table class="modern-table" id="periodTable">
                <thead>
                    <tr>
                        <th style="text-align: center;">Período</th>
                        <th style="width: 80px; text-align: center;">Ver</th>
                    </tr>
                </thead>
                <tbody id="periodBody">
                    <!-- Populated by JS -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- DETAIL VIEW: Consolidación -->
    <div id="detailView" class="content-card" style="display: none;">
        <!-- Toolbar -->
        <div class="risk-actions" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <div style="display: flex; gap: 15px; align-items: center;">
                <div class="search-box" style="position: relative;">
                    <i class="fas fa-search" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #aaa;"></i>
                    <input type="text" id="searchRisk" placeholder="Buscar riesgo..." style="padding: 8px 10px 8px 30px; border: 1px solid #ddd; border-radius: 20px; outline: none; width: 250px;">
                </div>
                <select id="filterProcess" class="form-select" style="padding: 8px; border-radius: 6px; border: 1px solid #ddd;">
                    <option value="">Todo los Procesos</option>
                    <option value="Administrativa">Gestión Administrativa</option>
                    <option value="Operaciones">Operaciones</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                </select>

            </div>

            <div style="display: flex; gap: 10px;">
                <button class="btn-secondary-premium" onclick="goBackToList()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
            </div>
        </div>

        <!-- Risks Table -->
        <div class="table-responsive">
            <table class="modern-table" id="consolidationTable">
                <thead>
                    <tr>
                        <th style="width: 30px;"></th>
                        <th style="width: 250px;">Peligro</th>
                        <th style="width: 250px;">Medidas de prevención y control</th>
                        <th style="width: 150px;">Procesos</th>
                        <th style="width: 180px;">Programas de Gestión</th>
                        <th style="width: 150px;">PVE</th>
                        <th style="width: 150px;">Sub Programas</th>
                        <th style="width: 100px; text-align: center;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="consolidationBody">
                    <!-- Populated by JS -->
                </tbody>
            </table>
        </div>
        
        <!-- Estilos para filas expandibles -->
        <style>
            .expand-row {
                background-color: #f8f9fa;
                display: none;
            }
            .expand-row.active {
                display: table-row;
            }
            .expand-content {
                padding: 20px;
            }
            .program-detail {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 20px;
                margin-top: 15px;
            }
            .program-item {
                background: white;
                padding: 12px;
                border-left: 4px solid #329bd6;
                border-radius: 4px;
            }
            .program-item label {
                display: block;
                font-weight: 600;
                color: #2c3e50;
                font-size: 0.85em;
                margin-bottom: 5px;
            }
            .program-item span {
                display: block;
                color: #555;
                font-size: 0.95em;
            }
            .program-item.empty span {
                color: #999;
                font-style: italic;
            }
        </style>
    </div>

    <!-- Script -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script type="module" src="/mejoraApp/front/planear/riskConsolidation/riskConsolidation.js?v=1.0"></script>
</body>

</html>