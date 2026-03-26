// ============================================================
// createEpp.js  –  Catálogo de EPP (CRUD real)
// ============================================================
import config from "../../js/config.js";

const API = `${config.BASE_API_URL}eppCatalog.php`;

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

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const init = async () => {
    if (!loadSession()) {
        document.getElementById('eppCatalogBody').innerHTML =
            `<tr><td colspan="4" style="text-align:center;padding:30px;color:#e74c3c;">
                <i class="fas fa-lock"></i> No se encontró sesión de empresa.
             </td></tr>`;
        return;
    }
    await loadCatalog();
};

// ── READ ──────────────────────────────────────────────────────────────────────
const loadCatalog = async () => {
    const tbody = document.getElementById('eppCatalogBody');
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;">
        <i class="fas fa-spinner fa-spin"></i> Cargando...
    </td></tr>`;

    try {
        const resp = await fetch(`${API}?idEmpresa=${idEmpresa}`);
        const data = await resp.json();
        renderCatalog(Array.isArray(data) ? data : []);
    } catch (err) {
        console.error('Error cargando catálogo EPP:', err);
        document.getElementById('eppCatalogBody').innerHTML =
            `<tr><td colspan="4" style="text-align:center;padding:20px;color:#e74c3c;">
                <i class="fas fa-exclamation-triangle"></i> Error al cargar el catálogo.
             </td></tr>`;
    }
};

// ── RENDER ────────────────────────────────────────────────────────────────────
const renderCatalog = (data) => {
    const tbody = document.getElementById('eppCatalogBody');
    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px;color:#95a5a6;">
            <i class="fas fa-hard-hat" style="font-size:2rem;opacity:.3;display:block;margin-bottom:8px;"></i>
            No hay EPPs registrados en el catálogo.
        </td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((item, i) => `
        <tr>
            <td style="text-align:center;">${i + 1}</td>
            <td><strong>${esc(item.name)}</strong></td>
            <td>${esc(item.standard) || '<span style="color:#ccc;">—</span>'}</td>
            <td style="text-align:center;">
                <button class="action-btn edit" title="Editar" onclick="window.editEpp(${item.id}, '${esc(item.name)}', '${esc(item.standard)}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" title="Eliminar" onclick="window.deleteEpp(${item.id}, '${esc(item.name)}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>`).join('');
};

// ── CREATE ────────────────────────────────────────────────────────────────────
window.openCreateEppModal = () => {
    Swal.fire({
        title: 'Nuevo EPP',
        html: `
            <input id="swal-epp-name"     class="swal2-input" placeholder="Nombre del Elemento (Ej: Casco)">
            <input id="swal-epp-standard" class="swal2-input" placeholder="Norma Técnica (Ej: ANSI Z89.1)">
        `,
        showCancelButton:   true,
        confirmButtonText:  'Guardar',
        cancelButtonText:   'Cancelar',
        confirmButtonColor: '#27ae60',
        focusConfirm: false,
        preConfirm: () => {
            const name     = Swal.getPopup().querySelector('#swal-epp-name').value.trim();
            const standard = Swal.getPopup().querySelector('#swal-epp-standard').value.trim();
            if (!name) {
                Swal.showValidationMessage('El nombre del EPP es obligatorio.');
                return false;
            }
            return { name, standard };
        },
    }).then(async (result) => {
        if (!result.isConfirmed) return;
        try {
            const resp = await fetch(API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, idEmpresa, ...result.value }),
            });
            const data = await resp.json();
            if (data.status !== 'ok') {
                Swal.fire('Error', data.result?.message || 'No se pudo guardar.', 'error');
                return;
            }
            Swal.fire({ icon: 'success', title: 'EPP agregado', timer: 1500, showConfirmButton: false });
            loadCatalog();
        } catch (err) {
            Swal.fire('Error', 'Error de conexión.', 'error');
        }
    });
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
window.editEpp = (id, currentName, currentStandard) => {
    Swal.fire({
        title: 'Editar EPP',
        html: `
            <input id="swal-epp-name"     class="swal2-input" value="${currentName}"     placeholder="Nombre del Elemento">
            <input id="swal-epp-standard" class="swal2-input" value="${currentStandard}" placeholder="Norma Técnica">
        `,
        showCancelButton:   true,
        confirmButtonText:  'Guardar Cambios',
        cancelButtonText:   'Cancelar',
        confirmButtonColor: '#f39c12',
        focusConfirm: false,
        preConfirm: () => {
            const name     = Swal.getPopup().querySelector('#swal-epp-name').value.trim();
            const standard = Swal.getPopup().querySelector('#swal-epp-standard').value.trim();
            if (!name) {
                Swal.showValidationMessage('El nombre del EPP es obligatorio.');
                return false;
            }
            return { name, standard };
        },
    }).then(async (result) => {
        if (!result.isConfirmed) return;
        try {
            const resp = await fetch(API, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, id, ...result.value }),
            });
            const data = await resp.json();
            if (data.status !== 'ok') {
                Swal.fire('Error', data.result?.message || 'No se pudo actualizar.', 'error');
                return;
            }
            Swal.fire({ icon: 'success', title: 'EPP actualizado', timer: 1500, showConfirmButton: false });
            loadCatalog();
        } catch (err) {
            Swal.fire('Error', 'Error de conexión.', 'error');
        }
    });
};

// ── DELETE ────────────────────────────────────────────────────────────────────
window.deleteEpp = (id, name) => {
    Swal.fire({
        title: '¿Eliminar EPP?',
        html:  `Se eliminará <strong>${name}</strong> del catálogo.<br>Esta acción no se puede deshacer.`,
        icon:  'warning',
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
            Swal.fire({ icon: 'success', title: 'EPP eliminado', timer: 1500, showConfirmButton: false });
            loadCatalog();
        } catch (err) {
            Swal.fire('Error', 'Error de conexión.', 'error');
        }
    });
};

// ── Helper ────────────────────────────────────────────────────────────────────
const esc = (str) =>
    String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                     .replace(/"/g,'&quot;').replace(/'/g,'&#039;');

// ── Init ──────────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
