import config from "../../js/config.js";

const API_URL = `${config.BASE_API_URL}processSheet.php`;

let idEmpresa = null;
let currentCode = null;
let idFicha = null; // ID of the saved sheet

// State Collections
let activities = [];
let resources = [];
let inputs = [];
let procedures = [];
let personnel = [];

// Initialization Logic
const initSheet = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.idClient) {
        Swal.fire('Error', 'No se ha encontrado la sesión de la empresa.', 'error');
        return;
    }
    idEmpresa = user.idClient;

    const getParams = () => {
        const hash = window.location.hash;
        if (!hash) return new URLSearchParams();
        const decoded = decodeURIComponent(hash.substring(1));
        const questionMarkIndex = decoded.indexOf('?');
        if (questionMarkIndex === -1) return new URLSearchParams();
        return new URLSearchParams(decoded.substring(questionMarkIndex + 1));
    };

    const urlParams = getParams();
    currentCode = urlParams.get('code');
    const name = urlParams.get('name');
    const status = urlParams.get('status');
    const date = new Date().toISOString().split('T')[0];

    if (currentCode) {
        document.getElementById('processCode').textContent = currentCode;
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

        loadDynamicData();
    }
};

function loadDynamicData() {
    fetch(`${API_URL}?idEmpresa=${idEmpresa}&code=${currentCode}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.sheet) {
                idFicha = data.sheet.idFicha;
                document.getElementById('objetoAlcance').value = data.sheet.objeto || "";
                document.getElementById('responsable').value = data.sheet.responsable || "";
                
                activities = data.activities || [];
                resources = data.resources || [];
                inputs = data.inputs || [];
                procedures = data.procedures || [];
                personnel = data.personnel || [];

                document.getElementById('detailsSection').style.display = 'block';
            } else {
                idFicha = null;
                document.getElementById('objetoAlcance').value = "";
                document.getElementById('responsable').value = "";
                activities = [];
                resources = [];
                inputs = [];
                procedures = [];
                personnel = [];
                document.getElementById('detailsSection').style.display = 'none';
            }

            renderActivities();
            renderResources();
            renderInputs();
            renderProcedures();
            renderPersonnel();
        })
        .catch(err => {
            console.error(err);
            Swal.fire('Error', 'No se pudieron cargar los datos de la ficha', 'error');
        });
}

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

    const payload = {
        token: sessionStorage.getItem('token'),
        idEmpresa: idEmpresa,
        code: currentCode,
        objeto: objeto,
        responsable: responsable
    };

    fetch(`${API_URL}?action=saveSheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(response => {
        if (response.status === 'ok' || response.result) {
            Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'La ficha del proceso ha sido guardada exitosamente.',
                timer: 1500,
                showConfirmButton: false
            });
            loadDynamicData(); // Reload to get idFicha
        } else {
            Swal.fire('Error', 'No se pudo guardar la ficha.', 'error');
        }
    }).catch(console.error);
}

window.goBack = function() {
    const url = '../planear/process/processMap.php';
    window.location.hash = encodeURIComponent(url);
}

// Generic Manage Function
function manageItemDB(action, tableName, itemData, id = null) {
    if (!idFicha) {
        Swal.fire('Error', 'Primero debes Guardar la ficha principal.', 'warning');
        return Promise.reject("No idFicha");
    }

    const payload = {
        token: sessionStorage.getItem('token'),
        idFicha: idFicha,
        table: tableName,
        action: action, // 'add', 'edit', 'delete'
        item: itemData,
        id: id
    };

    return fetch(`${API_URL}?action=manageItem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(res => res.json());
}

// --- ACTIVITIES ---
window.addActivity = async function() {
    if (!idFicha) return Swal.fire('Error', 'Guarda primero la información de la Ficha.', 'warning');

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

    if (formValues && formValues.name) {
        manageItemDB('add', 'process_activity', formValues).then(res => {
            if (res.status === 'ok' || res.result) loadDynamicData();
        });
    }
}

window.editActivity = async function(id) {
    const item = activities.find(a => a.idActivity == id);
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
        manageItemDB('edit', 'process_activity', formValues, id).then(res => {
            if (res.status === 'ok' || res.result) loadDynamicData();
        });
    }
}

window.deleteActivity = function(id) {
    Swal.fire({
        title: '¿Eliminar Actividad?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar'
    }).then(res => {
        if(res.isConfirmed) {
            manageItemDB('delete', 'process_activity', null, id).then(() => loadDynamicData());
        }
    });
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
                    <button class="btn-edit-premium" title="Editar" onclick="editActivity(${act.idActivity})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete-premium" title="Eliminar" onclick="deleteActivity(${act.idActivity})"><i class="fas fa-trash-alt"></i></button>
                </td>
                <td>${act.name}</td>
                <td>${act.area}</td>
                <td>${act.routine}</td>
                <td>${act.highRisk}</td>
            </tr>`;
    });
    tbody.innerHTML = html;
}

