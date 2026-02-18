// JavaScript for EPP Delivery (Entrega EPP)

// Mock Employees
const employees = [
    { id: 101, name: 'Juan Pérez', id_number: '12345678', position: 'Operario de Campo', status: 'Activo' },
    { id: 102, name: 'María Gómez', id_number: '87654321', position: 'Auxiliar Administrativo', status: 'Activo' },
    { id: 103, name: 'Carlos Ruiz', id_number: '11223344', position: 'Supervisor', status: 'Activo' }
];

// Mock catalog for delivery selection
const eppCatalog = [
    { id: 1, name: 'Casco de Seguridad' },
    { id: 2, name: 'Gafas de Seguridad' },
    { id: 3, name: 'Guantes de Cuero' },
    { id: 4, name: 'Botas de Seguridad' }
];

// Mock history (Simulating database with local array)
let deliveryHistory = [
    {
        id: 1709251200000, // Dummy timestamp ID
        empId: 101, // Juan Pérez
        date: '2024-03-01',
        items: [
            { id: '1', name: 'Casco de Seguridad', size: 'M', qty: '1' },
            { id: '3', name: 'Guantes de Cuero', size: 'L', qty: '2' }
        ]
    },
    {
        id: 1711929600000, 
        empId: 101, // Juan Pérez
        date: '2024-04-01',
        items: [
            { id: '4', name: 'Botas de Seguridad', size: '40', qty: '1' }
        ]
    }
];

