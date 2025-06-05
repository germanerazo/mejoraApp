<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Gestión de Accesos</title>
    <link rel="stylesheet" href="../styles/colors.css">
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.all.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
</head>

<body>
    <div class="container">
        <h1>Gestión de Accesos</h1>
        <button class="add-btn" onclick="openAccessModal()">+ Nuevo Acceso</button>
        <table id="accessTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Código</th>
                    <th>Perfil</th>
                    <th>Id Usuario</th>
                    <th>Acceso</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="accessTbody"></tbody>
        </table>
    </div>
    <!-- Mueve tu script de módulo aquí -->
    <script type="module" src="../access/access.js"></script>
</body>

</html>