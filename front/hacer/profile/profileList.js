// ============================================================
// profileList.js  –  Perfil de Cargos (CRUD real)
// ============================================================
import config from "../../js/config.js";

const API = `${config.BASE_API_URL}profileCargo.php`;

// ── Sesión ────────────────────────────────────────────────────────────────────
let idEmpresa = null;
let token     = null;

const loadSession = () => {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        token     = sessionStorage.getItem('token') || '';
        return true;
    }
    return false;
};

// ── Estado local ──────────────────────────────────────────────────────────────
let profileData    = [];   // lista completa de perfiles
let personnelList  = [];   // personal de processSheet (para los selects)
let currentProfile = null; // perfil activo en el formulario (objeto completo)

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const initProfileList = async () => {
    if (!loadSession()) {
        document.querySelector('#tableProfiles tbody').innerHTML =
            `<tr><td colspan="3" class="empty-state" style="color:#e74c3c;">
                <i class="fas fa-lock"></i> No se encontró sesión de empresa.
             </td></tr>`;
        return;
    }
    await Promise.all([loadProfiles(), loadPersonnel()]);
};

// ── READ: lista de perfiles ───────────────────────────────────────────────────
const loadProfiles = async () => {
    try {
        const resp = await fetch(`${API}?action=list&idEmpresa=${idEmpresa}`);
        profileData = await resp.json();
        if (!Array.isArray(profileData)) profileData = [];
        renderProfiles(profileData);
    } catch (err) {
        console.error('Error cargando perfiles:', err);
        renderProfiles([]);
    }
};

// ── READ: personal de processSheet para selects ───────────────────────────────
const loadPersonnel = async () => {
    try {
        const resp = await fetch(`${API}?action=personnel&idEmpresa=${idEmpresa}`);
        personnelList = await resp.json();
        if (!Array.isArray(personnelList)) personnelList = [];
    } catch (err) {
        console.error('Error cargando personal:', err);
        personnelList = [];
    }
};

// ── Render tabla principal ────────────────────────────────────────────────────
window.renderProfiles = (data) => {
    const tbody = document.querySelector('#tableProfiles tbody');
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="empty-state">
            <i class="fas fa-briefcase" style="font-size:1.8rem;opacity:.3;margin-bottom:8px;display:block;"></i>
            No se encontraron perfiles de cargo.
        </td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr>
            <td class="table-actions">
                <button class="btn-edit-premium" title="Editar" onclick="editProfile(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-premium" title="Eliminar" onclick="deleteProfile(${item.id}, '${escapeAttr(item.cargo)}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td><strong>${item.cargo}</strong>
                ${item.reportsTo ? `<br><small style="color:#8d99ae;">Reporta a: ${item.reportsTo}</small>` : ''}
            </td>
            <td class="table-actions">
                <button class="btn-view-premium" title="Ver Detalle" onclick="viewProfile(${item.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>`).join('');
};

// ── Filtro ────────────────────────────────────────────────────────────────────
window.filterProfiles = () => {
    const term = document.getElementById('filterName').value.toLowerCase().trim();
    const filtered = profileData.filter(p =>
        (p.cargo || '').toLowerCase().includes(term)
    );
    renderProfiles(filtered);
};

// ── Mostrar / ocultar vistas ──────────────────────────────────────────────────
window.showCreateProfile = () => {
    currentProfile = null;
    document.getElementById('mainProfileView').style.display   = 'none';
    document.getElementById('createProfileView').style.display = 'block';

    // Poblar selects desde personnelList
    populatePersonnelSelects();

    // Reset formulario
    document.getElementById('profileJob').value      = '';
    document.getElementById('profileReportTo').value = '';
    document.getElementById('profileDetails').style.display = 'none';
    document.getElementById('responsibilitiesList').innerHTML = '';
    clearSubTables();
};

window.hideCreateProfile = () => {
    document.getElementById('createProfileView').style.display = 'none';
    document.getElementById('mainProfileView').style.display   = 'block';
    currentProfile = null;
};

// ── Poblar selects con personal de processSheet ───────────────────────────────
const populatePersonnelSelects = () => {
    const jobSelect    = document.getElementById('profileJob');
    const reportSelect = document.getElementById('profileReportTo');

    // Cargos (todos los roles únicos)
    const uniqueRoles = [...new Map(personnelList.map(p => [p.role, p])).values()];

    const makeOptions = (includeBlank) => {
        let opts = includeBlank ? '<option value="">Seleccione...</option>' : '<option value="">Ninguno</option>';
        uniqueRoles.forEach(p => {
            opts += `<option value="${p.idPersonnel}" data-role="${escapeAttr(p.role)}">${p.role}</option>`;
        });
        return opts;
    };

    jobSelect.innerHTML    = makeOptions(true);
    reportSelect.innerHTML = makeOptions(false);
    // Agregar opciones fijas comunes
    reportSelect.innerHTML += `
        <option value="Gerente General">Gerente General</option>
        <option value="Junta Directiva">Junta Directiva</option>
        <option value="Propietario">Propietario</option>
    `;
};

