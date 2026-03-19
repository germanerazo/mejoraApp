<!-- CSS Import -->
<link rel="stylesheet" href="../planear/legal/legal.css?v=1.0">

<!-- Chart.js CDN (v4.4.1) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<!-- Chart.js DataLabels Plugin (v2.2.0) -->
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
<!-- SheetJS – leer archivos Excel en el cliente -->
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

<div class="page-header">
    <h1 class="page-title">MATRIZ LEGAL</h1>
</div>

<!-- Legal List View -->
<div id="legalListView">
    
    <!-- Filters -->
    <div class="filter-container">
        <div class="filter-group">
            <label for="filterClassification">Clasificación</label>
            <select id="filterClassification" class="filter-input">
                <option value="">Todas</option>
                <option value="H">H</option>
                <option value="S">S</option>
                <option value="E">E</option>
            </select>
        </div>
        <div class="filter-group">
            <label for="filterNorma">Norma</label>
            <input type="text" id="filterNorma" class="filter-input" placeholder="Buscar por norma...">
        </div>
        <button class="btn-filter-premium" onclick="filterLegal()">
            <i class="fas fa-filter"></i> Filtrar
        </button>
    </div>

    <!-- Actions -->
    <div style="margin-bottom: 15px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <button class="btn-new-record" onclick="showCreateLegal()">
            <i class="fas fa-plus-circle"></i> Nuevo Registro Legal
        </button>
        <!-- Importar Excel -->
        <button class="btn-import-excel" onclick="triggerExcelImport()" title="Cargar registros desde Excel">
            <i class="fas fa-file-excel"></i> Importar Excel
        </button>
        <input type="file" id="excelFileInput" accept=".xlsx,.xls,.csv" style="display:none;" onchange="handleExcelFile(event)">
        <!-- Descargar plantilla -->
        <button class="btn-template-excel" onclick="downloadExcelTemplate()" title="Descargar plantilla Excel">
            <i class="fas fa-download"></i> Plantilla
        </button>
        <button class="btn-new-record" onclick="deleteSelected()" style="background-color: #e74c3c;">
            <i class="fas fa-trash"></i> Eliminar Gestión legal
        </button>
        <!-- Graph Button -->
        <button class="btn-hover-graph" title="Graficar Cumplimiento" onclick="showLegalGraph()">
            <i class="fas fa-chart-pie"></i> Ver Gráfica de Cumplimiento
        </button>
    </div>

    <!-- Table -->
    <div class="content-card">
        <div class="legal-table-container">
            <table class="legal-table" id="tableLegalList">
                <thead>
                    <tr>
                        <th class="col-action">Acción</th>
                        <th class="col-id">Nro.</th>
                        <th>Clasificación</th>
                        <th class="col-norma">Norma</th>
                        <th>Año de Emisión</th>
                        <th>Disposición que regula</th>
                        <th>Art. Aplicable</th>
                        <th class="col-desc">Descripción Requisito</th>
                        <th class="col-evidencia">Evidencia Cumplimiento</th>
                        <th>Responsable</th>
                        <th>Existe Act.</th>
                        <th>Observación</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Populated by JS -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Legal Create/Edit View -->
