
// Mock Data - Enhanced for testing
let morbidityData = [
    { id: 1, idNum: '1098765432', name: 'Brayan Daniel Cardenas Quitian', startDate: '2025-02-25', endDate: '2025-03-16', days: 20, code: 'S626', type: 'Enfermedad comun' },
    { id: 2, idNum: '52487651', name: 'Maria Fernanda Lopez', startDate: '2025-01-10', endDate: '2025-01-12', days: 3, code: 'J00', type: 'Enfermedad comun' },
    { id: 3, idNum: '1012345678', name: 'Carlos Andres Perez', startDate: '2024-11-05', endDate: '2024-11-20', days: 16, code: 'S82', type: 'Accidente de trabajo' },
    { id: 4, idNum: '1023456789', name: 'Luisa Fernanda Gomez', startDate: '2024-12-01', endDate: '2025-03-20', days: 110, code: 'Z33', type: 'Enfermedad comun' }, // Changed to valid type
    { id: 5, idNum: '80123456', name: 'Jorge Eliecer Diaz', startDate: '2025-01-15', endDate: '2025-01-22', days: 8, code: 'Z35', type: 'Enfermedad laboral' },
    { id: 6, idNum: '52987654', name: 'Ana Maria Rodriguez', startDate: '2025-02-01', endDate: '2025-02-05', days: 5, code: 'Z63', type: 'Enfermedad comun' },
    { id: 7, idNum: '79654321', name: 'Pedro Pablo Ramirez', startDate: '2025-02-10', endDate: '2025-02-12', days: 3, code: 'Z59', type: 'Enfermedad laboral' },
    { id: 8, idNum: '1034567890', name: 'Sofia Vergara', startDate: '2025-01-05', endDate: '2025-01-05', days: 1, code: 'K08', type: 'Accidente de trabajo' },
    { id: 9, idNum: '1045678901', name: 'Diego Armando Maradona', startDate: '2025-03-01', endDate: '2025-03-10', days: 10, code: 'I10', type: 'Enfermedad comun' },
    { id: 10, idNum: '1056789012', name: 'Shakira Isabel Mebarak', startDate: '2025-02-14', endDate: '2025-02-28', days: 15, code: 'J10', type: 'Enfermedad comun' }
];

function initMorbidity() {
    renderMorbidityList();
    renderFirstAidList();
    initAutocomplete();
}

