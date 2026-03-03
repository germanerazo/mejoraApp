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
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No hay personal registrado en ninguna ficha de proceso.</td></tr>`;
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
                <td colspan="7" style="padding:8px 14px;font-weight:600;font-size:13px;color:#4361ee;letter-spacing:.5px;">
                    <i class="fas fa-sitemap" style="margin-right:6px;"></i>
                    ${processTitle}
                    <span style="font-weight:400;color:#888;font-size:12px;margin-left:8px;">(${currentCode})</span>
                </td>
            </tr>`;
            prevCode = currentCode;
        }

        const idx = allData.indexOf(item);

        html += `<tr>
            <td style="width:48px;text-align:center;">
                <button onclick="printPersonnel(${idx})" title="Imprimir" style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#4361ee;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;transition:background .2s;" onmouseover="this.style.background='#3451d1'" onmouseout="this.style.background='#4361ee'">
                    <i class="fas fa-print"></i>
                </button>
            </td>
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

// ──────────────────────────────────────────────
//  Impresión por cargo
// ──────────────────────────────────────────────
window.printPersonnel = function(idx) {
    const item = allData[idx];
    if (!item) return;

    const responsibilities = Array.isArray(item.responsibilities) ? item.responsibilities
        : (typeof item.responsibilities === 'string' ? JSON.parse(item.responsibilities || '[]') : []);
    const accountabilities = Array.isArray(item.accountabilities) ? item.accountabilities
        : (typeof item.accountabilities === 'string' ? JSON.parse(item.accountabilities || '[]') : []);

    const freqColor = { 'Diario':'#e74c3c','Semanal':'#e67e22','Quincenal':'#f39c12','Mensual':'#4361ee','Trimestral':'#9b59b6','Semestral':'#2ecc71','Anual':'#1abc9c' };

    const respRows = responsibilities.length
        ? responsibilities.map((r, i) => {
            const text = typeof r === 'string' ? r : (r.text || '');
            return `<tr>
                <td style="width:32px;color:#888;text-align:center;font-weight:600;">${i + 1}</td>
                <td>${text}</td>
            </tr>`;
        }).join('')
        : `<tr><td colspan="2" style="color:#aaa;font-style:italic;">Sin responsabilidades registradas</td></tr>`;

    const accRows = accountabilities.length
        ? accountabilities.map((a, i) => {
            const text = typeof a === 'string' ? a : (a.text || '');
            const freq = typeof a === 'string' ? '' : (a.frequency || '');
            const color = freqColor[freq] || '#4361ee';
            return `<tr>
                <td style="width:32px;color:#888;text-align:center;font-weight:600;">${i + 1}</td>
                <td>${text}</td>
                <td style="width:110px;text-align:center;">
                    ${freq ? `<span style="background:${color};color:#fff;border-radius:4px;padding:2px 10px;font-size:11px;font-weight:600;">${freq}</span>` : '—'}
                </td>
            </tr>`;
        }).join('')
        : `<tr><td colspan="3" style="color:#aaa;font-style:italic;">Sin rendiciones registradas</td></tr>`;

    const processName = item.processName || item.code || '—';
    const printDate   = new Date().toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' });

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Perfil de Cargo – ${item.role}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 32px; font-size: 13px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 3px solid #4361ee; }
        .header h1 { font-size: 22px; color: #4361ee; margin-bottom: 4px; }
        .header .meta { font-size: 12px; color: #888; }
        .badge-process { display: inline-block; background: #e8edff; color: #4361ee; border-radius: 4px; padding: 3px 10px; font-size: 12px; font-weight: 600; margin-top: 4px; }
        .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .info-box { background: #f8f9fa; border-radius: 8px; padding: 12px 16px; border-left: 4px solid #4361ee; }
        .info-box label { display: block; font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: .6px; margin-bottom: 4px; }
        .info-box span { font-size: 15px; font-weight: 700; color: #222; }
        .section-title { font-size: 14px; font-weight: 700; color: #4361ee; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e0e7ff; display: flex; align-items: center; gap: 8px; }
        .section { margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; }
        table td { padding: 7px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
        table tr:last-child td { border-bottom: none; }
        table tr:hover td { background: #fafbff; }
        .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #aaa; text-align: center; }
        @media print {
            body { padding: 16px; }
            button { display: none !important; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Perfil de Cargo</h1>
            <div class="meta">Consolidado Personal del Proceso</div>
            <span class="badge-process">📋 ${processName} (${item.code})</span>
        </div>
        <div style="text-align:right;font-size:12px;color:#888;">
            <div>Fecha de impresión</div>
            <strong style="color:#333;">${printDate}</strong>
        </div>
    </div>

    <div class="info-grid">
        <div class="info-box">
            <label>Cargo</label>
            <span>${item.role || '—'}</span>
        </div>
        <div class="info-box">
            <label>Reporta a</label>
            <span>${item.reportsTo || '—'}</span>
        </div>
        <div class="info-box" style="border-left-color:#2ecc71;">
            <label>Número de personas</label>
            <span>${item.quantity || '—'}</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">✅ Responsabilidades</div>
        <table>
            <tbody>${respRows}</tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">📊 Rendición de Cuentas</div>
        <table>
            <thead>
                <tr style="background:#f0f4ff;">
                    <td style="width:32px;"></td>
                    <td style="font-weight:700;font-size:12px;color:#666;padding:6px 10px;">Descripción</td>
                    <td style="width:110px;text-align:center;font-weight:700;font-size:12px;color:#666;padding:6px 10px;">Frecuencia</td>
                </tr>
            </thead>
            <tbody>${accRows}</tbody>
        </table>
    </div>

    <div class="footer">Documento generado automáticamente por el sistema MejoraApp · ${printDate}</div>

    <script>window.onload = () => window.print();<\/script>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=820,height=700');
    win.document.write(html);
    win.document.close();
}
