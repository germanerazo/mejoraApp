<!-- CSS Import -->
<link rel="stylesheet" href="../hacer/procedures/procedures.css?v=1.0">

<div class="page-header">
    <h1 class="page-title">LISTADO MAESTRO DE DOCUMENTOS</h1>
    <div class="breadcrumbs">Hacer > Gestion Documentacion > Gestión de la Documentación > Listado de Documentos</div>
</div>

<!-- List View -->
<div id="proceduresListView" class="content-card">
    <div style="margin-bottom: 25px; text-align: center;">
        <button class="btn-new-record" onclick="showCreateProcedures()">
            <i class="fas fa-file-medical"></i> Nuevo Documento
        </button>
    </div>

    <div class="table-container">
        <table class="procedures-table" id="tableProcedures">
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
<div id="proceduresCreateView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">Nuevo Documento</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-new-record" onclick="saveProcedures()"><i class="fas fa-save"></i> Guardar</button>
            <button class="btn-secondary-premium" onclick="hideCreateProcedures()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>

    <div class="form-container">
        <form id="proceduresForm">
            <div class="form-group">
                <label class="form-label">Nombre del Procedimiento:</label>
                <input type="text" id="fieldProcName" class="form-input-text" placeholder="Ej: SST-MA-02 MANUAL..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div class="form-group">
                <label class="form-label">Fecha de Creación:</label>
                <input type="date" id="fieldProcDate" class="form-input-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div class="form-group">
                <label class="form-label">Cargar archivo:</label>
                <div class="file-upload-wrapper">
                    <input type="file" id="fieldProcFile" class="file-upload-input" onchange="updateProceduresFileName(this)">
                    <div class="file-upload-content">
                        <i class="fas fa-cloud-upload-alt file-upload-icon"></i>
                        <div class="file-upload-text">Haz clic o arrastra el documento aquí</div>
                        <div class="file-upload-hint">Formatos soportados: PDF, XLS, DOC</div>
                        <div id="procFileNameDisplay" class="file-upload-filename"></div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

<script type="module" src="../hacer/procedures/procedures.js?v=1.0"></script>