function renderMorbidityList(data = morbidityData) {
    const tbody = document.getElementById('morbidityTableBody');
    tbody.innerHTML = '';

    if(data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px;">No se encontraron registros</td></tr>';
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="display: flex; gap: 5px;">
                <button class="btn-edit-premium" onclick="editMorbidity(${item.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-premium" onclick="deleteMorbidity(${item.id})" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.idNum}</td>
            <td>${item.name}</td>
            <td>${item.startDate} - ${item.endDate}</td>
            <td style="text-align: center;">${item.days}</td>
            <td>${item.code}</td>
            <td>${item.type}</td>
        `;
        tbody.appendChild(row);
    });
}

function filterMorbidity() {
    const nameFilter = document.getElementById('filterMorbidityName').value.toLowerCase();
    const idFilter = document.getElementById('filterMorbidityId').value;

    const filtered = morbidityData.filter(item => {
        const matchesName = item.name.toLowerCase().includes(nameFilter);
        const matchesId = item.idNum.includes(idFilter);
        return matchesName && matchesId;
    });

    renderMorbidityList(filtered);
}

function showCreateMorbidity() {
    document.getElementById('morbidityListView').style.display = 'none';
    document.getElementById('morbidityCreateView').style.display = 'block';
    
    // Reset Form
    document.getElementById('morbidityForm').reset();
    document.getElementById('morbidityForm').dataset.editingId = ''; // Clear ID
}

function hideCreateMorbidity() {
    document.getElementById('morbidityCreateView').style.display = 'none';
    document.getElementById('morbidityListView').style.display = 'block';
}

function calculateDays() {
    const start = document.getElementById('morbidityStartDate').value;
    const end = document.getElementById('morbidityEndDate').value;

    if (start && end) {
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diffTime = d2 - d1; 
        if(diffTime < 0) {
             document.getElementById('morbidityDays').value = 0;
             return;
        }
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
        document.getElementById('morbidityDays').value = diffDays;
    }
}

function saveMorbidity() {
    const name = document.getElementById('morbidityEmployee').value;
    const type = document.getElementById('morbidityType').value;
    const start = document.getElementById('morbidityStartDate').value;
    const end = document.getElementById('morbidityEndDate').value;
    const days = document.getElementById('morbidityDays').value;
    const code = document.getElementById('morbidityCode').value;
    const cause = document.getElementById('morbidityCause').value;
    
    const editingId = document.getElementById('morbidityForm').dataset.editingId;

    if (!name || !start || !end) {
        Swal.fire('Error', 'Complete los campos obligatorios', 'error');
        return;
    }

    if (editingId) {
        // Update Existing
        const index = morbidityData.findIndex(i => i.id == editingId);
        if (index !== -1) {
            morbidityData[index] = {
                ...morbidityData[index],
                name, type, startDate: start, endDate: end, days, code, cause
            };
            Swal.fire('Actualizado', 'Registro actualizado exitosamente', 'success');
        }
    } else {
        // Create New
        const newRecord = {
            id: Date.now(),
            idNum: Math.floor(Math.random() * 1000000000).toString(), // Mock ID
            name: name,
            startDate: start,
            endDate: end,
            days: days,
            code: code || '---',
            type: type,
            cause: cause || ''
        };
        morbidityData.push(newRecord);
        Swal.fire('Guardado', 'Registro guardado exitosamente', 'success');
    }

    renderMorbidityList();
    hideCreateMorbidity();
}

function deleteMorbidity(id) {
    Swal.fire({
        title: '¿Eliminar registro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff6b00',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            morbidityData = morbidityData.filter(item => item.id !== id);
            renderMorbidityList(); 
            Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
        }
    });
}

// Graph Variables
let monthlyChartInstance = null;
let annualChartInstance = null;

function showMorbidityGraph() {
    document.getElementById('morbidityListView').style.display = 'none';
    document.getElementById('morbidityGraphView').style.display = 'block';
    
    // Set default month to current
    const date = new Date();
    document.getElementById('graphYear').value = date.getFullYear();
    document.getElementById('graphMonth').value = date.getMonth();
    
    generateMorbidityGraphs();
}

function hideMorbidityGraph() {
    document.getElementById('morbidityGraphView').style.display = 'none';
    document.getElementById('morbidityListView').style.display = 'block';
}

function generateMorbidityGraphs() {
    const year = parseInt(document.getElementById('graphYear').value);
    const month = parseInt(document.getElementById('graphMonth').value);
    
    // 1. Annual Data
    const annualData = morbidityData.filter(item => {
        const d = new Date(item.startDate);
        return d.getFullYear() === year;
    });

    // 2. Monthly Data
    const monthlyData = annualData.filter(item => {
        const m = parseInt(item.startDate.split('-')[1]) - 1;
        return m === month;
    });

    // 3. Process Stats
    // Monthly: Aggregate by Type (Single Dataset)
    const monthlyStats = calculateStats(monthlyData);
    
    // Annual: Aggregate by Month AND Type (Multi Dataset)
    const annualConfig = calculateAnnualDetailedStats(annualData);

    // 4. Render Charts
    renderMonthlyChart('monthlyChart', monthlyStats, `Mes: ${getMonthName(month)}`);
    renderAnnualChart('annualChart', annualConfig, `Comportamiento Anual: ${year}`);
}

function calculateAnnualDetailedStats(data) {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    // Initialize arrays
    const typeData = {
        'Enfermedad comun': new Array(12).fill(0),
        'Enfermedad laboral': new Array(12).fill(0),
        'Accidente de trabajo': new Array(12).fill(0)
    };

    data.forEach(item => {
        // Parse month from YYYY-MM-DD
        const monthIndex = parseInt(item.startDate.split('-')[1]) - 1;
        if (monthIndex >= 0 && monthIndex < 12 && typeData[item.type]) {
            typeData[item.type][monthIndex]++;
        }
    });

    return {
        labels: months,
        datasets: [
            {
                label: 'Enfermedad comun',
                data: typeData['Enfermedad comun'],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Enfermedad laboral',
                data: typeData['Enfermedad laboral'],
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            },
            {
                label: 'Accidente de trabajo',
                data: typeData['Accidente de trabajo'],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };
}

function calculateStats(data) {
    const stats = {
        'Enfermedad comun': 0,
        'Enfermedad laboral': 0,
        'Accidente de trabajo': 0
    };

    data.forEach(item => {
        if (stats[item.type] !== undefined) {
            stats[item.type]++; 
        }
    });
    return stats;
}

function renderMonthlyChart(canvasId, stats, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (monthlyChartInstance) monthlyChartInstance.destroy();

    monthlyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(stats),
            datasets: [{
                label: '# Casos',
                data: Object.values(stats),
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: label },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: Math.round,
                    font: { weight: 'bold' },
                    color: '#333'
                }
            },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

function renderAnnualChart(canvasId, configData, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (annualChartInstance) annualChartInstance.destroy();

    annualChartInstance = new Chart(ctx, {
        type: 'bar',
        data: configData, // { labels, datasets }
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: 'bottom' },
                title: { display: true, text: label },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => value > 0 ? value : '', // Provide value only if > 0
                    font: { weight: 'bold' },
                    color: '#333'
                }
            },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

function getMonthName(index) {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[index];
}

function editMorbidity(id) {
    const item = morbidityData.find(i => i.id === id);
    if(item) {
        showCreateMorbidity(); 
        
        document.getElementById('morbidityEmployee').value = item.name;
        document.getElementById('morbidityType').value = item.type;
        document.getElementById('morbidityStartDate').value = item.startDate;
        document.getElementById('morbidityEndDate').value = item.endDate;
        document.getElementById('morbidityDays').value = item.days;
        document.getElementById('morbidityCode').value = item.code;
        document.getElementById('morbidityCause').value = item.cause || '';
        
        document.getElementById('morbidityForm').dataset.editingId = item.id;
    }
}


// First Aid Logic
let firstAidData = [
    { id: 1, idNum: '1098765432', name: 'Brayan Daniel Cardenas Quitian', type: 'Curación', cause: 'Corte superficial en dedo', date: '2025-02-20' },
    { id: 2, idNum: '52487651', name: 'Maria Fernanda Lopez', type: 'Limpieza de herida', cause: 'Raspadura en brazo', date: '2025-01-15' },
    { id: 3, idNum: '1012345678', name: 'Carlos Andres Perez', type: 'Inmovilización', cause: 'Golpe en rodilla', date: '2024-12-10' }
];

function renderFirstAidList(data = firstAidData) {
    const tbody = document.getElementById('firstAidTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';

    if(data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No se encontraron registros</td></tr>';
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="display: flex; gap: 5px;">
                <button class="btn-edit-premium" onclick="editFirstAid(${item.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-premium" onclick="deleteFirstAid(${item.id})" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.idNum}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.cause}</td>
        `;
        tbody.appendChild(row);
    });
}

