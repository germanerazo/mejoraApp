import config from '../../js/config.js';
const API_URL = `${config.BASE_API_URL}training.php`;

let trainingData = [];
    
function updateTrainingFileName(input) {
    const fileNameDisplay = document.getElementById('trainingFileNameDisplay');
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
}
window.updateTrainingFileName = updateTrainingFileName;


async function initTraining() {
    await loadTrainingData();
    renderTrainingList();
}

async function loadTrainingData() {
    const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
    try {
        const res = await fetch(`${API_URL}?idEmpresa=${idEmpresa}`);
        const resp = await res.json();
        if (resp.status === 'ok') {
            trainingData = resp.result || [];
        }
    } catch (e) {
        console.error("Error loading training", e);
    }
}

function renderTrainingList() {
    const tbody = document.getElementById('trainingTableBody');
    tbody.innerHTML = '';

    if (trainingData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">No hay registros de capacitación</td></tr>';
        return;
    }

    trainingData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <button class="btn-delete-premium" onclick="deleteTraining(${item.id})" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.name}</td>
            <td>${item.date}</td>
            <td style="text-align: center;">
                <button class="btn-view-premium" onclick="downloadTraining('${item.file}')" title="Descargar" style="color: #27ae60 !important;">
                    <i class="fas fa-file-download"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showCreateTraining() {
    document.getElementById('trainingListView').style.display = 'none';
    document.getElementById('trainingCreateView').style.display = 'block';
    
    document.getElementById('trainingForm').reset();
    document.getElementById('trainingDate').valueAsDate = new Date();
    
    // Reset file upload display
    const fileInput = document.getElementById('trainingFile');
    if (fileInput) {
        fileInput.value = '';
        updateTrainingFileName(fileInput);
    }
}

function hideCreateTraining() {
    document.getElementById('trainingCreateView').style.display = 'none';
    document.getElementById('trainingListView').style.display = 'block';
}

async function saveTraining() {
    const name = document.getElementById('trainingName').value;
    const date = document.getElementById('trainingDate').value;
    const fileInput = document.getElementById('trainingFile');
    
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
            await loadTrainingData();
            renderTrainingList();
            Swal.fire({
                title: 'Guardado',
                text: 'Capacitación registrada exitosamente',
                icon: 'success',
                confirmButtonColor: '#ff6b00'
            }).then(() => {
                hideCreateTraining();
            });
        } else {
            Swal.fire('Error', 'Error al guardar el registro', 'error');
        }
    } catch(e) {
        Swal.fire('Error', 'Ocurrió un error en la solicitud', 'error');
    }
}

function deleteTraining(id) {
    Swal.fire({
        title: '¿Eliminar registro?',
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
                    await loadTrainingData();
                    renderTrainingList();
                    Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
                } else {
                    Swal.fire('Error', 'Error al eliminar el registro', 'error');
                }
            } catch (e) {
                Swal.fire('Error', 'Ocurrió un error', 'error');
            }
        }
    });
}

function downloadTraining(fileName) {
    Swal.fire({
        title: 'Descargando...',
        text: `Iniciando descarga de: ${fileName}`,
        icon: 'info',
        timer: 1500,
        showConfirmButton: false
    });
}
