<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Catálogo EPP</title>
    <!-- Common CSS -->
    <link rel="stylesheet" href="../styles/colors.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .epp-manager-container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 15px;
        }
        
        .page-title {
            font-size: 1.8rem;
            color: #2c3e50;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .modern-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
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
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
            padding: 5px;
            margin: 0 5px;
            transition: transform 0.2s;
        }
        
        .action-btn.edit { color: #f39c12; }
        .action-btn.delete { color: #e74c3c; }
        
        .action-btn:hover {
            transform: scale(1.2);
        }

        .btn-add {
            background-color: #27ae60;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.3s;
        }

        .btn-add:hover {
            background-color: #219150;
        }

        .breadcrumbs {
            font-size: 0.9rem;
            color: #7f8c8d;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="epp-manager-container fade-in">
        <div class="breadcrumbs">
            <a href="#../hacer/epp/epp.php" style="color: #3498db; text-decoration: none;">Gestión EPP</a> > Crear EPP (Catálogo)
        </div>
        
        <div class="page-header">
            <h1 class="page-title">
                <i class="fas fa-hard-hat" style="color: #e67e22;"></i>
                Catálogo de Elementos de Protección Personal
            </h1>
            <button class="btn-add" onclick="openCreateEppModal()">
                <i class="fas fa-plus"></i> Nuevo Registro
            </button>
        </div>

        <div class="table-container">
            <table class="modern-table" id="eppCatalogTable">
                <thead>
                    <tr>
                        <th style="width: 80px; text-align: center;">Nro.</th>
                        <th>Elemento</th>
                        <th>Norma</th>
                        <th style="width: 100px; text-align: center;">Acción</th>
                    </tr>
                </thead>
                <tbody id="eppCatalogBody">
                    <!-- Loaded via JS -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Script -->
    <script type="module" src="../epp/createEpp.js?v=1.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>
