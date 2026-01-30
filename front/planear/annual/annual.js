// Mock Data for Annual Plan
let annualData = [
    { id: 1, startDate: '2024-01-15', endDate: '2025-01-15' },
    { id: 2, startDate: '2023-01-01', endDate: '2023-12-31' }
];

const initAnnual = () => {
    renderAnnualList();
};

window.renderAnnualList = () => {
    const tbody = document.querySelector('#tableAnnualList tbody');
    if (!tbody) return;

    if (annualData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 20px;">No hay planes registrados.</td></tr>`;
        return;
    }

    let html = '';
    annualData.forEach(item => {
        html += `<tr>
            <td style="display: flex; gap: 5px;">
                <button class="btn-delete-premium" title="Eliminar" onclick="deleteAnnual(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>Desde: ${item.startDate}- Hasta: ${item.endDate}</td>
            <td>
                <button class="btn-view-premium" title="Ver detalle" onclick="viewAnnual(${item.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
};

window.showCreateAnnual = () => {
    document.getElementById('annualListView').style.display = 'none';
    document.getElementById('annualCreateView').style.display = 'block';
    
    // Calculate Default Dates
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Start Date: First day of current month
    const startDate = new Date(currentYear, currentMonth, 1);
    const startStr = startDate.getFullYear() + '-' + String(startDate.getMonth() + 1).padStart(2, '0') + '-' + String(startDate.getDate()).padStart(2, '0');

    // End Date: Last day of current month, Next Year
    // (month + 1, 0) gives the last day of the current month
    const endDate = new Date(currentYear + 1, currentMonth + 1, 0); 
    const endStr = endDate.getFullYear() + '-' + String(endDate.getMonth() + 1).padStart(2, '0') + '-' + String(endDate.getDate()).padStart(2, '0');

    // Set form values
    document.getElementById('fieldStartDate').value = startStr;
    document.getElementById('fieldEndDate').value = endStr;
};

window.hideCreateAnnual = () => {
    document.getElementById('annualCreateView').style.display = 'none';
    document.getElementById('annualListView').style.display = 'block';
};

window.saveAnnual = () => {
    const start = document.getElementById('fieldStartDate').value;
    const end = document.getElementById('fieldEndDate').value;

    if (!start || !end) {
        Swal.fire('Error', 'Debe seleccionar ambas fechas', 'error');
        return;
    }

    const newItem = {
        id: annualData.length > 0 ? Math.max(...annualData.map(i => i.id)) + 1 : 1,
        startDate: start,
        endDate: end
    };

    annualData.push(newItem);
    renderAnnualList();
    Swal.fire('Guardado', 'Plan Anual guardado correctamente', 'success');
    hideCreateAnnual();
};

window.deleteAnnual = (id) => {
    Swal.fire({
        title: '¿Eliminar Plan?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            annualData = annualData.filter(i => i.id !== id);
            renderAnnualList();
            Swal.fire('Eliminado', 'El plan ha sido eliminado.', 'success');
        }
    });
};

// Mock Data for Activities and Objectives
let objectivesData = [
    { id: 1, planId: 1, category: 'organizational', objective: 'Cumplir con el 90% de las actividades programadas', meta: '90%' }
];

let activitiesData = [
    { 
        id: 1, 
        planId: 1,
        category: 'organizational',
        name: 'Capacitación SST', 
        activity: 'Realizar capacitación de manejo de extintores', 
        responsible: 'Lider SST', 
        resources: 'Humano, Financiero', 
        target: 'Todo el personal', 
        planDate: '2024-03-15', 
        execDate: '', 
        obs: 'Pendiente' 
    },
    { 
        id: 2, 
        planId: 1,
        category: 'medical',
        name: 'Exámenes de Ingreso', 
        activity: 'Realizar exámenes ocupacionales a nuevos', 
        responsible: 'RH', 
        resources: 'Financiero', 
        target: 'Nuevos Ingresos', 
        planDate: '2024-01-20', 
        execDate: '2024-01-22', 
        obs: 'Realizado' 
    }
];

window.viewAnnual = (id) => {
    const plan = annualData.find(i => i.id === id);
    if (!plan) return;

    window.activePlanId = id; // Store for context

    document.getElementById('annualListView').style.display = 'none';
    document.getElementById('annualDetailView').style.display = 'block';
    
    // Set Header
    document.getElementById('detailPeriod').innerText = `Desde: ${plan.startDate} - Hasta: ${plan.endDate}`;
    
    // Render Sections
    const categories = [
        { key: 'organizational', objId: 'tableObjectivesOrganizational', actId: 'tableOrganizational' },
        { key: 'programs', objId: 'tableObjectivesPrograms', actId: 'tablePrograms' },
        { key: 'inspections', objId: 'tableObjectivesInspections', actId: 'tableInspections' },
        { key: 'audits', objId: 'tableObjectivesAudits', actId: 'tableAudits' },
        { key: 'vulnerability', objId: 'tableObjectivesVulnerability', actId: 'tableVulnerability' },
        { key: 'managementRelease', objId: 'tableObjectivesManagementReview', actId: 'tableManagementReview' },
        { key: 'medical', objId: 'tableObjectivesMedicalExams', actId: 'tableMedicalExams' }
    ];

    categories.forEach(cat => {
        renderObjectiveTable(id, cat.key, cat.objId);
        renderActivityTable(id, cat.key, cat.actId);
    });

    // Load Signatures
    const sigs = signaturesData.find(i => i.planId === id);
    if (sigs) {
        document.getElementById('sigName1').value = sigs.s1.name;
        document.getElementById('sigRole1').value = sigs.s1.role;
        if (sigs.s1.imgSrc && sigs.s1.imgSrc.length > 30) { // check if valid src
             document.getElementById('previewSig1').src = sigs.s1.imgSrc;
             document.getElementById('previewSig1').style.display = 'block';
             document.getElementById('placeholderSig1').style.display = 'none';
        } else {
             // Reset
             document.getElementById('previewSig1').src = '';
             document.getElementById('previewSig1').style.display = 'none';
             document.getElementById('placeholderSig1').style.display = 'block';
        }

        document.getElementById('sigName2').value = sigs.s2.name;
        document.getElementById('sigRole2').value = sigs.s2.role;
        if (sigs.s2.imgSrc && sigs.s2.imgSrc.length > 30) {
             document.getElementById('previewSig2').src = sigs.s2.imgSrc;
             document.getElementById('previewSig2').style.display = 'block';
             document.getElementById('placeholderSig2').style.display = 'none';
        } else {
             document.getElementById('previewSig2').src = '';
             document.getElementById('previewSig2').style.display = 'none';
             document.getElementById('placeholderSig2').style.display = 'block';
        }
    } else {
        // Clear signatures
        document.getElementById('sigName1').value = '';
        document.getElementById('sigRole1').value = '';
        document.getElementById('previewSig1').style.display = 'none';
        document.getElementById('placeholderSig1').style.display = 'block';

        document.getElementById('sigName2').value = '';
        document.getElementById('sigRole2').value = '';
        document.getElementById('previewSig2').style.display = 'none';
        document.getElementById('placeholderSig2').style.display = 'block';
    }
};

window.hideAnnualDetail = () => {
    document.getElementById('annualDetailView').style.display = 'none';
    document.getElementById('annualListView').style.display = 'block';
};

const renderObjectiveTable = (planId, category, tableId) => {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;
    
    const relevant = objectivesData.filter(i => i.planId === planId && i.category === category);
    let html = '';
    
    if (relevant.length === 0) {
        html = '<tr><td colspan="3" style="text-align: center; color: #999;">Sin objetivos.</td></tr>';
    } else {
        relevant.forEach(item => {
            html += `<tr>
                <td style="display: flex; gap: 5px;">
                    <button class="btn-delete-premium" onclick="deleteObjective(${item.id})" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="btn-edit-premium" onclick="editObjective(${item.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
                <td>${item.objective}</td>
                <td>${item.meta}</td>
            </tr>`;
        });
    }
    tbody.innerHTML = html;
};

const renderActivityTable = (planId, category, tableId) => {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;
    
    const relevant = activitiesData.filter(i => i.planId === planId && i.category === category);
    let html = '';

    if (relevant.length === 0) {
        html = '<tr><td colspan="9" style="text-align: center; color: #999;">Sin actividades.</td></tr>';
    } else {
        relevant.forEach(item => {
            html += `<tr>
                <td style="display: flex; gap: 5px;">
                    <button class="btn-delete-premium" onclick="deleteActivity(${item.id})" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="btn-edit-premium" onclick="editActivity(${item.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
                <td>${item.name}</td>
                <td>${item.activity}</td>
                <td>${item.responsible}</td>
                <td>${item.resources}</td>
                <td>${item.target}</td>
                <td>${item.planDate}</td>
                <td>${item.execDate}</td>
                <td>${item.obs}</td>
            </tr>`;
        });
    }
    tbody.innerHTML = html;
};

// Helper to get Table ID by category
const getTableIds = (category) => {
    const map = {
        'organizational': { obj: 'tableObjectivesOrganizational', act: 'tableOrganizational' },
        'programs': { obj: 'tableObjectivesPrograms', act: 'tablePrograms' },
        'inspections': { obj: 'tableObjectivesInspections', act: 'tableInspections' },
        'audits': { obj: 'tableObjectivesAudits', act: 'tableAudits' },
        'vulnerability': { obj: 'tableObjectivesVulnerability', act: 'tableVulnerability' },
        'managementRelease': { obj: 'tableObjectivesManagementReview', act: 'tableManagementReview' },
        'medical': { obj: 'tableObjectivesMedicalExams', act: 'tableMedicalExams' }
    };
    return map[category] || { obj: null, act: null };
};

window.addObjective = (category) => {
    // Store context
    document.getElementById('objCategoryContext').value = category;
    document.getElementById('objEditId').value = ''; // Clear edit ID
    
    // Reset fields
    document.getElementById('fieldObjective').value = '';
    document.getElementById('fieldMeta').value = '';

    // Switch Views
    document.getElementById('annualDetailView').style.display = 'none';
    document.getElementById('annualObjectiveView').style.display = 'block';
};

window.hideObjectiveView = () => {
    document.getElementById('annualObjectiveView').style.display = 'none';
    document.getElementById('annualDetailView').style.display = 'block';
};

window.saveObjective = () => {
    const category = document.getElementById('objCategoryContext').value;
    const editId = document.getElementById('objEditId').value;
    const objective = document.getElementById('fieldObjective').value;
    const meta = document.getElementById('fieldMeta').value;
    
    if (!objective || !meta) {
        Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
        return;
    }

    if (editId) {
        // Update existing
        const index = objectivesData.findIndex(i => i.id == editId);
        if (index > -1) {
            objectivesData[index].objective = objective;
            objectivesData[index].meta = meta;
            // Category stays/updates? Usually stays.
            Swal.fire('Actualizado', 'Objetivo actualizado correctamente', 'success');
        }
    } else {
        // Create new
        const newItem = {
            id: objectivesData.length > 0 ? Math.max(...objectivesData.map(i => i.id)) + 1 : 1,
            planId: window.activePlanId,
            category: category,
            objective: objective,
            meta: meta
        };
        objectivesData.push(newItem);
        Swal.fire('Guardado', 'Objetivo agregado correctamente', 'success');
    }
    
    // Refresh table
    const tableId = getTableIds(category).obj;
    renderObjectiveTable(window.activePlanId, category, tableId);
    
    hideObjectiveView();
};

window.editObjective = (id) => {
    const item = objectivesData.find(i => i.id === id);
    if (!item) return;

    document.getElementById('objCategoryContext').value = item.category;
    document.getElementById('objEditId').value = item.id;
    document.getElementById('fieldObjective').value = item.objective;
    document.getElementById('fieldMeta').value = item.meta;

    document.getElementById('annualDetailView').style.display = 'none';
    document.getElementById('annualObjectiveView').style.display = 'block';
};

// (getTableIds moved to top)

window.deleteObjective = (id) => {
    Swal.fire({
        title: '¿Eliminar Objetivo?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            const item = objectivesData.find(i => i.id === id);
            if (item) {
                objectivesData = objectivesData.filter(i => i.id !== id);
                const tableId = getTableIds(item.category).obj;
                if (tableId) {
                    renderObjectiveTable(item.planId, item.category, tableId);
                }
                Swal.fire('Eliminado', 'El objetivo ha sido eliminado.', 'success');
            }
        }
    });
};

// editObjective moved to top/merged


window.deleteActivity = (id) => {
     Swal.fire({
        title: '¿Eliminar Actividad?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            const item = activitiesData.find(i => i.id === id);
            if (item) {
                activitiesData = activitiesData.filter(i => i.id !== id);
                const tableId = getTableIds(item.category).act;
                if (tableId) {
                    renderActivityTable(item.planId, item.category, tableId);
                }
                Swal.fire('Eliminado', 'La actividad ha sido eliminada.', 'success');
            }
        }
    });
};

window.editActivity = (id) => {
    const item = activitiesData.find(i => i.id === id);
    if (!item) return;

    document.getElementById('actCategoryContext').value = item.category;
    document.getElementById('actEditId').value = item.id;
    document.getElementById('fieldActName').value = item.name;
    document.getElementById('fieldActActivity').value = item.activity;
    document.getElementById('fieldActResponsible').value = item.responsible;
    document.getElementById('fieldActResources').value = item.resources;
    document.getElementById('fieldActTarget').value = item.target;
    document.getElementById('fieldActPlanDate').value = item.planDate;
    document.getElementById('fieldActExecDate').value = item.execDate;
    document.getElementById('fieldActObs').value = item.obs;

    document.getElementById('annualDetailView').style.display = 'none';
    document.getElementById('annualActivityView').style.display = 'block';
};

window.addActivity = (category) => {
    // Store context
    document.getElementById('actCategoryContext').value = category;
    document.getElementById('actEditId').value = ''; // Clear ID
    
    // Reset fields
    document.getElementById('fieldActName').value = '';
    document.getElementById('fieldActActivity').value = '';
    document.getElementById('fieldActResponsible').value = '';
    document.getElementById('fieldActResources').value = '';
    document.getElementById('fieldActTarget').value = '';
    document.getElementById('fieldActPlanDate').value = '';
    document.getElementById('fieldActExecDate').value = '';
    document.getElementById('fieldActObs').value = '';

    // Switch Views
    document.getElementById('annualDetailView').style.display = 'none';
    document.getElementById('annualActivityView').style.display = 'block';
};

window.hideActivityView = () => {
    document.getElementById('annualActivityView').style.display = 'none';
    document.getElementById('annualDetailView').style.display = 'block';
};

window.saveActivity = () => {
    const category = document.getElementById('actCategoryContext').value;
    const editId = document.getElementById('actEditId').value;
    const name = document.getElementById('fieldActName').value;
    const activity = document.getElementById('fieldActActivity').value;
    const responsible = document.getElementById('fieldActResponsible').value;
    const resources = document.getElementById('fieldActResources').value;
    const target = document.getElementById('fieldActTarget').value;
    const planDate = document.getElementById('fieldActPlanDate').value;
    const execDate = document.getElementById('fieldActExecDate').value;
    const obs = document.getElementById('fieldActObs').value;

    if (!name || !activity || !responsible) {
        Swal.fire('Error', 'Nombre, Actividad y Responsable son obligatorios', 'error');
        return;
    }

    if (editId) {
        // Update
        const index = activitiesData.findIndex(i => i.id == editId);
        if (index > -1) {
            activitiesData[index].name = name;
            activitiesData[index].activity = activity;
            activitiesData[index].responsible = responsible;
            activitiesData[index].resources = resources;
            activitiesData[index].target = target;
            activitiesData[index].planDate = planDate;
            activitiesData[index].execDate = execDate;
            activitiesData[index].obs = obs;
            Swal.fire('Actualizado', 'Actividad actualizada correctamente', 'success');
        }
    } else {
        // Create
        const newItem = {
            id: activitiesData.length > 0 ? Math.max(...activitiesData.map(i => i.id)) + 1 : 1,
            planId: window.activePlanId,
            category: category,
            name: name,
            activity: activity,
            responsible: responsible,
            resources: resources,
            target: target,
            planDate: planDate,
            execDate: execDate,
            obs: obs
        };
        activitiesData.push(newItem);
        Swal.fire('Guardado', 'Actividad agregada correctamente', 'success');
    }

    const tableId = getTableIds(category).act;
    const tr = renderActivityTable(window.activePlanId, category, tableId);
    
    hideActivityView();
};

// Signatures Data
let signaturesData = [];

window.saveSignatures = () => {
    const planId = window.activePlanId;
    if (!planId) return;

    // Get values
    const s1 = {
        name: document.getElementById('sigName1').value,
        role: document.getElementById('sigRole1').value,
        imgSrc: document.getElementById('previewSig1').src
    };
    const s2 = {
        name: document.getElementById('sigName2').value,
        role: document.getElementById('sigRole2').value,
        imgSrc: document.getElementById('previewSig2').src
    };

    // Upsert
    const existingIndex = signaturesData.findIndex(i => i.planId === planId);
    if (existingIndex > -1) {
        signaturesData[existingIndex].s1 = s1;
        signaturesData[existingIndex].s2 = s2;
    } else {
        signaturesData.push({ planId, s1, s2 });
    }

    Swal.fire('Guardado', 'Firmas guardadas correctamente', 'success');
};

window.handleSignatureSelect = (input, imgId, placeholderId) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(imgId).src = e.target.result;
            document.getElementById(imgId).style.display = 'block';
            document.getElementById(placeholderId).style.display = 'none';
        }
        reader.readAsDataURL(input.files[0]);
    }
};

window.printAnnual = () => {
    window.print();
};

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initAnnual);
} else {
    initAnnual();
}
