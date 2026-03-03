import config from "../../js/config.js";

const API_URL = `${config.BASE_API_URL}hazards.php`;

let hazards   = [];
let idEmpresa = null;

// ── Init ───────────────────────────────────────────────────────────────────
const init = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        loadHazards();
    } else {
        Swal.fire('Error', 'No se encontró la sesión de empresa.', 'error');
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ── Load ───────────────────────────────────────────────────────────────────
function loadHazards() {
    fetch(`${API_URL}?idEmpresa=${idEmpresa}`)
        .then(r => r.json())
        .then(data => {
            hazards = Array.isArray(data) ? data : (data.result ? data.result : []);
            renderTable();
        })
        .catch(() => { hazards = []; renderTable(); });
}

// ── Render table ───────────────────────────────────────────────────────────
function renderTable() {
    const tbody = document.querySelector('#hazardsTable tbody');
    if (!tbody) return;

    if (!hazards.length) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No hay procedimientos registrados.</td></tr>`;
        return;
    }

    let html = '';
    hazards.forEach(item => {
        const hasFile = !!item.rutaArchivo;
        const previewUrl = hasFile
            ? `${config.BASE_API_URL}download.php?file=${encodeURIComponent(item.rutaArchivo)}&inline=1`
            : '';
        const downloadUrl = hasFile
            ? `${config.BASE_API_URL}download.php?file=${encodeURIComponent(item.rutaArchivo)}`
            : '';
        const fileName = hasFile ? item.rutaArchivo.split('/').pop() : '';

        html += `<tr>
            <td style="display:flex; gap:5px; flex-wrap:wrap;">
                <button class="btn-edit-premium" onclick="editHazard(${item.idHazard})" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn-delete-premium" onclick="deleteHazard(${item.idHazard})" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                ${hasFile ? `
                <button onclick="previewPdf('${previewUrl}','${item.titulo}','${fileName}')" title="Vista previa"
                    style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#9b59b6;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;transition:background .2s;"
                    onmouseover="this.style.background='#8e44ad'" onmouseout="this.style.background='#9b59b6'">
                    <i class="fas fa-eye"></i>
                </button>
                <a href="${downloadUrl}" title="Descargar"
                    style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#2ecc71;color:#fff;border-radius:6px;text-decoration:none;font-size:14px;transition:background .2s;"
                    onmouseover="this.style.background='#27ae60'" onmouseout="this.style.background='#2ecc71'">
                    <i class="fas fa-download"></i>
                </a>` : ''}
            </td>
            <td style="font-weight:600;">${item.titulo}</td>
            <td style="font-size:13px;color:#666;">${item.descripcion || '—'}</td>
            <td style="font-size:13px;">${item.fechaCreacion}</td>
            <td style="font-size:13px;">
                ${hasFile
                    ? `<a href="${previewUrl}" target="_blank" style="color:#4361ee;text-decoration:none;">📄 ${fileName}</a>`
                    : '<span style="color:#bbb;">Sin archivo</span>'}
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// ── Preview PDF ────────────────────────────────────────────────────────────
window.previewPdf = function(url, title, fileName) {
    const panel    = document.getElementById('previewPanel');
    const iframe   = document.getElementById('pdfViewer');
    const titleEl  = document.getElementById('previewTitle');
    const subEl    = document.getElementById('previewSubtitle');

    titleEl.textContent = title;
    subEl.textContent   = fileName;
    iframe.src          = url;
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.closePreview = function() {
    const panel  = document.getElementById('previewPanel');
    const iframe = document.getElementById('pdfViewer');
    panel.style.display = 'none';
    iframe.src = '';   // libera el recurso
};

// ── Add ────────────────────────────────────────────────────────────────────
window.addHazard = async function() {
    const { value: fv } = await Swal.fire({
        title: 'Nuevo Procedimiento',
        width: '560px',
        html: `
            <input id="sw-titulo" class="swal2-input" placeholder="Título del procedimiento" style="margin-bottom:8px;">
            <textarea id="sw-desc" class="swal2-textarea" placeholder="Descripción (opcional)" style="height:80px;margin-bottom:8px;"></textarea>
            <input type="date" id="sw-fecha" class="swal2-input" value="${new Date().toISOString().split('T')[0]}" style="margin-bottom:8px;">
            <div style="border:2px dashed #ccc;border-radius:8px;padding:16px;text-align:center;cursor:pointer;" onclick="document.getElementById('sw-file').click()">
                <i class="fas fa-cloud-upload-alt" style="font-size:28px;color:#4361ee;"></i>
                <div style="margin-top:8px;font-size:13px;color:#666;">Haz clic para seleccionar un PDF</div>
                <div id="sw-fname" style="margin-top:6px;font-size:12px;color:#4361ee;font-weight:600;"></div>
            </div>
            <input type="file" id="sw-file" accept=".pdf" style="display:none;"
                onchange="document.getElementById('sw-fname').textContent = this.files[0]?.name || ''">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-save"></i> Guardar',
        preConfirm: () => {
            const titulo = document.getElementById('sw-titulo').value.trim();
            if (!titulo) { Swal.showValidationMessage('El título es obligatorio'); return false; }
            return {
                titulo,
                descripcion: document.getElementById('sw-desc').value.trim(),
                fecha: document.getElementById('sw-fecha').value,
                file: document.getElementById('sw-file').files[0] || null
            };
        }
    });

    if (!fv) return;

    const fd = new FormData();
    fd.append('token', sessionStorage.getItem('token'));
    fd.append('idEmpresa', idEmpresa);
    fd.append('titulo', fv.titulo);
    fd.append('descripcion', fv.descripcion);
    fd.append('fechaCreacion', fv.fecha);
    if (fv.file) fd.append('archivo', fv.file);

    fetch(API_URL, { method: 'POST', body: fd })
        .then(r => r.json())
        .then(resp => {
            if (resp.status === 'ok' || resp.result?.idHazard) {
                Swal.fire({ icon: 'success', title: 'Guardado', timer: 1500, showConfirmButton: false });
                loadHazards();
                // Si tiene archivo, abrir preview automáticamente
                if (fv.file && resp.result?.rutaArchivo) {
                    const url = `${config.BASE_API_URL}download.php?file=${encodeURIComponent(resp.result.rutaArchivo)}&inline=1`;
                    setTimeout(() => previewPdf(url, fv.titulo, fv.file.name), 1600);
                }
            } else {
                Swal.fire('Error', resp.result?.error_message || 'No se pudo guardar', 'error');
            }
        })
        .catch(() => Swal.fire('Error', 'Error de conexión', 'error'));
};