function filterFirstAid() {
    const nameFilter = document.getElementById('filterFirstAidName').value.toLowerCase();
    const idFilter = document.getElementById('filterFirstAidId').value;

    const filtered = firstAidData.filter(item => {
        const matchesName = item.name.toLowerCase().includes(nameFilter);
        const matchesId = item.idNum.includes(idFilter);
        return matchesName && matchesId;
    });

    renderFirstAidList(filtered);
}

function showCreateFirstAid() {
    document.getElementById('morbidityListView').style.display = 'none';
    document.getElementById('firstAidCreateView').style.display = 'block';
    
    // Reset Form
    document.getElementById('firstAidForm').reset();
    document.getElementById('firstAidForm').dataset.editingId = ''; 
    
    // Default Date
    document.getElementById('firstAidDate').valueAsDate = new Date();
}

function hideCreateFirstAid() {
    document.getElementById('firstAidCreateView').style.display = 'none';
    document.getElementById('morbidityListView').style.display = 'block';
}

function saveFirstAid() {
    const name = document.getElementById('firstAidEmployee').value;
    const type = document.getElementById('firstAidType').value;
    const cause = document.getElementById('firstAidCause').value;
    const date = document.getElementById('firstAidDate').value;
    
    const editingId = document.getElementById('firstAidForm').dataset.editingId;

    if (!name || !type || !cause) {
        Swal.fire('Error', 'Complete los campos obligatorios', 'error');
        return;
    }

    if (editingId) {
        // Update
        const index = firstAidData.findIndex(i => i.id == editingId);
        if (index !== -1) {
            firstAidData[index] = { ...firstAidData[index], name, type, cause, date };
            Swal.fire('Actualizado', 'Registro actualizado exitosamente', 'success');
        }
    } else {
        // Create
        const newRecord = {
            id: Date.now(),
            idNum: Math.floor(Math.random() * 1000000000).toString(), 
            name: name,
            type: type,
            cause: cause,
            date: date
        };
        firstAidData.push(newRecord);
        Swal.fire('Guardado', 'Registro guardado exitosamente', 'success');
    }

    renderFirstAidList();
    hideCreateFirstAid();
}

