import config from "../../js/config.js";

const DANGER_API  = `${config.BASE_API_URL}dangerMgmt.php`;
const SHEET_API   = `${config.BASE_API_URL}processSheet.php`;
const PROCESS_API = `${config.BASE_API_URL}processes.php`;

let idEmpresa = null;
let rrAllRows = [];       // todas las filas aplanadas
let rrFiltered = [];      // filas filtradas

// ── Sesión ────────────────────────────────────────────────────────────────────
const loadSession = () => {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        return true;
    }
    return false;
};

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const init = async () => {
    if (!loadSession()) {
        document.getElementById('rrTableBody').innerHTML =
            `<tr><td colspan="24" class="empty-state" style="color:#e74c3c;">
                <i class="fas fa-lock fa-2x"></i><p>No se encontró sesión de empresa.</p>
             </td></tr>`;
        return;
    }
    await loadReport();
};

// ── Cargar datos desde la API ─────────────────────────────────────────────────
const loadReport = async () => {
    setLoading(true);
    try {
        const resp = await fetch(`${DANGER_API}?action=fullReport&idEmpresa=${idEmpresa}`);
        const data = await resp.json();
        rrAllRows  = Array.isArray(data) ? data : [];
        rrFiltered = [...rrAllRows];
        renderTable(rrFiltered);
    } catch (err) {
        console.error('Error cargando reporte:', err);
        document.getElementById('rrTableBody').innerHTML =
            `<tr><td colspan="24" class="empty-state" style="color:#e74c3c;">
                <i class="fas fa-exclamation-triangle fa-2x"></i>
                <p>Error al cargar el reporte. Revise la conexión.</p>
             </td></tr>`;
    }
};

const setLoading = (on) => {
    if (on) {
        document.getElementById('rrTableBody').innerHTML =
            `<tr><td colspan="24" class="empty-state">
                <i class="fas fa-spinner fa-spin fa-2x"></i><p>Cargando reporte...</p>
             </td></tr>`;
    }
};

// ── Render tabla ──────────────────────────────────────────────────────────────
const renderTable = (rows) => {
    document.getElementById('rrRowCount').textContent = rows.length;

    if (rows.length === 0) {
        document.getElementById('rrTableBody').innerHTML =
            `<tr><td colspan="24" class="empty-state">
                <i class="fas fa-search fa-2x" style="opacity:.4;"></i>
                <p>No se encontraron registros con los filtros aplicados.</p>
             </td></tr>`;
        return;
    }

    let html = '';
    rows.forEach((r, idx) => {
        const np  = calcNP(r.deficiency_level, r.exposure_level);
        const nr  = calcNR(np, r.consequence_level);
        const interpNP  = interpretNP(np);
        const interpNR  = interpretNR(nr);
        const accept     = acceptability(nr);
        const acceptCls  = acceptClass(accept);
        const nrCls      = nrClass(nr);

        const measures = (r.measures || '').trim() || '—';
        const bgStripe = idx % 2 === 0 ? '#fff' : '#f4f7fc';

        html += `<tr style="background:${bgStripe};">
            <td class="rr-sticky-cell" style="text-align:left; background:${bgStripe};">${r.activity_name ?? '—'}</td>
            <td style="text-align:left;">${r.area ?? '—'}</td>
            <td>${routineBadge(r.routine)}</td>
            <td>${highRiskBadge(r.high_risk)}</td>
            <td style="text-align:left; font-weight:600;">${r.danger_name ?? '—'}</td>
            <td style="text-align:left;">${r.consequence_name ?? '—'}</td>
            <td style="text-align:left; font-size:0.75rem;">${r.existing_controls ?? '—'}</td>
            <td>${r.deficiency_level ?? '—'}</td>
            <td>${r.exposure_level ?? '—'}</td>
            <td><strong>${np !== null ? np : '—'}</strong></td>
            <td><span class="rr-badge ${nrCls}">${interpNP}</span></td>
            <td>${r.consequence_level ?? '—'}</td>
            <td><strong>${nr !== null ? nr : '—'}</strong></td>
            <td><span class="rr-badge ${nrCls}">${interpNR}</span></td>
            <td><span class="${acceptCls}">${accept}</span></td>
            <td>${r.exposed_count ?? '—'}</td>
            <td style="text-align:left; font-size:0.75rem;">${r.worst_consequence ?? '—'}</td>
            <td>${r.legal_requirements ?? '—'}</td>
            <td style="text-align:left; font-size:0.75rem;">${measures}</td>
            <td>${checkIcon(r.has_elimination)}</td>
            <td>${checkIcon(r.has_substitution)}</td>
            <td>${checkIcon(r.has_engineering)}</td>
            <td>${checkIcon(r.has_administrative)}</td>
            <td>${checkIcon(r.has_ppe)}</td>
        </tr>`;
    });

    document.getElementById('rrTableBody').innerHTML = html;
};

