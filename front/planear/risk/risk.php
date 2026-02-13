<!-- CSS Import -->
<link rel="stylesheet" href="../planear/risk/risk.css?v=1.0">

<!-- Chart.js CDN (v4.4.1) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<!-- Chart.js DataLabels Plugin (v2.2.0) -->
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>

<div class="page-header">
    <h1 class="page-title">MATRIZ DE RIESGOS Y PELIGROS</h1>
</div>

<div id="riskListView" class="content-card">
    <!-- Actions -->
    <div class="risk-actions" style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="display: flex; gap: 10px;">
            <!-- Graph Button -->
            <button class="btn-hover-graph" title="Graficar Resultados" onclick="showRiskGraph()">
                <i class="fas fa-chart-pie"></i> Ver Gráfica de Riesgos
            </button>
        </div>
        <div>
            <!-- Print Button -->
            <button class="btn-view-premium" title="Imprimir" onclick="printRisk()" style="color: #667eea !important;"><i class="fas fa-print"></i></button>
        </div>
    </div>

    <!-- Section 1: Peligros (Hazards) -->
    <h3 class="risk-section-title">Matriz de Peligros</h3>
    <div class="table-responsive">
        <table class="risk-matrix-table" id="tableRiskHazards">
            <thead>
                <tr>
                    <th class="header-main">Peligros</th>
                    <th class="col-header-danger">¡Manos a la obra ya!</th>
                    <th class="col-header-warning">Cuidado, falta un ajuste</th>
                    <th class="col-header-yellow">Echémosle un ojo</th>
                    <th class="col-header-success">¡Relájate, vamos bien!</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JS -->
            </tbody>
        </table>
    </div>

    <!-- Section 2: Procesos (Processes) -->
    <h3 class="risk-section-title">Matriz de Procesos</h3>
    <div class="table-responsive">
        <table class="risk-matrix-table" id="tableRiskProcesses">
            <thead>
                <tr>
                    <th class="header-main">Procesos</th>
                    <th class="col-header-danger">¡Manos a la obra ya!</th>
                    <th class="col-header-warning">Cuidado, falta un ajuste</th>
                    <th class="col-header-yellow">Echémosle un ojo</th>
                    <th class="col-header-success">¡Relájate, vamos bien!</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JS -->
            </tbody>
        </table>
    </div>

    <!-- Section 3: Medidas de Prevención -->
    <h3 class="risk-section-title">Medidas de Prevención y de Control</h3>
    <div class="table-responsive">
        <table class="risk-matrix-table" id="tableRiskPrevention">
            <thead>
                <tr>
                    <th style="text-align: left;">Nombre</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JS -->
            </tbody>
        </table>
    </div>
</div>

<!-- Risk Graph View -->
<div id="riskGraphView" class="content-card" style="display: none;">
    <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 class="section-title" style="margin: 0; font-size: 1.5rem; color: #2c3e50;">GRÁFICA DE RIESGOS</h2>
        <div style="display: flex; gap: 10px;">
            <!-- Print Graph Button -->
            <button class="btn-view-premium" title="Imprimir Gráfica" onclick="printRiskGraph()" style="color: #667eea !important;"><i class="fas fa-print"></i></button>
            <button class="btn-secondary-premium" onclick="hideRiskGraph()" style="padding: 8px 15px; border: 1px solid #ddd; background: #f8f9fa; border-radius: 4px; cursor: pointer;">Volver</button>
        </div>
    </div>

    <div style="width: 100%; height: 500px; display: flex; justify-content: center;">
        <canvas id="riskChart"></canvas>
    </div>
</div>

<script type="module" src="../planear/risk/risk.js?v=1.0"></script>