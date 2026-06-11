import config from "../../js/config.js";

const API_URL = `${config.BASE_API_URL}copasst.php`;

let copasstData = [];
let idEmpresa = null;

// Initialization
const initCopasst = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        loadCopasst();
    } else {
        Swal.fire('Error', 'No se ha encontrado la sesión de la empresa.', 'error');
    }
};

function loadCopasst() {
    fetch(`${API_URL}?idEmpresa=${idEmpresa}`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                copasstData = data;
            } else if (data.result) {
                copasstData = data.result;
            } else {
                copasstData = [];
            }
            renderCopasstList();
        })
        .catch(err => {
            console.error('Error loading copasst data:', err);
            copasstData = [];
            renderCopasstList();
        });
}

window.updateCopasstFileName = (input) => {
    const fileNameDisplay = document.getElementById('copasstFileNameDisplay');
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

window.renderCopasstList = () => {
    const tbody = document.querySelector('#tableCopasst tbody');
    if (!tbody) return;

    if (!copasstData || copasstData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #999;">No hay actas cargadas.</td></tr>`;
        return;
    }

    let html = '';
    copasstData.forEach(item => {
        const fileLink = item.rutaArchivo ? `${config.ASSETS_URL}${item.rutaArchivo}` : '#';
        const fileName = item.rutaArchivo ? item.rutaArchivo.split('/').pop() : 'Sin archivo';
        
        html += `<tr>
            <td style="text-align: center;">
                <button class="btn-delete-premium" onclick="deleteCopasst(${item.idCopasst})" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.fechaActa}</td>
            <td>${item.nomActa}</td>
            <td style="text-align: center;">`;

        if (item.rutaArchivo) {
            const apiDownloadLink = config.BASE_API_URL + 'download.php?file=' + item.rutaArchivo;
            html += `
                <a href="${apiDownloadLink}" title="Descargar" style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background-color: #2ecc71; color: white; border-radius: 6px; text-decoration: none; border: none; cursor: pointer; font-size: 14px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#27ae60'" onmouseout="this.style.backgroundColor='#2ecc71'">
                    <i class="fas fa-download"></i>
                </a>`;
        } else {
            html += `N/A`;
        }

        html += `</td></tr>`;
    });
    tbody.innerHTML = html;
};

window.showCreateCopasst = () => {
    document.getElementById('copasstListView').style.display = 'none';
    document.getElementById('copasstCreateView').style.display = 'block';
    
    // Set today as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fieldCopasstDate').value = today;
    document.getElementById('fieldCopasstName').value = '';
    const fileIn = document.getElementById('fieldCopasstFile');
    fileIn.value = '';
    window.updateCopasstFileName(fileIn);
};

window.hideCreateCopasst = () => {
    document.getElementById('copasstCreateView').style.display = 'none';
    document.getElementById('copasstListView').style.display = 'block';
};

window.saveCopasst = () => {
    const date = document.getElementById('fieldCopasstDate').value;
    const name = document.getElementById('fieldCopasstName').value;
    const fileInput = document.getElementById('fieldCopasstFile');

    if (!date || !name) {
        Swal.fire('Error', 'Debe completar fecha y nombre', 'error');
        return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
        Swal.fire('Error', 'Debe seleccionar un archivo (Acta)', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('token', sessionStorage.getItem('token'));
    formData.append('idEmpresa', idEmpresa);
    formData.append('nomActa', name);
    formData.append('fechaActa', date);
    formData.append('archivo', fileInput.files[0]);

    // Show loading
    Swal.fire({
        title: 'Guardando...',
        text: 'Subiendo acta',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

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
                text: 'El acta ha sido cargada exitosamente.',
                timer: 1500,
                showConfirmButton: false
            });
            loadCopasst();
            hideCreateCopasst();
        } else {
            Swal.fire('Error', response.result?.error_message || 'No se pudo guardar el acta', 'error');
        }
    })
    .catch(err => {
        console.error('Error saving:', err);
        Swal.fire('Error', 'Ocurrió un error al conectar con el servidor', 'error');
    });
};

window.deleteCopasst = (id) => {
    Swal.fire({
        title: '¿Eliminar Acta?',
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
                idCopasst: id,
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
                        text: 'El acta ha sido eliminada.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    loadCopasst();
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
};

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initCopasst);
} else {
    initCopasst();
}
