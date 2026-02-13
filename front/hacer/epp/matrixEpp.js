// JavaScript for EPP Matrix (Matriz EPP)

// Mock data
const cargosList = ['Operario de Campo', 'Supervisor', 'Analista de Laboratorio', 'Auxiliar Administrativo', 'Conductor'];
const eppList = [
    { id: 1, name: 'Casco de Seguridad', standard: 'ANSI Z89.1' },
    { id: 2, name: 'Gafas de Seguridad', standard: 'ANSI Z87.1' },
    { id: 3, name: 'Guantes de Nitrilo', standard: 'EN 374' },
    { id: 4, name: 'Botas de Seguridad', standard: 'ASTM F2413' }
];

let matrixData = [
    {
        id: 1,
        cargo: 'Operario de Campo',
        epp: 'Casco de Seguridad',
        norma: 'ANSI Z89.1',
        frecuencia: 'Anual',
        almacenamiento: 'Lugar seco y ventilado',
        mantenimiento: 'Limpieza con jabón neutro',
        disposicion: 'Residuo ordinario (si no contaminado)'
    },
    {
        id: 2,
        cargo: 'Operario de Campo',
        epp: 'Botas de Seguridad',
        norma: 'ASTM F2413',
        frecuencia: 'Semestral',
        almacenamiento: 'Lugar fresco',
        mantenimiento: 'Aplicar grasa protectora',
        disposicion: 'Residuo ordinario'
    },
    {
        id: 3,
        cargo: 'Analista de Laboratorio',
        epp: 'Guantes de Nitrilo',
        norma: 'EN 374',
        frecuencia: 'Diaria',
        almacenamiento: 'Caja original',
        mantenimiento: 'Desechable',
        disposicion: 'Residuo peligroso'
    }
];

const renderFilterOptions = () => {
    const select = document.getElementById('cargoFilter');
    if (!select) return;
    
    // Clear existing options except first
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    cargosList.forEach(c => {
        const option = document.createElement('option');
        option.value = c;
        option.text = c;
        select.add(option);
    });
};

