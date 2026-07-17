<!-- CSS Import -->
<link rel="stylesheet" href="../hacer/entry/entry.css?v=1.0">

<!-- List View Header -->
<div id="entryListHeader" class="page-header">
    <h1 class="page-title">BUSQUEDA DE EMPLEADOS</h1>
    <div class="breadcrumbs">Hacer > Gestion Documentacion > Gestión de Talento Humano > Busqueda</div>
</div>

<!-- List View -->
<div id="entryListView" class="content-card">
    <!-- Filter Section -->
    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
        <input type="text" id="filterName" class="form-input" placeholder="Nombre..." style="width: 200px;">
        <input type="text" id="filterId" class="form-input" placeholder="Nro Identificación..." style="width: 150px;">
        <button class="btn-filter-premium" onclick="filterEntry()">
            <i class="fas fa-filter"></i> Filtrar
        </button>
        <div style="flex: 1;"></div>
        <button class="btn-secondary" onclick="showSociodemographicProfile()">Perfil Sociodemografico</button>
        <button class="btn-new-record" onclick="showCreateEntry()">
            <i class="fas fa-user-plus"></i> Nuevo Empleado
        </button>
    </div>

    <!-- Table -->
    <div class="table-container">
        <table class="entry-table" id="tableEntry">
            <thead>
                <tr>
                    <th>Nro. Identificacion</th>
                    <th>Codigo</th>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Fecha de Ingreso</th>
                    <th style="text-align: center;">Ver</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JS -->
            </tbody>
        </table>
    </div>
</div>

<!-- Graph View -->
<div id="entryGraphView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">PERFIL SOCIODEMOGRÁFICO</h2>
        <button class="btn-secondary-premium" onclick="hideSociodemographicProfile()"><i class="fas fa-arrow-left"></i> Volver</button>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px;">
        <div style="background: white; padding: 10px; border-radius: 8px; border: 1px solid #eee; height: 300px;">
            <div style="font-weight: bold; text-align: center; margin-bottom: 10px;">Rangos de Edad</div>
            <div style="height: 250px;"><canvas id="ageChart"></canvas></div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 8px; border: 1px solid #eee; height: 300px;">
            <div style="font-weight: bold; text-align: center; margin-bottom: 10px;">Distribución por Sexo</div>
            <div style="height: 250px;"><canvas id="sexChart"></canvas></div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 8px; border: 1px solid #eee; height: 300px;">
            <div style="font-weight: bold; text-align: center; margin-bottom: 10px;">Estado Civil</div>
            <div style="height: 250px;"><canvas id="civilStatusChart"></canvas></div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 8px; border: 1px solid #eee; height: 300px;">
            <div style="font-weight: bold; text-align: center; margin-bottom: 10px;">Nivel de Escolaridad</div>
            <div style="height: 250px;"><canvas id="educationChart"></canvas></div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 8px; border: 1px solid #eee; height: 300px;">
            <div style="font-weight: bold; text-align: center; margin-bottom: 10px;">Personas a Cargo</div>
            <div style="height: 250px;"><canvas id="dependentsChart"></canvas></div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 8px; border: 1px solid #eee; height: 300px;">
            <div style="font-weight: bold; text-align: center; margin-bottom: 10px;">Cabeza de Familia</div>
            <div style="height: 250px;"><canvas id="headHouseholdChart"></canvas></div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 8px; border: 1px solid #eee; height: 300px;">
            <div style="font-weight: bold; text-align: center; margin-bottom: 10px;">Número de Hijos</div>
            <div style="height: 250px;"><canvas id="childrenChart"></canvas></div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 8px; border: 1px solid #eee; height: 300px;">
            <div style="font-weight: bold; text-align: center; margin-bottom: 10px;">Grupo Étnico</div>
            <div style="height: 250px;"><canvas id="ethnicityChart"></canvas></div>
        </div>
    </div>
</div>

