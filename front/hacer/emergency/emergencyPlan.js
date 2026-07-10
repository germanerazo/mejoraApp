import config from '../../js/config.js';
const API_URL = `${config.BASE_API_URL}emergency.php`;

let emergencyData = [];
    
function updateFileName(input) {
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const uploadText = document.querySelector('.file-upload-text');
    const uploadHint = document.querySelector('.file-upload-hint');
    const uploadIcon = document.querySelector('.file-upload-icon');
    
    if (input.files && input.files.length > 0) {
        fileNameDisplay.textContent = input.files[0].name;
        fileNameDisplay.style.display = 'block';
        uploadText.style.display = 'none';
        uploadHint.style.display = 'none';
        uploadIcon.className = 'fas fa-check-circle file-upload-icon';
        uploadIcon.style.color = '#2ecc71';
    } else {
        fileNameDisplay.textContent = '';
        fileNameDisplay.style.display = 'none';
        uploadText.style.display = 'block';
        uploadHint.style.display = 'block';
        uploadIcon.className = 'fas fa-cloud-upload-alt file-upload-icon';
        uploadIcon.style.color = '#329bd6';
    }
}
window.updateFileName = updateFileName;


async function initEmergency() {
    await loadEmergencyData();
    renderEmergencyList();
}

async function loadEmergencyData() {
    const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
    try {
        const res = await fetch(`${API_URL}?idEmpresa=${idEmpresa}`);
        const resp = await res.json();
        if (resp.status === 'ok') {
            emergencyData = resp.result || [];
        }
    } catch (e) {
        console.error("Error loading emergency data", e);
    }
}

function renderEmergencyList() {
    const tbody = document.getElementById('emergencyTableBody');
    tbody.innerHTML = '';

    if (emergencyData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">No hay documentos registrados</td></tr>';
        return;
    }

    emergencyData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <button class="btn-delete-premium" onclick="deleteEmergency(${item.id})" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.name}</td>
            <td>${item.date}</td>
            <td style="text-align: center;">
                <button class="btn-view-premium" onclick="downloadEmergency('${item.file}')" title="Descargar" style="color: #27ae60 !important;">
                    <i class="fas fa-file-download"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showCreateEmergency() {
    document.getElementById('emergencyListView').style.display = 'none';
    document.getElementById('emergencyCreateView').style.display = 'block';
    
    document.getElementById('emergencyForm').reset();
    document.getElementById('planDate').valueAsDate = new Date();
    
    // Reset file upload display
    const fileInput = document.getElementById('planFile');
    if (fileInput) {
        fileInput.value = '';
        updateFileName(fileInput);
    }
}

function hideCreateEmergency() {
    document.getElementById('emergencyCreateView').style.display = 'none';
    document.getElementById('emergencyListView').style.display = 'block';
}

async function saveEmergency() {
    const name = document.getElementById('planName').value;
    const date = document.getElementById('planDate').value;
    const fileInput = document.getElementById('planFile');
    
    if (!name || !date) {
        Swal.fire('Error', 'Por favor complete todos los campos', 'error');
        return;
    }
    
    const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
    const formData = new FormData();
    formData.append('idEmpresa', idEmpresa);
    formData.append('name', name);
    formData.append('date', date);
    if (fileInput && fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        const resp = await res.json();
        
        if (resp.status === 'ok') {
            await loadEmergencyData();
            renderEmergencyList();
            Swal.fire({
                title: 'Guardado',
                text: 'Documento registrado exitosamente',
                icon: 'success',
                confirmButtonColor: '#ff6b00'
            }).then(() => {
                hideCreateEmergency();
            });
        } else {
            Swal.fire('Error', 'Error al guardar el documento', 'error');
        }
    } catch(e) {
        Swal.fire('Error', 'Ocurrió un error en la solicitud', 'error');
    }
}

function deleteEmergency(id) {
    Swal.fire({
        title: '¿Eliminar documento?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff6b00',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}?id=${id}`, {
                    method: 'DELETE'
                });
                const resp = await res.json();
                if (resp.status === 'ok') {
                    await loadEmergencyData();
                    renderEmergencyList();
                    Swal.fire('Eliminado', 'El documento ha sido eliminado.', 'success');
                } else {
                    Swal.fire('Error', 'Error al eliminar el documento', 'error');
                }
            } catch (e) {
                Swal.fire('Error', 'Ocurrió un error', 'error');
            }
        }
    });
}

function downloadEmergency(fileName) {
    Swal.fire({
        title: 'Descargando...',
        text: `Iniciando descarga de: ${fileName}`,
        icon: 'info',
        timer: 1500,
        showConfirmButton: false
    });
}
