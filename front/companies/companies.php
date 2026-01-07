<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Gestión de clientes</title>
</head>

<body>
    <div class="container">
        <h1>Gestión de clientes</h1>
        <button class="add-btn" onclick="openCompaniesModal()">+ Nuevo cliente</button>
        <table id="accessTable" class="display">
            <thead>
                <tr>
                    <th>Identificación</th>
                    <th>Nombre</th>
                    <th>Gerente</th>
                    <th>Correo</th>
                    <th>Celular</th>
                    <th>Ciudad</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="companiesTbody"></tbody>
        </table>
    </div>
    <!-- Mueve tu script de módulo aquí -->
    <script type="module" src="../companies/companies.js"></script>
</body>

</html>