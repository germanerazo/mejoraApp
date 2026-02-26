import config from "../../js/config.js";

const API_URL = `${config.BASE_API_URL}strategic.php`;

let idEmpresa = null;
let strategicData = {
    policy: {
        idPlan: null,
        name: "",
        date: new Date().toISOString().split('T')[0],
        status: "",
        nature: "",
        content: ""
    },
    principles: [],
    objectives: []
};

// Initialization
const initStrategic = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        loadStrategicData();
    } else {
        Swal.fire('Error', 'No se ha encontrado la sesión de la empresa.', 'error');
    }
};

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initStrategic);
} else {
    initStrategic();
}

function loadStrategicData() {
    fetch(`${API_URL}?idEmpresa=${idEmpresa}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.policy) {
                strategicData.policy = data.policy;
                strategicData.principles = data.principles || [];
                strategicData.objectives = data.objectives || [];
            } else {
                // If it doesn't exist yet for the company, initialize empty structure
                strategicData.policy = {
                    idPlan: null,
                    name: "",
                    date: new Date().toISOString().split('T')[0],
                    status: "Activo",
                    nature: "",
                    content: ""
                };
                strategicData.principles = [];
                strategicData.objectives = [];
            }
            populateForm();
        })
        .catch(err => {
            console.error('Error loading strategic data:', err);
            Swal.fire('Error', 'Ocurrió un error al cargar la información', 'error');
        });
}

function populateForm() {
    const polName = document.getElementById('policyName');
    if (polName && strategicData.policy) {
        polName.value = strategicData.policy.name || "";
        document.getElementById('policyDate').value = strategicData.policy.date || new Date().toISOString().split('T')[0];
        document.getElementById('policyStatus').value = strategicData.policy.status || "Activo";
        document.getElementById('policyNature').value = strategicData.policy.nature || "";
        document.getElementById('policyContent').value = strategicData.policy.content || "";
        
        // Show sections if policy has an ID (already saved in DB)
        if (strategicData.policy.idPlan) {
            document.getElementById('principlesSection').style.display = 'block';
            document.getElementById('objectivesSection').style.display = 'block';
            document.getElementById('btnPrint').style.display = 'inline-block';
        } else {
            document.getElementById('principlesSection').style.display = 'none';
            document.getElementById('objectivesSection').style.display = 'none';
            document.getElementById('btnPrint').style.display = 'none';
        }

        renderPrinciples();
        renderObjectives();
    }
}

// Global Functions
window.generatePolicyText = function() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const companyName = user ? (user.nomEmpresa || "La Empresa") : "La Empresa";
    const nature = document.getElementById('policyNature').value || "{Naturaleza}";

    const text = `${companyName}, es una organizacion dedicada a ${nature}; incluyendo contratistas y subcontratistas. En su compromiso permanente, por desarrollar sus actividades de una manera segura mediante la implementacion del SG - SST, reduciendo al mínimo posibles impactos ambientales y buscando la satisfaccion del cliente, ${companyName}, ha establecido los siguientes principios:`;

    document.getElementById('policyContent').value = text;
};

window.savePolicy = function() {
    const name = document.getElementById('policyName').value;
    const date = document.getElementById('policyDate').value;

    if (!name || !date) {
        Swal.fire('Campos incompletos', 'Por favor, complete el nombre y la fecha de la política.', 'warning');
        return;
    }

    const dataPayload = {
        token: sessionStorage.getItem('token'),
        idEmpresa: idEmpresa,
        name: name,
        date: date,
        status: document.getElementById('policyStatus').value,
        nature: document.getElementById('policyNature').value,
        content: document.getElementById('policyContent').value
    };

    fetch(`${API_URL}?action=savePolicy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPayload)
    })
    .then(res => res.json())
    .then(response => {
        if (response.status === 'ok' || response.result) {
            Swal.fire({
                icon: 'success',
                title: 'Política Guardada',
                text: 'La política ha sido guardada. Ahora puede agregar principios y objetivos.',
                timer: 1500,
                showConfirmButton: false
            });
            // Reload all from db to get newly generated idPlan 
            loadStrategicData();
        } else {
            Swal.fire('Error', response.result?.error_message || 'No se pudo guardar la política', 'error');
        }
    }).catch(console.error);
};

