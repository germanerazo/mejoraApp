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
        const logoUrl = company.ruta ? `${config.ASSETS_URL}${company.ruta}` : '../img/default-logo.png';
        
        tr.innerHTML = `
            <td><img src="${logoUrl}" class="company-logo-thumb" onerror="this.src='../assets/logo_mejora.png'"></td>
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
            { targets: [0, -1], orderable: false }
        ]
    });
    dataTableInitialized = true;
}

let currentEditingId = null;

function showFormView(company = null) {
    const formPanel = document.getElementById('formView');
    const formTitle = document.getElementById('formTitle');
    const form = document.getElementById('companyForm');
    
    // Reset form
    form.reset();
    currentEditingId = null;
    
    // Reset logo preview
    const logoPreview = document.getElementById('logoPreview');
    const logoPreviewImg = document.getElementById('logoPreviewImg');
    if (logoPreview) logoPreview.style.display = 'none';
    if (logoPreviewImg) logoPreviewImg.src = '';
    
    // Update title
    if (company) {
        formTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Cliente';
        currentEditingId = company.idEmpresa;
        
        // Fill form with company data
        document.getElementById('tipIdentEmp').value = company.tipIdentEmp || '';
        document.getElementById('nroIdentEmp').value = company.nroIdentEmp || '';
        document.getElementById('nomEmpresa').value = company.nomEmpresa || '';
        document.getElementById('sigla').value = company.sigla || '';
        document.getElementById('naturaleza').value = company.naturaleza || '';
        document.getElementById('tipRegimenEmp').value = company.tipRegimenEmp || '';
        document.getElementById('codDepto').value = company.codDepto || '';
        document.getElementById('codCiudad').value = company.codCiudad || '';
        document.getElementById('direccion').value = company.direccion || '';
        document.getElementById('email').value = company.email || '';
        document.getElementById('telFijo').value = company.telFijo || '';
        document.getElementById('nombre1').value = company['1nombre'] || '';
        document.getElementById('nombre2').value = company['2nombre'] || '';
        document.getElementById('apel1').value = company['1apel'] || '';
        document.getElementById('apel2').value = company['2apel'] || '';
        document.getElementById('tipIdent').value = company.tipIdent || '';
        document.getElementById('nroIdent').value = company.nroIdent || '';
        document.getElementById('gerente').value = company.gerente || '';
        document.getElementById('representante').value = company.representante || '';
        document.getElementById('profesional').value = company.profesional || '';
        document.getElementById('estado').value = company.estado || '';
        document.getElementById('fecVincula').value = company.fecVincula || '';
        document.getElementById('fecFin').value = company.fecFin || '';
        document.getElementById('fechaEntrega').value = company.fechaEntrega || '';
        
        // Show existing logo if available
        if (company.ruta && logoPreview && logoPreviewImg) {
            logoPreviewImg.src = `${config.ASSETS_URL}${company.ruta}`;
            logoPreview.style.display = 'block';
        }
    } else {
        formTitle.innerHTML = '<i class="fas fa-building"></i> Nuevo Cliente';
    }
    
    // Show panel
    formPanel.classList.add('active');
    document.getElementById('tableView').classList.add('shifted');
}

function hideFormView() {
    const formPanel = document.getElementById('formView');
    formPanel.classList.remove('active');
    document.getElementById('tableView').classList.remove('shifted');
    currentEditingId = null;
}

function saveCompany(formData, companyId = null) {
    const isFormData = formData instanceof FormData;
    const method = companyId ? 'PUT' : 'POST';
    const url = companyId ? `${API_URL}?id=${companyId}` : API_URL;

    const token = sessionStorage.getItem('token');
    
    // If it's FormData, we must use POST for file uploads to work in most PHP setups
    // and we also need to append the token and ID
    const useMethod = isFormData ? 'POST' : method;
    
    if (isFormData) {
        if (token) formData.append('token', token);
        if (companyId) formData.append('idEmpresa', companyId);
    } else {
        if (token) formData.token = token;
        if (companyId) formData.idEmpresa = companyId;
    }

    fetch(url, {
        method: useMethod,
        headers: isFormData ? {} : {
            'Content-Type': 'application/json'
        },
        body: isFormData ? formData : JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(response => {
        if (response.success || response.message) {
            Swal.fire({
                icon: 'success',
                title: companyId ? '¡Actualizado!' : '¡Creado!',
                text: companyId ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente',
                confirmButtonText: 'OK',
                timer: 2000
            });
            loadCompanies();
            hideFormView();
        } else {
            Swal.fire('Error', 'No se pudo guardar el cliente', 'error');
        }
    })
    .catch(err => {
        console.error('Error saving company:', err);
        Swal.fire('Error', 'Error al conectar con el servidor', 'error');
    });
}

function openEditModal(company) {
    showFormView(company);
}

function openDeleteModal(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: '<i class="fas fa-trash"></i> Sí, eliminar',
        cancelButtonText: '<i class="fas fa-times"></i> Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_URL}?id=${id}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: 'El cliente ha sido eliminado',
                        confirmButtonText: 'OK',
                        timer: 2000
                    });
                    loadCompanies();
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el cliente', 'error');
                }
            })
            .catch(err => {
                console.error('Error deleting company:', err);
                Swal.fire('Error', 'Error al conectar con el servidor', 'error');
            });
        }
    });
}

// Expose functions to global scope
window.showFormView = showFormView;
window.hideFormView = hideFormView;
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCompanies);
} else {
    initializeCompanies();
}

function initializeCompanies() {
    // Setup logo preview handler
    const logoFileInput = document.getElementById('logoFile');
    if (logoFileInput) {
        logoFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const logoPreview = document.getElementById('logoPreview');
                    const logoPreviewImg = document.getElementById('logoPreviewImg');
                    if (logoPreviewImg && logoPreview) {
                        logoPreviewImg.src = event.target.result;
                        logoPreview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Setup form submission handler
    const form = document.getElementById('companyForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const logoFile = document.getElementById('logoFile').files[0];
            
            // Map field names for FormData/JSON
            const n1 = form.nombre1 ? form.nombre1.value : '';
            const n2 = form.nombre2 ? form.nombre2.value : '';
            const a1 = form.apel1 ? form.apel1.value : '';
            const a2 = form.apel2 ? form.apel2.value : '';

            if (logoFile) {
                formData.delete('nombre1');
                formData.delete('nombre2');
                formData.delete('apel1');
                formData.delete('apel2');
                formData.append('1nombre', n1);
                formData.append('2nombre', n2);
                formData.append('1apel', a1);
                formData.append('2apel', a2);
                
                saveCompany(formData, currentEditingId);
            } else {
                const data = Object.fromEntries(formData.entries());
                delete data.logoFile;
                
                const mappedData = {
                    ...data,
                    '1nombre': n1,
                    '2nombre': n2,
                    '1apel': a1,
                    '2apel': a2
                };
                
                delete mappedData.nombre1;
                delete mappedData.nombre2;
                delete mappedData.apel1;
                delete mappedData.apel2;
                
                saveCompany(mappedData, currentEditingId);
            }
        });
    }
    
    // Load companies data
    loadCompanies();
}