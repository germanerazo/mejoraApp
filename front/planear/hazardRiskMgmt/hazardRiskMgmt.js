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
            consequencesHtml = `<div class="empty-nested">No hay consecuencias registradas. <button class="btn-link-action" onclick="openAddConsequenceModal(${danger.activity_danger_id})">Agregar Consecuencia</button></div>`;
        } else {
            danger.consequences.forEach(cons => {
                let measuresHtml = '';
                if (!cons.measures || cons.measures.length === 0) {
                    measuresHtml = `<div class="empty-measures">Sin medidas preventivas. <button class="btn-link-action" onclick="openAddMeasureModal(${cons.adc_id})">Añadir Medida</button></div>`;
                } else {
                    measuresHtml = `<ul class="measure-list">`;
                    cons.measures.forEach(m => {
                        measuresHtml += `
                            <li>
                                <span><i class="fas fa-shield-virus"></i> ${m.measure_name}</span>
                                <button class="btn-icon-danger" onclick="removeMeasure(${m.adcm_id})" title="Eliminar Medida"><i class="fas fa-times"></i></button>
                            </li>
                        `;
                    });
                    measuresHtml += `</ul><div style="margin-top: 5px;"><button class="btn-link-action" onclick="openAddMeasureModal(${cons.adc_id})"><i class="fas fa-plus"></i> Añadir otra medida</button></div>`;
                }

                consequencesHtml += `
                    <div class="consequence-item">
                        <div class="consequence-header">
                            <div class="consequence-title">
                                <i class="fas fa-biohazard" style="color: #e74c3c;"></i>
                                Consecuencia: <strong>${cons.consequence_name}</strong>
                            </div>
                            <button class="btn-icon-danger" onclick="removeConsequence(${cons.adc_id})" title="Eliminar Consecuencia"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        <div class="measures-container">
                            ${measuresHtml}
                        </div>
                    </div>
                `;
            });
            consequencesHtml += `<div style="margin-top: 15px;"><button class="btn-secondary-premium" onclick="openAddConsequenceModal(${danger.activity_danger_id})"><i class="fas fa-plus-circle"></i> Agregar Consecuencia</button></div>`;
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

window.openAddDangerModal = async function() {
    Swal.fire({
        title: 'Cargando peligros...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        const dangers = await loadOptions('allDangers');
        
        let selectHtml = `<select id="swalDangerSelect" class="swal2-select" style="width: 100%; max-width: 100%;">
            <option value="">Seleccione un peligro...</option>`;
        
        let currentType = '';
        dangers.forEach(d => {
            if (d.typeName !== currentType) {
                if (currentType !== '') selectHtml += `</optgroup>`;
                selectHtml += `<optgroup label="${d.typeName}">`;
                currentType = d.typeName;
            }
            selectHtml += `<option value="${d.id}">${d.name}</option>`;
        });
        if (currentType !== '') selectHtml += `</optgroup>`;
        selectHtml += `</select>`;

        Swal.fire({
            title: 'Agregar Peligro',
            html: selectHtml,
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const val = document.getElementById('swalDangerSelect').value;
                if (!val) Swal.showValidationMessage('Debe seleccionar un peligro');
                return val;
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

window.openAddConsequenceModal = async function(activity_danger_id) {
    Swal.fire({ title: 'Cargando...', didOpen: () => Swal.showLoading() });

    try {
        const consequences = await loadOptions('consequences');
        let selectHtml = `<select id="swalConsSelect" class="swal2-select" style="width: 100%; max-width: 100%;">
            <option value="">Seleccione una consecuencia...</option>`;
        consequences.forEach(c => {
            selectHtml += `<option value="${c.id}">${c.name}</option>`;
        });
        selectHtml += `</select>`;

        Swal.fire({
            title: 'Agregar Consecuencia',
            html: selectHtml,
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            preConfirm: () => {
                const val = document.getElementById('swalConsSelect').value;
                if (!val) Swal.showValidationMessage('Debe seleccionar una consecuencia');
                return val;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await postAction('addConsequence', {
                    activity_danger_id: activity_danger_id,
                    consequence_id: result.value
                });
            }
        });
    } catch (err) {
        Swal.fire('Error', 'Error al cargar consecuencias.', 'error');
    }
}

window.openAddMeasureModal = async function(adc_id) {
    Swal.fire({ title: 'Cargando...', didOpen: () => Swal.showLoading() });

    try {
        const measures = await loadOptions('measures');
        let selectHtml = `<select id="swalMeasSelect" class="swal2-select" style="width: 100%; max-width: 100%;">
            <option value="">Seleccione una medida preventiva...</option>`;
        measures.forEach(m => {
            selectHtml += `<option value="${m.id}">${m.name}</option>`;
        });
        selectHtml += `</select>`;

        Swal.fire({
            title: 'Agregar Medida Preventiva',
            html: selectHtml,
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            preConfirm: () => {
                const val = document.getElementById('swalMeasSelect').value;
                if (!val) Swal.showValidationMessage('Debe seleccionar una medida');
                return val;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await postAction('addMeasure', {
                    activity_danger_consequence_id: adc_id,
                    preventive_measure_id: result.value
                });
            }
        });
    } catch (err) {
        Swal.fire('Error', 'Error al cargar medidas preventivas.', 'error');
    }
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