// --- RESOURCES ---
window.addResource = async function() {
    if (!idFicha) return Swal.fire('Error', 'Guarda primero la ficha', 'warning');
    const { value: formValues } = await Swal.fire({
        title: 'Nuevo Recurso',
        html: `<input id="swal-res-name" class="swal2-input" placeholder="Nombre del Recurso">`,
        showCancelButton: true, confirmButtonText: 'Agregar',
        preConfirm: () => ({ name: document.getElementById('swal-res-name').value })
    });
    if (formValues && formValues.name) {
        manageItemDB('add', 'process_resource', formValues).then(() => loadDynamicData());
    }
}

window.editResource = async function(id) {
    const item = resources.find(r => r.idResource == id);
    if(!item) return;
    const { value: formValues } = await Swal.fire({
        title: 'Editar Recurso',
        html: `<input id="swal-res-name" class="swal2-input" value="${item.name}">`,
        showCancelButton: true, confirmButtonText: 'Actualizar',
        preConfirm: () => ({ name: document.getElementById('swal-res-name').value })
    });
    if (formValues && formValues.name) {
        manageItemDB('edit', 'process_resource', formValues, id).then(() => loadDynamicData());
    }
}

window.deleteResource = function(id) {
    Swal.fire({
        title: '¿Eliminar Recurso?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí'
    }).then(res => {
        if(res.isConfirmed) manageItemDB('delete', 'process_resource', null, id).then(() => loadDynamicData());
    });
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
            <td style="width: 120px;">
                <button class="btn-edit-premium" onclick="editResource(${item.idResource})"><i class="fas fa-edit"></i></button>
                <button class="btn-delete-premium" onclick="deleteResource(${item.idResource})"><i class="fas fa-trash-alt"></i></button>
            </td>
            <td>${item.name}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// --- INPUTS ---
window.addInput = async function() {
    if (!idFicha) return Swal.fire('Error', 'Guarda primero la ficha', 'warning');
    const { value: formValues } = await Swal.fire({
        title: 'Nuevo Insumo',
        html: `<input id="swal-inp-name" class="swal2-input" placeholder="Nombre del Insumo">`,
        showCancelButton: true, confirmButtonText: 'Agregar',
        preConfirm: () => ({ name: document.getElementById('swal-inp-name').value })
    });
    if (formValues && formValues.name) {
        manageItemDB('add', 'process_input', formValues).then(() => loadDynamicData());
    }
}

window.editInput = async function(id) {
    const item = inputs.find(i => i.idInput == id);
    if (!item) return;
    const { value: formValues } = await Swal.fire({
        title: 'Editar Insumo',
        html: `<input id="swal-inp-name" class="swal2-input" value="${item.name}">`,
        showCancelButton: true, confirmButtonText: 'Actualizar',
        preConfirm: () => ({ name: document.getElementById('swal-inp-name').value })
    });
    if (formValues && formValues.name) {
        manageItemDB('edit', 'process_input', formValues, id).then(() => loadDynamicData());
    }
}

window.deleteInput = function(id) {
    Swal.fire({
        title: '¿Eliminar Insumo?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí'
    }).then(res => {
        if(res.isConfirmed) manageItemDB('delete', 'process_input', null, id).then(() => loadDynamicData());
    });
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
            <td style="width: 120px;">
                <button class="btn-edit-premium" onclick="editInput(${item.idInput})"><i class="fas fa-edit"></i></button>
                <button class="btn-delete-premium" onclick="deleteInput(${item.idInput})"><i class="fas fa-trash-alt"></i></button>
            </td>
            <td>${item.name}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// --- PROCEDURES ---
window.addProcedure = async function() {
    if (!idFicha) return Swal.fire('Error', 'Guarda primero la ficha', 'warning');
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
        focusConfirm: false, showCancelButton: true, confirmButtonText: 'Agregar',
        preConfirm: () => {
            const fileInput = document.getElementById('swal-proc-file');
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null;
            return {
                name: document.getElementById('swal-proc-name').value,
                fileObj: file
            }
        }
    });

    if (formValues && formValues.name) {
        let fileContent = null;
        let fileName = '';

        if (formValues.fileObj) {
            fileName = formValues.fileObj.name;
            const reader = new FileReader();
            reader.readAsDataURL(formValues.fileObj);
            await new Promise(resolve => {
                reader.onload = () => { fileContent = reader.result; resolve(); };
            });
        }

        const payloadObj = {
            name: formValues.name,
            file: fileName,
            fileContent: fileContent
        };

        manageItemDB('add', 'process_procedure', payloadObj).then(() => loadDynamicData());
    }
}

