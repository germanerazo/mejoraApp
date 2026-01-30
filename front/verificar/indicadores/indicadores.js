let chartInstance = null;

/**
 * Recolecta los datos del formulario y genera la gráfica de líneas
 */
function generarGrafica() {
    const headerCells = document.querySelectorAll('#results-header th');
    const resultInputs = document.querySelectorAll('.input-resultado');
    const container = document.getElementById('container-grafica');
    
    if (resultInputs.length === 0) return;

    container.style.display = 'block';
    
    // 1. Obtener Etiquetas (Periodos)
    const labels = Array.from(headerCells).map(th => th.innerText);
    
    // 2. Obtener Resultados
    const dataResultados = Array.from(resultInputs).map(input => parseFloat(input.value) || 0);
    
    // 3. Obtener Límites (Limpiar símbolos como % o > <)
    const limpiarValor = (val) => {
        if (!val) return 0;
        return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
    };
    const metaVal = limpiarValor(document.getElementById('det-esperado').value);
    const criticoVal = limpiarValor(document.getElementById('det-critico').value);

    // Crear arrays constantes para los límites (líneas horizontales)
    const dataMeta = new Array(labels.length).fill(metaVal);
    const dataCritico = new Array(labels.length).fill(criticoVal);

    // 4. Configurar Chart.js
    const ctx = document.getElementById('canvasIndicador').getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Resultado',
                    data: dataResultados,
                    borderColor: '#f7941d', // Naranja SIGA
                    backgroundColor: 'rgba(247, 148, 29, 0.1)',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#f7941d'
                },
                {
                    label: 'Límite Esperado',
                    data: dataMeta,
                    borderColor: '#2e7d32', // Verde
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Límite Crítico',
                    data: dataCritico,
                    borderColor: '#c62828', // Rojo
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Valor / Porcentaje'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });

    // Hacer scroll hacia la gráfica
    container.scrollIntoView({ behavior: 'smooth' });
}

const mockIndicadores = [
    {
        id: 1,
        nombre: "Frecuencia de Accidentalidad",
        objetivo: "Medir la frecuencia con la que ocurren accidentes de trabajo.",
        responsable: "Lider SST",
        dirigido: "Alta Gerencia",
        fuente: "Reportes AT",
        formula: "(N° AT / N° Trabajadores) * 100",
        periodicidad: "Mensual",
        tipo: "Resultado",
        tipoLimite: "Menor o Igual",
        esperado: "<= 5%",
        critico: "> 10%"
    },
    {
        id: 2,
        nombre: "Eficiencia de Capacitación",
        objetivo: "Evaluar el impacto de las capacitaciones bimestrales.",
        responsable: "Coordinador HSEQ",
        dirigido: "Copasst",
        fuente: "Evaluaciones",
        formula: "(Evaluaciones aprobadas / Total evaluaciones) * 100",
        periodicidad: "Bimestral",
        tipo: "Proceso",
        tipoLimite: "Mayor o Igual",
        esperado: ">= 90%",
        critico: "< 80%"
    },
    {
        id: 3,
        nombre: "Cumplimiento Trimestral de Inspecciones",
        objetivo: "Asegurar que las inspecciones se realicen cada trimestre.",
        responsable: "Inspector de Seguridad",
        dirigido: "Director Técnico",
        fuente: "Checklist",
        formula: "(Inspecciones realizadas / Inspecciones programadas) * 100",
        periodicidad: "Trimestral",
        tipo: "Estructura",
        tipoLimite: "Igual",
        esperado: "100%",
        critico: "< 100%"
    },
    {
        id: 4,
        nombre: "Severidad de Accidentalidad Semestral",
        objetivo: "Medir los días perdidos por accidentes cada semestre.",
        responsable: "Lider SST",
        dirigido: "Gerencia General",
        fuente: "Incapacidades",
        formula: "(Días perdidos / N° Horas trabajadas) * 240.000",
        periodicidad: "Semestral",
        tipo: "Resultado",
        tipoLimite: "Menor o Igual",
        esperado: "0",
        critico: "> 0"
    },
    {
        id: 5,
        nombre: "Cumplimiento del Sistema de Gestión (Anual)",
        objetivo: "Verificar el avance anual del SG-SST.",
        responsable: "Gerencia",
        dirigido: "Junta Directiva",
        fuente: "Auditoría",
        formula: "Suma de puntaje estándar / Puntaje Total",
        periodicidad: "Anual",
        tipo: "Estructura",
        tipoLimite: "Mayor o Igual",
        esperado: ">= 95%",
        critico: "< 85%"
    }
];

