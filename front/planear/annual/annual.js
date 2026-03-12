import config from "../../js/config.js";

const API_URL = `${config.BASE_API_URL}annual.php`;

// State
let annualData = [];
let activeFullPlan = null;
let activePlanId = null;
let idEmpresa = null;
let token = null;

const initAnnual = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        token = user.token;
        await loadAnnualPlans();
    } else {
        Swal.fire('Error', 'No se ha encontrado la sesión de la empresa.', 'error');
    }
};

const loadAnnualPlans = async () => {
    try {
        const res = await fetch(`${API_URL}?idEmpresa=${idEmpresa}`);
        annualData = await res.json();
        renderAnnualList();
    } catch (err) {
        console.error('Error loading plans:', err);
    }
};

window.renderAnnualList = () => {
    const tbody = document.querySelector('#tableAnnualList tbody');
    if (!tbody) return;

    if (!Array.isArray(annualData) || annualData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 20px;">No hay planes registrados.</td></tr>`;
        return;
    }

    let html = '';
    annualData.forEach(item => {
        html += `<tr>
            <td style="display: flex; gap: 5px;">
                <button class="btn-delete-premium" title="Eliminar" onclick="deleteAnnual(${item.idPlan})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>Desde: ${item.startDate} - Hasta: ${item.endDate}</td>
            <td>
                <button class="btn-view-premium" title="Ver detalle" onclick="viewAnnual(${item.idPlan})">
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
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startDate = new Date(currentYear, currentMonth, 1);
    const startStr = startDate.getFullYear() + '-' + String(startDate.getMonth() + 1).padStart(2, '0') + '-' + String(startDate.getDate()).padStart(2, '0');

    const endDate = new Date(currentYear + 1, currentMonth + 1, 0); 
    const endStr = endDate.getFullYear() + '-' + String(endDate.getMonth() + 1).padStart(2, '0') + '-' + String(endDate.getDate()).padStart(2, '0');

    document.getElementById('fieldStartDate').value = startStr;
    document.getElementById('fieldEndDate').value = endStr;
};

window.hideCreateAnnual = () => {
    document.getElementById('annualCreateView').style.display = 'none';
    document.getElementById('annualListView').style.display = 'block';
};

window.saveAnnual = async () => {
    const start = document.getElementById('fieldStartDate').value;
    const end = document.getElementById('fieldEndDate').value;

    if (!start || !end) {
        Swal.fire('Error', 'Debe seleccionar ambas fechas', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}?action=savePlan`, {
            method: 'POST',
            body: JSON.stringify({
                token,
                idEmpresa,
                startDate: start,
                endDate: end
            })
        });
        const resp = await res.json();
        
        if (resp.status === 'ok') {
            await loadAnnualPlans();
            Swal.fire('Guardado', 'Plan Anual guardado correctamente', 'success');
            hideCreateAnnual();
        } else {
            Swal.fire('Error', resp.result.error_msg || 'Error al guardar', 'error');
        }
    } catch (err) {
        console.error('Save error:', err);
        Swal.fire('Error', 'Error de conexión', 'error');
    }
};

window.deleteAnnual = (id) => {
    Swal.fire({
        title: '¿Eliminar Plan?',
        text: "Esta acción no se puede deshacer y borrará todos los objetivos y actividades asociados.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}?action=deletePlan`, {
                    method: 'DELETE',
                    body: JSON.stringify({ token, idPlan: id })
                });
                const resp = await res.json();
                if (resp.status === 'ok') {
                    await loadAnnualPlans();
                    Swal.fire('Eliminado', 'El plan ha sido eliminado.', 'success');
                }
            } catch (err) {
                console.error('Delete error:', err);
            }
        }
    });
};

window.viewAnnual = async (id) => {
    try {
        const res = await fetch(`${API_URL}?idPlan=${id}`);
        activeFullPlan = await res.json();
        activePlanId = id;

        document.getElementById('annualListView').style.display = 'none';
        document.getElementById('annualDetailView').style.display = 'block';
        
        document.getElementById('detailPeriod').innerText = `Desde: ${activeFullPlan.startDate} - Hasta: ${activeFullPlan.endDate}`;
        
        renderAllSections();
        loadSignaturesUI();
    } catch (err) {
        console.error('View error:', err);
    }
};

const renderAllSections = () => {
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
        renderObjectiveTableUI(cat.key, cat.objId);
        renderActivityTableUI(cat.key, cat.actId);
    });
};

