<link rel="stylesheet" href="../planear/annual/annual.css?v=1.0">
<link rel="stylesheet" href="../styles/colors.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<div class="page-header">
    <h1 class="page-title">PLAN DE TRABAJO ANUAL</h1>
</div>

<!-- List View -->
<div id="annualListView" class="content-card">
    <div style="text-align: center; margin-bottom: 20px;">
        <button class="btn-new-record" onclick="showCreateAnnual()">
            <i class="fas fa-plus-circle"></i> Nuevo Registro
        </button>
    </div>

    <div class="table-container">
        <table class="annual-table" id="tableAnnualList">
            <thead>
                <tr>
                    <th style="width: 100px;">Acción</th>
                    <th>Periodo</th>
                    <th style="width: 80px;">Ver</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JS -->
            </tbody>
        </table>
    </div>
</div>

<!-- Create View -->
<div id="annualCreateView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">Nuevo Registro</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-new-record" onclick="saveAnnual()">
                <i class="fas fa-save"></i> Guardar
            </button>
            <button class="btn-secondary-premium" onclick="hideCreateAnnual()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>

    <form id="annualForm" style="max-width: 600px; margin: 0 auto;">
        <div style="display: flex; gap: 20px;">
            <div class="form-group" style="flex: 1;">
                <label class="form-label">Fecha Inicial:</label>
                <input type="date" id="fieldStartDate" class="form-input-date">
            </div>
            <div class="form-group" style="flex: 1;">
                <label class="form-label">Fecha Final:</label>
                <input type="date" id="fieldEndDate" class="form-input-date">
            </div>
        </div>
    </form>
</div>

