// Mock Data
let strategicData = {
    policy: {
        name: "Política del Sistema de Gestión Integrado",
        date: new Date().toISOString().split('T')[0],
        status: "Activo",
        nature: "la consultoría en seguridad y salud en el trabajo",
        content: ""
    },
    principles: []
};

// Initialization
const initStrategic = () => {
    // Populate Policy
    const polName = document.getElementById('policyName');
    if (polName) {
        polName.value = strategicData.policy.name;
        document.getElementById('policyDate').value = strategicData.policy.date;
        document.getElementById('policyStatus').value = strategicData.policy.status;
        document.getElementById('policyNature').value = strategicData.policy.nature;
    
        // Initial Text Generation if empty
        if (!strategicData.policy.content) {
            generatePolicyText();
        } else {
            document.getElementById('policyContent').value = strategicData.policy.content;
        }
        
        // Show sections if policy appears saved (has name)
        if (strategicData.policy.name) {
             document.getElementById('principlesSection').style.display = 'block';
             document.getElementById('objectivesSection').style.display = 'block';
             document.getElementById('btnPrint').style.display = 'inline-block';
        }

        // Render Principles if any
        if (strategicData.principles.length > 0) {
            renderPrinciples();
        }

        // Render Objectives if any
        if (strategicData.objectives && strategicData.objectives.length > 0) {
            renderObjectives();
        }
    }
};

// Global Functions
window.generatePolicyText = function() {
    const companyName = "Dinamik Zona Franca S.A.S"; // In real app, get from session/auth
    const nature = document.getElementById('policyNature').value || "{Naturaleza}";

    const text = `${companyName}, es una organizacion dedicada a ${nature}; incluyendo contratistas y subcontratistas. En su compromiso permanente, por desarrollar sus actividades de una manera segura mediante la implementacion del SG - SST, reduciendo al mínimo posibles impactos ambientales y buscando la satisfaccion del cliente, ${companyName}, ha establecido los siguientes principios:`;

    document.getElementById('policyContent').value = text;
};

window.savePolicy = function() {
    const name = document.getElementById('policyName').value;
    const date = document.getElementById('policyDate').value;

    if (!name || !date) {
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor, complete el nombre y la fecha de la política.',
        });
        return;
    }

    strategicData.policy = {
        name: name,
        date: date,
        status: document.getElementById('policyStatus').value,
        nature: document.getElementById('policyNature').value,
        content: document.getElementById('policyContent').value
    };

    // Reveal Principles Section, Objectives Section and Print Button
    document.getElementById('principlesSection').style.display = 'block';
    document.getElementById('objectivesSection').style.display = 'block';
    document.getElementById('btnPrint').style.display = 'inline-block';

    renderObjectives();

    Swal.fire({
        icon: 'success',
        title: 'Política Guardada',
        text: 'La política ha sido guardada. Ahora puede agregar principios y objetivos.',
        timer: 1500,
        showConfirmButton: false
    });
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
                ${policy.content.replace(/\n/g, '<br>')}
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

// Objectives Logic
window.showCreateObjective = function() {
    document.getElementById('mainStrategicView').style.display = 'none';
    document.getElementById('createObjectiveView').style.display = 'block';
    
    // Clear form
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

    if (!strategicData.objectives) strategicData.objectives = [];
    
    strategicData.objectives.push({
        id: Date.now(),
        text: text
    });

    renderObjectives();
    hideCreateObjective();
    Swal.fire('Guardado', 'Objetivo agregado correctamente', 'success');
};

window.deleteObjective = function(id) {
    Swal.fire({
        title: '¿Eliminar objetivo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            strategicData.objectives = strategicData.objectives.filter(o => o.id !== id);
            renderObjectives();
            Swal.fire('Eliminado', '', 'success');
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

// Indicator Logic
window.showIndicators = function(objectiveId) {
    const objective = strategicData.objectives.find(o => o.id === objectiveId);
    if (!objective) return;

    // View Switching
    document.getElementById('mainStrategicView').style.display = 'none';
    document.getElementById('indicatorsView').style.display = 'block';

    // Set Context
    document.getElementById('currentObjectiveId').value = objectiveId;
    document.getElementById('indicatorObjectiveTitle').innerText = `Objetivo: ${objective.text}`;

    // Populate Data (if exists)
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
    const objectiveId = parseInt(document.getElementById('currentObjectiveId').value);
    const objective = strategicData.objectives.find(o => o.id === objectiveId);
    
    if (!objective) return;

    objective.indicator = {
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

    hideIndicators();
    Swal.fire('Guardado', 'Indicador actualizado correctamente', 'success');
};

window.addPrinciple = async function() {
    const { value: text } = await Swal.fire({
        title: 'Nuevo Principio',
        input: 'textarea',
        inputLabel: 'Descripción del Principio',
        inputPlaceholder: 'Escriba el principio aquí...',
        inputAttributes: {
            'aria-label': 'Escriba el principio aquí'
        },
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar'
    });

    if (text) {
        strategicData.principles.push({
            id: Date.now(),
            text: text
        });
        renderPrinciples();
        Swal.fire('Agregado', '', 'success');
    }
};

window.editPrinciple = async function(id) {
    const principle = strategicData.principles.find(p => p.id === id);
    if (!principle) return;

    const { value: text } = await Swal.fire({
        title: 'Editar Principio',
        input: 'textarea',
        inputLabel: 'Descripción del Principio',
        inputValue: principle.text,
        inputPlaceholder: 'Escriba el principio aquí...',
        inputAttributes: {
            'aria-label': 'Escriba el principio aquí'
        },
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar'
    });

    if (text) {
        principle.text = text;
        renderPrinciples();
        Swal.fire('Actualizado', '', 'success');
    }
};

window.deletePrinciple = function(id) {
    Swal.fire({
        title: '¿Eliminar principio?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            strategicData.principles = strategicData.principles.filter(p => p.id !== id);
            renderPrinciples();
            Swal.fire('Eliminado', '', 'success');
        }
    });
};

function renderPrinciples() {
    const tbody = document.querySelector('#tablePrinciples tbody');
    if (!tbody) return;

    if (strategicData.principles.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" class="empty-state">No hay principios registrados.</td></tr>`;
        return;
    }

    let html = '';
    strategicData.principles.forEach(item => {
        html += `<tr>
            <td style="white-space: nowrap; display: flex; gap: 5px;">
                <button class="btn-edit-premium" title="Editar" onclick="editPrinciple(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-premium" title="Eliminar" onclick="deletePrinciple(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.text}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// Check DOM Ready
// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initStrategic);
} else {
    initStrategic();
} 