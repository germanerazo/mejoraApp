// ============================================================
// tracking.js  –  Seguimiento de Presupuesto (CRUD real)
// ============================================================
import config from "../../js/config.js";

const API = `${config.BASE_API_URL}budgetTracking.php`;

// ── Sesión ────────────────────────────────────────────────────────────────────
let idEmpresa         = null;
let token             = null;
let currentBudgetId   = null;
let currentYear       = null;
let currentMonthsData = [];   // Array of 12 { month, budget, executed }
let chartInstance     = null;

const months = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO',
                 'JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

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
const initTracking = async () => {
    if (!loadSession()) {
        const tbody = document.querySelector('#tableTrackingList tbody');
        if (tbody) tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;padding:30px;color:#e74c3c;">
            <i class="fas fa-lock"></i> No se encontró sesión de empresa.</td></tr>`;
        return;
    }
    await renderTrackingList();
};

// ── LIST  (años creados en budget_years) ──────────────────────────────────────
window.renderTrackingList = async () => {
    const tbody = document.querySelector('#tableTrackingList tbody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;padding:20px;">
        <i class="fas fa-spinner fa-spin"></i> Cargando...</td></tr>`;

    try {
        const resp = await fetch(`${API}?idEmpresa=${idEmpresa}`);
        const list = await resp.json();

        if (!Array.isArray(list) || list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="2" class="empty-state">
                No hay presupuestos registrados. Cree uno en el módulo de Presupuesto.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(item => `
            <tr>
                <td style="text-align:center;">
                    <button class="btn-view-premium" title="Ver Seguimiento" onclick="viewTracking(${item.idBudget}, ${item.year})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
                <td>${item.year}</td>
            </tr>`).join('');

    } catch (err) {
        console.error('Error cargando años:', err);
        tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;padding:20px;color:#e74c3c;">
            <i class="fas fa-exclamation-triangle"></i> Error al cargar los presupuestos.</td></tr>`;
    }
};

// ── VIEW TRACKING DETAIL ──────────────────────────────────────────────────────
window.viewTracking = async (idBudget, year) => {
    currentBudgetId = idBudget;
    currentYear     = year;

    // Switch view
    document.getElementById('trackingListView').style.display   = 'none';
    document.getElementById('trackingDetailView').style.display = 'block';
    document.getElementById('trackingDetailTitle').innerText    = `SEGUIMIENTO DE PRESUPUESTO ${year}`;

    // Load 12-month data from API
    await loadTrackingData();
};

const loadTrackingData = async () => {
    const tbody = document.getElementById('trackingGridBody');
    tbody.innerHTML = `<tr><td colspan="13" style="text-align:center;padding:20px;">
        <i class="fas fa-spinner fa-spin"></i> Cargando...</td></tr>`;

    try {
        const resp = await fetch(`${API}?idBudget=${currentBudgetId}`);
        const data = await resp.json();

        if (!data || !data.months) {
            tbody.innerHTML = `<tr><td colspan="13" style="text-align:center;color:#e74c3c;">
                Error al cargar el seguimiento.</td></tr>`;
            return;
        }

        currentMonthsData = data.months; // 12 objects: { month, budget, executed }
        renderGrid();

    } catch (err) {
        console.error('Error cargando tracking:', err);
        tbody.innerHTML = `<tr><td colspan="13" style="text-align:center;color:#e74c3c;">
            <i class="fas fa-exclamation-triangle"></i> Error de conexión.</td></tr>`;
    }
};

// ── RENDER GRID ───────────────────────────────────────────────────────────────
const renderGrid = () => {
    const tbody = document.getElementById('trackingGridBody');

    let rowBudget   = `<tr><td style="font-weight:bold;text-align:left;">PRESUPUESTO</td>`;
    let rowExecuted = `<tr><td style="font-weight:bold;text-align:left;">EJECUTADO</td>`;
    let rowPercent  = `<tr><td style="font-weight:bold;text-align:left;">PORCENTAJE</td>`;

    for (let i = 0; i < 12; i++) {
        const d       = currentMonthsData[i] || { budget: 0, executed: 0 };
        const bVal    = parseFloat(d.budget)   || 0;
        const eVal    = parseFloat(d.executed) || 0;
        const percent = bVal > 0 ? ((eVal / bVal) * 100).toFixed(1) : '0';

        rowBudget   += `<td><input type="number" class="tracking-input input-budget"
                            data-index="${i}" value="${bVal}"
                            oninput="calculateTracking(${i})"></td>`;
        rowExecuted += `<td><input type="number" class="tracking-input input-executed"
                            data-index="${i}" value="${eVal}"
                            oninput="calculateTracking(${i})"></td>`;
        rowPercent  += `<td class="tracking-percent" id="percent_${i}">${percent}%</td>`;
    }

    rowBudget   += '</tr>';
    rowExecuted += '</tr>';
    rowPercent  += '</tr>';

    tbody.innerHTML = rowBudget + rowExecuted + rowPercent;
};

// ── CALCULATE (live) ──────────────────────────────────────────────────────────
window.calculateTracking = (index) => {
    const bInputs = document.querySelectorAll('.input-budget');
    const eInputs = document.querySelectorAll('.input-executed');

    const bVal    = parseFloat(bInputs[index].value) || 0;
    const eVal    = parseFloat(eInputs[index].value) || 0;
    const percent = bVal > 0 ? ((eVal / bVal) * 100).toFixed(1) : '0';

    document.getElementById(`percent_${index}`).innerText = `${percent}%`;

    // Sync to memory
    if (currentMonthsData[index]) {
        currentMonthsData[index].budget   = bVal;
        currentMonthsData[index].executed = eVal;
    }
};

// ── SAVE ──────────────────────────────────────────────────────────────────────
window.saveTracking = async () => {
    if (!currentBudgetId) return;

    // Collect current values from inputs
    const bInputs = document.querySelectorAll('.input-budget');
    const eInputs = document.querySelectorAll('.input-executed');

    const monthsPayload = [];
    for (let i = 0; i < 12; i++) {
        monthsPayload.push({
            month:    i + 1,
            budget:   parseFloat(bInputs[i]?.value) || 0,
            executed: parseFloat(eInputs[i]?.value) || 0,
        });
    }

    try {
        const resp = await fetch(`${API}?action=saveTracking`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ token, idBudget: currentBudgetId, months: monthsPayload }),
        });
        const data = await resp.json();

        if (data.status !== 'ok') {
            Swal.fire('Error', data.result?.error_message || 'No se pudo guardar.', 'error');
            return;
        }

        // Update memory
        currentMonthsData = monthsPayload.map(m => ({
            month:    m.month,
            budget:   m.budget,
            executed: m.executed,
        }));

        Swal.fire({ icon: 'success', title: 'Guardado', text: 'Seguimiento guardado correctamente.', timer: 1600, showConfirmButton: false });

    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Error de conexión.', 'error');
    }
};

// ── HIDE DETAIL ───────────────────────────────────────────────────────────────
window.hideDetailView = () => {
    document.getElementById('trackingDetailView').style.display = 'none';
    document.getElementById('trackingListView').style.display   = 'block';
    currentBudgetId   = null;
    currentYear       = null;
    currentMonthsData = [];
};

// ── GRAPH ─────────────────────────────────────────────────────────────────────
window.showGraphView = () => {
    document.getElementById('trackingDetailView').style.display = 'none';
    document.getElementById('trackingGraphView').style.display  = 'block';
    renderChart();
};

window.hideGraphView = () => {
    document.getElementById('trackingGraphView').style.display  = 'none';
    document.getElementById('trackingDetailView').style.display = 'block';
};

window.renderChart = () => {
    if (!currentMonthsData.length) return;

    const ctx = document.getElementById('trackingChart').getContext('2d');

    const percentages = currentMonthsData.map(d => {
        const b = parseFloat(d.budget)   || 0;
        const e = parseFloat(d.executed) || 0;
        return b > 0 ? parseFloat(((e / b) * 100).toFixed(1)) : 0;
    });

    if (chartInstance) {
        chartInstance.destroy();
    }

    if (typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: '% Cumplimiento',
                data: percentages,
                backgroundColor: 'rgba(230, 126, 34, 0.7)',
                borderColor:     'rgba(230, 126, 34, 1)',
                borderWidth: 1,
                datalabels: {
                    color:  '#333',
                    anchor: 'end',
                    align:  'top',
                    offset: 4,
                    font:   { weight: 'bold' },
                    formatter: (v) => v + '%',
                },
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 30 } },
            scales: { y: { beginAtZero: true, max: 120 } },
            plugins: {
                legend: { position: 'top' },
                title:  { display: true, text: `Cumplimiento Presupuestal ${currentYear}` },
                datalabels: { display: true },
            },
        },
    });
};

window.printGraph = () => {
    const canvas = document.getElementById('trackingChart');
    const win    = window.open('', '_blank');

    win.document.write(`
        <html>
            <head>
                <title>Gráfica Cumplimiento ${currentYear}</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                    img  { max-width: 100%; border: 1px solid #ddd; }
                    h2   { margin-bottom: 20px; color: #333; }
                </style>
            </head>
            <body>
                <h2>Gráfica de Cumplimiento Presupuestal ${currentYear}</h2>
                <img src="${canvas.toDataURL()}" />
                <script>setTimeout(() => { window.print(); }, 500);<\/script>
            </body>
        </html>
    `);
    win.document.close();
};

// ── Init ──────────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
} else {
    initTracking();
}
