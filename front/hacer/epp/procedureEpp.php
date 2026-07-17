<!-- CSS Import -->
<link rel="stylesheet" href="../hacer/procedures/procedures.css?v=<?= time() ?>">
<link rel="stylesheet" href="../styles/colors.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.min.css" rel="stylesheet">

<div class="page-header">
    <h1 class="page-title">
        <i class="fas fa-book" style="color: #f39c12;"></i>
        Procedimientos EPP
    </h1>
    <div class="breadcrumbs"><a href="#../hacer/epp/epp.php" style="color: #3498db; text-decoration: none;">Gestión EPP</a> > Procedimientos y Documentos</div>
</div>

<!-- List View -->
<div id="eppProceduresListView" class="content-card">
    <div style="margin-bottom: 25px; text-align: center;">
        <button class="btn-new-record" onclick="showCreateEppProcedure()">
            <i class="fas fa-file-medical"></i> Nuevo Documento
        </button>
    </div>

    <div class="table-container">
        <table class="procedures-table" id="tableEppProcedures">
            <thead>
                <tr>
                    <th style="width: 80px; text-align: center;">Acción</th>
                    <th>Nombre Documento</th>
                    <th>Fecha Creación</th>
                    <th style="width: 100px; text-align: center;">Descargar</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JS -->
            </tbody>
        </table>
    </div>
</div>

<!-- Create View -->
<div id="eppProceduresCreateView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">Nuevo Documento EPP</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-new-record" onclick="saveEppProcedure()"><i class="fas fa-save"></i> Guardar</button>
            <button class="btn-secondary-premium" onclick="hideCreateEppProcedure()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>

    <div class="form-container">
        <form id="eppProceduresForm">
            <div class="form-group">
                <label class="form-label">Nombre del Procedimiento:</label>
                <input type="text" id="swal-proc-title" class="form-input-text" placeholder="Ej: Manual de Uso de Cascos" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div class="form-group">
                <label class="form-label">Fecha de Creación:</label>
                <input type="date" id="swal-proc-date" class="form-input-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div class="form-group">
                <label class="form-label">Cargar archivo:</label>
                <div class="file-upload-wrapper">
                    <input type="file" id="swal-proc-file" class="file-upload-input" onchange="updateEppFileName(this)">
                    <div class="file-upload-content">
                        <i class="fas fa-cloud-upload-alt file-upload-icon"></i>
                        <div class="file-upload-text">Haz clic o arrastra el documento aquí</div>
                        <div class="file-upload-hint">Formatos soportados: PDF, XLS, DOC</div>
                        <div id="eppProcFileNameDisplay" class="file-upload-filename"></div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

    <!-- Script -->
    <script type="module" src="../hacer/epp/procedureEpp.js?v=<?= time() ?>"></script>

