    <!-- SweetAlert2 (ensure it's available if not global, but dashboard has it) -->
    <!-- Content Card -->
    <link rel="stylesheet" href="../planear/process/processMap.css">

    <div class="page-header">
        <h1 class="page-title">Ficha de Proceso</h1>
    </div>

    <div class="content-card" style="max-width: 1000px;">
        <!-- Header Info -->
        <div class="process-header" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color);">
            <div>
                <strong style="color: var(--text-secondary); font-size: 12px; text-transform: uppercase;">Nombre del Proceso</strong>
                <div id="processName" style="font-size: 18px; font-weight: 600;">Cargando...</div>
            </div>
            <div>
                <strong style="color: var(--text-secondary); font-size: 12px; text-transform: uppercase;">Código</strong>
                <div id="processCode" style="font-size: 18px; font-weight: 600;">...</div>
            </div>
            <div>
                <strong style="color: var(--text-secondary); font-size: 12px; text-transform: uppercase;">Estado</strong>
                <div id="processStatus"><span class="badge">...</span></div>
            </div>
            <div>
                <strong style="color: var(--text-secondary); font-size: 12px; text-transform: uppercase;">Fecha</strong>
                <div id="processDate" style="font-size: 16px;">...</div>
            </div>
        </div>

        <!-- Form Section -->
        <form id="processSheetForm" style="margin-bottom: 30px;">
            <div style="margin-bottom: 20px;">
                <label for="objetoAlcance" style="display: block; margin-bottom: 8px; font-weight: 500;">Objeto y Alcance</label>
                <textarea id="objetoAlcance" class="swal2-textarea" style="width: 100%; margin: 0; box-sizing: border-box; height: 100px;" placeholder="Describa el objeto y alcance del proceso..."></textarea>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label for="responsable" style="display: block; margin-bottom: 8px; font-weight: 500;">Responsable del Proceso</label>
                <input type="text" id="responsable" class="swal2-input" style="width: 100%; margin: 0; box-sizing: border-box;" placeholder="Nombre del responsable">
            </div>

            <div style="display: flex; gap: 10px;">
                <button type="button" class="btn-primary" onclick="saveSheet()">Guardar</button>
                <button type="button" class="tab-btn" onclick="goBack()" style="border: 1px solid var(--border-color);">Volver</button>
            </div>
        </form>

        <!-- Activities Section -->
        <div id="detailsSection" class="activities-section" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="font-size: 18px; margin: 0;">Lista de Actividades</h2>
                <button class="btn-primary" onclick="addActivity()" style="padding: 8px 15px; font-size: 13px;">+ Nuevo Registro</button>
            </div>

            <div class="table-responsive">
                <table class="modern-table" id="activitiesTable">
                    <thead>
                        <tr>
                            <th>Acción</th>
                            <th>Lista de Actividades</th>
                            <th>Área</th>
                            <th>Act. Rutinaria</th>
                            <th>Act. Alto Riesgo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Activities will be rendered here -->
                        <tr>
                            <td colspan="5" class="empty-state">No hay actividades registradas.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        <!-- Resources Section -->
        <div class="activities-section" style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="font-size: 18px; margin: 0;">Recursos</h2>
                <button class="btn-primary" onclick="addResource()" style="padding: 8px 15px; font-size: 13px;">+ Nuevo Recurso</button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="resourcesTable">
                    <thead>
                        <tr>
                            <th>Acción</th>
                            <th>Nombre del Recurso</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

        <!-- Inputs Section -->
        <div class="activities-section" style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="font-size: 18px; margin: 0;">Insumos</h2>
                <button class="btn-primary" onclick="addInput()" style="padding: 8px 15px; font-size: 13px;">+ Nuevo Insumo</button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="inputsTable">
                    <thead>
                        <tr>
                            <th>Acción</th>
                            <th>Nombre del Insumo</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

        <!-- Procedures Section -->
        <div class="activities-section" style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="font-size: 18px; margin: 0;">Procedimientos</h2>
                <button class="btn-primary" onclick="addProcedure()" style="padding: 8px 15px; font-size: 13px;">+ Nuevo Procedimiento</button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="proceduresTable">
                    <thead>
                        <tr>
                            <th>Acción</th>
                            <th>Nombre del Procedimiento</th>
                            <th>Archivo</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

        <!-- Personnel Section -->
        <div class="activities-section" style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="font-size: 18px; margin: 0;">Personal del Proceso</h2>
                <button class="btn-primary" onclick="addPersonnel()" style="padding: 8px 15px; font-size: 13px;">+ Nuevo Personal</button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="personnelTable">
                    <thead>
                        <tr>
                            <th>Acción</th>
                            <th>Cargo</th>
                            <th>Cargo al que reporta</th>
                            <th>Número de personas</th>
                            <th>Gestión</th>
                            <th>Responsabilidades</th>
                            <th>Rendición de Cuentas</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        </div>
    </div>

    <script type="module" src="../planear/process/processSheet.js?v=1.3"></script>
