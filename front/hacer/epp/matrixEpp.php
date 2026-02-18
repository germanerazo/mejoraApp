<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Matriz de EPP por Cargo</title>
    <!-- Common CSS -->
    <link rel="stylesheet" href="../styles/colors.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .epp-matrix-container {
            padding: 20px;
        }

        .matrix-toolbar {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
            gap: 15px;
            align-items: center;
        }

        .filter-select {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            min-width: 250px;
            font-size: 0.95rem;
            background-color: white;
            color: #333;
        }

        .btn-add {
            background-color: #27ae60;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 0.95rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.3s, transform 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .btn-add:hover {
            background-color: #219150;
            transform: translateY(-1px);
        }

        .modern-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
            background-color: white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border-radius: 8px;
            overflow: hidden;
        }

        .modern-table th, .modern-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
        }

        .modern-table th {
            background-color: #34495e;
            color: white;
            font-weight: 500;
            text-transform: uppercase;
            font-size: 0.9rem;
        }

        .modern-table tr:hover {
            background-color: #f8f9fa;
        }

        .action-btn {
            border: none;
            border-radius: 4px;
            width: 32px;
            height: 32px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            margin: 0 2px;
            color: white;
        }

        .action-btn.edit {
            background-color: #3498db;
        }

        .action-btn.edit:hover {
            background-color: #2980b9;
        }

        .action-btn.delete {
            background-color: #e74c3c;
        }

        .action-btn.delete:hover {
            background-color: #c0392b;
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
            <table class="modern-table" id="matrixTable">
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
    <script type="module" src="../epp/matrixEpp.js?v=1.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>
