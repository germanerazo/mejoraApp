// Dummy Data for Activities and other sections
let activities = [
    { id: 1, name: "Análisis de mercado y tendencias", area: "Mercadeo", routine: "Sí", highRisk: "No" },
    { id: 2, name: "Mantenimiento preventivo de servidores", area: "Tecnología", routine: "No", highRisk: "Sí" },
    { id: 3, name: "Capacitación de personal nuevo", area: "Talento Humano", routine: "Sí", highRisk: "No" }
];
let resources = [
    { id: 1, name: "Servidor de Base de Datos SQL" },
    { id: 2, name: "Licencias Office 365 Business" },
    { id: 3, name: "Sala de Juntas Principal" },
    { id: 4, name: "Vehículo de Transporte 5 Ton" }
];
let inputs = [
    { id: 1, name: "Requerimientos Técnicos del Cliente" },
    { id: 2, name: "Normativa ISO 9001:2015" },
    { id: 3, name: "Plan Estratégico Anual 2024" },
    { id: 4, name: "Solicitudes de Soporte (Tickets)" }
];
let procedures = [
    { id: 1, name: "Procedimiento de Gestión de Cambios", file: "gestion_cambios_v2.pdf" },
    { id: 2, name: "Protocolo de Seguridad de la Información", file: "seguridad_info_2024.docx" },
    { id: 3, name: "Manual de Usuario - ERP", file: "manual_erp.pdf" }
];
let personnel = [
    { 
        id: 1, 
        role: "Analista de Soporte L2", 
        reportsTo: "Coordinador de Mesa de Ayuda", 
        quantity: "3",
        responsibilities: [
            "Atender incidentes reportados nivel 2",
            "Documentar soluciones en base de conocimientos",
            "Realizar mantenimiento preventivo a equipos de usuario final"
        ],
        accountabilities: [
            "Cumplimiento de SLA de respuesta < 4h",
            "Satisfacción del usuario > 4.5/5"
        ]
    },
    { 
        id: 2, 
        role: "Líder de Proyecto", 
        reportsTo: "Gerente de Tecnología", 
        quantity: "1",
        responsibilities: [
            "Gestionar el backlog del producto",
            "Facilitar ceremonias ágiles (Daily, Planning, Review)",
            "Reportar avance de cronograma a stakeholders"
        ],
        accountabilities: [
            "Entrega de sprints a tiempo",
            "Presupuesto del proyecto",
            "Calidad de entregables (Bugs < 5)"
        ]
    }
];

// Initialization
// Initialization Logic
const initSheet = () => {
    // Helper to get params from the hash URL mainly
    const getParams = () => {
        const hash = window.location.hash;
        if (!hash) return new URLSearchParams();
        
        const decoded = decodeURIComponent(hash.substring(1)); // remove #
        const questionMarkIndex = decoded.indexOf('?');
        if (questionMarkIndex === -1) return new URLSearchParams();
        
        return new URLSearchParams(decoded.substring(questionMarkIndex + 1));
    };

    const urlParams = getParams();
    const code = urlParams.get('code');
    const name = urlParams.get('name');
    const status = urlParams.get('status');
    const date = new Date().toISOString().split('T')[0]; // Current date for demo

    if (code) {
        document.getElementById('processCode').textContent = code;
        document.getElementById('processName').textContent = name || 'Proceso Desconocido';
        document.getElementById('processDate').textContent = date;
        
        const statusEl = document.getElementById('processStatus');
        let badgeClass = '';
        switch(status) {
            case 'Vigente': badgeClass = 'active'; break;
            case 'Pendiente de aprobación': badgeClass = 'review'; break;
            case 'Obsoleto': badgeClass = 'inactive'; break;
        }
        statusEl.innerHTML = `<span class="badge ${badgeClass}">${status || 'Desconocido'}</span>`;
    }

    renderActivities();
    renderResources();
    renderInputs();
    renderProcedures();
    renderPersonnel();
};

// Check if DOM is already ready (which it is for injected scripts)
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initSheet);
} else {
    initSheet();
}

