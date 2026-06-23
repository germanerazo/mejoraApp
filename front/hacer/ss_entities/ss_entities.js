let currentEditingId = null;

async function loadEntities() {
    try {
        const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
        const res = await fetch(`../../api/ss_entities.php?idEmpresa=${idEmpresa}`);
        const data = await res.json();
        
        const tbody = document.querySelector('#dataTable tbody');
        if (!tbody) return;

        const entities = Array.isArray(data) ? data : (data.result || []);

        if (entities.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #999;">No hay entidades registradas.</td></tr>`;
            return;
        }

        let html = '';
        entities.forEach(item => {
            html += `<tr>
                <td><strong>${item.tipo}</strong></td>
                <td>${item.nombre}</td>
                <td style="text-align: center;">
                    <div style="display: flex; gap: 8px; justify-content: center;">
                        <button class="btn-edit-premium" title="Editar" onclick="editEntity(${item.idEntity}, '${item.tipo}', '${item.nombre}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete-premium" title="Eliminar" onclick="deleteEntity(${item.idEntity})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
        });
        tbody.innerHTML = html;
    } catch (e) {
        console.error('Error loading entities', e);
        Swal.fire('Error', 'No se pudieron cargar las entidades', 'error');
    }
}

function showFormView() {
    document.getElementById('listView').style.display = 'none';
    document.getElementById('listHeader').style.display = 'none';
    document.getElementById('formView').style.display = 'block';
    
    document.getElementById('entityForm').reset();
    document.getElementById('formTitle').innerText = 'NUEVA ENTIDAD';
    currentEditingId = null;
}

function hideFormView() {
    document.getElementById('formView').style.display = 'none';
    document.getElementById('listHeader').style.display = 'block';
    document.getElementById('listView').style.display = 'block';
}

function editEntity(id, tipo, nombre) {
    showFormView();
    document.getElementById('formTitle').innerText = 'EDITAR ENTIDAD';
    currentEditingId = id;
    document.getElementById('fieldId').value = id;
    document.getElementById('fieldTipo').value = tipo;
    document.getElementById('fieldNombre').value = nombre;
}

async function saveEntity() {
    const tipo = document.getElementById('fieldTipo').value;
    const nombre = document.getElementById('fieldNombre').value;
    
    if (!tipo || !nombre) {
        Swal.fire('Atención', 'Complete todos los campos requeridos', 'warning');
        return;
    }

    const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
    const token = sessionStorage.getItem('token') || '';

    const payload = {
        token: token,
        idEmpresa: idEmpresa,
        tipo: tipo,
        nombre: nombre
    };

    let method = 'POST';
    if (currentEditingId) {
        payload.idEntity = currentEditingId;
        method = 'PUT';
    }

    try {
        const res = await fetch(`../../api/ss_entities.php?_method=${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const resp = await res.json();

        if (resp.status === 'ok' || resp.result) {
            Swal.fire('Éxito', 'Entidad guardada correctamente', 'success');
            hideFormView();
            loadEntities();
        } else {
            Swal.fire('Error', resp.result?.error_msg || 'Error al guardar', 'error');
        }
    } catch (e) {
        console.error('Error saving entity', e);
        Swal.fire('Error', 'No se pudo guardar la entidad', 'error');
    }
}

function deleteEntity(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
                const token = sessionStorage.getItem('token') || '';
                
                const res = await fetch('../../api/ss_entities.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, idEmpresa, idEntity: id })
                });
                const resp = await res.json();
                
                if (resp.status === 'ok' || resp.result) {
                    Swal.fire('Eliminado', 'La entidad ha sido eliminada.', 'success');
                    loadEntities();
                } else {
                    Swal.fire('Error', 'No se pudo eliminar la entidad', 'error');
                }
            } catch (e) {
                console.error('Error deleting', e);
                Swal.fire('Error', 'Ocurrió un error', 'error');
            }
        }
    });
}

// Export functions
window.showFormView = showFormView;
window.hideFormView = hideFormView;
window.editEntity = editEntity;
window.saveEntity = saveEntity;
window.deleteEntity = deleteEntity;

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadEntities();
});
// Fallback if already loaded
loadEntities();
