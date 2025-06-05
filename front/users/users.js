import config from '../js/config.js';


// Configuración de la URL base (ajusta según tu entorno)
const API_URL = `${config.BASE_API_URL}users.php`;

function loadUsers() {
    fetch(`${API_URL}?page=1`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                renderUsers(data);
            } else if (data.result) {
                renderUsers(data.result);
            } else {
                Swal.fire('Error', 'No se pudo cargar la lista de usuarios', 'error');
            }
        })
        .catch((e) => {
            console.error('users.js: Error en fetch', e);
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        });
}

function renderUsers(users) {
    const tbody = document.getElementById('usersTbody');
    if (!tbody) {
        console.error('users.js: No se encontró el tbody');
        return;
    }
    tbody.innerHTML = '';
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.idUsuario}</td>
            <td>${user.nombre}</td>
            <td>${user.email}</td>
            <td>${user.codusr}</td>
            <td>${user.nomEmpresa}</td>
            <td>${user.perfil}</td>
            <td class="actions">
                <button class="edit-btn" data-user='${JSON.stringify(user)}'>Editar</button>
                <button class="delete-btn" data-id='${user.idUsuario}'>Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Delegación de eventos para los botones
    tbody.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const user = JSON.parse(e.currentTarget.getAttribute('data-user'));
            openUserModal(user);
        });
    });
    tbody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.currentTarget.getAttribute('data-id');
            deleteUser(userId);
        });
    });
}

async function getCompaniesOptions(selectedId = null) {
    const url = `${config.BASE_API_URL}companies.php?page=1`;
    try {
        const res = await fetch(url);
        const companies = await res.json();
        let options = '<option value="">Seleccione una empresa...</option>';
        companies.forEach(emp => {
            options += `<option value="${emp.idEmpresa}" ${selectedId == emp.idEmpresa ? 'selected' : ''}>${emp.nomEmpresa}</option>`;
        });
        return options;
    } catch (e) {
        return '<option value="">Error cargando empresas</option>';
    }
}

async function openUserModal(user = null) {
    const isEdit = !!user;
    const companiesOptions = await getCompaniesOptions(user ? user.idCliente : null);

    Swal.fire({
        title: isEdit ? 'Editar Usuario' : 'Nuevo Usuario',
        html: `
            <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${user ? user.nombre : ''}">
            <input id="swal-email" class="swal2-input" placeholder="Email" value="${user ? user.email : ''}">
            <input id="swal-cc" class="swal2-input" placeholder="CC" value="${user ? user.codusr : ''}">
            <select id="swal-idClient" class="swal2-input" style="width:100%;">${companiesOptions}</select>
            <select id="swal-profile" class="swal2-input" style="width:100%;">
                <option value="">Seleccione perfil...</option>
                <option value="ADM" ${user && user.perfil === 'ADM' ? 'selected' : ''}>Administrador</option>
                <option value="CLI" ${user && user.perfil === 'CLI' ? 'selected' : ''}>Cliente</option>
            </select>
            ${isEdit ? '<input id="swal-password" class="swal2-input" placeholder="Nueva contraseña (opcional)" type="password">' : '<input id="swal-password" class="swal2-input" placeholder="Contraseña" type="password">'}
        `,
        didOpen: () => {
            // Inicializa select2 para búsqueda
            $('#swal-idClient').select2({
                dropdownParent: $('.swal2-popup'),
                width: '100%'
            });
        },
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: isEdit ? 'Actualizar' : 'Crear',
        preConfirm: () => {
            const name = document.getElementById('swal-name').value.trim();
            const email = document.getElementById('swal-email').value.trim();
            const cc = document.getElementById('swal-cc').value.trim();
            const idClient = document.getElementById('swal-idClient').value;
            const profile = document.getElementById('swal-profile').value.trim();
            const password = document.getElementById('swal-password').value.trim();
            if (!name || !email || !cc || !idClient || !profile || (!isEdit && !password)) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }
            return { name, email, cc, idClient, profile, password };
        }
    }).then(result => {
        if (result.isConfirmed) {
            if (isEdit) {
                updateUser(user.idUsuario, result.value);
            } else {
                createUser(result.value);
            }
        }
    });
}

function createUser(data) {
    const payload = {
        token: sessionStorage.getItem('token') || '',
        name: data.name,
        email: data.email,
        cc: data.cc,
        idClient: data.idClient,
        password: data.password,
        profile: data.profile
    };
    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.status == "ok") {
            Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
            loadUsers();
        } else {
            Swal.fire('Error', resp.result.error_message || 'No se pudo crear el usuario valide el numero de cédula', 'error');
        }
    })
    .catch((e) => {
        console.error('users.js: Error en createUser', e);
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    });
}

function updateUser(userId, data) {
    console.log('users.js: updateUser', userId, data);
    const payload = {
        token: sessionStorage.getItem('token') || '',
        userId: userId,
        name: data.name,
        email: data.email,
        cc: data.cc,
        idClient: data.idClient,
        profile: data.profile
    };
    if (data.password) payload.password = data.password;
    fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(resp => {
        console.log('users.js: updateUser respuesta', resp);
        if (resp.status == "ok") {
            Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
            loadUsers();
        } else {
            Swal.fire('Error', resp.result.error_message || 'No se pudo actualizar el usuario', 'error');
        }
    })
    .catch((e) => {
        console.error('users.js: Error en updateUser', e);
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    });
}

function deleteUser(userId) {
    console.log('users.js: deleteUser', userId);
    Swal.fire({
        title: '¿Estás seguro de eliminar usuario?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(result => {
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
                    Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
                    loadUsers();
                } else {
                    Swal.fire('Error', resp.error || 'No se pudo eliminar el usuario', 'error');
                }
            })
            .catch((e) => {
                console.error('users.js: Error en deleteUser', e);
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            });
        }
    });
}

// Haz global la función para el botón
window.openUserModal = openUserModal;
loadUsers();