// ── Helpers de cálculo (GTC-45) ───────────────────────────────────────────────
const calcNP = (nd, ne) => {
    const n = parseInt(nd), e = parseInt(ne);
    if (isNaN(n) || isNaN(e)) return null;
    return n * e;
};

const calcNR = (np, nc) => {
    if (np === null) return null;
    const c = parseInt(nc);
    if (isNaN(c)) return null;
    return np * c;
};

const interpretNP = (np) => {
    if (np === null) return '—';
    if (np >= 24) return 'Muy Alto';
    if (np >= 10) return 'Alto';
    if (np >= 6)  return 'Medio';
    return 'Bajo';
};

const interpretNR = (nr) => {
    if (nr === null) return '—';
    if (nr > 600)  return 'I - Muy Alto';
    if (nr >= 150) return 'II - Alto';
    if (nr >= 40)  return 'III - Medio';
    return 'IV - Bajo';
};

const acceptability = (nr) => {
    if (nr === null) return '—';
    if (nr > 600)  return 'No Aceptable';
    if (nr >= 150) return 'No Aceptable o Aceptable con control específico';
    if (nr >= 40)  return 'Aceptable';
    return 'Aceptable';
};

const nrClass = (nr) => {
    if (nr === null) return '';
    if (nr > 600)  return 'rr-nr-iv';
    if (nr >= 150) return 'rr-nr-iii';
    if (nr >= 40)  return 'rr-nr-ii';
    return 'rr-nr-i';
};

const acceptClass = (accept) => {
    if (accept === 'No Aceptable') return 'rr-accept-no';
    if (accept.includes('control')) return 'rr-accept-ctrl';
    if (accept === 'Aceptable') return 'rr-accept-ok';
    return '';
};

// ── Badges ────────────────────────────────────────────────────────────────────
const routineBadge = (val) => {
    const sí = val && val.toLowerCase() === 'sí';
    return sí
        ? `<span class="badge-routine"><i class="fas fa-check-circle"></i> Sí</span>`
        : `<span class="badge-routine-no"><i class="fas fa-times-circle"></i> No</span>`;
};

const highRiskBadge = (val) => {
    const sí = val && val.toLowerCase() === 'sí';
    return sí
        ? `<span class="badge-high-risk-yes"><i class="fas fa-exclamation-triangle"></i> Sí</span>`
        : `<span class="badge-high-risk"><i class="fas fa-shield-alt"></i> No</span>`;
};

const checkIcon = (val) => {
    const yes = parseInt(val) === 1;
    return yes
        ? `<i class="fas fa-check-circle rr-check-yes"></i>`
        : `<i class="fas fa-circle rr-check-no" style="opacity:.2;"></i>`;
};

// ── Filtros ───────────────────────────────────────────────────────────────────
window.rrApplyFilters = () => {
    const actF    = document.getElementById('rrFilterActivity').value.toLowerCase().trim();
    const areaF   = document.getElementById('rrFilterArea').value.toLowerCase().trim();
    const dangerF = document.getElementById('rrFilterDanger').value.toLowerCase().trim();
    const acceptF = document.getElementById('rrFilterAccept').value;

    rrFiltered = rrAllRows.filter(r => {
        const np = calcNP(r.deficiency_level, r.exposure_level);
        const nr = calcNR(np, r.consequence_level);
        const accept = acceptability(nr);

        const matchAct    = !actF    || (r.activity_name  ?? '').toLowerCase().includes(actF);
        const matchArea   = !areaF   || (r.area           ?? '').toLowerCase().includes(areaF);
        const matchDanger = !dangerF || (r.danger_name    ?? '').toLowerCase().includes(dangerF);
        const matchAccept = !acceptF || accept.includes(acceptF);

        return matchAct && matchArea && matchDanger && matchAccept;
    });

    renderTable(rrFiltered);
};

