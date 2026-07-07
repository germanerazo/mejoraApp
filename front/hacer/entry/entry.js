import config from '../../js/config.js';

const API_URL = `${config.BASE_API_URL}entry.php`;

// Employees Data
let entryData = [];

// Make accessible to HTML onclick
window.showCreateEntry = showCreateEntry;
window.hideCreateEntry = hideCreateEntry;
window.saveEntry = saveEntry;
window.addRecommendationFromModal = addRecommendationFromModal; 
window.showRecommendationModal = showRecommendationModal;
window.hideRecommendationModal = hideRecommendationModal;
window.showRestricModal = showRestricModal;
window.hideRestricModal = hideRestricModal;
window.addRestricFromModal = addRestricFromModal;
window.showPeriodicRecoModal = showPeriodicRecoModal;
window.hidePeriodicRecoModal = hidePeriodicRecoModal;
window.addPeriodicRecoFromModal = addPeriodicRecoFromModal;
window.showPeriodicRestricModal = showPeriodicRestricModal;
window.hidePeriodicRestricModal = hidePeriodicRestricModal;
window.addPeriodicRestricFromModal = addPeriodicRestricFromModal;
window.viewEntry = viewEntry;
window.renderEntryList = renderEntryList;
window.addMedicalExam = addMedicalExam;
window.addPeriodicExam = addPeriodicExam;
window.addRetirementExam = addRetirementExam;
window.filterEntry = filterEntry;

async function initEntry() {
    await loadEntryData();
    await loadSSEntities();
}

async function loadEntryData() {
    try {
        const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
        const res = await fetch(`${API_URL}?idEmpresa=${idEmpresa}`);
        const data = await res.json();
        entryData = Array.isArray(data) ? data : (data.result || []);
        renderEntryList();
    } catch (e) {
        console.error('Error loading employees', e);
        entryData = [];
        renderEntryList();
    }
}

async function loadSSEntities() {
    try {
        const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
        const res = await fetch(`${config.BASE_API_URL}ss_entities.php?idEmpresa=${idEmpresa}`);
        if (!res.ok) return;
        
        const data = await res.json();
        const entities = Array.isArray(data) ? data : (data.result || []);
        
        const epsSelect = document.getElementById('fieldEPS');
        const arlSelect = document.getElementById('fieldARL');
        const afpSelect = document.getElementById('fieldAFP');

        if (epsSelect) epsSelect.innerHTML = '<option value="">Seleccione...</option>';
        if (arlSelect) arlSelect.innerHTML = '<option value="">Seleccione...</option>';
        if (afpSelect) afpSelect.innerHTML = '<option value="">Seleccione...</option>';

        entities.forEach(ent => {
            const option = `<option value="${ent.nombre}">${ent.nombre}</option>`;
            if (ent.tipo === 'EPS' && epsSelect) epsSelect.innerHTML += option;
            if (ent.tipo === 'ARL' && arlSelect) arlSelect.innerHTML += option;
            if (ent.tipo === 'AFP' && afpSelect) afpSelect.innerHTML += option;
        });
    } catch (e) {
        console.error('Error loading SS Entities', e);
    }
}

