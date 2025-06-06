<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Gestión de Accesos</title>
</head>

<body>
    <div class="container">
        <h1>Gestión de Accesos</h1>
        <button class="add-btn" onclick="openAccessModal()">+ Nuevo Acceso</button>
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