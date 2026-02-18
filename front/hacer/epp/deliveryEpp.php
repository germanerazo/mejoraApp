<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Entregas EPP</title>
    <!-- Common CSS -->
    <link rel="stylesheet" href="../styles/colors.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .epp-delivery-container {
            padding: 20px;
        }

        .search-bar {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            align-items: center;
        }

        .search-input {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            flex-grow: 1;
            font-size: 1rem;
        }

        .btn-search {
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn-delivery {
            background-color: #27ae60;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            margin-right: 5px;
        }

        .btn-history {
            background-color: #f39c12; 
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
        }

        /* Modal Styles enhancement for item list */
        .delivery-items-table {
            width: 100%;
            margin-top: 15px;
            border-collapse: collapse;
            font-size: 0.9em;
        }
        
        .delivery-items-table th {
            background-color: #eee;
            padding: 8px;
            text-align: left;
        }
        
        .delivery-items-table td {
            border-bottom: 1px solid #eee;
            padding: 8px;
        }
    </style>
</head>
<body>
    <div class="epp-delivery-container fade-in">
        <div class="breadcrumbs">
            <a href="#../hacer/epp/epp.php" style="color: #3498db; text-decoration: none;">Gestión EPP</a> > Entrega EPP
        </div>

        <div class="page-header">
            <h1 class="page-title">
                <i class="fas fa-hand-holding-medical" style="color: #27ae60;"></i>
                Entrega de Elementos de Proteccion Personal
            </h1>
        </div>

        <div class="search-bar">
            <input type="text" id="employeeSearch" class="search-input" placeholder="Buscar empleado por nombre o identificación...">
            <button class="btn-search" onclick="searchEmployees()">
                <i class="fas fa-search"></i> Buscar
            </button>
        </div>

        <div class="table-container">
            <table class="modern-table" id="employeeTable">
                <thead>
                    <tr>
                        <th>Identificación</th>
                        <th>Nombre</th>
                        <th>Cargo</th>
                        <th>Estado</th>
                        <th style="text-align: center;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="employeeBody">
                    <!-- Employees loaded here -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Script -->
    <script type="module" src="../hacer/epp/deliveryEpp.js?v=1.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>
