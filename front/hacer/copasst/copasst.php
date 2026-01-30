<link rel="stylesheet" href="../hacer/copasst/copasst.css?v=1.0">
<link rel="stylesheet" href="../styles/colors.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<div class="page-header">
    <h1 class="page-title">CONFORMACION COPASST</h1>
</div>

<!-- List View -->
<div id="copasstListView" class="content-card">
    <div style="margin-bottom: 20px;">
        <button class="btn-new-record" onclick="showCreateCopasst()">
            <i class="fas fa-file-upload"></i> Cargar acta
        </button>
    </div>

    <div class="table-container">
        <table class="copasst-table" id="tableCopasst">
            <thead>
                <tr>
                    <th style="width: 80px;">Acción</th>
                    <th>Fecha</th>
                    <th>Acta</th>
                    <th style="width: 100px;">Descargar</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JS -->
            </tbody>
        </table>
    </div>
</div>

<!-- Create View -->
<div id="copasstCreateView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">Cargar Nueva Acta</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-new-record" onclick="saveCopasst()"><i class="fas fa-save"></i> Guardar</button>
            <button class="btn-secondary-premium" onclick="hideCreateCopasst()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>

    <div class="form-container">
        <form id="copasstForm">
            <div class="form-group">
                <label class="form-label">Fecha:</label>
                <input type="date" id="fieldCopasstDate" class="form-input-date">
            </div>

            <div class="form-group">
                <label class="form-label">Nombre del Acta:</label>
                <input type="text" id="fieldCopasstName" class="form-input-text" placeholder="Ej: Acta vigía SST Marzo 2024" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div class="form-group">
                <label class="form-label">Archivo (PDF):</label>
                <div class="file-upload-wrapper">
                    <input type="file" id="fieldCopasstFile" class="file-upload-input" accept=".pdf,.doc,.docx" onchange="updateCopasstFileName(this)">
                    <div class="file-upload-content">
                        <i class="fas fa-cloud-upload-alt file-upload-icon"></i>
                        <div class="file-upload-text">Haz clic o arrastra el acta aquí</div>
                        <div class="file-upload-hint">Formatos soportados: PDF, DOC</div>
                        <div id="copasstFileNameDisplay" class="file-upload-filename"></div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

<script type="module" src="../hacer/copasst/copasst.js?v=1.0"></script>
