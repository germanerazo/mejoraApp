// Mock Data for Profiles
let profileData = [
    { id: 1, name: 'Analista de operaciones', status: 'active' },
    { id: 2, name: 'Auxiliar de servicios generales', status: 'active' },
    { id: 3, name: 'Contadora', status: 'active' },
    { id: 4, name: 'Director logístico', status: 'active' },
    { id: 5, name: 'Gerente General', status: 'active' },
    { id: 6, name: 'Jefe de Talento Humano', status: 'active' },
    { id: 7, name: 'Auxiliar de Bodega', status: 'active' }
];

const initProfileList = () => {
    renderProfiles(profileData);
};

window.renderProfiles = (data) => {
    const tbody = document.querySelector('#tableProfiles tbody');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="empty-state">No se encontraron registros.</td></tr>`;
        return;
    }

    let html = '';
    data.forEach(item => {
        html += `<tr>
            <td class="table-actions">
                <button class="btn-icon btn-edit" title="Editar" onclick="editProfile(${item.id})">✏️</button>
                <button class="btn-icon btn-delete" title="Eliminar/Desactivar" onclick="deleteProfile(${item.id})">➖</button>
            </td>
            <td>${item.name}</td>
            <td class="table-actions">
                <button class="btn-icon btn-view" title="Ver Detalle" onclick="viewProfile(${item.id})">🔍</button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
};

window.filterProfiles = () => {
    const term = document.getElementById('filterName').value.toLowerCase();
    const filtered = profileData.filter(p => p.name.toLowerCase().includes(term));
    renderProfiles(filtered);
};

// Profile Creation Logic
// Profile Creation Logic
window.showCreateProfile = () => {
    document.getElementById('mainProfileView').style.display = 'none';
    document.getElementById('createProfileView').style.display = 'block';
    
    // Reset State
    document.getElementById('profileJob').value = '';
    document.getElementById('profileReportTo').value = '';
    document.getElementById('profileDetails').style.display = 'none';
    document.getElementById('responsibilitiesList').innerHTML = ''; // Clear responsibilities
};

window.hideCreateProfile = () => {
    document.getElementById('createProfileView').style.display = 'none';
    document.getElementById('mainProfileView').style.display = 'block';
};

window.saveProfile = () => {
    const job = document.getElementById('profileJob').value;
    if (!job) {
        Swal.fire('Error', 'Debe seleccionar un cargo', 'error');
        return;
    }

    // Determine if we are just revealing sections or "saving changes"
    const detailsVisible = document.getElementById('profileDetails').style.display === 'block';

    if (!detailsVisible) {
        // First save (Creation Phase)
        Swal.fire({
            title: 'Perfil Guardado',
            text: 'Ahora puede diligenciar los detalles (Educación, Formación, etc.)',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        document.getElementById('profileDetails').style.display = 'block';
    } else {
        // Subsequent save (Update Phase)
        Swal.fire('Actualizado', 'La información ha sido almacenada correctamente.', 'success');
    }
};

window.editProfile = (id) => {
    const profile = profileData.find(p => p.id === id);
    if (!profile) return;

    // Switch View
    document.getElementById('mainProfileView').style.display = 'none';
    document.getElementById('createProfileView').style.display = 'block';

    // Populate Data (Mock)
    document.getElementById('profileJob').value = 'Analista'; // Mock value
    document.getElementById('profileReportTo').value = 'Gerente General'; // Mock value

    // Populate Mock Responsibilities
    const respList = document.getElementById('responsibilitiesList');
    respList.innerHTML = '';
    // Add a few mock responsibilities
    addResponsibility('Responsabilidad de prueba 1');
    addResponsibility('Responsabilidad de prueba 2');

    // Show Details immediately for Edit Mode
    document.getElementById('profileDetails').style.display = 'block';
};

window.addResponsibility = (text = '') => {
    const container = document.getElementById('responsibilitiesList');
    const id = Date.now() + Math.random();
    
    const html = `
        <div id="resp_${id}" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">
            <input type="text" class="swal2-input" style="margin: 0; background: white;" value="${text}" placeholder="Describa la responsabilidad...">
            <button class="btn-icon btn-delete" title="Eliminar" onclick="removeResponsibility('resp_${id}')">➖</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
};

window.removeResponsibility = (id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
};

window.addSubsection = async (type) => {
    let title = '';
    switch(type) {
        case 'education': title = 'Educación'; break;
        case 'training': title = 'Formación'; break;
        case 'experience': title = 'Experiencia'; break;
        case 'profesiogram': title = 'Profesiograma'; break;
        case 'epp': title = 'EPP'; break;
    }

    const { value: text } = await Swal.fire({
        title: `Agregar ${title}`,
        input: 'textarea',
        inputLabel: 'Descripción',
        inputPlaceholder: `Describa el registro para ${title}...`,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar'
    });

    if (text) {
        // Find table and add row (Mock logic)
        const tableId = `table${type.charAt(0).toUpperCase() + type.slice(1)}`;
        const tbody = document.querySelector(`#${tableId} tbody`);
        if (tbody) {
            const row = `<tr>
                <td>${text}</td>
                <td style="text-align: center;">
                     <button class="btn-icon btn-delete" title="Eliminar">➖</button>
                </td>
            </tr>`;
           tbody.insertAdjacentHTML('beforeend', row);
        }
        Swal.fire('Agregado', '', 'success');
    }
};

window.createProfile = () => {
    // This is now showCreateProfile, keeping for backward compat if called elsewhere
    showCreateProfile();
};



window.deleteProfile = (id) => {
    const profile = profileData.find(p => p.id === id);
    Swal.fire({
        title: '¿Desactivar perfil?',
        text: `Se desactivará el cargo: ${profile.name}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Desactivado', '', 'success');
            // Mock removal/update logic here
        }
    });
};

window.viewProfile = (id) => {
    // Reusing edit logic for detail view as they are the same in reference (modi)
    editProfile(id);
}

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initProfileList);
} else {
    initProfileList();
}