<!-- Create/Edit View -->
<div id="entryCreateView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">MEDICINA PREVENTIVA DEL TRABAJO</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-new-record" onclick="saveEntry()"><i class="fas fa-save"></i> Guardar</button>
            <button class="btn-secondary-premium" onclick="hideCreateEntry()"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
    </div>

    <div class="form-container">
        <form id="entryForm">
            <!-- 1. Información Personal -->
            <div class="form-section-title">1. INFORMACIÓN PERSONAL</div>
            <div class="grid-3">
                <div class="form-group">
                    <label class="form-label">Fecha de Ingreso</label>
                    <input type="date" id="fieldEntryDate" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Fecha Nacimiento</label>
                    <input type="date" id="fieldBirthDate" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Lugar de Nacimiento</label>
                    <input type="text" id="fieldBirthPlace" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Nro. Identificación</label>
                    <input type="text" id="fieldIdNum" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Sexo</label>
                    <select id="fieldSex" class="form-input" style="height: 35px;">
                        <option value="">Seleccione...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Nombre y Apellido</label>
                    <input type="text" id="fieldName" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Estado Civil</label>
                    <select id="fieldCivilStatus" class="form-input" style="height: 35px;">
                        <option value="">Seleccione...</option>
                        <option value="Soltero">Soltero</option>
                        <option value="Casado">Casado</option>
                        <option value="Union Libre">Unión Libre</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">RH</label>
                    <input type="text" id="fieldRH" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Grado de Escolaridad</label>
                    <select id="fieldEducation" class="form-input" style="height: 35px;">
                        <option value="">Seleccione...</option>
                        <option value="Primaria">Primaria</option>
                        <option value="Secundaria">Secundaria</option>
                        <option value="Tecnico">Tecnico</option>
                        <option value="Tecnologo">Tecnologo</option>
                        <option value="Profesional">Profesional</option>
                        <option value="Posgrado">Posgrado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Teléfono</label>
                    <input type="text" id="fieldPhone" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Salario</label>
                    <input type="number" id="fieldSalary" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Estrato</label>
                    <input type="number" id="fieldStratum" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Personas a Cargo</label>
                    <input type="number" id="fieldDependents" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Cabeza de Familia</label>
                    <select id="fieldHeadHousehold" class="form-input" style="height: 35px;">
                        <option value="">Seleccione...</option>
                        <option value="SI">SI</option>
                        <option value="NO">NO</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Número de Hijos</label>
                    <input type="number" id="fieldChildren" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Grupo Étnico</label>
                    <select id="fieldEthnicity" class="form-input" style="height: 35px;">
                        <option value="Ninguno">Ninguno</option>
                        <option value="Afrocolombiano">Afrocolombiano</option>
                        <option value="Indígena">Indígena</option>
                        <option value="Raizal">Raizal</option>
                        <option value="Palenquero">Palenquero</option>
                        <option value="Gitano">Gitano</option>
                    </select>
                </div>
            </div>

            <!-- 2. Información Laboral -->
            <div class="form-section-title">2. INFORMACIÓN LABORAL</div>
            <div class="grid-3">
                <div class="form-group">
                    <label class="form-label">Cargo</label>
                    <input type="text" id="fieldPosition" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Horario de Trabajo</label>
                    <select id="fieldSchedule" class="form-input" style="height: 35px;">
                        <option value="">Seleccione...</option>
                        <option value="Diurno">Diurno</option>
                        <option value="Nocturno">Nocturno</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">EPS</label>
                    <select id="fieldEPS" class="form-input" style="height: 35px;">
                        <option value="">Seleccione...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">ARL</label>
                    <select id="fieldARL" class="form-input" style="height: 35px;">
                        <option value="">Seleccione...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">AFP</label>
                    <select id="fieldAFP" class="form-input" style="height: 35px;">
                        <option value="">Seleccione...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Estado</label>
                    <select id="fieldStatus" class="form-input" style="height: 35px;">
                        <option value="Activo">ACTIVO</option>
                        <option value="Inactivo">INACTIVO</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Fecha de Retiro</label>
                    <input type="date" id="fieldWithdrawalDate" class="form-input">
                </div>
            </div>

            <!-- 3. Contacto Emergencia -->
            <div class="form-section-title">3. CONTACTO EMERGENCIA</div>
            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Nombre y Apellido</label>
                    <input type="text" id="fieldEmergName" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Teléfono</label>
                    <input type="text" id="fieldEmergPhone" class="form-input">
                </div>
            </div>

            <!-- Medical Sections (Hidden initially) -->
            <div id="medicalSections" style="display: none;">
                <!-- 4. Registros Médicos -->
                <div class="form-section-title">4. REGISTROS MÉDICOS</div>
                <div class="form-group">
                    <label class="form-label">Alergias</label>
                    <textarea id="fieldAllergies" class="form-input" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Examen Médico Ingreso</label>
                    <div style="background: #f9f9f9; padding: 15px; border: 1px solid #eee; border-radius: 4px;">
                        <div class="grid-3" style="margin-bottom: 10px; align-items: start;">
                            <div>
                                <label style="font-size: 0.85em; display: block; margin-bottom: 3px;">Fecha Examen</label>
                                <input type="date" id="fieldExamDate" class="form-input" style="font-size: 13px;">
                            </div>
                            <div style="grid-column: span 2;">
                                <label style="font-size: 0.85em; display: block; margin-bottom: 3px;">Archivo (PDF, Imagen)</label>
                                <div style="display: flex; gap: 10px; align-items: flex-start;">
                                    <div class="eval-upload-area" style="flex: 1; margin-bottom: 0;">
                                        <input type="file" id="fieldExamFile" style="display:none;" onchange="handleFileUI(this, 'previewExamFile', 'nameExamFile', 'placeholderExamFile')">
                                        <div class="eval-upload-placeholder" id="placeholderExamFile" onclick="document.getElementById('fieldExamFile').click()" style="padding: 10px;">
                                            <i class="fas fa-cloud-upload-alt eval-upload-icon" style="font-size: 1.5rem; margin-bottom: 5px;"></i>
                                            <p class="eval-upload-text" style="font-size: 0.8rem;">Arrastra aquí o <span class="eval-upload-link">haz clic</span></p>
                                        </div>
                                        <div class="eval-file-preview" id="previewExamFile" style="display:none; padding: 10px;">
                                            <div class="eval-file-info" style="gap: 10px;">
                                                <i class="fas fa-file-alt eval-file-icon" style="font-size: 1.5rem;"></i>
                                                <p class="eval-file-name" id="nameExamFile" style="font-size: 0.8rem;"></p>
                                            </div>
                                            <button type="button" class="eval-file-remove" style="width: 24px; height: 24px;" onclick="clearFileUI('fieldExamFile', 'previewExamFile', 'placeholderExamFile')">
                                                <i class="fas fa-times" style="font-size: 0.7rem;"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <button type="button" class="btn-new-record" onclick="addMedicalExam()" style="padding: 8px 12px; font-size: 13px; height: fit-content; align-self: center;">
                                        <i class="fas fa-upload"></i> Cargar
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <table class="recommendations-table" id="tableExams">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Archivo</th>
                                    <th style="width: 50px;"></th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>

                <!-- 5. Recomendaciones -->
                <div class="form-section-title">5. RECOMENDACIONES MÉDICAS</div>
                <div style="margin-bottom: 10px;">
                    <button type="button" class="btn-secondary" onclick="showRecommendationModal()">+ Agregar Recomendación</button>
                </div>
                <table class="recommendations-table" id="recoTable">
                    <thead>
                        <tr>
                            <th style="width: 150px;">Fecha</th>
                            <th>Recomendación</th>
                            <th>Seguimiento</th>
                            <th style="width: 100px;">Estado</th>
                            <th style="width: 50px;"></th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>

                <!-- 6. Restricciones -->
                <div class="form-section-title">6. RESTRICCIONES MÉDICAS</div>
                <div style="margin-bottom: 10px;">
                    <button type="button" class="btn-secondary" onclick="showRestricModal()">+ Agregar Restricción</button>
                </div>
                <table class="recommendations-table" id="restricTable">
                    <thead>
                        <tr>
                            <th style="width: 150px;">Fecha</th>
                            <th>Restricción</th>
                            <th>Seguimiento</th>
                            <th style="width: 100px;">Estado</th>
                            <th style="width: 50px;"></th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>

                <!-- 7. Exámenes Periódicos -->
                <div class="form-section-title">7. EXÁMENES PERIÓDICOS</div>
                <div style="background: #f9f9f9; padding: 15px; border: 1px solid #eee; border-radius: 4px;">
                    <div class="grid-3" style="margin-bottom: 10px; align-items: start;">
                        <div>
                            <label style="font-size: 0.85em; display: block; margin-bottom: 3px;">Fecha Examen</label>
                            <input type="date" id="fieldPeriodicDate" class="form-input" style="font-size: 13px;">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="font-size: 0.85em; display: block; margin-bottom: 3px;">Archivo (PDF, Imagen)</label>
                            <div style="display: flex; gap: 10px; align-items: flex-start;">
                                <div class="eval-upload-area" style="flex: 1; margin-bottom: 0;">
                                    <input type="file" id="fieldPeriodicFile" style="display:none;" onchange="handleFileUI(this, 'previewPeriodicFile', 'namePeriodicFile', 'placeholderPeriodicFile')">
                                    <div class="eval-upload-placeholder" id="placeholderPeriodicFile" onclick="document.getElementById('fieldPeriodicFile').click()" style="padding: 10px;">
                                        <i class="fas fa-cloud-upload-alt eval-upload-icon" style="font-size: 1.5rem; margin-bottom: 5px;"></i>
                                        <p class="eval-upload-text" style="font-size: 0.8rem;">Arrastra aquí o <span class="eval-upload-link">haz clic</span></p>
                                    </div>
                                    <div class="eval-file-preview" id="previewPeriodicFile" style="display:none; padding: 10px;">
                                        <div class="eval-file-info" style="gap: 10px;">
                                            <i class="fas fa-file-alt eval-file-icon" style="font-size: 1.5rem;"></i>
                                            <p class="eval-file-name" id="namePeriodicFile" style="font-size: 0.8rem;"></p>
                                        </div>
                                        <button type="button" class="eval-file-remove" style="width: 24px; height: 24px;" onclick="clearFileUI('fieldPeriodicFile', 'previewPeriodicFile', 'placeholderPeriodicFile')">
                                            <i class="fas fa-times" style="font-size: 0.7rem;"></i>
                                        </button>
                                    </div>
                                </div>
                                <button type="button" class="btn-new-record" onclick="addPeriodicExam()" style="padding: 8px 12px; font-size: 13px; height: fit-content; align-self: center;">
                                    <i class="fas fa-upload"></i> Cargar
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <table class="recommendations-table" id="tablePeriodicExams">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Archivo</th>
                                <th style="width: 50px;"></th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>

                <!-- 8. Recomendaciones Médicas Periódicas -->
                <div class="form-section-title">8. RECOMENDACIONES PERIÓDICAS</div>
                <div style="text-align: right; margin-bottom: 10px;">
                    <button type="button" class="btn-new-record" onclick="showPeriodicRecoModal()">+ Agregar Recomendación</button>
                </div>
                
                <table class="recommendations-table" id="periodicRecoTable">
                    <thead>
                        <tr>
                            <th style="width: 150px;">Fecha</th>
                            <th>Recomendación</th>
                            <th>Seguimiento</th>
                            <th style="width: 100px;">Estado</th>
                            <th style="width: 50px;"></th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>

                <!-- 9. Restricciones Médicas Periódicas -->
                <div class="form-section-title">9. RESTRICCIONES PERIÓDICAS</div>
                <div style="text-align: right; margin-bottom: 10px;">
                    <button type="button" class="btn-new-record" onclick="showPeriodicRestricModal()">+ Agregar Restricción</button>
                </div>
                
                <table class="recommendations-table" id="periodicRestricTable">
                    <thead>
                        <tr>
                            <th style="width: 150px;">Fecha</th>
                            <th>Restricción</th>
                            <th>Seguimiento</th>
                            <th style="width: 100px;">Estado</th>
                            <th style="width: 50px;"></th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>

                <!-- 10. Examen Médico de Retiro -->
                <div class="form-section-title">10. EXÁMEN MÉDICO DE RETIRO</div>
                <div style="background: #f9f9f9; padding: 15px; border: 1px solid #eee; border-radius: 4px;">
                    <div class="grid-3" style="margin-bottom: 10px; align-items: start;">
                        <div>
                            <label style="font-size: 0.85em; display: block; margin-bottom: 3px;">Fecha Examen</label>
                            <input type="date" id="fieldRetirementDate" class="form-input" style="font-size: 13px;">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="font-size: 0.85em; display: block; margin-bottom: 3px;">Archivo (PDF, Imagen)</label>
                            <div style="display: flex; gap: 10px; align-items: flex-start;">
                                <div class="eval-upload-area" style="flex: 1; margin-bottom: 0;">
                                    <input type="file" id="fieldRetirementFile" style="display:none;" onchange="handleFileUI(this, 'previewRetirementFile', 'nameRetirementFile', 'placeholderRetirementFile')">
                                    <div class="eval-upload-placeholder" id="placeholderRetirementFile" onclick="document.getElementById('fieldRetirementFile').click()" style="padding: 10px;">
                                        <i class="fas fa-cloud-upload-alt eval-upload-icon" style="font-size: 1.5rem; margin-bottom: 5px;"></i>
                                        <p class="eval-upload-text" style="font-size: 0.8rem;">Arrastra aquí o <span class="eval-upload-link">haz clic</span></p>
                                    </div>
                                    <div class="eval-file-preview" id="previewRetirementFile" style="display:none; padding: 10px;">
                                        <div class="eval-file-info" style="gap: 10px;">
                                            <i class="fas fa-file-alt eval-file-icon" style="font-size: 1.5rem;"></i>
                                            <p class="eval-file-name" id="nameRetirementFile" style="font-size: 0.8rem;"></p>
                                        </div>
                                        <button type="button" class="eval-file-remove" style="width: 24px; height: 24px;" onclick="clearFileUI('fieldRetirementFile', 'previewRetirementFile', 'placeholderRetirementFile')">
                                            <i class="fas fa-times" style="font-size: 0.7rem;"></i>
                                        </button>
                                    </div>
                                </div>
                                <button type="button" class="btn-new-record" onclick="addRetirementExam()" style="padding: 8px 12px; font-size: 13px; height: fit-content; align-self: center;">
                                    <i class="fas fa-upload"></i> Cargar
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <table class="recommendations-table" id="tableRetirementExam">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Archivo</th>
                                <th style="width: 50px;"></th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>

        </form>
    </div>
