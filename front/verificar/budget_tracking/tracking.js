// Mock Data for Tracking List
const trackingYears = [
    { id: 1, year: 2024 },
    { id: 2, year: 2025 }
];

// Mock Data for Tracking Detail (Months 0-11)
// Structure: year -> { budget: [12], executed: [12] }
let trackingData = {
    2024: {
        budget: [1000000, 1000000, 1000000, 1000000, 1000000, 1200000, 1000000, 1000000, 1000000, 1000000, 1000000, 1500000],
        executed: [950000, 980000, 1000000, 850000, 1100000, 1150000, 900000, 0, 0, 0, 0, 0]
    },
    2025: {
        budget: new Array(12).fill(0),
        executed: new Array(12).fill(0)
    }
};

let currentTrackingYear = null;
let chartInstance = null;

const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

const initTracking = () => {
    renderTrackingList();
};

window.renderTrackingList = () => {
    const tbody = document.querySelector('#tableTrackingList tbody');
    if (!tbody) return;

    let html = '';
    trackingYears.forEach(item => {
        html += `<tr>
            <td style="text-align: center;">
                <button class="btn-icon" title="Ver Seguimiento" onclick="viewTracking(${item.year})" style="cursor: pointer;">🔍</button>
            </td>
            <td>${item.year}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
};

window.viewTracking = (year) => {
    currentTrackingYear = year;
    
    // Switch View
    document.getElementById('trackingListView').style.display = 'none';
    document.getElementById('trackingDetailView').style.display = 'block';
    document.getElementById('trackingDetailTitle').innerText = `SEGUIMIENTO DE PRESUPUESTO ${year}`;
    
    renderGrid(year);
};

window.renderGrid = (year) => {
    const tbody = document.getElementById('trackingGridBody');
    const data = trackingData[year] || { budget: new Array(12).fill(0), executed: new Array(12).fill(0) };
    
    let rowBudget = `<tr><td style="font-weight: bold;">PRESUPUESTO</td>`;
    let rowExecuted = `<tr><td style="font-weight: bold;">EJECUTADO</td>`;
    let rowPercent = `<tr><td style="font-weight: bold;">PORCENTAJE</td>`;
    
    for(let i=0; i<12; i++) {
        const budgetVal = data.budget[i] || 0;
        const execVal = data.executed[i] || 0;
        const percent = budgetVal > 0 ? ((execVal / budgetVal) * 100).toFixed(1) : '0';
        
        rowBudget += `<td><input type="number" class="tracking-input input-budget" data-index="${i}" value="${budgetVal}" oninput="calculateTracking(${i})"></td>`;
        rowExecuted += `<td><input type="number" class="tracking-input input-executed" data-index="${i}" value="${execVal}" oninput="calculateTracking(${i})"></td>`;
        rowPercent += `<td class="tracking-percent" id="percent_${i}">${percent}%</td>`;
    }
    
    rowBudget += '</tr>';
    rowExecuted += '</tr>';
    rowPercent += '</tr>';
    
    tbody.innerHTML = rowBudget + rowExecuted + rowPercent;
};

window.calculateTracking = (index) => {
    const budgetInputs = document.querySelectorAll('.input-budget');
    const execInputs = document.querySelectorAll('.input-executed');
    
    const budgetVal = parseFloat(budgetInputs[index].value) || 0;
    const execVal = parseFloat(execInputs[index].value) || 0;
    
    const percent = budgetVal > 0 ? ((execVal / budgetVal) * 100).toFixed(1) : '0';
    document.getElementById(`percent_${index}`).innerText = `${percent}%`;
    
    // Update memory
    if(currentTrackingYear) {
         trackingData[currentTrackingYear].budget[index] = budgetVal;
         trackingData[currentTrackingYear].executed[index] = execVal;
    }
};

window.saveTracking = () => {
    // Data is already updated in memory via 'input' event, but here we would persist to DB
    Swal.fire('Guardado', 'Seguimiento guardado correctamente', 'success');
};

window.hideDetailView = () => {
    document.getElementById('trackingDetailView').style.display = 'none';
    document.getElementById('trackingListView').style.display = 'block';
    currentTrackingYear = null;
};

// Graph Logic
window.showGraphView = () => {
    document.getElementById('trackingDetailView').style.display = 'none';
    document.getElementById('trackingGraphView').style.display = 'block';
    renderChart();
};

window.hideGraphView = () => {
    document.getElementById('trackingGraphView').style.display = 'none';
    document.getElementById('trackingDetailView').style.display = 'block';
};

window.renderChart = () => {
    if (!currentTrackingYear) return;
    
    const ctx = document.getElementById('trackingChart').getContext('2d');
    const data = trackingData[currentTrackingYear];
    
    // Calculate percentages for chart
    const percentages = data.budget.map((b, i) => {
        const e = data.executed[i] || 0;
        return b > 0 ? ((e / b) * 100).toFixed(1) : 0;
    });

    if (chartInstance) {
        chartInstance.destroy();
    }

    // Register Plugin Safely
    if (typeof ChartDataLabels !== 'undefined') {
         // Avoid re-registering if logic allows, though Chart.register is idempotent usually
         Chart.register(ChartDataLabels);
    } else {
        console.warn('ChartDataLabels plugin not loaded');
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: '% Cumplimiento',
                data: percentages,
                backgroundColor: 'rgba(230, 126, 34, 0.7)', // Orange
                borderColor: 'rgba(230, 126, 34, 1)',
                borderWidth: 1,
                datalabels: {
                    color: '#333',
                    anchor: 'end',
                    align: 'top',
                    offset: 4,
                    font: {
                        weight: 'bold'
                    },
                    formatter: function(value) {
                        return value + '%';
                    }
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 30 // Add padding for labels
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 120 // Allow some overflow beyond 100%
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Cumplimiento Presupuestal ${currentTrackingYear}`
                },
                datalabels: {
                    display: true
                }
            }
        }
    });
};

window.printGraph = () => {
    const canvas = document.getElementById('trackingChart');
    const win = window.open('', '_blank');
    const year = currentTrackingYear || '';
    
    win.document.write(`
        <html>
            <head>
                <title>Gráfica Cumplimiento ${year}</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                    img { max-width: 100%; border: 1px solid #ddd; }
                    h2 { margin-bottom: 20px; color: #333; }
                </style>
            </head>
            <body>
                <h2>Gráfica de Cumplimiento Presupuestal ${year}</h2>
                <img src="${canvas.toDataURL()}" />
                <script>
                    setTimeout(() => { window.print(); }, 500); 
                </script>
            </body>
        </html>
    `);
    win.document.close();
};

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initTracking);
} else {
    initTracking();
}
