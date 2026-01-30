// Mock Data
let proceduresData = [
    { id: 1, name: 'SST-MA-02 MANUAL DE SELECCION', date: '2024-03-10' },
    { id: 2, name: 'SST-PR-05 PROCEDIMIENTO DE COMPRAS', date: '2024-02-15' }
];
    
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

const initProcedures = () => {
    renderProceduresList();
};

window.renderProceduresList = () => {
    const tbody = document.querySelector('#tableProcedures tbody');
    if (!tbody) return;

    if (proceduresData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #999;">No hay documentos cargados.</td></tr>`;
        return;
    }

    let html = '';
    proceduresData.forEach(item => {
        html += `<tr>
            <td style="text-align: center;">
                <button class="btn-delete-premium" onclick="deleteProcedures(${item.id})" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.name}</td>
            <td>${item.date}</td>
            <td style="text-align: center;">
                <button class="btn-view-premium" title="Descargar" onclick="downloadProcedures(${item.id})" style="color: #27ae60 !important;">
                    <i class="fas fa-file-download"></i>
                </button>
            </td>
        </tr>`;
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
    
    // File validation logic would go here

    if (!date || !name) {
        Swal.fire('Error', 'Debe completar nombre y fecha', 'error');
        return;
    }
    
    const newItem = {
        id: proceduresData.length > 0 ? Math.max(...proceduresData.map(i => i.id)) + 1 : 1,
        name: name,
        date: date
    };

    proceduresData.push(newItem);
    Swal.fire('Guardado', 'Documento guardado correctamente', 'success');
    renderProceduresList();
    hideCreateProcedures();
};

window.deleteProcedures = (id) => {
    Swal.fire({
        title: '¿Eliminar Documento?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--colorRed2').trim(), // Use CSS var if possible or hex
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            proceduresData = proceduresData.filter(i => i.id !== id);
            renderProceduresList();
            Swal.fire('Eliminado', 'El documento ha sido eliminado.', 'success');
        }
    });
};

window.downloadProcedures = (id) => {
    Swal.fire('Descarga', 'Iniciando descarga del documento...', 'info');
};

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initProcedures);
} else {
    initProcedures();
}