<div id="legalCreateView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title" id="legalFormTitle">NUEVO REGISTRO MATRIZ LEGAL</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-new-record" onclick="saveLegal()"><i class="fas fa-save"></i> Guardar</button>
            <button class="btn-secondary-premium" onclick="hideCreateLegal()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>

    <form id="legalForm">
        <input type="hidden" id="legalId">
        
        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="padding: 10px; background: #eee; width: 200px; font-weight: bold;">Clasificación:</td>
                    <td style="padding: 10px;">
                        <select id="fieldClassification" class="swal2-select" style="width: 100%; max-width: 300px;">
                            <option value="H">H</option>
                            <option value="S">S</option>
                            <option value="E">E</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px; background: #eee; font-weight: bold;">Norma:</td>
                    <td style="padding: 10px;"><input type="text" id="fieldNorm" class="swal2-input" placeholder="Ej: Decreto 1072"></td>
                </tr>
                <tr>
                    <td style="padding: 10px; background: #eee; font-weight: bold;">Año de Emisión:</td>
                    <td style="padding: 10px;"><input type="number" id="fieldYear" class="swal2-input" placeholder="Ej: 2015" style="max-width: 150px;"></td>
                </tr>
                <tr>
                    <td style="padding: 10px; background: #eee; font-weight: bold;">Disposición que regula:</td>
                    <td style="padding: 10px;"><input type="text" id="fieldDisposition" class="swal2-input"></td>
                </tr>
                <tr>
                    <td style="padding: 10px; background: #eee; font-weight: bold;">Art. Aplicable:</td>
                    <td style="padding: 10px;"><input type="text" id="fieldArticles" class="swal2-input"></td>
                </tr>
                <tr>
                    <td style="padding: 10px; background: #eee; font-weight: bold;">Descripción Requisito:</td>
                    <td style="padding: 10px;"><textarea id="fieldDescription" class="swal2-textarea" rows="4"></textarea></td>
                </tr>
                <tr>
                    <td style="padding: 10px; background: #eee; font-weight: bold;">Evidencia Cumplimiento:</td>
                    <td style="padding: 10px;"><textarea id="fieldEvidence" class="swal2-textarea" rows="2"></textarea></td>
                </tr>
                <tr>
                    <td style="padding: 10px; background: #eee; font-weight: bold;">Responsable:</td>
                    <td style="padding: 10px;"><input type="text" id="fieldResponsible" class="swal2-input"></td>
                </tr>
                <tr>
                    <td style="padding: 10px; background: #eee; font-weight: bold;">Existe Act.:</td>
                    <td style="padding: 10px;">
                        <select id="fieldExists" class="swal2-select" style="max-width: 150px;">
                            <option value="SI">SI</option>
                            <option value="NO">NO</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px; background: #eee; font-weight: bold;">Observación:</td>
                    <td style="padding: 10px;"><textarea id="fieldObservation" class="swal2-textarea" rows="2"></textarea></td>
                </tr>
                <tr>
                    <td style="padding: 10px; background: #eee; font-weight: bold;">Fecha:</td>
                    <td style="padding: 10px;"><input type="date" id="fieldDate" class="swal2-input" style="max-width: 200px;"></td>
                </tr>
            </tbody>
        </table>
    </form>
</div>

<!-- Legal Graph View -->
<div id="legalGraphView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">GRÁFICA DE CUMPLIMIENTO LEGAL (Existe Actividad)</h2>
        <div style="display: flex; gap: 10px;">
             <!-- Print Button -->
             <button class="btn-view-premium" title="Imprimir Gráfica" onclick="printLegalGraph()" style="color: #667eea !important;"><i class="fas fa-print"></i></button>
            <button class="btn-secondary-premium" onclick="hideLegalGraph()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>
    
    <div style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; align-items: center;">
        <div class="chart-container" style="position: relative; height: 400px; width: 400px;">
            <canvas id="legalChart"></canvas>
        </div>
        
        <div id="legalStats" class="stats-container" style="background: #f8f9fa; padding: 20px; border-radius: 8px; min-width: 250px;">
            <h3 style="margin-top: 0; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 15px;">Resumen</h3>
            <div style="margin-bottom: 10px; font-size: 1.1em;">
                <span style="font-weight: bold; color: #2ecc71;">SI:</span> 
                <span id="statSi">0</span> (<span id="percSi">0%</span>)
            </div>
            <div style="margin-bottom: 10px; font-size: 1.1em;">
                <span style="font-weight: bold; color: #e74c3c;">NO:</span> 
                <span id="statNo">0</span> (<span id="percNo">0%</span>)
            </div>
            <div style="margin-top: 15px; font-weight: bold; font-size: 1.2em;">
                Total: <span id="statTotal">0</span>
            </div>
        </div>
    </div>
</div>

