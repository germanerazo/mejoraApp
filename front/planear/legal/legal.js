// ============================================================
// legal.js  –  Matriz Legal  (CRUD conectado a API real)
// ============================================================
import config from "../../js/config.js";

const API_LEGAL = `${config.BASE_API_URL}legalMatrix.php`;

// ── Sesión (igual que hazardRiskMgmt.js) ─────────────────────────────────────
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

// ── Registro único del plugin DataLabels ──────────────────────────────────────
if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
}

// ── Estado local ──────────────────────────────────────────────────────────────
let legalData = [];

// ── Inicialización ────────────────────────────────────────────────────────────
const initLegal = () => {
    if (!loadSession()) {
        Swal.fire('Error', 'No se ha encontrado la sesión de la empresa.', 'error');
        return;
    }
    loadLegalList();
};

// ── READ – cargar lista desde la API ─────────────────────────────────────────
const loadLegalList = async (clasificacion = '', norma = '') => {
    if (!idEmpresa) {
        renderLegalList([]);
        return;
    }

    let url = `${API_LEGAL}?idEmpresa=${idEmpresa}`;
    if (clasificacion) url += `&clasificacion=${encodeURIComponent(clasificacion)}`;
    if (norma)         url += `&norma=${encodeURIComponent(norma)}`;

    try {
        const resp = await fetch(url);
        const data = await resp.json();
        // La API devuelve un array directo
        legalData = Array.isArray(data) ? data : [];
        renderLegalList(legalData);
    } catch (err) {
        console.error('Error cargando matriz legal:', err);
        Swal.fire('Error', 'No se pudo cargar la Matriz Legal', 'error');
    }
};

