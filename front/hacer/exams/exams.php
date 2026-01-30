<link rel="stylesheet" href="../hacer/exams/exams.css?v=1.0">
<link rel="stylesheet" href="../styles/colors.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- List View Header -->
<div id="examsListHeader" class="page-header">
    <h1 class="page-title">GENERACIÓN DE EXÁMENES MÉDICOS</h1>
    <div class="breadcrumbs">Hacer > Gestion Documentacion > Gestión de Talento Humano > Examenes Medicos</div>
</div>

<!-- List View -->
<div id="examsListView" class="content-card">
    <!-- Filter Section -->
    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
        <input type="text" id="filterSearch" class="form-input" placeholder="Buscar por Nombre o Cédula..." style="width: 300px;">
        <button class="btn-filter-premium" onclick="filterEmployees()">
            <i class="fas fa-search"></i> Buscar
        </button>
    </div>

    <!-- Table -->
    <div class="table-container">
        <table class="exams-table" id="tableExams">
            <thead>
                <tr>
                    <th>Nro. Identificación</th>
                    <th>Nombre</th>
                    <th>Cargo</th>
                    <th>Fecha de Ingreso</th>
                    <th style="text-align: center;">Generar Examen</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JS -->
            </tbody>
        </table>
    </div>
</div>

<!-- Create/Edit View -->
<div id="examsCreateView" class="content-card" style="display: none;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
        <h2 class="section-title" style="margin: 0; font-size: 1.2rem; color: var(--fondo);">REGISTRAR EXAMEN MÉDICO</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-secondary-premium" onclick="hideCreateExam()"><i class="fas fa-times"></i> Cancelar</button>
            <button class="btn-new-record" onclick="generateDocument()">
                <i class="fas fa-file-medical"></i> Generar Examen
            </button>
        </div>
    </div>

    <form id="examsForm">
        <div style="margin-bottom: 20px; font-weight: bold; font-size: 1.1rem; color: var(--color6);">
            Empresa: DINAMIK ZONA FRANCA S.A.S
        </div>

        <div class="grid-3" style="column-gap: 20px;">
            <div class="form-group">
                <label class="form-label">Fecha del Examen</label>
                <input type="date" id="fieldDate" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Cargo</label>
                <input type="text" id="fieldPosition" class="form-input">
            </div>
            <!-- Hidden context -->
            <input type="hidden" id="fieldEmployeeName">
            <input type="hidden" id="fieldType">

            <div class="form-group">
                <label class="form-label">Nombre IPS</label>
                <input type="text" id="fieldEntity" class="form-input" value="IPS SALUD OCUPACIONAL">
            </div>
            <div class="form-group">
                <label class="form-label">Teléfono IPS</label>
                <input type="text" id="fieldEntityPhone" class="form-input" value="601-1234567">
            </div>
            <div class="form-group">
                <label class="form-label">Dirección IPS</label>
                <input type="text" id="fieldEntityAddress" class="form-input" value="Calle 100 # 15-20">
            </div>
        </div>
    </form>
</div>

<!-- Print View (Hidden) -->
<div id="examsPrintView" class="content-card" style="display: none;">
    <div class="print-actions">
        <button class="btn-secondary-premium" onclick="hidePrintView()"><i class="fas fa-arrow-left"></i> Volver</button>
        <button class="btn-new-record" onclick="printExam()">Imprimir</button>
    </div>

    <div class="print-document" id="printContent">
        <div class="print-header" style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <!-- Logo -->
                <div style="width: 200px;">
                    <img src="https://sig.prevencionmas.com/logo/96-LOGO%20DINAMIK%20.jpg" style="max-width: 100%; height: auto;" alt="Logo Empresa">
                </div>
                
                <!-- Info -->
                <div style="text-align: right; font-size: 0.9rem;">
                    <div style="font-weight: bold; font-size: 1.1rem;">DINAMIK ZONA FRANCA S.A.S</div>
                    <div>NIT: 900.000.000-1</div> <!-- Keeping placeholder NIT unless seen in screenshot, assume placeholder for now or generic -->
                    <div id="printCityDate" style="margin-top: 5px;">Bogotá, 2024-01-01</div>
                </div>
            </div>
            
            <div style="margin-top: 30px; font-weight: bold; font-size: 1.4rem; border: 1px solid #000; padding: 10px; display: inline-block;">ORDEN DE SERVICIO <br> EXAMEN MÉDICO OCUPACIONAL</div>
        </div>

        <div class="print-body" style="font-size: 14px; line-height: 1.6;">
            <p>Señores:</p>
            <p style="margin-bottom: 5px;"><strong id="printEntity" style="font-size: 1.1rem;">IPS SALUD OCUPACIONAL</strong></p>
            <p style="margin: 0;">Tel: <span id="printEntityPhone"></span></p>
            <p style="margin: 0;">Dir: <span id="printEntityAddress"></span></p>
            
            <p style="margin-top: 20px;">
                Por medio de la presente solicitamos autorizar la realización del Examen Médico Ocupacional de 
                <strong style="text-transform: uppercase;" id="printType">INGRESO</strong> al colaborador:
            </p>

            <div style="border: 1px solid #000; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #000; border-right: 1px solid #000; font-weight: bold; width: 120px;">NOMBRE:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #000;" id="printName">Nombre del Empleado</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #000; border-right: 1px solid #000; font-weight: bold;">DOCUMENTO:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #000;" id="printId">1.098.765.432</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-right: 1px solid #000; font-weight: bold;">CARGO:</td>
                        <td style="padding: 10px;" id="printPosition">Cargo del Empleado</td>
                    </tr>
                </table>
            </div>

            <p>Agradecemos la atención prestada.</p>

            <div style="margin-top: 100px; display: flex; justify-content: space-between;">
                <div style="width: 250px; border-top: 1px solid #000; padding-top: 5px; text-align: center;">
                    Firma Autorizada
                </div>
                <div style="width: 250px; border-top: 1px solid #000; padding-top: 5px; text-align: center;">
                    Firma del Trabajador
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module" src="../hacer/exams/exams.js?v=1.0"></script>