window.printPolicy = function() {
    const policy = strategicData.policy;
    const principles = strategicData.principles;
    const objectives = strategicData.objectives || [];

    let principlesHtml = '';
    if (principles.length > 0) {
        principlesHtml = '<ul>' + principles.map(p => `<li>${p.text}</li>`).join('') + '</ul>';
    } else {
        principlesHtml = '<p>No hay principios registrados.</p>';
    }

    let objectivesHtml = '';
    if (objectives.length > 0) {
        objectivesHtml = '<table style="width:100%; border-collapse: collapse; margin-top: 10px;"><thead><tr><th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Nombre Objetivo</th></tr></thead><tbody>' + 
            objectives.map(o => `<tr><td style="border: 1px solid #ddd; padding: 8px;">${o.text}</td></tr>`).join('') + 
            '</tbody></table>';
    } else {
        objectivesHtml = '<p>No hay objetivos estratégicos registrados.</p>';
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Imprimir Política</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; }
                h1 { text-align: center; color: #333; }
                .policy-content { margin: 30px 0; text-align: justify; }
                .principles-section, .objectives-section { margin: 30px 0; }
                .signature-section { margin-top: 100px; text-align: center; }
                .signature-line { border-top: 1px solid #000; width: 300px; margin: 0 auto; padding-top: 10px; }
            </style>
        </head>
        <body>
            <h1>${policy.name}</h1>
            
            <div class="policy-content">
                ${(policy.content || '').replace(/\n/g, '<br>')}
            </div>

            <div class="principles-section">
                <h3>Principios de la Política</h3>
                ${principlesHtml}
            </div>

            <div class="objectives-section">
                <h3>Objetivos Estratégicos</h3>
                ${objectivesHtml}
            </div>

            <div class="signature-section">
                <div class="signature-line">
                    <strong>Gerente General</strong><br>
                    Firma
                </div>
            </div>
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
};

/* ==========================================================
   PRINCIPLES
========================================================== */
window.addPrinciple = async function() {
    if (!strategicData.policy.idPlan) return Swal.fire('Error', 'Primero guarde la política principal', 'warning');

    const { value: text } = await Swal.fire({
        title: 'Nuevo Principio',
        input: 'textarea',
        inputLabel: 'Descripción del Principio',
        inputPlaceholder: 'Escriba el principio aquí...',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar'
    });

    if (text) {
        fetch(`${API_URL}?action=savePrinciple`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: sessionStorage.getItem('token'),
                idPlan: strategicData.policy.idPlan,
                text: text
            })
        }).then(res => res.json()).then(res => {
            if (res.status === 'ok' || res.result) loadStrategicData();
        });
    }
};

window.editPrinciple = async function(idPrincipio) {
    const principle = strategicData.principles.find(p => p.idPrincipio == idPrincipio);
    if (!principle) return;

    const { value: text } = await Swal.fire({
        title: 'Editar Principio',
        input: 'textarea',
        inputValue: principle.text,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar'
    });

    if (text) {
        fetch(`${API_URL}?action=savePrinciple`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: sessionStorage.getItem('token'),
                idPlan: strategicData.policy.idPlan,
                idPrincipio: idPrincipio,
                text: text
            })
        }).then(res => res.json()).then(res => {
            if (res.status === 'ok' || res.result) loadStrategicData();
        });
    }
};

window.deletePrinciple = function(idPrincipio) {
    Swal.fire({
        title: '¿Eliminar principio?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_URL}?action=deletePrinciple`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: sessionStorage.getItem('token'),
                    idPrincipio: idPrincipio
                })
            }).then(res => res.json()).then(res => {
                if (res.status === 'ok' || res.result) loadStrategicData();
            });
        }
    });
};

