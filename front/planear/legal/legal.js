// ============================================================
// legal.js  –  Matriz Legal  (CRUD conectado a API real)
// ============================================================
import config from "../../js/config.js";

const API_LEGAL = `${config.BASE_API_URL}legalMatrix.php`;

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

// ══════════════════════════════════════════════════════════════════════════════
// IMPORTACIÓN DESDE EXCEL
// ══════════════════════════════════════════════════════════════════════════════

// Columnas esperadas (índice 0-based)
const EXCEL_COLS = [
    'clasificacion',  // 0
    'norma',          // 1
    'anioEmision',    // 2
    'disposicion',    // 3
    'articulos',      // 4
    'descripcion',    // 5
    'evidencia',      // 6
    'responsable',    // 7
    'existeAct',      // 8
    'observacion',    // 9
    'fecha',          // 10
];

const EXCEL_HEADERS = [
    'Clasificación','Norma','Año Emisión','Disposición que regula',
    'Art. Aplicable','Descripción Requisito','Evidencia Cumplimiento',
    'Responsable','Existe Act.','Observación','Fecha',
];

/** Filas parseadas del Excel, se llenan en parseo y se usan en importExcelData */
let excelParsedRows = [];

// ── Abrir/cerrar modal ────────────────────────────────────────────────────────
window.triggerExcelImport = () => {
    document.getElementById('modalExcelImport').style.display = 'block';
    // Reset estado anterior
    excelParsedRows = [];
    document.getElementById('excelPreviewContainer').style.display  = 'none';
    document.getElementById('importProgressWrapper').style.display  = 'none';
    document.getElementById('excelPreviewTable').innerHTML           = '';
    const dropZone = document.getElementById('excelDropZone');
    dropZone.style.background   = '#f6fff8';
    dropZone.style.borderColor  = '#2ecc71';

    // Abrir selector solo si el modal ya estaba visible antes (evita doble apertura)
    // El onclick del drop zone llama a este mismo método; el input lo lanzamos desde aquí
    // solo cuando el usuario hizo clic en el botón de la barra de acciones.
    const caller = triggerExcelImport.caller;   // puede ser null en módulos strict
    document.getElementById('excelFileInput').click();
};

window.closeExcelModal = () => {
    document.getElementById('modalExcelImport').style.display = 'none';
    document.getElementById('excelFileInput').value = '';
};

// Cerrar modal al hacer clic fuera del panel
document.getElementById('modalExcelImport').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalExcelImport')) closeExcelModal();
});

// ── Drag-and-drop ─────────────────────────────────────────────────────────────
window.handleExcelDrop = (event) => {
    event.preventDefault();
    const dropZone = document.getElementById('excelDropZone');
    dropZone.style.background  = '#f6fff8';
    dropZone.style.borderColor = '#2ecc71';
    const file = event.dataTransfer.files[0];
    if (file) processExcelFile(file);
};

// ── Selección por input file ──────────────────────────────────────────────────
window.handleExcelFile = (event) => {
    const file = event.target.files[0];
    if (file) processExcelFile(file);
};

