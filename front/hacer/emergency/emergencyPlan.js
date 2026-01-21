// Mock Data
let emergencyData = [
    { id: 1, name: 'SST- PE-01 PLAN DE EMERGENCIAS', date: '2024-01-15', file: 'plan_emergencias_v1.pdf' },
    { id: 2, name: 'VISTA DE BOMBEROS', date: '2024-02-10', file: 'informe_bomberos_2024.pdf' },
    { id: 3, name: 'ACTA DE CONFORMACION BRIGADA', date: '2024-03-05', file: 'acta_brigada_2024.pdf' },
    { id: 4, name: 'SIMULACRO DE EVACUACIÓN - INFORME', date: '2024-04-20', file: 'informe_simulacro.pdf' },
    { id: 5, name: 'ANÁLISIS DE VULNERABILIDAD', date: '2024-01-20', file: 'analisis_vulnerabilidad.pdf' },
    { id: 6, name: 'PON DE EVACUACIÓN', date: '2024-01-25', file: 'pon_evacuacion.pdf' },
    { id: 7, name: 'DIRECTORIO DE EMERGENCIAS', date: '2024-01-10', file: 'directorio_2024.pdf' },
    { id: 8, name: 'INVENTARIO DE EQUIPOS DE EMERGENCIA', date: '2024-05-15', file: 'inventario_equipos.pdf' },
    { id: 9, name: 'CAPACITACIÓN BRIGADA DE PRIMEROS AUXILIOS', date: '2024-06-01', file: 'capacitacion_brigada.pdf' },
    { id: 10, name: 'INSPECCIÓN DE EXTINTORES', date: '2024-06-15', file: 'inspeccion_extintores_junio.xls' }
];

function initEmergency() {
    renderEmergencyList();
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
                <i class="fas fa-minus-circle action-icon icon-delete" onclick="deleteEmergency(${item.id})" title="Eliminar"></i>
            </td>
            <td>${item.name}</td>
            <td>${item.date}</td>
            <td style="text-align: center;">
                <i class="fas fa-cloud-download-alt action-icon icon-download" onclick="downloadEmergency('${item.file}')" title="Descargar"></i>
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
}

function hideCreateEmergency() {
    document.getElementById('emergencyCreateView').style.display = 'none';
    document.getElementById('emergencyListView').style.display = 'block';
}

function saveEmergency() {
    const name = document.getElementById('planName').value;
    const date = document.getElementById('planDate').value;
    const fileInput = document.getElementById('planFile');
    
    if (!name || !date) {
        Swal.fire('Error', 'Por favor complete todos los campos', 'error');
        return;
    }
    
    // Simulate file upload
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'documento_nuevo.pdf';

    const newDoc = {
        id: Date.now(),
        name: name,
        date: date,
        file: fileName
    };

    emergencyData.push(newDoc);
    renderEmergencyList();
    
    Swal.fire({
        title: 'Guardado',
        text: 'Documento registrado exitosamente',
        icon: 'success',
        confirmButtonColor: '#ff6b00'
    }).then(() => {
        hideCreateEmergency();
    });
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
    }).then((result) => {
        if (result.isConfirmed) {
            emergencyData = emergencyData.filter(d => d.id !== id);
            renderEmergencyList();
            Swal.fire('Eliminado', 'El documento ha sido eliminado.', 'success');
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
