<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Gestión de Usuarios</title>
    <link rel="stylesheet" href="../users/users.css">
    <link rel="stylesheet" href="../styles/colors.css">
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.all.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <!-- Tu módulo debe ir al final del body para asegurar que todo el DOM esté cargado -->
</head>

<body>
    <div class="container">
        <!-- Table View -->
        <div id="tableView" class="view-section">
            <h1>Gestión de Usuarios</h1>
            <button class="add-btn" onclick="showFormView()">
                <i class="fas fa-user-plus"></i> Nuevo Usuario
            </button>
            <table id="usersTable" class="display">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>CC</th>
                        <th>Empresa</th>
                        <th>Perfil</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="usersTbody"></tbody>
            </table>
        </div>

        <!-- Form View (Slide-in Panel) -->
        <div id="formView" class="form-panel">
            <div class="form-header">
                <h2 id="formTitle">
                    <i class="fas fa-user-plus"></i> Nuevo Usuario
                </h2>
                <button class="close-btn" onclick="hideFormView()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <form id="userForm" class="user-form">
                <!-- Información Personal -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-info-circle"></i> Información Personal
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nombre Completo *</label>
                            <input type="text" id="nombre" name="nombre" required>
                        </div>
                        <div class="form-group">
                            <label>Cédula (CC) *</label>
                            <input type="text" id="codusr" name="codusr" required>
                        </div>
                    </div>
                </div>

                <!-- Información de Contacto y Acceso -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-key"></i> Cuenta y Acceso
                    </div>
                    <div class="form-row single">
                         <div class="form-group">
                            <label>Email *</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Contraseña *</label>
                            <input type="password" id="password" name="password">
                            <small style="color: #666; margin-top: 5px; font-size: 0.8rem;">
                                * Requerida para nuevos usuarios. Opcional para editar.
                            </small>
                        </div>
                        <div class="form-group">
                            <label>Perfil *</label>
                            <select id="perfil" name="perfil" required>
                                <option value="">Seleccione...</option>
                                <option value="ADM">Administrador</option>
                                <option value="CLI">Cliente</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Asociación -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-building"></i> Asociación
                    </div>
                    <div class="form-row single">
                        <div class="form-group">
                            <label>Empresa Cliente *</label>
                            <select id="idClient" name="idClient" required>
                                <option value="">Cargando...</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="hideFormView()">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button type="submit" class="btn-save">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                </div>
            </form>
        </div>
    </div>
    <!-- Mueve tu script de módulo aquí -->
    <script type="module" src="../users/users.js"></script>
</body>

</html>