<!-- Modal de importación Excel -->
<div id="modalExcelImport" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; overflow-y:auto;">
    <div style="background:#fff; border-radius:12px; max-width:960px; margin:40px auto; padding:0; box-shadow:0 20px 60px rgba(0,0,0,0.3);">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1a7f37,#2ecc71); padding:20px 28px; border-radius:12px 12px 0 0; display:flex; justify-content:space-between; align-items:center;">
            <div style="color:#fff;">
                <h2 style="margin:0; font-size:1.2rem;"><i class="fas fa-file-excel" style="margin-right:8px;"></i>Importar Matriz Legal desde Excel</h2>
                <p style="margin:4px 0 0; font-size:0.82rem; opacity:0.85;">Sube un archivo .xlsx / .xls con los datos de la matriz</p>
            </div>
            <button onclick="closeExcelModal()" style="background:rgba(255,255,255,0.2); border:none; color:#fff; border-radius:50%; width:36px; height:36px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">&times;</button>
        </div>

        <!-- Drop Zone -->
        <div id="excelDropZone"
             style="margin:24px 28px 0; border:2px dashed #2ecc71; border-radius:10px; padding:32px; text-align:center; cursor:pointer; transition:all .2s; background:#f6fff8;"
             onclick="triggerExcelImport()"
             ondragover="event.preventDefault(); this.style.background='#e8fdf0'; this.style.borderColor='#1a7f37';"
             ondragleave="this.style.background='#f6fff8'; this.style.borderColor='#2ecc71';"
             ondrop="handleExcelDrop(event)">
            <i class="fas fa-cloud-upload-alt" style="font-size:2.5rem; color:#2ecc71; margin-bottom:10px;"></i>
            <p style="margin:0; font-size:1rem; color:#444; font-weight:600;">Arrastra tu archivo Excel aquí o haz clic para seleccionar</p>
            <p style="margin:6px 0 0; font-size:0.8rem; color:#888;">Formatos aceptados: .xlsx · .xls · .csv</p>
        </div>

        <!-- Guía de columnas -->
        <div style="margin:16px 28px 0; background:#fffbea; border:1px solid #f0c040; border-radius:8px; padding:12px 16px; font-size:0.8rem; color:#7a5c00;">
            <strong><i class="fas fa-info-circle"></i> Orden de columnas esperado en la hoja:</strong>
            <span style="margin-left:8px;">Clasificación (H/S/E) · Norma · Año de Emisión · Disposición que regula · Art. Aplicable · Descripción Requisito · Evidencia Cumplimiento · Responsable · Existe Act. (SI/NO) · Observación · Fecha (YYYY-MM-DD)</span>
        </div>

        <!-- Preview Table -->
        <div id="excelPreviewContainer" style="margin:16px 28px; display:none;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <strong id="excelPreviewCount" style="color:#1a7f37;"></strong>
                <div style="display:flex; gap:8px;">
                    <button onclick="importExcelData()" class="btn-new-record" style="background:#1a7f37;">
                        <i class="fas fa-database"></i> Guardar Todos
                    </button>
                    <button onclick="closeExcelModal()" class="btn-secondary-premium">Cancelar</button>
                </div>
            </div>
            <div style="overflow-x:auto; max-height:380px; overflow-y:auto; border:1px solid #e0e0e0; border-radius:8px;">
                <table id="excelPreviewTable" style="width:100%; border-collapse:collapse; font-size:0.82rem;"></table>
            </div>
        </div>

        <!-- Progress Bar -->
        <div id="importProgressWrapper" style="margin:0 28px 24px; display:none;">
            <p style="margin:0 0 6px; font-size:0.85rem; color:#555;" id="importProgressLabel">Importando...</p>
            <div style="background:#e9ecef; border-radius:6px; height:12px; overflow:hidden;">
                <div id="importProgressBar" style="height:100%; background:linear-gradient(90deg,#1a7f37,#2ecc71); width:0%; transition:width .3s;"></div>
            </div>
        </div>
    </div>
</div>

<script type="module" src="../planear/legal/legal.js?v=1.0"></script>