// ── Render de la tabla ────────────────────────────────────────────────────────
window.renderLegalList = (data = legalData) => {
    const tbody = document.querySelector('#tableLegalList tbody');
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" class="empty-state">No se encontraron normas registradas.</td></tr>`;
        return;
    }

    let html = '';
    data.forEach(item => {
        const existeBadge = item.existeAct === 'SI'
            ? '<span class="badge-active">SI</span>'
            : '<span class="badge-inactive">NO</span>';

        html += `<tr>
            <td class="col-action" style="display:flex;gap:5px;justify-content:center;">
                <button class="btn-edit-premium"   title="Editar"   onclick="editLegal(${item.idLegal})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-premium" title="Eliminar" onclick="deleteLegal(${item.idLegal})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td class="col-id">${item.idLegal}</td>
            <td>${item.clasificacion ?? ''}</td>
            <td class="col-norma">${item.norma ?? ''}</td>
            <td>${item.anioEmision ?? ''}</td>
            <td>${item.disposicion ?? ''}</td>
            <td>${item.articulos   ?? ''}</td>
            <td class="col-desc">${item.descripcion ?? ''}</td>
            <td class="col-evidencia">${item.evidencia   ?? ''}</td>
            <td>${item.responsable ?? ''}</td>
            <td style="text-align:center;">${existeBadge}</td>
            <td>${item.observacion ?? ''}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
};

// ── Filtrar ───────────────────────────────────────────────────────────────────
window.filterLegal = () => {
    const clasificacion = document.getElementById('filterClassification').value;
    const norma         = document.getElementById('filterNorma').value.trim();
    loadLegalList(clasificacion, norma);
};

// ── Mostrar formulario Nuevo ──────────────────────────────────────────────────
window.showCreateLegal = () => {
    document.getElementById('legalListView').style.display   = 'none';
    document.getElementById('legalCreateView').style.display = 'block';
    document.getElementById('legalGraphView').style.display  = 'none';
    document.getElementById('legalFormTitle').innerText = 'NUEVO REGISTRO MATRIZ LEGAL';

    document.getElementById('legalForm').reset();
    document.getElementById('legalId').value    = '';
    document.getElementById('fieldDate').value  = new Date().toISOString().split('T')[0];
};

window.hideCreateLegal = () => {
    document.getElementById('legalCreateView').style.display = 'none';
    document.getElementById('legalListView').style.display   = 'block';
};

// ── CREATE / UPDATE ───────────────────────────────────────────────────────────
window.saveLegal = async () => {
    const id   = document.getElementById('legalId').value;
    const norma = document.getElementById('fieldNorm').value.trim();

    if (!norma) {
        Swal.fire('Error', 'El campo Norma es obligatorio', 'error');
        return;
    }

    const payload = {
        token,
        idEmpresa,
        clasificacion: document.getElementById('fieldClassification').value,
        norma,
        anioEmision:   document.getElementById('fieldYear').value,
        disposicion:   document.getElementById('fieldDisposition').value,
        articulos:     document.getElementById('fieldArticles').value,
        descripcion:   document.getElementById('fieldDescription').value,
        evidencia:     document.getElementById('fieldEvidence').value,
        responsable:   document.getElementById('fieldResponsible').value,
        existeAct:     document.getElementById('fieldExists').value,
        observacion:   document.getElementById('fieldObservation').value,
        fecha:         document.getElementById('fieldDate').value,
    };

    let url    = API_LEGAL;
    let method = 'POST';

    if (id) {
        payload.idLegal = id;
        url    = `${API_LEGAL}?_method=PUT`;
        method = 'POST';   // simulamos PUT via POST + flag
    }

    try {
        const resp = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await resp.json();

        if (result.status === 'ok') {
            Swal.fire('Guardado', 'Registro guardado correctamente', 'success');
            hideCreateLegal();
            loadLegalList();
        } else {
            Swal.fire('Error', result?.result?.error_message ?? 'Error al guardar', 'error');
        }
    } catch (err) {
        console.error('Error guardando registro legal:', err);
        Swal.fire('Error', 'No se pudo guardar el registro', 'error');
    }
};

// ── Cargar datos en formulario para editar ────────────────────────────────────
window.editLegal = (idLegal) => {
    const item = legalData.find(i => parseInt(i.idLegal) === parseInt(idLegal));
    if (!item) return;

    showCreateLegal();
    document.getElementById('legalFormTitle').innerText = 'EDITAR REGISTRO MATRIZ LEGAL';

    document.getElementById('legalId').value                   = item.idLegal;
    document.getElementById('fieldClassification').value       = item.clasificacion ?? 'S';
    document.getElementById('fieldNorm').value                 = item.norma         ?? '';
    document.getElementById('fieldYear').value                 = item.anioEmision   ?? '';
    document.getElementById('fieldDisposition').value          = item.disposicion   ?? '';
    document.getElementById('fieldArticles').value             = item.articulos     ?? '';
    document.getElementById('fieldDescription').value          = item.descripcion   ?? '';
    document.getElementById('fieldEvidence').value             = item.evidencia     ?? '';
    document.getElementById('fieldResponsible').value          = item.responsable   ?? '';
    document.getElementById('fieldExists').value               = item.existeAct     ?? 'NO';
    document.getElementById('fieldObservation').value          = item.observacion   ?? '';
    document.getElementById('fieldDate').value                 = item.fecha         ?? '';
};

// ── DELETE – un registro ──────────────────────────────────────────────────────
window.deleteLegal = (idLegal) => {
    Swal.fire({
        title: '¿Eliminar registro?',
        text:  'Esta acción no se puede deshacer',
        icon:  'warning',
        showCancelButton:    true,
        confirmButtonColor:  '#e74c3c',
        confirmButtonText:   'Sí, eliminar',
        cancelButtonText:    'Cancelar',
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        try {
            const resp = await fetch(API_LEGAL, {
                method:  'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ token, idEmpresa, idLegal }),
            });
            const data = await resp.json();

            if (data.status === 'ok') {
                Swal.fire('Eliminado', 'Registro eliminado correctamente.', 'success');
                loadLegalList();
            } else {
                Swal.fire('Error', data?.result?.error_message ?? 'Error al eliminar', 'error');
            }
        } catch (err) {
            console.error('Error eliminando registro legal:', err);
            Swal.fire('Error', 'No se pudo eliminar el registro', 'error');
        }
    });
};

// ── DELETE ALL – eliminar toda la gestión legal ───────────────────────────────
window.deleteSelected = () => {
    Swal.fire({
        title: '¿Eliminar TODA la Gestión Legal?',
        text:  'Se eliminarán TODOS los registros de la empresa. Esta acción no se puede deshacer.',
        icon:  'warning',
        showCancelButton:    true,
        confirmButtonColor:  '#e74c3c',
        confirmButtonText:   'Sí, eliminar todo',
        cancelButtonText:    'Cancelar',
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        try {
            const resp = await fetch(`${API_LEGAL}?_method=DELETE_ALL`, {
                method:  'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ token, idEmpresa }),
            });
            const data = await resp.json();

            if (data.status === 'ok') {
                Swal.fire('Eliminado', 'Toda la gestión legal ha sido eliminada.', 'success');
                loadLegalList();
            } else {
                Swal.fire('Error', data?.result?.error_message ?? 'Error al eliminar', 'error');
            }
        } catch (err) {
            console.error('Error eliminando gestión legal:', err);
            Swal.fire('Error', 'No se pudo eliminar la gestión legal', 'error');
        }
    });
};

// ── GRÁFICA ───────────────────────────────────────────────────────────────────
let legalChartInstance = null;

window.showLegalGraph = () => {
    document.getElementById('legalListView').style.display   = 'none';
    document.getElementById('legalCreateView').style.display = 'none';
    document.getElementById('legalGraphView').style.display  = 'block';
    renderLegalChart();
};

window.hideLegalGraph = () => {
    document.getElementById('legalGraphView').style.display  = 'none';
    document.getElementById('legalListView').style.display   = 'block';
};

window.renderLegalChart = () => {
    const ctx = document.getElementById('legalChart').getContext('2d');

    let siCount = 0, noCount = 0;
    legalData.forEach(item => {
        if (item.existeAct === 'SI') siCount++;
        else                         noCount++;
    });

    const total  = siCount + noCount;
    const percSi = total ? Math.round((siCount / total) * 100) : 0;
    const percNo = total ? Math.round((noCount / total) * 100) : 0;

    document.getElementById('statSi').innerText    = siCount;
    document.getElementById('percSi').innerText    = percSi + '%';
    document.getElementById('statNo').innerText    = noCount;
    document.getElementById('percNo').innerText    = percNo + '%';
    document.getElementById('statTotal').innerText = total;

    if (legalChartInstance) legalChartInstance.destroy();

    legalChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['SI', 'NO'],
            datasets: [{
                data: [siCount, noCount],
                backgroundColor: ['#2ecc71', '#e74c3c'],
                borderWidth: 1,
            }],
        },
        options: {
            responsive:          true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title:  { display: true, text: 'Distribución Existe Actividad' },
                datalabels: {
                    color: '#fff',
                    font:  { weight: 'bold', size: 16 },
                    formatter: (value, ctx) => {
                        const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        return sum > 0 ? (value * 100 / sum).toFixed(0) + '%' : '0%';
                    },
                },
            },
        },
    });
};

window.printLegalGraph = () => {
    const canvas  = document.getElementById('legalChart');
    const win     = window.open('', 'Imprimir Gráfica', 'height=600,width=800');
    win.document.write('<html><head><title>Imprimir Gráfica Legal</title>');
    win.document.write('<style>body{font-family:sans-serif;text-align:center;padding:20px;}h2{margin-bottom:20px;}img{max-width:100%;height:auto;}</style>');
    win.document.write('</head><body>');
    win.document.write('<h2>Gráfica de Cumplimiento Legal (Existe Actividad)</h2>');
    win.document.write('<div style="margin-bottom:30px;display:inline-block;text-align:left;">' + document.getElementById('legalStats').outerHTML + '</div><br>');
    win.document.write('<img src="' + canvas.toDataURL() + '" />');
    win.document.write('</body></html>');
    win.document.close();
    win.print();
};

// ── Bootstrap ─────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLegal);
} else {
    initLegal();
}
