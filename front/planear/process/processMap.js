// Data Models
const processes = {
    'Estratégicos': [
        { code: "PE-001", name: "Planeación Estratégica", status: "Vigente", created: "2023-01-15", modified: "2023-06-20" },
        { code: "PE-002", name: "Gestión de Calidad", status: "Vigente", created: "2023-02-10", modified: "2023-07-05" },
        { code: "PE-003", name: "Innovación y Desarrollo", status: "Pendiente de aprobación", created: "2023-03-05", modified: "2023-08-12" }
    ],
    'Operacionales': [
        { code: "PO-001", name: "Gestión Comercial", status: "Vigente", created: "2023-01-20", modified: "2023-05-15" },
        { code: "PO-002", name: "Producción", status: "Vigente", created: "2023-02-01", modified: "2023-06-10" },
        { code: "PO-003", name: "Logística", status: "Obsoleto", created: "2023-03-10", modified: "2023-04-01" }
    ],
    'De Apoyo': [
        { code: "PA-001", name: "Gestión Humana", status: "Vigente", created: "2023-01-10", modified: "2023-09-01" },
        { code: "PA-002", name: "Gestión Financiera", status: "Vigente", created: "2023-01-12", modified: "2023-08-20" },
        { code: "PA-003", name: "Mantenimiento", status: "Pendiente de aprobación", created: "2023-04-05", modified: "2023-07-15" }
    ]
};

// State
let currentTab = 'Estratégicos';

// Initialization
// Initialization
function init() {
    console.log("Process Map Initialized");
    renderTable(processes[currentTab]);
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
                sede = document.getElementById('swal-input-sede').value;
            }

            if (!name) {
                Swal.showValidationMessage('Por favor ingrese el nombre del proceso');
                return false;
            }

            return { name, status, sede };
        }
    });

    if (formValues) {
        // Simulate saving data
        let prefix = 'PE';
        if (currentTab === 'Operacionales') prefix = 'PO';
        if (currentTab === 'De Apoyo') prefix = 'PA';

        const newCode = `${prefix}-00${processes[currentTab].length + 1}`;
        const today = new Date().toISOString().split('T')[0];
        
        const newProcess = {
            code: newCode,
            name: formValues.name,
            status: formValues.status,
            created: today,
            modified: today,
            // We store 'sede' even if not currently shown in the main table
            sede: formValues.sede 
        };

        processes[currentTab].push(newProcess);
        renderTable(processes[currentTab]);

        Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: `El proceso "${formValues.name}" ha sido creado exitosamente.`,
            timer: 2000,
            showConfirmButton: false
        });
    }
}

window.viewDetails = function(code) {
    console.log("viewDetails called for:", code);
    console.log("Current Tab:", currentTab);
    
    // Find the process to get its details
    const process = processes[currentTab].find(p => p.code === code);
    console.log("Found process:", process);

    if (process) {
        const baseUrl = '../planear/process/processSheet.php';
        const params = `code=${code}&name=${encodeURIComponent(process.name)}&status=${encodeURIComponent(process.status)}`;
        const fullUrl = `${baseUrl}?${params}`;
        
        console.log("Navigating via hash to:", fullUrl);
        // Use hash navigation so dashboard loads it embedded
        window.location.hash = encodeURIComponent(fullUrl);
    } else {
        console.error("Process not found");
        Swal.fire('Error', 'No se encontró la información del proceso.', 'error');
    }
}

window.editProcess = async function(code) {
    const processIndex = processes[currentTab].findIndex(p => p.code === code);
    if (processIndex === -1) return;

    const process = processes[currentTab][processIndex];
    let title = `Editar Proceso ${code}`;
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
                sede = document.getElementById('swal-input-sede').value;
            }

            if (!name) {
                Swal.showValidationMessage('Por favor ingrese el nombre del proceso');
                return false;
            }

            return { name, status, sede };
        }
    });

    if (formValues) {
        // Update data
        processes[currentTab][processIndex].name = formValues.name;
        processes[currentTab][processIndex].status = formValues.status;
        processes[currentTab][processIndex].modified = new Date().toISOString().split('T')[0];
        if (formValues.sede) {
            processes[currentTab][processIndex].sede = formValues.sede;
        }

        renderTable(processes[currentTab]);

        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: `El proceso "${formValues.name}" ha sido actualizado correctamente.`,
            timer: 2000,
            showConfirmButton: false
        });
    }
}

window.deleteProcess = function(code) {
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
            // Simulate deletion
            const index = processes[currentTab].findIndex(p => p.code === code);
            if (index > -1) {
                processes[currentTab].splice(index, 1);
                renderTable(processes[currentTab]);
                
                Swal.fire({
                    title: '¡Eliminado!',
                    text: `El proceso ${code} ha sido eliminado.`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        }
    });
}

// Rendering Logic
function renderTable(data) {
    const container = document.getElementById("processListContainer");
    
    if (data.length === 0) {
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
                <td class="actions-cell">
                    <button class="btn-icon btn-view" onclick="viewDetails('${item.code}')" title="Ver">
                        👁️
                    </button>
                    <button class="btn-icon btn-edit" onclick="editProcess('${item.code}')" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteProcess('${item.code}')" title="Eliminar">
                        🗑️
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