function mostrarIndicadores(anio) {
    document.getElementById('view-periodos').style.display = 'none';
    document.getElementById('view-indicadores').style.display = 'block';
    document.getElementById('titulo-indicadores').innerHTML = `<i class="fas fa-chart-line"></i> Listado de Indicadores - Periodo ${anio}`;
    
    cargarDatosSimulados();
}

function mostrarPeriodos() {
    document.getElementById('view-periodos').style.display = 'block';
    document.getElementById('view-indicadores').style.display = 'none';
}

function cargarDatosSimulados() {
    const tbody = document.getElementById('indicadoresBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    mockIndicadores.forEach(ind => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ind.nombre}</td>
            <td>${ind.formula}</td>
            <td>${ind.responsable}</td>
            <td><span class="badge-limit limit-expected">${ind.esperado}</span></td>
            <td><span class="badge-limit limit-critical">${ind.critico}</span></td>
            <td>${ind.fuente}</td>
            <td>${ind.periodicidad}</td>
            <td>${ind.tipo}</td>
            <td>${ind.tipoLimite}</td>
            <td>${ind.dirigido}</td>
            <td style="text-align:center;">
                <button class="btn-view-premium" onclick="verDetalleIndicador(${ind.id})" title="Ver Gráfica">
                    <i class="fas fa-chart-line"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function verDetalleIndicador(id) {
    const data = mockIndicadores.find(i => i.id === id);
    if (!data) return;

    document.getElementById('view-indicadores').style.display = 'none';
    document.getElementById('view-detalle-indicador').style.display = 'block';
    document.getElementById('container-grafica').style.display = 'none';
    
    // Poblar campos de metadatos
    document.getElementById('det-nombre').value = data.nombre;
    document.getElementById('det-objetivo').value = data.objetivo;
    document.getElementById('det-responsable').value = data.responsable;
    document.getElementById('det-dirigido').value = data.dirigido;
    document.getElementById('det-fuente').value = data.fuente;
    document.getElementById('det-formula').value = data.formula;
    document.getElementById('det-periodicidad').value = data.periodicidad;
    document.getElementById('det-tipo').value = data.tipo;
    document.getElementById('det-esperado').value = data.esperado;
    document.getElementById('det-critico').value = data.critico;

    // Determinar periodos según periodicidad
    let periodos = [];
    switch (data.periodicidad) {
        case "Mensual":
            periodos = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
            break;
        case "Bimestral":
            periodos = ["Ene-Feb", "Mar-Abr", "May-Jun", "Jul-Ago", "Sep-Oct", "Nov-Dic"];
            break;
        case "Trimestral":
            periodos = ["Ene-Mar", "Abr-Jun", "Jul-Sep", "Oct-Dic"];
            break;
        case "Semestral":
            periodos = ["Ene-Jun", "Jul-Dic"];
            break;
        case "Anual":
            periodos = ["Ene-Dic"];
            break;
        default:
            periodos = ["Total"];
    }

    const header = document.getElementById('results-header');
    const body = document.getElementById('results-body');

    header.innerHTML = periodos.map(p => `<th>${p}</th>`).join('');
    
    // Generar fila de inputs
    let rowHtml = '<tr>';
    periodos.forEach(() => {
        rowHtml += `<td><input type="number" step="0.01" value="${(Math.random() * 90 + 5).toFixed(2)}" class="input-resultado"></td>`;
    });
    rowHtml += '</tr>';
    body.innerHTML = rowHtml;
}

function volverAListado() {
    document.getElementById('view-detalle-indicador').style.display = 'none';
    document.getElementById('view-indicadores').style.display = 'block';
}

function guardarCambiosIndicador() {
    alert("¡Cambios guardados exitosamente!");
    volverAListado();
}
