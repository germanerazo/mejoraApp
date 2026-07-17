<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Programa de Gestión</title>
    <!-- Common CSS -->
    <link rel="stylesheet" href="../styles/colors.css">
    <link rel="stylesheet" href="../planear/risk/risk.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<style>
    /* Modal Styles */
    .danger-modal-overlay {
        display: none;
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        justify-content: center;
        align-items: center;
    }
    .danger-modal {
        background: #fff;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        animation: slideInDown 0.3s ease-out;
    }
    .danger-modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .danger-modal-title {
        margin: 0;
        font-size: 1.25rem;
        color: #2c3e50;
    }
    .danger-modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #7f8c8d;
    }
    .danger-modal-search {
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
    }
    .danger-modal-search input {
        width: 100%;
        padding: 10px 15px;
        border: 1px solid #dcdde1;
        border-radius: 6px;
        font-size: 1rem;
        outline: none;
    }
    .danger-modal-search input:focus {
        border-color: #329bd6;
    }
    .danger-modal-list {
        padding: 0;
        margin: 0;
        list-style: none;
        overflow-y: auto;
        flex: 1;
    }
    .danger-list-item {
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background 0.2s;
    }
    .danger-list-item:hover {
        background: #f8f9fa;
    }
    .danger-item-info strong {
        display: block;
        color: #2c3e50;
        margin-bottom: 4px;
    }
    .danger-item-info span {
        display: block;
        color: #7f8c8d;
        font-size: 0.85rem;
    }
    .danger-item-btn {
        background: #329bd6;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
    }
    .danger-item-btn:hover {
        background: #2780b3;
    }
</style>
<body>

    <div class="page-header">
        <h1 class="page-title" id="programTitle">PROGRAMA DE GESTIÓN</h1>
        <div class="breadcrumbs">Planear > Gestión de Riesgos > Consolidación > Programa de Gestión</div>
    </div>

    <!-- Content Card -->
    <div class="content-card">
        <!-- Objetivo Section -->
        <div class="form-section" style="margin-bottom: 25px;">
            <h3 class="section-subtitle">Objetivo</h3>
            <textarea id="objetivo" class="form-textarea" rows="4" placeholder="Descripción del objetivo del programa..."></textarea>
        </div>

        <!-- Marco Legal Section -->
        <div class="form-section" style="margin-bottom: 25px;">
            <h3 class="section-subtitle">Marco Legal Regulatorio</h3>
            <textarea id="marcoLegal" class="form-textarea" rows="3" placeholder="Normatividad aplicable..."></textarea>
        </div>

        <!-- Peligros Asociados Section -->
        <div class="form-section" style="margin-bottom: 25px;">
            <h3 class="section-subtitle">Peligros Asociados</h3>
            <div id="peligrosContainer" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                <!-- Populated by JS -->
            </div>
            <button class="btn-new-record" onclick="addPeligro()" style="padding: 6px 12px;">
                <i class="fas fa-plus"></i> Agregar Peligro
            </button>
        </div>

        <!-- Indicadores de Gestión Section -->
        <div class="form-section" style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 class="section-subtitle" style="margin: 0;">Indicadores de Gestión</h3>
                <button class="btn-new-record" onclick="addIndicador()">
                    <i class="fas fa-plus"></i> Nuevo Registro
                </button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="indicadoresTable">
                    <thead>
                        <tr>
                            <th style="width: 80px;">Acción</th>
                            <th style="width: 250px;">Descripción de Fórmula</th>
                            <th style="width: 120px;">Límite Esperado</th>
                            <th style="width: 120px;">Límite Crítico</th>
                            <th style="width: 150px;">Fuente de Información</th>
                            <th style="width: 120px;">Periodicidad</th>
                            <th style="width: 150px;">Dirigido A</th>
                        </tr>
                    </thead>
                    <tbody id="indicadoresBody">
                        <!-- Populated by JS -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Medidas de Prevención y Control Section -->
        <div class="form-section" style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 class="section-subtitle" style="margin: 0;">Medidas de Prevención y Control</h3>
                <button class="btn-new-record" onclick="addMedida()">
                    <i class="fas fa-plus"></i> Nuevo Registro
                </button>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="medidasTable">
                    <thead>
                        <tr>
                            <th style="width: 80px;">Acción</th>
                            <th style="width: 300px;">Medidas de Prevención y Control</th>
                            <th style="width: 150px;">Responsable</th>
                            <th style="width: 120px;">Recurso</th>
                            <th style="width: 150px;">Fecha de Planeación</th>
                            <th style="width: 150px;">Cargos Dirigidos</th>
                        </tr>
                    </thead>
                    <tbody id="medidasBody">
                        <!-- Populated by JS -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; justify-content: center; gap: 15px; margin-top: 30px;">
            <button class="btn-new-record" onclick="savePrograma()" style="padding: 12px 30px;">
                <i class="fas fa-save"></i> Guardar
            </button>
            <button class="btn-secondary-premium" onclick="goBackToConsolidation()" style="padding: 12px 30px;">
                <i class="fas fa-arrow-left"></i> Volver
            </button>
        </div>
    </div>

    <!-- Danger Search Modal -->
    <div id="dangerModal" class="danger-modal-overlay">
        <div class="danger-modal">
            <div class="danger-modal-header">
                <h3 class="danger-modal-title">Seleccionar Peligro</h3>
                <button class="danger-modal-close" onclick="closeDangerModal()">&times;</button>
            </div>
            <div class="danger-modal-search">
                <input type="text" id="dangerSearchInput" placeholder="Buscar por nombre o tipo..." onkeyup="filterDangers()">
            </div>
            <ul id="dangerModalList" class="danger-modal-list">
                <!-- Populated via JS -->
            </ul>
        </div>
    </div>

    <!-- Script -->
    <script type="module" src="../planear/riskConsolidation/riskActions.js?v=<?= time() ?>"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>