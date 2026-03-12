<!-- CSS Adicional -->
<link rel="stylesheet" href="../planear/process/processMap.css">
<link rel="stylesheet" href="../planear/hazardRiskMgmt/hazardRiskMgmt.css?v=1.0">

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

<!-- JS Principal -->
<script type="module" src="../planear/hazardRiskMgmt/hazardRiskMgmt.js?v=1.0"></script>