const renderEmployees = (filter = '') => {
    const tbody = document.getElementById('employeeBody');
    if (!tbody) return;

    const filtered = employees.filter(e => 
        e.name.toLowerCase().includes(filter.toLowerCase()) || 
        e.id_number.includes(filter)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No se encontraron empleados.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(emp => `
        <tr>
            <td>${emp.id_number}</td>
            <td>${emp.name}</td>
            <td>${emp.position}</td>
            <td><span class="status-active">${emp.status}</span></td>
            <td style="text-align: center;">
                <button class="btn-delivery" title="Registrar Entrega" onclick="window.openDeliveryModal(${emp.id})">
                    <i class="fas fa-box-open"></i>
                </button>
                <button class="btn-history" title="Ver Historial" onclick="window.viewHistory(${emp.id})">
                    <i class="fas fa-history"></i>
                </button>
            </td>
        </tr>
    `).join('');
};

window.searchEmployees = () => {
    const term = document.getElementById('employeeSearch').value;
    renderEmployees(term);
};

// Global to manage modal items
let currentDeliveryItems = [];

// Modified to support Editing
window.openDeliveryModal = (empId, deliveryToEdit = null) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    
    // Initialize state
    if (deliveryToEdit) {
        currentDeliveryItems = JSON.parse(JSON.stringify(deliveryToEdit.items)); // Deep copy
    } else {
        currentDeliveryItems = []; 
    }

    // Generate options html
    const optionsHtml = eppCatalog.map(e => `<option value="${e.id}">${e.name}</option>`).join('');

    const isEdit = !!deliveryToEdit;
    const title = isEdit ? 'Editar Entrega EPP' : 'Registrar Entrega EPP';
    const confirmText = isEdit ? 'Actualizar Entrega' : 'Guardar Entrega';

    Swal.fire({
        title: title,
        width: '800px',
        html: `
            <div style="text-align: left; background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p><strong>Empleado:</strong> ${emp.name} (${emp.id_number})</p>
                <p><strong>Cargo:</strong> ${emp.position}</p>
                <label><strong>Fecha de Entrega:</strong></label>
                <input type="date" id="deliveryDate" class="swal2-input" style="width: 200px; margin: 5px 0;">
            </div>

            <div style="border-top: 2px solid #eee; padding-top: 15px;">
                <h4>Agregar Ítems</h4>
                <div style="display: flex; gap: 10px; align-items: end;">
                    <div style="flex: 2;">
                        <label>Elemento</label>
                        <select id="newItemSelect" class="swal2-input" style="margin:0; width: 100%;">${optionsHtml}</select>
                    </div>
                    <div style="flex: 1;">
                        <label>Talla</label>
                        <input id="newItemSize" class="swal2-input" style="margin:0; width: 100%;" placeholder="Ej: L">
                    </div>
                    <div style="flex: 1;">
                        <label>Cant.</label>
                        <input type="number" id="newItemQty" class="swal2-input" style="margin:0; width: 100%;" value="1">
                    </div>
                    <button type="button" class="swal2-confirm swal2-styled" style="margin:0; padding: 10px 15px;" onclick="window.addItemToDelivery()">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>

            <div style="margin-top: 20px;">
                <table class="delivery-items-table">
                    <thead>
                        <tr>
                            <th>Elemento</th>
                            <th>Talla</th>
                            <th>Cant.</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody id="deliveryItemsBody">
                        <!-- Items here -->
                    </tbody>
                </table>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#27ae60',
        didOpen: () => {
            // Set date
            let dateValue;
            if (isEdit && deliveryToEdit.date) {
                dateValue = deliveryToEdit.date;
            } else {
                dateValue = new Date().toISOString().split('T')[0];
            }
            document.getElementById('deliveryDate').value = dateValue;
            
            renderDeliveryItems();
        },
        preConfirm: () => {
            const date = document.getElementById('deliveryDate').value;
            if (!date) {
                Swal.showValidationMessage('Fecha es requerida');
                return false;
            }
            if (currentDeliveryItems.length === 0) {
                 Swal.showValidationMessage('Debe agregar al menos un ítem');
                 return false;
            }
            
            return {
                empId: empId,
                date: date,
                items: currentDeliveryItems
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (isEdit) {
                // Update existing
                const index = deliveryHistory.findIndex(h => h.id === deliveryToEdit.id);
                if (index !== -1) {
                    deliveryHistory[index] = {
                        ...deliveryHistory[index],
                        date: result.value.date,
                        items: result.value.items
                    };
                }
                Swal.fire('Actualizado', 'La entrega ha sido actualizada.', 'success').then(() => {
                    window.viewHistory(empId); // Return to history
                });
            } else {
                // Create new
                // Create a unique ID
                const newId = Date.now();
                deliveryHistory.push({
                    id: newId,
                    ...result.value
                });
                
                Swal.fire({
                    icon: 'success',
                    title: 'Entrega Registrada',
                    text: 'Se ha guardado la entrega correctamente.',
                    showDenyButton: true,
                    denyButtonText: 'Imprimir',
                    confirmButtonText: 'Cerrar'
                }).then((res) => {
                    if (res.isDenied) {
                        window.printDelivery(newId);
                    }
                });
            }
        } else {
             // Cancelled
             if (isEdit) window.viewHistory(empId);
        }
    });
};

window.addItemToDelivery = () => {
    const select = document.getElementById('newItemSelect');
    const name = select.options[select.selectedIndex].text;
    const id = select.value;
    const size = document.getElementById('newItemSize').value || '-';
    const qty = document.getElementById('newItemQty').value;

    currentDeliveryItems.push({ id, name, size, qty });
    renderDeliveryItems();
    
    // Clear inputs
    document.getElementById('newItemSize').value = '';
    document.getElementById('newItemQty').value = '1';
};

window.removeItemFromDelivery = (index) => {
    currentDeliveryItems.splice(index, 1);
    renderDeliveryItems();
};

function renderDeliveryItems() {
    const tbody = document.getElementById('deliveryItemsBody');
    if (!tbody) return;

    if (currentDeliveryItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: #999;">Ningún ítem agregado</td></tr>';
        return;
    }

    tbody.innerHTML = currentDeliveryItems.map((item, idx) => `
        <tr>
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>${item.qty}</td>
            <td>
                <button onclick="window.removeItemFromDelivery(${idx})" style="color: red; border: none; background: none; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Enhanced History View
window.viewHistory = (empId) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const history = deliveryHistory.filter(h => h.empId === empId);
    // Sort descending by date
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    let contentHtml = '';
    
    if (history.length === 0) {
        contentHtml = '<div style="padding: 20px; text-align: center; color: #666;">No hay entregas registradas para este empleado.</div>';
    } else {
        const rows = history.map(h => {
             // Summarize items for display
             const summary = h.items.map(i => `${i.qty} x ${i.name}`).join(', ');
             // Format date
             const dateStr = h.date; 

             return `
                <tr>
                    <td>${dateStr}</td>
                    <td>${summary}</td>
                    <td class="action-cell">
                        <button class="btn-icon btn-edit" onclick="window.editDelivery(${h.id}, ${empId})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-print" onclick="window.printDelivery(${h.id}, ${empId})" title="Imprimir">
                            <i class="fas fa-print"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="window.deleteDelivery(${h.id}, ${empId})" title="Eliminar">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
             `;
        }).join('');

        contentHtml = `
            <style>
                .history-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.95rem; }
                .history-table th { background-color: #f8f9fa; color: #333; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
                .history-table td { padding: 10px; border-bottom: 1px solid #eee; text-align: left; vertical-align: middle; }
                .action-cell { text-align: center !important; white-space: nowrap; }
                .btn-icon { border: none; background: transparent; cursor: pointer; font-size: 1.1rem; margin: 0 5px; transition: transform 0.2s; }
                .btn-icon:hover { transform: scale(1.1); }
                .btn-edit { color: #f39c12; }
                .btn-print { color: #3498db; }
                .btn-delete { color: #e74c3c; }
            </style>
            <div style="max-height: 400px; overflow-y: auto;">
                <table class="history-table">
                    <thead>
                        <tr>
                            <th style="width: 120px;">Fecha</th>
                            <th>Artículos Entregados</th>
                            <th style="width: 120px; text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    }

    Swal.fire({
        title: `Historial de Entregas<br><small style="font-size: 0.6em; color: #666;">${emp.name}</small>`,
        html: contentHtml,
        width: '900px',
        showConfirmButton: true,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#7f8c8d'
    });
};

window.editDelivery = (deliveryId, empId) => {
    const delivery = deliveryHistory.find(d => d.id === deliveryId);
    if (delivery) {
        // Open the modal in edit mode
        window.openDeliveryModal(empId, delivery);
    }
};

window.deleteDelivery = (deliveryId, empId) => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminará esta entrega del historial.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const index = deliveryHistory.findIndex(d => d.id === deliveryId);
            if (index !== -1) {
                deliveryHistory.splice(index, 1);
                Swal.fire(
                    'Eliminado',
                    'El registro ha sido eliminado.',
                    'success'
                ).then(() => {
                    // Reopen history
                    window.viewHistory(empId);
                });
            }
        } else {
            // Cancelled, reopen history
            window.viewHistory(empId);
        }
    });
};

window.printDelivery = (deliveryId, empId = null) => {
    const delivery = deliveryHistory.find(d => d.id === deliveryId);
    if (!delivery) return;

    const emp = employees.find(e => e.id === delivery.empId);
    if (!emp) return;

    // Company Info (Mock)
    const companyName = "Dinamik Zona Franca S.A.S";
    const nit = "900.123.456-7";

    // Generate Items Rows
    const itemsRows = delivery.items.map((item, index) => `
        <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td>${item.name}</td>
            <td style="text-align: center;">${item.size}</td>
            <td style="text-align: center;">${item.qty}</td>
        </tr>
    `).join('');

    const printWindow = window.open('', '_blank', 'width=900,height=800');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Entrega EPP - ${emp.name}</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    background-color: #525659; 
                    margin: 0; 
                    display: flex; 
                    justify-content: center; 
                    padding: 20px;
                }
                .page-container {
                    background-color: white;
                    width: 210mm; /* A4 width */
                    min-height: 297mm; /* A4 height */
                    padding: 20mm;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                    box-sizing: border-box;
                    position: relative;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #333;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .company-name {
                    font-size: 18pt;
                    font-weight: bold;
                    margin: 0;
                }
                .doc-title {
                    font-size: 14pt;
                    margin: 10px 0 0 0;
                    text-transform: uppercase;
                }
                .info-section {
                    margin-bottom: 20px;
                    border: 1px solid #ddd;
                    padding: 10px;
                    background-color: #f9f9f9;
                }
                .info-row {
                    display: flex;
                    margin-bottom: 5px;
                }
                .info-label {
                    font-weight: bold;
                    width: 150px;
                }
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 40px;
                }
                .items-table th, .items-table td {
                    border: 1px solid #333;
                    padding: 8px;
                }
                .items-table th {
                    background-color: #eee;
                }
                .signatures {
                    margin-top: 50px;
                    display: flex;
                    justify-content: space-between;
                }
                .signature-box {
                    width: 40%;
                    text-align: center;
                    border-top: 1px solid #333;
                    padding-top: 10px;
                }
                
                /* Toolbar for "Preview" Mode */
                .toolbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #333;
                    padding: 10px;
                    text-align: center;
                    z-index: 1000;
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                }
                .btn {
                    padding: 8px 15px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .btn-print { background-color: #3498db; color: white; }
                .btn-close { background-color: #e74c3c; color: white; }
                
                @media print {
                    body { background-color: white; padding: 0; }
                    .page-container { box-shadow: none; width: 100%; border: none; padding: 0; }
                    .toolbar { display: none; }
                }
            </style>
            <!-- Font Awesome for Icons -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        </head>
        <body>
            <div class="toolbar">
                <button class="btn btn-print" onclick="window.print()">
                    <i class="fas fa-print"></i> Imprimir / Guardar PDF
                </button>
                <button class="btn btn-close" onclick="window.close()">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>

            <div class="page-container">
                <div class="header">
                    <h2 class="company-name">${companyName}</h2>
                    <p style="margin: 0; font-size: 0.9em;">NIT: ${nit}</p>
                    <h3 class="doc-title">Comprobante de Entrega de EPP</h3>
                </div>

                <div class="info-section">
                    <div class="info-row">
                        <span class="info-label">Fecha de Entrega:</span>
                        <span>${delivery.date}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Empleado:</span>
                        <span>${emp.name}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Identificación:</span>
                        <span>${emp.id_number}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Cargo:</span>
                        <span>${emp.position}</span>
                    </div>
                </div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;">#</th>
                            <th>Elemento de Protección Personal</th>
                            <th style="width: 80px;">Talla</th>
                            <th style="width: 80px;">Cant.</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsRows}
                    </tbody>
                </table>

                <div style="margin-top: 20px; font-size: 0.9em; text-align: justify;">
                    <p>
                        Declaro que he recibido los elementos de protección personal relacionados anteriormente, 
                        los cuales se encuentran en buen estado. Me comprometo a utilizarlos durante mi jornada laboral, 
                        mantenerlos en buen estado y solicitar su reposición en caso de deterioro.
                    </p>
                </div>

                <div class="signatures">
                    <div class="signature-box">
                        <strong>Recibe:</strong><br><br>
                        ${emp.name}<br>
                        C.C. ${emp.id_number}
                    </div>
                    <div class="signature-box">
                        <strong>Entrega:</strong><br><br>
                        Responsable SST<br>
                        ${companyName}
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
};

// Init
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    renderEmployees();
} else {
    document.addEventListener('DOMContentLoaded', () => renderEmployees());
}
