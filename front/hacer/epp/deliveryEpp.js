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

// Mock history
let deliveryHistory = [];

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

window.openDeliveryModal = (empId) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    
    currentDeliveryItems = []; // Reset items

    // Generate options html
    const optionsHtml = eppCatalog.map(e => `<option value="${e.id}">${e.name}</option>`).join('');

    Swal.fire({
        title: 'Registrar Entrega EPP',
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
        confirmButtonText: 'Guardar Entrega',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#27ae60',
        didOpen: () => {
            // Set today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('deliveryDate').value = today;
            renderDeliveryItems();
        },
        preConfirm: () => {
            const date = document.getElementById('deliveryDate').value;
            if (!date) Swal.showValidationMessage('Fecha es requerida');
            if (currentDeliveryItems.length === 0) Swal.showValidationMessage('Debe agregar al menos un ítem');
            
            return {
                empId: empId,
                date: date,
                items: currentDeliveryItems
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            deliveryHistory.push({
                id: Date.now(),
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
                    Swal.fire('Imprimiendo...', '', 'info');
                }
            });
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

window.viewHistory = (empId) => {
    const emp = employees.find(e => e.id === empId);
    const history = deliveryHistory.filter(h => h.empId === empId);

    let html = '';
    if (history.length === 0) {
        html = '<p>No hay entregas registradas para este empleado.</p>';
    } else {
        html = '<ul style="text-align: left;">';
        history.forEach(h => {
            html += `<li><strong>${h.date}</strong>: ${h.items.length} ítems entregados.</li>`;
        });
        html += '</ul>';
    }

    Swal.fire({
        title: `Historial de ${emp.name}`,
        html: html,
        confirmButtonText: 'Cerrar'
    });
};

// Init
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    renderEmployees();
} else {
    document.addEventListener('DOMContentLoaded', () => renderEmployees());
}
