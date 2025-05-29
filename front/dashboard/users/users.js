import config from '../../js/config.js';

const API_URL = `${config.BASE_API_URL}users.php`;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('API_URL:', API_URL);

    loadUsers();

    function loadUsers() {
        console.log('Cargando usuarios desde:', API_URL);
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
            .catch(() => Swal.fire('Error', 'No se pudo conectar con el servidor', 'error'));
    }

    function renderUsers(users) {
        const tbody = document.getElementById('usersTbody');
        tbody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.idUsuario}</td>
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td>${user.codusr}</td>
                <td>${user.idCliente}</td>
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

    function openUserModal(user = null) {
        const isEdit = !!user;
        Swal.fire({
            title: isEdit ? 'Editar Usuario' : 'Nuevo Usuario',
            html: `
                <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${user ? user.nombre : ''}">
                <input id="swal-email" class="swal2-input" placeholder="Email" value="${user ? user.email : ''}">
                <input id="swal-cc" class="swal2-input" placeholder="CC" value="${user ? user.codusr : ''}">
                <input id="swal-idClient" class="swal2-input" placeholder="ID Cliente" value="${user ? user.idCliente : ''}">
                <input id="swal-profile" class="swal2-input" placeholder="Perfil" value="${user ? user.perfil : ''}">
                ${isEdit ? '<input id="swal-password" class="swal2-input" placeholder="Nueva contraseña (opcional)" type="password">' : '<input id="swal-password" class="swal2-input" placeholder="Contraseña" type="password">'}
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: isEdit ? 'Actualizar' : 'Crear',
            preConfirm: () => {
                const name = document.getElementById('swal-name').value.trim();
                const email = document.getElementById('swal-email').value.trim();
                const cc = document.getElementById('swal-cc').value.trim();
                const idClient = document.getElementById('swal-idClient').value.trim();
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
            token: localStorage.getItem('token') || '',
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
            if (resp.result) {
                Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
                loadUsers();
            } else {
                Swal.fire('Error', resp.error || 'No se pudo crear el usuario', 'error');
            }
        })
        .catch(() => Swal.fire('Error', 'No se pudo conectar con el servidor', 'error'));
    }

    function updateUser(userId, data) {
        const payload = {
            token: localStorage.getItem('token') || '',
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
            if (resp.result) {
                Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
                loadUsers();
            } else {
                Swal.fire('Error', resp.error || 'No se pudo actualizar el usuario', 'error');
            }
        })
        .catch(() => Swal.fire('Error', 'No se pudo conectar con el servidor', 'error'));
    }

    function deleteUser(userId) {
        Swal.fire({
            title: '¿Eliminar usuario?',
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
                        token: localStorage.getItem('token') || '',
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
                .catch(() => Swal.fire('Error', 'No se pudo conectar con el servidor', 'error'));
            }
        });
    }
});
window.openUserModal = openUserModal;