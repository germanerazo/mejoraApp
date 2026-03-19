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
window.rrPrint = () => window.print();

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
