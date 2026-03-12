import config from "../../js/config.js";

const API_URL = `${config.BASE_API_URL}processes.php`;

// State
let allProcesses = [];
let filteredProcesses = [];
let idEmpresa = null;

// Initialization
async function init() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        await loadProcesses();
    } else {
        Swal.fire('Error', 'No se ha encontrado la sesión de la empresa.', 'error');
    }
}

async function loadProcesses() {
    try {
        const res = await fetch(`${API_URL}?idEmpresa=${idEmpresa}`);
        const data = await res.json();
        
        // Flatten the categorized processes from API
        allProcesses = [];
        if (data['Estratégicos']) allProcesses.push(...data['Estratégicos'].map(p => ({...p, category: 'Estratégico'})));
        if (data['Operacionales']) allProcesses.push(...data['Operacionales'].map(p => ({...p, category: 'Operacional'})));
        if (data['De Apoyo']) allProcesses.push(...data['De Apoyo'].map(p => ({...p, category: 'De Apoyo'})));
        
        filteredProcesses = [...allProcesses];
        renderTable();
    } catch (err) {
        console.error('Error loading processes:', err);
        const container = document.getElementById("processContainer");
        container.innerHTML = `<div class="empty-state" style="color: var(--colorRed2);">Error al cargar los procesos.</div>`;
    }
}

function renderTable() {
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
                    <button class="btn-view-premium" onclick="goToMatrix('${item.idProceso}', '${encodeURIComponent(item.name)}')" title="Gestionar Peligros y Riesgos">
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

    renderTable();
}

window.clearFilters = function() {
    document.getElementById('filterName').value = "";
    document.getElementById('filterStatus').value = "";
    filteredProcesses = [...allProcesses];
    renderTable();
}

window.goToMatrix = function(idProceso, name) {
    // This would go to the second screen of the module
    // For now, let's just show a message or use hash navigation if we knew the next page
    Swal.fire({
        title: 'Gestión iniciada',
        text: `Iniciando gestión de peligros y riesgos para: ${decodeURIComponent(name)}`,
        icon: 'info',
        timer: 1500,
        showConfirmButton: false
    });
    
    // Suggestion for future implementation:
    // window.location.hash = encodeURIComponent(`../planear/hazardRiskMgmt/riskMatrix.php?idProceso=${idProceso}`);
}

// Start
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
