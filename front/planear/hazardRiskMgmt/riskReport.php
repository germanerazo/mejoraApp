<!-- CSS -->
<link rel="stylesheet" href="../planear/hazardRiskMgmt/hazardRiskMgmt.css?v=1.1">
<link rel="stylesheet" href="../planear/hazardRiskMgmt/riskReport.css?v=1.0">

<!-- ===================== REPORTE MATRIZ DE PELIGROS Y RIESGOS ===================== -->
<div id="riskReportPage">

    <div class="page-header">
        <h1 class="page-title">Reporte Matriz de Peligros y Riesgos</h1>
        <p class="breadcrumbs">Inicio &gt; Planear &gt; Reporte Matriz de Peligros y Riesgos</p>
    </div>

    <!-- Filtros -->
    <div class="filter-bar">
        <div class="filter-group">
            <label for="rrFilterActivity">Actividad</label>
            <input type="text" id="rrFilterActivity" class="filter-input" placeholder="Buscar actividad..." oninput="rrApplyFilters()">
        </div>
        <div class="filter-group">
            <label for="rrFilterArea">Área</label>
            <input type="text" id="rrFilterArea" class="filter-input" placeholder="Filtrar área..." oninput="rrApplyFilters()">
        </div>
        <div class="filter-group">
            <label for="rrFilterDanger">Peligro</label>
            <input type="text" id="rrFilterDanger" class="filter-input" placeholder="Buscar peligro..." oninput="rrApplyFilters()">
        </div>
        <div class="filter-group">
            <label for="rrFilterAccept">Aceptabilidad</label>
            <select id="rrFilterAccept" class="filter-input" onchange="rrApplyFilters()">
                <option value="">Todas</option>
                <option value="Aceptable">Aceptable</option>
                <option value="No Aceptable">No Aceptable</option>
                <option value="No Aceptable o Aceptable con control específico">Con control específico</option>
            </select>
        </div>
        <button class="btn-filter-clear" onclick="rrClearFilters()">
            <i class="fas fa-undo"></i> Limpiar
        </button>
    </div>

    <!-- Toolbar de acciones -->
    <div class="rr-toolbar">
        <div class="rr-count-badge" id="rrCountBadge">
            <i class="fas fa-table"></i> <span id="rrRowCount">0</span> registros
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="rr-btn-print" onclick="rrPrint()">
                <i class="fas fa-print"></i> Imprimir
            </button>
            <button class="rr-btn-export" onclick="rrExportExcel()">
                <i class="fas fa-file-excel"></i> Exportar Excel
            </button>
        </div>
    </div>

    <!-- Tabla principal -->
    <div class="content-card" style="padding: 0;">
        <div class="rr-table-wrapper">
            <table class="rr-table" id="rrTable">
                <thead>
                    <tr>
                        <!-- Actividad -->
                        <th class="rr-th rr-sticky" style="min-width:140px;">Actividad</th>
                        <th class="rr-th" style="min-width:100px;">Área</th>
                        <th class="rr-th" style="min-width:90px;">Rutinaria</th>
                        <th class="rr-th" style="min-width:90px;">Alto Riesgo</th>
                        <!-- Peligro / Consecuencia -->
                        <th class="rr-th" style="min-width:150px;">Peligro</th>
                        <th class="rr-th" style="min-width:150px;">Consecuencia</th>
                        <!-- Evaluación -->
                        <th class="rr-th" style="min-width:160px;">Controles Existentes</th>
                        <th class="rr-th" style="min-width:80px;">Nvl Deficiencia</th>
                        <th class="rr-th" style="min-width:80px;">Nvl Exposición</th>
                        <th class="rr-th" style="min-width:80px;">Nvl Probabilidad</th>
                        <th class="rr-th" style="min-width:100px;">Interp. NP</th>
                        <th class="rr-th" style="min-width:80px;">Nvl Consecuencia</th>
                        <th class="rr-th" style="min-width:80px;">Nvl Riesgo</th>
                        <th class="rr-th" style="min-width:100px;">Interp. NR</th>
                        <th class="rr-th" style="min-width:140px;">Aceptabilidad</th>
                        <!-- Controles -->
                        <th class="rr-th" style="min-width:80px;">Nro. Expuestos</th>
                        <th class="rr-th" style="min-width:140px;">Peor Consecuencia</th>
                        <th class="rr-th" style="min-width:100px;">Req. Legales</th>
                        <th class="rr-th" style="min-width:200px;">Medidas de Prevención y Control</th>
                        <!-- Tipos de control -->
                        <th class="rr-th" style="min-width:80px;">Eliminación</th>
                        <th class="rr-th" style="min-width:80px;">Sustitución</th>
                        <th class="rr-th" style="min-width:110px;">Control Ingeniería</th>
                        <th class="rr-th" style="min-width:110px;">Control Admon.</th>
                        <th class="rr-th" style="min-width:60px;">EPP</th>
                    </tr>
                </thead>
                <tbody id="rrTableBody">
                    <tr>
                        <td colspan="24" class="empty-state">
                            <i class="fas fa-spinner fa-spin fa-2x"></i>
                            <p>Cargando reporte...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- SheetJS para exportar -->
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
<script type="module" src="../planear/hazardRiskMgmt/riskReport.js?v=1.0"></script>
