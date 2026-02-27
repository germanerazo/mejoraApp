import config from "../../js/config.js";

const API_URL = `${config.BASE_API_URL}processes.php`;

// State
let processes = {
    'Estratégicos': [],
    'Operacionales': [],
    'De Apoyo': []
};
let currentTab = 'Estratégicos';
let idEmpresa = null;

// Initialization
function init() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        loadProcesses();
    } else {
        Swal.fire('Error', 'No se ha encontrado la sesión de la empresa.', 'error');
    }
}

function loadProcesses() {
    fetch(`${API_URL}?idEmpresa=${idEmpresa}`)
        .then(res => res.json())
        .then(data => {
            processes = data;
            // Handle edge case where backend returns empty object instead of skeleton
            if(!processes['Estratégicos']) processes['Estratégicos'] = [];
            if(!processes['Operacionales']) processes['Operacionales'] = [];
            if(!processes['De Apoyo']) processes['De Apoyo'] = [];
            
            renderTable(processes[currentTab]);
        })
        .catch(err => {
            console.error('Error loading processes data:', err);
            Swal.fire('Error', 'Ocurrió un error al cargar la información', 'error');
        });
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

// Global Functions (attached to window for HTML onclick access)
window.switchTab = function(tabName) {
    currentTab = tabName;
    
    // Update Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tabName.toLowerCase())) {
            btn.classList.add('active');
        }
    });

    // Render Data
    renderTable(processes[tabName] || []);
}

window.createNewProcess = async function() {
    let title = '';
    let extraFields = '';
    
    if (currentTab === 'Estratégicos') {
        title = 'Nuevo Proceso Estratégico';
    } else if (currentTab === 'Operacionales') {
        title = 'Nuevo Proceso Operacional';
        extraFields = `
            <label for="swal-input-sede" style="display: block; margin-bottom: 5px; font-weight: 500;">Sede</label>
            <select id="swal-input-sede" class="swal2-select" style="margin: 0 0 15px 0; width: 100%; display: block; box-sizing: border-box;">
                <option value="Bogotá">Bogotá</option>
                <option value="Medellín">Medellín</option>
                <option value="Cali">Cali</option>
                <option value="Barranquilla">Barranquilla</option>
            </select>
        `;
    } else if (currentTab === 'De Apoyo') {
        title = 'Nuevo Proceso de Apoyo';
        extraFields = `
            <label for="swal-input-sede" style="display: block; margin-bottom: 5px; font-weight: 500;">Sede</label>
            <select id="swal-input-sede" class="swal2-select" style="margin: 0 0 15px 0; width: 100%; display: block; box-sizing: border-box;">
                <option value="Bogotá">Bogotá</option>
                <option value="Medellín">Medellín</option>
                <option value="Cali">Cali</option>
                <option value="Barranquilla">Barranquilla</option>
            </select>
        `;
    }

    const { value: formValues } = await Swal.fire({
        title: title,
        html: `
            <div style="text-align: left; margin-top: 10px;">
                <label for="swal-input-name" style="display: block; margin-bottom: 5px; font-weight: 500;">Nombre del Proceso</label>
                <input id="swal-input-name" class="swal2-input" placeholder="Ej: Gestión de..." style="margin: 0 0 15px 0; width: 100%; box-sizing: border-box;">
                
                <label for="swal-input-status" style="display: block; margin-bottom: 5px; font-weight: 500;">Estado</label>
                <select id="swal-input-status" class="swal2-select" style="margin: 0 0 15px 0; width: 100%; display: block; box-sizing: border-box;">
                    <option value="Pendiente de aprobación">Pendiente de aprobación</option>
                    <option value="Vigente">Vigente</option>
                    <option value="Obsoleto">Obsoleto</option>
                </select>

                ${extraFields}
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#4361ee',
        cancelButtonColor: '#d33',
        preConfirm: () => {
            const name = document.getElementById('swal-input-name').value;
            const status = document.getElementById('swal-input-status').value;
            let sede = '';
            
            if (currentTab === 'Operacionales' || currentTab === 'De Apoyo') {
                const sedeEl = document.getElementById('swal-input-sede');
                if(sedeEl) sede = sedeEl.value;
            }

            if (!name) {
                Swal.showValidationMessage('Por favor ingrese el nombre del proceso');
                return false;
            }

            return { name, status, sede };
        }
    });

    if (formValues) {
        
        const payload = {
            token: sessionStorage.getItem('token'),
            idEmpresa: idEmpresa,
            tabName: currentTab,
            name: formValues.name,
            status: formValues.status,
            sede: formValues.sede
        };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(response => {
            if (response.status === 'ok' || response.result) {
                loadProcesses();
                Swal.fire({
                    icon: 'success',
                    title: '¡Guardado!',
                    text: `El proceso "${formValues.name}" ha sido creado exitosamente.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('Error', response.result?.error_message || 'No se pudo guardar', 'error');
            }
        }).catch(console.error);
    }
}

