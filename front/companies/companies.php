<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de clientes</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="../companies/companies.css?v=1.4">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
</head>

<body>
    <div class="container">
        <!-- Table View -->
        <div id="tableView" class="view-section">
            <h1>Gestión de clientes</h1>
            <button class="add-btn" onclick="showFormView()">
                <i class="fas fa-plus"></i> Nuevo cliente
            </button>
            <table id="companiesTable" class="display">
                <thead>
                    <tr>
                        <th>Logo</th>
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

        <!-- Form View (Slide-in Panel) -->
        <div id="formView" class="form-panel">
            <div class="form-header">
                <h2 id="formTitle">
                    <i class="fas fa-building"></i> Nuevo Cliente
                </h2>
                <button class="close-btn" onclick="hideFormView()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <form id="companyForm" class="company-form">
                <!-- Información Básica -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-info-circle"></i> Información Básica
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tipo de Identificación *</label>
                            <select id="tipIdentEmp" name="tipIdentEmp" required>
                                <option value="">Seleccione...</option>
                                <option value="1">NIT</option>
                                <option value="2">Cédula de Ciudadanía</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Nro. Identificación *</label>
                            <input type="text" id="nroIdentEmp" name="nroIdentEmp" required>
                        </div>
                    </div>
                    <div class="form-row single">
                        <div class="form-group">
                            <label>Nombre de la Empresa *</label>
                            <input type="text" id="nomEmpresa" name="nomEmpresa" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Sigla/Abreviatura *</label>
                            <input type="text" id="sigla" name="sigla" required>
                        </div>
                        <div class="form-group">
                            <label>Naturaleza *</label>
                            <input type="text" id="naturaleza" name="naturaleza" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tipo de Régimen *</label>
                            <select id="tipRegimenEmp" name="tipRegimenEmp" required>
                                <option value="">Seleccione...</option>
                                <option value="0">Régimen Común</option>
                                <option value="1">Régimen Simplificado</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Ubicación -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-map-marker-alt"></i> Ubicación
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Departamento *</label>
                            <input type="text" id="codDepto" name="codDepto" required>
                        </div>
                        <div class="form-group">
                            <label>Ciudad *</label>
                            <input type="text" id="codCiudad" name="codCiudad" required>
                        </div>
                    </div>
                    <div class="form-row single">
                        <div class="form-group">
                            <label>Dirección *</label>
                            <input type="text" id="direccion" name="direccion" required>
                        </div>
                    </div>
                </div>

                <!-- Contacto -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-phone"></i> Información de Contacto
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Teléfono Fijo *</label>
                            <input type="text" id="telFijo" name="telFijo" required>
                        </div>
                    </div>
                </div>

                <!-- Representante Legal -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-user-tie"></i> Representante Legal
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Primer Nombre *</label>
                            <input type="text" id="nombre1" name="nombre1" required>
                        </div>
                        <div class="form-group">
                            <label>Segundo Nombre</label>
                            <input type="text" id="nombre2" name="nombre2">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Primer Apellido *</label>
                            <input type="text" id="apel1" name="apel1" required>
                        </div>
                        <div class="form-group">
                            <label>Segundo Apellido</label>
                            <input type="text" id="apel2" name="apel2">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tipo de Identificación *</label>
                            <select id="tipIdent" name="tipIdent" required>
                                <option value="">Seleccione...</option>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="CE">Cédula de Extrangería</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Nro. Identificación *</label>
                            <input type="text" id="nroIdent" name="nroIdent" required>
                        </div>
                    </div>
                </div>

                <!-- Información Administrativa -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-briefcase"></i> Información Administrativa
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Gerente *</label>
                            <input type="text" id="gerente" name="gerente" required>
                        </div>
                        <div class="form-group">
                            <label>Representante Legal *</label>
                            <input type="text" id="representante" name="representante" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Profesional Asignado *</label>
                            <input type="text" id="profesional" name="profesional" required>
                        </div>
                        <div class="form-group">
                            <label>Estado *</label>
                            <select id="estado" name="estado" required>
                                <option value="">Seleccione...</option>
                                <option value="0">Activo</option>
                                <option value="1">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Logo de la Empresa -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-image"></i> Logo de la Empresa
                    </div>
                    <div class="form-row single">
                        <div class="form-group">
                            <label>Logo de la Empresa</label>
                            <input type="file" id="logoFile" name="logoFile" accept="image/*">
                            <div id="logoPreview" style="margin-top: 10px; display: none;">
                                <img id="logoPreviewImg" src="" alt="Vista previa del logo" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid #ddd;">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vigencia del Contrato -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-calendar-alt"></i> Vigencia del Contrato
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Vigencia Desde *</label>
                            <input type="date" id="fecVincula" name="fecVincula" required>
                        </div>
                        <div class="form-group">
                            <label>Vigencia Hasta *</label>
                            <input type="date" id="fecFin" name="fecFin" required>
                        </div>
                    </div>
                    <div class="form-row single">
                        <div class="form-group">
                            <label>Fecha de Entrega *</label>
                            <input type="date" id="fechaEntrega" name="fechaEntrega" required>
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
    <script type="module" src="../companies/companies.js?v=1.1"></script>
</body>

</html>