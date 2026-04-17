<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Reportes de Auditoría</title>
    <link rel="stylesheet" href="../audit/audit.css">
    <link rel="stylesheet" href="../styles/colors.css">
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.all.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
</head>

<body>
    <div class="container">
        <!-- Table View -->
        <div id="tableView" class="view-section">
            <div class="header-section">
                <h1><i class="fas fa-shield-alt"></i> Visor de Seguridad - Auditoría Central</h1>
                <p>Monitorea y visualiza todas las actividades recientes dentro de tu aplicación de forma detallada y amistosa.</p>
            </div>
            
            <div class="filters-container">
                <div class="filter-group">
                     <label><i class="fas fa-filter"></i> Modulo (Tabla)</label>
                     <select id="tableFilter" class="filter-input">
                         <option value="">Todos los Módulos</option>
                     </select>
                </div>
                <div class="filter-group">
                     <label><i class="fas fa-bolt"></i> Acción Realizada</label>
                     <select id="actionFilter" class="filter-input">
                         <option value="">Todas las Acciones</option>
                     </select>
                </div>
            </div>

            <table id="auditTable" class="display styled-table">
                <thead>
                    <tr>
                        <th style="width: 140px;">Fecha y Hora</th>
                        <th>Usuario</th>
                        <th>Nro Doc.</th>
                        <th>Compañía</th>
                        <th>IP Fuente</th>
                        <th>Módulo</th>
                        <th>Acción</th>
                        <th style="text-align:center;">Detalles</th>
                    </tr>
                </thead>
                <tbody id="auditTbody"></tbody>
            </table>
        </div>
    </div>
    
    <script type="module" src="../audit/audit.js"></script>
</body>

</html>