function editFirstAid(id) {
    const item = firstAidData.find(i => i.id === id);
    if(item) {
        showCreateFirstAid();
        document.getElementById('firstAidEmployee').value = item.name;
        document.getElementById('firstAidType').value = item.type;
        document.getElementById('firstAidCause').value = item.cause;
        document.getElementById('firstAidDate').value = item.date;
        document.getElementById('firstAidForm').dataset.editingId = item.id;
    }
}

// First Aid Graph Logic
let monthlyFirstAidChartInstance = null;
let annualFirstAidChartInstance = null;

function showFirstAidGraph() {
    document.getElementById('morbidityListView').style.display = 'none';
    document.getElementById('firstAidGraphView').style.display = 'block';
    
    const date = new Date();
    document.getElementById('graphFirstAidYear').value = date.getFullYear();
    document.getElementById('graphFirstAidMonth').value = date.getMonth();
    
    generateFirstAidGraphs();
}

function hideFirstAidGraph() {
    document.getElementById('firstAidGraphView').style.display = 'none';
    document.getElementById('morbidityListView').style.display = 'block';
}

function generateFirstAidGraphs() {
    const year = parseInt(document.getElementById('graphFirstAidYear').value);
    const month = parseInt(document.getElementById('graphFirstAidMonth').value);
    
    // 1. Annual Data
    const annualData = firstAidData.filter(item => {
        const d = new Date(item.date);
        return d.getFullYear() === year;
    });

    // 2. Monthly Data
    const monthlyData = annualData.filter(item => {
        // Fix: Javascript months are 0-11, input date is YYYY-MM-DD
        const m = parseInt(item.date.split('-')[1]) - 1;
        return m === month;
    });

    // 3. Stats
    const monthlyStats = calculateFirstAidStats(monthlyData);
    const annualConfig = calculateFirstAidAnnualStats(annualData);

    // 4. Render
    renderFirstAidMonthlyChart('monthlyFirstAidChart', monthlyStats, `Mes: ${getMonthName(month)}`);
    renderFirstAidAnnualChart('annualFirstAidChart', annualConfig, `Comportamiento Anual: ${year}`);
}

function calculateFirstAidStats(data) {
    return { 'Total': data.length };
}

function calculateFirstAidAnnualStats(data) {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const totalData = new Array(12).fill(0);

    data.forEach(item => {
        const monthIndex = parseInt(item.date.split('-')[1]) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            totalData[monthIndex]++;
        }
    });

    return {
        labels: months,
        datasets: [{
            label: 'Total Casos',
            data: totalData,
            backgroundColor: 'rgba(255, 159, 64, 0.6)', // Orange
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        }]
    };
}

