<!-- CSS Import -->
<link rel="stylesheet" href="../hacer/healthConditions/healthConditions.css?v=1.0">

<div class="page-header">
    <h1 class="page-title">PROCEDIMIENTO CONDICIONES DE SALUD</h1>
    <div class="breadcrumbs">Hacer > Salud en el Trabajo > Condiciones de Salud</div>
</div>

<!-- List View -->
<div id="healthConditionsListView" class="content-card">
    <div style="margin-bottom: 25px; text-align: center;">
        <button class="btn-new-record" onclick="showCreateHealthConditions()">
            <i class="fas fa-file-medical"></i> Nuevo Documento
        </button>
    </div>

    <div class="table-container">
        <table class="healthConditions-table" id="tableHealthConditions">
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
<div id="healthConditionsCreateView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">Nuevo Documento</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-new-record" onclick="saveHealthConditions()"><i class="fas fa-save"></i> Guardar</button>
            <button class="btn-secondary-premium" onclick="hideCreateHealthConditions()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>

    <div class="form-container">
        <form id="healthConditionsForm">
            <div class="form-group">
                <label class="form-label">Nombre del Documento:</label>
                <input type="text" id="fieldCondName" class="form-input-text" placeholder="Ej: SST-MA-02 MANUAL..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div class="form-group">
                <label class="form-label">Fecha de Creación:</label>
                <input type="date" id="fieldCondDate" class="form-input-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div class="form-group">
                <label class="form-label">Cargar archivo:</label>
                <div class="file-upload-wrapper">
                    <input type="file" id="fieldCondFile" class="file-upload-input" onchange="updateHealthConditionsFileName(this)">
                    <div class="file-upload-content">
                        <i class="fas fa-cloud-upload-alt file-upload-icon"></i>
                        <div class="file-upload-text">Haz clic o arrastra el documento aquí</div>
                        <div class="file-upload-hint">Formatos soportados: PDF, XLS, DOC</div>
                        <div id="condFileNameDisplay" class="file-upload-filename"></div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

<script type="module" src="../hacer/healthConditions/healthConditions.js?v=1.0"></script>
