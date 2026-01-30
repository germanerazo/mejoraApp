<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registros de Capacitaciones</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Using relative path to same directory CSS -->
    <link rel="stylesheet" href="../planear/training/trainingPlan.css">
    <link rel="stylesheet" href="../styles/colors.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>

<div class="training-container">
    <div class="training-header">
        <div class="header-title">REGISTROS DE CAPACITACIONES</div>
        <!-- User info could go here -->
    </div>

    <!-- List View -->
    <div id="trainingListView" class="content-card">
        <div class="training-toolbar">
            <h2 class="section-title" style="border: none; margin: 0;">Lista de Documentos</h2>
            <button class="btn-new-record" onclick="showCreateTraining()">
                <i class="fas fa-plus-circle"></i> Nuevo Registro
            </button>
        </div>

        <table class="training-table">
            <thead>
                <tr>
                    <th style="width: 80px;">Accion</th>
                    <th>Nombre Documento</th>
                    <th>Fecha</th>
                    <th style="width: 100px; text-align: center;">Descargar</th>
                </tr>
            </thead>
            <tbody id="trainingTableBody">
                <!-- Content -->
            </tbody>
        </table>
    </div>

    <!-- Create View -->
    <div id="trainingCreateView" class="content-card" style="display: none;">
        <h2 class="section-title">Nuevo Registro</h2>
        <form id="trainingForm">
            <div class="form-group">
                <label class="form-label">Nombre</label>
                <input type="text" id="trainingName" class="form-input" placeholder="Nombre de la capacitación">
            </div>

            <div class="form-group">
                <label class="form-label">Fecha</label>
                <input type="date" id="trainingDate" class="form-input">
            </div>

            <div class="form-group">
                <label class="form-label">Cargar archivo</label>
                <div class="file-upload-wrapper">
                    <input type="file" id="trainingFile" class="file-upload-input" onchange="updateTrainingFileName(this)">
                    <div class="file-upload-content">
                        <i class="fas fa-cloud-upload-alt file-upload-icon"></i>
                        <div class="file-upload-text">Haz clic o arrastra un archivo aquí</div>
                        <div class="file-upload-hint">Formatos soportados: PDF, XLS, DOC</div>
                        <div id="trainingFileNameDisplay" class="file-upload-filename"></div>
                    </div>
                </div>
            </div>

            <div style="margin-top: 20px;">
                <button type="button" class="btn-secondary-premium" onclick="hideCreateTraining()"><i class="fas fa-arrow-left"></i> Volver</button>
                <button type="button" class="btn-new-record" onclick="saveTraining()"><i class="fas fa-save"></i> Guardar</button>
            </div>
        </form>
    </div>
</div>

<script src="../planear/training/trainingPlan.js"></script>
<script>
    if(typeof initTraining === 'function') {
        initTraining();
    } else {
        setTimeout(() => { if(typeof initTraining === 'function') initTraining(); }, 500);
    }
</script>

</body>
</html>