window.viewDetails = function(code) {
    const process = processes[currentTab].find(p => p.code === code);

    if (process) {
        const baseUrl = '../planear/process/processSheet.php';
        const params = `code=${code}&name=${encodeURIComponent(process.name)}&status=${encodeURIComponent(process.status)}`;
        const fullUrl = `${baseUrl}?${params}`;
        
        // Use hash navigation so dashboard loads it embedded
        window.location.hash = encodeURIComponent(fullUrl);
    } else {
        Swal.fire('Error', 'No se encontró la información del proceso.', 'error');
    }
}

window.editProcess = async function(idProceso) {
    const process = processes[currentTab].find(p => p.idProceso === idProceso || p.idProceso == idProceso);
    if (!process) return;

    let title = `Editar Proceso ${process.code}`;
    let extraFields = '';
    let sedeValue = process.sede || '';

    // Determine if we need the Sede field
    if (currentTab === 'Operacionales' || currentTab === 'De Apoyo') {
        const sedes = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'];
        let optionsHtml = sedes.map(s => 
            `<option value="${s}" ${s === sedeValue ? 'selected' : ''}>${s}</option>`
        ).join('');

        extraFields = `
            <label for="swal-input-sede" style="display: block; margin-bottom: 5px; font-weight: 500;">Sede</label>
            <select id="swal-input-sede" class="swal2-select" style="margin: 0 0 15px 0; width: 100%; display: block; box-sizing: border-box;">
                ${optionsHtml}
            </select>
        `;
    }

    const { value: formValues } = await Swal.fire({
        title: title,
        html: `
            <div style="text-align: left; margin-top: 10px;">
                <label for="swal-input-name" style="display: block; margin-bottom: 5px; font-weight: 500;">Nombre del Proceso</label>
                <input id="swal-input-name" class="swal2-input" value="${process.name}" placeholder="Ej: Gestión de..." style="margin: 0 0 15px 0; width: 100%; box-sizing: border-box;">
                
                <label for="swal-input-status" style="display: block; margin-bottom: 5px; font-weight: 500;">Estado</label>
                <select id="swal-input-status" class="swal2-select" style="margin: 0 0 15px 0; width: 100%; display: block; box-sizing: border-box;">
                    <option value="Pendiente de aprobación" ${process.status === 'Pendiente de aprobación' ? 'selected' : ''}>Pendiente de aprobación</option>
                    <option value="Vigente" ${process.status === 'Vigente' ? 'selected' : ''}>Vigente</option>
                    <option value="Obsoleto" ${process.status === 'Obsoleto' ? 'selected' : ''}>Obsoleto</option>
                </select>

                ${extraFields}
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#f2994a', // Orange for edit
        cancelButtonColor: '#d33',
        preConfirm: () => {
            const name = document.getElementById('swal-input-name').value;
            const status = document.getElementById('swal-input-status').value;
            let sede = '';
            
            if (currentTab === 'Operacionales' || currentTab === 'De Apoyo') {
                const sedeEl = document.getElementById('swal-input-sede');
                if(sedeEl) sede = sedeEl.value;
            }

            if (!name) {
                Swal.showValidationMessage('Por favor ingrese el nombre del proceso');
                return false;
            }

            return { name, status, sede };
        }
    });

    if (formValues) {
        
        const payload = {
            token: sessionStorage.getItem('token'),
            idProceso: process.idProceso,
            name: formValues.name,
            status: formValues.status,
            sede: formValues.sede
        };

        fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(response => {
            if (response.status === 'ok' || response.result) {
                loadProcesses();
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: `El proceso ha sido actualizado correctamente.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('Error', response.result?.error_message || 'No se pudo actualizar', 'error');
            }
        }).catch(console.error);
    }
}

window.deleteProcess = function(idProceso, code) {
    Swal.fire({
        title: '¿Está seguro?',
        text: `Se eliminará el proceso ${code}. Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#eb5757',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            
            fetch(API_URL, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: sessionStorage.getItem('token'), idProceso: idProceso })
            })
            .then(res => res.json())
            .then(response => {
                if(response.status === 'ok' || response.result) {
                    loadProcesses();
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: `El proceso ${code} ha sido eliminado.`,
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el proceso.', 'error');
                }
            });
        }
    });
}

// Rendering Logic
function renderTable(data) {
    const container = document.getElementById("processListContainer");
    
    if (!data || data.length === 0) {
        container.innerHTML = `<div class="empty-state">No hay procesos registrados en esta categoría.</div>`;
        return;
    }

    let html = `
        <table class="modern-table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre Proceso</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
                    <th>Fecha Modificación</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(item => {
        const badgeClass = getBadgeClass(item.status);
        html += `
            <tr>
                <td><strong>${item.code}</strong></td>
                <td>${item.name}</td>
                <td><span class="badge ${badgeClass}">${item.status}</span></td>
                <td>${item.created}</td>
                <td>${item.modified}</td>
                <td class="actions-cell" style="display: flex; gap: 8px; justify-content: center;">
                    <button class="btn-view-premium" onclick="viewDetails('${item.code}')" title="Ver Detalle">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit-premium" onclick="editProcess('${item.idProceso}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete-premium" onclick="deleteProcess('${item.idProceso}', '${item.code}')" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
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
