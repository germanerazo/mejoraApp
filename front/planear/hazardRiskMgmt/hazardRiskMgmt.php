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

<!-- ===================== PANTALLA 3: Gestión de Riesgos ===================== -->
<div id="screenRiskManagement" style="display: none;">
    <div class="page-header">
        <h1 class="page-title">Gestión Peligros y Riesgos</h1>
        <p class="breadcrumbs" id="breadcrumbRisk">Inicio > Planear > Gestión Peligros y Riesgos > Planes > Actividades</p>
    </div>

    <!-- Header Info del Proceso -->
    <div class="risk-process-header">
        <div class="risk-header-top">
            <div class="risk-header-title">
                <i class="fas fa-project-diagram"></i>
                <span>Información del Proceso</span>
            </div>
            <button class="btn-secondary-premium" onclick="backToAnnualPlans()">
                <i class="fas fa-arrow-left"></i> Volver a Planes
            </button>
        </div>
        <div class="risk-header-grid">
            <div class="risk-header-item">
                <div class="risk-header-label">Nombre del Proceso</div>
                <div class="risk-header-value" id="riskHeaderName">—</div>
            </div>
            <div class="risk-header-item">
                <div class="risk-header-label">Fecha Creación</div>
                <div class="risk-header-value" id="riskHeaderDate">—</div>
            </div>
            <div class="risk-header-item">
                <div class="risk-header-label">Estado</div>
                <div id="riskHeaderStatus">—</div>
            </div>
            <div class="risk-header-item">
                <div class="risk-header-label">Código</div>
                <div class="risk-header-value" id="riskHeaderCode">—</div>
            </div>
        </div>
    </div>

    <!-- Tabla de Actividades -->
    <div class="content-card">
        <div class="section-header" style="margin-bottom: 15px;">
            <h2 class="section-title" style="font-size: 16px; color: #2b2d42; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-tasks" style="color: #329bd6;"></i> Actividades del Proceso
            </h2>
            <span class="activity-count-badge" id="activityCountBadge">0 actividades</span>
        </div>
        <div id="riskActivitiesContainer" class="table-responsive">
            <div class="empty-state">
                <i class="fas fa-spinner fa-spin fa-2x"></i>
                <p>Cargando actividades...</p>
            </div>
        </div>
    </div>
</div>

<!-- ===================== PANTALLA 4: Gestión de Peligros por Actividad ===================== -->
<div id="screenDangerMgmt" style="display: none;">
    <div class="page-header">
        <h1 class="page-title">Gestión Peligros y Riesgos</h1>
        <p class="breadcrumbs" id="breadcrumbDanger">Inicio > Planear > Gestión Peligros y Riesgos > Peligros</p>
    </div>

    <!-- Header Info de la Actividad -->
    <div class="risk-process-header">
        <div class="risk-header-top">
            <div class="risk-header-title">
                <i class="fas fa-clipboard-list"></i>
                <span>Actividad Seleccionada</span>
            </div>
            <button class="btn-secondary-premium" onclick="backToActivities()">
                <i class="fas fa-arrow-left"></i> Volver a Actividades
            </button>
        </div>
        <div class="risk-header-grid">
            <div class="risk-header-item">
                <div class="risk-header-label">Actividad</div>
                <div class="risk-header-value" id="dangerActivityName">—</div>
            </div>
            <div class="risk-header-item">
                <div class="risk-header-label">Área</div>
                <div class="risk-header-value" id="dangerActivityArea">—</div>
            </div>
            <div class="risk-header-item">
                <div class="risk-header-label">Act. Rutinaria</div>
                <div id="dangerActivityRoutine">—</div>
            </div>
            <div class="risk-header-item">
                <div class="risk-header-label">Act. Alto Riesgo</div>
                <div id="dangerActivityHighRisk">—</div>
            </div>
        </div>
    </div>

    <!-- Toolbar -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
        <h2 style="font-size: 16px; color: #2b2d42; display: flex; align-items: center; gap: 10px; margin: 0;">
            <i class="fas fa-exclamation-triangle" style="color: #e67e22;"></i> Peligros Asociados
            <span class="activity-count-badge" id="dangerCountBadge">0 peligros</span>
        </h2>
        <button class="btn-new-record" onclick="openAddDangerModal()">
            <i class="fas fa-plus-circle"></i> Agregar Peligro
        </button>
    </div>

    <!-- Danger Cards Container -->
    <div id="dangerCardsContainer">
        <div class="empty-state">
            <i class="fas fa-shield-alt fa-2x" style="color: #8d99ae; margin-bottom: 10px;"></i>
            <p>No hay peligros asignados a esta actividad.</p>
        </div>
    </div>
</div>

<!-- JS Principal -->
<script type="module" src="../planear/hazardRiskMgmt/hazardRiskMgmt.js?v=1.1"></script>
