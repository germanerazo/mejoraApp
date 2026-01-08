// Mock Data
let copasstData = [
    { id: 1, date: '2024-02-26', name: 'Acta reuniones COPASST Febrero 2024' },
    { id: 2, date: '2024-01-15', name: 'Acta conformación COPASST 2024' }
];

const initCopasst = () => {
    renderCopasstList();
};

window.renderCopasstList = () => {
    const tbody = document.querySelector('#tableCopasst tbody');
    if (!tbody) return;

    if (copasstData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #999;">No hay actas cargadas.</td></tr>`;
        return;
    }

    let html = '';
    copasstData.forEach(item => {
        html += `<tr>
            <td style="text-align: center;">
                <div class="icon-delete" onclick="deleteCopasst(${item.id})" title="Eliminar">➖</div>
            </td>
            <td>${item.date}</td>
            <td>${item.name}</td>
            <td style="text-align: center;">
                <div class="icon-download" title="Descargar" onclick="downloadCopasst(${item.id})">☁️</div>
            </td>
        </tr>`;
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
    document.getElementById('fieldCopasstFile').value = '';
};

window.hideCreateCopasst = () => {
    document.getElementById('copasstCreateView').style.display = 'none';
    document.getElementById('copasstListView').style.display = 'block';
};

window.saveCopasst = () => {
    const date = document.getElementById('fieldCopasstDate').value;
    const name = document.getElementById('fieldCopasstName').value;
    const file = document.getElementById('fieldCopasstFile').files[0];

    if (!date || !name) {
        Swal.fire('Error', 'Debe completar fecha y nombre', 'error');
        return;
    }

    // In a real app we'd upload the file here.
    
    const newItem = {
        id: copasstData.length > 0 ? Math.max(...copasstData.map(i => i.id)) + 1 : 1,
        date: date,
        name: name
    };

    copasstData.push(newItem);
    Swal.fire('Guardado', 'Acta cargada correctamente', 'success');
    renderCopasstList();
    hideCreateCopasst();
};

window.deleteCopasst = (id) => {
    Swal.fire({
        title: '¿Eliminar Acta?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e67e22',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            copasstData = copasstData.filter(i => i.id !== id);
            renderCopasstList();
            Swal.fire('Eliminado', 'El acta ha sido eliminada.', 'success');
        }
    });
};

window.downloadCopasst = (id) => {
    Swal.fire('Descarga', 'Iniciando descarga del documento...', 'info');
};

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initCopasst);
} else {
    initCopasst();
}
