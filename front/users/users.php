<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Gestión de Usuarios</title>
    <link rel="stylesheet" href="../users/users.css">
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.all.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <!-- Tu módulo debe ir al final del body para asegurar que todo el DOM esté cargado -->
</head>

<body>
    <div class="container">
        <h1>Gestión de Usuarios</h1>
        <button class="add-btn" onclick="openUserModal()">+ Nuevo Usuario</button>
        <table id="usersTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>CC</th>
                    <th>Cliente</th>
                    <th>Perfil</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="usersTbody"></tbody>
        </table>
    </div>
    <!-- Mueve tu script de módulo aquí -->
    <script type="module" src="../users/users.js"></script>
</body>

</html>