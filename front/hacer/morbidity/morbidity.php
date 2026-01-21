<link rel="stylesheet" href="../hacer/morbidity/morbidity.css">

<div class="morbidity-container">
    <div id="morbidityListView">
        <div class="morbidity-header">
            MORBILIDAD/ AUSENTISMO
        </div>

        <div class="morbidity-toolbar">
            <div class="filter-group">
                <input type="text" id="filterMorbidityName" placeholder="Nombre" class="filter-input">
                <input type="text" id="filterMorbidityId" placeholder="Nro Identificacion" class="filter-input">
                <button class="btn-filter" onclick="filterMorbidity()">
                    <i class="fas fa-filter"></i> Filtrar
                </button>
            </div>
            
            <div style="display: flex; gap: 15px; align-items: center;">
                <button class="btn-graph" onclick="showMorbidityGraph()">
                    <i class="fas fa-chart-bar"></i> Graficar
                </button>
                <button class="btn-add-circle" onclick="showCreateMorbidity()" title="Nuevo Registro">
                    +
                </button>
            </div>
        </div>

        <div class="table-container">
            <table class="morbidity-table">
                <thead>
                    <tr>
                        <th style="width: 80px;">Accion</th>
                        <th>Nro. Identificacion</th>
                        <th>Nombre</th>
                        <th>Fechas Incapacidad</th>
                        <th>Duracion en Dias</th>
                        <th>Codigo</th>
                        <th>Tipo de Incapacidad</th>
                    </tr>
                </thead>
                <tbody id="morbidityTableBody">
                    <!-- Dynamic Content -->
                </tbody>
            </table>
        </div>

        <!-- First Aid Section -->
        <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
            <h2 class="section-title">PRIMEROS AUXILIOS</h2>
            
            <div class="morbidity-toolbar">
                <div class="filter-group">
                    <input type="text" id="filterFirstAidName" class="filter-input" placeholder="Nombre..." onkeyup="filterFirstAid()">
                    <input type="text" id="filterFirstAidId" class="filter-input" placeholder="Nro Identificacion..." onkeyup="filterFirstAid()">
                    <button class="btn-orange" onclick="filterFirstAid()">
                        <i class="fas fa-search"></i> Filtrar
                    </button>
                </div>
                
                <div style="display: flex; gap: 15px; align-items: center;">
                    <button class="btn-graph" onclick="showFirstAidGraph()">
                        <i class="fas fa-chart-bar"></i> Graficar
                    </button>
                    <button class="btn-add-circle" onclick="showCreateFirstAid()" title="Nuevo Registro Primeros Auxilios">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>

            <div class="table-container">
                <table class="morbidity-table">
                    <thead>
                        <tr>
                            <th style="width: 80px;">Accion</th>
                            <th>Nro. Identificacion</th>
                            <th>Nombre</th>
                            <th>Tipo de Primeros Auxilios</th>
                            <th>Causa</th>
                        </tr>
                    </thead>
                    <tbody id="firstAidTableBody">
                        <!-- Populated by JS -->
                    </tbody>
                </table>
            </div>
            
            <!-- Add Button -->

        </div>
    </div>

    <!-- Create First Aid View -->
    <div id="firstAidCreateView" class="content-card" style="display: none;">
        <h2 class="section-title">Nuevo Registro de Primeros Auxilios</h2>
        
        <div class="form-container">
            <form id="firstAidForm">
                <div class="grid-2">
                    <div class="form-group" style="grid-column: span 2;">
                        <label class="form-label">Empleado</label>
                        <select id="firstAidEmployee" class="form-input">
                            <option value="">Seleccione...</option>
                            <option value="Brayan Daniel Cardenas Quitian">Brayan Daniel Cardenas Quitian</option>
                            <option value="Maria Fernanda Lopez">Maria Fernanda Lopez</option>
                            <option value="Carlos Andres Perez">Carlos Andres Perez</option>
                            <option value="Luisa Fernanda Gomez">Luisa Fernanda Gomez</option>
                            <option value="Jorge Eliecer Diaz">Jorge Eliecer Diaz</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Tipo de Primeros Auxilios</label>
                        <select id="firstAidType" class="form-input">
                            <option value="Curación">Curación</option>
                            <option value="Inmovilización">Inmovilización</option>
                            <option value="Traslado">Traslado</option>
                            <option value="Reanimación">Reanimación</option>
                            <option value="Limpieza de herida">Limpieza de herida</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Causa</label>
                        <input type="text" id="firstAidCause" class="form-input" placeholder="Causa del incidente...">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Fecha</label>
                        <input type="date" id="firstAidDate" class="form-input">
                    </div>
                </div>
                
                <div class="form-actions" style="margin-top: 20px;">
                    <button type="button" class="btn-secondary" onclick="hideCreateFirstAid()">Volver</button>
                    <button type="button" class="btn-orange" onclick="saveFirstAid()">Guardar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Create/Edit View (Hidden by default) -->
    <div id="morbidityCreateView" class="content-card" style="display: none;">
        <h2 class="section-title">Registrar Incapacidad / Ausentismo</h2>
        <form id="morbidityForm">
            <div class="grid-2">
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Empleado</label>
                    <select id="morbidityEmployee" class="form-input">
                        <option value="">Seleccione un empleado...</option>
                        <!-- Mock Options -->
                        <option value="Brayan Daniel Cardenas Quitian">Brayan Daniel Cardenas Quitian</option>
                        <option value="Maria Fernanda Lopez">Maria Fernanda Lopez</option>
                        <option value="Carlos Andres Perez">Carlos Andres Perez</option>
                        <option value="Luisa Fernanda Gomez">Luisa Fernanda Gomez</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Fecha Incapacidad Inicial</label>
                    <input type="date" id="morbidityStartDate" class="form-input" onchange="calculateDays()">
                </div>
                <div class="form-group">
                    <label class="form-label">Fecha Incapacidad Final</label>
                    <input type="date" id="morbidityEndDate" class="form-input" onchange="calculateDays()">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Duracion en Dias</label>
                    <input type="number" id="morbidityDays" class="form-input" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Codigo</label>
                    <input type="text" id="morbidityCode" class="form-input" placeholder="Ej: A00">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Tipo Incapacidad</label>
                    <select id="morbidityType" class="form-input">
                        <option value="Enfermedad comun">Enfermedad comun</option>
                        <option value="Enfermedad laboral">Enfermedad laboral</option>
                        <option value="Accidente de trabajo">Accidente de trabajo</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Causa Incapacidad</label>
                    <div class="autocomplete-container">
                        <input type="text" id="morbidityCause" class="form-input" placeholder="Buscar causa..." autocomplete="off">
                        <ul class="suggestions-list" id="causeSuggestions"></ul>
                    </div>
                </div>
            </div>
            
            <div class="form-actions" style="margin-top: 20px;">
                <button type="button" class="btn-secondary" onclick="hideCreateMorbidity()">Volver</button>
                <button type="button" class="btn-orange" onclick="saveMorbidity()">Guardar</button>
            </div>
        </form>
    </div>

    <!-- Graph View (Hidden by default) -->
    <div id="morbidityGraphView" class="content-card" style="display: none;">
        <h2 class="section-title">Estadística de Morbilidad / Ausentismo</h2>
        
        <div class="morbidity-toolbar" style="border: 1px solid #ddd; background: #f9f9f9; width: 100%;">
            <div class="filter-group">
                <label style="font-weight: bold;">Año:</label>
                <input type="number" id="graphYear" class="filter-input" value="2025" style="width: 100px;">
                
                <label style="font-weight: bold; margin-left: 10px;">Mes:</label>
                <select id="graphMonth" class="filter-input" style="width: 150px;">
                    <option value="0">Enero</option>
                    <option value="1">Febrero</option>
                    <option value="2">Marzo</option>
                    <option value="3">Abril</option>
                    <option value="4">Mayo</option>
                    <option value="5">Junio</option>
                    <option value="6">Julio</option>
                    <option value="7">Agosto</option>
                    <option value="8">Septiembre</option>
                    <option value="9">Octubre</option>
                    <option value="10">Noviembre</option>
                    <option value="11">Diciembre</option>
                </select>

                <button class="btn-orange" onclick="generateMorbidityGraphs()">
                    <i class="fas fa-chart-pie"></i> Generar
                </button>
            </div>
            
            <button class="btn-secondary" onclick="hideMorbidityGraph()">
                <i class="fas fa-arrow-left"></i> Volver
            </button>
        </div>

        <div class="charts-container" style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 20px;">
            <div style="border: 1px solid #eee; padding: 10px; border-radius: 8px; width: 50%; margin: 0 auto;">
                <h3 style="text-align: center; color: #555;">Comportamiento Mensual</h3>
                <canvas id="monthlyChart"></canvas>
            </div>
            <div style="border: 1px solid #eee; padding: 10px; border-radius: 8px;">
                <h3 style="text-align: center; color: #555;">Comportamiento Anual</h3>
                <canvas id="annualChart"></canvas>
            </div>
        </div>
    </div>
    <!-- First Aid Graph View -->
    <div id="firstAidGraphView" class="content-card" style="display: none;">
        <h2 class="section-title">Estadística de Primeros Auxilios</h2>
        
        <div class="morbidity-toolbar" style="border: 1px solid #ddd; background: #f9f9f9; width: 100%;">
            <div class="filter-group">
                <label style="font-weight: bold;">Año:</label>
                <input type="number" id="graphFirstAidYear" class="filter-input" value="2025" style="width: 100px;">
                
                <label style="font-weight: bold; margin-left: 10px;">Mes:</label>
                <select id="graphFirstAidMonth" class="filter-input" style="width: 150px;">
                    <option value="0">Enero</option>
                    <option value="1">Febrero</option>
                    <option value="2">Marzo</option>
                    <option value="3">Abril</option>
                    <option value="4">Mayo</option>
                    <option value="5">Junio</option>
                    <option value="6">Julio</option>
                    <option value="7">Agosto</option>
                    <option value="8">Septiembre</option>
                    <option value="9">Octubre</option>
                    <option value="10">Noviembre</option>
                    <option value="11">Diciembre</option>
                </select>

                <button class="btn-orange" onclick="generateFirstAidGraphs()">
                    <i class="fas fa-chart-pie"></i> Generar
                </button>
            </div>
            
            <button class="btn-secondary" onclick="hideFirstAidGraph()">
                <i class="fas fa-arrow-left"></i> Volver
            </button>
        </div>

        <div class="charts-container" style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 20px;">
            <div style="border: 1px solid #eee; padding: 10px; border-radius: 8px; width: 50%; margin: 0 auto;">
                <h3 style="text-align: center; color: #555;">Comportamiento Mensual</h3>
                <canvas id="monthlyFirstAidChart"></canvas>
            </div>
            <div style="border: 1px solid #eee; padding: 10px; border-radius: 8px;">
                <h3 style="text-align: center; color: #555;">Comportamiento Anual</h3>
                <canvas id="annualFirstAidChart"></canvas>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
<script src="../hacer/morbidity/morbidity.js"></script>
<script>
    if(typeof initMorbidity === 'function') {
        initMorbidity();
    } else {
        // Retry in case of race condition
        setTimeout(() => { if(typeof initMorbidity === 'function') initMorbidity(); }, 100);
    }
</script>
