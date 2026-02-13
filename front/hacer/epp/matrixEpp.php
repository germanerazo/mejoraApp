<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Matriz de EPP por Cargo</title>
    <!-- Common CSS -->
    <link rel="stylesheet" href="/mejoraApp/front/styles/colors.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .epp-matrix-container {
            padding: 20px;
        }

        .matrix-toolbar {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
        }

        .filter-select {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-right: 15px;
            min-width: 200px;
        }

        .matrix-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }

        .matrix-table th, .matrix-table td {
            padding: 12px;
            border: 1px solid #e0e0e0;
            text-align: left;
            vertical-align: top;
        }

        .matrix-table th {
            background-color: #ecf0f1;
            color: #2c3e50;
            font-weight: 600;
        }

        .matrix-table tr:hover {
            background-color: #fafafa;
        }
    </style>
</head>
<body>
    <div class="epp-matrix-container fade-in">
        <div class="breadcrumbs">
            <a href="#../hacer/epp/epp.php" style="color: #3498db; text-decoration: none;">Gestión EPP</a> > Matriz de EPP
        </div>

        <div class="page-header">
            <h1 class="page-title">
                <i class="fas fa-th-list" style="color: #8e44ad;"></i>
                Matriz de Elementos de Proteccion Personal
            </h1>
        </div>

        <div class="matrix-toolbar">
            <select id="cargoFilter" class="filter-select" onchange="window.filterMatrix()">
                <option value="">Todos los Cargos</option>
                <!-- Filled via JS -->
            </select>
            <button class="btn-add" onclick="window.addMatrixEntry()">
                <i class="fas fa-plus"></i> Nueva Asignación
            </button>
        </div>

        <div style="overflow-x: auto;">
            <table class="matrix-table" id="matrixTable">
                <thead>
                    <tr>
                        <th style="width: 15%;">Cargo</th>
                        <th style="width: 15%;">EPP</th>
                        <th style="width: 10%;">Norma</th>
                        <th style="width: 10%;">Frecuencia</th>
                        <th>Almacenamiento</th>
                        <th>Mantenimiento</th>
                        <th>Disposición</th>
                        <th style="width: 80px; text-align: center;">Acción</th>
                    </tr>
                </thead>
                <tbody id="matrixBody">
                    <!-- Loaded via JS -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Script -->
    <script type="module" src="/mejoraApp/front/hacer/epp/matrixEpp.js?v=1.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>
