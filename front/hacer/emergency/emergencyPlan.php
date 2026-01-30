<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plan de Emergencia</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../hacer/emergency/emergencyPlan.css">
    <link rel="stylesheet" href="../styles/colors.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>

<div class="emergency-container">
    <div class="emergency-header">
        <div class="header-title">PLAN DE EMERGENCIAS Y CONTINGENCIAS</div>
        <!-- User info could go here -->
    </div>

    <!-- List View -->
    <div id="emergencyListView" class="content-card">
        <div class="emergency-toolbar">
            <h2 class="section-title" style="border: none; margin: 0;">Lista de Documentos</h2>
            <button class="btn-new-record" onclick="showCreateEmergency()">
                <i class="fas fa-plus-circle"></i> Nuevo Plan
            </button>
        </div>

        <table class="emergency-table">
            <thead>
                <tr>
                    <th style="width: 80px;">Accion</th>
                    <th>Nombre Documento</th>
                    <th>Fecha Creacion</th>
                    <th style="width: 100px; text-align: center;">Descargar</th>
                </tr>
            </thead>
            <tbody id="emergencyTableBody">
                <!-- Content -->
            </tbody>
        </table>
    </div>

    <!-- Create View -->
    <div id="emergencyCreateView" class="content-card" style="display: none;">
        <h2 class="section-title">Nuevo Registro</h2>
        <form id="emergencyForm">
            <div class="form-group">
                <label class="form-label">Nombre del Plan</label>
                <input type="text" id="planName" class="form-input" placeholder="Nombre descriptivo del documento">
            </div>

            <div class="form-group">
                <label class="form-label">Fecha de Creación</label>
                <input type="date" id="planDate" class="form-input">
            </div>

            <div class="form-group">
                <label class="form-label">Cargar archivo</label>
                <div class="file-upload-wrapper">
                    <input type="file" id="planFile" class="file-upload-input" onchange="updateFileName(this)">
                    <div class="file-upload-content">
                        <i class="fas fa-cloud-upload-alt file-upload-icon"></i>
                        <div class="file-upload-text">Haz clic o arrastra un archivo aquí</div>
                        <div class="file-upload-hint">Formatos soportados: PDF, XLS, DOC</div>
                        <div id="fileNameDisplay" class="file-upload-filename"></div>
                    </div>
                </div>
            </div>

            <div style="margin-top: 20px;">
                <button type="button" class="btn-secondary-premium" onclick="hideCreateEmergency()"><i class="fas fa-arrow-left"></i> Volver</button>
                <button type="button" class="btn-new-record" onclick="saveEmergency()"><i class="fas fa-save"></i> Guardar</button>
            </div>
        </form>
    </div>
</div>

<script src="../hacer/emergency/emergencyPlan.js"></script>
<script>
    if(typeof initEmergency === 'function') {
        initEmergency();
    } else {
        setTimeout(() => { if(typeof initEmergency === 'function') initEmergency(); }, 500);
    }
</script>

</body>
</html>
