<!-- CSS -->
<link rel="stylesheet" href="../planear/process/processMap.css">
<link rel="stylesheet" href="../planear/dangerCatalog/dangerCatalog.css?v=1.0">

<div class="page-header">
    <h1 class="page-title">Catálogo de Peligros</h1>
    <p class="breadcrumbs">Inicio > Planear > Catálogo de Peligros</p>
</div>

<!-- Stats -->
<div class="catalog-stats">
    <div class="catalog-stat-card">
        <div class="catalog-stat-icon types">
            <i class="fas fa-layer-group"></i>
        </div>
        <div>
            <div class="catalog-stat-value" id="statTypes">0</div>
            <div class="catalog-stat-label">Tipos de Peligro</div>
        </div>
    </div>
    <div class="catalog-stat-card">
        <div class="catalog-stat-icon dangers">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div>
            <div class="catalog-stat-value" id="statDangers">0</div>
            <div class="catalog-stat-label">Peligros Registrados</div>
        </div>
    </div>
    <div class="catalog-stat-card">
        <div class="catalog-stat-icon described">
            <i class="fas fa-align-left"></i>
        </div>
        <div>
            <div class="catalog-stat-value" id="statDescribed">0</div>
            <div class="catalog-stat-label">Con Descripción</div>
        </div>
    </div>
</div>

<!-- Filter Bar -->
<div class="catalog-filter-bar">
    <div class="catalog-filter-group">
        <label for="catalogFilterName"><i class="fas fa-search"></i> Buscar Peligro</label>
        <input type="text" id="catalogFilterName" class="catalog-filter-input" placeholder="Nombre del peligro..." oninput="applyCatalogFilters()">
    </div>
    <div class="catalog-filter-group">
        <label for="catalogFilterType"><i class="fas fa-layer-group"></i> Tipo de Peligro</label>
        <select id="catalogFilterType" class="catalog-filter-input" onchange="applyCatalogFilters()">
            <option value="">Todos los tipos</option>
        </select>
    </div>
    <button class="catalog-btn-clear" onclick="clearCatalogFilters()">
        <i class="fas fa-undo"></i> Limpiar
    </button>
</div>

<!-- Toolbar -->
<div class="catalog-toolbar">
    <div class="catalog-toolbar-left">
        <h2>
            <i class="fas fa-exclamation-triangle" style="color: #e67e22;"></i> Peligros
            <span class="catalog-count-badge" id="catalogCountBadge">0 peligros</span>
        </h2>
    </div>
    <div class="catalog-toolbar-right">
        <button class="btn-new-type" onclick="openCreateTypeModal()">
            <i class="fas fa-folder-plus"></i> Nuevo Tipo de Peligro
        </button>
        <button class="btn-new-record" onclick="openCreateDangerModal()">
            <i class="fas fa-plus-circle"></i> Nuevo Peligro
        </button>
    </div>
</div>

<!-- Table -->
<div class="content-card">
    <div class="table-responsive">
        <table class="modern-table" id="catalogTable">
            <thead>
                <tr>
                    <th>Tipo de Peligro</th>
                    <th>Nombre del Peligro</th>
                    <th>Descripción</th>
                    <th style="text-align: center; width: 120px;">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr><td colspan="4" class="empty-state">Cargando catálogo de peligros...</td></tr>
            </tbody>
        </table>
    </div>
</div>

<script type="module" src="../planear/dangerCatalog/dangerCatalog.js?v=<?= time() ?>"></script>
