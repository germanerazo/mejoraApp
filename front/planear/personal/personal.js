// Mock Data for Personal Consolidation
// In a real app, this might come from joining Profile and Process Employee tables
let personalData = [
    {
        cargo: 'Gerente General',
        reporta: 'Junta Directiva',
        personas: 1,
        responsabilidades: [
            'Definir la estrategia corporativa',
            'Aprobar presupuestos anuales',
            'Representar legalmente a la compañía'
        ],
        rendicion: 'Informe de Gestión',
        frecuencia: 'Anual'
    },
    {
        cargo: 'Director Logístico',
        reporta: 'Gerente General',
        personas: 1,
        responsabilidades: [
            'Gestionar la cadena de suministro',
            'Supervisar personal de bodega',
            'Optimizar rutas de entrega'
        ],
        rendicion: 'Indicadores de Cumplimiento',
        frecuencia: 'Mensual'
    },
    {
        cargo: 'Analista de Operaciones',
        reporta: 'Director Logístico',
        personas: 3,
        responsabilidades: [
            'Procesar órdenes de compra',
            'Coordinar despachos',
            'Actualizar inventario'
        ],
        rendicion: 'Reporte de Operaciones',
        frecuencia: 'Semanal'
    },
    {
        cargo: 'Auxiliar de Bodega',
        reporta: 'Director Logístico',
        personas: 5,
        responsabilidades: [
            'Cargue y descargue de mercancía',
            'Organización de bodega',
            'Picking y Packing'
        ],
        rendicion: 'Novedades de Turno',
        frecuencia: 'Diario'
    }
];

const initPersonal = () => {
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
                 <button class="btn-icon" title="Imprimir" onclick="printPersonal('${item.cargo}')" style="background: none; border: none; cursor: pointer; color: orange; font-size: 1.2rem;">🖨️</button>
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
