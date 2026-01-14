// Mock Data
let entryData = [
    { 
        id: 1, 
        idNum: '1098765432', 
        name: 'Carlos Perez', 
        sex: 'M',
        civilStatus: 'Casado',
        education: 'Tecnico',
        dependents: 2,
        headHousehold: 'SI',
        children: 2,
        ethnicity: 'Ninguno',
        position: 'Operario', 
        status: 'Activo', 
        date: '2024-01-10',
        birthDate: '1990-05-15', // 34 years
        recommendations: [],
        restrictions: [],
        medicalExams: [],
        periodicExams: [],
        periodicRecommendations: [],
        periodicRestrictions: [],
        retirementExam: []
    },
    { 
        id: 2, 
        idNum: '72345678', 
        name: 'Maria Rodriguez', 
        sex: 'F',
        civilStatus: 'Soltero',
        education: 'Universitario',
        dependents: 0,
        headHousehold: 'NO',
        children: 0,
        ethnicity: 'Ninguno',
        position: 'Analista', 
        status: 'Activo', 
        date: '2023-08-20',
        birthDate: '1998-11-02', // 26 years
        recommendations: [],
        restrictions: [],
        medicalExams: [],
        periodicExams: [],
        periodicRecommendations: [],
        periodicRestrictions: [],
        retirementExam: []
    },
    { 
        id: 3, 
        idNum: '987654321', 
        name: 'Juan Gomez', 
        sex: 'M',
        civilStatus: 'Union Libre',
        education: 'Bachiller',
        dependents: 1,
        headHousehold: 'SI',
        children: 1,
        ethnicity: 'Afrocolombiano',
        position: 'Supervisor', 
        status: 'Activo', 
        date: '2022-03-15',
        birthDate: '1980-02-10', // 44 years
        recommendations: [],
        restrictions: [],
        medicalExams: [],
        periodicExams: [],
        periodicRecommendations: [],
        periodicRestrictions: [],
        retirementExam: []
    },
    { 
        id: 4, 
        idNum: '55667788', 
        name: 'Ana Martinez', 
        sex: 'F',
        civilStatus: 'Casado',
        education: 'Universitario',
        dependents: 3,
        headHousehold: 'SI',
        children: 2,
        ethnicity: 'Ninguno',
        position: 'Asistente', 
        status: 'Activo', 
        date: '2024-02-01',
        birthDate: '2000-07-20', // 24 years
        recommendations: [],
        restrictions: [],
        medicalExams: [],
        periodicExams: [],
        periodicRecommendations: [],
        periodicRestrictions: [],
        retirementExam: []
    },
    { 
        id: 5, 
        idNum: '11223344', 
        name: 'Pedro Sanchez', 
        sex: 'M',
        civilStatus: 'Soltero',
        education: 'Postgrado',
        dependents: 0,
        headHousehold: 'NO',
        children: 0,
        ethnicity: 'Ninguno',
        position: 'Gerente', 
        status: 'Activo', 
        date: '2020-01-01',
        birthDate: '1975-12-05', // 49 years
        recommendations: [],
        restrictions: [],
        medicalExams: [],
        periodicExams: [],
        periodicRecommendations: [],
        periodicRestrictions: [],
        retirementExam: []
    }
];

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

