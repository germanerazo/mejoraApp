// Mock Data for Legal Matrix
let legalData = [
    {
        id: 1,
        classification: 'S',
        norm: 'Decreto 1072',
        year: '2015',
        disposition: 'Ministerio de Trabajo',
        articles: 'Art. 2.2.4.6.1',
        description: 'Por medio del cual se expide el Decreto Único Reglamentario del Sector Trabajo',
        evidence: 'Matriz de Peligros, Plan de Trabajo',
        responsible: 'Lider SST',
        exists: 'SI',
        observation: 'Cumplimiento anual'
    },
    {
        id: 2,
        classification: 'H',
        norm: 'Ley 1562',
        year: '2012',
        disposition: 'Congreso de la República',
        articles: 'Art. 1',
        description: 'Por la cual se modifica el Sistema de Riesgos Laborales y se dictan otras disposiciones en materia de Salud Ocupacional',
        evidence: 'Afiliaciones ARL',
        responsible: 'Gerencia',
        exists: 'SI',
        observation: ''
    }
];

const initLegal = () => {
    renderLegalList();
};

window.renderLegalList = (data = legalData) => {
    const tbody = document.querySelector('#tableLegalList tbody');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" class="empty-state">No se encontraron normas registradas.</td></tr>`;
        return;
    }

    let html = '';
    data.forEach(item => {
        html += `<tr>
            <td class="col-action" style="display: flex; gap: 5px; justify-content: center;">
                <button class="btn-edit-premium" title="Editar" onclick="editLegal(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-premium" title="Eliminar" onclick="deleteLegal(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td class="col-id">${item.id}</td>
            <td>${item.classification}</td>
            <td class="col-norma">${item.norm}</td>
            <td>${item.year}</td>
            <td>${item.disposition}</td>
            <td>${item.articles}</td>
            <td class="col-desc">${item.description}</td>
            <td class="col-evidencia">${item.evidence}</td>
            <td>${item.responsible}</td>
            <td style="text-align: center;">${item.exists === 'SI' ? '<span class="badge-active">SI</span>' : '<span class="badge-inactive">NO</span>'}</td>
            <td>${item.observation}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
};

window.filterLegal = () => {
    const classFilter = document.getElementById('filterClassification').value.toLowerCase();
    const normFilter = document.getElementById('filterNorma').value.toLowerCase();

    const filtered = legalData.filter(item => {
        const matchClass = !classFilter || item.classification.toLowerCase().includes(classFilter);
        const matchNorm = !normFilter || item.norm.toLowerCase().includes(normFilter);
        return matchClass && matchNorm;
    });

    renderLegalList(filtered);
};

// Data Persistence
window.legalData = window.legalData || legalData; 

window.showCreateLegal = () => {
    document.getElementById('legalListView').style.display = 'none';
    document.getElementById('legalCreateView').style.display = 'block';
    document.getElementById('legalGraphView').style.display = 'none';
    document.getElementById('legalFormTitle').innerText = 'NUEVO REGISTRO MATRIZ LEGAL';
    
    // Reset Form
    document.getElementById('legalForm').reset();
    document.getElementById('legalId').value = '';
    // Set default date
    document.getElementById('fieldDate').value = new Date().toISOString().split('T')[0];
};

window.hideCreateLegal = () => {
    document.getElementById('legalCreateView').style.display = 'none';
    document.getElementById('legalListView').style.display = 'block';
};

window.saveLegal = () => {
    const id = document.getElementById('legalId').value;
    const classification = document.getElementById('fieldClassification').value;
    const norm = document.getElementById('fieldNorm').value;
    
    if (!norm) {
        Swal.fire('Error', 'El campo Norma es obligatorio', 'error');
        return;
    }

    const newItem = {
        id: id ? parseInt(id) : (legalData.length > 0 ? Math.max(...legalData.map(i => i.id)) + 1 : 1),
        classification: classification,
        norm: norm,
        year: document.getElementById('fieldYear').value,
        disposition: document.getElementById('fieldDisposition').value,
        articles: document.getElementById('fieldArticles').value,
        description: document.getElementById('fieldDescription').value,
        evidence: document.getElementById('fieldEvidence').value,
        responsible: document.getElementById('fieldResponsible').value,
        exists: document.getElementById('fieldExists').value,
        observation: document.getElementById('fieldObservation').value,
    };

    if (id) {
        const index = legalData.findIndex(i => i.id == id);
        if (index !== -1) legalData[index] = newItem;
    } else {
        legalData.push(newItem);
    }

    renderLegalList();
    Swal.fire('Guardado', 'Registro guardado correctamente', 'success');
    hideCreateLegal();
};

window.editLegal = (id) => {
    const item = legalData.find(i => i.id === id);
    if (!item) return;

    showCreateLegal();
    document.getElementById('legalFormTitle').innerText = 'EDITAR REGISTRO MATRIZ LEGAL';
    
    document.getElementById('legalId').value = item.id;
    document.getElementById('fieldClassification').value = item.classification;
    document.getElementById('fieldNorm').value = item.norm;
    document.getElementById('fieldYear').value = item.year;
    document.getElementById('fieldDisposition').value = item.disposition;
    document.getElementById('fieldArticles').value = item.articles;
    document.getElementById('fieldDescription').value = item.description;
    document.getElementById('fieldEvidence').value = item.evidence;
    document.getElementById('fieldResponsible').value = item.responsible;
    document.getElementById('fieldExists').value = item.exists;
    document.getElementById('fieldObservation').value = item.observation;
};

window.deleteLegal = (id) => {
    Swal.fire({
        title: '¿Eliminar registro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            legalData = legalData.filter(i => i.id !== id);
            renderLegalList();
            Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
        }
    });
};

window.deleteSelected = () => {
    Swal.fire({
        title: '¿Eliminar registros?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, eliminar'
    });
};

// Graph Logic
let legalChartInstance = null;

window.showLegalGraph = () => {
    document.getElementById('legalListView').style.display = 'none';
    document.getElementById('legalCreateView').style.display = 'none';
    document.getElementById('legalGraphView').style.display = 'block';

    renderLegalChart();
};

window.hideLegalGraph = () => {
    document.getElementById('legalGraphView').style.display = 'none';
    document.getElementById('legalListView').style.display = 'block';
};

window.renderLegalChart = () => {
    const ctx = document.getElementById('legalChart').getContext('2d');
    
    // Count Data
    let siCount = 0;
    let noCount = 0;
    
    legalData.forEach(item => {
        if (item.exists === 'SI') siCount++;
        else if (item.exists === 'NO') noCount++;
    });
    
    const total = siCount + noCount;
    const percSi = total ? Math.round((siCount / total) * 100) : 0;
    const percNo = total ? Math.round((noCount / total) * 100) : 0;
    
    // Update Stats Display
    document.getElementById('statSi').innerText = siCount;
    document.getElementById('percSi').innerText = percSi + '%';
    document.getElementById('statNo').innerText = noCount;
    document.getElementById('percNo').innerText = percNo + '%';
    document.getElementById('statTotal').innerText = total;

    // Destroy existing chart if any
    if (legalChartInstance) {
        legalChartInstance.destroy();
    }
    
    // Register Plugin Safely
    if (typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
    }

    legalChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['SI', 'NO'],
            datasets: [{
                data: [siCount, noCount],
                backgroundColor: [
                    '#2ecc71', // SI - Green
                    '#e74c3c'  // NO - Red
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribución Existe Actividad'
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 16
                    },
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = sum > 0 ? (value * 100 / sum).toFixed(0) + "%" : "0%";
                        return percentage;
                    }
                }
            }
        }
    });
};

window.printLegalGraph = () => {
    const canvas = document.getElementById('legalChart');
    const win = window.open('', 'Imprimir Gráfica', 'height=600,width=800');
    win.document.write('<html><head><title>Imprimir Gráfica Legal</title>');
    // Simple styles for print
    win.document.write('<style>body{font-family: sans-serif; text-align: center; padding: 20px;} h2 {margin-bottom: 20px;} img { max-width: 100%; height: auto; }</style>');
    win.document.write('</head><body>');
    win.document.write('<h2>Gráfica de Cumplimiento Legal (Existe Actividad)</h2>');
    
    // Add Stats for Print
    const statsHtml = document.getElementById('legalStats').outerHTML;
    win.document.write('<div style="margin-bottom: 30px; display: inline-block; text-align: left;">' + statsHtml + '</div><br>');
    
    win.document.write('<img src="' + canvas.toDataURL() + '" />');
    win.document.write('</body></html>');
    win.document.close();
    win.print(); 
};

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initLegal);
} else {
    initLegal();
}
