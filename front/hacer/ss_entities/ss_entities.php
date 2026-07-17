<link rel="stylesheet" href="../hacer/ss_entities/ss_entities.css?v=1.0">
<link rel="stylesheet" href="../styles/colors.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- List View Header -->
<div id="listHeader" class="page-header">
    <h1 class="page-title">GESTIÓN DE ENTIDADES SS</h1>
    <div class="breadcrumbs">Hacer > Gestion Documentacion > Gestión de Talento Humano > Entidades SS</div>
</div>

<!-- List View -->
<div id="listView" class="content-card">
    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
        <button class="btn-new-record" onclick="showFormView()">
            <i class="fas fa-plus"></i> Nueva Entidad
        </button>
    </div>

    <!-- Table -->
    <div class="table-container">
        <table class="exams-table" id="dataTable">
            <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Nombre</th>
                    <th style="text-align: center; width: 150px;">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JS -->
            </tbody>
        </table>
    </div>
</div>

<!-- Create/Edit View -->
<div id="formView" class="content-card" style="display: none;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
        <h2 class="section-title" style="margin: 0; font-size: 1.2rem; color: var(--fondo);" id="formTitle">NUEVA ENTIDAD</h2>
        <div style="display: flex; gap: 10px;">
            <button type="button" class="btn-secondary-premium" onclick="hideFormView()"><i class="fas fa-times"></i> Cancelar</button>
            <button type="button" class="btn-new-record" onclick="saveEntity()">
                <i class="fas fa-save"></i> Guardar
            </button>
        </div>
    </div>

    <form id="entityForm">
        <input type="hidden" id="fieldId" name="idEntity">
        
        <div class="grid-2" style="column-gap: 20px;">
            <div class="form-group">
                <label class="form-label">Tipo de Entidad</label>
                <select id="fieldTipo" name="tipo" class="form-input" style="height: 35px;" required>
                    <option value="">Seleccione...</option>
                    <option value="EPS">EPS</option>
                    <option value="ARL">ARL</option>
                    <option value="AFP">AFP</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Nombre</label>
                <input type="text" id="fieldNombre" name="nombre" class="form-input" required>
            </div>
        </div>
    </form>
</div>

<script type="module" src="../hacer/ss_entities/ss_entities.js?v=<?= time() ?>"></script>