// ── SAVE (crear o actualizar perfil base) ─────────────────────────────────────
window.saveProfile = async () => {
    const jobSelect    = document.getElementById('profileJob');
    const idPersonnel  = jobSelect.value;
    const reportsTo    = document.getElementById('profileReportTo').value;

    if (!idPersonnel) {
        Swal.fire('Error', 'Debe seleccionar un Cargo.', 'error');
        return;
    }

    const detailsVisible = document.getElementById('profileDetails').style.display === 'block';

    if (!detailsVisible) {
        // Primera vez: crear el perfil en la BD
        try {
            const resp = await fetch(`${API}?action=create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, idEmpresa, idPersonnel, reportsTo }),
            });
            const result = await resp.json();

            if (result.status !== 'ok') {
                Swal.fire('Error', result.result?.message || 'No se pudo guardar el perfil.', 'error');
                return;
            }

            currentProfile = { id: result.result.id, idPersonnel, reportsTo };
            document.getElementById('profileDetails').style.display = 'block';

            Swal.fire({
                title: '¡Perfil creado!',
                text: 'Ahora puede agregar los detalles del cargo.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });

            // Recargar lista en background
            loadProfiles();
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Error de conexión al guardar el perfil.', 'error');
        }
    } else {
        // Actualizar reportsTo
        try {
            await fetch(API, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, id: currentProfile.id, reportsTo }),
            });
            Swal.fire('Actualizado', 'La información del cargo fue actualizada.', 'success');
            loadProfiles();
        } catch (err) {
            Swal.fire('Error', 'Error al actualizar.', 'error');
        }
    }
};

// ── EDIT: cargar perfil completo en el formulario ─────────────────────────────
window.editProfile = async (id) => {
    Swal.fire({ title: 'Cargando...', didOpen: () => Swal.showLoading() });
    try {
        const resp = await fetch(`${API}?action=get&id=${id}`);
        const data = await resp.json();
        Swal.close();

        if (!data || !data.id) {
            Swal.fire('Error', 'No se pudo cargar el perfil.', 'error');
            return;
        }

        currentProfile = data;
        document.getElementById('mainProfileView').style.display   = 'none';
        document.getElementById('createProfileView').style.display = 'block';

        populatePersonnelSelects();

        // Seleccionar el cargo y reportsTo
        document.getElementById('profileJob').value      = data.idPersonnel;
        document.getElementById('profileReportTo').value = data.reportsTo || '';

        // Mostrar detalles
        document.getElementById('profileDetails').style.display = 'block';

        // Cargar subtablas
        renderSubTable('responsabilidades',     data.responsabilidades,     'responsibilitiesList',  true);
        renderSubTableRows('educacion',         data.educacion,         'tableEducation');
        renderSubTableRows('formacion',         data.formacion,         'tableTraining');
        renderSubTableRows('experiencia',       data.experiencia,       'tableExperience');
        renderSubTableRows('profesiograma',     data.profesiograma,     'tableProfesiogram');
        renderSubTableRows('competencias',      data.competencias,      'tableCompetence');
        renderSubTableRows('sst_riesgos',       data.sst_riesgos,       'tableSstRisk');
        renderSubTableRows('sst_responsabilidades', data.sst_responsabilidades, 'tableSstResp');
        renderSubTableRows('epp',               data.epp,               'tableEpp');

    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Error de conexión.', 'error');
    }
};

window.viewProfile = (id) => editProfile(id);

// ── DELETE: eliminar perfil completo ──────────────────────────────────────────
window.deleteProfile = (id, name) => {
    Swal.fire({
        title: '¿Eliminar perfil?',
        html: `Se eliminará el perfil de cargo <strong>${name}</strong> y toda su información asociada.<br>Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton:   true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText:  'Sí, eliminar',
        cancelButtonText:   'Cancelar',
    }).then(async (result) => {
        if (!result.isConfirmed) return;
        try {
            await fetch(API, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, id }),
            });
            Swal.fire('Eliminado', 'El perfil fue eliminado correctamente.', 'success');
            loadProfiles();
        } catch (err) {
            Swal.fire('Error', 'No se pudo eliminar.', 'error');
        }
    });
};

// ── RENDER responsabilidades (inputs editables) ───────────────────────────────
const renderSubTable = (type, items, containerId, isRespList) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    (items || []).forEach(item => renderResponsibilityRow(item.id, item.descripcion));
};

const renderResponsibilityRow = (dbId, text = '') => {
    const container = document.getElementById('responsibilitiesList');
    const uid = `resp_${dbId || Date.now() + Math.random()}`;
    container.insertAdjacentHTML('beforeend', `
        <div id="${uid}" style="display:flex; gap:10px; margin-bottom:10px; align-items:center;">
            <input type="text" class="swal2-input" style="margin:0;background:white;flex:1;"
                   value="${escapeAttr(text)}" placeholder="Describa la responsabilidad..."
                   onblur="updateRespText(this, ${dbId || 0})">
            <button class="btn-delete-premium" title="Eliminar"
                    onclick="removeSubItem(${dbId || 0}, 'responsabilidades', '${uid}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>`);
};