window.editProcedure = async function(id) {
    const item = procedures.find(p => p.idProcedure == id);
    if (!item) return;

    const { value: formValues } = await Swal.fire({
        title: 'Editar Procedimiento',
        html: `
            <input id="swal-proc-name" class="swal2-input" value="${item.name}">
            <div class="file-upload-wrapper" style="margin-top: 15px;">
                <label for="swal-proc-file" class="btn-secondary-premium" style="cursor: pointer; display: inline-block; padding: 10px; border: 1px dashed #ccc; width: 80%;">
                    📂 Actualizar Archivo
                </label>
                <input type="file" id="swal-proc-file" style="display: none;" onchange="document.getElementById('file-name-display-edit').innerText = this.files[0] ? this.files[0].name : ''">
                <div id="file-name-display-edit" style="margin-top: 5px; font-size: 12px; color: #666;">${item.file}</div>
            </div>
        `,
        focusConfirm: false, showCancelButton: true, confirmButtonText: 'Actualizar',
        preConfirm: () => {
            const fileInput = document.getElementById('swal-proc-file');
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null;
            return {
                name: document.getElementById('swal-proc-name').value,
                fileObj: file
            }
        }
    });

    if (formValues && formValues.name) {
        let fileContent = null;
        let fileName = formValues.fileObj ? formValues.fileObj.name : item.file;

        if (formValues.fileObj) {
            const reader = new FileReader();
            reader.readAsDataURL(formValues.fileObj);
            await new Promise(resolve => {
                reader.onload = () => { fileContent = reader.result; resolve(); };
            });
        }

        const payloadObj = {
            name: formValues.name,
            file: fileName,
            fileContent: fileContent
        };

        manageItemDB('edit', 'process_procedure', payloadObj, id).then(() => loadDynamicData());
    }
}

