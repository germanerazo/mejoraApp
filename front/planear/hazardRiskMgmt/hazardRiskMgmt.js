import config from "../../js/config.js";

const PROCESS_API = `${config.BASE_API_URL}processes.php`;
const ANNUAL_API = `${config.BASE_API_URL}annual.php`;
const SHEET_API = `${config.BASE_API_URL}processSheet.php`;
const DANGER_API = `${config.BASE_API_URL}dangerMgmt.php`;

// State
let allProcesses = [];
let filteredProcesses = [];
let idEmpresa = null;
let selectedProcess = null; // full process object
let annualPlans = [];
let currentPlanData = null; // full plan with activities
let selectedActivity = null; // for screen 4
let currentDangers = []; // list of dangers for the selected activity

// ── Initialization ──────────────────────────────────────────────────────────
async function init() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        await loadProcesses();
    } else {
        Swal.fire('Error', 'No se ha encontrado la sesión de la empresa.', 'error');
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// PANTALLA 1: Listado de Procesos
// ══════════════════════════════════════════════════════════════════════════════

async function loadProcesses() {
    try {
        const res = await fetch(`${PROCESS_API}?idEmpresa=${idEmpresa}`);
        const data = await res.json();
        
        allProcesses = [];
        if (data['Estratégicos']) allProcesses.push(...data['Estratégicos'].map(p => ({...p, category: 'Estratégico'})));
        if (data['Operacionales']) allProcesses.push(...data['Operacionales'].map(p => ({...p, category: 'Operacional'})));
        if (data['De Apoyo']) allProcesses.push(...data['De Apoyo'].map(p => ({...p, category: 'De Apoyo'})));
        
        filteredProcesses = [...allProcesses];
        renderProcessTable();
    } catch (err) {
        console.error('Error loading processes:', err);
        const container = document.getElementById("processContainer");
        container.innerHTML = `<div class="empty-state" style="color: var(--colorRed2);">Error al cargar los procesos.</div>`;
    }
}

function renderProcessTable() {
    const container = document.getElementById("processContainer");
    
    if (filteredProcesses.length === 0) {
        container.innerHTML = `<div class="empty-state">No se encontraron procesos con los filtros aplicados.</div>`;
        return;
    }

    let html = `
        <table class="modern-table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre Proceso</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Cargos Relacionados</th>
                    <th style="text-align: center;">Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    filteredProcesses.forEach(item => {
        const badgeClass = getBadgeClass(item.status);
        html += `
            <tr>
                <td><strong>${item.code}</strong></td>
                <td>${item.name}</td>
                <td><span style="font-size: 13px; color: #666;">${item.category}</span></td>
                <td><span class="badge ${badgeClass}">${item.status}</span></td>
                <td style="font-size: 12px; color: #888;">${item.sede ? 'Sede: ' + item.sede : 'General'}</td>
                <td style="text-align: center;">
                    <button class="btn-manage-risk" onclick="goToAnnualPlans(${JSON.stringify(item).replace(/"/g, '&quot;')})" title="Gestionar Peligros y Riesgos">
                        <i class="fas fa-shield-alt"></i> Gestionar Riesgos
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function getBadgeClass(status) {
    switch(status) {
        case 'Vigente': return 'active';
        case 'Pendiente de aprobación': return 'review';
        case 'Obsoleto': return 'inactive';
        default: return '';
    }
}

window.applyFilters = function() {
    const nameFilter = document.getElementById('filterName').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;

    filteredProcesses = allProcesses.filter(p => {
        const matchesName = p.name.toLowerCase().includes(nameFilter) || p.code.toLowerCase().includes(nameFilter);
        const matchesStatus = statusFilter === "" || p.status === statusFilter;
        return matchesName && matchesStatus;
    });

    renderProcessTable();
}

window.clearFilters = function() {
    document.getElementById('filterName').value = "";
    document.getElementById('filterStatus').value = "";
    filteredProcesses = [...allProcesses];
    renderProcessTable();
}

// ══════════════════════════════════════════════════════════════════════════════
// PANTALLA 2: Planes de Trabajo Anual
// ══════════════════════════════════════════════════════════════════════════════

window.goToAnnualPlans = async function(processObj) {
    // If called from onclick with a JSON string
    if (typeof processObj === 'string') {
        processObj = JSON.parse(processObj);
    }
    selectedProcess = processObj;

    // Update UI
    document.getElementById('selectedProcessName').textContent = selectedProcess.name;
    document.getElementById('breadcrumbPlans').innerHTML = 
        `Inicio > Planear > Gestión Peligros y Riesgos > <strong>${selectedProcess.name}</strong>`;

    // Switch screens
    document.getElementById('screenProcessList').style.display = 'none';
    document.getElementById('screenAnnualPlans').style.display = 'block';

    // Load annual plans
    await loadAnnualPlans();
}