</div>

<!-- Recommendation Modal -->
<div id="recoModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
    <div class="modal-content" style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-width: 90%;">
        <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <h3 style="margin: 0; color: var(--fondo);">Nueva Recomendación</h3>
        </div>
        
        <div class="form-group">
            <label class="form-label">Fecha</label>
            <input type="date" id="modalRecoDate" class="form-input">
        </div>
            <div class="modal-form-group">
                <label>Recomendación</label>
                <textarea id="modalRecoText" rows="3" class="form-control"></textarea>
            </div>
            <div class="modal-form-group" id="grupoRecoFollowup" style="display: none;">
                <label>Seguimiento</label>
                <textarea id="modalRecoFollowup" rows="2" class="form-control" placeholder="Opcional"></textarea>
            </div>
        <div class="form-group">
            <label class="form-label">Estado</label>
            <select id="modalRecoStatus" class="form-input">
                <option value="Abierto">Abierto</option>
                <option value="Cerrado">Cerrado</option>
            </select>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button class="btn-secondary-premium" onclick="hideRecommendationModal()"><i class="fas fa-times"></i> Cancelar</button>
            <button class="btn-new-record" onclick="addRecommendationFromModal()">Guardar</button>
        </div>
    </div>
</div>

<!-- Restriction Modal -->
<div id="restricModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
    <div class="modal-content" style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-width: 90%;">
        <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <h3 style="margin: 0; color: var(--fondo);">Nueva Restricción</h3>
        </div>
        
        <div class="form-group">
            <label class="form-label">Fecha</label>
            <input type="date" id="modalRestricDate" class="form-input">
        </div>
            <div class="modal-form-group">
                <label>Restricción</label>
                <textarea id="modalRestricText" rows="3" class="form-control"></textarea>
            </div>
            <div class="modal-form-group" id="grupoRestricFollowup" style="display: none;">
                <label>Seguimiento</label>
                <textarea id="modalRestricFollowup" rows="2" class="form-control" placeholder="Opcional"></textarea>
            </div>
        <div class="form-group">
            <label class="form-label">Estado</label>
            <select id="modalRestricStatus" class="form-input">
                <option value="Abierto">Abierto</option>
                <option value="Cerrado">Cerrado</option>
            </select>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button class="btn-secondary-premium" onclick="hideRestricModal()"><i class="fas fa-times"></i> Cancelar</button>
            <button class="btn-new-record" onclick="addRestricFromModal()">Guardar</button>
        </div>
    </div>
