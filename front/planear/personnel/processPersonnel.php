<!-- CSS -->
<link rel="stylesheet" href="../planear/process/processMap.css">

<div class="page-header">
    <h1 class="page-title">Consolidado Personal del Proceso</h1>
</div>

<div class="content-card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <p style="color: #666; margin: 0;">Listado consolidado del personal registrado en todas las fichas de proceso.</p>
        <div style="display: flex; gap: 10px; align-items: center;">
            <input type="text" id="searchPersonnel" class="swal2-input" placeholder="🔍 Buscar por cargo o proceso..." style="margin: 0; height: 36px; width: 280px; font-size: 13px;">
        </div>
    </div>

    <div class="table-responsive">
        <table class="modern-table" id="personnelConsolidadoTable">
            <thead>
                <tr>
                    <th>Acción</th>
                    <th>Proceso</th>
                    <th>Cargo</th>
                    <th>Cargo al que Reporta</th>
                    <th>Nro. Personas</th>
                    <th>Responsabilidades</th>
                    <th>Rendición de Cuentas</th>
                </tr>
            </thead>
            <tbody>
                <tr><td colspan="6" class="empty-state">Cargando consolidado...</td></tr>
            </tbody>
        </table>
    </div>

    <div id="personnelStats" style="margin-top: 15px; display: none; color: #888; font-size: 13px; text-align: right;"></div>
</div>

<script type="module" src="../planear/personnel/processPersonnel.js?v=1.1"></script>