function initEntry() {
    renderEntryList();
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
        html += `<tr>
            <td>${item.idNum}</td>
            <td>EMP-${item.id}</td>
            <td>${item.name}</td>
            <td><span style="padding: 4px 8px; border-radius: 4px; background: ${item.status === 'Activo' ? '#d4edda' : '#f8d7da'}; color: ${item.status === 'Activo' ? '#155724' : '#721c24'}">${item.status}</span></td>
            <td>${item.date}</td>
            <td style="text-align: center;">
                <div class="icon-download" title="Ver Detalle" onclick="viewEntry(${item.id})" style="margin: 0 auto; color: var(--color6);">👁️</div>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

function filterEntry() {
    const nameTerm = document.getElementById('filterName').value.toLowerCase();
    const idTerm = document.getElementById('filterId').value.toLowerCase();

    const filtered = entryData.filter(item => {
        const matchName = item.name.toLowerCase().includes(nameTerm);
        const matchId = item.idNum.toLowerCase().includes(idTerm);
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

function saveEntry() {
    const name = document.getElementById('fieldName').value;
    const idNum = document.getElementById('fieldIdNum').value;
    const medicalSections = document.getElementById('medicalSections');
    const isMedicalVisible = medicalSections.style.display !== 'none';
    const editingId = document.getElementById('entryForm').dataset.editingId;

    if (!name || !idNum) {
        Swal.fire('Error', 'Debe completar Nombre y Número de Identificación', 'error');
        return;
    }

    // Determine ID (existing or new)
    let newId;
    if (editingId) {
        newId = parseInt(editingId);
    } else {
        newId = entryData.length > 0 ? Math.max(...entryData.map(i => i.id)) + 1 : 1;
    }

    if (!isMedicalVisible) {
        // Step 1: Save Basic Info and Show Medical Sections
        medicalSections.style.display = 'block';
        
        // Save Mock Data (Basic)
        if (!editingId) {
            entryData.push({
                id: newId,
                name: name,
                idNum: idNum,
                date: document.getElementById('fieldEntryDate').value || new Date().toISOString().split('T')[0],
                birthDate: document.getElementById('fieldBirthDate').value,
                sex: document.getElementById('fieldSex').value,
                civilStatus: document.getElementById('fieldCivilStatus').value,
                education: document.getElementById('fieldEducation').value,
                dependents: document.getElementById('fieldDependents').value,
                headHousehold: document.getElementById('fieldHeadHousehold').value,
                children: document.getElementById('fieldChildren').value,
                ethnicity: document.getElementById('fieldEthnicity').value,
                status: document.getElementById('fieldStatus').value,
                recommendations: [],
                restrictions: [],
                medicalExams: [],
                periodicExams: [],
                periodicRecommendations: [],
                periodicRestrictions: []
            });
            document.getElementById('entryForm').dataset.editingId = newId; // Set ID for step 2
        } else {
             // Update existing basic info
            const item = entryData.find(i => i.id === newId);
            if(item) {
                item.name = name;
                item.idNum = idNum;
                item.date = document.getElementById('fieldEntryDate').value;
                item.birthDate = document.getElementById('fieldBirthDate').value;
                item.sex = document.getElementById('fieldSex').value;
                item.civilStatus = document.getElementById('fieldCivilStatus').value;
                item.education = document.getElementById('fieldEducation').value;
                item.dependents = document.getElementById('fieldDependents').value;
                item.headHousehold = document.getElementById('fieldHeadHousehold').value;
                item.children = document.getElementById('fieldChildren').value;
                item.ethnicity = document.getElementById('fieldEthnicity').value;
                item.status = document.getElementById('fieldStatus').value;
            }
        }
        
        Swal.fire({
            title: 'Información Básica Guardada', 
            text: 'Ahora puede diligenciar los Registros Médicos, Recomendaciones y Restricciones.', 
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        
    } else {
        // Step 2: Save Everything and Close
        
        const recos = [];
        document.querySelectorAll('#recoTable tbody tr').forEach(tr => {
            recos.push({
                date: tr.cells[0].innerText,
                reco: tr.cells[1].innerText,
                follow: tr.cells[2].innerText,
                status: tr.cells[3].innerText
            });
        });

        const restrics = [];
        document.querySelectorAll('#restricTable tbody tr').forEach(tr => {
            restrics.push({
                date: tr.cells[0].innerText,
                restric: tr.cells[1].innerText,
                follow: tr.cells[2].innerText,
                status: tr.cells[3].innerText
            });
        });

        const exams = [];
        document.querySelectorAll('#tableExams tbody tr').forEach(tr => {
            exams.push({
                date: tr.cells[0].innerText,
                file: tr.cells[1].innerText
            });
        });

        const periodicExams = [];
        document.querySelectorAll('#tablePeriodicExams tbody tr').forEach(tr => {
            periodicExams.push({
                date: tr.cells[0].innerText,
                file: tr.cells[1].innerText
            });
        });

        const periodicRecos = [];
        document.querySelectorAll('#periodicRecoTable tbody tr').forEach(tr => {
            periodicRecos.push({
                date: tr.cells[0].innerText,
                reco: tr.cells[1].innerText,
                follow: tr.cells[2].innerText,
                status: tr.cells[3].innerText
            });
        });

        const periodicRestrics = [];
        document.querySelectorAll('#periodicRestricTable tbody tr').forEach(tr => {
            periodicRestrics.push({
                date: tr.cells[0].innerText,
                restric: tr.cells[1].innerText,
                follow: tr.cells[2].innerText,
                status: tr.cells[3].innerText
            });
        });

        const retirementExams = []; // Should be max 1
        document.querySelectorAll('#tableRetirementExam tbody tr').forEach(tr => {
            retirementExams.push({
                date: tr.cells[0].innerText,
                file: tr.cells[1].innerText
            });
        });

        // Update existing item
        const item = entryData.find(i => i.id === newId);
        if (item) {
             item.name = name;
             item.idNum = idNum;
             item.date = document.getElementById('fieldEntryDate').value;
             item.status = document.getElementById('fieldStatus').value;
             item.recommendations = recos;
             item.restrictions = restrics;
             item.medicalExams = exams;
             item.periodicExams = periodicExams;
             item.periodicRecommendations = periodicRecos;
             item.periodicRestrictions = periodicRestrics;
             item.retirementExam = retirementExams;
             // Add other fields to mock object as needed for completeness
        }

        Swal.fire('Guardado', 'Registro completo guardado correctamente', 'success');
        renderEntryList();
        hideCreateEntry();
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
            <div class="icon-delete" onclick="this.closest('tr').remove()" style="margin: 0 auto; width: 20px; height: 20px; font-size: 1rem;">x</div>
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
            <div class="icon-delete" onclick="this.closest('tr').remove()" style="margin: 0 auto; width: 20px; height: 20px; font-size: 1rem;">x</div>
        </td>
    `;
    tbody.appendChild(tr);
    hideRestricModal();
}

