import config from "../../js/config.js";

const API_URL = `${config.BASE_API_URL}dangerCatalog.php`;

// State
let allDangers = [];
let allTypes = [];
let filteredDangers = [];

// ── Initialization ──────────────────────────────────────────────────────────
function init() {
    loadData();
}

async function loadData() {
    try {
        const [dangersRes, typesRes] = await Promise.all([
            fetch(`${API_URL}?action=list`),
            fetch(`${API_URL}?action=listTypes`)
        ]);
        allDangers = await dangersRes.json();
        allTypes = await typesRes.json();

        if (!Array.isArray(allDangers)) allDangers = [];
        if (!Array.isArray(allTypes)) allTypes = [];

        filteredDangers = [...allDangers];
        populateTypeFilter();
        updateStats();
        renderTable();
    } catch (err) {
        console.error('Error loading catalog data:', err);
        const tbody = document.querySelector('#catalogTable tbody');
        if (tbody) tbody.innerHTML = `<tr><td colspan="4" class="empty-state" style="color: var(--colorRed2);">Error al cargar el catálogo.</td></tr>`;
    }
}

// ── Stats ────────────────────────────────────────────────────────────────────
function updateStats() {
    document.getElementById('statTypes').textContent = allTypes.length;
    document.getElementById('statDangers').textContent = allDangers.length;
    document.getElementById('statDescribed').textContent = allDangers.filter(d => d.description && d.description.trim() !== '').length;
}

// ── Type Filter ──────────────────────────────────────────────────────────────
function populateTypeFilter() {
    const select = document.getElementById('catalogFilterType');
    if (!select) return;
    
    // Keep first option, remove the rest
    while (select.options.length > 1) select.remove(1);
    
    allTypes.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.name;
        select.appendChild(opt);
    });
}

// ── Filters ──────────────────────────────────────────────────────────────────
window.applyCatalogFilters = function() {
    const nameFilter = document.getElementById('catalogFilterName').value.toLowerCase().trim();
    const typeFilter = document.getElementById('catalogFilterType').value;

    filteredDangers = allDangers.filter(d => {
        const matchesName = nameFilter === '' || 
            d.name.toLowerCase().includes(nameFilter) || 
            (d.description && d.description.toLowerCase().includes(nameFilter));
        const matchesType = typeFilter === '' || d.danger_type_id == typeFilter;
        return matchesName && matchesType;
    });

    renderTable();
};

window.clearCatalogFilters = function() {
    document.getElementById('catalogFilterName').value = '';
    document.getElementById('catalogFilterType').value = '';
    filteredDangers = [...allDangers];
    renderTable();
};

// ── Build type badge color index ─────────────────────────────────────────────
function getTypeBadgeClass(typeId) {
    const idx = allTypes.findIndex(t => t.id == typeId);
    return `type-badge-${idx >= 0 ? idx % 12 : 0}`;
}

// ── Render Table ─────────────────────────────────────────────────────────────
function renderTable() {
    const tbody = document.querySelector('#catalogTable tbody');
    const badge = document.getElementById('catalogCountBadge');
    
    badge.textContent = `${filteredDangers.length} peligro${filteredDangers.length !== 1 ? 's' : ''}`;

    if (filteredDangers.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="4" class="empty-state">
                <i class="fas fa-search" style="font-size: 28px; color: #cbd5e1; margin-bottom: 10px; display: block;"></i>
                No se encontraron peligros con los filtros aplicados.
            </td></tr>`;
        return;
    }

    let html = '';
    filteredDangers.forEach(d => {
        const badgeClass = getTypeBadgeClass(d.danger_type_id);
        const descHtml = d.description && d.description.trim() !== ''
            ? `<div class="desc-text" title="${escapeHtml(d.description)}">${escapeHtml(d.description)}</div>`
            : `<div class="desc-empty">Sin descripción</div>`;

        html += `
            <tr>
                <td><span class="type-badge ${badgeClass}"><i class="fas fa-tag"></i> ${escapeHtml(d.type_name)}</span></td>
                <td class="danger-name-cell">${escapeHtml(d.name)}</td>
                <td class="danger-desc-cell">${descHtml}</td>
                <td>
                    <div class="catalog-actions">
                        <button class="btn-catalog-edit" onclick="openEditDangerModal(${d.id})" title="Editar Peligro">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="btn-catalog-delete" onclick="deleteDanger(${d.id})" title="Eliminar Peligro">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ── MODALS: Tipo de Peligro ──────────────────────────────────────────────────

window.openCreateTypeModal = async function() {
    const { value: formValues } = await Swal.fire({
        title: '<i class="fas fa-folder-plus" style="color: #4361ee; margin-right: 8px;"></i> Nuevo Tipo de Peligro',
        html: `
            <div style="text-align: left; margin-top: 10px;">
                <label style="display:block; font-weight:600; margin-bottom:6px; font-size:14px; color:#4a5568;">
                    Nombre del Tipo de Peligro
                </label>
                <input id="swTypeNameInput" class="swal2-input" autocomplete="off"
                    style="width:100%; margin:0; font-size:14px; max-width:100%; box-sizing:border-box;"
                    placeholder="Ej: Biológico, Físico, Químico...">
            </div>
        `,
        width: '500px',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-save"></i> Guardar',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'btn-new-record',
            cancelButton: 'btn-secondary-premium'
        },
        buttonsStyling: false,
        focusConfirm: false,
        preConfirm: () => {
            const name = document.getElementById('swTypeNameInput').value.trim();
            if (!name) {
                Swal.showValidationMessage('⚠️ El nombre del tipo de peligro es obligatorio.');
                return false;
            }
            return { name };
        }
    });

    if (!formValues) return;
    await apiPost('createType', formValues, 'Tipo de peligro creado correctamente.');
};

window.openEditTypeModal = async function(id) {
    const type = allTypes.find(t => t.id == id);
    if (!type) return;

    const { value: formValues } = await Swal.fire({
        title: '<i class="fas fa-edit" style="color: #4361ee; margin-right: 8px;"></i> Editar Tipo de Peligro',
        html: `
            <div style="text-align: left; margin-top: 10px;">
                <label style="display:block; font-weight:600; margin-bottom:6px; font-size:14px; color:#4a5568;">
                    Nombre del Tipo de Peligro
                </label>
                <input id="swTypeNameInput" class="swal2-input" autocomplete="off"
                    style="width:100%; margin:0; font-size:14px; max-width:100%; box-sizing:border-box;"
                    value="${escapeHtml(type.name)}">
            </div>
        `,
        width: '500px',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-save"></i> Actualizar',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'btn-new-record',
            cancelButton: 'btn-secondary-premium'
        },
        buttonsStyling: false,
        focusConfirm: false,
        preConfirm: () => {
            const name = document.getElementById('swTypeNameInput').value.trim();
            if (!name) {
                Swal.showValidationMessage('⚠️ El nombre del tipo de peligro es obligatorio.');
                return false;
            }
            return { id, name };
        }
    });

    if (!formValues) return;
    await apiPost('updateType', formValues, 'Tipo de peligro actualizado correctamente.');
};