const loadSignaturesUI = () => {
    const sigs = activeFullPlan.signatures;
    if (sigs) {
        document.getElementById('sigName1').value = sigs.name1 || '';
        document.getElementById('sigRole1').value = sigs.role1 || '';
        if (sigs.imgSrc1 && sigs.imgSrc1.length > 30) {
             document.getElementById('previewSig1').src = sigs.imgSrc1;
             document.getElementById('previewSig1').style.display = 'block';
             document.getElementById('placeholderSig1').style.display = 'none';
        } else {
             resetSigUI(1);
        }

        document.getElementById('sigName2').value = sigs.name2 || '';
        document.getElementById('sigRole2').value = sigs.role2 || '';
        if (sigs.imgSrc2 && sigs.imgSrc2.length > 30) {
             document.getElementById('previewSig2').src = sigs.imgSrc2;
             document.getElementById('previewSig2').style.display = 'block';
             document.getElementById('placeholderSig2').style.display = 'none';
        } else {
             resetSigUI(2);
        }
    } else {
        document.getElementById('sigName1').value = '';
        document.getElementById('sigRole1').value = '';
        resetSigUI(1);
        document.getElementById('sigName2').value = '';
        document.getElementById('sigRole2').value = '';
        resetSigUI(2);
    }
};

const resetSigUI = (num) => {
    document.getElementById(`previewSig${num}`).src = '';
    document.getElementById(`previewSig${num}`).style.display = 'none';
    document.getElementById(`placeholderSig${num}`).style.display = 'block';
};

window.hideAnnualDetail = () => {
    document.getElementById('annualDetailView').style.display = 'none';
    document.getElementById('annualListView').style.display = 'block';
};

const renderObjectiveTableUI = (category, tableId) => {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;
    
    const relevant = activeFullPlan.objectives.filter(i => i.category === category);
    let html = '';
    
    if (relevant.length === 0) {
        html = '<tr><td colspan="3" style="text-align: center; color: #999;">Sin objetivos.</td></tr>';
    } else {
        relevant.forEach(item => {
            html += `<tr>
                <td style="display: flex; gap: 5px;">
                    <button class="btn-delete-premium" onclick="deleteObjective(${item.idObjective})" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="btn-edit-premium" onclick="editObjective(${item.idObjective})" title="Editar">
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

const renderActivityTableUI = (category, tableId) => {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;
    
    const relevant = activeFullPlan.activities.filter(i => i.category === category);
    let html = '';

    if (relevant.length === 0) {
        html = '<tr><td colspan="10" style="text-align: center; color: #999;">Sin actividades.</td></tr>';
    } else {
        relevant.forEach(item => {
            html += `<tr>
                <td style="display: flex; gap: 5px;">
                    <button class="btn-delete-premium" onclick="deleteActivity(${item.idActivity})" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="btn-edit-premium" onclick="editActivity(${item.idActivity})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
                <td>${item.name}</td>
                <td>${item.activity}</td>
                <td>${item.responsible}</td>
                <td>${item.resources}</td>
                <td>${item.target}</td>
                <td>${item.planDate}</td>
                <td>${item.execDate || 'N/A'}</td>
                <td>${item.obs}</td>
            </tr>`;
        });
    }
    tbody.innerHTML = html;
};

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
    document.getElementById('objCategoryContext').value = category;
    document.getElementById('objEditId').value = '';
    document.getElementById('fieldObjective').value = '';
    document.getElementById('fieldMeta').value = '';
    document.getElementById('annualDetailView').style.display = 'none';
    document.getElementById('annualObjectiveView').style.display = 'block';
};

window.hideObjectiveView = () => {
    document.getElementById('annualObjectiveView').style.display = 'none';
    document.getElementById('annualDetailView').style.display = 'block';
};

window.saveObjective = async () => {
    const category = document.getElementById('objCategoryContext').value;
    const editId = document.getElementById('objEditId').value;
    const objective = document.getElementById('fieldObjective').value;
    const meta = document.getElementById('fieldMeta').value;
    
    if (!objective || !meta) {
        Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}?action=saveObjective`, {
            method: 'POST',
            body: JSON.stringify({
                token,
                idPlan: activePlanId,
                idObjective: editId,
                category,
                objective,
                meta
            })
        });
        const resp = await res.json();
        if (resp.status === 'ok') {
            await refreshDetail();
            Swal.fire('Guardado', 'Objetivo guardado correctamente', 'success');
            hideObjectiveView();
        }
    } catch (err) {
        console.error('Obj save error:', err);
    }
};

window.editObjective = (id) => {
    const item = activeFullPlan.objectives.find(i => i.idObjective == id);
    if (!item) return;

    document.getElementById('objCategoryContext').value = item.category;
    document.getElementById('objEditId').value = item.idObjective;
    document.getElementById('fieldObjective').value = item.objective;
    document.getElementById('fieldMeta').value = item.meta;

    document.getElementById('annualDetailView').style.display = 'none';
    document.getElementById('annualObjectiveView').style.display = 'block';
};

window.deleteObjective = (id) => {
    Swal.fire({
        title: '¿Eliminar Objetivo?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}?action=deleteObjective`, {
                    method: 'DELETE',
                    body: JSON.stringify({ token, idObjective: id })
                });
                const resp = await res.json();
                if (resp.status === 'ok') {
                    await refreshDetail();
                    Swal.fire('Eliminado', 'El objetivo ha sido eliminado.', 'success');
                }
            } catch (err) {
                console.error('Obj delete error:', err);
            }
        }
    });
};

