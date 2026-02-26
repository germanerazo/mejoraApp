import config from "../../js/config.js";

const API_URL = `${config.BASE_API_URL}policies.php`;

let policies = [];
let idEmpresa = null;

// Initialization
const initPolicies = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        loadPolicies();
    } else {
        Swal.fire('Error', 'No se ha encontrado la sesión de la empresa.', 'error');
    }
};

// Check if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initPolicies);
} else {
    initPolicies();
}

function loadPolicies() {
    fetch(`${API_URL}?idEmpresa=${idEmpresa}`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                policies = data;
            } else if (data.result) {
                policies = data.result;
            } else {
                policies = [];
            }
            renderPolicies();
        })
        .catch(err => {
            console.error('Error loading policies:', err);
            policies = [];
            renderPolicies();
        });
}

function renderPolicies() {
    const tbody = document.querySelector('#policiesTable tbody');
    if (!tbody) return;

    if (!policies || policies.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-state">No hay políticas registradas.</td></tr>`;
        return;
    }

    let html = '';
    policies.forEach(item => {
        const fileLink = item.rutaArchivo ? `${config.ASSETS_URL}${item.rutaArchivo}` : '#';
        const fileName = item.rutaArchivo ? item.rutaArchivo.split('/').pop() : 'Sin archivo';
        
        html += `<tr>
            <td style="display: flex; gap: 5px;">
                <button class="btn-edit-premium" title="Editar" onclick="editPolicy(${item.idPolitica})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-premium" title="Eliminar" onclick="deletePolicy(${item.idPolitica})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.nomPolitica}</td>
            <td>${item.fechaCreacion}</td>
            <td>`;
            
        if (item.rutaArchivo) {
            html += `<a href="${fileLink}" target="_blank" style="color: var(--primary-color); text-decoration: none;">⬇️ ${fileName}</a>`;
        } else {
            html += `N/A`;
        }
        
        html += `</td></tr>`;
    });
    tbody.innerHTML = html;
}

