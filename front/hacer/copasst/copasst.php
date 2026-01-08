<!-- CSS Import -->
<link rel="stylesheet" href="../hacer/copasst/copasst.css?v=1.0">

<div class="page-header">
    <h1 class="page-title">CONFORMACION COPASST</h1>
</div>

<!-- List View -->
<div id="copasstListView" class="content-card">
    <div style="margin-bottom: 20px;">
        <button class="btn-orange" onclick="showCreateCopasst()">
            <span>+</span> Cargar acta
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
            <button class="btn-orange" onclick="saveCopasst()">Guardar</button>
            <button class="btn-secondary" onclick="hideCreateCopasst()">Volver</button>
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
                <input type="file" id="fieldCopasstFile" accept=".pdf,.doc,.docx" style="width: 100%;">
            </div>
        </form>
    </div>
</div>

<script type="module" src="../hacer/copasst/copasst.js?v=1.0"></script>
