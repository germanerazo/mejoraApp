<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mapa de Procesos | MejoraApp</title>
    <link rel="stylesheet" href="../planear/process/processMap.css">
    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
    <div class="page-header">
        <h1 class="page-title">Mapa de Procesos</h1>
    </div>

    <div class="tabs-container">
        <button id="btnEstrategico" class="tab-btn active" onclick="switchTab('Estratégicos')">Procesos Estratégicos</button>
        <button id="btnOperacional" class="tab-btn" onclick="switchTab('Operacionales')">Procesos Operacionales</button>
        <button id="btnApoyo" class="tab-btn" onclick="switchTab('De Apoyo')">Procesos de Apoyo</button>
    </div>

    <div class="content-card">
        <div class="action-bar">
            <button class="btn-primary" onclick="createNewProcess()">
                <span>+</span> Nuevo Registro
            </button>
        </div>

        <div id="processListContainer" class="table-responsive">
            <!-- Table will be rendered here by JS -->
            <div class="empty-state">Cargando procesos...</div>
        </div>
    </div>
    <script type="module" src="../planear/process/processMap.js?v=1.1"></script>
</body>

</html>