window.rrClearFilters = () => {
    document.getElementById('rrFilterActivity').value = '';
    document.getElementById('rrFilterArea').value     = '';
    document.getElementById('rrFilterDanger').value   = '';
    document.getElementById('rrFilterAccept').value   = '';
    rrFiltered = [...rrAllRows];
    renderTable(rrFiltered);
};

// ── Imprimir ──────────────────────────────────────────────────────────────────
window.rrPrint = () => {
    const table    = document.getElementById('rrTable');
    const rowCount = document.getElementById('rrRowCount').textContent;
    const now      = new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });

    const printStyles = `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Página: A3 horizontal ─────────────────────────────────── */
        @page {
            size: A3 landscape;
            margin: 6mm 5mm;
        }

        html, body {
            font-family: Arial, Helvetica, sans-serif;
            background: #fff;
            width: 100%;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        /* El wrapper se escalará por JS para que quepa en el papel */
        #printRoot {
            transform-origin: top left;
            width: max-content;
        }

        .print-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-bottom: 8px;
            border-bottom: 2.5px solid #22496d;
            margin-bottom: 10px;
        }
        .print-header h1 {
            font-size: 12pt;
            color: #22496d;
            font-weight: 700;
        }
        .print-header p  { font-size: 7.5pt; color: #555; margin-top: 3px; }
        .print-meta      { font-size: 7pt; color: #666; text-align: right; line-height: 1.5; }

        table {
            border-collapse: collapse;
            table-layout: auto;
        }
        thead tr {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        th {
            background: #22496d !important;
            color: #fff;
            padding: 5px 5px;
            font-size: 6.2pt;
            text-align: center;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2px;
            border: 1px solid rgba(255,255,255,0.25);
            white-space: nowrap;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        td {
            padding: 4px 5px;
            border: 1px solid #ccc;
            vertical-align: middle;
            text-align: center;
            font-size: 6.5pt;
            color: #1a1a1a;
            line-height: 1.3;
        }
        tr:nth-child(even) td {
            background: #f0f4f8;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        /* Columnas con texto a la izquierda */
        td:nth-child(1)  { text-align: left; font-weight: 700; color: #22496d; }
        td:nth-child(2)  { text-align: left; }
        td:nth-child(5)  { text-align: left; font-weight: 600; }
        td:nth-child(6)  { text-align: left; }
        td:nth-child(7)  { text-align: left; }
        td:nth-child(17) { text-align: left; }
        td:nth-child(18) { text-align: left; }
        td:nth-child(19) { text-align: left; }

        /* Badges de riesgo ────────────────────────────────────────── */
        .rr-badge, .badge-routine, .badge-routine-no,
        .badge-high-risk, .badge-high-risk-yes,
        .rr-accept-ok, .rr-accept-no, .rr-accept-ctrl {
            display: inline-block;
            padding: 1px 5px;
            border-radius: 8px;
            font-size: 6pt;
            font-weight: 700;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        .rr-nr-i    { background: #d4edda !important; color: #155724 !important; }
        .rr-nr-ii   { background: #fff3cd !important; color: #856404 !important; }
        .rr-nr-iii  { background: #fde8c8 !important; color: #7a4200 !important; }
        .rr-nr-iv   { background: #f8d7da !important; color: #721c24 !important; }
        .rr-accept-ok   { background: #d4edda !important; color: #155724 !important; }
        .rr-accept-no   { background: #f8d7da !important; color: #721c24 !important; }
        .rr-accept-ctrl { background: #fff3cd !important; color: #856404 !important; }
        .badge-routine      { background: rgba(39,174,96,0.15) !important;  color: #27ae60 !important; }
        .badge-routine-no   { background: rgba(141,153,174,0.1) !important; color: #8d99ae !important; }
        .badge-high-risk-yes{ background: rgba(231,76,60,0.15) !important;  color: #c0392b !important; }
        .badge-high-risk    { background: rgba(231,76,60,0.08) !important;  color: #e74c3c !important; }
        .rr-check-yes { color: #27ae60 !important; font-size: 8pt; }
        .rr-check-no  { color: #ddd    !important; font-size: 8pt; }
    `;

    // Clonar tabla y limpiar sticky
    const clonedTable = table.cloneNode(true);
    clonedTable.querySelectorAll('[class*="rr-sticky"]').forEach(el => {
        el.style.position = 'static';
    });

    const win = window.open('', '_blank', 'width=1400,height=900,scrollbars=yes');
    win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte Matriz de Peligros y Riesgos</title>
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>${printStyles}</style>
</head>
<body>
<div id="printRoot">
    <div class="print-header">
        <div>
            <h1><i class="fas fa-shield-alt" style="color:#329bd6;margin-right:6px;"></i>Reporte Matriz de Peligros y Riesgos</h1>
            <p>${rowCount} registro(s) mostrados &nbsp;·&nbsp; Generado el ${now}</p>
        </div>
        <div class="print-meta">
            <strong>Gestión de Peligros y Riesgos</strong><br>
            Metodología GTC-45
        </div>
    </div>
    ${clonedTable.outerHTML}
