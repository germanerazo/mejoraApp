<!-- CSS Import -->
<link rel="stylesheet" href="../planear/process/processMap.css?v=1.2">

<div class="page-header">
    <h1 class="page-title">Plataforma Estratégica</h1>
</div>

<div class="content-card">
    <!-- Company Policy Section -->
    <div class="section-container">
        <div class="section-header">
            <h2 class="section-title">Política Integral / Corporativa</h2>
            <button class="btn-primary" onclick="savePolicy()">Guardar Política</button>
            <button class="btn-secondary" onclick="printPolicy()" id="btnPrint" style="display: none; margin-left: 10px;">Imprimir Política</button>
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
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label class="input-label">Naturaleza de la Organización (para generación de texto)</label>
            <div class="input-group">
                <input type="text" id="policyNature" class="swal2-input" placeholder="Ej: la construcción de obras civiles">
                <button class="btn-secondary" onclick="generatePolicyText()" style="white-space: nowrap;">Generar Texto</button>
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
            <button class="btn-primary" onclick="addPrinciple()">+ Agregar Principio</button>
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

    </div>
</div>

<script type="module" src="../planear/strategic/strategic.js?v=1.2"></script>