// Global Functions
window.addPolicy = async function() {
    const { value: formValues } = await Swal.fire({
        title: 'Nueva Política',
        html: `
            <input id="swal-pol-name" class="swal2-input" placeholder="Nombre de la Política">
            <input type="date" id="swal-pol-date" class="swal2-input" value="${new Date().toISOString().split('T')[0]}">
            <div class="file-upload-wrapper" style="margin-top: 15px;">
                <label for="swal-pol-file" class="btn-secondary-premium" style="cursor: pointer; display: inline-block; padding: 10px; border: 1px dashed #ccc; width: 80%;">
                    📂 Seleccionar Archivo
                </label>
                <input type="file" id="swal-pol-file" style="display: none;" onchange="document.getElementById('file-name-display').innerText = this.files[0] ? this.files[0].name : ''" accept=".pdf,.doc,.docx,.xls,.xlsx">
                <div id="file-name-display" style="margin-top: 5px; font-size: 12px; color: #666;"></div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        preConfirm: () => {
            const name = document.getElementById('swal-pol-name').value;
            const date = document.getElementById('swal-pol-date').value;
            if (!name || !date) {
                Swal.showValidationMessage('El nombre y la fecha son obligatorios');
                return false;
            }
            
            const fileInput = document.getElementById('swal-pol-file');
            return {
                name: name,
                date: date,
                file: fileInput.files.length > 0 ? fileInput.files[0] : null
            }
        }
    });

    if (formValues) {
        const formData = new FormData();
        formData.append('token', sessionStorage.getItem('token'));
        formData.append('idEmpresa', idEmpresa);
        formData.append('nomPolitica', formValues.name);
        formData.append('fechaCreacion', formValues.date);
        
        if (formValues.file) {
            formData.append('archivo', formValues.file);
        }

        fetch(API_URL, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(response => {
            if (response.status === 'ok' || response.result) {
                Swal.fire({
                    icon: 'success',
                    title: 'Guardado',
                    text: 'La política ha sido registrada exitosamente.',
                    timer: 1500,
                    showConfirmButton: false
                });
                loadPolicies();
            } else {
                Swal.fire('Error', response.result?.error_message || 'No se pudo guardar la política', 'error');
            }
        })
        .catch(err => {
            console.error('Error saving:', err);
            Swal.fire('Error', 'Ocurrió un error al conectar con el servidor', 'error');
        });
    }
}

window.editPolicy = async function(idPolitica) {
    const item = policies.find(p => p.idPolitica == idPolitica);
    if (!item) return;

    const currentFileName = item.rutaArchivo ? item.rutaArchivo.split('/').pop() : 'Sin archivo actual';

    const { value: formValues } = await Swal.fire({
        title: 'Editar Política',
        html: `
            <input id="swal-pol-name" class="swal2-input" placeholder="Nombre de la Política" value="${item.nomPolitica}">
            <input type="date" id="swal-pol-date" class="swal2-input" value="${item.fechaCreacion}">
            <div class="file-upload-wrapper" style="margin-top: 15px;">
                <label for="swal-pol-file" class="btn-secondary-premium" style="cursor: pointer; display: inline-block; padding: 10px; border: 1px dashed #ccc; width: 80%;">
                    📂 Reemplazar Archivo
                </label>
                <input type="file" id="swal-pol-file" style="display: none;" onchange="document.getElementById('file-name-display-edit').innerText = this.files[0] ? 'Nuevo: ' + this.files[0].name : ''">
                <div id="file-name-display-edit" style="margin-top: 5px; font-size: 12px; color: #666;">Actual: ${currentFileName}</div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        preConfirm: () => {
            const name = document.getElementById('swal-pol-name').value;
            const date = document.getElementById('swal-pol-date').value;
            if (!name || !date) {
                Swal.showValidationMessage('El nombre y la fecha son obligatorios');
                return false;
            }
            const fileInput = document.getElementById('swal-pol-file');
            return {
                name: name,
                date: date,
                file: fileInput.files.length > 0 ? fileInput.files[0] : null
            }
        }
    });

    if (formValues) {
        const formData = new FormData();
        formData.append('token', sessionStorage.getItem('token'));
        formData.append('idPolitica', idPolitica);
        formData.append('idEmpresa', idEmpresa);
        formData.append('nomPolitica', formValues.name);
        formData.append('fechaCreacion', formValues.date);
        
        if (formValues.file) {
            formData.append('archivo', formValues.file);
        }

        // Aunque es una actualización (PUT lógico), usamos POST porque hay subida de archivos (FormData)
        fetch(`${API_URL}?_method=PUT`, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(response => {
            if (response.status === 'ok' || response.result) {
                Swal.fire({
                    icon: 'success',
                    title: 'Actualizado',
                    text: 'La política ha sido actualizada exitosamente.',
                    timer: 1500,
                    showConfirmButton: false
                });
                loadPolicies();
            } else {
                Swal.fire('Error', response.result?.error_message || 'No se pudo actualizar', 'error');
            }
        })
        .catch(err => {
            console.error('Error updating:', err);
            Swal.fire('Error', 'Ocurrió un error al actualizar', 'error');
        });
    }
}

window.deletePolicy = function(idPolitica) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: '<i class="fas fa-trash"></i> Sí, eliminar',
        cancelButtonText: '<i class="fas fa-times"></i> Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const token = sessionStorage.getItem('token');
            const data = {
                token: token,
                idPolitica: idPolitica,
                idEmpresa: idEmpresa
            };

            fetch(API_URL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(response => {
                if (response.status === 'ok' || response.result) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: 'La política ha sido eliminada.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    loadPolicies();
                } else {
                    Swal.fire('Error', response.result?.error_message || 'No se pudo eliminar', 'error');
                }
            })
            .catch(err => {
                console.error('Error deleting:', err);
                Swal.fire('Error', 'Ocurrió un error al eliminar', 'error');
            });
        }
    });
}