</div>
</body>
</html>`);
    win.document.close();

    win.addEventListener('load', () => {
        // A3 landscape: ancho útil ≈ 410mm × (96px/25.4mm) = ~1,550px equivalente
        // Pero usamos el ancho de viewport de la ventana de impresión como referencia
        const printRoot  = win.document.getElementById('printRoot');
        const naturalW   = printRoot.scrollWidth;

        // Ancho utilizable A3 landscape en mm (420 - 10mm márgenes) × factor px/mm a 96dpi
        const paperMM    = 410;          // A3 landscape útil ~410mm
        const pxPerMM    = 96 / 25.4;   // ≈ 3.78 px por mm
        const targetPx   = paperMM * pxPerMM; // ≈ 1550px

        const scale = Math.min(1, targetPx / naturalW);

        printRoot.style.transform      = `scale(${scale})`;
        printRoot.style.transformOrigin = 'top left';
        // Ajustar el alto del body al contenido escalado
        win.document.body.style.height = (printRoot.scrollHeight * scale) + 'px';

        setTimeout(() => {
            win.focus();
            win.print();
            // Cerrar solo después de que el diálogo de impresión cierre
            win.addEventListener('afterprint', () => win.close());
        }, 700);
    });
};

// ── Exportar Excel ────────────────────────────────────────────────────────────
window.rrExportExcel = () => {
    if (typeof XLSX === 'undefined') {
        Swal.fire('Error', 'La librería Excel no está disponible.', 'error');
        return;
    }

    const headers = [
        'Actividad','Área','Rutinaria','Alto Riesgo','Peligro','Consecuencia',
        'Controles Existentes','Nvl Deficiencia','Nvl Exposición',
        'Nvl Probabilidad','Interp. NP','Nvl Consecuencia','Nvl Riesgo','Interp. NR',
        'Aceptabilidad','Nro. Expuestos','Peor Consecuencia','Req. Legales',
        'Medidas de Prevención','Eliminación','Sustitución','Control Ingeniería','Control Admon.','EPP'
    ];

    const dataRows = rrFiltered.map(r => {
        const np = calcNP(r.deficiency_level, r.exposure_level);
        const nr = calcNR(np, r.consequence_level);
        return [
            r.activity_name    ?? '',
            r.area             ?? '',
            r.routine          ?? '',
            r.high_risk        ?? '',
            r.danger_name      ?? '',
            r.consequence_name ?? '',
            r.existing_controls ?? '',
            r.deficiency_level  ?? '',
            r.exposure_level    ?? '',
            np !== null ? np    : '',
            interpretNP(np),
            r.consequence_level ?? '',
            nr !== null ? nr    : '',
            interpretNR(nr),
            acceptability(nr),
            r.exposed_count    ?? '',
            r.worst_consequence ?? '',
            r.legal_requirements ?? '',
            r.measures          ?? '',
            parseInt(r.has_elimination)   === 1 ? 'Sí' : 'No',
            parseInt(r.has_substitution)  === 1 ? 'Sí' : 'No',
            parseInt(r.has_engineering)   === 1 ? 'Sí' : 'No',
            parseInt(r.has_administrative)=== 1 ? 'Sí' : 'No',
            parseInt(r.has_ppe)           === 1 ? 'Sí' : 'No',
        ];
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
    ws['!cols'] = headers.map((_, i) => ({ wch: [20,12,10,10,25,25,25,10,10,10,15,10,10,15,30,10,25,15,40,12,12,18,18,8][i] ?? 15 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MatrizRiesgos');
    XLSX.writeFile(wb, 'reporte_matriz_peligros_riesgos.xlsx');
};

// ── Init ──────────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
