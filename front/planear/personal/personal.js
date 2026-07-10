import config from '../../js/config.js';
const API_URL = `${config.BASE_API_URL}personnel.php`;

let personalData = [];

const initPersonal = async () => {
    const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
    try {
        const res = await fetch(`${API_URL}?idEmpresa=${idEmpresa}`);
        const resp = await res.json();
        if (resp.status === 'ok') {
            personalData = resp.result || [];
        }
    } catch(e) {
        console.error("Error loading personnel", e);
    }
    renderPersonalTable(personalData);
};

window.renderPersonalTable = (data) => {
    const tbody = document.querySelector('#tablePersonal tbody');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No se encontraron registros.</td></tr>`;
        return;
    }

    let html = '';
    data.forEach(item => {
        // Format responsibilities as a list
        const respList = item.responsabilidades.length > 0 
            ? `<ul class="responsibility-list">${item.responsabilidades.map(r => `<li>${r}</li>`).join('')}</ul>`
            : 'Sin responsabilidades definidas';

        html += `<tr>
            <td style="font-weight: 500;">${item.cargo}</td>
            <td>${item.reporta}</td>
            <td style="text-align: center;">${item.personas}</td>
            <td>${respList}</td>
            <td>${item.rendicion}</td>
            <td>${item.frecuencia}</td>
            <td style="text-align: center;">
                 <button class="btn-view-premium" title="Imprimir" onclick="printPersonal('${item.cargo}')" style="color: #667eea !important;">
                    <i class="fas fa-print"></i>
                 </button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
};

window.printPersonal = (cargo) => {
    const record = personalData.find(r => r.cargo === cargo);
    if (!record) return;

    // Simulate Print View
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Imprimir - ${cargo}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                h1 { color: #333; border-bottom: 2px solid #ff9d00; padding-bottom: 10px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #555; }
                .value { margin-top: 5px; }
                ul { margin-top: 5px; padding-left: 20px; }
            </style>
        </head>
        <body>
            <h1>${record.cargo}</h1>
            <div class="field">
                <div class="label">Cargo al que Reporta:</div>
                <div class="value">${record.reporta}</div>
            </div>
            <div class="field">
                <div class="label">Número de Personas:</div>
                <div class="value">${record.personas}</div>
            </div>
             <div class="field">
                <div class="label">Responsabilidades:</div>
                <div class="value">
                    <ul>
                        ${record.responsabilidades.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="field">
                <div class="label">Rendición de Cuentas:</div>
                <div class="value">${record.rendicion}</div>
            </div>
            <div class="field">
                <div class="label">Frecuencia:</div>
                <div class="value">${record.frecuencia}</div>
            </div>
            <script>window.print();</script>
        </body>
        </html>
    `);
    printWindow.document.close();
};

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initPersonal);
} else {
    initPersonal();
}
