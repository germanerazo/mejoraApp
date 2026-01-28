import config from '../js/config.js';

const API_URL = `${config.BASE_API_URL}users.php`;
let currentEditingId = null;

// Inicializa DataTables
function initDataTable() {
    window.$('#usersTable').DataTable({
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
            { targets: [0, -1], orderable: false }
        ]
    });
}

function loadUsers() {
    fetch(`${API_URL}?page=1`)
        .then(res => res.json())
        .then(data => {
            console.log("loadUsers", data);
            if (window.$.fn.DataTable.isDataTable('#usersTable')) {
                window.$('#usersTable').DataTable().destroy();
            }

            const tbody = document.getElementById('usersTbody');
            tbody.innerHTML = '';
            
            const users = Array.isArray(data) ? data : (data.result || []);
            
            users.forEach(user => {
                const tr = document.createElement('tr');
                
                // Celdas de datos
                tr.innerHTML = `
                    <td>${user.idUsuario}</td>
                    <td>${user.nombre}</td>
                    <td>${user.email}</td>
                    <td>${user.codusr}</td>
                    <td>${user.nomEmpresa || 'N/A'}</td>
                    <td>${user.perfil == 'ADM' ? 'Administrador' : 'Cliente'}</td>
                `;
                
                // Celda de acciones con botones DOM para evitar problemas de quotes en JSON
                const tdActions = document.createElement('td');
                tdActions.className = 'actions';
                
                const btnEdit = document.createElement('button');
                btnEdit.className = 'edit-btn';
                btnEdit.textContent = 'Editar';
                btnEdit.onclick = () => openEditUser(user);
                
                const btnDelete = document.createElement('button');
                btnDelete.className = 'delete-btn';
                btnDelete.textContent = 'Eliminar';
                btnDelete.onclick = () => deleteUser(user.idUsuario);
                
                tdActions.appendChild(btnEdit);
                tdActions.appendChild(btnDelete);
                tr.appendChild(tdActions);
                
                tbody.appendChild(tr);
            });

            initDataTable();
        })
        .catch((e) => {
            console.error('users.js: Error en fetch', e);
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        });
}

async function loadCompaniesOptions(selectedId = null) {
    const select = document.getElementById('idClient');
    if(select.options.length > 1 && !selectedId) return; // Ya cargado

    try {
        const url = `${config.BASE_API_URL}companies.php?page=1`;
        const res = await fetch(url);
        const companies = await res.json();
        
        select.innerHTML = '<option value="">Seleccione...</option>';
        companies.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.idEmpresa;
            option.textContent = emp.nomEmpresa;
            if(selectedId && emp.idEmpresa == selectedId) option.selected = true;
            select.appendChild(option);
        });
        
        // Refrescar Select2 si se usa
        /*if($.fn.select2 && $('#idClient').data('select2')) {
             $('#idClient').trigger('change');
        }*/
    } catch (e) {
        console.error('Error cargando empresas', e);
    }
}

function showFormView(user = null) {
    const formPanel = document.getElementById('formView');
    const formTitle = document.getElementById('formTitle');
    const form = document.getElementById('userForm');
    const tableView = document.getElementById('tableView'); // Assuming you wrap table in a div like companies

    // Reset form
    form.reset();
    currentEditingId = null;
    
    // Cargar empresas
    loadCompaniesOptions(user ? user.idCliente : null);

    if (user) {
        formTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Usuario';
        currentEditingId = user.idUsuario;
        
        document.getElementById('nombre').value = user.nombre || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('codusr').value = user.codusr || '';
        document.getElementById('perfil').value = user.perfil || '';
        document.getElementById('password').required = false; // No obligatoria en edit
        document.getElementById('password').placeholder = "Dejar en blanco para no cambiar";
    } else {
        formTitle.innerHTML = '<i class="fas fa-user-plus"></i> Nuevo Usuario';
        document.getElementById('password').required = true;
        document.getElementById('password').placeholder = "";
    }
    
    // Animar entrada
    formPanel.classList.add('active');
    if(tableView) tableView.classList.add('shifted');
}

function hideFormView() {
    const formPanel = document.getElementById('formView');
    const tableView = document.getElementById('tableView');
    
    formPanel.classList.remove('active');
    if(tableView) tableView.classList.remove('shifted');
    currentEditingId = null;
}

function saveUser(e) {
    e.preventDefault();
    
    const form = document.getElementById('userForm');
    const formData = new FormData(form);
    
    const data = {
        token: sessionStorage.getItem('token') || '',
        name: formData.get('nombre'),
        email: formData.get('email'),
        cc: formData.get('codusr'),
        idClient: formData.get('idClient'),
        profile: formData.get('perfil'),
        password: formData.get('password')
    };

    if (currentEditingId) {
        // Update
        data.userId = currentEditingId;
        if (!data.password) delete data.password; // No enviar si está vacío
        
        fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resp => {
            if (resp.status == "ok") {
                Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
                hideFormView();
                loadUsers();
            } else {
                Swal.fire('Error', resp.result.error_message || 'Error al actualizar', 'error');
            }
        });
    } else {
        // Create
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resp => {
            if (resp.status == "ok") {
                Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
                hideFormView();
                loadUsers();
            } else {
                Swal.fire('Error', resp.result.error_message || 'Error al crear', 'error');
            }
        });
    }
}

function deleteUser(userId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(API_URL, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: sessionStorage.getItem('token') || '',
                    userId: userId
                })
            })
            .then(res => res.json())
            .then(resp => {
                if (resp.result) {
                    Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
                    loadUsers();
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
                }
            });
        }
    });
}

// Expose functions globally
window.openEditUser = function(user) {
    showFormView(user);
};
window.deleteUser = deleteUser;
window.showFormView = showFormView;
window.hideFormView = hideFormView;

// Listeners
// Listeners
// Como este script se carga dinámicamente, el DOMContentLoaded ya ocurrió.
// Ejecutamos directamente, validando que los elementos existan.

console.log('users.js: script cargado');

const form = document.getElementById('userForm');
if(form) {
    // Remover listener previo para evitar duplicados si se recarga (aunque al limpiar innerHTML se borran los elementos)
    form.removeEventListener('submit', saveUser); 
    form.addEventListener('submit', saveUser);
}

// Cargar usuarios inmediatamente
loadUsers();
