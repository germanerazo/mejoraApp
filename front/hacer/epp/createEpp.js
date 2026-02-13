// JavaScript for EPP Catalog (Crear EPP)

// Mock Data
let eppCatalog = [
    { id: 1, name: 'Casco de Seguridad', standard: 'ANSI Z89.1' },
    { id: 2, name: 'Gafas de Seguridad', standard: 'ANSI Z87.1' },
    { id: 3, name: 'Guantes de Cuero', standard: 'EN 420' }
];

const renderEppCatalog = () => {
    const tbody = document.getElementById('eppCatalogBody');
    if (!tbody) return;

    if (eppCatalog.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">No hay EPPs registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = eppCatalog.map((item, index) => `
        <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.standard}</td>
            <td style="text-align: center;">
                <button class="action-btn edit" onclick="window.editEpp(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="window.deleteEpp(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');
};

window.openCreateEppModal = () => {
    Swal.fire({
        title: 'Nuevo EPP',
        html: `
            <input id="swal-epp-name" class="swal2-input" placeholder="Nombre del Elemento (Ej: Casco)">
            <input id="swal-epp-standard" class="swal2-input" placeholder="Norma Técnica (Ej: ANSI Z89.1)">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#27ae60',
        preConfirm: () => {
            const name = Swal.getPopup().querySelector('#swal-epp-name').value;
            const standard = Swal.getPopup().querySelector('#swal-epp-standard').value;
            if (!name || !standard) {
                Swal.showValidationMessage('Por favor complete ambos campos');
            }
            return { name, standard };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newId = eppCatalog.length > 0 ? Math.max(...eppCatalog.map(e => e.id)) + 1 : 1;
            eppCatalog.push({
                id: newId,
                name: result.value.name,
                standard: result.value.standard
            });
            renderEppCatalog();
            Swal.fire('Guardado', 'El EPP ha sido agregado al catálogo', 'success');
        }
    });
};

window.editEpp = (id) => {
    const item = eppCatalog.find(e => e.id === id);
    if (!item) return;

    Swal.fire({
        title: 'Editar EPP',
        html: `
            <input id="swal-epp-name" class="swal2-input" value="${item.name}" placeholder="Nombre del Elemento">
            <input id="swal-epp-standard" class="swal2-input" value="${item.standard}" placeholder="Norma Técnica">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar Cambios',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#f39c12',
        preConfirm: () => {
            const name = Swal.getPopup().querySelector('#swal-epp-name').value;
            const standard = Swal.getPopup().querySelector('#swal-epp-standard').value;
            if (!name || !standard) {
                Swal.showValidationMessage('Por favor complete ambos campos');
            }
            return { name, standard };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            item.name = result.value.name;
            item.standard = result.value.standard;
            renderEppCatalog();
            Swal.fire('Actualizado', 'El EPP ha sido modificado', 'success');
        }
    });
};

window.deleteEpp = (id) => {
    Swal.fire({
        title: '¿Eliminar EPP?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eppCatalog = eppCatalog.filter(e => e.id !== id);
            renderEppCatalog();
            Swal.fire('Eliminado', 'El EPP ha sido eliminado del catálogo', 'success');
        }
    });
};

// Init
document.addEventListener('DOMContentLoaded', renderEppCatalog);
// If loaded dynamically via dashboard innerHTML script injection
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    renderEppCatalog();
}
