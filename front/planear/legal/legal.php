<!-- CSS Import -->
<link rel="stylesheet" href="../planear/legal/legal.css?v=1.0">

<!-- Chart.js CDN (v4.4.1) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<!-- Chart.js DataLabels Plugin (v2.2.0) -->
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>

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
        <button class="btn-create-orange" onclick="filterLegal()" style="height: 35px; margin-bottom: 2px;">Filtrar</button>
    </div>

    <!-- Actions -->
    <div style="margin-bottom: 15px; display: flex; gap: 10px;">
        <button class="btn-create-orange" onclick="showCreateLegal()">Nuevo Registro</button>
        <button class="btn-create-orange" onclick="deleteSelected()" style="background-color: #e74c3c;">Eliminar Gestión legal</button>
        <!-- Graph Button -->
        <button class="btn-icon" title="Graficar" onclick="showLegalGraph()" style="background: white; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 1.2rem;">📊</button>
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
            <button class="btn-create-orange" onclick="saveLegal()">Guardar</button>
            <button class="btn-secondary" onclick="hideCreateLegal()">Volver</button>
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
             <button class="btn-icon" title="Imprimir Gráfica" onclick="printLegalGraph()" style="background: white; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 1.2rem;">🖨️</button>
            <button class="btn-secondary" onclick="hideLegalGraph()">Volver</button>
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

<script type="module" src="../planear/legal/legal.js?v=1.0"></script>