// Compatibilidad con el botón "+" de responsabilidades
window.addResponsibility = (text = '') => renderResponsibilityRow(0, text);

// ── RENDER subtablas estándar (tabla con fila) ────────────────────────────────
const renderSubTableRows = (type, items, tableId) => {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;
    tbody.innerHTML = '';
    (items || []).forEach(item => addRowToTable(type, tableId, item.id, item.descripcion));
};

const addRowToTable = (type, tableId, dbId, text) => {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;
    tbody.insertAdjacentHTML('beforeend', `
        <tr id="row_${tableId}_${dbId}">
            <td style="text-align:left;">${text}</td>
            <td style="text-align:center; width:80px;">
                <button class="btn-delete-premium" title="Eliminar"
                        onclick="removeSubItem(${dbId}, '${type}', null, 'row_${tableId}_${dbId}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>`);
};

// ── ADD ítem de subtabla via Swal ─────────────────────────────────────────────
window.addSubsection = async (type) => {
    if (!currentProfile) {
        Swal.fire('Aviso', 'Primero debe guardar el perfil de cargo.', 'warning');
        return;
    }

    const labels = {
        education:    'Educación',      training:    'Formación',
        experience:   'Experiencia',    profesiogram:'Profesiograma',
        competence:   'Competencia / Habilidad',
        sstRisk:      'Peligro / Riesgo SST',
        sstResp:      'Responsabilidad SST',
        epp:          'Elemento de Protección Personal',
    };

    // Mapear nombres del HTML → nombres del API
    const typeMap = {
        education: 'educacion', training: 'formacion', experience: 'experiencia',
        profesiogram: 'profesiograma', competence: 'competencias',
        sstRisk: 'sst_riesgos', sstResp: 'sst_responsabilidades', epp: 'epp',
    };
    const apiType  = typeMap[type] || type;
    const tableMap = {
        educacion: 'tableEducation', formacion: 'tableTraining',
        experiencia: 'tableExperience', profesiograma: 'tableProfesiogram',
        competencias: 'tableCompetence', sst_riesgos: 'tableSstRisk',
        sst_responsabilidades: 'tableSstResp', epp: 'tableEpp',
    };
    const tableId = tableMap[apiType];

    const { value: text } = await Swal.fire({
        title:           `Agregar ${labels[type] || type}`,
        input:           'textarea',
        inputLabel:      'Descripción',
        inputPlaceholder:`Describa el registro...`,
        showCancelButton: true,
        confirmButtonText:'Agregar',
        cancelButtonText: 'Cancelar',
        inputValidator:  (v) => !v.trim() ? 'Debe ingresar una descripción.' : null,
    });

    if (!text) return;

    try {
        const resp = await fetch(`${API}?action=addItem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token,
                idProfile:   currentProfile.id,
                type:        apiType,
                descripcion: text.trim(),
            }),
        });
        const result = await resp.json();
        if (result.status !== 'ok') {
            Swal.fire('Error', 'No se pudo agregar el ítem.', 'error');
            return;
        }
        addRowToTable(apiType, tableId, result.result.id, text.trim());
        Swal.fire({ icon: 'success', title: 'Agregado', timer: 1000, showConfirmButton: false });
    } catch (err) {
        Swal.fire('Error', 'Error de conexión.', 'error');
    }
};

// ── REMOVE ítem de subtabla ───────────────────────────────────────────────────
window.removeSubItem = async (dbId, type, respRowId, tableRowId) => {
    if (!dbId) {
        // Ítem local no guardado aún → solo quitar del DOM
        if (respRowId) document.getElementById(respRowId)?.remove();
        if (tableRowId) document.getElementById(tableRowId)?.remove();
        return;
    }

    const result = await Swal.fire({
        title: '¿Eliminar?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton:   true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText:  'Sí, eliminar',
        cancelButtonText:   'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
        await fetch(`${API}?action=deleteItem`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, itemId: dbId, type }),
        });
        if (respRowId)  document.getElementById(respRowId)?.remove();
        if (tableRowId) document.getElementById(tableRowId)?.remove();
    } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar.', 'error');
    }
};

// ── Helpers UI ────────────────────────────────────────────────────────────────
const clearSubTables = () => {
    ['tableEducation','tableTraining','tableExperience','tableProfesiogram',
     'tableCompetence','tableSstRisk','tableSstResp','tableEpp'].forEach(id => {
        const tbody = document.querySelector(`#${id} tbody`);
        if (tbody) tbody.innerHTML = '';
    });
};

const escapeAttr = (str) =>
    String(str ?? '').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

// ── Init ──────────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileList);
} else {
    initProfileList();
}
