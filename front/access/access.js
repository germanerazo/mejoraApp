import config from '../js/config.js';

const API_URL = `${config.BASE_API_URL}access.php`;

function loadAccess() {
    
    fetch(`${API_URL}?page=1`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                renderAccess(data);
            } else if (data.result) {
                renderAccess(data.result);
            } else {
                Swal.fire('Error', 'No se pudo cargar la lista de accesos', 'error');
            }
        })
        .catch((e) => {
            console.error('access.js: Error en fetch', e);
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        });
}

let dataTableInitialized = false;
let dataTableInstance;

function renderAccess(accessList) {
    const tbody = document.getElementById('accessTbody');
    if (!tbody) {
        console.error('access.js: No se encontró el tbody');
        return;
    }

    // Si ya está inicializado, destrúyelo antes de modificar el DOM
    if (dataTableInitialized) {
        dataTableInstance.destroy();
        dataTableInitialized = false;
    }

    tbody.innerHTML = '';

    accessList.forEach(access => {
        const tr = document.createElement('tr');
        const estadoTexto = access.estado == 0 ? 'Activo' : 'Inactivo';
        const estadoColor = access.estado == 0 ? 'background-color: #d4edda; color: #155724;' : 'background-color: #e2e3e5; color: #6c757d;';
        tr.innerHTML = `
            <td>${access.idAcceso}</td>
            <td>${access.codigo}</td>
            <td>${access.rol}</td>
            <td>${access.idUsuario}</td>
            <td>${access.acceso}</td>
            <td style="${estadoColor}">${estadoTexto}</td>
            <td class="actions" style="display: flex; gap: 5px;">
                <button class="btn-edit-premium edit-btn" data-access='${JSON.stringify(access)}' title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-premium delete-btn" data-id='${access.idAcceso}' title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Delegación de eventos para los botones
    tbody.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const access = JSON.parse(e.currentTarget.getAttribute('data-access'));
            openAccessModal(access);
        });
    });
    tbody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const accessId = e.currentTarget.getAttribute('data-id');
            deleteAccess(accessId);
        });
    });

    // Inicializa SIEMPRE el DataTable después de poblar la tabla
    dataTableInstance = $('#accessTable').DataTable({
        pageLength: 10,
        language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "No se encontraron resultados",
            info: "Mostrando página _PAGE_ de _PAGES_",
            infoEmpty: "No hay registros disponibles",
            infoFiltered: "(filtrado de _MAX_ registros totales)",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        },
        columnDefs: [
            { targets: -1, orderable: false }
        ]
    });
    dataTableInitialized = true;
}

async function openAccessModal(access = null) {
    const isEdit = !!access;

    Swal.fire({
        title: isEdit ? 'Editar Acceso' : 'Nuevo -Acceso',
        html: `
            <input id="swal-code" class="swal2-input" placeholder="Código" value="${isEdit ? access.codigo : ''}">
            <select id="swal-role" class="swal2-input" style="width:100%;">
                <option value="">Seleccione perfil...</option>
                <option value="ADM" ${access && access.rol === 'ADM' ? 'selected' : ''}>Administrador</option>
                <option value="CLI" ${access && access.rol === 'CLI' ? 'selected' : ''}>Cliente</option>
            </select>
            <input id="swal-user-id" class="swal2-input" placeholder="ID Usuario" value="${isEdit ? access.idUsuario : ''}">
            <input id="swal-access" class="swal2-input" placeholder="Acceso" value="${isEdit ? access.acceso : ''}">
            <select id="swal-status" class="swal2-input">
                <option value="0" ${isEdit && access.estado === '0' ? 'selected' : ''}>Activo</option>
                <option value="1" ${isEdit && access.estado === '1' ? 'selected' : ''}>Inactivo</option>
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: isEdit ? 'Actualizar' : 'Crear',
        preConfirm: () => {
            const code = document.getElementById('swal-code').value;
            const role = document.getElementById('swal-role').value;
            const userId = document.getElementById('swal-user-id').value;
            const accessValue = document.getElementById('swal-access').value;
            const status = document.getElementById('swal-status').value;

            if (!code || !role || !userId || !accessValue) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }

            return {
                idAcceso: isEdit ? access.idAcceso : null,
                codigo: code,
                rol: role,
                idUsuario: userId,
                acceso: accessValue,
                estado: status
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const accessData = result.value;
            if (isEdit) {
                updateAccess(accessData);
            } else {
                createAccess(accessData);
            }
        }
    });
}

function createAccess(accessData) {
    const payload = {
        token: sessionStorage.getItem('token') || '',
        codigo: accessData.codigo,
        rol: accessData.rol,
        idUsuario: accessData.idUsuario,
        acceso: accessData.acceso,
        estado: accessData.estado
    };
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.status == "ok") {
            Swal.fire('Éxito', 'Acceso creado correctamente', 'success');
            loadAccess();
        } else {
            Swal.fire('Error', resp.result.error_message || 'No se pudo crear el acceso valide el código', 'error');
        }
    })
    .catch((e) => {
        console.error('access.js: Error al crear acceso', e);
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    });
}

function updateAccess(accessData) {
    const payload = {
        token: sessionStorage.getItem('token') || '',
        idAcceso: accessData.idAcceso,
        codigo: accessData.codigo,
        rol: accessData.rol,
        idUsuario: accessData.idUsuario,
        acceso: accessData.acceso,
        estado: accessData.estado
    };
    fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.status == "ok") {
            Swal.fire('Éxito', 'Acceso actualizado correctamente', 'success')
            .then(() => {
                loadAccess();
            });
        } else {
            Swal.fire('Error', resp.result.error_message || 'No se pudo actualizar el acceso', 'error');
        }
    })
    .catch((e) => {
        console.error('access.js: Error al actualizar acceso', e);
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    });
}

function deleteAccess(accessId) {
    Swal.fire({
        title: '¿Estás seguro de eliminar acceso?',
        text: "No podrás recuperar este acceso una vez eliminado.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const payload = {
                token: sessionStorage.getItem('token') || '',
                idAcceso: accessId
            };
            fetch(API_URL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(resp => {
                if (resp.status == "ok") {
                    Swal.fire('Éxito', 'Acceso eliminado correctamente', 'success');
                    loadAccess();
                } else {
                    Swal.fire('Error', resp.result.error_message || 'No se pudo eliminar el acceso', 'error');
                }
            })
            .catch((e) => {
                console.error('access.js: Error al eliminar acceso', e);
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            });
        }
    });
}

window.openAccessModal = openAccessModal;
loadAccess();