// ── Parsear archivo con SheetJS ───────────────────────────────────────────────
const processExcelFile = (file) => {
    const allowed = ['.xlsx', '.xls', '.csv'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
        Swal.fire('Formato no válido', 'Solo se aceptan archivos .xlsx, .xls o .csv', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data    = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            const sheet   = workbook.Sheets[workbook.SheetNames[0]];
            const rows    = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

            // Detectar si la primera fila es encabezado (contiene texto no numérico en col 1)
            let startRow = 0;
            if (rows.length > 0) {
                const firstCell = String(rows[0][0] || '').trim().toUpperCase();
                // Si la primera celda NO es H/S/E, asumimos que es encabezado
                if (!['H', 'S', 'E'].includes(firstCell)) startRow = 1;
            }

            excelParsedRows = [];
            for (let i = startRow; i < rows.length; i++) {
                const row = rows[i];
                // Ignorar filas completamente vacías
                if (row.every(cell => cell === '' || cell === null || cell === undefined)) continue;

                const clasif = String(row[0] ?? '').trim().toUpperCase();
                const norma  = String(row[1] ?? '').trim();
                if (!norma) continue; // norma es campo obligatorio

                // Manejar año — SheetJS puede devolver Date o número
                let anio = row[2];
                if (anio instanceof Date) anio = anio.getFullYear();
                anio = parseInt(anio) || '';

                // Manejar fecha (col 10)
                let fecha = row[10];
                if (fecha instanceof Date) {
                    fecha = fecha.toISOString().split('T')[0];
                } else {
                    fecha = String(fecha ?? '').trim();
                }

                const existeAct = String(row[8] ?? 'NO').trim().toUpperCase();

                excelParsedRows.push({
                    clasificacion: ['H','S','E'].includes(clasif) ? clasif : 'S',
                    norma,
                    anioEmision:  anio,
                    disposicion:  String(row[3]  ?? '').trim(),
                    articulos:    String(row[4]  ?? '').trim(),
                    descripcion:  String(row[5]  ?? '').trim(),
                    evidencia:    String(row[6]  ?? '').trim(),
                    responsable:  String(row[7]  ?? '').trim(),
                    existeAct:    ['SI','NO'].includes(existeAct) ? existeAct : 'NO',
                    observacion:  String(row[9]  ?? '').trim(),
                    fecha,
                });
            }

            if (excelParsedRows.length === 0) {
                Swal.fire('Sin datos', 'No se encontraron filas válidas en el archivo. Verifica que la Norma esté completa.', 'warning');
                return;
            }

            renderExcelPreview(excelParsedRows);
        } catch (err) {
            console.error('Error leyendo Excel:', err);
            Swal.fire('Error', 'No se pudo leer el archivo. Verifica que sea un Excel válido.', 'error');
        }
    };
    reader.readAsArrayBuffer(file);
};

// ── Renderizar preview ────────────────────────────────────────────────────────
const renderExcelPreview = (rows) => {
    const container = document.getElementById('excelPreviewContainer');
    const table     = document.getElementById('excelPreviewTable');
    const countEl   = document.getElementById('excelPreviewCount');

    countEl.innerHTML = `<i class="fas fa-table" style="margin-right:6px;"></i>${rows.length} registro${rows.length !== 1 ? 's' : ''} encontrado${rows.length !== 1 ? 's' : ''}`;

    // Encabezado
    let html = `<thead><tr style="position:sticky;top:0;background:#1a7f37;color:#fff;">`;
    html += `<th style="padding:8px 10px;font-size:0.75rem;">#</th>`;
    EXCEL_HEADERS.forEach(h => {
        html += `<th style="padding:8px 10px;font-size:0.75rem;white-space:nowrap;">${h}</th>`;
    });
    html += `</tr></thead><tbody>`;

    rows.forEach((row, idx) => {
        const existeBadge = row.existeAct === 'SI'
            ? `<span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:10px;font-weight:600;">SI</span>`
            : `<span style="background:#ffebee;color:#c62828;padding:2px 8px;border-radius:10px;font-weight:600;">NO</span>`;

        const bg = idx % 2 === 0 ? '#fff' : '#f9fafb';
        html += `<tr style="background:${bg};">
            <td style="padding:6px 10px;color:#888;font-size:0.75rem;text-align:center;">${idx + 1}</td>
            <td style="padding:6px 10px;font-weight:700;color:#1a7f37;">${row.clasificacion}</td>
            <td style="padding:6px 10px;font-weight:600;">${row.norma}</td>
            <td style="padding:6px 10px;">${row.anioEmision}</td>
            <td style="padding:6px 10px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${row.disposicion}">${row.disposicion}</td>
            <td style="padding:6px 10px;">${row.articulos}</td>
            <td style="padding:6px 10px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${row.descripcion}">${row.descripcion}</td>
            <td style="padding:6px 10px;max-width:150px;overflow:hidden;text-overflow:ellipsis;" title="${row.evidencia}">${row.evidencia}</td>
            <td style="padding:6px 10px;">${row.responsable}</td>
            <td style="padding:6px 10px;text-align:center;">${existeBadge}</td>
            <td style="padding:6px 10px;max-width:120px;overflow:hidden;text-overflow:ellipsis;" title="${row.observacion}">${row.observacion}</td>
            <td style="padding:6px 10px;">${row.fecha}</td>
        </tr>`;
    });
    html += `</tbody>`;
    table.innerHTML = html;
    container.style.display = 'block';
};