</div>

<!-- Periodic Recommendation Modal -->
<div id="periodicRecoModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
    <div class="modal-content" style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-width: 90%;">
        <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <h3 style="margin: 0; color: var(--fondo);">Nueva Recomendación Periódica</h3>
        </div>
        
        <div class="form-group">
            <label class="form-label">Fecha</label>
            <input type="date" id="modalPeriodicRecoDate" class="form-input">
        </div>
            <div class="modal-form-group">
                <label>Recomendación</label>
                <textarea id="modalPeriodicRecoText" rows="3" class="form-control"></textarea>
            </div>
            <div class="modal-form-group" id="grupoPeriodicRecoFollowup" style="display: none;">
                <label>Seguimiento</label>
                <textarea id="modalPeriodicRecoFollowup" rows="2" class="form-control" placeholder="Opcional"></textarea>
            </div>
        <div class="form-group">
            <label class="form-label">Estado</label>
            <select id="modalPeriodicRecoStatus" class="form-input">
                <option value="Abierto">Abierto</option>
                <option value="Cerrado">Cerrado</option>
            </select>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button class="btn-secondary-premium" onclick="hidePeriodicRecoModal()"><i class="fas fa-times"></i> Cancelar</button>
            <button class="btn-new-record" onclick="addPeriodicRecoFromModal()">Guardar</button>
        </div>
    </div>