// Global Functions
window.saveSheet = function() {
    const objeto = document.getElementById('objetoAlcance').value;
    const responsable = document.getElementById('responsable').value;

    if (!objeto.trim() || !responsable.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Incompletos',
            text: 'Por favor diligencie el Objetivo y el Responsable antes de guardar.'
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'La ficha del proceso ha sido guardada exitosamente.',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        // Reveal the details section
        document.getElementById('detailsSection').style.display = 'block';
    });
}

window.goBack = function() {
    // Navigate back to the main map via hash
    const url = '../planear/process/processMap.php';
    window.location.hash = encodeURIComponent(url);
}

window.addActivity = async function() {
    const { value: formValues } = await Swal.fire({
        title: 'Nueva Actividad',
        html: `
            <input id="swal-activity" class="swal2-input" placeholder="Nombre de la actividad">
            <input id="swal-area" class="swal2-input" placeholder="Área">
            <div style="margin-top: 20px; display: flex; gap: 20px; justify-content: center;">
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 15px;">
                    <input type="checkbox" id="swal-routine" style="width: 20px; height: 20px; margin-right: 8px; accent-color: #4CAF50;"> 
                    Actividad Rutinaria
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 15px;">
                    <input type="checkbox" id="swal-risk" style="width: 20px; height: 20px; margin-right: 8px; accent-color: #dc3545;"> 
                    Alto Riesgo
                </label>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        preConfirm: () => {
            return {
                name: document.getElementById('swal-activity').value,
                area: document.getElementById('swal-area').value,
                routine: document.getElementById('swal-routine').checked ? 'Sí' : 'No',
                highRisk: document.getElementById('swal-risk').checked ? 'Sí' : 'No'
            }
        }
    });

    if (formValues) {
        if (!formValues.name) {
            Swal.fire('Error', 'El nombre de la actividad es obligatorio', 'error');
            return;
        }
        
        activities.push({
            id: activities.length + 1,
            ...formValues
        });
        renderActivities();
        
        Swal.fire({
            icon: 'success',
            title: 'Agregada',
            timer: 1500,
            showConfirmButton: false
        });
    }
}

window.editActivity = async function(id) {
    const item = activities.find(a => a.id === id);
    if (!item) return;

    const { value: formValues } = await Swal.fire({
        title: 'Editar Actividad',
        html: `
            <input id="swal-activity" class="swal2-input" placeholder="Nombre de la actividad" value="${item.name}">
            <input id="swal-area" class="swal2-input" placeholder="Área" value="${item.area}">
            <div style="margin-top: 20px; display: flex; gap: 20px; justify-content: center;">
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 15px;">
                    <input type="checkbox" id="swal-routine" style="width: 20px; height: 20px; margin-right: 8px; accent-color: #4CAF50;" ${item.routine === 'Sí' ? 'checked' : ''}> 
                    Actividad Rutinaria
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 15px;">
                    <input type="checkbox" id="swal-risk" style="width: 20px; height: 20px; margin-right: 8px; accent-color: #dc3545;" ${item.highRisk === 'Sí' ? 'checked' : ''}> 
                    Alto Riesgo
                </label>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        preConfirm: () => {
            return {
                name: document.getElementById('swal-activity').value,
                area: document.getElementById('swal-area').value,
                routine: document.getElementById('swal-routine').checked ? 'Sí' : 'No',
                highRisk: document.getElementById('swal-risk').checked ? 'Sí' : 'No'
            }
        }
    });

    if (formValues && formValues.name) {
        Object.assign(item, formValues);
        renderActivities();
        Swal.fire('Actualizada', '', 'success');
    }
}

