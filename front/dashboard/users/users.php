<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Gestión de Usuarios</title>
    <script type="module" src="./users/users.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.min.css" rel="stylesheet">
    <link rel="stylesheet" href="./users/users.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.all.min.js"></script>
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
                    <th>ID Cliente</th>
                    <th>Perfil</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="usersTbody">
                <!-- Usuarios aquí -->
            </tbody>
        </table>
    </div>
</body>

</html>