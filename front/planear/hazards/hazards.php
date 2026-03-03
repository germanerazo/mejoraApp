<!-- CSS -->
<link rel="stylesheet" href="../process/processMap.css">

<div class="page-header">
    <h1 class="page-title">Procedimiento Peligros y Riesgos</h1>
</div>

<div class="content-card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <p style="color: #666; margin: 0;">Gestión de documentos de procedimientos de peligros y riesgos.</p>
        <button class="btn-new-record" onclick="addHazard()">
            <i class="fas fa-plus-circle"></i> Nuevo Procedimiento
        </button>
    </div>

    <!-- Listado -->
    <div class="table-responsive">
        <table class="modern-table" id="hazardsTable">
            <thead>
                <tr>
                    <th>Acciones</th>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Archivo</th>
                </tr>
            </thead>
            <tbody>
                <tr><td colspan="5" class="empty-state">Cargando procedimientos...</td></tr>
            </tbody>
        </table>
    </div>
</div>

<!-- Preview Panel -->
<div id="previewPanel" style="display:none; margin-top: 24px;">
    <div class="content-card" style="padding: 0; overflow: hidden;">
        <div style="display:flex; justify-content:space-between; align-items:center; padding: 14px 20px; background: linear-gradient(135deg,#4361ee,#3451d1); color:#fff;">
            <div style="display:flex; align-items:center; gap:10px;">
                <i class="fas fa-file-pdf" style="font-size:20px;"></i>
                <div>
                    <div style="font-weight:700; font-size:15px;" id="previewTitle">Vista previa</div>
                    <div style="font-size:12px; opacity:.8;" id="previewSubtitle"></div>
                </div>
            </div>
            <button onclick="closePreview()" style="background:rgba(255,255,255,.2); border:none; color:#fff; border-radius:6px; padding:6px 14px; cursor:pointer; font-size:13px;">
                <i class="fas fa-times"></i> Cerrar
            </button>
        </div>
        <iframe id="pdfViewer" style="width:100%; height:680px; border:none;" src=""></iframe>
    </div>
</div>

<script type="module" src="../hazards/hazards.js?v=1.0"></script>
