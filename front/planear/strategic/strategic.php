<!-- CSS Import -->
<link rel="stylesheet" href="../planear/process/processMap.css?v=1.2">

<div class="page-header">
    <h1 class="page-title">Plataforma Estratégica</h1>
</div>

<div id="mainStrategicView" class="content-card">
    <!-- Company Policy Section -->
    <div class="section-container">
        <div class="section-header">
            <h2 class="section-title">Política Integral / Corporativa</h2>
            <button id="btnSavePolicy" class="btn-new-record" onclick="savePolicy()"><i class="fas fa-save"></i> Guardar Política</button>
            <button class="btn-secondary-premium" onclick="printPolicy()" id="btnPrint" style="display: none; margin-left: 10px;"><i class="fas fa-print"></i> Imprimir Política</button>
        </div>

        <div class="form-grid-3">
            <div>
                <label class="input-label">Nombre de la Política</label>
                <input type="text" id="policyName" class="swal2-input" placeholder="Ej: Política HSEQ">
            </div>
            <div>
                <label class="input-label">Fecha Creación</label>
                <input type="date" id="policyDate" class="swal2-input">
            </div>
            <div>
                <label class="input-label">Estado</label>
                <select id="policyStatus" class="swal2-select">
                    <option value="">Seleccione...</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label class="input-label">Naturaleza de la Organización (para generación de texto)</label>
            <div class="input-group">
                <input type="text" id="policyNature" class="swal2-input" placeholder="Ej: la construcción de obras civiles">
                <button class="btn-new-record" onclick="generatePolicyText()" style="white-space: nowrap;"><i class="fas fa-magic"></i> Generar Texto</button>
            </div>
        </div>

        <div class="form-group">
            <label class="input-label">Contenido de la Política</label>
            <textarea id="policyContent" class="swal2-textarea" style="height: 120px; resize: none;"></textarea>
        </div>
    </div>

    <!-- Principles Section (Hidden initially) -->
    <div id="principlesSection" class="section-container" style="display: none;">
        <div class="section-header">
            <h2 class="section-title">Principios de la Política</h2>
            <button class="btn-new-record" onclick="addPrinciple()"><i class="fas fa-plus-circle"></i> Agregar Principio</button>
        </div>
        <div class="table-responsive">
            <table class="modern-table" id="tablePrinciples">
                <thead>
                    <tr>
                        <th style="width: 100px;">Acción</th>
                        <th>Principio</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>

    <!-- Objectives Section (Hidden initially) -->
    <div id="objectivesSection" class="section-container" style="display: none;">
        <div class="section-header">
            <h2 class="section-title">Objetivos Estratégicos</h2>
            <button class="btn-new-record" onclick="showCreateObjective()"><i class="fas fa-plus-circle"></i> Crear Nuevo Objetivo</button>
        </div>
        <div class="table-responsive">
            <table class="modern-table" id="tableObjectives">
                <thead>
                    <tr>
                        <th style="width: 100px;">Acción</th>
                        <th>Nombre Objetivo</th>
                        <th>HV Indicadores</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>


    </div>

    <!-- Create Objective View (Hidden initially, simulates new page) -->
    <div id="createObjectiveView" class="content-card" style="display: none;">
        <div class="section-header">
            <h2 class="section-title">Creación de Objetivos</h2>
        </div>
        
        <div class="form-group">
            <label class="input-label">Objetivo</label>
            <textarea id="newObjectiveText" class="swal2-textarea" style="height: 150px; resize: none;" placeholder="Describa el objetivo estratégico..."></textarea>
        </div>

        <div class="action-bar" style="justify-content: flex-start; gap: 10px;">
            <button class="btn-new-record" onclick="saveObjective()"><i class="fas fa-save"></i> Guardar</button>
            <button class="btn-secondary-premium" onclick="hideCreateObjective()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>

    <!-- Indicators View (Hidden initially) -->
    <div id="indicatorsView" class="content-card" style="display: none;">
        <div class="section-header">
            <h2 class="section-title">Hoja de Vida del Indicador</h2>
            <h3 id="indicatorObjectiveTitle" class="section-title" style="font-size: 16px; color: #666;"></h3>
        </div>

        <input type="hidden" id="currentObjectiveId">

        <div class="form-group">
            <label class="input-label">Descripción de Fórmula</label>
            <textarea id="indFormula" class="swal2-textarea" style="height: 100px; resize: none;"></textarea>
        </div>

        <div class="form-grid-3">
            <div>
                <label class="input-label">Responsable</label>
                <input type="text" id="indResponsible" class="swal2-input">
            </div>
            <div>
                <label class="input-label">Límite Esperado</label>
                <input type="number" id="indExpected" class="swal2-input">
            </div>
            <div>
                <label class="input-label">Límite Crítico</label>
                <input type="number" id="indCritical" class="swal2-input">
            </div>
        </div>

        <div class="form-grid-3">
             <div>
                <label class="input-label">Fuente de Información</label>
                <input type="text" id="indSource" class="swal2-input">
            </div>
            <div>
                <label class="input-label">Periodicidad</label>
                <select id="indPeriodicity" class="swal2-select">
                    <option value="">Seleccione...</option>
                    <option value="Diario">Diario</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Mensual">Mensual</option>
                    <option value="Bimensual">Bimensual</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                </select>
            </div>
            <div>
                <label class="input-label">Tipo de Indicador</label>
                <select id="indType" class="swal2-select">
                    <option value="">Seleccione...</option>
                    <option value="Proceso">Proceso</option>
                    <option value="Resultado">Resultado</option>
                    <option value="Estructura">Estructura</option>
                </select>
            </div>
        </div>

        <div class="form-grid-3">
             <div>
                <label class="input-label">Tipo Límite</label>
                <select id="indLimitType" class="swal2-select">
                    <option value="">Seleccione...</option>
                    <option value="MayorIgual">Mayor o Igual</option>
                    <option value="MenorIgual">Menor o Igual</option>
                    <option value="Igual">Igual</option>
                </select>
            </div>
            <div>
                <label class="input-label">Dirigido A</label>
                <input type="text" id="indTarget" class="swal2-input">
            </div>
             <div>
                <label class="input-label">Fecha</label>
                <input type="date" id="indDate" class="swal2-input">
            </div>
        </div>

        <div class="action-bar" style="justify-content: flex-start; gap: 10px;">
            <button class="btn-new-record" onclick="saveIndicator()"><i class="fas fa-save"></i> Guardar</button>
            <button class="btn-secondary-premium" onclick="hideIndicators()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>
</div>

<script type="module" src="../planear/strategic/strategic.js?v=1.2"></script>
