// Mock Data for Risk Matrix

// Section 1: Hazards
const hazardData = [
    { name: 'Biomecánico', noAceptable: 2, conControl: 5, mejorable: 1, aceptable: 0 },
    { name: 'Físico', noAceptable: 0, conControl: 3, mejorable: 2, aceptable: 1 },
    { name: 'Psicosocial', noAceptable: 1, conControl: 4, mejorable: 0, aceptable: 0 },
    { name: 'Condiciones de Seguridad', noAceptable: 3, conControl: 2, mejorable: 1, aceptable: 0 }
];

// Section 2: Processes
const processData = [
    { name: 'Gestión Administrativa', noAceptable: 0, conControl: 2, mejorable: 1, aceptable: 5 },
    { name: 'Operaciones', noAceptable: 4, conControl: 6, mejorable: 2, aceptable: 1 },
    { name: 'Mantenimiento', noAceptable: 1, conControl: 3, mejorable: 0, aceptable: 2 }
];

// Section 3: Prevention Measures
const preventionData = [
    'Capacitación en manejo de cargas (Biomecánico)',
    'Inspección de puestos de trabajo (Físico - Ruido)',
    'Batería de Riesgo Psicosocial (Anual)',
    'Mantenimiento preventivo de maquinaria',
    'Señalización de áreas operativas',
    'Entrega y reposición de EPP'
];

const initRisk = () => {
    renderHazards();
    renderProcesses();
    renderPrevention();
};

const renderHazards = () => {
    const tbody = document.querySelector('#tableRiskHazards tbody');
    if (!tbody) return;
    
    let html = '';
    hazardData.forEach(item => {
        html += `<tr>
            <td style="text-align: left; font-weight: 500;">${item.name}</td>
            <td class="${item.noAceptable >= 0 ? 'bg-red' : ''}">${item.noAceptable}</td>
            <td class="${item.conControl >= 0 ? 'bg-orange' : ''}">${item.conControl}</td>
            <td class="${item.mejorable >= 0 ? 'bg-yellow' : ''}">${item.mejorable}</td>
            <td class="${item.aceptable >= 0 ? 'bg-green' : ''}">${item.aceptable}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
};

const renderProcesses = () => {
    const tbody = document.querySelector('#tableRiskProcesses tbody');
    if (!tbody) return;

    let html = '';
    processData.forEach(item => {
        html += `<tr>
            <td style="text-align: left; font-weight: 500;">${item.name}</td>
            <td class="${item.noAceptable >= 0 ? 'bg-red' : ''}">${item.noAceptable}</td>
            <td class="${item.conControl >= 0 ? 'bg-orange' : ''}">${item.conControl}</td>
            <td class="${item.mejorable >= 0 ? 'bg-yellow' : ''}">${item.mejorable}</td>
            <td class="${item.aceptable >= 0 ? 'bg-green' : ''}">${item.aceptable}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
};

const renderPrevention = () => {
    const tbody = document.querySelector('#tableRiskPrevention tbody');
    if (!tbody) return;

    let html = '';
    preventionData.forEach(item => {
        html += `<tr><td style="text-align: left;">${item}</td></tr>`;
    });
    tbody.innerHTML = html;
};

window.printRisk = () => {
    window.print();
};

let riskChartInstance = null;

window.showRiskGraph = () => {
    document.getElementById('riskListView').style.display = 'none';
    document.getElementById('riskGraphView').style.display = 'block';
    
    renderRiskChart();
};

window.hideRiskGraph = () => {
    document.getElementById('riskGraphView').style.display = 'none';
    document.getElementById('riskListView').style.display = 'block';
};

window.renderRiskChart = () => {
    const ctx = document.getElementById('riskChart').getContext('2d');
    
    // Aggregating Data
    let totalNoAceptable = 0;
    let totalConControl = 0;
    let totalMejorable = 0;
    let totalAceptable = 0;

    // Sum from Hazards
    hazardData.forEach(item => {
        totalNoAceptable += item.noAceptable;
        totalConControl += item.conControl;
        totalMejorable += item.mejorable;
        totalAceptable += item.aceptable;
    });

    // Sum from Processes
    processData.forEach(item => {
        totalNoAceptable += item.noAceptable;
        totalConControl += item.conControl;
        totalMejorable += item.mejorable;
        totalAceptable += item.aceptable;
    });

    // Destroy existing chart
    if (riskChartInstance) {
        riskChartInstance.destroy();
    }

    // Register Plugin Safely
    if (typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
    }

    riskChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['No Aceptable', 'Control Específico', 'Mejorable', 'Aceptable'],
            datasets: [{
                label: 'Cantidad de Riesgos',
                data: [totalNoAceptable, totalConControl, totalMejorable, totalAceptable],
                backgroundColor: [
                    '#ffcccc', // Red
                    '#ffe0b2', // Orange
                    '#fff3cd', // Yellow
                    '#d4edda'  // Green
                ],
                borderColor: [
                    '#c0392b',
                    '#e67e22',
                    '#d35400',
                    '#155724'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Hide legend as bars are self-explanatory by X-axis
                },
                title: {
                    display: true,
                    text: 'Consolidado de Riesgos y Peligros',
                    font: {
                        size: 18
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: '#333',
                    font: {
                        weight: 'bold'
                    }
                }
            }
        }
    });
};

window.printRiskGraph = () => {
    const canvas = document.getElementById('riskChart');
    const win = window.open('', 'Imprimir Gráfica de Riesgos', 'height=600,width=800');
    win.document.write('<html><head><title>Imprimir Gráfica de Riesgos</title>');
    win.document.write('<style>body{font-family: sans-serif; text-align: center; padding: 20px;} h2 {margin-bottom: 20px;} img { max-width: 100%; height: auto; }</style>');
    win.document.write('</head><body>');
    win.document.write('<h2>Gráfica de Riesgos y Peligros</h2>');
    win.document.write('<img src="' + canvas.toDataURL() + '" />');
    win.document.write('</body></html>');
    win.document.close();
    win.print(); 
};

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initRisk);
} else {
    initRisk();
}