<!-- Detail View (Activities) -->
<div id="annualDetailView" class="content-card" style="display: none;">
    <div class="section-header">
        <div>
            <h2 class="section-title">PLAN DE TRABAJO ANUAL</h2>
            <div id="detailPeriod" style="color: #666; font-weight: bold; margin-top: 5px;"></div>
        </div>
        <div>
            <button class="btn-hover-graph" style="margin-right: 10px;" onclick="printAnnual()">
                <i class="fas fa-print"></i> Imprimir
            </button>
            <button class="btn-secondary-premium" onclick="hideAnnualDetail()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>



    <!-- 1. Gestión Organizacional -->
    <h3 class="section-subtitle">Gestión Organizacional</h3>
    
    <!-- Objectives (Organizational) -->
    <div style="margin-bottom: 20px;">
        <button class="btn-new-record" style="margin-bottom: 10px; font-size: 0.9rem; padding: 5px 15px;" onclick="addObjective('organizational')">
            <i class="fas fa-plus-circle"></i> Agregar Objetivo y Meta
        </button>
        <table class="annual-table" id="tableObjectivesOrganizational" style="margin-top: 5px;">
            <thead>
                <tr>
                    <th style="width: 100px;">Acción</th>
                    <th>Objetivo</th>
                    <th>Meta</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- Activities (Organizational) -->
    <div style="margin-bottom: 10px;">
        <button class="btn-new-record" style="font-size: 0.9rem; padding: 5px 10px;" onclick="addActivity('organizational')"><i class="fas fa-plus-circle"></i> Nuevo Registro</button>
    </div>
    <div class="table-container">
        <table class="annual-table" id="tableOrganizational">
            <thead>
                <tr>
                    <th style="width: 80px;">Acción</th>
                    <th>Nombre</th>
                    <th>Actividad</th>
                    <th>Responsable</th>
                    <th>Recursos</th>
                    <th>Dirigido A</th>
                    <th style="width: 100px;">Fecha Planeación</th>
                    <th style="width: 100px;">Fecha Ejecución</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- 2. Programas de Gestión -->
    <h3 class="section-subtitle">Programas de Gestión</h3>

    <!-- Objectives (Programs) -->
    <div style="margin-bottom: 20px;">
        <button class="btn-new-record" style="margin-bottom: 10px; font-size: 0.9rem; padding: 5px 10px;" onclick="addObjective('programs')"><i class="fas fa-plus-circle"></i> Agregar Objetivo y Meta</button>
        <table class="annual-table" id="tableObjectivesPrograms" style="margin-top: 5px;">
            <thead>
                <tr>
                    <th style="width: 100px;">Acción</th>
                    <th style="width: 45%;">Objetivo</th>
                    <th style="width: 45%;">Meta</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <div style="margin-bottom: 10px;">
        <button class="btn-new-record" style="font-size: 0.9rem; padding: 5px 10px;" onclick="addActivity('programs')"><i class="fas fa-plus-circle"></i> Nuevo Registro</button>
    </div>
    <div class="table-container">
        <table class="annual-table" id="tablePrograms">
            <thead>
               <tr>
                    <th style="width: 80px;">Acción</th>
                    <th>Nombre</th>
                    <th>Actividad</th>
                    <th>Responsable</th>
                    <th>Recursos</th>
                    <th>Dirigido A</th>
                    <th style="width: 100px;">Fecha Planeación</th>
                    <th style="width: 100px;">Fecha Ejecución</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- 3. Inspecciones -->
    <h3 class="section-subtitle">Inspecciones</h3>

    <!-- Objectives (Inspections) -->
    <div style="margin-bottom: 20px;">
        <button class="btn-new-record" style="margin-bottom: 10px; font-size: 0.9rem; padding: 5px 10px;" onclick="addObjective('inspections')"><i class="fas fa-plus-circle"></i> Agregar Objetivo y Meta</button>
        <table class="annual-table" id="tableObjectivesInspections" style="margin-top: 5px;">
            <thead>
                <tr>
                    <th style="width: 100px;">Acción</th>
                    <th style="width: 45%;">Objetivo</th>
                    <th style="width: 45%;">Meta</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <div style="margin-bottom: 10px;">
        <button class="btn-new-record" style="font-size: 0.9rem; padding: 5px 10px;" onclick="addActivity('inspections')"><i class="fas fa-plus-circle"></i> Nuevo Registro</button>
    </div>
    <div class="table-container">
        <table class="annual-table" id="tableInspections">
            <thead>
                <tr>
                    <th style="width: 80px;">Acción</th>
                    <th>Nombre</th>
                    <th>Actividad</th>
                    <th>Responsable</th>
                    <th>Recursos</th>
                    <th>Dirigido A</th>
                    <th style="width: 100px;">Fecha Planeación</th>
                    <th style="width: 100px;">Fecha Ejecución</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- 4. Auditorias -->
    <h3 class="section-subtitle">Auditorias</h3>

    <!-- Objectives (Audits) -->
    <div style="margin-bottom: 20px;">
        <button class="btn-new-record" style="margin-bottom: 10px; font-size: 0.9rem; padding: 5px 10px;" onclick="addObjective('audits')"><i class="fas fa-plus-circle"></i> Agregar Objetivo y Meta</button>
        <table class="annual-table" id="tableObjectivesAudits" style="margin-top: 5px;">
            <thead>
                <tr>
                    <th style="width: 100px;">Acción</th>
                    <th style="width: 45%;">Objetivo</th>
                    <th style="width: 45%;">Meta</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <div style="margin-bottom: 10px;">
        <button class="btn-new-record" style="font-size: 0.9rem; padding: 5px 10px;" onclick="addActivity('audits')"><i class="fas fa-plus-circle"></i> Nuevo Registro</button>
    </div>
    <div class="table-container">
        <table class="annual-table" id="tableAudits">
            <thead>
                <tr>
                    <th style="width: 80px;">Acción</th>
                    <th>Nombre</th>
                    <th>Actividad</th>
                    <th>Responsable</th>
                    <th>Recursos</th>
                    <th>Dirigido A</th>
                    <th style="width: 100px;">Fecha Planeación</th>
                    <th style="width: 100px;">Fecha Ejecución</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- 5. Gestion de Vulnerabilidad -->
    <h3 class="section-subtitle">Gestion de Vulnerabilidad</h3>

    <!-- Objectives (Vulnerability) -->
    <div style="margin-bottom: 20px;">
        <button class="btn-new-record" style="margin-bottom: 10px; font-size: 0.9rem; padding: 5px 10px;" onclick="addObjective('vulnerability')"><i class="fas fa-plus-circle"></i> Agregar Objetivo y Meta</button>
        <table class="annual-table" id="tableObjectivesVulnerability" style="margin-top: 5px;">
            <thead>
                <tr>
                    <th style="width: 100px;">Acción</th>
                    <th style="width: 45%;">Objetivo</th>
                    <th style="width: 45%;">Meta</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <div style="margin-bottom: 10px;">
        <button class="btn-new-record" style="font-size: 0.9rem; padding: 5px 10px;" onclick="addActivity('vulnerability')"><i class="fas fa-plus-circle"></i> Nuevo Registro</button>
    </div>
    <div class="table-container">
        <table class="annual-table" id="tableVulnerability">
            <thead>
                <tr>
                    <th style="width: 80px;">Acción</th>
                    <th>Nombre</th>
                    <th>Actividad</th>
                    <th>Responsable</th>
                    <th>Recursos</th>
                    <th>Dirigido A</th>
                    <th style="width: 100px;">Fecha Planeación</th>
                    <th style="width: 100px;">Fecha Ejecución</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- 6. Revision por Direccion -->
    <h3 class="section-subtitle">Revision por Direccion</h3>

    <!-- Objectives (Management Review) -->
    <div style="margin-bottom: 20px;">
        <button class="btn-new-record" style="margin-bottom: 10px; font-size: 0.9rem; padding: 5px 10px;" onclick="addObjective('managementRelease')"><i class="fas fa-plus-circle"></i> Agregar Objetivo y Meta</button>
        <table class="annual-table" id="tableObjectivesManagementReview" style="margin-top: 5px;">
            <thead>
                <tr>
                    <th style="width: 100px;">Acción</th>
                    <th style="width: 45%;">Objetivo</th>
                    <th style="width: 45%;">Meta</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <div style="margin-bottom: 10px;">
        <button class="btn-new-record" style="font-size: 0.9rem; padding: 5px 10px;" onclick="addActivity('managementRelease')"><i class="fas fa-plus-circle"></i> Nuevo Registro</button>
    </div>
    <div class="table-container">
        <table class="annual-table" id="tableManagementReview">
            <thead>
                <tr>
                    <th style="width: 80px;">Acción</th>
                    <th>Nombre</th>
                    <th>Actividad</th>
                    <th>Responsable</th>
                    <th>Recursos</th>
                    <th>Dirigido A</th>
                    <th style="width: 100px;">Fecha Planeación</th>
                    <th style="width: 100px;">Fecha Ejecución</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- 7. Examenes Medicos -->
    <h3 class="section-subtitle">Examenes Medicos</h3>

    <!-- Objectives (Medical) -->
    <div style="margin-bottom: 20px;">
        <button class="btn-new-record" style="margin-bottom: 10px; font-size: 0.9rem; padding: 5px 10px;" onclick="addObjective('medical')"><i class="fas fa-plus-circle"></i> Agregar Objetivo y Meta</button>
        <table class="annual-table" id="tableObjectivesMedicalExams" style="margin-top: 5px;">
            <thead>
                <tr>
                    <th style="width: 100px;">Acción</th>
                    <th style="width: 45%;">Objetivo</th>
                    <th style="width: 45%;">Meta</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <div style="margin-bottom: 10px;">
        <button class="btn-new-record" style="font-size: 0.9rem; padding: 5px 15px;" onclick="addActivity('medical')">
            <i class="fas fa-plus-circle"></i> Nuevo Registro
        </button>
    </div>
    <div class="table-container">
        <table class="annual-table" id="tableMedicalExams">
            <thead>
                <tr>
                    <th style="width: 80px;">Acción</th>
                    <th>Nombre</th>
                    <th>Actividad</th>
                    <th>Responsable</th>
                    <th>Recursos</th>
                    <th>Dirigido A</th>
                    <th style="width: 100px;">Fecha Planeación</th>
                    <th style="width: 100px;">Fecha Ejecución</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- 8. Firmas -->
    <div style="margin-top: 50px; border-top: 1px solid #ddd; padding-top: 30px;">
        <h3 class="section-subtitle">Firmas</h3>
        <div style="display: flex; justify-content: space-around; margin-top: 30px; gap: 40px;">
            
            <!-- Firma 1 -->
            <div style="text-align: center; flex: 1; max-width: 300px;">
                <div style="margin-bottom: 10px; border: 1px dashed #ccc; height: 100px; display: flex; align-items: center; justify-content: center; cursor: pointer;" onclick="document.getElementById('fileSig1').click()">
                    <img id="previewSig1" src="" alt="Firma" style="max-height: 100%; max-width: 100%; display: none;">
                    <span id="placeholderSig1" style="color: #999; font-size: 0.8rem;"><i class="fas fa-signature"></i> Clic para agregar firma</span>
                </div>
                <input type="file" id="fileSig1" style="display: none;" accept="image/*" onchange="handleSignatureSelect(this, 'previewSig1', 'placeholderSig1')">
                
                <div style="border-top: 1px solid #333; margin-top: 5px; margin-bottom: 5px;"></div>
                <input type="text" id="sigName1" placeholder="Nombre" class="form-input-text" style="width: 100%; text-align: center; margin-bottom: 5px; border: none; background: #f9f9f9;">
                <input type="text" id="sigRole1" placeholder="Cargo" class="form-input-text" style="width: 100%; text-align: center; border: none; background: #f9f9f9;">
                <div style="margin-top: 5px; font-weight: bold;">Elaboró</div>
            </div>

            <!-- Firma 2 -->
            <div style="text-align: center; flex: 1; max-width: 300px;">
                <div style="margin-bottom: 10px; border: 1px dashed #ccc; height: 100px; display: flex; align-items: center; justify-content: center; cursor: pointer;" onclick="document.getElementById('fileSig2').click()">
                    <img id="previewSig2" src="" alt="Firma" style="max-height: 100%; max-width: 100%; display: none;">
                    <span id="placeholderSig2" style="color: #999; font-size: 0.8rem;"><i class="fas fa-signature"></i> Clic para agregar firma</span>
                </div>
                <input type="file" id="fileSig2" style="display: none;" accept="image/*" onchange="handleSignatureSelect(this, 'previewSig2', 'placeholderSig2')">
                
                <div style="border-top: 1px solid #333; margin-top: 5px; margin-bottom: 5px;"></div>
                <input type="text" id="sigName2" placeholder="Nombre" class="form-input-text" style="width: 100%; text-align: center; margin-bottom: 5px; border: none; background: #f9f9f9;">
                <input type="text" id="sigRole2" placeholder="Cargo" class="form-input-text" style="width: 100%; text-align: center; border: none; background: #f9f9f9;">
                <div style="margin-top: 5px; font-weight: bold;">Revisó / Aprobó</div>
            </div>

        </div>
        <div style="text-align: center; margin-top: 30px;">
            <button class="btn-new-record" onclick="saveSignatures()"><i class="fas fa-save"></i> Guardar Firmas</button>
        </div>
    </div>
