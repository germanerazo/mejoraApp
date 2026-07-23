import config from "../../js/config.js";
import { showLoading, hideLoading } from "../../js/utils.js";

const API_URL = `${config.BASE_API_URL}annual.php`;
const DANGER_API = `${config.BASE_API_URL}dangerMgmt.php`;
const RISK_CONS_API = `${config.BASE_API_URL}riskConsolidation.php`;

// State
let annualData = [];
let activeFullPlan = null;
let activePlanId = null;
let idEmpresa = null;
let annualConsolidationData = []; // Store dynamically generated consolidation records

const getToken = () => sessionStorage.getItem('token');

const initAnnual = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
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
                token: getToken(),
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
                    body: JSON.stringify({ token: getToken(), idPlan: id })
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
        showLoading('Cargando detalle...');

        const riskConsIdEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;

        const [resPlan, resDangers, resProg, resMeasures] = await Promise.all([
            fetch(`${API_URL}?idPlan=${id}`),
            fetch(`${DANGER_API}?action=fullReport&idEmpresa=${idEmpresa}&idPlan=${id}`),
            fetch(`${DANGER_API}?action=getRiskPrograms&idPlan=${id}`),
            fetch(`${RISK_CONS_API}?idEmpresa=${riskConsIdEmpresa}`)
        ]);

        activeFullPlan = await resPlan.json();
        activePlanId = id;
        
        const dangersRaw = await resDangers.json();
        const progData = await resProg.json();
        const measuresResp = await resMeasures.json();

        document.getElementById('annualListView').style.display = 'none';
        document.getElementById('annualDetailView').style.display = 'block';
        
        document.getElementById('detailPeriod').innerText = `Desde: ${activeFullPlan.startDate} - Hasta: ${activeFullPlan.endDate}`;
        
        renderAllSections();
        loadSignaturesUI();
        renderConsolidationPrograms(dangersRaw, progData, measuresResp);
        
        hideLoading();
    } catch (err) {
        console.error('View error:', err);
        hideLoading();
        Swal.fire('Error', 'Error al cargar el detalle del plan', 'error');
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
    
    const addBtn = document.getElementById(`btnAddObj_${category}`);
    if (addBtn) {
        addBtn.style.display = relevant.length > 0 ? 'none' : 'inline-block';
    }

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
    
    // Filter out consolidation activities (they have an external_id) from standard rendering
    const relevant = activeFullPlan.activities.filter(i => i.category === category && !i.external_id);
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
                token: getToken(),
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
                    body: JSON.stringify({ token: getToken(), idObjective: id })
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
                token: getToken(),
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
                    body: JSON.stringify({ token: getToken(), idActivity: id })
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
                token: getToken(),
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

    showLoading('Actualizando...');

    try {
        const riskConsIdEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;

        const [resPlan, resDangers, resProg, resMeasures] = await Promise.all([
            fetch(`${API_URL}?idPlan=${activePlanId}`),
            fetch(`${DANGER_API}?action=fullReport&idEmpresa=${idEmpresa}&idPlan=${activePlanId}`),
            fetch(`${DANGER_API}?action=getRiskPrograms&idPlan=${activePlanId}`),
            fetch(`${RISK_CONS_API}?idEmpresa=${riskConsIdEmpresa}`)
        ]);

        activeFullPlan = await resPlan.json();
        
        const dangersRaw = await resDangers.json();
        const progData = await resProg.json();
        const measuresResp = await resMeasures.json();

        renderAllSections();
        loadSignaturesUI();
        renderConsolidationPrograms(dangersRaw, progData, measuresResp);
        
        hideLoading();
    } catch (err) {
        console.error('Refresh error:', err);
        hideLoading();
        Swal.fire('Error', 'Error al actualizar el detalle', 'error');
    }
};