function renderEntryList(data = entryData) {
    const tbody = document.querySelector('#tableEntry tbody');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #999;">No hay empleados encontrados.</td></tr>`;
        return;
    }

    let html = '';
    data.forEach(item => {
        const id = item.idEntry;
        const idNum = item.identificacion || '';
        const name = item.nombre || '';
        const status = item.estado || 'Activo';
        const date = item.fechaIngreso || '';
        html += `<tr>
            <td>${idNum}</td>
            <td>EMP-${id}</td>
            <td>${name}</td>
            <td><span style="padding: 4px 8px; border-radius: 4px; background: ${status === 'Activo' ? '#d4edda' : '#f8d7da'}; color: ${status === 'Activo' ? '#155724' : '#721c24'}">${status}</span></td>
            <td>${date}</td>
            <td style="text-align: center;">
                <button class="btn-view-premium" title="Ver Detalle" onclick="viewEntry(${id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

function filterEntry() {
    const nameTerm = document.getElementById('filterName').value.toLowerCase();
    const idTerm = document.getElementById('filterId').value.toLowerCase();

    const filtered = entryData.filter(item => {
        const matchName = (item.nombre || '').toLowerCase().includes(nameTerm);
        const matchId = (item.identificacion || '').toLowerCase().includes(idTerm);
        return matchName && matchId;
    });

    renderEntryList(filtered);
}

function showCreateEntry() {
    document.getElementById('entryListView').style.display = 'none';
    document.getElementById('entryListHeader').style.display = 'none';
    document.getElementById('entryCreateView').style.display = 'block';
    
    // Reset Form
    document.getElementById('entryForm').reset();
    document.querySelector('#recoTable tbody').innerHTML = '';
    document.querySelector('#restricTable tbody').innerHTML = '';
    document.querySelector('#tableExams tbody').innerHTML = '';
    document.querySelector('#tablePeriodicExams tbody').innerHTML = '';
    document.querySelector('#periodicRecoTable tbody').innerHTML = '';
    document.querySelector('#periodicRestricTable tbody').innerHTML = '';
    document.querySelector('#tableRetirementExam tbody').innerHTML = '';
    
    // Hide Medical Sections for new records
    document.getElementById('medicalSections').style.display = 'none';
    document.getElementById('entryForm').dataset.editingId = ''; // Clear editing ID
}

function hideCreateEntry() {
    document.getElementById('entryCreateView').style.display = 'none';
    document.getElementById('entryListHeader').style.display = 'block';
    document.getElementById('entryListView').style.display = 'block';
}

async function saveEntry() {
    const name = document.getElementById('fieldName').value;
    const idNum = document.getElementById('fieldIdNum').value;
    const medicalSections = document.getElementById('medicalSections');
    const isMedicalVisible = medicalSections.style.display !== 'none';
    const editingId = document.getElementById('entryForm').dataset.editingId;

    if (!name || !idNum) {
        Swal.fire('Error', 'Debe completar Nombre y Número de Identificación', 'error');
        return;
    }

    const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
    const token = sessionStorage.getItem('token') || '';

    // Build payload from form fields
    const payload = {
        token: token,
        idEmpresa: idEmpresa,
        nombre: name,
        identificacion: idNum,
        fechaIngreso: document.getElementById('fieldEntryDate').value || '',
        fechaNacimiento: document.getElementById('fieldBirthDate').value || '',
        lugarNacimiento: document.getElementById('fieldBirthPlace').value || '',
        sexo: document.getElementById('fieldSex').value || '',
        estadoCivil: document.getElementById('fieldCivilStatus').value || '',
        rh: document.getElementById('fieldRH').value || '',
        escolaridad: document.getElementById('fieldEducation').value || '',
        telefono: document.getElementById('fieldPhone').value || '',
        salario: document.getElementById('fieldSalary').value || 0,
        estrato: document.getElementById('fieldStratum').value || 0,
        personasCargo: document.getElementById('fieldDependents').value || 0,
        cabezaFamilia: document.getElementById('fieldHeadHousehold').value || '',
        numeroHijos: document.getElementById('fieldChildren').value || 0,
        grupoEtnico: document.getElementById('fieldEthnicity').value || '',
        cargo: document.getElementById('fieldPosition').value || '',
        horario: document.getElementById('fieldSchedule').value || '',
        eps: document.getElementById('fieldEPS').value || '',
        arl: document.getElementById('fieldARL').value || '',
        afp: document.getElementById('fieldAFP').value || '',
        estado: document.getElementById('fieldStatus').value || 'Activo',
        fechaRetiro: document.getElementById('fieldWithdrawalDate').value || '',
        emergNombre: document.getElementById('fieldEmergName').value || '',
        emergTelefono: document.getElementById('fieldEmergPhone').value || '',
        alergias: document.getElementById('fieldAllergies').value || ''
    };

    let method = 'POST';
    if (editingId) {
        payload.idEntry = parseInt(editingId);
        method = 'PUT';
    }

    if (!isMedicalVisible) {
        // Step 1: Save Basic Info and Show Medical Sections
        try {
            const res = await fetch(`${API_URL}?_method=${method}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const resp = await res.json();

            if (resp.status === 'ok' || resp.result) {
                const savedId = resp.result?.idEntry || editingId;
                document.getElementById('entryForm').dataset.editingId = savedId;
                medicalSections.style.display = 'block';

                Swal.fire({
                    title: 'Información Básica Guardada',
                    text: 'Ahora puede diligenciar los Registros Médicos, Recomendaciones y Restricciones.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('Error', resp.result?.error_msg || 'Error al guardar el empleado', 'error');
            }
        } catch (e) {
            console.error('Error saving entry', e);
            Swal.fire('Error', 'No se pudo guardar el empleado', 'error');
        }

    } else {
        // Step 2: Save again (update) and Close
        payload.idEntry = parseInt(document.getElementById('entryForm').dataset.editingId);

        try {
            const res = await fetch(`${API_URL}?_method=PUT`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const resp = await res.json();

            if (resp.status === 'ok' || resp.result) {
                Swal.fire('Guardado', 'Registro completo guardado correctamente', 'success');
                await loadEntryData();
                hideCreateEntry();
            } else {
                Swal.fire('Error', resp.result?.error_msg || 'Error al guardar', 'error');
            }
        } catch (e) {
            console.error('Error saving entry', e);
            Swal.fire('Error', 'No se pudo guardar el registro', 'error');
        }
    }
}

function showRecommendationModal() {
    document.getElementById('recoModal').style.display = 'flex';
    document.getElementById('modalRecoDate').value = '';
    document.getElementById('modalRecoText').value = '';
    document.getElementById('modalRecoStatus').value = 'Abierto';
}

function hideRecommendationModal() {
    document.getElementById('recoModal').style.display = 'none';
}

function addRecommendationFromModal() {
    const date = document.getElementById('modalRecoDate').value;
    const text = document.getElementById('modalRecoText').value;
    const status = document.getElementById('modalRecoStatus').value;

    if (!date || !text) {
        Swal.fire('Error', 'Complete fecha y recomendación', 'error');
        return;
    }

    const tbody = document.querySelector('#recoTable tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${date}</td>
        <td>${text}</td>
        <td></td> <!-- Seguimiento empty initially -->
        <td>${status}</td>
        <td style="text-align: center;">
            <button class="btn-delete-premium" onclick="this.closest('tr').remove()" title="Eliminar">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>
    `;
    tbody.appendChild(tr);
    hideRecommendationModal();
}

function showRestricModal() {
    document.getElementById('restricModal').style.display = 'flex';
    document.getElementById('modalRestricDate').value = '';
    document.getElementById('modalRestricText').value = '';
    document.getElementById('modalRestricStatus').value = 'Abierto';
}

function hideRestricModal() {
    document.getElementById('restricModal').style.display = 'none';
}

function addRestricFromModal() {
    const date = document.getElementById('modalRestricDate').value;
    const text = document.getElementById('modalRestricText').value;
    const status = document.getElementById('modalRestricStatus').value;

    if (!date || !text) {
        Swal.fire('Error', 'Complete fecha y restricción', 'error');
        return;
    }

    const tbody = document.querySelector('#restricTable tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${date}</td>
        <td>${text}</td>
        <td></td> <!-- Seguimiento empty initially -->
        <td>${status}</td>
        <td style="text-align: center;">
            <button class="btn-delete-premium" onclick="this.closest('tr').remove()" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
        </td>
    `;
    tbody.appendChild(tr);
    hideRestricModal();
}

function viewEntry(id) {
    const item = entryData.find(i => parseInt(i.idEntry) === id);
    if (!item) return;

    showCreateEntry();
    document.getElementById('medicalSections').style.display = 'block';
    document.getElementById('entryForm').dataset.editingId = item.idEntry;

    // Populate all form fields from backend data
    document.getElementById('fieldName').value = item.nombre || '';
    document.getElementById('fieldIdNum').value = item.identificacion || '';
    document.getElementById('fieldEntryDate').value = item.fechaIngreso || '';
    document.getElementById('fieldBirthDate').value = item.fechaNacimiento || '';
    document.getElementById('fieldBirthPlace').value = item.lugarNacimiento || '';
    document.getElementById('fieldSex').value = item.sexo || '';
    document.getElementById('fieldCivilStatus').value = item.estadoCivil || '';
    document.getElementById('fieldRH').value = item.rh || '';
    document.getElementById('fieldEducation').value = item.escolaridad || '';
    document.getElementById('fieldPhone').value = item.telefono || '';
    document.getElementById('fieldSalary').value = item.salario || '';
    document.getElementById('fieldStratum').value = item.estrato || '';
    document.getElementById('fieldDependents').value = item.personasCargo || '';
    document.getElementById('fieldHeadHousehold').value = item.cabezaFamilia || '';
    document.getElementById('fieldChildren').value = item.numeroHijos || '';
    document.getElementById('fieldEthnicity').value = item.grupoEtnico || 'Ninguno';
    document.getElementById('fieldPosition').value = item.cargo || '';
    document.getElementById('fieldSchedule').value = item.horario || '';
    document.getElementById('fieldEPS').value = item.eps || '';
    document.getElementById('fieldARL').value = item.arl || '';
    document.getElementById('fieldAFP').value = item.afp || '';
    document.getElementById('fieldStatus').value = item.estado || 'Activo';
    document.getElementById('fieldWithdrawalDate').value = item.fechaRetiro || '';
    document.getElementById('fieldEmergName').value = item.emergNombre || '';
    document.getElementById('fieldEmergPhone').value = item.emergTelefono || '';
    document.getElementById('fieldAllergies').value = item.alergias || '';

    // Clear sub-tables (medical exams, recommendations, etc.)
    document.querySelector('#tableExams tbody').innerHTML = '';
    document.querySelector('#recoTable tbody').innerHTML = '';
    document.querySelector('#restricTable tbody').innerHTML = '';
    document.querySelector('#tablePeriodicExams tbody').innerHTML = '';
    document.querySelector('#periodicRecoTable tbody').innerHTML = '';
    document.querySelector('#periodicRestricTable tbody').innerHTML = '';
    document.querySelector('#tableRetirementExam tbody').innerHTML = '';
}

function addMedicalExam() {
    // Check if exam already exists
    const existingRows = document.querySelectorAll('#tableExams tbody tr');
    if (existingRows.length > 0) {
        Swal.fire('Atención', 'Solo se puede cargar un Examen Médico de Ingreso. Elimine el existente para cargar uno nuevo.', 'warning');
        return;
    }

    const date = document.getElementById('fieldExamDate').value;
    const fileInput = document.getElementById('fieldExamFile');
    const fileName = fileInput.files[0] ? fileInput.files[0].name : '';

    if (!date || !fileName) {
        Swal.fire('Atención', 'Seleccione fecha y archivo', 'warning');
        return;
    }

    addMedicalExamRow(date, fileName);
    
    // Clear inputs
    document.getElementById('fieldExamDate').value = '';
    fileInput.value = '';
}

function addMedicalExamRow(date, fileName) {
    const tbody = document.querySelector('#tableExams tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${date}</td>
        <td><a href="#" style="color: var(--color6); text-decoration: underline;">${fileName}</a></td>
        <td style="text-align: center;">
            <div style="display: flex; justify-content: center; gap: 5px;">
                <button class="btn-view-premium" onclick="alert('Descargando documento...')" title="Descargar" style="color: #27ae60 !important;">
                    <i class="fas fa-file-download"></i>
                </button>
                <button class="btn-delete-premium" onclick="this.closest('tr').remove()" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </td>
    `;
    tbody.appendChild(tr);
}

// Make accessible
window.addMedicalExam = addMedicalExam;

function addRetirementExam() {
    // Check if exam already exists
    const existingRows = document.querySelectorAll('#tableRetirementExam tbody tr');
    if (existingRows.length > 0) {
        Swal.fire('Atención', 'Solo se puede cargar un Examen Médico de Retiro. Elimine el existente para cargar uno nuevo.', 'warning');
        return;
    }

    const date = document.getElementById('fieldRetirementDate').value;
    const fileInput = document.getElementById('fieldRetirementFile');
    const fileName = fileInput.files[0] ? fileInput.files[0].name : '';

    if (!date || !fileName) {
        Swal.fire('Atención', 'Seleccione fecha y archivo', 'warning');
        return;
    }

    addRetirementExamRow(date, fileName);
    
    // Clear inputs
    document.getElementById('fieldRetirementDate').value = '';
    fileInput.value = '';
}

function addRetirementExamRow(date, fileName) {
    const tbody = document.querySelector('#tableRetirementExam tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${date}</td>
        <td><a href="#" style="color: var(--color6); text-decoration: underline;">${fileName}</a></td>
        <td style="text-align: center;">
            <div style="display: flex; justify-content: center; gap: 5px;">
                <div class="icon-download" onclick="alert('Descargando documento...')" style="width: 20px; height: 20px; font-size: 1rem; cursor: pointer;" title="Descargar">⬇️</div>
                <div class="icon-delete" onclick="this.closest('tr').remove()" style="width: 20px; height: 20px; font-size: 1rem; cursor: pointer;" title="Eliminar">➖</div>
            </div>
        </td>
    `;
    tbody.appendChild(tr);
}

function addPeriodicExam() {
    const date = document.getElementById('fieldPeriodicDate').value;
    const fileInput = document.getElementById('fieldPeriodicFile');
    const fileName = fileInput.files[0] ? fileInput.files[0].name : '';

    if (!date || !fileName) {
        Swal.fire('Atención', 'Seleccione fecha y archivo', 'warning');
        return;
    }

    addPeriodicExamRow(date, fileName);
    
    // Clear inputs
    document.getElementById('fieldPeriodicDate').value = '';
    fileInput.value = '';
}

function addPeriodicExamRow(date, fileName) {
    const tbody = document.querySelector('#tablePeriodicExams tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${date}</td>
        <td><a href="#" style="color: var(--color6); text-decoration: underline;">${fileName}</a></td>
        <td style="text-align: center;">
            <div style="display: flex; justify-content: center; gap: 5px;">
                <div class="icon-download" onclick="alert('Descargando documento...')" style="width: 20px; height: 20px; font-size: 1rem; cursor: pointer;" title="Descargar">⬇️</div>
                <div class="icon-delete" onclick="this.closest('tr').remove()" style="width: 20px; height: 20px; font-size: 1rem; cursor: pointer;" title="Eliminar">➖</div>
            </div>
        </td>
    `;
    tbody.appendChild(tr);
}

function showPeriodicRecoModal() {
    document.getElementById('periodicRecoModal').style.display = 'flex';
    document.getElementById('modalPeriodicRecoDate').value = '';
    document.getElementById('modalPeriodicRecoText').value = '';
    document.getElementById('modalPeriodicRecoStatus').value = 'Abierto';
}

function hidePeriodicRecoModal() {
    document.getElementById('periodicRecoModal').style.display = 'none';
}

function addPeriodicRecoFromModal() {
    const date = document.getElementById('modalPeriodicRecoDate').value;
    const text = document.getElementById('modalPeriodicRecoText').value;
    const status = document.getElementById('modalPeriodicRecoStatus').value;

    if (!date || !text) {
        Swal.fire('Error', 'Complete fecha y recomendación', 'error');
        return;
    }

    const tbody = document.querySelector('#periodicRecoTable tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${date}</td>
        <td>${text}</td>
        <td></td> <!-- Seguimiento empty initially -->
        <td>${status}</td>
        <td style="text-align: center;">
            <button class="btn-delete-premium" onclick="this.closest('tr').remove()" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
        </td>
    `;
    tbody.appendChild(tr);
    hidePeriodicRecoModal();
}

function showPeriodicRestricModal() {
    document.getElementById('periodicRestricModal').style.display = 'flex';
    document.getElementById('modalPeriodicRestricDate').value = '';
    document.getElementById('modalPeriodicRestricText').value = '';
    document.getElementById('modalPeriodicRestricStatus').value = 'Abierto';
}

function hidePeriodicRestricModal() {
    document.getElementById('periodicRestricModal').style.display = 'none';
}

function addPeriodicRestricFromModal() {
    const date = document.getElementById('modalPeriodicRestricDate').value;
    const text = document.getElementById('modalPeriodicRestricText').value;
    const status = document.getElementById('modalPeriodicRestricStatus').value;

    if (!date || !text) {
        Swal.fire('Error', 'Complete fecha y restricción', 'error');
        return;
    }

    const tbody = document.querySelector('#periodicRestricTable tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${date}</td>
        <td>${text}</td>
        <td></td> <!-- Seguimiento empty initially -->
        <td>${status}</td>
        <td style="text-align: center;">
            <button class="btn-delete-premium" onclick="this.closest('tr').remove()" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
        </td>
    `;
    tbody.appendChild(tr);
    hidePeriodicRestricModal();
}

// Sociodemographic Profile Logic
let chartInstances = {};

function showSociodemographicProfile() {
    document.getElementById('entryListView').style.display = 'none';
    document.getElementById('entryListHeader').style.display = 'none';
    document.getElementById('entryGraphView').style.display = 'block';

    renderAllCharts();
}

function hideSociodemographicProfile() {
    document.getElementById('entryGraphView').style.display = 'none';
    document.getElementById('entryListHeader').style.display = 'block';
    document.getElementById('entryListView').style.display = 'block';
}

function calculateAge(birthDate) {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function createChart(canvasId, label, labels, data, chartType = 'bar') {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }

    // Dynamic Colors
    const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(100, 100, 100, 0.7)'
    ];

    chartInstances[canvasId] = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: chartType === 'pie' ? colors : 'rgba(255, 140, 0, 0.7)',
                borderColor: chartType === 'pie' ? '#fff' : 'rgba(255, 140, 0, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    color: '#000',
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => value > 0 ? value : ''
                },
                legend: {
                    display: chartType === 'pie' // Only show legend for Pie charts
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function renderAllCharts() {
    // 1. Age
    const ageBuckets = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '>55': 0 };
    entryData.forEach(item => {
        if (item.fechaNacimiento) {
            const age = calculateAge(item.fechaNacimiento);
            if (age >= 18 && age <= 25) ageBuckets['18-25']++;
            else if (age >= 26 && age <= 35) ageBuckets['26-35']++;
            else if (age >= 36 && age <= 45) ageBuckets['36-45']++;
            else if (age >= 46 && age <= 55) ageBuckets['46-55']++;
            else if (age > 55) ageBuckets['>55']++;
        }
    });
    createChart('ageChart', 'Rangos de Edad', Object.keys(ageBuckets), Object.values(ageBuckets));

    // 2. Sex
    const sexCount = {};
    entryData.forEach(item => {
        const val = item.sexo || 'Sin Info';
        sexCount[val] = (sexCount[val] || 0) + 1;
    });
    createChart('sexChart', 'Sexo', Object.keys(sexCount), Object.values(sexCount), 'pie');

    // 3. Civil Status
    const cvCount = {};
    entryData.forEach(item => {
        const val = item.estadoCivil || 'Sin Info';
        cvCount[val] = (cvCount[val] || 0) + 1;
    });
    createChart('civilStatusChart', 'Estado Civil', Object.keys(cvCount), Object.values(cvCount), 'bar');

    // 4. Education
    const eduCount = {};
    entryData.forEach(item => {
        const val = item.escolaridad || 'Sin Info';
        eduCount[val] = (eduCount[val] || 0) + 1;
    });
    createChart('educationChart', 'Escolaridad', Object.keys(eduCount), Object.values(eduCount), 'bar');

    // 5. Dependents
    const depCount = {};
    entryData.forEach(item => {
        const val = item.personasCargo || '0';
        depCount[val] = (depCount[val] || 0) + 1;
    });
    createChart('dependentsChart', 'Personas a Cargo', Object.keys(depCount), Object.values(depCount), 'bar');

    // 6. Head Household
    const hhCount = { 'SI': 0, 'NO': 0 };
    entryData.forEach(item => {
        if (item.cabezaFamilia === 'SI') hhCount['SI']++;
        else if (item.cabezaFamilia === 'NO') hhCount['NO']++;
    });
    createChart('headHouseholdChart', 'Cabeza de Familia', Object.keys(hhCount), Object.values(hhCount), 'pie');

    // 7. Children
    const childCount = {};
    entryData.forEach(item => {
        const val = item.numeroHijos || '0';
        childCount[val] = (childCount[val] || 0) + 1;
    });
    createChart('childrenChart', 'Número de Hijos', Object.keys(childCount), Object.values(childCount), 'bar');

    // 8. Ethnicity
    const ethCount = {};
    entryData.forEach(item => {
        const val = item.grupoEtnico || 'Ninguno';
        ethCount[val] = (ethCount[val] || 0) + 1;
    });
    createChart('ethnicityChart', 'Grupo Étnico', Object.keys(ethCount), Object.values(ethCount), 'bar');
}

// Export Map
window.showSociodemographicProfile = showSociodemographicProfile;
window.hideSociodemographicProfile = hideSociodemographicProfile;

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initEntry);
} else {
    initEntry();
}
