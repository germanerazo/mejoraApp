// JavaScript for EPP Procedures (Procedimiento EPP)

import config from '../../js/config.js';
const API_URL = `${config.BASE_API_URL}eppProcedures.php`;

let procedures = [];

const renderProcedures = () => {
    const container = document.getElementById('proceduresList');
    if (!container) return;

    if (procedures.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d; font-size: 1.1rem; padding: 40px;">No hay documentos registrados.</p>';
        return;
    }

    container.innerHTML = procedures.map(proc => `
        <div class="procedure-card fade-in">
            <i class="fas fa-file-pdf procedure-icon"></i>
            <div class="procedure-info">
                <div class="procedure-title">${proc.title}</div>
                <div class="procedure-meta">Fecha de Creación: <span style="font-weight: 500; color: #333;">${proc.date}</span></div>
            </div>
            <div style="display: flex; gap: 10px;">
                <a href="#" class="btn-download" title="Descargar" onclick="event.preventDefault(); window.downloadProcedure('${proc.file}')">
                    <i class="fas fa-download"></i> Descargar
                </a>
                <button class="btn-delete-card" onclick="window.deleteProcedure(${proc.id})" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
};

window.addProcedure = () => {
    Swal.fire({
        title: 'Nuevo Documento',
        html: `
            <div style="margin-bottom: 15px; text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Nombre del Procedimiento:</label>
                <input id="swal-proc-title" class="swal2-input" placeholder="Ej: Manual de Uso de Cascos" style="margin: 0; width: 100%;">
            </div>
            <div style="margin-bottom: 15px; text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Seleccionar Archivo:</label>
                <input type="file" id="swal-proc-file" class="swal2-file" style="margin: 0; width: 100%;">
            </div>
            <div style="text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Fecha de Creación:</label>
                <input type="date" id="swal-proc-date" class="swal2-input" value="${new Date().toISOString().split('T')[0]}" style="margin: 0;">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Subir Documento',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#27ae60',
        preConfirm: () => {
            const title = document.getElementById('swal-proc-title').value;
            const fileInput = document.getElementById('swal-proc-file');
            const date = document.getElementById('swal-proc-date').value;

            if (!title || !date) {
                Swal.showValidationMessage('Por favor complete todos los campos requeridos');
                return false;
            }
            if (fileInput.files.length === 0) {
                Swal.showValidationMessage('Debe seleccionar un archivo');
                return false;
            }

            return { title, date, file: fileInput.files[0] };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
            const formData = new FormData();
            formData.append('idEmpresa', idEmpresa);
            formData.append('title', result.value.title);
            formData.append('date', result.value.date);
            formData.append('file', result.value.file);

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    body: formData
                });
                const resp = await res.json();
                
                if (resp.status === 'ok') {
                    await loadProcedures();
                    renderProcedures();
                    Swal.fire('Subido', 'El documento ha sido cargado con éxito', 'success');
                } else {
                    Swal.fire('Error', 'Error al subir el documento', 'error');
                }
            } catch(e) {
                Swal.fire('Error', 'Ocurrió un error en la solicitud', 'error');
            }
        }
    });
};

window.downloadProcedure = (fileName) => {
    Swal.fire({
        icon: 'info',
        title: 'Descargando...',
        text: `Iniciando descarga de ${fileName}`,
        timer: 1500,
        showConfirmButton: false
    });
};

window.deleteProcedure = (id) => {
    Swal.fire({
        title: '¿Eliminar documento?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}?id=${id}`, {
                    method: 'DELETE'
                });
                const resp = await res.json();
                if (resp.status === 'ok') {
                    await loadProcedures();
                    renderProcedures();
                    Swal.fire('Eliminado', 'El documento ha sido eliminado.', 'success');
                } else {
                    Swal.fire('Error', 'Error al eliminar el documento', 'error');
                }
            } catch (e) {
                Swal.fire('Error', 'Ocurrió un error', 'error');
            }
        }
    });
};

async function loadProcedures() {
    const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
    try {
        const res = await fetch(`${API_URL}?idEmpresa=${idEmpresa}`);
        const resp = await res.json();
        if (resp.status === 'ok') {
            procedures = resp.result || [];
        }
    } catch (e) {
        console.error("Error loading procedures", e);
    }
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
    await loadProcedures();
    renderProcedures();
});
