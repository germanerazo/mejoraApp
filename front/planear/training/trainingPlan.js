// Mock Data for Training Plan
let trainingData = [
    { id: 1, name: 'INDUCCIÓN EN SST', date: '2024-01-10', file: 'induccion_sst.pdf' },
    { id: 2, name: 'MANEJO DEL ESTRÉS', date: '2024-02-15', file: 'manejo_estres.pdf' },
    { id: 3, name: 'USO DE EPP', date: '2024-03-20', file: 'uso_epp.pdf' },
    { id: 4, name: 'RIESGO BIOMECÁNICO', date: '2024-04-05', file: 'riesgo_biomecanico.pdf' },
    { id: 5, name: 'PRIMEROS AUXILIOS BÁSICOS', date: '2024-05-12', file: 'primeros_auxilios.pdf' },
    { id: 6, name: 'PREVENCIÓN DE INCENDIOS', date: '2024-06-18', file: 'prevencion_incendios.pdf' },
    { id: 7, name: 'SEGURIDAD VIAL', date: '2024-07-22', file: 'seguridad_vial.pdf' },
    { id: 8, name: 'MANIPULACIÓN DE CARGAS', date: '2024-08-30', file: 'manipulacion_cargas.pdf' },
    { id: 9, name: 'TRABAJO EN ALTURAS', date: '2024-09-14', file: 'trabajo_alturas.pdf' },
    { id: 10, name: 'AUDITORÍA INTERNA', date: '2024-10-02', file: 'auditoria_interna.pdf' }
];

function initTraining() {
    renderTrainingList();
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
                <i class="fas fa-minus-circle action-icon icon-delete" onclick="deleteTraining(${item.id})" title="Eliminar"></i>
            </td>
            <td>${item.name}</td>
            <td>${item.date}</td>
            <td style="text-align: center;">
                <i class="fas fa-cloud-download-alt action-icon icon-download" onclick="downloadTraining('${item.file}')" title="Descargar"></i>
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
}

function hideCreateTraining() {
    document.getElementById('trainingCreateView').style.display = 'none';
    document.getElementById('trainingListView').style.display = 'block';
}

function saveTraining() {
    const name = document.getElementById('trainingName').value;
    const date = document.getElementById('trainingDate').value;
    const fileInput = document.getElementById('trainingFile');
    
    if (!name || !date) {
        Swal.fire('Error', 'Por favor complete todos los campos', 'error');
        return;
    }
    
    // Simulate file upload
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'documento_capacitacion.pdf';

    const newDoc = {
        id: Date.now(),
        name: name,
        date: date,
        file: fileName
    };

    trainingData.push(newDoc);
    renderTrainingList();
    
    Swal.fire({
        title: 'Guardado',
        text: 'Capacitación registrada exitosamente',
        icon: 'success',
        confirmButtonColor: '#ff6b00'
    }).then(() => {
        hideCreateTraining();
    });
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
    }).then((result) => {
        if (result.isConfirmed) {
            trainingData = trainingData.filter(d => d.id !== id);
            renderTrainingList();
            Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
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