window.deleteType = function(id) {
    const type = allTypes.find(t => t.id == id);
    Swal.fire({
        title: '¿Eliminar tipo de peligro?',
        html: `¿Está seguro de eliminar el tipo <strong>"${escapeHtml(type ? type.name : '')}"</strong>?<br><small style="color:#888;">Solo se puede eliminar si no tiene peligros asociados.</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: '<i class="fas fa-trash"></i> Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (!result.isConfirmed) return;
        await apiDelete('deleteType', { id }, 'Tipo de peligro eliminado.');
    });
};

// ── MODALS: Peligro ──────────────────────────────────────────────────────────

window.openCreateDangerModal = async function() {
    let typeOptions = '';
    allTypes.forEach(t => {
        typeOptions += `<option value="${t.id}">${escapeHtml(t.name)}</option>`;
    });

    const { value: formValues } = await Swal.fire({
        title: '<i class="fas fa-plus-circle" style="color: #e67e22; margin-right: 8px;"></i> Nuevo Peligro',
        html: `
            <div style="text-align: left; margin-top: 10px;">
                <label style="display:block; font-weight:600; margin-bottom:6px; font-size:14px; color:#4a5568;">
                    <i class="fas fa-layer-group" style="color:#4361ee; margin-right:4px;"></i> Tipo de Peligro
                </label>
                <select id="swDangerType" class="swal2-select" style="width:100%; margin:0 0 18px 0; font-size:14px; padding:8px 10px; max-width:100%; box-sizing:border-box;">
                    <option value="">-- Seleccione un tipo --</option>
                    ${typeOptions}
                </select>

                <label style="display:block; font-weight:600; margin-bottom:6px; font-size:14px; color:#4a5568;">
                    <i class="fas fa-exclamation-triangle" style="color:#e67e22; margin-right:4px;"></i> Nombre del Peligro
                </label>
                <input id="swDangerName" class="swal2-input" autocomplete="off"
                    style="width:100%; margin:0 0 18px 0; font-size:14px; max-width:100%; box-sizing:border-box;"
                    placeholder="Ej: Ruido por encima de niveles permisibles...">

                <label style="display:block; font-weight:600; margin-bottom:6px; font-size:14px; color:#4a5568;">
                    <i class="fas fa-align-left" style="color:#27ae60; margin-right:4px;"></i> Descripción
                    <span style="font-weight:400; color:#aaa; font-size:12px;">(Opcional)</span>
                </label>
                <textarea id="swDangerDesc" class="swal2-textarea"
                    style="width:100%; margin:0; font-size:14px; max-width:100%; box-sizing:border-box; height:100px; resize:vertical;"
                    placeholder="Describa en qué consiste este peligro, sus fuentes generadoras, efectos posibles..."></textarea>
            </div>
        `,
        width: '600px',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-save"></i> Guardar Peligro',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'btn-new-record',
            cancelButton: 'btn-secondary-premium'
        },
        buttonsStyling: false,
        focusConfirm: false,
        preConfirm: () => {
            const danger_type_id = document.getElementById('swDangerType').value;
            const name = document.getElementById('swDangerName').value.trim();
            const description = document.getElementById('swDangerDesc').value.trim();

            if (!danger_type_id) {
                Swal.showValidationMessage('⚠️ Debe seleccionar un tipo de peligro.');
                return false;
            }
            if (!name) {
                Swal.showValidationMessage('⚠️ El nombre del peligro es obligatorio.');
                return false;
            }
            return { danger_type_id, name, description };
        }
    });

    if (!formValues) return;
    await apiPost('createDanger', formValues, 'Peligro creado correctamente.');
};

window.openEditDangerModal = async function(id) {
    const danger = allDangers.find(d => d.id == id);
    if (!danger) return;

    let typeOptions = '';
    allTypes.forEach(t => {
        const selected = t.id == danger.danger_type_id ? 'selected' : '';
        typeOptions += `<option value="${t.id}" ${selected}>${escapeHtml(t.name)}</option>`;
    });

    const { value: formValues } = await Swal.fire({
        title: '<i class="fas fa-edit" style="color: #e67e22; margin-right: 8px;"></i> Editar Peligro',
        html: `
            <div style="text-align: left; margin-top: 10px;">
                <label style="display:block; font-weight:600; margin-bottom:6px; font-size:14px; color:#4a5568;">
                    <i class="fas fa-layer-group" style="color:#4361ee; margin-right:4px;"></i> Tipo de Peligro
                </label>
                <select id="swDangerType" class="swal2-select" style="width:100%; margin:0 0 18px 0; font-size:14px; padding:8px 10px; max-width:100%; box-sizing:border-box;">
                    <option value="">-- Seleccione un tipo --</option>
                    ${typeOptions}
                </select>

                <label style="display:block; font-weight:600; margin-bottom:6px; font-size:14px; color:#4a5568;">
                    <i class="fas fa-exclamation-triangle" style="color:#e67e22; margin-right:4px;"></i> Nombre del Peligro
                </label>
                <input id="swDangerName" class="swal2-input" autocomplete="off"
                    style="width:100%; margin:0 0 18px 0; font-size:14px; max-width:100%; box-sizing:border-box;"
                    value="${escapeHtml(danger.name)}">

                <label style="display:block; font-weight:600; margin-bottom:6px; font-size:14px; color:#4a5568;">
                    <i class="fas fa-align-left" style="color:#27ae60; margin-right:4px;"></i> Descripción
                    <span style="font-weight:400; color:#aaa; font-size:12px;">(Opcional)</span>
                </label>
                <textarea id="swDangerDesc" class="swal2-textarea"
                    style="width:100%; margin:0; font-size:14px; max-width:100%; box-sizing:border-box; height:100px; resize:vertical;"
                    >${escapeHtml(danger.description || '')}</textarea>
            </div>
        `,
        width: '600px',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-save"></i> Actualizar Peligro',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'btn-new-record',
            cancelButton: 'btn-secondary-premium'
        },
        buttonsStyling: false,
        focusConfirm: false,
        preConfirm: () => {
            const danger_type_id = document.getElementById('swDangerType').value;
            const name = document.getElementById('swDangerName').value.trim();
            const description = document.getElementById('swDangerDesc').value.trim();

            if (!danger_type_id) {
                Swal.showValidationMessage('⚠️ Debe seleccionar un tipo de peligro.');
                return false;
            }
            if (!name) {
                Swal.showValidationMessage('⚠️ El nombre del peligro es obligatorio.');
                return false;
            }
            return { id, danger_type_id, name, description };
        }
    });

    if (!formValues) return;
    await apiPost('updateDanger', formValues, 'Peligro actualizado correctamente.');
};

window.deleteDanger = function(id) {
    const danger = allDangers.find(d => d.id == id);
    Swal.fire({
        title: '¿Eliminar peligro?',
        html: `¿Está seguro de eliminar <strong>"${escapeHtml(danger ? danger.name : '')}"</strong>?<br><small style="color:#888;">Solo se puede eliminar si no está asignado a ninguna actividad.</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: '<i class="fas fa-trash"></i> Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (!result.isConfirmed) return;
        await apiDelete('deleteDanger', { id }, 'Peligro eliminado correctamente.');
    });
};

// ── API Helpers ──────────────────────────────────────────────────────────────

async function apiPost(action, payload, successMsg) {
    payload.token = sessionStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && !data?.result?.error_id) {
            Swal.fire({ icon: 'success', title: '¡Éxito!', text: successMsg, timer: 1800, showConfirmButton: false });
            await loadData();
        } else {
            Swal.fire('Error', data?.result?.error_message || 'Hubo un error al guardar.', 'error');
        }
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Error de conexión con el servidor.', 'error');
    }
}

async function apiDelete(action, payload, successMsg) {
    payload.token = sessionStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}?action=${action}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && !data?.result?.error_id) {
            Swal.fire({ icon: 'success', title: '¡Eliminado!', text: successMsg, timer: 1800, showConfirmButton: false });
            await loadData();
        } else {
            Swal.fire('Error', data?.result?.error_message || 'Hubo un error al eliminar.', 'error');
        }
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Error de conexión con el servidor.', 'error');
    }
}

// ── Start ────────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
