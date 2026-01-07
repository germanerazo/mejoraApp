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
        
        // Render Principles if any (mock data or restored state)
        if (strategicData.principles.length > 0) {
            renderPrinciples();
            // In a real app we'd check if policy is saved/exists to show this
            // For now, we'll keep it hidden until "Save" is clicked unless we add a check here
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

    // Reveal Principles Section and Print Button
    document.getElementById('principlesSection').style.display = 'block';
    document.getElementById('btnPrint').style.display = 'inline-block';

    Swal.fire({
        icon: 'success',
        title: 'Política Guardada',
        text: 'La política ha sido guardada. Ahora puede agregar los principios.',
        timer: 1500,
        showConfirmButton: false
    });
};

window.printPolicy = function() {
    const policy = strategicData.policy;
    const principles = strategicData.principles;

    let principlesHtml = '';
    if (principles.length > 0) {
        principlesHtml = '<ul>' + principles.map(p => `<li>${p.text}</li>`).join('') + '</ul>';
    } else {
        principlesHtml = '<p>No hay principios registrados.</p>';
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
                .principles-section { margin: 30px 0; }
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
            <td style="white-space: nowrap;">
                <button class="btn-icon btn-edit" title="Editar" onclick="editPrinciple(${item.id})" style="margin-right: 5px;">✏️</button>
                <button class="btn-icon btn-delete" title="Eliminar" onclick="deletePrinciple(${item.id})">🗑️</button>
            </td>
            <td>${item.text}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initStrategic);
} 