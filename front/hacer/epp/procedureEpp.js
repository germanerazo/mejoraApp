// JavaScript for EPP Procedures (Procedimiento EPP)

import config from '../../js/config.js';
const API_URL = `${config.BASE_API_URL}eppProcedures.php`;

let procedures = [];
let idEmpresa = null;

// Init
document.addEventListener('DOMContentLoaded', async () => {
    idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
    await loadProcedures();
    renderProceduresList();
});

window.updateEppFileName = (input) => {
    const fileNameDisplay = document.getElementById('eppProcFileNameDisplay');
    const wrapper = input.parentElement;
    const uploadText = wrapper.querySelector('.file-upload-text');
    const uploadHint = wrapper.querySelector('.file-upload-hint');
    const uploadIcon = wrapper.querySelector('.file-upload-icon');
    
    if (input.files && input.files.length > 0) {
        fileNameDisplay.textContent = input.files[0].name;
        fileNameDisplay.style.display = 'block';
        if(uploadText) uploadText.style.display = 'none';
        if(uploadHint) uploadHint.style.display = 'none';
        if(uploadIcon) {
            uploadIcon.className = 'fas fa-check-circle file-upload-icon';
            uploadIcon.style.color = '#2ecc71';
        }
    } else {
        fileNameDisplay.textContent = '';
        fileNameDisplay.style.display = 'none';
        if(uploadText) uploadText.style.display = 'block';
        if(uploadHint) uploadHint.style.display = 'block';
        if(uploadIcon) {
            uploadIcon.className = 'fas fa-cloud-upload-alt file-upload-icon';
            uploadIcon.style.color = '#329bd6';
        }
    }
};

window.renderProceduresList = () => {
    const tbody = document.querySelector('#tableEppProcedures tbody');
    if (!tbody) return;

    if (!procedures || procedures.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #999;">No hay documentos registrados.</td></tr>`;
        return;
    }

    let html = '';
    procedures.forEach(item => {
        html += `<tr>
            <td style="text-align: center;">
                <button class="btn-delete-premium" onclick="deleteEppProcedure(${item.id})" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.title}</td>
            <td>${item.date}</td>
            <td style="text-align: center;">`;
            
        if (item.file) {
            const apiDownloadLink = config.BASE_API_URL + 'download.php?file=' + item.file;
            html += `
                <a href="${apiDownloadLink}" class="btn-view-premium" title="Descargar" style="display: inline-flex; align-items: center; justify-content: center; text-decoration: none; color: #27ae60 !important;" onclick="event.stopPropagation();">
                    <i class="fas fa-file-download"></i>
                </a>`;
        } else {
            html += `<span style="color: #999; font-size: 0.9em;">N/A</span>`;
        }

        html += `</td></tr>`;
    });
    tbody.innerHTML = html;
};

window.showCreateEppProcedure = () => {
    document.getElementById('eppProceduresListView').style.display = 'none';
    document.getElementById('eppProceduresCreateView').style.display = 'block';
    
    // Set today as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('swal-proc-date').value = today;
    document.getElementById('swal-proc-title').value = '';
    const fileIn = document.getElementById('swal-proc-file');
    fileIn.value = '';
    window.updateEppFileName(fileIn);
};

window.hideCreateEppProcedure = () => {
    document.getElementById('eppProceduresCreateView').style.display = 'none';
    document.getElementById('eppProceduresListView').style.display = 'block';
};

window.saveEppProcedure = async () => {
    const title = document.getElementById('swal-proc-title').value;
    const date = document.getElementById('swal-proc-date').value;
    const fileInput = document.getElementById('swal-proc-file');

    if (!title || !date) {
        Swal.fire('Atención', 'Por favor complete el nombre y la fecha', 'warning');
        return;
    }
    if (fileInput.files.length === 0) {
        Swal.fire('Atención', 'Debe seleccionar un archivo', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('idEmpresa', idEmpresa);
    formData.append('title', title);
    formData.append('date', date);
    formData.append('file', fileInput.files[0]);

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        const resp = await res.json();
        
        if (resp.status === 'ok') {
            await loadProcedures();
            renderProceduresList();
            Swal.fire({
                icon: 'success',
                title: 'Guardado',
                text: 'El documento ha sido cargado con éxito',
                timer: 1500,
                showConfirmButton: false
            });
            hideCreateEppProcedure();
        } else {
            Swal.fire('Error', resp.result?.error_message || 'Error al subir el documento', 'error');
        }
    } catch(e) {
        Swal.fire('Error', 'Ocurrió un error en la solicitud', 'error');
    }
};

window.deleteEppProcedure = (id) => {
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
                    renderProceduresList();
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
