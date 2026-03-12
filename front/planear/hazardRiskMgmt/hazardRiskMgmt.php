<!-- CSS Adicional -->
<link rel="stylesheet" href="../planear/process/processMap.css">
<link rel="stylesheet" href="../planear/hazardRiskMgmt/hazardRiskMgmt.css?v=1.1">

<!-- ===================== PANTALLA 1: Listado de Procesos ===================== -->
<div id="screenProcessList">
    <div class="page-header">
        <h1 class="page-title">Gestión Peligros y Riesgos</h1>
        <p class="breadcrumbs">Inicio > Planear > Gestión Peligros y Riesgos</p>
    </div>

    <!-- Filtros -->
    <div class="filter-bar">
        <div class="filter-group">
            <label for="filterName">Buscar Proceso</label>
            <input type="text" id="filterName" class="filter-input" placeholder="Nombre del proceso..." oninput="applyFilters()">
        </div>
        <div class="filter-group">
            <label for="filterStatus">Estado</label>
            <select id="filterStatus" class="filter-input" onchange="applyFilters()">
                <option value="">Todos los estados</option>
                <option value="Vigente">Vigente</option>
                <option value="Pendiente de aprobación">Pendiente de aprobación</option>
                <option value="Obsoleto">Obsoleto</option>
            </select>
        </div>
        <button class="btn-filter-clear" onclick="clearFilters()">
            <i class="fas fa-undo"></i> Limpiar
        </button>
    </div>

    <div class="content-card">
        <div id="processContainer" class="table-responsive">
            <div class="empty-state">
                <i class="fas fa-spinner fa-spin fa-2x"></i>
                <p>Cargando procesos...</p>
            </div>
        </div>
    </div>
</div>

<!-- ===================== PANTALLA 2: Planes de Trabajo Anual ===================== -->
<div id="screenAnnualPlans" style="display: none;">
    <div class="page-header">
        <h1 class="page-title">Gestión Peligros y Riesgos</h1>
        <p class="breadcrumbs" id="breadcrumbPlans">Inicio > Planear > Gestión Peligros y Riesgos > Planes de Trabajo</p>
    </div>

    <!-- Info del proceso seleccionado -->
    <div class="process-info-card">
        <div class="process-info-left">
            <i class="fas fa-project-diagram process-info-icon"></i>
            <div>
                <div class="process-info-label">Proceso Seleccionado</div>
                <div class="process-info-name" id="selectedProcessName">—</div>
            </div>
        </div>
        <button class="btn-secondary-premium" onclick="backToProcessList()">
            <i class="fas fa-arrow-left"></i> Volver a Procesos
        </button>
    </div>

    <div class="content-card">
        <div id="annualPlansContainer" class="table-responsive">
            <div class="empty-state">
                <i class="fas fa-spinner fa-spin fa-2x"></i>
                <p>Cargando planes de trabajo...</p>
            </div>
        </div>
    </div>
</div>

<!-- ===================== PANTALLA 3: Gestión de Riesgos (placeholder) ===================== -->
<div id="screenRiskManagement" style="display: none;">
    <div class="page-header">
        <h1 class="page-title">Gestión Peligros y Riesgos</h1>
        <p class="breadcrumbs" id="breadcrumbRisk">Inicio > Planear > Gestión Peligros y Riesgos > Planes > Matriz de Riesgos</p>
    </div>

    <div class="process-info-card">
        <div class="process-info-left">
            <i class="fas fa-calendar-alt process-info-icon"></i>
            <div>
                <div class="process-info-label" id="riskProcessLabel">Proceso</div>
                <div class="process-info-name" id="riskPeriodLabel">Período</div>
            </div>
        </div>
        <button class="btn-secondary-premium" onclick="backToAnnualPlans()">
            <i class="fas fa-arrow-left"></i> Volver a Planes
        </button>
    </div>

    <div class="content-card">
        <div id="riskManagementContainer" class="table-responsive">
            <div class="empty-state">
                <i class="fas fa-hard-hat fa-2x" style="color: #329bd6;"></i>
                <p>Pantalla de gestión de riesgos en desarrollo.</p>
            </div>
        </div>
    </div>
</div>

<!-- JS Principal -->
<script type="module" src="../planear/hazardRiskMgmt/hazardRiskMgmt.js?v=1.1"></script>