const renderMatrix = (filterCargo = '') => {
    const tbody = document.getElementById('matrixBody');
    if (!tbody) return;

    let filtered = matrixData;
    if (filterCargo) {
        filtered = matrixData.filter(item => item.cargo === filterCargo);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px;">No hay registros que coincidan.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(item => `
        <tr>
            <td><strong>${item.cargo}</strong></td>
            <td>${item.epp}</td>
            <td>${item.norma}</td>
            <td>${item.frecuencia}</td>
            <td>${item.almacenamiento}</td>
            <td>${item.mantenimiento}</td>
            <td>${item.disposicion}</td>
            <td style="text-align: center;">
                 <button class="action-btn edit" onclick="window.editMatrixEntry(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="window.deleteMatrixEntry(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');
};

window.filterMatrix = () => {
    const filter = document.getElementById('cargoFilter').value;
    renderMatrix(filter);
};

window.addMatrixEntry = () => {
    const eppOptions = eppList.map(e => `<option value="${e.id}" data-norma="${e.standard}">${e.name}</option>`).join('');
    const cargoOptions = cargosList.map(c => `<option value="${c}">${c}</option>`).join('');

    Swal.fire({
        title: 'Nueva Asignación de EPP',
        width: '700px',
        html: `
            <div style="text-align: left; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <label>Cargo</label>
                    <select id="swal-cargo" class="swal2-input" style="margin: 5px 0; width: 100%;">${cargoOptions}</select>
                </div>
                <div>
                    <label>Elemento (EPP)</label>
                    <select id="swal-epp" class="swal2-input" style="margin: 5px 0; width: 100%;" onchange="updateNormaField()">${eppOptions}</select>
                </div>
                <div style="grid-column: span 2;">
                    <label>Frecuencia de Reposición</label>
                    <select id="swal-freq" class="swal2-input" style="margin: 5px 0; width: 100%;">
                        <option>Diaria</option>
                        <option>Semanal</option>
                        <option>Mensual</option>
                        <option>Bimestral</option>
                        <option>Trimestral</option>
                        <option>Semestral</option>
                        <option>Anual</option>
                        <option>Según deteriorio</option>
                    </select>
                </div>
                <div style="grid-column: span 2;">
                    <label>Almacenamiento</label>
                    <input id="swal-storage" class="swal2-input" style="margin: 5px 0; width: 100%;" placeholder="Instrucciones de almacenamiento">
                </div>
                <div style="grid-column: span 2;">
                    <label>Mantenimiento</label>
                    <input id="swal-maint" class="swal2-input" style="margin: 5px 0; width: 100%;" placeholder="Instrucciones de limpieza/mantenimiento">
                </div>
                <div style="grid-column: span 2;">
                    <label>Disposición Final</label>
                    <input id="swal-disposal" class="swal2-input" style="margin: 5px 0; width: 100%;" placeholder="Instrucciones de desecho">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#27ae60',
        didOpen: () => {
            // Helper to set norma automatically? 
            // We'll just define updateNormaField globally or inside the module scope if possible, 
            // but swal html executes in global scope.
            window.updateNormaField = () => {
                // Logic to update a hidden or visible field if we had one for Norma, 
                // but checking the mock data logic, we just grab it on save.
            };
        },
        preConfirm: () => {
            const cargo = document.getElementById('swal-cargo').value;
            const eppSelect = document.getElementById('swal-epp');
            const eppId = eppSelect.value;
            const eppName = eppSelect.options[eppSelect.selectedIndex].text;
            const norma = eppSelect.options[eppSelect.selectedIndex].getAttribute('data-norma');
            
            const freq = document.getElementById('swal-freq').value;
            const storage = document.getElementById('swal-storage').value;
            const maint = document.getElementById('swal-maint').value;
            const disposal = document.getElementById('swal-disposal').value;

            return { cargo, epp: eppName, norma, frecuencia: freq, almacenamiento: storage, mantenimiento: maint, disposicion: disposal };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newId = matrixData.length > 0 ? Math.max(...matrixData.map(m => m.id)) + 1 : 1;
            matrixData.push({
                id: newId,
                ...result.value
            });
            renderMatrix();
            Swal.fire('Guardado', 'Asignación registrada.', 'success');
        }
    });
};

window.editMatrixEntry = (id) => {
    const item = matrixData.find(m => m.id === id);
    if (!item) return;

    Swal.fire({
        title: 'Editar Asignación',
        html: `
            <div style="text-align: left;">
                <label>Frecuencia</label>
                <input id="swal-freq" class="swal2-input" value="${item.frecuencia}">
                <label>Almacenamiento</label>
                <input id="swal-storage" class="swal2-input" value="${item.almacenamiento}">
                <label>Mantenimiento</label>
                <input id="swal-maint" class="swal2-input" value="${item.mantenimiento}">
                <label>Disposición</label>
                <input id="swal-disposal" class="swal2-input" value="${item.disposicion}">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        preConfirm: () => {
            return {
                frecuencia: document.getElementById('swal-freq').value,
                almacenamiento: document.getElementById('swal-storage').value,
                mantenimiento: document.getElementById('swal-maint').value,
                disposicion: document.getElementById('swal-disposal').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Object.assign(item, result.value);
            renderMatrix();
            Swal.fire('Actualizado', 'Registro modificado.', 'success');
        }
    });
};

window.deleteMatrixEntry = (id) => {
    Swal.fire({
        title: '¿Eliminar registro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#e74c3c'
    }).then((result) => {
        if (result.isConfirmed) {
            matrixData = matrixData.filter(m => m.id !== id);
            renderMatrix();
            Swal.fire('Eliminado', 'Registro eliminado.', 'success');
        }
    });
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderFilterOptions();
    renderMatrix();
});
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    renderFilterOptions();
    renderMatrix();
}