async function loadAnnualPlans() {
    const container = document.getElementById('annualPlansContainer');
    container.innerHTML = `<div class="empty-state"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Cargando planes de trabajo...</p></div>`;

    try {
        const res = await fetch(`${ANNUAL_API}?idEmpresa=${idEmpresa}`);
        annualPlans = await res.json();
        
        if (!Array.isArray(annualPlans)) {
            annualPlans = [];
        }

        renderAnnualPlansTable();
    } catch (err) {
        console.error('Error loading annual plans:', err);
        container.innerHTML = `<div class="empty-state" style="color: var(--colorRed2);">Error al cargar los planes de trabajo.</div>`;
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function renderAnnualPlansTable() {
    const container = document.getElementById('annualPlansContainer');

    if (annualPlans.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times fa-2x" style="color: #8d99ae; margin-bottom: 10px;"></i>
                <p>No hay planes de trabajo anual registrados para esta empresa.</p>
                <p style="font-size: 13px; color: #aaa;">Cree un plan de trabajo desde el módulo "Plan de Trabajo Anual".</p>
            </div>`;
        return;
    }

    let html = `
        <table class="modern-table">
            <thead>
                <tr>
                    <th>Período a Gestionar</th>
                    <th style="text-align: center; width: 200px;">Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    annualPlans.forEach(plan => {
        const startFormatted = formatDate(plan.startDate);
        const endFormatted = formatDate(plan.endDate);

        html += `
            <tr>
                <td>
                    <div class="period-cell">
                        <i class="fas fa-calendar-alt period-icon"></i>
                        <span>Desde <strong>${startFormatted}</strong> hasta <strong>${endFormatted}</strong></span>
                    </div>
                </td>
                <td style="text-align: center;">
                    <button class="btn-manage-risk" onclick="goToRiskManagement(${plan.idPlan}, '${plan.startDate}', '${plan.endDate}')" title="Gestionar Riesgos de este período">
                        <i class="fas fa-exclamation-triangle"></i> Gestionar Riesgos
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

window.backToProcessList = function() {
    document.getElementById('screenAnnualPlans').style.display = 'none';
    document.getElementById('screenProcessList').style.display = 'block';
    selectedProcess = null;
}

// ══════════════════════════════════════════════════════════════════════════════
// PANTALLA 3: Gestión de Riesgos - Actividades del Proceso
// ══════════════════════════════════════════════════════════════════════════════

window.goToRiskManagement = async function(idPlan, startDate, endDate) {
    const startFormatted = formatDate(startDate);
    const endFormatted = formatDate(endDate);

    // Fill process header info
    document.getElementById('riskHeaderName').textContent = selectedProcess.name || '—';
    document.getElementById('riskHeaderDate').textContent = formatDate(selectedProcess.created) || '—';
    document.getElementById('riskHeaderCode').textContent = selectedProcess.code || '—';
    
    const statusEl = document.getElementById('riskHeaderStatus');
    const badgeClass = getBadgeClass(selectedProcess.status);
    statusEl.innerHTML = `<span class="badge ${badgeClass}">${selectedProcess.status || '—'}</span>`;

    document.getElementById('breadcrumbRisk').innerHTML = 
        `Inicio > Planear > Gestión Peligros y Riesgos > ${selectedProcess.name} > <strong>Desde ${startFormatted} hasta ${endFormatted}</strong>`;

    // Switch screens
    document.getElementById('screenAnnualPlans').style.display = 'none';
    document.getElementById('screenRiskManagement').style.display = 'block';

    // Load activities from the process sheet (ficha de proceso)
    await loadProcessActivities();
}

async function loadProcessActivities() {
    const container = document.getElementById('riskActivitiesContainer');
    container.innerHTML = `<div class="empty-state"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Cargando actividades...</p></div>`;

    try {
        const res = await fetch(`${SHEET_API}?idEmpresa=${idEmpresa}&code=${selectedProcess.code}`);
        const sheetData = await res.json();

        const activities = sheetData.activities || [];
        renderActivitiesTable(activities);
    } catch (err) {
        console.error('Error loading activities:', err);
        container.innerHTML = `<div class="empty-state" style="color: var(--colorRed2);">Error al cargar las actividades.</div>`;
    }
}

function renderActivitiesTable(activities) {
    const container = document.getElementById('riskActivitiesContainer');
    const countBadge = document.getElementById('activityCountBadge');
    
    countBadge.textContent = `${activities.length} actividad${activities.length !== 1 ? 'es' : ''}`;

    if (activities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list fa-2x" style="color: #8d99ae; margin-bottom: 10px;"></i>
                <p>No hay actividades registradas para este proceso.</p>
                <p style="font-size: 13px; color: #aaa;">Agregue actividades desde la "Ficha de Proceso".</p>
            </div>`;
        return;
    }

    let html = `
        <table class="modern-table">
            <thead>
                <tr>
                    <th>Lista de Actividades</th>
                    <th>Área</th>
                    <th style="text-align: center;">Act. Rutinaria</th>
                    <th style="text-align: center;">Act. Alto Riesgo</th>
                    <th style="text-align: center;">Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    activities.forEach(act => {
        const isRoutine = act.routine && act.routine.toLowerCase() === 'sí';
        const isHighRisk = act.highRisk && act.highRisk.toLowerCase() === 'sí';

        html += `
            <tr>
                <td>
                    <div style="font-weight: 600; color: #2b2d42;">${act.name || '—'}</div>
                </td>
                <td>${act.area || '—'}</td>
                <td style="text-align: center;">
                    <span class="${isRoutine ? 'badge-routine' : 'badge-routine-no'}">
                        <i class="fas ${isRoutine ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${act.routine || 'No'}
                    </span>
                </td>
                <td style="text-align: center;">
                    <span class="${isHighRisk ? 'badge-high-risk-yes' : 'badge-high-risk'}">
                        <i class="fas ${isHighRisk ? 'fa-exclamation-triangle' : 'fa-shield-alt'}"></i> ${act.highRisk || 'No'}
                    </span>
                </td>
                <td style="text-align: center;">
                    <button class="btn-manage-risk" onclick="goToDangerMgmt(${JSON.stringify(act).replace(/"/g, '&quot;')})" title="Gestionar Peligros de esta actividad">
                        <i class="fas fa-exclamation-triangle"></i> Gestionar Peligros
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

window.backToAnnualPlans = function() {
    document.getElementById('screenRiskManagement').style.display = 'none';
    document.getElementById('screenAnnualPlans').style.display = 'block';
}

// ══════════════════════════════════════════════════════════════════════════════
// PANTALLA 4: Gestión de Peligros por Actividad
// ══════════════════════════════════════════════════════════════════════════════

window.goToDangerMgmt = async function(activityObj) {
    if (typeof activityObj === 'string') {
        activityObj = JSON.parse(activityObj);
    }
    selectedActivity = activityObj;

    // Llenar info de la actividad en el header
    document.getElementById('dangerActivityName').textContent = selectedActivity.name || '—';
    document.getElementById('dangerActivityArea').textContent = selectedActivity.area || '—';
    
    // Rutinaria badge
    const isRoutine = selectedActivity.routine && selectedActivity.routine.toLowerCase() === 'sí';
    document.getElementById('dangerActivityRoutine').innerHTML = `
        <span class="${isRoutine ? 'badge-routine' : 'badge-routine-no'}">
            <i class="fas ${isRoutine ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${selectedActivity.routine || 'No'}
        </span>`;

    // Alto Riesgo badge
    const isHighRisk = selectedActivity.highRisk && selectedActivity.highRisk.toLowerCase() === 'sí';
    document.getElementById('dangerActivityHighRisk').innerHTML = `
        <span class="${isHighRisk ? 'badge-high-risk-yes' : 'badge-high-risk'}">
            <i class="fas ${isHighRisk ? 'fa-exclamation-triangle' : 'fa-shield-alt'}"></i> ${selectedActivity.highRisk || 'No'}
        </span>`;

    // Cambiar pantallas
    document.getElementById('screenRiskManagement').style.display = 'none';
    document.getElementById('screenDangerMgmt').style.display = 'block';

    await loadActivityDangers();
}

window.backToActivities = function() {
    document.getElementById('screenDangerMgmt').style.display = 'none';
    document.getElementById('screenRiskManagement').style.display = 'block';
    selectedActivity = null;
    currentDangers = [];
}

async function loadActivityDangers() {
    const container = document.getElementById('dangerCardsContainer');
    container.innerHTML = `<div class="empty-state"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Cargando peligros de la actividad...</p></div>`;

    if (!selectedActivity || !selectedActivity.idActivity) {
        container.innerHTML = `<div class="empty-state" style="color: var(--colorRed2);">Error: Actividad no válida.</div>`;
        return;
    }

    try {
        const res = await fetch(`${DANGER_API}?action=activityDangers&idActivity=${selectedActivity.idActivity}`);
        currentDangers = await res.json();
        renderDangerCards();
    } catch (err) {
        console.error('Error loading dangers:', err);
        container.innerHTML = `<div class="empty-state" style="color: var(--colorRed2);">Error al cargar los peligros.</div>`;
    }
}

function renderDangerCards() {
    const container = document.getElementById('dangerCardsContainer');
    const badge = document.getElementById('dangerCountBadge');
    
    badge.textContent = `${currentDangers.length} peligro${currentDangers.length !== 1 ? 's' : ''}`;

    if (currentDangers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shield-alt fa-2x" style="color: #8d99ae; margin-bottom: 10px;"></i>
                <p>No hay peligros asignados a esta actividad.</p>
                <p style="font-size: 13px; color: #aaa;">Haga clic en "Agregar Peligro" para empezar.</p>
            </div>
        `;
        return;
    }

    let html = '';
    
    currentDangers.forEach(danger => {
        // Build Consequence/Measures HTML
        let consequencesHtml = '';
        if (!danger.consequences || danger.consequences.length === 0) {
            consequencesHtml = `<div class="empty-nested">No hay consecuencias registradas. <button class="btn-link-action" onclick="openAddConsequenceModal(${danger.activity_danger_id}, ${danger.danger_id})">Agregar Consecuencia</button></div>`;
        } else {
            danger.consequences.forEach(cons => {
                let measuresHtml = '';
                if (!cons.measures || cons.measures.length === 0) {
                    measuresHtml = `<div class="empty-measures">Sin medidas preventivas. <button class="btn-link-action" onclick="openAddMeasureModal(${cons.adc_id}, ${danger.danger_id})">Añadir Medida</button></div>`;
                } else {
                    measuresHtml = `<ul class="measure-list">`;
                    cons.measures.forEach(m => {
                        let tags = '';
                        if(m.elimination == 1) tags += '<span style="font-size:10px; background:#e74c3c; color:#fff; padding:2px 6px; border-radius:10px; margin-left:5px;">Eliminación</span>';
                        if(m.substitution == 1) tags += '<span style="font-size:10px; background:#e67e22; color:#fff; padding:2px 6px; border-radius:10px; margin-left:5px;">Sustitución</span>';
                        if(m.engineering_control == 1) tags += '<span style="font-size:10px; background:#f1c40f; color:#333; padding:2px 6px; border-radius:10px; margin-left:5px;">Control Ing.</span>';
                        if(m.administrative_control == 1) tags += '<span style="font-size:10px; background:#3498db; color:#fff; padding:2px 6px; border-radius:10px; margin-left:5px;">Control Adm.</span>';
                        if(m.ppe == 1) tags += '<span style="font-size:10px; background:#9b59b6; color:#fff; padding:2px 6px; border-radius:10px; margin-left:5px;">EPP</span>';

                        measuresHtml += `
                            <li style="display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <i class="fas fa-shield-virus" style="margin-right:5px;"></i> ${m.measure_name} 
                                    <div style="margin-top:4px; margin-left:20px;">${tags}</div>
                                </div>
                                <button class="btn-icon-danger" onclick="removeMeasure(${m.adcm_id})" title="Eliminar Medida"><i class="fas fa-times"></i></button>
                            </li>
                        `;
                    });
                    measuresHtml += `</ul><div style="margin-top: 5px;"><button class="btn-link-action" onclick="openAddMeasureModal(${cons.adc_id}, ${danger.danger_id})"><i class="fas fa-plus"></i> Añadir otra medida</button></div>`;
                }

                let evaluationHtml = '';
                if (cons.deficiency_level !== null || cons.existing_controls || cons.worst_consequence) {
                    evaluationHtml = `
                        <div style="background: #f1f3f5; border-radius: 6px; padding: 10px 15px; margin-bottom: 12px; font-size: 13px;">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                                <div><strong><i class="fas fa-shield-alt" style="color:#6c757d;"></i> Controles Existentes:</strong> <br>${cons.existing_controls || 'Ninguno'}</div>
                                <div><strong>Nivel Deficiencia:</strong> ${cons.deficiency_level !== null ? cons.deficiency_level : '-'} | <strong>Nivel Exposición:</strong> ${cons.exposure_level !== null ? cons.exposure_level : '-'}</div>
                                <div><strong>Nivel Consecuencia:</strong> ${cons.consequence_level !== null ? cons.consequence_level : '-'}</div>
                                <div><strong><i class="fas fa-users" style="color:#329bd6;"></i> Expuestos:</strong> ${cons.exposed_count !== null ? cons.exposed_count : 'No def.'} | <strong>Req. Legal:</strong> ${cons.legal_requirements || '-'}</div>
                                <div style="grid-column: 1 / -1;"><strong><i class="fas fa-exclamation-circle" style="color:#e67e22;"></i> Peor Consecuencia:</strong> ${cons.worst_consequence || 'No definida'}</div>
                            </div>
                        </div>
                    `;
                }

                consequencesHtml += `
                    <div class="consequence-item">
                        <div class="consequence-header" style="border-bottom: none; padding-bottom: 0px; margin-bottom: 8px;">
                            <div class="consequence-title" style="font-size: 15px;">
                                <i class="fas fa-biohazard" style="color: #e74c3c;"></i>
                                Consecuencia: <strong>${cons.consequence_name}</strong>
                            </div>
                            <button class="btn-icon-danger" onclick="removeConsequence(${cons.adc_id})" title="Eliminar Consecuencia"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        ${evaluationHtml}
                        <div style="font-size: 13px; font-weight: 600; color: #8d99ae; margin-bottom: 8px; margin-top: 10px; padding-left: 24px;">Medidas Preventivas:</div>
                        <div class="measures-container">
                            ${measuresHtml}
                        </div>
                    </div>
                `;
            });
            consequencesHtml += `<div style="margin-top: 15px;"><button class="btn-secondary-premium" onclick="openAddConsequenceModal(${danger.activity_danger_id}, ${danger.danger_id})"><i class="fas fa-plus-circle"></i> Agregar Consecuencia</button></div>`;
        }

        html += `
            <div class="danger-card">
                <div class="danger-card-header">
                    <div>
                        <div class="danger-type">${danger.type_name}</div>
                        <div class="danger-name">${danger.danger_name}</div>
                    </div>
                    <button class="btn-danger-action" onclick="removeDanger(${danger.activity_danger_id})" title="Eliminar Peligro">
                        <i class="fas fa-trash-alt"></i> Eliminar Peligro
                    </button>
                </div>
                <div class="danger-card-body">
                    ${consequencesHtml}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ── MODALS & ACTIONS ──────────────────────────────────────────────────────────

async function loadOptions(action) {
    const res = await fetch(`${DANGER_API}?action=${action}`);
    return await res.json();
}

let allDangersData = []; // Cached array for the modal

window.openAddDangerModal = async function() {
    Swal.fire({
        title: 'Cargando peligros...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        allDangersData = await loadOptions('allDangers');
        
        // Extract unique types
        const typesMap = new Map();
        allDangersData.forEach(d => {
            if (!typesMap.has(d.danger_type_id)) {
                typesMap.set(d.danger_type_id, d.typeName);
            }
        });

        let typeOptions = `<option value="">-- Todos los tipos --</option>`;
        for (const [id, name] of typesMap.entries()) {
            typeOptions += `<option value="${id}">${name}</option>`;
        }

        const htmlContent = `
            <div style="text-align: left;">
                <label style="display:block; font-weight:600; margin-bottom:5px; font-size:14px; color:#4a5568;">1. Seleccione el Tipo</label>
                <select id="modalDangerTypeSelect" class="swal2-select" style="width: 100%; margin: 0 0 15px 0; font-size:14px; padding:5px 10px; max-width:100%;">
                    ${typeOptions}
                </select>

                <label style="display:block; font-weight:600; margin-bottom:5px; font-size:14px; color:#4a5568;">2. Buscar Peligro</label>
                <div style="position: relative; margin-bottom: 15px;">
                    <i class="fas fa-search" style="position: absolute; left: 12px; top: 12px; color: #888;"></i>
                    <input type="text" id="modalDangerSearch" class="swal2-input" autocomplete="off" style="width: 100%; margin: 0; padding-left: 35px; box-sizing: border-box; font-size:14px; max-width:100%;" placeholder="Escriba para buscar...">
                </div>

                <label style="display:block; font-weight:600; margin-bottom:5px; font-size:14px; color:#4a5568;">3. Seleccione el Peligro (<span id="modalDangerCount" style="color:#329bd6;">0</span>)</label>
                <div id="modalDangerList" style="max-height: 230px; overflow-y: auto; border: 1px solid #e9ecef; border-radius: 6px; padding: 5px; background: #fafafa;">
                </div>
            </div>
        `;

        Swal.fire({
            title: 'Asociar nuevo Peligro',
            html: htmlContent,
            width: '600px',
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-save"></i> Guardar Peligro',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn-new-record',
                cancelButton: 'btn-secondary-premium'
            },
            buttonsStyling: false,
            didOpen: () => {
                const typeSelect = document.getElementById('modalDangerTypeSelect');
                const searchInput = document.getElementById('modalDangerSearch');
                
                typeSelect.addEventListener('change', renderModalDangers);
                searchInput.addEventListener('input', renderModalDangers);

                // Initial render
                renderModalDangers();
            },
            preConfirm: () => {
                const selected = document.querySelector('.danger-option.selected');
                if (!selected) {
                    Swal.showValidationMessage('⚠️ Debe hacer clic en un peligro de la lista para seleccionarlo');
                    return false;
                }
                return selected.dataset.id; // Returns the danger_id
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await postAction('addDanger', {
                    idActivity: selectedActivity.idActivity,
                    danger_id: result.value
                });
            }
        });
    } catch (err) {
        Swal.fire('Error', 'No se pudieron cargar los peligros.', 'error');
    }
}

function renderModalDangers() {
    const listContainer = document.getElementById('modalDangerList');
    const typeSelect = document.getElementById('modalDangerTypeSelect');
    const searchInput = document.getElementById('modalDangerSearch');
    const countSpan = document.getElementById('modalDangerCount');

    if (!listContainer || !typeSelect || !searchInput) return;

    const typeFilter = typeSelect.value;
    const searchFilter = searchInput.value.toLowerCase().trim();

    const filtered = allDangersData.filter(d => {
        const matchesType = typeFilter === "" || d.danger_type_id == typeFilter;
        const matchesSearch = searchFilter === "" || d.name.toLowerCase().includes(searchFilter);
        return matchesType && matchesSearch;
    });

    countSpan.textContent = filtered.length;

    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="padding: 20px 15px; color: #8d99ae; text-align: center; font-size:13px;"><i class="fas fa-search" style="font-size: 24px; opacity: 0.5; margin-bottom: 10px; display: block;"></i> No se encontraron peligros que coincidan con su búsqueda.</div>`;
        return;
    }

    let html = '';
    filtered.forEach(d => {
        html += `<div class="danger-option" data-id="${d.id}" onclick="selectModalDanger(this)">
            <div style="font-size:11px; color:#8d99ae; text-transform:uppercase; margin-bottom:3px; font-weight: 700;">${d.typeName}</div>
            <div style="color: #2b2d42;">${d.name}</div>
        </div>`;
    });

    listContainer.innerHTML = html;
}

window.selectModalDanger = function(element) {
    document.querySelectorAll('.danger-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

let allConsData = [];

window.openAddConsequenceModal = async function(activity_danger_id, danger_id) {
    Swal.fire({ title: 'Cargando consecuencias...', didOpen: () => Swal.showLoading() });

    try {
        allConsData = await loadOptions(`consequencesByDanger&dangerId=${danger_id}`);
        
        const htmlContent = `
            <div style="text-align: left;">
                <label style="display:block; font-weight:600; margin-bottom:5px; font-size:14px; color:#4a5568;">1. Buscar Consecuencia</label>
                <div style="position: relative; margin-bottom: 15px;">
                    <i class="fas fa-search" style="position: absolute; left: 12px; top: 12px; color: #888;"></i>
                    <input type="text" id="modalConsSearch" class="swal2-input" autocomplete="off" style="width: 100%; margin: 0; padding-left: 35px; box-sizing: border-box; font-size:14px; max-width:100%;" placeholder="Escriba para buscar...">
                </div>

                <label style="display:block; font-weight:600; margin-bottom:5px; font-size:14px; color:#4a5568;">2. Seleccione la Consecuencia (<span id="modalConsCount" style="color:#329bd6;">0</span>)</label>
                <div id="modalConsList" style="max-height: 180px; overflow-y: auto; border: 1px solid #e9ecef; border-radius: 6px; padding: 5px; background: #fafafa; margin-bottom: 20px;">
                </div>

                <hr style="border:0; border-top:1px dashed #ccc; margin: 20px 0;">

                <label style="display:block; font-weight:600; margin-bottom:15px; font-size:15px; color:#329bd6;">
                    <i class="fas fa-sliders-h"></i> Criterios de Evaluación
                </label>

                <div style="margin-bottom: 15px;">
                    <label style="display:block; font-size:13px; font-weight:600; margin-bottom:5px;">Controles Existentes <span style="font-weight:normal; color:#888;">(Ej: En la fuente, medio, individuo)</span></label>
                    <input type="text" id="modalExistingControls" class="swal2-input" style="width:100%; margin:0; font-size:14px;">
                </div>

                <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 150px;">
                        <label style="display:block; font-size:13px; font-weight:600; margin-bottom:5px;">Nivel de Deficiencia</label>
                        <select id="modalND" class="swal2-select" style="width:100%; margin:0; font-size:14px; padding:5px;">
                            <option value="">Seleccione...</option>
                            <option value="0">0 - Bajo</option>
                            <option value="2">2 - Medio</option>
                            <option value="6">6 - Alto</option>
                            <option value="10">10 - Muy Alto</option>
                        </select>
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <label style="display:block; font-size:13px; font-weight:600; margin-bottom:5px;">Nivel de Exposición</label>
                        <select id="modalNE" class="swal2-select" style="width:100%; margin:0; font-size:14px; padding:5px;">
                            <option value="">Seleccione...</option>
                            <option value="1">1 - Esporádica</option>
                            <option value="2">2 - Ocasional</option>
                            <option value="3">3 - Frecuente</option>
                            <option value="4">4 - Continua</option>
                        </select>
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <label style="display:block; font-size:13px; font-weight:600; margin-bottom:5px;">Nivel de Consecuencia</label>
                        <select id="modalNC" class="swal2-select" style="width:100%; margin:0; font-size:14px; padding:5px;">
                            <option value="">Seleccione...</option>
                            <option value="10">10 - Leve</option>
                            <option value="25">25 - Grave</option>
                            <option value="60">60 - Muy Grave</option>
                            <option value="100">100 - Mortal/Catastrófico</option>
                        </select>
                    </div>
                </div>

                <hr style="border:0; border-top:1px dashed #ccc; margin: 20px 0;">

                <label style="display:block; font-weight:600; margin-bottom:15px; font-size:15px; color:#e67e22;">
                    <i class="fas fa-users-cog"></i> Criterios para Establecer Controles
                </label>

                <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 150px;">
                        <label style="display:block; font-size:13px; font-weight:600; margin-bottom:5px;">Número de Expuestos</label>
                        <input type="number" id="modalExposed" class="swal2-input" min="0" max="1000" style="width:100%; margin:0; font-size:14px;">
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <label style="display:block; font-size:13px; font-weight:600; margin-bottom:5px;">Req. Legales Asociados</label>
                        <select id="modalLegalCode" class="swal2-select" style="width:100%; margin:0; font-size:14px; padding:5px;">
                            <option value="">Seleccione...</option>
                            <option value="SI">Sí</option>
                            <option value="NO">No</option>
                        </select>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display:block; font-size:13px; font-weight:600; margin-bottom:5px;">Peor Consecuencia</label>
                    <input type="text" id="modalWorst" class="swal2-input" style="width:100%; margin:0; font-size:14px;">
                </div>

            </div>
        `;

        Swal.fire({
            title: 'Asociar y Evaluar Consecuencia',
            html: htmlContent,
            width: '750px',
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-save"></i> Guardar Evaluación',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn-new-record',
                cancelButton: 'btn-secondary-premium'
            },
            buttonsStyling: false,
            didOpen: () => {
                const searchInput = document.getElementById('modalConsSearch');
                searchInput.addEventListener('input', renderModalCons);
                renderModalCons(); // Initial render
            },
            preConfirm: () => {
                const selected = document.querySelector('.cons-option.selected');
                if (!selected) {
                    Swal.showValidationMessage('⚠️ Debe seleccionar una consecuencia del listado');
                    return false;
                }
                
                return {
                    consequence_id: selected.dataset.id,
                    existing_controls: document.getElementById('modalExistingControls').value,
                    deficiency_level: document.getElementById('modalND').value,
                    exposure_level: document.getElementById('modalNE').value,
                    consequence_level: document.getElementById('modalNC').value,
                    exposed_count: document.getElementById('modalExposed').value,
                    worst_consequence: document.getElementById('modalWorst').value,
                    legal_requirements: document.getElementById('modalLegalCode').value,
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const payload = result.value;
                payload.activity_danger_id = activity_danger_id;
                await postAction('addConsequence', payload);
            }
        });
    } catch (err) {
        console.error('Error loading consequences modal:', err);
        Swal.fire('Error', 'Error al cargar consecuencias: ' + err.message, 'error');
    }
}

function renderModalCons() {
    const listContainer = document.getElementById('modalConsList');
    const searchInput = document.getElementById('modalConsSearch');
    const countSpan = document.getElementById('modalConsCount');

    if (!listContainer || !searchInput) return;

    const searchFilter = searchInput.value.toLowerCase().trim();

    const filtered = allConsData.filter(c => c.name.toLowerCase().includes(searchFilter));

    countSpan.textContent = filtered.length;

    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="padding: 20px 15px; color: #8d99ae; text-align: center; font-size:13px;"><i class="fas fa-search" style="font-size: 24px; opacity: 0.5; margin-bottom: 10px; display: block;"></i> No se encontraron consecuencias.</div>`;
        return;
    }

    let html = '';
    filtered.forEach(c => {
        html += `<div class="danger-option cons-option" data-id="${c.id}" onclick="selectModalCons(this)">
            <div style="color: #2b2d42;">${c.name}</div>
        </div>`;
    });

    listContainer.innerHTML = html;
}

window.selectModalCons = function(element) {
    document.querySelectorAll('.cons-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

let allMeasData = [];

window.openAddMeasureModal = async function(adc_id, danger_id) {
    Swal.fire({ title: 'Cargando medidas...', didOpen: () => Swal.showLoading() });

    try {
        allMeasData = await loadOptions(`measuresByDanger&dangerId=${danger_id}`);
        
        const htmlContent = `
            <div style="text-align: left;">
                <label style="display:block; font-weight:600; margin-bottom:5px; font-size:14px; color:#4a5568;">1. Seleccione una Medida Preventiva Existente</label>
                <div style="position: relative; margin-bottom: 10px;">
                    <i class="fas fa-search" style="position: absolute; left: 12px; top: 12px; color: #888;"></i>
                    <input type="text" id="modalMeasSearch" class="swal2-input" autocomplete="off" style="width: 100%; margin: 0; padding-left: 35px; box-sizing: border-box; font-size:14px; max-width:100%;" placeholder="Buscar medida registrada...">
                </div>

                <div id="modalMeasList" style="max-height: 150px; overflow-y: auto; border: 1px solid #e9ecef; border-radius: 6px; padding: 5px; background: #fafafa; margin-bottom: 15px;">
                </div>

                <div style="display: flex; align-items: center; margin: 15px 0;">
                    <hr style="flex-grow: 1; border:0; border-top:1px dashed #ccc;">
                    <span style="padding: 0 10px; color: #888; font-size: 13px; font-weight: 600;">O CREAR UNA NUEVA</span>
                    <hr style="flex-grow: 1; border:0; border-top:1px dashed #ccc;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display:block; font-size:13px; font-weight:600; margin-bottom:5px;">Si la medida no existe en la lista, escríbala aquí para registrarla:</label>
                    <input type="text" id="modalNewMeasure" class="swal2-input" autocomplete="off" style="width:100%; margin:0; font-size:14px;" placeholder="Ej: Instalación de guardas de seguridad nuevas...">
                </div>

                <hr style="border:0; border-top:1px dashed #ccc; margin: 20px 0;">

                <label style="display:block; font-weight:600; margin-bottom:15px; font-size:15px; color:#27ae60;">
                    <i class="fas fa-check-square"></i> Tipo de Control (Puede marcar varias)
                </label>

                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
                        <input type="checkbox" id="chkElimination" value="1" style="width:16px; height:16px;"> Eliminación
                    </label>
                    <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
                        <input type="checkbox" id="chkSubstitution" value="1" style="width:16px; height:16px;"> Sustitución
                    </label>
                    <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
                        <input type="checkbox" id="chkEngineering" value="1" style="width:16px; height:16px;"> Control de Ingeniería
                    </label>
                    <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
                        <input type="checkbox" id="chkAdministrative" value="1" style="width:16px; height:16px;"> Control Administrativo
                    </label>
                    <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
                        <input type="checkbox" id="chkPPE" value="1" style="width:16px; height:16px;"> EPP
                    </label>
                </div>
            </div>
        `;

        Swal.fire({
            title: 'Asociar Medida Preventiva',
            html: htmlContent,
            width: '700px',
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-save"></i> Guardar Medida',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn-new-record',
                cancelButton: 'btn-secondary-premium'
            },
            buttonsStyling: false,
            didOpen: () => {
                const searchInput = document.getElementById('modalMeasSearch');
                searchInput.addEventListener('input', renderModalMeas);
                renderModalMeas(); // Initial render
            },
            preConfirm: () => {
                const selected = document.querySelector('.meas-option.selected');
                const newMeasureVal = document.getElementById('modalNewMeasure').value.trim();

                if (!selected && newMeasureVal === '') {
                    Swal.showValidationMessage('⚠️ Debe seleccionar una medida o escribir una nueva.');
                    return false;
                }

                if (selected && newMeasureVal !== '') {
                    Swal.showValidationMessage('⚠️ Seleccione una medida de la lista O escriba una nueva, no ambas.');
                    return false;
                }

                return {
                    preventive_measure_id: selected ? selected.dataset.id : '',
                    new_measure_name: newMeasureVal,
                    elimination: document.getElementById('chkElimination').checked ? 1 : 0,
                    substitution: document.getElementById('chkSubstitution').checked ? 1 : 0,
                    engineering_control: document.getElementById('chkEngineering').checked ? 1 : 0,
                    administrative_control: document.getElementById('chkAdministrative').checked ? 1 : 0,
                    ppe: document.getElementById('chkPPE').checked ? 1 : 0
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const payload = result.value;
                payload.activity_danger_consequence_id = adc_id;
                payload.danger_id = danger_id;
                await postAction('addMeasure', payload);
            }
        });
    } catch (err) {
        console.error('Error loading measures modal:', err);
        Swal.fire('Error', 'Error al cargar medidas preventivas: ' + err.message, 'error');
    }
}

function renderModalMeas() {
    const listContainer = document.getElementById('modalMeasList');
    const searchInput = document.getElementById('modalMeasSearch');
    const countSpan = document.getElementById('modalMeasCount');

    if (!listContainer || !searchInput) return;

    const searchFilter = searchInput.value.toLowerCase().trim();

    const filtered = allMeasData.filter(m => m.name.toLowerCase().includes(searchFilter));

    countSpan.textContent = filtered.length;

    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="padding: 20px 15px; color: #8d99ae; text-align: center; font-size:13px;"><i class="fas fa-search" style="font-size: 24px; opacity: 0.5; margin-bottom: 10px; display: block;"></i> No se encontraron medidas preventivas.</div>`;
        return;
    }

    let html = '';
    filtered.forEach(m => {
        html += `<div class="danger-option meas-option" data-id="${m.id}" onclick="selectModalMeas(this)">
            <div style="color: #2b2d42;">${m.name}</div>
        </div>`;
    });

    listContainer.innerHTML = html;
}

window.selectModalMeas = function(element) {
    document.querySelectorAll('.meas-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

// ── DELETE ACTIONS ──────────────────────────────────────────────────────────

window.removeDanger = function(activity_danger_id) {
    confirmDelete('eliminar este peligro y todas sus consecuencias asociadas', async () => {
        await deleteAction('removeDanger', { activity_danger_id: activity_danger_id });
    });
}

window.removeConsequence = function(adc_id) {
    confirmDelete('eliminar esta consecuencia y sus medidas asociadas', async () => {
        await deleteAction('removeConsequence', { adc_id: adc_id });
    });
}

window.removeMeasure = function(adcm_id) {
    confirmDelete('eliminar esta medida preventiva', async () => {
        await deleteAction('removeMeasure', { adcm_id: adcm_id });
    });
}

function confirmDelete(text, callback) {
    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea ${text}? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) callback();
    });
}

// ── API HELPERS ──────────────────────────────────────────────────────────────

async function postAction(action, payload) {
    payload.token = sessionStorage.getItem('token');
    try {
        const res = await fetch(`${DANGER_API}?action=${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            Swal.fire('Éxito', 'Guardado correctamente.', 'success');
            await loadActivityDangers();
        } else {
            Swal.fire('Error', data.result?.error_message || 'Hubo un error al guardar.', 'error');
        }
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Error de conexión.', 'error');
    }
}

async function deleteAction(action, payload) {
    payload.token = sessionStorage.getItem('token');
    try {
        const res = await fetch(`${DANGER_API}?action=${action}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            Swal.fire('Éxito', 'Eliminado correctamente.', 'success');
            await loadActivityDangers();
        } else {
            Swal.fire('Error', data.result?.error_message || 'Hubo un error al eliminar.', 'error');
        }
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Error de conexión.', 'error');
    }
}

// ── Start ────────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