window.addActivity = (category) => {
    document.getElementById('actCategoryContext').value = category;
    document.getElementById('actEditId').value = '';
    document.getElementById('fieldActName').value = '';
    document.getElementById('fieldActActivity').value = '';
    document.getElementById('fieldActResponsible').value = '';
    document.getElementById('fieldActResources').value = '';
    document.getElementById('fieldActTarget').value = '';
    document.getElementById('fieldActPlanDate').value = '';
    document.getElementById('fieldActExecDate').value = '';
    document.getElementById('fieldActObs').value = '';
    document.getElementById('annualDetailView').style.display = 'none';
    document.getElementById('annualActivityView').style.display = 'block';
};

window.hideActivityView = () => {
    document.getElementById('annualActivityView').style.display = 'none';
    document.getElementById('annualDetailView').style.display = 'block';
};

window.saveActivity = async () => {
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

    try {
        const res = await fetch(`${API_URL}?action=saveActivity`, {
            method: 'POST',
            body: JSON.stringify({
                token,
                idPlan: activePlanId,
                idActivity: editId,
                category,
                name,
                activity,
                responsible,
                resources,
                target,
                planDate,
                execDate,
                obs
            })
        });
        const resp = await res.json();
        if (resp.status === 'ok') {
            await refreshDetail();
            Swal.fire('Guardado', 'Actividad guardada correctamente', 'success');
            hideActivityView();
        }
    } catch (err) {
        console.error('Act save error:', err);
    }
};

window.editActivity = (id) => {
    const item = activeFullPlan.activities.find(i => i.idActivity == id);
    if (!item) return;

    document.getElementById('actCategoryContext').value = item.category;
    document.getElementById('actEditId').value = item.idActivity;
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

window.deleteActivity = (id) => {
    Swal.fire({
        title: '¿Eliminar Actividad?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}?action=deleteActivity`, {
                    method: 'DELETE',
                    body: JSON.stringify({ token, idActivity: id })
                });
                const resp = await res.json();
                if (resp.status === 'ok') {
                    await refreshDetail();
                    Swal.fire('Eliminado', 'La actividad ha sido eliminada.', 'success');
                }
            } catch (err) {
                console.error('Act delete error:', err);
            }
        }
    });
};

window.saveSignatures = async () => {
    if (!activePlanId) return;

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

    try {
        const res = await fetch(`${API_URL}?action=saveSignatures`, {
            method: 'POST',
            body: JSON.stringify({
                token,
                idPlan: activePlanId,
                name1: s1.name,
                role1: s1.role,
                imgSrc1: s1.imgSrc,
                name2: s2.name,
                role2: s2.role,
                imgSrc2: s2.imgSrc
            })
        });
        const resp = await res.json();
        if (resp.status === 'ok') {
            Swal.fire('Guardado', 'Firmas guardadas correctamente', 'success');
        }
    } catch (err) {
        console.error('Sig save error:', err);
    }
};

const refreshDetail = async () => {
    if (!activePlanId) return;
    const res = await fetch(`${API_URL}?idPlan=${activePlanId}`);
    activeFullPlan = await res.json();
    renderAllSections();
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

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initAnnual);
} else {
    initAnnual();
}
