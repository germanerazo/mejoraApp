import config from "../../js/config.js";

const API_URL = `${config.BASE_API_URL}legalProcedure.php`;

let procedures = [];
let idEmpresa = null;

// ── Init ───────────────────────────────────────────────────────────────────
const init = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        loadProcedures();
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
function loadProcedures() {
    fetch(`${API_URL}?idEmpresa=${idEmpresa}`)
        .then(r => r.json())
        .then(data => {
            if (Array.isArray(data)) {
                procedures = data;
            } else if (data && data.result && Array.isArray(data.result)) {
                procedures = data.result;
            } else {
                procedures = [];
            }
            renderTable();
        })
        .catch(err => { 
            console.error('Error cargando procedimientos:', err);
            procedures = []; 
            renderTable(); 
        });
}

// ── Render table ───────────────────────────────────────────────────────────
function renderTable() {
    const tbody = document.querySelector('#legalTable tbody');
    const btnNew = document.getElementById('btnCreateLegal');
    if (!tbody) return;

    if (!procedures.length) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No hay procedimientos registrados.</td></tr>`;
        if (btnNew) btnNew.style.display = 'block';
        closePreview();
        return;
    }

    // Single mode: only show the first one
    if (btnNew) {
        btnNew.setAttribute('style', 'display: none !important');
    }
    const item = procedures[0];
    
    const safeTitle = (item.titulo || '').replace(/'/g, "\\'").replace(/"/g, "&quot;");
    
    let html = '';
    const hasFile = !!item.rutaArchivo;
    const previewUrl = hasFile
        ? `${config.BASE_API_URL}download.php?file=${encodeURIComponent(item.rutaArchivo)}&inline=1`
        : '';
    const downloadUrl = hasFile
        ? `${config.BASE_API_URL}download.php?file=${encodeURIComponent(item.rutaArchivo)}`
        : '';
    const fileName = hasFile ? item.rutaArchivo.split('/').pop() : '';

    html += `<tr>
        <td style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
            <button class="btn-premium btn-replace-premium" onclick="editLegal(${item.idLegal})" title="Reemplazar documento">
                <i class="fas fa-sync-alt"></i> Reemplazar
            </button>
            <button class="btn-premium btn-icon-premium btn-delete-premium-red" onclick="deleteLegal(${item.idLegal})" title="Eliminar">
                <i class="fas fa-trash-alt"></i>
            </button>
            ${hasFile ? `
            <button onclick="previewPdf('${previewUrl}','${safeTitle}','${fileName}')" class="btn-premium btn-icon-premium btn-preview-pdf" title="Vista previa">
                <i class="fas fa-eye"></i>
            </button>
            <a href="${downloadUrl}" class="btn-premium btn-icon-premium btn-download-pdf" title="Descargar">
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

    tbody.innerHTML = html;

    if (hasFile) {
        previewPdf(previewUrl, item.titulo || 'Procedimiento', fileName);
    } else {
        closePreview();
    }
}

// ── Preview PDF ────────────────────────────────────────────────────────────
window.previewPdf = function(url, title, fileName) {
    const panel    = document.getElementById('previewPanel');
    const iframe   = document.getElementById('pdfViewer');
    const titleEl  = document.getElementById('previewTitle');
    const subEl    = document.getElementById('previewSubtitle');
    const noPdf    = document.getElementById('noPdfMessage');

    if (!panel || !iframe) return;

    if (noPdf) noPdf.style.display = 'none';
    iframe.style.display = 'block';

    titleEl.textContent = title;
    subEl.textContent   = fileName;
    iframe.src          = url;
    panel.style.display = 'block';
};

window.closePreview = function() {
    const iframe = document.getElementById('pdfViewer');
    const noPdf  = document.getElementById('noPdfMessage');
    const titleEl  = document.getElementById('previewTitle');
    const subEl    = document.getElementById('previewSubtitle');

    if (iframe) {
        iframe.src = '';   
        iframe.style.display = 'none';
    }
    if (noPdf) noPdf.style.display = 'block';
    if (titleEl) titleEl.textContent = 'Sin documento';
    if (subEl) subEl.textContent = 'Por favor cargue un procedimiento';
};

// ── Drag and Drop Helper ───────────────────────────────────────────────────
const setupDragAndDrop = () => {
    const dropZone = document.getElementById('sw-drop-zone');
    const fileInput = document.getElementById('sw-file');
    const fileNameDisplay = document.getElementById('sw-fname');

    if (!dropZone || !fileInput) return;

    ['dragover', 'dragenter'].forEach(eName => {
        dropZone.addEventListener(eName, (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    });

    ['dragleave', 'dragend', 'drop'].forEach(eName => {
        dropZone.addEventListener(eName, (e) => { e.preventDefault(); dropZone.classList.remove('drag-over'); });
    });

    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length) {
            if (files[0].type !== 'application/pdf') {
                Swal.showValidationMessage('Solo se permiten archivos PDF');
                return;
            }
            fileInput.files = files; 
            if (fileNameDisplay) fileNameDisplay.textContent = 'Archivo: ' + files[0].name;
            Swal.resetValidationMessage();
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length && fileNameDisplay) {
            fileNameDisplay.textContent = 'Archivo: ' + fileInput.files[0].name;
        }
    });
};

// ── Add ────────────────────────────────────────────────────────────────────
window.addLegal = async function() {
    const { value: fv } = await Swal.fire({
        title: 'Nuevo Procedimiento Legal',
        width: '560px',
        html: `
            <div style="text-align:left; margin-bottom:15px;">
                <label class="input-label">Título</label>
                <input id="sw-titulo" class="swal2-input" placeholder="Ej: Manual de Requisitos Legales">
            </div>
            <div style="text-align:left; margin-bottom:15px;">
                <label class="input-label">Descripción</label>
                <textarea id="sw-desc" class="swal2-textarea" placeholder="Breve descripción..." style="height:80px;"></textarea>
            </div>
            <div style="text-align:left; margin-bottom:15px;">
                <label class="input-label">Fecha</label>
                <input type="date" id="sw-fecha" class="swal2-input" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div id="sw-drop-zone" class="drop-zone" onclick="document.getElementById('sw-file').click()">
                <i class="fas fa-cloud-upload-alt"></i>
                <div style="font-size:14px; color:#475569; font-weight:600;">Haz clic o arrastra un PDF aquí</div>
                <div id="sw-fname"></div>
            </div>
            <input type="file" id="sw-file" accept=".pdf" style="display:none;">
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-save"></i> Guardar',
        didOpen: setupDragAndDrop,
        preConfirm: () => {
            const titulo = document.getElementById('sw-titulo').value.trim();
            const file = document.getElementById('sw-file').files[0];
            if (!titulo) { Swal.showValidationMessage('El título es obligatorio'); return false; }
            if (!file) { Swal.showValidationMessage('Debes seleccionar un archivo PDF'); return false; }
            return {
                titulo,
                descripcion: document.getElementById('sw-desc').value.trim(),
                fecha: document.getElementById('sw-fecha').value,
                file: file
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
            if (resp.status === 'ok' || resp.result?.idLegal) {
                Swal.fire({ icon: 'success', title: 'Guardado', timer: 1500, showConfirmButton: false });
                loadProcedures();
            } else {
                Swal.fire('Error', resp.result?.error_message || 'No se pudo guardar', 'error');
            }
        })
        .catch(() => Swal.fire('Error', 'Error de conexión', 'error'));
};

// ── Edit ───────────────────────────────────────────────────────────────────
window.editLegal = async function(id) {
    const item = procedures.find(p => p.idLegal == id);
    if (!item) return;

    const currentFile = item.rutaArchivo ? item.rutaArchivo.split('/').pop() : 'Sin archivo';

    const { value: fv } = await Swal.fire({
        title: 'Reemplazar Procedimiento Legal',
        width: '560px',
        html: `
            <div style="text-align:left; margin-bottom:15px;">
                <label class="input-label">Título</label>
                <input id="sw-titulo" class="swal2-input" value="${item.titulo}">
            </div>
            <div style="text-align:left; margin-bottom:15px;">
                <label class="input-label">Descripción</label>
                <textarea id="sw-desc" class="swal2-textarea" style="height:80px;">${item.descripcion || ''}</textarea>
            </div>
            <div style="text-align:left; margin-bottom:15px;">
                <label class="input-label">Fecha</label>
                <input type="date" id="sw-fecha" class="swal2-input" value="${item.fechaCreacion}">
            </div>
            <div id="sw-drop-zone" class="drop-zone" onclick="document.getElementById('sw-file').click()">
                <i class="fas fa-sync-alt"></i>
                <div style="font-size:14px; color:#475569; font-weight:600;">Arrastra un nuevo PDF para reemplazar</div>
                <div style="font-size:12px; color:#94a3b8; margin-top:4px;">Actual: ${currentFile}</div>
                <div id="sw-fname"></div>
            </div>
            <input type="file" id="sw-file" accept=".pdf" style="display:none;">
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-sync-alt"></i> Actualizar',
        didOpen: setupDragAndDrop,
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
    fd.append('idLegal', id);
    fd.append('idEmpresa', idEmpresa);
    fd.append('titulo', fv.titulo);
    fd.append('descripcion', fv.descripcion);
    fd.append('fechaCreacion', fv.fecha);
    if (fv.file) fd.append('archivo', fv.file);

    fetch(`${API_URL}?_method=PUT`, { method: 'POST', body: fd })
        .then(r => r.json())
        .then(resp => {
            if (resp.status === 'ok' || resp.result?.idLegal) {
                Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1500, showConfirmButton: false });
                loadProcedures();
            } else {
                Swal.fire('Error', resp.result?.error_message || 'No se pudo actualizar', 'error');
            }
        })
        .catch(() => Swal.fire('Error', 'Error de conexión', 'error'));
};

// ── Delete ─────────────────────────────────────────────────────────────────
window.deleteLegal = function(id) {
    Swal.fire({
        title: '¿Eliminar procedimiento legal?',
        text: 'Esta acción también eliminará el archivo del servidor.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(r => {
        if (!r.isConfirmed) return;
        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: sessionStorage.getItem('token'), idLegal: id, idEmpresa })
        })
        .then(r => r.json())
        .then(resp => {
            if (resp.status === 'ok' || resp.result?.idLegal) {
                Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
                loadProcedures();
            } else {
                Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        });
    });
};
