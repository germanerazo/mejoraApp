// ============================================================
// profileList.js  –  Perfil de Cargos (CRUD real)
// ============================================================
import config from "../../js/config.js";

const API     = `${config.BASE_API_URL}profileCargo.php`;
const API_EPP = `${config.BASE_API_URL}eppCatalog.php`;

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

// ── RENDER responsabilidades (lista de tarjetas guardadas) ──────────────────
const renderSubTable = (type, items, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    (items || []).forEach(item => renderResponsibilityRow(item.id, item.descripcion));
};

const renderResponsibilityRow = (dbId, text = '') => {
    const container = document.getElementById('responsibilitiesList');
    const uid = `resp_${dbId}`;
    container.insertAdjacentHTML('beforeend', `
        <div id="${uid}" style="display:flex; gap:10px; margin-bottom:10px; align-items:flex-start;
             background:#f8f9fa; border:1px solid #e9ecef; border-radius:8px; padding:10px 14px;">
            <i class="fas fa-check-circle" style="color:#329bd6;margin-top:3px;flex-shrink:0;"></i>
            <span style="flex:1; font-size:14px; color:#374151; line-height:1.5;">${escapeHtml(text)}</span>
            <button class="btn-delete-premium" title="Eliminar"
                    onclick="removeSubItem(${dbId}, 'responsabilidades', '${uid}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>`);
};

// Botón "+" de responsabilidades → Swal + API (igual que addSubsection)
window.addResponsibility = async () => {
    if (!currentProfile) {
        Swal.fire('Aviso', 'Primero debe guardar el perfil de cargo.', 'warning');
        return;
    }

    const { value: text } = await Swal.fire({
        title:            'Agregar Responsabilidad',
        input:            'textarea',
        inputLabel:       'Descripción',
        inputPlaceholder: 'Describa la responsabilidad del cargo...',
        showCancelButton:  true,
        confirmButtonText: 'Agregar',
        cancelButtonText:  'Cancelar',
        inputValidator:    (v) => !v.trim() ? 'Debe ingresar una descripción.' : null,
    });

    if (!text) return;

    try {
        const resp = await fetch(`${API}?action=addItem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token,
                idProfile:   currentProfile.id,
                type:        'responsabilidades',
                descripcion: text.trim(),
            }),
        });
        const result = await resp.json();

        if (result.status !== 'ok') {
            Swal.fire('Error', 'No se pudo guardar la responsabilidad.', 'error');
            return;
        }

        renderResponsibilityRow(result.result.id, text.trim());
        Swal.fire({ icon: 'success', title: 'Responsabilidad agregada', timer: 1000, showConfirmButton: false });
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Error de conexión.', 'error');
    }
};

// ── RENDER subtablas estándar (tabla con fila) ────────────────────────────────
const escapeHtml = (str) =>
    String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

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

    // EPP tiene su propio flujo con catálogo buscable
    if (type === 'epp') { addEppFromCatalog(); return; }

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

// ── ADD EPP desde Catálogo (lista buscable) ───────────────────────────────────
window.addEppFromCatalog = async () => {
    if (!currentProfile) {
        Swal.fire('Aviso', 'Primero debe guardar el perfil de cargo.', 'warning');
        return;
    }

    let catalog = [];
    try {
        const r = await fetch(`${API_EPP}?idEmpresa=${idEmpresa}`);
        catalog  = await r.json();
        if (!Array.isArray(catalog)) catalog = [];
    } catch { catalog = []; }

    if (catalog.length === 0) {
        Swal.fire({ icon: 'info', title: 'Sin EPPs', html: 'No hay EPPs en el catálogo. Registre en <strong>Crear EPP</strong> primero.' });
        return;
    }

    const buildListHtml = (items) => items.map(e =>
        `<div class="epp-option" data-id="${e.id}" data-name="${escapeAttr(e.name)}"
              style="display:flex;align-items:center;gap:10px;padding:10px 12px;
                     border:1px solid #e9ecef;border-radius:8px;margin-bottom:6px;
                     cursor:pointer;transition:all 0.15s;background:#fff;">
            <i class="fas fa-hard-hat" style="color:#e67e22;font-size:1rem;flex-shrink:0;"></i>
            <div style="flex:1;text-align:left;">
                <strong style="font-size:13px;">${escapeHtml(e.name)}</strong>
                ${e.standard ? `<br><small style="color:#8d99ae;">${escapeHtml(e.standard)}</small>` : ''}
            </div>
            <i class="fas fa-circle-check" style="color:#e9ecef;font-size:1.1rem;"></i>
        </div>`
    ).join('');

    Swal.fire({
        title: '<i class="fas fa-hard-hat" style="color:#e67e22;"></i> Agregar EPP al Perfil',
        width: 540,
        html: `
            <input id="eppSearchInput" class="swal2-input"
                   placeholder="🔍 Buscar elemento..."
                   style="margin:0 0 10px;width:100%;box-sizing:border-box;">
            <div id="eppCatalogList"
                 style="max-height:330px;overflow-y:auto;padding:2px 0;">
                ${buildListHtml(catalog)}
            </div>`,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-plus"></i> Agregar seleccionado',
        cancelButtonText:  'Cancelar',
        confirmButtonColor: '#27ae60',
        focusConfirm: false,
        didOpen: () => {
            const onSelect = (el) => {
                document.querySelectorAll('.epp-option').forEach(o => {
                    o.style.background  = '#fff';
                    o.style.borderColor = '#e9ecef';
                    o.querySelector('.fa-circle-check').style.color = '#e9ecef';
                    delete o.dataset.selected;
                });
                el.style.background  = 'rgba(39,174,96,0.09)';
                el.style.borderColor = '#27ae60';
                el.querySelector('.fa-circle-check').style.color = '#27ae60';
                el.dataset.selected  = 'true';
            };

            document.querySelectorAll('.epp-option').forEach(el =>
                el.addEventListener('click', () => onSelect(el))
            );

            // Filtro de búsqueda en tiempo real
            document.getElementById('eppSearchInput').addEventListener('input', (e) => {
                const q = e.target.value.toLowerCase().trim();
                const filtered = catalog.filter(c => c.name.toLowerCase().includes(q));
                document.getElementById('eppCatalogList').innerHTML = buildListHtml(filtered);
                document.querySelectorAll('.epp-option').forEach(el =>
                    el.addEventListener('click', () => onSelect(el))
                );
            });
        },
        preConfirm: () => {
            const sel = document.querySelector('.epp-option[data-selected="true"]');
            if (!sel) {
                Swal.showValidationMessage('⚠️ Seleccione un elemento de la lista.');
                return false;
            }
            return { idEppCatalog: parseInt(sel.dataset.id), name: sel.dataset.name };
        },
    }).then(async (result) => {
        if (!result.isConfirmed || !result.value) return;
        const { idEppCatalog, name } = result.value;

        try {
            const resp = await fetch(`${API}?action=addItem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    idProfile:    currentProfile.id,
                    type:         'epp',
                    descripcion:  name,
                    idEppCatalog,
                }),
            });
            const data = await resp.json();
            if (data.status !== 'ok') {
                Swal.fire('Error', 'No se pudo guardar el EPP.', 'error');
                return;
            }
            addRowToTable('epp', 'tableEpp', data.result.id, name);
            Swal.fire({ icon: 'success', title: 'EPP agregado', timer: 1000, showConfirmButton: false });
        } catch {
            Swal.fire('Error', 'Error de conexión.', 'error');
        }
    });
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
