import config from "../../js/config.js";

const API_URL = `${config.BASE_API_URL}procedures.php`;

let proceduresData = [];
let idEmpresa = null;

// Initialization
const initProcedures = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        loadProcedures();
    } else {
        Swal.fire('Error', 'No se ha encontrado la sesión de la empresa.', 'error');
    }
};

window.updateProceduresFileName = (input) => {
    const fileNameDisplay = document.getElementById('procFileNameDisplay');
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

function loadProcedures() {
    fetch(`${API_URL}?idEmpresa=${idEmpresa}`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                proceduresData = data;
            } else if (data.result) {
                proceduresData = data.result;
            } else {
                proceduresData = [];
            }
            renderProceduresList();
        })
        .catch(err => {
            console.error('Error loading procedures:', err);
            proceduresData = [];
            renderProceduresList();
        });
}

window.renderProceduresList = () => {
    const tbody = document.querySelector('#tableProcedures tbody');
    if (!tbody) return;

    if (!proceduresData || proceduresData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #999;">No hay documentos cargados.</td></tr>`;
        return;
    }

    let html = '';
    proceduresData.forEach(item => {
        html += `<tr>
            <td style="text-align: center;">
                <button class="btn-delete-premium" onclick="deleteProcedures(${item.idProcedimiento})" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.nomProcedimiento}</td>
            <td>${item.fechaCreacion}</td>
            <td style="text-align: center;">`;
            
        if (item.rutaArchivo) {
            const apiDownloadLink = config.BASE_API_URL + 'download.php?file=' + item.rutaArchivo;
            html += `
                <a href="${apiDownloadLink}" class="btn-view-premium" title="Descargar" style="display: inline-flex; align-items: center; justify-content: center; text-decoration: none; color: #27ae60 !important;">
                    <i class="fas fa-file-download"></i>
                </a>`;
        } else {
            html += `<span style="color: #999; font-size: 0.9em;">N/A</span>`;
        }

        html += `</td></tr>`;
    });
    tbody.innerHTML = html;
};

window.showCreateProcedures = () => {
    document.getElementById('proceduresListView').style.display = 'none';
    document.getElementById('proceduresCreateView').style.display = 'block';
    
    // Set today as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fieldProcDate').value = today;
    document.getElementById('fieldProcName').value = '';
    const fileIn = document.getElementById('fieldProcFile');
    fileIn.value = '';
    window.updateProceduresFileName(fileIn);
};

window.hideCreateProcedures = () => {
    document.getElementById('proceduresCreateView').style.display = 'none';
    document.getElementById('proceduresListView').style.display = 'block';
};

window.saveProcedures = () => {
    const name = document.getElementById('fieldProcName').value;
    const date = document.getElementById('fieldProcDate').value;
    const fileInput = document.getElementById('fieldProcFile');

    if (!date || !name) {
        Swal.fire('Error', 'Debe completar nombre y fecha', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('token', sessionStorage.getItem('token'));
    formData.append('idEmpresa', idEmpresa);
    formData.append('nomProcedimiento', name);
    formData.append('fechaCreacion', date);
    
    if (fileInput.files.length > 0) {
        formData.append('archivo', fileInput.files[0]);
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
                text: 'Documento guardado correctamente',
                timer: 1500,
                showConfirmButton: false
            });
            hideCreateProcedures();
            loadProcedures();
        } else {
            Swal.fire('Error', response.result?.error_message || 'No se pudo guardar el documento', 'error');
        }
    })
    .catch(err => {
        console.error('Error saving procedure:', err);
        Swal.fire('Error', 'Ocurrió un error al conectar con el servidor', 'error');
    });
};

window.deleteProcedures = (id) => {
    Swal.fire({
        title: '¿Eliminar Documento?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--colorRed2').trim() || '#e74c3c',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            const token = sessionStorage.getItem('token');
            const data = {
                token: token,
                idProcedimiento: id,
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
                        title: 'Eliminado',
                        text: 'El documento ha sido eliminado.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    loadProcedures();
                } else {
                    Swal.fire('Error', response.result?.error_message || 'No se pudo eliminar el documento', 'error');
                }
            })
            .catch(err => {
                console.error('Error deleting procedure:', err);
                Swal.fire('Error', 'Ocurrió un error al conectar con el servidor', 'error');
            });
        }
    });
};

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initProcedures);
} else {
    initProcedures();
}