window.handleSignatureSelect = (input, imgId, placeholderId) => {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Definir resolución máxima para la firma
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = Math.round(height * (MAX_WIDTH / width));
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = Math.round(width * (MAX_HEIGHT / height));
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                let mimeType = file.type;
                if (mimeType === 'image/jpeg') {
                    // Fondo blanco para jpegs para evitar transparencias negras
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                }
                
                ctx.drawImage(img, 0, 0, width, height);
                
                let dataUrl;
                if (mimeType === 'image/jpeg') {
                    dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                } else {
                    // Usar webp para mantener transparencia con compresión, o png como respaldo
                    dataUrl = canvas.toDataURL('image/webp', 0.7);
                    if (dataUrl.indexOf('image/webp') === -1) {
                        dataUrl = canvas.toDataURL('image/png');
                    }
                }

                document.getElementById(imgId).src = dataUrl;
                document.getElementById(imgId).style.display = 'block';
                document.getElementById(placeholderId).style.display = 'none';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

// ── CONSOLIDATION PROGRAMS FOR "PROGRAMAS DE GESTIÓN" ──────────

const renderConsolidationPrograms = (dangersRaw, progData, measuresResp) => {
    const tbody = document.querySelector('#tablePrograms tbody');
    if (!tbody) return;

    try {
        const programMedidas = (measuresResp.status === 'ok' && measuresResp.result) ? measuresResp.result.medidas || [] : [];

        // Build consolidation data merging dangers with their programs
        let consolidationItems = [];
        if (Array.isArray(dangersRaw)) {
            consolidationItems = dangersRaw.map(item => ({
                id: item.adc_id,
                peligro: item.danger_name,
                medidas: item.measures,
                programas: '',
                pve: '',
                subProgramas: ''
            }));

            // Merge with saved programs
            if (Array.isArray(progData)) {
                consolidationItems.forEach(risk => {
                    const found = progData.find(p => parseInt(p.adc_id) === parseInt(risk.id));
                    if (found) {
                        risk.programas = found.programas || '';
                        risk.pve = found.pve || '';
                        risk.subProgramas = found.subProgramas || '';
                    }
                });
            }
        }

        // Filter: only show rows that have at least programas or PVE
        const withPrograms = consolidationItems.filter(item =>
            (item.programas && item.programas.trim() !== '') ||
            (item.pve && item.pve.trim() !== '')
        );

        if (withPrograms.length === 0) return;

        // Reset consolidation cache
        annualConsolidationData = [];
        const existingActivities = activeFullPlan.activities || [];

        // Build rows for each risk with programs
        let html = '';
        withPrograms.forEach(item => {
            // Build "Nombre" column: Programas - SubProgramas
            let nombre = item.programas || '';
            if (item.subProgramas && item.subProgramas.trim() !== '') {
                nombre += nombre ? ' - ' + item.subProgramas : item.subProgramas;
            }

            if (programMedidas.length > 0) {
                // Create one row per medida (each responsable record from riskActions)
                programMedidas.forEach(med => {
                    const cargosText = Array.isArray(med.cargos) && med.cargos.length > 0
                        ? med.cargos.join(', ')
                        : '-';
                    
                    const externalId = `cons_adc${item.id}_med${med.id}`;
                    let execDate = '-';
                    let obs = '-';
                    let dbIdActivity = '';

                    // Check if execution data was saved for this consolidation row
                    const savedRecord = existingActivities.find(a => a.external_id === externalId);
                    if (savedRecord) {
                        execDate = savedRecord.execDate || '-';
                        obs = savedRecord.obs || '-';
                        dbIdActivity = savedRecord.idActivity;
                    }

                    // Save to local cache for editing
                    annualConsolidationData.push({
                        externalId: externalId,
                        dbIdActivity: dbIdActivity,
                        nombre,
                        actividad: med.medida || item.medidas,
                        responsable: med.responsable || '-',
                        recurso: med.recurso || '-',
                        cargosText,
                        fechaPlaneacion: med.fechaPlaneacion || '-',
                        execDate: execDate !== '-' ? execDate : '',
                        obs: obs !== '-' ? obs : ''
                    });

                    let actionButtons = `<button class="btn-edit-premium" onclick="editConsolidationActivity('${externalId}')" title="Editar Ejecución">
                                            <i class="fas fa-edit"></i>
                                         </button>`;
                    if (dbIdActivity) {
                        actionButtons = `<div style="display: flex; gap: 5px; justify-content: center;">
                                            <button class="btn-delete-premium" onclick="deleteActivity(${dbIdActivity})" title="Eliminar Ejecución">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                            <button class="btn-edit-premium" onclick="editConsolidationActivity('${externalId}')" title="Editar Ejecución">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                         </div>`;
                    }

                    html += `<tr style="background-color: #f0f7ff;">
                        <td style="text-align: center;">
                            ${actionButtons}
                        </td>
                        <td style="font-weight: 600; color: #34495e;">${nombre}</td>
                        <td><div style="font-size: 0.95em; line-height: 1.4;">${med.medida || item.medidas}</div></td>
                        <td>${med.responsable || '-'}</td>
                        <td>${med.recurso || '-'}</td>
                        <td>${cargosText}</td>
                        <td>${med.fechaPlaneacion || '-'}</td>
                        <td>${execDate}</td>
                        <td>${obs}</td>
                    </tr>`;
                });
            } else {
                // No medidas: show a single row with empty fields
                const externalId = `cons_adc${item.id}_nomed`;
                let execDate = '-';
                let obs = '-';
                let dbIdActivity = '';

                const savedRecord = existingActivities.find(a => a.external_id === externalId);
                if (savedRecord) {
                    execDate = savedRecord.execDate || '-';
                    obs = savedRecord.obs || '-';
                    dbIdActivity = savedRecord.idActivity;
                }

                annualConsolidationData.push({
                    externalId: externalId,
                    dbIdActivity: dbIdActivity,
                    nombre,
                    actividad: item.medidas,
                    responsable: '-',
                    recurso: '-',
                    cargosText: '-',
                    fechaPlaneacion: '-',
                    execDate: execDate !== '-' ? execDate : '',
                    obs: obs !== '-' ? obs : ''
                });

                let actionButtons = `<button class="btn-edit-premium" onclick="editConsolidationActivity('${externalId}')" title="Editar Ejecución">
                                        <i class="fas fa-edit"></i>
                                     </button>`;
                if (dbIdActivity) {
                    actionButtons = `<div style="display: flex; gap: 5px; justify-content: center;">
                                        <button class="btn-delete-premium" onclick="deleteActivity(${dbIdActivity})" title="Eliminar Ejecución">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                        <button class="btn-edit-premium" onclick="editConsolidationActivity('${externalId}')" title="Editar Ejecución">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                     </div>`;
                }

                html += `<tr style="background-color: #f0f7ff;">
                    <td style="text-align: center;">
                        ${actionButtons}
                    </td>
                    <td style="font-weight: 600; color: #34495e;">${nombre}</td>
                    <td><div style="font-size: 0.95em; line-height: 1.4;">${item.medidas}</div></td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>${execDate}</td>
                    <td>${obs}</td>
                </tr>`;
            }
        });

        // Append consolidation rows after the existing manual activities
        tbody.innerHTML += html;
    } catch (err) {
        console.error('Error loading consolidation programs:', err);
    }
};

window.printAnnual = () => {
    window.print();
};

window.editConsolidationActivity = (externalId) => {
    const item = annualConsolidationData.find(i => i.externalId === externalId);
    if (!item) return;

    document.getElementById('consExternalId').value = item.externalId;
    document.getElementById('consEditId').value = item.dbIdActivity;
    
    // Read only fields
    document.getElementById('consFieldName').value = item.nombre;
    document.getElementById('consFieldActivity').value = item.actividad;
    document.getElementById('consFieldResponsible').value = item.responsable;
    document.getElementById('consFieldResources').value = item.recurso;
    document.getElementById('consFieldTarget').value = item.cargosText;
    document.getElementById('consFieldPlanDate').value = item.fechaPlaneacion;
    
    // Editable fields
    document.getElementById('consFieldExecDate').value = item.execDate;
    document.getElementById('consFieldObs').value = item.obs;

    document.getElementById('annualDetailView').style.display = 'none';
    document.getElementById('annualConsolidationEditView').style.display = 'block';
};

window.hideConsolidationEditView = () => {
    document.getElementById('annualConsolidationEditView').style.display = 'none';
    document.getElementById('annualDetailView').style.display = 'block';
};

window.saveConsolidationActivity = async () => {
    const externalId = document.getElementById('consExternalId').value;
    const idActivity = document.getElementById('consEditId').value;
    
    const execDate = document.getElementById('consFieldExecDate').value;
    const obs = document.getElementById('consFieldObs').value;

    const name = document.getElementById('consFieldName').value;
    const activity = document.getElementById('consFieldActivity').value;
    const responsible = document.getElementById('consFieldResponsible').value;
    const resources = document.getElementById('consFieldResources').value;
    const target = document.getElementById('consFieldTarget').value;
    const planDate = document.getElementById('consFieldPlanDate').value;

    try {
        const res = await fetch(`${API_URL}?action=saveActivity`, {
            method: 'POST',
            body: JSON.stringify({
                token: getToken(),
                idPlan: activePlanId,
                category: 'programs',
                idActivity: idActivity,
                external_id: externalId,
                name: name,
                activity: activity,
                responsible: responsible,
                resources: resources,
                target: target,
                planDate: planDate,
                execDate: execDate,
                obs: obs
            })
        });
        const resp = await res.json();
        if (resp.status === 'ok') {
            await refreshDetail();
            Swal.fire('Guardado', 'Ejecución guardada.', 'success');
            hideConsolidationEditView();
        } else {
            Swal.fire('Error', resp.result.error_msg || 'Error al guardar', 'error');
        }
    } catch (err) {
        console.error('Consolidation save error:', err);
        Swal.fire('Error', 'Error de conexión', 'error');
    }
};

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initAnnual);
} else {
    initAnnual();
}
