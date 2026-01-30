// Mock Employees Data
let employeesData = [
    { 
        id: 1, 
        idNum: '1098765432', 
        name: 'Carlos Perez', 
        position: 'Operario', 
        date: '2024-01-10'
    },
    { 
        id: 2, 
        idNum: '72345678', 
        name: 'Maria Rodriguez', 
        position: 'Analista', 
        date: '2023-08-20'
    },
    { 
        id: 3, 
        idNum: '987654321', 
        name: 'Juan Gomez', 
        position: 'Supervisor', 
        date: '2022-03-15'
    },
    { 
        id: 4, 
        idNum: '55667788', 
        name: 'Ana Martinez', 
        position: 'Asistente', 
        date: '2024-02-01'
    },
    { 
        id: 5, 
        idNum: '11223344', 
        name: 'Pedro Sanchez', 
        position: 'Gerente', 
        date: '2020-01-01'
    }
];

function initExams() {
    renderEmployeesList();
}

function renderEmployeesList(data = employeesData) {
    const tbody = document.querySelector('#tableExams tbody');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #999;">No se encontraron empleados.</td></tr>`;
        return;
    }

    let html = '';
    data.forEach(item => {
        html += `<tr>
            <td>${item.idNum}</td>
            <td><div style="font-weight: bold;">${item.name}</div></td>
            <td>${item.position}</td>
            <td>${item.date}</td>
            <td style="text-align: center;">
                <div style="display: flex; gap: 8px; justify-content: center;">
                    <button class="btn-view-premium" onclick="generateExam(${item.id}, 'Ingreso')" title="Examen de Ingreso" style="background-color: #17a2b8; color: white;">
                        <i class="fas fa-sign-in-alt"></i>
                    </button>
                    <button class="btn-view-premium" onclick="generateExam(${item.id}, 'Periodico')" title="Examen Periódico" style="background-color: #ffc107; color: #000;">
                        <i class="fas fa-history"></i>
                    </button>
                    <button class="btn-delete-premium" onclick="generateExam(${item.id}, 'Retiro')" title="Examen de Retiro">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

function filterEmployees() {
    const term = document.getElementById('filterSearch').value.toLowerCase();
    
    const filtered = employeesData.filter(item => {
        return item.name.toLowerCase().includes(term) || item.idNum.includes(term);
    });

    renderEmployeesList(filtered);
}

function generateExam(id, type) {
    const employee = employeesData.find(e => e.id === id);
    if (!employee) return;

    // Show Create View pre-filled
    document.getElementById('examsListView').style.display = 'none';
    document.getElementById('examsListHeader').style.display = 'none';
    document.getElementById('examsCreateView').style.display = 'block';
    
    // Reset and Pre-fill
    document.getElementById('examsForm').reset();
    document.getElementById('examsForm').dataset.editingId = ''; // Not editing an existing exam, creating new
    
    document.getElementById('fieldEmployeeName').value = employee.name;
    document.getElementById('fieldType').value = type;
    document.getElementById('fieldPosition').value = employee.position; // Pre-fill Position
    document.getElementById('fieldDate').value = new Date().toISOString().split('T')[0]; // Today
    
    // Reset IPS Defaults (if needed, but they are in HTML value attribute)
    document.getElementById('fieldEntity').value = 'IPS SALUD OCUPACIONAL';
    document.getElementById('fieldEntityPhone').value = '601-1234567';
    document.getElementById('fieldEntityAddress').value = 'Calle 100 # 15-20';
}

function hideCreateExam() {
    document.getElementById('examsCreateView').style.display = 'none';
    document.getElementById('examsListHeader').style.display = 'block';
    document.getElementById('examsListView').style.display = 'block';
}

function generateDocument() {
    const date = document.getElementById('fieldDate').value;
    const employeeName = document.getElementById('fieldEmployeeName').value;
    const type = document.getElementById('fieldType').value;
    const position = document.getElementById('fieldPosition').value;
    const entity = document.getElementById('fieldEntity').value;
    const entityPhone = document.getElementById('fieldEntityPhone').value;
    const entityAddress = document.getElementById('fieldEntityAddress').value;
    
    if (!date || !entity || !type || !employeeName) {
        Swal.fire('Error', 'Complete la información requerida', 'error');
        return;
    }

    // Populate Print View
    document.getElementById('printDate').innerText = `Fecha: ${date}`;
    document.getElementById('printEntity').innerText = entity.toUpperCase();
    document.getElementById('printEntityPhone').innerText = entityPhone;
    document.getElementById('printEntityAddress').innerText = entityAddress;
    document.getElementById('printType').innerText = type.toUpperCase();
    document.getElementById('printName').innerText = employeeName;
    document.getElementById('printPosition').innerText = position;

    // Find Employee ID (Mock lookup since we don't have it in form)
    const empData = employeesData.find(e => e.name === employeeName);
    document.getElementById('printId').innerText = empData ? empData.idNum : '---';

    // Show Print View
    document.getElementById('examsCreateView').style.display = 'none';
    document.getElementById('examsPrintView').style.display = 'block';
}

function hidePrintView() {
    document.getElementById('examsPrintView').style.display = 'none';
    document.getElementById('examsListHeader').style.display = 'block';
    document.getElementById('examsListView').style.display = 'block';
}

function printExam() {
    window.print();
}

// Exports
window.generateExam = generateExam;
window.hideCreateExam = hideCreateExam;
window.generateDocument = generateDocument;
window.filterEmployees = filterEmployees;
window.renderEmployeesList = renderEmployeesList;
window.hidePrintView = hidePrintView;
window.printExam = printExam;

// Init
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initExams);
} else {
    initExams();
}