// ── Guardar todos los registros via API (uno por uno con barra de progreso) ───
window.importExcelData = async () => {
    if (!excelParsedRows.length) return;
    if (!idEmpresa) {
        Swal.fire('Error', 'No se encontró la sesión de empresa.', 'error');
        return;
    }

    const totalRows = excelParsedRows.length;
    const progressWrapper = document.getElementById('importProgressWrapper');
    const progressBar     = document.getElementById('importProgressBar');
    const progressLabel   = document.getElementById('importProgressLabel');
    const previewContainer = document.getElementById('excelPreviewContainer');

    previewContainer.style.display  = 'none';
    progressWrapper.style.display   = 'block';

    let successCount = 0;
    let errorCount   = 0;

    for (let i = 0; i < totalRows; i++) {
        const row = excelParsedRows[i];
        const pct = Math.round(((i + 1) / totalRows) * 100);

        progressBar.style.width   = pct + '%';
        progressLabel.textContent = `Importando ${i + 1} de ${totalRows}… (${pct}%)`;

        try {
            const resp = await fetch(API_LEGAL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, idEmpresa, ...row }),
            });
            const result = await resp.json();
            if (result.status === 'ok') successCount++;
            else                        errorCount++;
        } catch {
            errorCount++;
        }
    }

    progressBar.style.width   = '100%';
    progressLabel.textContent = `Completado: ${successCount} guardados, ${errorCount} errores.`;

    setTimeout(() => {
        closeExcelModal();
        loadLegalList();
        Swal.fire({
            icon:  errorCount === 0 ? 'success' : 'warning',
            title: 'Importación completada',
            html:  `<b>${successCount}</b> registro${successCount !== 1 ? 's' : ''} importado${successCount !== 1 ? 's' : ''} correctamente.<br>` +
                   (errorCount ? `<span style="color:#e74c3c;">${errorCount} con error.</span>` : ''),
        });
    }, 500);
};

// ── Descargar plantilla Excel ─────────────────────────────────────────────────
window.downloadExcelTemplate = () => {
    if (typeof XLSX === 'undefined') {
        Swal.fire('Error', 'La librería de Excel no está disponible aún. Intenta de nuevo en un momento.', 'error');
        return;
    }

    const templateRows = [
        EXCEL_HEADERS,  // fila de encabezados
        // Fila de ejemplo
        ['S', 'Decreto 1072', 2015, 'Ministerio de Trabajo', 'Art. 2.2.4.6.1',
         'Por medio del cual se expide el Decreto Único Reglamentario del Sector Trabajo',
         'Matriz de Peligros, Plan de Trabajo', 'Lider SST', 'SI', 'Cumplimiento anual', '2024-01-15'],
        ['H', 'Ley 1562', 2012, 'Congreso de la República', 'Art. 1',
         'Por la cual se modifica el Sistema de Riesgos Laborales',
         'Afiliaciones ARL', 'Gerencia', 'SI', '', '2024-01-01'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateRows);

    // Ancho de columnas
    ws['!cols'] = [
        { wch: 14 }, { wch: 20 }, { wch: 13 }, { wch: 30 }, { wch: 20 },
        { wch: 50 }, { wch: 30 }, { wch: 20 }, { wch: 12 }, { wch: 30 }, { wch: 14 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MatrizLegal');
    XLSX.writeFile(wb, 'plantilla_matriz_legal.xlsx');
};