function viewEntry(id) {
    // Populate form with mock data for editing
    const item = entryData.find(i => i.id === id);
    if (!item) return;

    showCreateEntry();
    document.getElementById('medicalSections').style.display = 'block'; // Show sections when editing/viewing
    document.getElementById('entryForm').dataset.editingId = item.id; // Set editing ID

    document.getElementById('fieldName').value = item.name;
    document.getElementById('fieldIdNum').value = item.idNum;
    document.getElementById('fieldEntryDate').value = item.date;
    document.getElementById('fieldBirthDate').value = item.birthDate || '';
    document.getElementById('fieldSex').value = item.sex || '';
    document.getElementById('fieldCivilStatus').value = item.civilStatus || '';
    document.getElementById('fieldEducation').value = item.education || '';
    document.getElementById('fieldDependents').value = item.dependents || '';
    document.getElementById('fieldHeadHousehold').value = item.headHousehold || '';
    document.getElementById('fieldChildren').value = item.children || '';
    document.getElementById('fieldEthnicity').value = item.ethnicity || 'Ninguno';
    document.getElementById('fieldStatus').value = item.status;
    
    // Populate Medical Exams
    document.querySelector('#tableExams tbody').innerHTML = '';
    if (item.medicalExams && item.medicalExams.length > 0) {
        item.medicalExams.forEach(exam => {
            addMedicalExamRow(exam.date, exam.file);
        });
    }

    // Populate Recommendations (Read Mode)
    document.querySelector('#recoTable tbody').innerHTML = '';
    if (item.recommendations && item.recommendations.length > 0) {
        const tbody = document.querySelector('#recoTable tbody');
        item.recommendations.forEach(reco => {
             const tr = document.createElement('tr');
             tr.innerHTML = `
                <td>${reco.date}</td>
                <td>${reco.reco}</td>
                <td>${reco.follow || ''}</td>
                <td>${reco.status}</td>
                <td style="text-align: center;">
                    <div class="icon-delete" onclick="this.closest('tr').remove()" style="margin: 0 auto; width: 20px; height: 20px; font-size: 1rem;">x</div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Populate Restrictions (Read Mode)
    document.querySelector('#restricTable tbody').innerHTML = '';
    if (item.restrictions && item.restrictions.length > 0) {
        const tbody = document.querySelector('#restricTable tbody');
        item.restrictions.forEach(res => {
             const tr = document.createElement('tr');
             tr.innerHTML = `
                <td>${res.date}</td>
                <td>${res.restric}</td>
                <td>${res.follow || ''}</td>
                <td>${res.status}</td>
                <td style="text-align: center;">
                    <div class="icon-delete" onclick="this.closest('tr').remove()" style="margin: 0 auto; width: 20px; height: 20px; font-size: 1rem;">x</div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Populate Periodic Recommendations (Read Mode)
    document.querySelector('#periodicRecoTable tbody').innerHTML = '';
    if (item.periodicRecommendations && item.periodicRecommendations.length > 0) {
        const tbody = document.querySelector('#periodicRecoTable tbody');
        item.periodicRecommendations.forEach(reco => {
             const tr = document.createElement('tr');
             tr.innerHTML = `
                <td>${reco.date}</td>
                <td>${reco.reco}</td>
                <td>${reco.follow || ''}</td>
                <td>${reco.status}</td>
                <td style="text-align: center;">
                    <div class="icon-delete" onclick="this.closest('tr').remove()" style="margin: 0 auto; width: 20px; height: 20px; font-size: 1rem;">➖</div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Populate Periodic Restrictions (Read Mode)
    document.querySelector('#periodicRestricTable tbody').innerHTML = '';
    if (item.periodicRestrictions && item.periodicRestrictions.length > 0) {
        const tbody = document.querySelector('#periodicRestricTable tbody');
        item.periodicRestrictions.forEach(res => {
             const tr = document.createElement('tr');
             tr.innerHTML = `
                <td>${res.date}</td>
                <td>${res.restric}</td>
                <td>${res.follow || ''}</td>
                <td>${res.status}</td>
                <td style="text-align: center;">
                    <div class="icon-delete" onclick="this.closest('tr').remove()" style="margin: 0 auto; width: 20px; height: 20px; font-size: 1rem;">➖</div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Populate Retirement Exam (Read Mode)
    document.querySelector('#tableRetirementExam tbody').innerHTML = '';
    if (item.retirementExam && item.retirementExam.length > 0) {
        item.retirementExam.forEach(exam => {
            addRetirementExamRow(exam.date, exam.file);
        });
    }
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
                <div class="icon-download" onclick="alert('Descargando documento...')" style="width: 20px; height: 20px; font-size: 1rem; cursor: pointer;" title="Descargar">⬇️</div>
                <div class="icon-delete" onclick="this.closest('tr').remove()" style="width: 20px; height: 20px; font-size: 1rem; cursor: pointer;" title="Eliminar">➖</div>
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
            <div class="icon-delete" onclick="this.closest('tr').remove()" style="margin: 0 auto; width: 20px; height: 20px; font-size: 1rem;">➖</div>
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
            <div class="icon-delete" onclick="this.closest('tr').remove()" style="margin: 0 auto; width: 20px; height: 20px; font-size: 1rem;">➖</div>
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
        if (item.birthDate) {
            const age = calculateAge(item.birthDate);
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
        const val = item.sex || 'Sin Info';
        sexCount[val] = (sexCount[val] || 0) + 1;
    });
    createChart('sexChart', 'Sexo', Object.keys(sexCount), Object.values(sexCount), 'pie');

    // 3. Civil Status
    const cvCount = {};
    entryData.forEach(item => {
        const val = item.civilStatus || 'Sin Info';
        cvCount[val] = (cvCount[val] || 0) + 1;
    });
    createChart('civilStatusChart', 'Estado Civil', Object.keys(cvCount), Object.values(cvCount), 'bar');

    // 4. Education
    const eduCount = {};
    entryData.forEach(item => {
        const val = item.education || 'Sin Info';
        eduCount[val] = (eduCount[val] || 0) + 1;
    });
    createChart('educationChart', 'Escolaridad', Object.keys(eduCount), Object.values(eduCount), 'bar');

    // 5. Dependents
    const depCount = {};
    entryData.forEach(item => {
        const val = item.dependents || '0';
        depCount[val] = (depCount[val] || 0) + 1;
    });
    createChart('dependentsChart', 'Personas a Cargo', Object.keys(depCount), Object.values(depCount), 'bar');

    // 6. Head Household
    const hhCount = { 'SI': 0, 'NO': 0 };
    entryData.forEach(item => {
        if (item.headHousehold === 'SI') hhCount['SI']++;
        else if (item.headHousehold === 'NO') hhCount['NO']++;
    });
    createChart('headHouseholdChart', 'Cabeza de Familia', Object.keys(hhCount), Object.values(hhCount), 'pie');

    // 7. Children
    const childCount = {};
    entryData.forEach(item => {
        const val = item.children || '0';
        childCount[val] = (childCount[val] || 0) + 1;
    });
    createChart('childrenChart', 'Número de Hijos', Object.keys(childCount), Object.values(childCount), 'bar');

    // 8. Ethnicity
    const ethCount = {};
    entryData.forEach(item => {
        const val = item.ethnicity || 'Ninguno';
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
