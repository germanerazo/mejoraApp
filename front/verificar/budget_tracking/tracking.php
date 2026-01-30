<link rel="stylesheet" href="../verificar/budget_tracking/tracking.css?v=1.0">
<link rel="stylesheet" href="../styles/colors.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<!-- Chart.js CDN (v4.4.1) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<!-- Chart.js DataLabels Plugin (v2.2.0) -->
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>

<div class="page-header">
    <h1 class="page-title">SEGUIMIENTO DE PRESUPUESTO</h1>
</div>

<!-- List View -->
<div id="trackingListView" class="content-card">
    <div class="table-responsive">
        <table class="modern-table" id="tableTrackingList">
            <thead>
                <tr>
                    <th style="width: 100px; text-align: center;">Seguimiento</th>
                    <th>Año</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JS -->
            </tbody>
        </table>
    </div>
</div>

<!-- Detail View (Hidden initially) -->
<div id="trackingDetailView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title" id="trackingDetailTitle">SEGUIMIENTO DE PRESUPUESTO</h2>
        <div style="display: flex; gap: 10px; align-items: center;">
            <button class="btn-new-record" onclick="saveTracking()" style="padding: 8px 20px !important;">
                <i class="fas fa-save"></i> Guardar
            </button>
            <button class="btn-hover-graph" onclick="showGraphView()" style="padding: 8px 15px !important;">
                <i class="fas fa-chart-line"></i> Graficar Resultados
            </button>
            <button class="btn-secondary-premium" onclick="hideDetailView()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>

    <div class="grid-responsive">
        <table class="tracking-table">
            <thead>
                <tr>
                    <th style="text-align: left; min-width: 150px;">CONCEPTO</th>
                    <th>ENERO</th>
                    <th>FEBRERO</th>
                    <th>MARZO</th>
                    <th>ABRIL</th>
                    <th>MAYO</th>
                    <th>JUNIO</th>
                    <th>JULIO</th>
                    <th>AGOSTO</th>
                    <th>SEPTIEMBRE</th>
                    <th>OCTUBRE</th>
                    <th>NOVIEMBRE</th>
                    <th>DICIEMBRE</th>
                </tr>
            </thead>
            <tbody id="trackingGridBody">
                <!-- Rows: PRESUPUESTO, EJECUTADO, PORCENTAJE -->
            </tbody>
        </table>
    </div>
</div>

<!-- Graph View (Hidden initially) -->
<div id="trackingGraphView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">GRÁFICA DE CUMPLIMIENTO</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-view-premium" title="Imprimir Gráfica" onclick="printGraph()" style="color: #667eea !important;">
                <i class="fas fa-print"></i>
            </button>
            <button class="btn-secondary-premium" onclick="hideGraphView()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>
    
    <div class="chart-container">
        <canvas id="trackingChart"></canvas>
    </div>
</div>

<script type="module" src="../verificar/budget_tracking/tracking.js?v=1.0"></script>
