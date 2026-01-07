import config from "../js/config.js";

const API_URL = `${config.BASE_API_URL}companies.php`;

function loadCompanies() {
    fetch(`${API_URL}?page=1`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                renderCompanies(data);
            } else if (data.result) {
                renderCompanies(data.result);
            } else {
                Swal.fire('Error', 'No se pudo cargar la lista de clientes', 'error');
            }
        })
        .catch((e) => {
            console.error('companies.js: Error en fetch', e);
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        });
}

let dataTableInitialized = false;
let dataTableInstance;

function renderCompanies(companiesList) {
    const tbody = document.getElementById('companiesTbody');
    if (!tbody) {
        console.error('companies.js: No se encontró el tbody');
        return;
    }

    // Si ya está inicializado, destrúyelo antes de modificar el DOM
    if (dataTableInitialized) {
        dataTableInstance.destroy();
        dataTableInitialized = false;
    }

    tbody.innerHTML = '';

    companiesList.forEach(company => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${company.nroIdentEmp}</td>
            <td>${company.nomEmpresa}</td>
            <td>${company.gerente}</td>
            <td>${company.email}</td>
            <td>${company.telFijo}</td>
            <td>${company.codCiudad}</td>
            <td class="actions">
                <button class="edit-btn" data-company='${JSON.stringify(company)}'>Editar</button>
                <button class="delete-btn" data-id='${company.idEmpresa}'>Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
);

tbody.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const company = JSON.parse(e.target.getAttribute('data-company'));
        openEditModal(company);
    });
}
);
tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        openDeleteModal(id);
    });
}
);

    // Inicializar DataTable
    dataTableInstance = $('#companiesTable').DataTable({
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

async function openCompaniesModal(company = null) {
    const isEdit = !!company;

    Swal.fire({
        title: isEdit ? 'Editar Cliente' : 'Nuevo Cliente',
        html: `
            <select id="swal-type" class="swal2-input" style="width:100%;">
                <option value="">Seleccione ...</option>
                <option value="NIT" ${company && company.tipIdentEmp === 'NIT' ? 'selected' : ''}>NIT</option>
                <option value="CC" ${company && company.tipIdentEmp === 'CC' ? 'selected' : ''}>Cédula de ciudadania</option>
            </select>
            <input id="swal-nroIdentEmp" class="swal2-input" placeholder="Nro. Identificación" value="${isEdit ? company.nroIdentEmp : ''}" required>
            <input id="swal-nomEmpresa" class="swal2-input" placeholder="Nombre de la empresa" value="${isEdit ? company.nomEmpresa : ''}" required>
            <input id="swal-sigla" class="swal2-input" placeholder="Abreviatura Empresa" value="${isEdit ? company.sigla : ''}" required>
            <input id="swal-naturaleza" class="swal2-input" placeholder="Naturaleza" value="${isEdit ? company.naturaleza : ''}" required>
            <input id="swal-departamento" class="swal2-input" placeholder="Departamento" value="${isEdit ? company.codDepto : ''}" required>
            <input id="swal-ciudad" class="swal2-input" placeholder="Ciudad" value="${isEdit ? company.codCiudad : ''}" required>
            <input id="swal-email" class="swal2-input" placeholder="Email" value="${isEdit ? company.email : ''}" required>
            <input id="swal-dirEmpresa" class="swal2-input" placeholder="Dirección de la empresa" value="${isEdit ? company.direccion : ''}" required>
            <input id="swal-telFijo" class="swal2-input" placeholder="Teléfono fijo" value="${isEdit ? company.telFijo : ''}" required>
            <input id="swal-nombre1" class="swal2-input" placeholder="Primer Nombre" value="${isEdit ? company.nombre1 : ''}" required>
            <input id="swal-nombre2" class="swal2-input" placeholder="Segundo Nombre" value="${isEdit ? company.nombre2 : ''}" >
            <input id="swal-apel1" class="swal2-input" placeholder="Primer Apellido" value="${isEdit ? company.apel1 : ''}" required>
            <input id="swal-apel2" class="swal2-input" placeholder="Segundo Apellido" value="${isEdit ? company.apel2 : ''}" >
            <input id="swal-gerente" class="swal2-input" placeholder="Gerente" value="${isEdit ? company.gerente : ''}" required>
            <input id="swal-representante" class="swal2-input" placeholder="Representante legal" value="${isEdit ? company.representante : ''}" required>
            <input id="swal-tipoIdentificacion" class="swal2-input" placeholder="Tipo de identificación" value="${isEdit ? company.tipIdent : ''}" required>
            <input id="swal-nroIdentificacion" class="swal2-input" placeholder="Número de identificación contacto" value="${isEdit ? company.nroIdent : ''}" required>
            <input id="swal-vigencia" class="swal2-input" placeholder="Vigencia contrato desde" value="${isEdit ? company.fecVincula : ''}" required>
            <input id="swal-vigenciaFin" class="swal2-input" placeholder="Vigencia contrato hasta" value="${isEdit ? company.fecFin : ''}" required>
            <input id="swal-fechaEntrega" class="swal2-input" placeholder="Fecha Entrega" value="${isEdit ? company.fechaEntrega : ''}" required>
            <input id="swal-profesional" class="swal2-input" placeholder="Profesional asignado" value="${isEdit ? company.profesional : ''}" required>
            <select id="swal-estate" class="swal2-input" style="width:100%;">
                <option value="">Seleccione ...</option>
                <option value="0" ${company && company.estado === '0' ? 'selected' : ''}>Activo</option>
                <option value="1" ${company && company.estado === '1' ? 'selected' : ''}>Inactivo</option>
            </select>            
        `,
        showCancelButton: true,
        confirmButtonText: isEdit ? 'Actualizar' : 'Crear',
        preConfirm: () => {
            const form = document.getElementById('companyForm');
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            return data;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            saveCompany(result.value, isEdit ? company.idEmpresa : null);
        }
    });
}

window.openCompaniesModal = openCompaniesModal;
loadCompanies();