window.deleteProcedure = function(id) {
    Swal.fire({
        title: '¿Eliminar Procedimiento?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí'
    }).then(res => {
        if(res.isConfirmed) manageItemDB('delete', 'process_procedure', null, id).then(() => loadDynamicData());
    });
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
        let fileLink = '-';
        if (item.file) {
            fileLink = `<a href="../../dataClients/${idEmpresa}/procedures/${item.idProcedure}_${item.file}" target="_blank" download="${item.file}" style="color: #4361ee; font-weight: 500; text-decoration: none;">📄 ${item.file}</a>`;
        }

        html += `<tr>
            <td style="width: 120px;">
                <button class="btn-edit-premium" onclick="editProcedure(${item.idProcedure})"><i class="fas fa-edit"></i></button>
                <button class="btn-delete-premium" onclick="deleteProcedure(${item.idProcedure})"><i class="fas fa-trash-alt"></i></button>
            </td>
            <td>${item.name}</td>
            <td>${fileLink}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// --- PERSONNEL ---
window.addPersonnel = async function() {
    if (!idFicha) return Swal.fire('Error', 'Guarda primero la ficha', 'warning');
    const { value: formValues } = await Swal.fire({
        title: 'Nuevo Personal',
        html: `
            <input id="swal-pers-role" class="swal2-input" placeholder="Cargo">
            <input id="swal-pers-report" class="swal2-input" placeholder="Cargo al que reporta">
            <input type="number" id="swal-pers-qty" class="swal2-input" placeholder="Número de personas">
        `,
        focusConfirm: false, showCancelButton: true, confirmButtonText: 'Agregar',
        preConfirm: () => {
            return {
                role: document.getElementById('swal-pers-role').value,
                reportsTo: document.getElementById('swal-pers-report').value,
                quantity: document.getElementById('swal-pers-qty').value,
                responsibilities: [],
                accountabilities: []
            }
        }
    });

    if (formValues && formValues.role) {
        manageItemDB('add', 'process_personnel', formValues).then(() => loadDynamicData());
    }
}

window.editPersonnel = async function(id) {
    const item = personnel.find(p => p.idPersonnel == id);
    if (!item) return;

    const { value: formValues } = await Swal.fire({
        title: 'Editar Personal',
        html: `
            <input id="swal-pers-role" class="swal2-input" value="${item.role}">
            <input id="swal-pers-report" class="swal2-input" value="${item.reportsTo}">
            <input type="number" id="swal-pers-qty" class="swal2-input" value="${item.quantity}">
        `,
        focusConfirm: false, showCancelButton: true, confirmButtonText: 'Actualizar',
        preConfirm: () => {
            return {
                role: document.getElementById('swal-pers-role').value,
                reportsTo: document.getElementById('swal-pers-report').value,
                quantity: document.getElementById('swal-pers-qty').value,
                responsibilities: item.responsibilities,
                accountabilities: item.accountabilities
            }
        }
    });

    if (formValues && formValues.role) {
        manageItemDB('edit', 'process_personnel', formValues, id).then(() => loadDynamicData());
    }
}

window.deletePersonnel = function(id) {
    Swal.fire({
        title: '¿Eliminar Personal?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí'
    }).then(res => {
        if(res.isConfirmed) manageItemDB('delete', 'process_personnel', null, id).then(() => loadDynamicData());
    });
}

window.managePersonnelDetails = async function(id) {
    const item = personnel.find(p => p.idPersonnel == id);
    if (!item) return;

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

    const result = await Swal.fire({
        title: `Detalles: ${item.role}`,
        width: '800px',
        html: `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left;">
                <div>
                    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">Responsabilidades</h3>
                    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                        <input id="input-resp" class="swal2-input" placeholder="Nueva responsabilidad" style="margin: 0; height: 35px; flex-grow: 1; font-size: 13px;">
                        <button id="btn-add-resp" class="btn-new-record" style="padding: 0 10px; border-radius: 4px !important; width: 35px; height: 35px; min-width: 0;">+</button>
                    </div>
                    <ul id="list-resp" style="list-style: none; padding: 0; max-height: 200px; overflow-y: auto;"></ul>
                </div>

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
        showCancelButton: true, confirmButtonText: 'Guardar Cambios',
        didOpen: () => {
            renderLists();
            document.getElementById('btn-add-resp').addEventListener('click', () => {
                const val = document.getElementById('input-resp').value.trim();
                if (val) { tempResp.push(val); document.getElementById('input-resp').value = ''; renderLists(); }
            });

            document.getElementById('btn-add-acc').addEventListener('click', () => {
                const val = document.getElementById('input-acc').value.trim();
                if (val) { tempAcc.push(val); document.getElementById('input-acc').value = ''; renderLists(); }
            });

            // Prevent duplicating listeners using a flag if needed, but since it's a new modal we attach once globally during didOpen or carefully use event delegation
            const modalHandler = (e) => {
                if (e.target.classList.contains('btn-delete-small')) {
                    const type = e.target.getAttribute('data-type');
                    const index = parseInt(e.target.getAttribute('data-index'));
                    if (type === 'resp') tempResp.splice(index, 1);
                    if (type === 'acc') tempAcc.splice(index, 1);
                    renderLists();
                }
            };
            document.querySelector('.swal2-container').addEventListener('click', modalHandler);
        },
        preConfirm: () => {
            return { responsibilities: tempResp, accountabilities: tempAcc };
        }
    });

    if (result.isConfirmed) {
        // Send edit request with updated lists
        const updatedItem = { ...item, responsibilities: result.value.responsibilities, accountabilities: result.value.accountabilities };
        manageItemDB('edit', 'process_personnel', updatedItem, id).then(() => loadDynamicData());
    }
}

function renderPersonnel() {
    const tbody = document.querySelector('#personnelTable tbody');
    if (!tbody) return;
    if (personnel.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No hay personal registrado.</td></tr>`;
        return;
    }
    let html = '';
    personnel.forEach(item => {
        const respCount = item.responsibilities ? item.responsibilities.length : 0;
        const accCount = item.accountabilities ? item.accountabilities.length : 0;

        html += `<tr>
            <td style="width: 120px;">
                <button class="btn-edit-premium" onclick="editPersonnel(${item.idPersonnel})"><i class="fas fa-edit"></i></button>
                <button class="btn-delete-premium" onclick="deletePersonnel(${item.idPersonnel})"><i class="fas fa-trash-alt"></i></button>
            </td>
            <td>${item.role}</td>
            <td>${item.reportsTo}</td>
            <td>${item.quantity}</td>
            <td style="text-align: center;">
                <button class="btn-secondary-premium" onclick="managePersonnelDetails(${item.idPersonnel})" style="padding: 5px 10px; font-size: 12px; border-radius: 4px; border: 1px solid #ccc; background: #f0f0f0; cursor: pointer;">
                    Gestionar Detalles
                </button>
            </td>
            <td style="text-align: center;">${respCount}</td>
            <td style="text-align: center;">${accCount}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}
