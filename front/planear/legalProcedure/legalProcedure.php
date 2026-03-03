<!-- CSS -->
<link rel="stylesheet" href="../planear/process/processMap.css">
<link rel="stylesheet" href="../planear/legalProcedure/legalProcedure.css?v=1.0">

<div class="page-header">
    <h1 class="page-title">Procedimiento Requisitos Legales</h1>
</div>

<div class="content-card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <p style="color: #666; margin: 0;">Gestión de documentos para el cumplimiento de requisitos legales.</p>
        <button id="btnCreateLegal" class="btn-premium btn-replace-premium" onclick="addLegal()">
            <i class="fas fa-plus-circle"></i> Nuevo Procedimiento
        </button>
    </div>

    <!-- Listado -->
    <div class="table-responsive">
        <table class="modern-table" id="legalTable">
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
<div id="previewPanel" style=" margin-top: 24px;">
    <div class="content-card" style="padding: 0; overflow: hidden;">
        <div style="display:flex; justify-content:space-between; align-items:center; padding: 14px 20px; background: linear-gradient(135deg,#4361ee,#3451d1); color:#fff;">
            <div style="display:flex; align-items:center; gap:10px;">
                <i class="fas fa-file-pdf" style="font-size:20px;"></i>
                <div>
                    <div style="font-weight:700; font-size:15px;" id="previewTitle">Vista previa</div>
                    <div style="font-size:12px; opacity:.8;" id="previewSubtitle"></div>
                </div>
            </div>
        </div>
        <div id="noPdfMessage" style="display:none; padding:40px; text-align:center; color:#888;">
            <i class="fas fa-file-pdf" style="font-size:40px; margin-bottom:15px; opacity:0.3;"></i>
            <p>No hay un archivo PDF para mostrar aún.</p>
        </div>
        <iframe id="pdfViewer" style="width:100%; height:680px; border:none;" src=""></iframe>
    </div>
</div>

<script type="module" src="../planear/legalProcedure/legalProcedure.js?v=1.0"></script>