</div>

<!-- Periodic Restriction Modal -->
<div id="periodicRestricModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
    <div class="modal-content" style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-width: 90%;">
        <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <h3 style="margin: 0; color: var(--fondo);">Nueva Restricción Periódica</h3>
        </div>
        
        <div class="form-group">
            <label class="form-label">Fecha</label>
            <input type="date" id="modalPeriodicRestricDate" class="form-input">
        </div>
            <div class="modal-form-group">
                <label>Restricción</label>
                <textarea id="modalPeriodicRestricText" rows="3" class="form-control"></textarea>
            </div>
            <div class="modal-form-group" id="grupoPeriodicRestricFollowup" style="display: none;">
                <label>Seguimiento</label>
                <textarea id="modalPeriodicRestricFollowup" rows="2" class="form-control" placeholder="Opcional"></textarea>
            </div>
        <div class="form-group">
            <label class="form-label">Estado</label>
            <select id="modalPeriodicRestricStatus" class="form-input">
                <option value="Abierto">Abierto</option>
                <option value="Cerrado">Cerrado</option>
            </select>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button class="btn-secondary-premium" onclick="hidePeriodicRestricModal()"><i class="fas fa-times"></i> Cancelar</button>
            <button class="btn-new-record" onclick="addPeriodicRestricFromModal()">Guardar</button>
        </div>
    </div>
