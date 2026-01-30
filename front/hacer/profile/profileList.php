<!-- CSS Import -->
<link rel="stylesheet" href="../hacer/profile/profileList.css?v=1.0">

<div class="page-header">
    <h1 class="page-title">BUSQUEDA DE PERFIL DE CARGOS</h1>
</div>

<div id="mainProfileView" class="content-card">
    <div class="filter-section">
        <div style="flex-grow: 1; max-width: 400px;">
            <label class="input-label">Nombre del cargo:</label>
            <input type="text" id="filterName" class="swal2-input" placeholder="Buscar por nombre..." style="background: white;">
        </div>
        <button class="btn-filter-premium" onclick="filterProfiles()">
            <i class="fas fa-filter"></i> Filtrar
        </button>
    </div>

    <div style="display: flex; justify-content: flex-end; margin-bottom: 25px;">
        <button class="btn-new-record" onclick="showCreateProfile()">
            <i class="fas fa-plus-circle"></i> Nuevo Registro de Cargo
        </button>
    </div>

    <div class="table-responsive">
        <table class="modern-table" id="tableProfiles">
            <thead>
                <tr>
                    <th style="width: 100px; text-align: center;">Acción</th>
                    <th>Nombre</th>
                    <th style="width: 80px; text-align: center;">Ver</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JS -->
            </tbody>
        </table>
    </div>
</div>

<!-- Create Profile View (Hidden initially) -->
<div id="createProfileView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">PERFIL DE CARGO</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-new-record" onclick="saveProfile()"><i class="fas fa-save"></i> Guardar</button>
            <button class="btn-secondary-premium" onclick="hideCreateProfile()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>

    <div class="form-grid-3">
        <div>
            <label class="input-label">Cargo</label>
            <select id="profileJob" class="swal2-select">
                <option value="">Seleccione...</option>
                <option value="Analista">Analista</option>
                <option value="Gerente">Gerente</option>
                <!-- Add more options as needed -->
            </select>
        </div>
        <div>
            <label class="input-label">Cargo al que Reporta</label>
            <select id="profileReportTo" class="swal2-select">
                <option value="">Seleccione...</option>
                <option value="Gerente General">Gerente General</option>
                <option value="Junta Directiva">Junta Directiva</option>
            </select>
        </div>
    </div>
    
    <!-- Subsections (Hidden until saved) -->
    <div id="profileDetails" style="display: none;">
        
        <!-- Responsabilidades Section -->
        <div class="section-container" style="margin-top: 30px;">
            <div class="section-header">
                <h3 class="section-title" style="font-size: 16px;">RESPONSABILIDADES</h3>
                <button class="btn-new-record" onclick="addResponsibility()">+</button>
            </div>
            <div id="responsibilitiesList">
                <!-- Dynamic Responsibilities -->
            </div>
        </div>

        <!-- 1. Educación -->
        <div class="section-container">
            <div class="section-header">
                <h3 class="section-title" style="font-size: 16px;">EDUCACIÓN</h3>
                <button class="btn-new-record" onclick="addSubsection('education')"><i class="fas fa-plus-circle"></i> Nuevo registro</button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="tableEducation">
                    <thead><tr><th>EDUCACIÓN</th><th style="width: 100px;">ACCIÓN</th></tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

        <!-- 2. Formación -->
        <div class="section-container">
            <div class="section-header">
                <h3 class="section-title" style="font-size: 16px;">FORMACIÓN</h3>
                <button class="btn-new-record" onclick="addSubsection('training')"><i class="fas fa-plus-circle"></i> Nuevo registro</button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="tableTraining">
                    <thead><tr><th>FORMACIÓN</th><th style="width: 100px;">ACCIÓN</th></tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

        <!-- 3. Experiencia -->
        <div class="section-container">
            <div class="section-header">
                <h3 class="section-title" style="font-size: 16px;">EXPERIENCIA</h3>
                <button class="btn-new-record" onclick="addSubsection('experience')"><i class="fas fa-plus-circle"></i> Nuevo registro</button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="tableExperience">
                    <thead><tr><th>EXPERIENCIA</th><th style="width: 100px;">ACCIÓN</th></tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

        <!-- 4. Profesiograma -->
        <div class="section-container">
            <div class="section-header">
                <h3 class="section-title" style="font-size: 16px;">PROFESIOGRAMA</h3>
                <button class="btn-new-record" onclick="addSubsection('profesiogram')"><i class="fas fa-plus-circle"></i> Nuevo registro</button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="tableProfesiogram">
                    <thead><tr><th>PROFESIOGRAMA</th><th style="width: 100px;">ACCIÓN</th></tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

        <!-- 5. Matriz de Competencias y Habilidades -->
        <div class="section-container">
            <div class="section-header">
                <h3 class="section-title" style="font-size: 16px;">MATRIZ DE COMPETENCIAS Y HABILIDADES</h3>
                <button class="btn-new-record" onclick="addSubsection('competence')"><i class="fas fa-plus-circle"></i> Nuevo registro</button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="tableCompetence">
                    <thead><tr><th>COMPETENCIA / HABILIDAD</th><th style="width: 100px;">ACCIÓN</th></tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

        <!-- 6. Perfil SST del Cargo -->
        <div class="section-container">
            <div class="section-header">
                <h3 class="section-title" style="font-size: 16px;">PERFIL SST DEL CARGO</h3>
            </div>
            
            <div style="margin-left: 15px; margin-bottom: 20px;">
                <div class="section-header" style="border-bottom: none; padding: 10px 0;">
                    <h4 style="margin: 0; color: #f7941d; font-size: 14px;">Identificación de Peligros y Riesgos</h4>
                    <button class="btn-new-record" onclick="addSubsection('sstRisk')" style="padding: 4px 10px;">+</button>
                </div>
                <div class="table-responsive">
                    <table class="modern-table" id="tableSstRisk">
                        <thead><tr><th>PELIGROS Y RIESGOS</th><th style="width: 100px;">ACCIÓN</th></tr></thead>
                        <tbody></tbody>
                    </table>
                </div>

                <div class="section-header" style="border-bottom: none; padding: 10px 0; margin-top: 20px;">
                    <h4 style="margin: 0; color: #f7941d; font-size: 14px;">Responsabilidades SST</h4>
                    <button class="btn-new-record" onclick="addSubsection('sstResp')" style="padding: 4px 10px;">+</button>
                </div>
                <div class="table-responsive">
                    <table class="modern-table" id="tableSstResp">
                        <thead><tr><th>RESPONSABILIDAD SST</th><th style="width: 100px;">ACCIÓN</th></tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 7. Elementos de Protección Personal -->
        <div class="section-container" style="border-bottom: none;">
            <div class="section-header">
                <h3 class="section-title" style="font-size: 16px;">ELEMENTOS DE PROTECCIÓN PERSONAL</h3>
                <button class="btn-new-record" onclick="addSubsection('epp')"><i class="fas fa-plus-circle"></i> Nuevo registro</button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="tableEpp">
                    <thead><tr><th>ELEMENTOS DE PROTECCIÓN PERSONAL</th><th style="width: 100px;">ACCIÓN</th></tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>

</div>

<script type="module" src="../hacer/profile/profileList.js?v=1.0"></script>