</div>

<!-- Add Objective View -->
<div id="annualObjectiveView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">OBJETIVOS Y METAS</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-new-record" onclick="saveObjective()"><i class="fas fa-save"></i> Guardar</button>
            <button class="btn-secondary-premium" onclick="hideObjectiveView()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>

    <form id="objectiveForm" style="max-width: 800px; margin: 0 auto;">
        <input type="hidden" id="objCategoryContext">
        <input type="hidden" id="objEditId">
        
        <div class="form-group">
            <label class="form-label">Objetivo:</label>
            <textarea id="fieldObjective" class="form-input-text" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
        </div>

        <div class="form-group">
            <label class="form-label">Meta:</label>
            <textarea id="fieldMeta" class="form-input-text" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
        </div>
    </form>
</div>

<!-- Add Activity View -->
<div id="annualActivityView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">NUEVA ACTIVIDAD</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-new-record" onclick="saveActivity()"><i class="fas fa-save"></i> Guardar</button>
            <button class="btn-secondary-premium" onclick="hideActivityView()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>

    <form id="activityForm" style="max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <input type="hidden" id="actCategoryContext">
        <input type="hidden" id="actEditId">
        
        <div class="form-group" style="grid-column: span 2;">
            <label class="form-label">Nombre:</label>
            <input type="text" id="fieldActName" class="form-input-date" style="width: 100%;">
        </div>

        <div class="form-group" style="grid-column: span 2;">
            <label class="form-label">Actividad:</label>
            <textarea id="fieldActActivity" class="form-input-text" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
        </div>

        <div class="form-group">
            <label class="form-label">Responsable:</label>
            <input type="text" id="fieldActResponsible" class="form-input-date" style="width: 100%;">
        </div>

        <div class="form-group">
            <label class="form-label">Recursos:</label>
            <input type="text" id="fieldActResources" class="form-input-date" style="width: 100%;">
        </div>

        <div class="form-group">
            <label class="form-label">Dirigido A:</label>
            <input type="text" id="fieldActTarget" class="form-input-date" style="width: 100%;">
        </div>

        <div class="form-group">
            <label class="form-label">Observaciones:</label>
            <textarea id="fieldActObs" class="form-input-text" rows="1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
        </div>

        <div class="form-group">
            <label class="form-label">Fecha Planeación:</label>
            <input type="date" id="fieldActPlanDate" class="form-input-date">
        </div>

        <div class="form-group">
            <label class="form-label">Fecha Ejecución:</label>
            <input type="date" id="fieldActExecDate" class="form-input-date">
        </div>
    </form>
</div>

<script type="module" src="../planear/annual/annual.js?v=1.0"></script>
