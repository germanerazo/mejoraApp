<!-- CSS Import (reusing processMap styles for consistency) -->
<link rel="stylesheet" href="../planear/process/processMap.css">

<div class="page-header">
    <h1 class="page-title">Políticas Corporativas</h1>
</div>

<div class="content-card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <p style="color: #666; margin: 0;">Gestión de políticas y documentos corporativos.</p>
        <button class="btn-new-record" onclick="addPolicy()">
            <i class="fas fa-plus-circle"></i> Nueva Política
        </button>
    </div>

    <div class="table-responsive">
        <table class="modern-table" id="policiesTable">
            <thead>
                <tr>
                    <th>Acción</th>
                    <th>Nombre de la Política</th>
                    <th>Fecha de Creación</th>
                    <th>Documento</th>
                </tr>
            </thead>
            <tbody>
                <!-- Rows will be populated by JS -->
                <tr><td colspan="4" class="empty-state">Cargando políticas...</td></tr>
            </tbody>
        </table>
    </div>
</div>

<script type="module" src="../planear/policies/policies.js?v=1.0"></script>