// ── Edit ───────────────────────────────────────────────────────────────────
window.editHazard = async function(id) {
    const item = hazards.find(h => h.idHazard == id);
    if (!item) return;

    const currentFile = item.rutaArchivo ? item.rutaArchivo.split('/').pop() : 'Sin archivo';

    const { value: fv } = await Swal.fire({
        title: 'Editar Procedimiento',
        width: '560px',
        html: `
            <input id="sw-titulo" class="swal2-input" value="${item.titulo}" placeholder="Título">
            <textarea id="sw-desc" class="swal2-textarea" style="height:80px;">${item.descripcion || ''}</textarea>
            <input type="date" id="sw-fecha" class="swal2-input" value="${item.fechaCreacion}">
            <div style="border:2px dashed #ccc;border-radius:8px;padding:14px;text-align:center;cursor:pointer;margin-top:8px;" onclick="document.getElementById('sw-file').click()">
                <i class="fas fa-sync-alt" style="font-size:22px;color:#9b59b6;"></i>
                <div style="margin-top:6px;font-size:13px;color:#666;">Reemplazar archivo PDF</div>
                <div style="font-size:12px;color:#888;margin-top:4px;">Actual: ${currentFile}</div>
                <div id="sw-fname" style="margin-top:4px;font-size:12px;color:#4361ee;font-weight:600;"></div>
            </div>
            <input type="file" id="sw-file" accept=".pdf" style="display:none;"
                onchange="document.getElementById('sw-fname').textContent = 'Nuevo: ' + (this.files[0]?.name || '')">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-sync-alt"></i> Actualizar',
        preConfirm: () => {
            const titulo = document.getElementById('sw-titulo').value.trim();
            if (!titulo) { Swal.showValidationMessage('El título es obligatorio'); return false; }
            return {
                titulo,
                descripcion: document.getElementById('sw-desc').value.trim(),
                fecha: document.getElementById('sw-fecha').value,
                file: document.getElementById('sw-file').files[0] || null
            };
        }
    });

    if (!fv) return;

    const fd = new FormData();
    fd.append('token', sessionStorage.getItem('token'));
    fd.append('idHazard', id);
    fd.append('idEmpresa', idEmpresa);
    fd.append('titulo', fv.titulo);
    fd.append('descripcion', fv.descripcion);
    fd.append('fechaCreacion', fv.fecha);
    if (fv.file) fd.append('archivo', fv.file);

    fetch(`${API_URL}?_method=PUT`, { method: 'POST', body: fd })
        .then(r => r.json())
        .then(resp => {
            if (resp.status === 'ok' || resp.result?.idHazard) {
                Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1500, showConfirmButton: false });
                loadHazards();
            } else {
                Swal.fire('Error', resp.result?.error_message || 'No se pudo actualizar', 'error');
            }
        })
        .catch(() => Swal.fire('Error', 'Error de conexión', 'error'));
};

// ── Delete ─────────────────────────────────────────────────────────────────
window.deleteHazard = function(id) {
    Swal.fire({
        title: '¿Eliminar procedimiento?',
        text: 'Esta acción también eliminará el archivo PDF del servidor.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: '<i class="fas fa-trash"></i> Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(r => {
        if (!r.isConfirmed) return;
        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: sessionStorage.getItem('token'), idHazard: id, idEmpresa })
        })
        .then(r => r.json())
        .then(resp => {
            if (resp.status === 'ok' || resp.result?.idHazard) {
                Swal.fire({ icon: 'success', title: '¡Eliminado!', timer: 1500, showConfirmButton: false });
                closePreview();
                loadHazards();
            } else {
                Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        });
    });
};
