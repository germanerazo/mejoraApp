import config from "../../js/config.js";

const API_URL = `${config.BASE_API_URL}processSheet.php`;

let idEmpresa = null;
let allData    = [];

const init = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        loadPersonnelConsolidado();
    } else {
        Swal.fire('Error', 'No se encontró la sesión de empresa.', 'error');
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function loadPersonnelConsolidado() {
    const tbody = document.querySelector('#personnelConsolidadoTable tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Cargando datos...</td></tr>`;

    fetch(`${API_URL}?idEmpresa=${idEmpresa}&action=getPersonnelConsolidado`)
        .then(res => res.json())
        .then(data => {
            allData = Array.isArray(data) ? data : [];
            renderTable(allData);
            setupSearch();
        })
        .catch(err => {
            console.error('Error cargando consolidado:', err);
            renderTable([]);
        });
}

// ──────────────────────────────────────────────
//  Helpers para formatear Responsabilidades
// ──────────────────────────────────────────────
function formatRespList(arr) {
    if (!arr || arr.length === 0) return '<span style="color:#bbb;font-size:12px;">Sin registros</span>';
    return arr.map((item, i) => {
        const text = typeof item === 'string' ? item : (item.text || '');
        return `<div style="display:flex;align-items:flex-start;gap:6px;padding:4px 0;${i < arr.length - 1 ? 'border-bottom:1px solid #f0f0f0;' : ''}">
            <span style="flex-shrink:0;width:18px;height:18px;background:#e8f5e9;color:#27ae60;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;">${i + 1}</span>
            <span style="font-size:12px;line-height:1.4;">${text}</span>
        </div>`;
    }).join('');
}

// ──────────────────────────────────────────────
//  Helpers para formatear Rendición de Cuentas
// ──────────────────────────────────────────────
function formatAccList(arr) {
    if (!arr || arr.length === 0) return '<span style="color:#bbb;font-size:12px;">Sin registros</span>';
    return arr.map((item, i) => {
        const text = typeof item === 'string' ? item : (item.text || '');
        const freq = typeof item === 'string' ? '' : (item.frequency || '');
        const freqColor = { 'Diario':'#e74c3c','Semanal':'#e67e22','Quincenal':'#f39c12','Mensual':'#4361ee','Trimestral':'#9b59b6','Semestral':'#2ecc71','Anual':'#1abc9c' };
        const bg = freq ? (freqColor[freq] || '#4361ee') : '';
        return `<div style="display:flex;align-items:flex-start;gap:6px;padding:4px 0;${i < arr.length - 1 ? 'border-bottom:1px solid #f0f0f0;' : ''}">
            <span style="flex-shrink:0;width:18px;height:18px;background:#fef3e2;color:#e67e22;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;">${i + 1}</span>
            <div>
                <span style="font-size:12px;line-height:1.4;">${text}</span>
                ${freq ? `<br><span style="display:inline-block;background:${bg};color:#fff;border-radius:3px;padding:1px 7px;font-size:10px;margin-top:2px;font-weight:500;">${freq}</span>` : ''}
            </div>
        </div>`;
    }).join('');
}

// ──────────────────────────────────────────────
//  Render principal de la tabla
// ──────────────────────────────────────────────
function renderTable(data) {
    const tbody = document.querySelector('#personnelConsolidadoTable tbody');
    const stats = document.getElementById('personnelStats');
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No hay personal registrado en ninguna ficha de proceso.</td></tr>`;
        if (stats) stats.style.display = 'none';
        return;
    }

    let html    = '';
    let prevCode = null;

    data.forEach(item => {
        // Normalize arrays (backend already decodes JSON, but safety check)
        const responsibilities = Array.isArray(item.responsibilities)
            ? item.responsibilities
            : (typeof item.responsibilities === 'string' ? JSON.parse(item.responsibilities || '[]') : []);
        const accountabilities = Array.isArray(item.accountabilities)
            ? item.accountabilities
            : (typeof item.accountabilities === 'string' ? JSON.parse(item.accountabilities || '[]') : []);

        // Separator row when the process code changes
        const currentCode = item.code;
        if (currentCode !== prevCode) {
            const processTitle = item.processName || currentCode || '—';
            html += `<tr style="background: linear-gradient(135deg,#f0f4ff,#e8edff);">
                <td colspan="6" style="padding:8px 14px;font-weight:600;font-size:13px;color:#4361ee;letter-spacing:.5px;">
                    <i class="fas fa-sitemap" style="margin-right:6px;"></i>
                    ${processTitle}
                    <span style="font-weight:400;color:#888;font-size:12px;margin-left:8px;">(${currentCode})</span>
                </td>
            </tr>`;
            prevCode = currentCode;
        }

        html += `<tr>
            <td style="font-size:12px;color:#666;">${currentCode}</td>
            <td style="font-weight:600;font-size:13px;">${item.role || '—'}</td>
            <td style="font-size:13px;">${item.reportsTo || '—'}</td>
            <td style="text-align:center;font-size:13px;font-weight:600;">${item.quantity || '—'}</td>
            <td style="vertical-align:top;">${formatRespList(responsibilities)}</td>
            <td style="vertical-align:top;">${formatAccList(accountabilities)}</td>
        </tr>`;
    });

    tbody.innerHTML = html;

    if (stats) {
        const uniqueProcesses = new Set(data.map(d => d.code)).size;
        stats.textContent = `${data.length} registro(s) de personal en ${uniqueProcesses} proceso(s)`;
        stats.style.display = 'block';
    }
}

// ──────────────────────────────────────────────
//  Búsqueda en tiempo real
// ──────────────────────────────────────────────
function setupSearch() {
    const input = document.getElementById('searchPersonnel');
    if (!input) return;
    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { renderTable(allData); return; }
        const filtered = allData.filter(item =>
            (item.role || '').toLowerCase().includes(q) ||
            (item.reportsTo || '').toLowerCase().includes(q) ||
            (item.processName || '').toLowerCase().includes(q) ||
            (item.code || '').toLowerCase().includes(q)
        );
        renderTable(filtered);
    });
}