function renderActivities() {
    const tbody = document.querySelector('#activitiesTable tbody');
    if (activities.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No hay actividades registradas.</td></tr>`;
        return;
    }

    let html = '';
    activities.forEach(act => {
        html += `
            <tr>
                <td>
                    <button class="btn-edit-premium" title="Editar" onclick="editActivity(${act.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete-premium" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                </td>
                <td>${act.name}</td>
                <td>${act.area}</td>
                <td>${act.routine}</td>
                <td>${act.highRisk}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// --- RESOURCES ---
window.addResource = async function() {
    const { value: formValues } = await Swal.fire({
        title: 'Nuevo Recurso',
        html: `
            <input id="swal-res-name" class="swal2-input" placeholder="Nombre del Recurso">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        preConfirm: () => {
            return {
                name: document.getElementById('swal-res-name').value
            }
        }
    });

    if (formValues && formValues.name) {
        resources.push({ id: resources.length + 1, ...formValues });
        renderResources();
        Swal.fire('Agregado', '', 'success');
    }
}

window.editResource = async function(id) {
    const item = resources.find(r => r.id === id);
    if (!item) return;

    const { value: formValues } = await Swal.fire({
        title: 'Editar Recurso',
        html: `
            <input id="swal-res-name" class="swal2-input" placeholder="Nombre del Recurso" value="${item.name}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        preConfirm: () => {
            return {
                name: document.getElementById('swal-res-name').value
            }
        }
    });

    if (formValues && formValues.name) {
        Object.assign(item, formValues);
        renderResources();
        Swal.fire('Actualizado', '', 'success');
    }
}

function renderResources() {
    const tbody = document.querySelector('#resourcesTable tbody');
    if (!tbody) return;
    if (resources.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" class="empty-state">No hay recursos registrados.</td></tr>`;
        return;
    }
    let html = '';
    resources.forEach(item => {
        html += `<tr>
            <td>
                <button class="btn-edit-premium" title="Editar" onclick="editResource(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-delete-premium" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
            </td>
            <td>${item.name}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// --- INPUTS ---
window.addInput = async function() {
    const { value: formValues } = await Swal.fire({
        title: 'Nuevo Insumo',
        html: `
            <input id="swal-inp-name" class="swal2-input" placeholder="Nombre del Insumo">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        preConfirm: () => {
            return {
                name: document.getElementById('swal-inp-name').value
            }
        }
    });

    if (formValues && formValues.name) {
        inputs.push({ id: inputs.length + 1, ...formValues });
        renderInputs();
        Swal.fire('Agregado', '', 'success');
    }
}

window.editInput = async function(id) {
    const item = inputs.find(i => i.id === id);
    if (!item) return;

    const { value: formValues } = await Swal.fire({
        title: 'Editar Insumo',
        html: `
            <input id="swal-inp-name" class="swal2-input" placeholder="Nombre del Insumo" value="${item.name}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        preConfirm: () => {
            return {
                name: document.getElementById('swal-inp-name').value
            }
        }
    });

    if (formValues && formValues.name) {
        Object.assign(item, formValues);
        renderInputs();
        Swal.fire('Actualizado', '', 'success');
    }
}

function renderInputs() {
    const tbody = document.querySelector('#inputsTable tbody');
    if (!tbody) return;
    if (inputs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" class="empty-state">No hay insumos registrados.</td></tr>`;
        return;
    }
    let html = '';
    inputs.forEach(item => {
        html += `<tr>
            <td>
                <button class="btn-edit-premium" title="Editar" onclick="editInput(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-delete-premium" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
            </td>
            <td>${item.name}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// --- PROCEDURES ---
window.addProcedure = async function() {
    const { value: formValues } = await Swal.fire({
        title: 'Nuevo Procedimiento',
        html: `
            <input id="swal-proc-name" class="swal2-input" placeholder="Nombre del Procedimiento">
            <div class="file-upload-wrapper" style="margin-top: 15px;">
                <label for="swal-proc-file" class="btn-secondary-premium" style="cursor: pointer; display: inline-block; padding: 10px; border: 1px dashed #ccc; width: 80%;">
                    📂 Seleccionar Archivo
                </label>
                <input type="file" id="swal-proc-file" style="display: none;" onchange="document.getElementById('file-name-display').innerText = this.files[0] ? this.files[0].name : ''">
                <div id="file-name-display" style="margin-top: 5px; font-size: 12px; color: #666;"></div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        preConfirm: () => {
            const fileInput = document.getElementById('swal-proc-file');
            const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'Sin archivo';
            return {
                name: document.getElementById('swal-proc-name').value,
                file: fileName
            }
        }
    });

    if (formValues && formValues.name) {
        procedures.push({ id: procedures.length + 1, ...formValues });
        renderProcedures();
        Swal.fire('Agregado', '', 'success');
    }
}

window.editProcedure = async function(id) {
    const item = procedures.find(p => p.id === id);
    if (!item) return;

    const { value: formValues } = await Swal.fire({
        title: 'Editar Procedimiento',
        html: `
            <input id="swal-proc-name" class="swal2-input" placeholder="Nombre del Procedimiento" value="${item.name}">
            <div class="file-upload-wrapper" style="margin-top: 15px;">
                <label for="swal-proc-file" class="btn-secondary-premium" style="cursor: pointer; display: inline-block; padding: 10px; border: 1px dashed #ccc; width: 80%;">
                    📂 Actualizar Archivo
                </label>
                <input type="file" id="swal-proc-file" style="display: none;" onchange="document.getElementById('file-name-display-edit').innerText = this.files[0] ? this.files[0].name : ''">
                <div id="file-name-display-edit" style="margin-top: 5px; font-size: 12px; color: #666;">${item.file}</div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        preConfirm: () => {
            const fileInput = document.getElementById('swal-proc-file');
            return {
                name: document.getElementById('swal-proc-name').value,
                file: fileInput.files.length > 0 ? fileInput.files[0].name : item.file // Keep old file if no new one
            }
        }
    });

    if (formValues) {
        Object.assign(item, formValues);
        renderProcedures();
        Swal.fire('Actualizado', '', 'success');
    }
}

function renderProcedures() {
    const tbody = document.querySelector('#proceduresTable tbody');
    if (!tbody) return;
    if (procedures.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="empty-state">No hay procedimientos registrados.</td></tr>`;
        return;
    }
    let html = '';
    procedures.forEach(item => {
        html += `<tr>
            <td>
                <button class="btn-edit-premium" title="Editar" onclick="editProcedure(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-delete-premium" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
            </td>
            <td>${item.name}</td>
            <td><a href="#" onclick="return false;">📄 ${item.file}</a></td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// --- PERSONNEL ---
window.addPersonnel = async function() {
    const { value: formValues } = await Swal.fire({
        title: 'Nuevo Personal',
        html: `
            <input id="swal-pers-role" class="swal2-input" placeholder="Cargo">
            <input id="swal-pers-report" class="swal2-input" placeholder="Cargo al que reporta">
            <input type="number" id="swal-pers-qty" class="swal2-input" placeholder="Número de personas">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        preConfirm: () => {
            return {
                role: document.getElementById('swal-pers-role').value,
                reportsTo: document.getElementById('swal-pers-report').value,
                quantity: document.getElementById('swal-pers-qty').value
            }
        }
    });

    if (formValues && formValues.role) {
        personnel.push({ id: personnel.length + 1, ...formValues });
        renderPersonnel();
        Swal.fire('Agregado', '', 'success');
    }
}

window.managePersonnelDetails = async function(id) {
    const item = personnel.find(p => p.id === id);
    if (!item) return;

    // Initialize arrays if they don't exist
    let tempResp = [...(item.responsibilities || [])];
    let tempAcc = [...(item.accountabilities || [])];

    const renderLists = () => {
        const respList = document.getElementById('list-resp');
        const accList = document.getElementById('list-acc');
        
        if (respList) {
            respList.innerHTML = tempResp.map((r, i) => `
                <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding: 5px; background: #f8f9fa; border-radius: 4px;">
                    <span>${r}</span>
                    <button class="btn-icon btn-delete-small" data-type="resp" data-index="${i}" style="color: #dc3545; border: none; background: none; cursor: pointer;">✕</button>
                </li>
            `).join('');
        }

        if (accList) {
            accList.innerHTML = tempAcc.map((r, i) => `
                <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding: 5px; background: #f8f9fa; border-radius: 4px;">
                    <span>${r}</span>
                    <button class="btn-icon btn-delete-small" data-type="acc" data-index="${i}" style="color: #dc3545; border: none; background: none; cursor: pointer;">✕</button>
                </li>
            `).join('');
        }
    };

    await Swal.fire({
        title: `Detalles: ${item.role}`,
        width: '800px',
        html: `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left;">
                <!-- Responsabilidades -->
                <div>
                    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">Responsabilidades</h3>
                    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                        <input id="input-resp" class="swal2-input" placeholder="Nueva responsabilidad" style="margin: 0; height: 35px; flex-grow: 1; font-size: 13px;">
                        <button id="btn-add-resp" class="btn-new-record" style="padding: 0 10px; border-radius: 4px !important; width: 35px; height: 35px; min-width: 0;">+</button>
                    </div>
                    <ul id="list-resp" style="list-style: none; padding: 0; max-height: 200px; overflow-y: auto;"></ul>
                </div>

                <!-- Rendición de Cuentas -->
                <div>
                    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">Rendición de Cuentas</h3>
                    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                        <input id="input-acc" class="swal2-input" placeholder="Nueva rendición" style="margin: 0; height: 35px; flex-grow: 1; font-size: 13px;">
                        <button id="btn-add-acc" class="btn-new-record" style="padding: 0 10px; border-radius: 4px !important; width: 35px; height: 35px; min-width: 0;">+</button>
                    </div>
                    <ul id="list-acc" style="list-style: none; padding: 0; max-height: 200px; overflow-y: auto;"></ul>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar Cambios',
        didOpen: () => {
            renderLists();

            // Add Logic
            document.getElementById('btn-add-resp').addEventListener('click', () => {
                const val = document.getElementById('input-resp').value.trim();
                if (val) {
                    tempResp.push(val);
                    document.getElementById('input-resp').value = '';
                    renderLists();
                }
            });

            document.getElementById('btn-add-acc').addEventListener('click', () => {
                const val = document.getElementById('input-acc').value.trim();
                if (val) {
                    tempAcc.push(val);
                    document.getElementById('input-acc').value = '';
                    renderLists();
                }
            });

            // Remove Logic (Event Delegation)
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete-small')) {
                    const type = e.target.getAttribute('data-type');
                    const index = parseInt(e.target.getAttribute('data-index'));
                    
                    if (type === 'resp') tempResp.splice(index, 1);
                    if (type === 'acc') tempAcc.splice(index, 1);
                    renderLists();
                }
            });
        },
        preConfirm: () => {
            return { responsibilities: tempResp, accountabilities: tempAcc };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            item.responsibilities = result.value.responsibilities;
            item.accountabilities = result.value.accountabilities;
            renderPersonnel(); // Update the table to show new counts
            Swal.fire('Guardado', 'Los detalles han sido actualizados.', 'success');
        }
    });
}

window.editPersonnel = async function(id) {
    const item = personnel.find(p => p.id === id);
    if (!item) return;

    const { value: formValues } = await Swal.fire({
        title: 'Editar Personal',
        html: `
            <input id="swal-pers-role" class="swal2-input" placeholder="Cargo" value="${item.role}">
            <input id="swal-pers-report" class="swal2-input" placeholder="Cargo al que reporta" value="${item.reportsTo}">
            <input type="number" id="swal-pers-qty" class="swal2-input" placeholder="Número de personas" value="${item.quantity}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        preConfirm: () => {
            return {
                role: document.getElementById('swal-pers-role').value,
                reportsTo: document.getElementById('swal-pers-report').value,
                quantity: document.getElementById('swal-pers-qty').value
            }
        }
    });

    if (formValues) {
        Object.assign(item, formValues);
        renderPersonnel();
        Swal.fire('Actualizado', '', 'success');
    }
}

function renderPersonnel() {
    const tbody = document.querySelector('#personnelTable tbody');
    if (!tbody) return;
    if (personnel.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No hay personal registrado.</td></tr>`;
        return;
    }
    let html = '';
    personnel.forEach(item => {
        const respCount = item.responsibilities ? item.responsibilities.length : 0;
        const accCount = item.accountabilities ? item.accountabilities.length : 0;

        html += `<tr>
            <td>
                <button class="btn-edit-premium" title="Editar" onclick="editPersonnel(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-delete-premium" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
            </td>
            <td>${item.role}</td>
            <td>${item.reportsTo}</td>
            <td>${item.quantity}</td>
            <td style="text-align: center;">
                <button class="btn-secondary-premium" onclick="managePersonnelDetails(${item.id})" style="padding: 5px 10px; font-size: 12px; border-radius: 4px; border: 1px solid #ccc; background: #f0f0f0; cursor: pointer;">
                    Gestionar Detalles
                </button>
            </td>
            <td style="text-align: center;">${respCount}</td>
            <td style="text-align: center;">${accCount}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}