// Reuse render functions but handle instance variables dynamically
// Modifying renderMonthlyChart/renderAnnualChart to accept instance name string or update global map?
// Current implementation uses global vars `monthlyChartInstance`.
// I'll update the previous render functions to handle generic instances or create copies.
// Actually, to avoid breaking existing code, I will create `renderFirstAidMonthlyChart` etc?
// No, I'll modify the existing `renderMonthlyChart` to take an optional `instanceKey`.
// But wait, `renderMonthlyChart` references `monthlyChartInstance` directly.
// I should refactor `renderMonthlyChart` to accept the instance reference... but I can't pass by reference easily for reassignment.
// I will just implement specific renderers for First Aid to be safe and quick.

function renderFirstAidMonthlyChart(canvasId, stats, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (monthlyFirstAidChartInstance) monthlyFirstAidChartInstance.destroy();

    monthlyFirstAidChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(stats),
            datasets: [{
                label: '# Casos',
                data: Object.values(stats),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: label },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: Math.round,
                    font: { weight: 'bold' },
                    color: '#333'
                }
            },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    }); 
}

function renderFirstAidAnnualChart(canvasId, configData, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (annualFirstAidChartInstance) annualFirstAidChartInstance.destroy();

    annualFirstAidChartInstance = new Chart(ctx, {
        type: 'bar',
        data: configData, 
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: 'bottom' },
                title: { display: true, text: label },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => value > 0 ? value : '',
                    font: { weight: 'bold' },
                    color: '#333'
                }
            },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

// Autocomplete Logic
const mockCauses = [
    'Gripa común', 'Infección respiratoria aguda', 'Migraña', 'Lumbago no especificado', 
    'Gastroenteritis', 'Fractura de radio', 'Stress laboral', 'Conjuntivitis', 
    'Esguince de tobillo', 'Otitis media', 'Gastritis crónica', 'Hipertensión arterial',
    'Diabetes Mellitus', 'Covid-19', 'Fatiga visual', 'Túnel del Carpo'
];

function initAutocomplete() {
    const input = document.getElementById('morbidityCause');
    const suggestionsBox = document.getElementById('causeSuggestions');

    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        suggestionsBox.innerHTML = '';
        suggestionsBox.style.display = 'none';

        if (!value) return;

        const matches = mockCauses.filter(cause => cause.toLowerCase().includes(value));

        if (matches.length > 0) {
            matches.forEach(match => {
                const li = document.createElement('li');
                li.textContent = match;
                li.onclick = function() {
                    input.value = match;
                    suggestionsBox.innerHTML = '';
                    suggestionsBox.style.display = 'none';
                };
                suggestionsBox.appendChild(li);
            });
            suggestionsBox.style.display = 'block';
        }
    });

    // Close on click outside
    document.addEventListener('click', function(e) {
        if (e.target !== input && e.target !== suggestionsBox) {
            suggestionsBox.style.display = 'none';
        }
    });
}

// Exports
window.initMorbidity = initMorbidity;
window.renderMorbidityList = renderMorbidityList;
window.filterMorbidity = filterMorbidity;
window.showCreateMorbidity = showCreateMorbidity;
window.hideCreateMorbidity = hideCreateMorbidity;
window.saveMorbidity = saveMorbidity;
window.calculateDays = calculateDays;
window.deleteMorbidity = deleteMorbidity;
window.showMorbidityGraph = showMorbidityGraph;
window.hideMorbidityGraph = hideMorbidityGraph;
window.generateMorbidityGraphs = generateMorbidityGraphs;
window.editMorbidity = editMorbidity;
window.initAutocomplete = initAutocomplete;
window.renderFirstAidList = renderFirstAidList;
window.filterFirstAid = filterFirstAid;
window.showCreateFirstAid = showCreateFirstAid;
window.hideCreateFirstAid = hideCreateFirstAid;
window.saveFirstAid = saveFirstAid;
window.deleteFirstAid = deleteFirstAid;
window.editFirstAid = editFirstAid;
window.showFirstAidGraph = showFirstAidGraph;
window.hideFirstAidGraph = hideFirstAidGraph;
window.generateFirstAidGraphs = generateFirstAidGraphs;