function renderPrinciples() {
    const tbody = document.querySelector('#tablePrinciples tbody');
    if (!tbody) return;
    if (!strategicData.principles || strategicData.principles.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" class="empty-state">No hay principios registrados.</td></tr>`;
        return;
    }

    let html = '';
    strategicData.principles.forEach(item => {
        html += `<tr>
            <td style="white-space: nowrap; display: flex; gap: 5px;">
                <button class="btn-edit-premium" title="Editar" onclick="editPrinciple(${item.idPrincipio})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-premium" title="Eliminar" onclick="deletePrinciple(${item.idPrincipio})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.text}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

/* ==========================================================
   OBJECTIVES & INDICATORS
========================================================== */
window.showCreateObjective = function() {
    document.getElementById('mainStrategicView').style.display = 'none';
    document.getElementById('createObjectiveView').style.display = 'block';
    document.getElementById('newObjectiveText').value = '';
};

window.hideCreateObjective = function() {
    document.getElementById('createObjectiveView').style.display = 'none';
    document.getElementById('mainStrategicView').style.display = 'block';
};

window.saveObjective = function() {
    const text = document.getElementById('newObjectiveText').value;
    if (!text) {
        Swal.fire('Error', 'Debe escribir un objetivo', 'error');
        return;
    }

    fetch(`${API_URL}?action=saveObjective`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            token: sessionStorage.getItem('token'),
            idPlan: strategicData.policy.idPlan,
            text: text
        })
    }).then(res => res.json()).then(res => {
        if (res.status === 'ok' || res.result) {
            Swal.fire('Guardado', 'Objetivo agregado correctamente', 'success');
            hideCreateObjective();
            loadStrategicData();
        }
    });
};

window.deleteObjective = function(idObjetivo) {
    Swal.fire({
        title: '¿Eliminar objetivo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_URL}?action=deleteObjective`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: sessionStorage.getItem('token'), idObjetivo: idObjetivo })
            }).then(res => res.json()).then(res => {
                if (res.status === 'ok' || res.result) loadStrategicData();
            });
        }
    });
};

function renderObjectives() {
    const tbody = document.querySelector('#tableObjectives tbody');
    if (!tbody) return;
    if (!strategicData.objectives || strategicData.objectives.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="empty-state">No hay objetivos registrados.</td></tr>`;
        return;
    }

    let html = '';
    strategicData.objectives.forEach(item => {
        html += `<tr>
            <td style="white-space: nowrap; display: flex; gap: 5px;">
                <button class="btn-delete-premium" title="Eliminar" onclick="deleteObjective(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.text}</td>
            <td>
                 <button class="btn-view-premium" title="Ver Indicadores" onclick="showIndicators(${item.id})">
                    <i class="fas fa-chart-line"></i>
                 </button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

window.showIndicators = function(idObjetivo) {
    const objective = strategicData.objectives.find(o => o.id == idObjetivo);
    if (!objective) return;

    document.getElementById('mainStrategicView').style.display = 'none';
    document.getElementById('indicatorsView').style.display = 'block';
    
    document.getElementById('currentObjectiveId').value = idObjetivo;
    document.getElementById('indicatorObjectiveTitle').innerText = `Objetivo: ${objective.text}`;

    const ind = objective.indicator || {};
    document.getElementById('indFormula').value = ind.formula || '';
    document.getElementById('indResponsible').value = ind.responsible || '';
    document.getElementById('indExpected').value = ind.expected || '';
    document.getElementById('indCritical').value = ind.critical || '';
    document.getElementById('indSource').value = ind.source || '';
    document.getElementById('indPeriodicity').value = ind.periodicity || '';
    document.getElementById('indType').value = ind.type || '';
    document.getElementById('indLimitType').value = ind.limitType || '';
    document.getElementById('indTarget').value = ind.target || '';
    document.getElementById('indDate').value = ind.date || new Date().toISOString().split('T')[0];
};

window.hideIndicators = function() {
    document.getElementById('indicatorsView').style.display = 'none';
    document.getElementById('mainStrategicView').style.display = 'block';
};

window.saveIndicator = function() {
    const idObjetivo = parseInt(document.getElementById('currentObjectiveId').value);
    
    const payload = {
        token: sessionStorage.getItem('token'),
        idObjetivo: idObjetivo,
        formula: document.getElementById('indFormula').value,
        responsible: document.getElementById('indResponsible').value,
        expected: document.getElementById('indExpected').value,
        critical: document.getElementById('indCritical').value,
        source: document.getElementById('indSource').value,
        periodicity: document.getElementById('indPeriodicity').value,
        type: document.getElementById('indType').value,
        limitType: document.getElementById('indLimitType').value,
        target: document.getElementById('indTarget').value,
        date: document.getElementById('indDate').value
    };

    fetch(`${API_URL}?action=saveIndicator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(res => res.json()).then(res => {
        if (res.status === 'ok' || res.result) {
            Swal.fire('Guardado', 'Indicador actualizado correctamente', 'success');
            hideIndicators();
            loadStrategicData(); // Refresh nested structure
        } else {
            Swal.fire('Error', 'No se pudo actualizar el indicador', 'error');
        }
    }).catch(console.error);
};