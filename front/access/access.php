<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Gestión de Accesos</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../styles/colors.css">
</head>

<body>
    <div class="container">
        <h1>Gestión de Accesos</h1>
        <button class="btn-new-record" onclick="openAccessModal()">
            <i class="fas fa-plus-circle"></i> Nuevo Acceso
        </button>
        <table id="accessTable" class="display">
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