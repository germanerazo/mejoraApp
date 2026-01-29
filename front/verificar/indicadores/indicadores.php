<link rel="stylesheet" href="../verificar/indicadores/indicadores.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<!-- Chart.js para las gráficas -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div class="content-wrapper">
    <!-- VISTA 1: SELECCIÓN DE PERIODO -->
    <div id="view-periodos" class="card-container">
        <div class="section-header">
            <h2><i class="fas fa-calendar-alt"></i> Selección de Periodo</h2>
        </div>
        
        <div class="table-container">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Periodo (Fecha Inicial - Fecha Final)</th>
                        <th style="text-align:center;">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Desde: 2024-01-01 - Hasta: 2024-12-31</td>
                        <td style="text-align:center;">
                            <button class="btn-action view" onclick="mostrarIndicadores('2024')">
                                <i class="fas fa-search"></i> Ver Indicadores
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>Desde: 2025-01-01 - Hasta: 2025-12-31</td>
                        <td style="text-align:center;">
                            <button class="btn-action view" onclick="mostrarIndicadores('2025')">
                                <i class="fas fa-search"></i> Ver Indicadores
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- VISTA 2: LISTADO DE INDICADORES (Oculta inicialmente) -->
    <div id="view-indicadores" class="card-container" style="display:none;">
        <div class="section-header flex-header">
            <h2 id="titulo-indicadores"><i class="fas fa-chart-line"></i> Listado de Indicadores</h2>
            <button class="btn-secondary" onclick="mostrarPeriodos()">
                <i class="fas fa-arrow-left"></i> Cambiar Periodo
            </button>
        </div>

        <div class="table-container listado-indicadores">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Objetivo</th>
                        <th>Descripción Fórmula</th>
                        <th>Responsable</th>
                        <th style="width: 100px;">Límite Esperado</th>
                        <th style="width: 100px;">Límite Crítico</th>
                        <th>Fuente de Info</th>
                        <th>Periodicidad</th>
                        <th>Tipo Indicador</th>
                        <th>Tipo Límite</th>
                        <th>Dirigido A</th>
                        <th style="text-align:center;">Gráfica</th>
                    </tr>
                </thead>
                <tbody id="indicadoresBody">
                    <!-- Filas dinámicas -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- VISTA 3: DETALLE/MODIFICACIÓN DEL INDICADOR (Oculta inicialmente) -->
    <div id="view-detalle-indicador" class="card-container" style="display:none;">
        <div class="section-header flex-header">
            <h2><i class="fas fa-edit"></i> Detalle del Indicador</h2>
            <button class="btn-secondary" onclick="volverAListado()">
                <i class="fas fa-arrow-left"></i> Volver al Listado
            </button>
        </div>

        <form id="form-detalle-indicador" class="custom-form">
            <div class="form-grid">
                <div class="form-group full-width">
                    <label>Nombre Indicador:</label>
                    <input type="text" id="det-nombre" readonly>
                </div>
                <div class="form-group full-width">
                    <label>Objetivo:</label>
                    <textarea id="det-objetivo" rows="2" readonly></textarea>
                </div>
                <div class="form-group">
                    <label>Responsable:</label>
                    <input type="text" id="det-responsable" readonly>
                </div>
                <div class="form-group">
                    <label>Dirigido A:</label>
                    <input type="text" id="det-dirigido" readonly>
                </div>
                <div class="form-group">
                    <label>Fuente de Datos:</label>
                    <input type="text" id="det-fuente" readonly>
                </div>
                <div class="form-group">
                    <label>Fórmula:</label>
                    <input type="text" id="det-formula" readonly>
                </div>
                <div class="form-group">
                    <label>Periodicidad:</label>
                    <input type="text" id="det-periodicidad" readonly>
                </div>
                <div class="form-group">
                    <label>Tipo Indicador:</label>
                    <input type="text" id="det-tipo" readonly>
                </div>
                <div class="form-group">
                    <label>Límite Esperado:</label>
                    <input type="text" id="det-esperado" readonly>
                </div>
                <div class="form-group">
                    <label>Límite Crítico:</label>
                    <input type="text" id="det-critico" readonly>
                </div>
            </div>

            <div class="results-section">
                <div class="results-header-actions">
                    <h3><i class="fas fa-table"></i> Resultados por Periodo</h3>
                    <button type="button" class="btn-action view" onclick="generarGrafica()">
                        <i class="fas fa-chart-line"></i> Graficar
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="custom-table results-table">
                        <thead>
                            <tr id="results-header">
                                <!-- Periodos dinámicos -->
                            </tr>
                        </thead>
                        <tbody id="results-body">
                            <!-- Resultados dinámicos -->
                        </tbody>
                    </table>
                </div>

                <!-- Contenedor para la Gráfica -->
                <div id="container-grafica" style="display:none; margin-top: 30px;">
                    <h3><i class="fas fa-chart-area"></i> Visualización de Resultados</h3>
                    <div style="height: 300px;">
                        <canvas id="canvasIndicador"></canvas>
                    </div>
                </div>
            </div>

            <div class="observation-section">
                <label>Análisis de la Información / Observaciones:</label>
                <textarea id="det-observaciones" rows="4" placeholder="Ingrese el análisis del periodo..."></textarea>
            </div>

            <div class="form-actions">
                <button type="button" class="btn-action view" onclick="guardarCambiosIndicador()">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
            </div>
        </form>
    </div>
</div>

<script src="../verificar/indicadores/indicadores.js"></script>