</div>

<div id="editFileModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
    <div class="modal-content" style="background: var(--color5); padding: 20px; border-radius: 8px; width: 90%; max-width: 400px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <h3 style="margin-top: 0; color: var(--color1);">Editar Archivo</h3>
        <div class="modal-body">
            <div class="modal-form-group">
                <label>Fecha Examen</label>
                <input type="date" id="modalEditFileDate" class="form-control">
            </div>
            <div class="modal-form-group">
                <label>Reemplazar Archivo <span style="font-size:0.8rem; color:#888;">(Opcional, esto eliminará el archivo viejo)</span></label>
                <div class="eval-upload-area" style="margin-bottom: 0;">
                    <input type="file" id="modalEditFile" style="display:none;" onchange="handleFileUI(this, 'previewEditFile', 'nameEditFile', 'placeholderEditFile')">
                    <div class="eval-upload-placeholder" id="placeholderEditFile" onclick="document.getElementById('modalEditFile').click()" style="padding: 15px;">
                        <i class="fas fa-cloud-upload-alt eval-upload-icon" style="font-size: 1.8rem;"></i>
                        <p class="eval-upload-text">Selecciona un nuevo archivo</p>
                    </div>
                    <div class="eval-file-preview" id="previewEditFile" style="display:none;">
                        <div class="eval-file-info">
                            <i class="fas fa-file-alt eval-file-icon"></i>
                            <p class="eval-file-name" id="nameEditFile"></p>
                        </div>
                        <button type="button" class="eval-file-remove" onclick="clearFileUI('modalEditFile', 'previewEditFile', 'placeholderEditFile')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer" style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn-primary-premium" onclick="updateMedicalFile()"><i class="fas fa-save"></i> Guardar</button>
            <button class="btn-secondary-premium" onclick="hideEditFileModal()"><i class="fas fa-times"></i> Cancelar</button>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
<script type="module" src="../hacer/entry/entry.js?v=<?= time() ?>"></script>
