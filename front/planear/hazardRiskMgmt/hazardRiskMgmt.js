import config from "../../js/config.js";

const PROCESS_API = `${config.BASE_API_URL}processes.php`;
const ANNUAL_API = `${config.BASE_API_URL}annual.php`;

// State
let allProcesses = [];
let filteredProcesses = [];
let idEmpresa = null;
let selectedProcess = null; // { idProceso, name }
let annualPlans = [];

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
                    <button class="btn-manage-risk" onclick="goToAnnualPlans('${item.idProceso}', '${encodeURIComponent(item.name)}')" title="Gestionar Peligros y Riesgos">
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

window.goToAnnualPlans = async function(idProceso, encodedName) {
    selectedProcess = {
        idProceso,
        name: decodeURIComponent(encodedName)
    };

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
// PANTALLA 3: Gestión de Riesgos (placeholder para futura implementación)
// ══════════════════════════════════════════════════════════════════════════════

window.goToRiskManagement = function(idPlan, startDate, endDate) {
    const startFormatted = formatDate(startDate);
    const endFormatted = formatDate(endDate);

    document.getElementById('riskProcessLabel').textContent = `Proceso: ${selectedProcess.name}`;
    document.getElementById('riskPeriodLabel').textContent = `Desde ${startFormatted} hasta ${endFormatted}`;
    document.getElementById('breadcrumbRisk').innerHTML = 
        `Inicio > Planear > Gestión Peligros y Riesgos > ${selectedProcess.name} > <strong>Desde ${startFormatted} hasta ${endFormatted}</strong>`;

    document.getElementById('screenAnnualPlans').style.display = 'none';
    document.getElementById('screenRiskManagement').style.display = 'block';
}

window.backToAnnualPlans = function() {
    document.getElementById('screenRiskManagement').style.display = 'none';
    document.getElementById('screenAnnualPlans').style.display = 'block';
}

// ── Start ────────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
