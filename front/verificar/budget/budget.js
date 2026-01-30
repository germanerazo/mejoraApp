// Mock Data - Persist globally for demo
window.budgetData = window.budgetData || [
    { id: 1, year: 2024, items: [
        { id: 101, activity: 'Capacitación en Alturas', unitValue: 150000, quantity: 10, unit: 'Pers', total: 1500000 },
        { id: 102, activity: 'Compra de EPP', unitValue: 50000, quantity: 20, unit: 'Und', total: 1000000 }
    ]}
];

let currentItems = [];

const initBudget = () => {
    renderBudgetList();
};

window.renderBudgetList = () => {
    const tbody = document.querySelector('#tableBudgetList tbody');
    if (!tbody) return;

    if (window.budgetData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" class="empty-state">No hay presupuestos registrados.</td></tr>`;
        return;
    }

    let html = '';
    window.budgetData.forEach(item => {
        html += `<tr>
            <td class="table-actions" style="display: flex; gap: 5px;">
                <button class="btn-edit-premium" title="Editar" onclick="editBudget(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-premium" title="Eliminar" onclick="deleteBudget(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
            <td>${item.year}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
};

// View Switching
window.showCreateBudget = () => {
    document.getElementById('budgetListView').style.display = 'none';
    document.getElementById('budgetFormView').style.display = 'block';
    
    // Reset Form
    document.getElementById('budgetYear').value = '';
    document.getElementById('budgetYear').disabled = false;
    document.getElementById('btnInitBudget').style.display = 'inline-block';
    
    document.getElementById('budgetDetailSection').style.display = 'none';
    
    document.getElementById('budgetItemsBody').innerHTML = '';
    document.getElementById('grandTotal').innerText = '$ 0';
    currentItems = [];
};

window.hideCreateBudget = () => {
    document.getElementById('budgetFormView').style.display = 'none';
    document.getElementById('budgetListView').style.display = 'block';
};

window.initBudgetYear = () => {
    const year = document.getElementById('budgetYear').value;
    if (!year) {
        Swal.fire('Error', 'Debe ingresar el año para continuar', 'error');
        return;
    }
    
    // "Create" the year context
    document.getElementById('budgetYear').disabled = true;
    document.getElementById('btnInitBudget').style.display = 'none';
    document.getElementById('budgetDetailSection').style.display = 'block';
    
    Swal.fire({
        title: 'Año Definido',
        text: 'Ahora puede agregar los registros del presupuesto.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
};

// Form Logic
window.addItem = () => {
    const id = Date.now();
    const tr = document.createElement('tr');
    tr.id = `row_${id}`;
    tr.innerHTML = `
        <td class="table-actions">
            <button class="btn-delete-premium" title="Eliminar" onclick="removeItem('${id}')" style="width: 28px !important; height: 28px !important;">
                <i class="fas fa-minus"></i>
            </button>
        </td>
        <td><input type="text" class="budget-input activity" placeholder="Descripción..."></td>
        <td><input type="number" class="budget-input unit-value" oninput="calculateRow('${id}')" placeholder="0"></td>
        <td><input type="number" class="budget-input quantity" oninput="calculateRow('${id}')" placeholder="0"></td>
        <td><input type="text" class="budget-input unit" placeholder="Und"></td>
        <td class="row-total" style="text-align: right;">$ 0</td>
    `;
    document.getElementById('budgetItemsBody').appendChild(tr);
};

window.removeItem = (id) => {
    const row = document.getElementById(`row_${id}`);
    if (row) row.remove();
    calculateGrandTotal();
};

window.calculateRow = (id) => {
    const row = document.getElementById(`row_${id}`);
    if (!row) return;

    const price = parseFloat(row.querySelector('.unit-value').value) || 0;
    const qty = parseFloat(row.querySelector('.quantity').value) || 0;
    const total = price * qty;

    row.querySelector('.row-total').innerText = formatCurrency(total);
    calculateGrandTotal();
};

window.calculateGrandTotal = () => {
    const rows = document.querySelectorAll('#budgetItemsBody tr');
    let sum = 0;
    rows.forEach(row => {
        const price = parseFloat(row.querySelector('.unit-value').value) || 0;
        const qty = parseFloat(row.querySelector('.quantity').value) || 0;
        sum += (price * qty);
    });
    document.getElementById('grandTotal').innerText = formatCurrency(sum);
};

window.saveBudget = () => {
    const year = document.getElementById('budgetYear').value;
    if (!year) {
        Swal.fire('Error', 'Debe ingresar el año', 'error');
        return;
    }

    // Mock Save
    // Check if exists
    const existingIndex = window.budgetData.findIndex(b => b.year == year);
    const newItem = { 
        id: existingIndex >= 0 ? window.budgetData[existingIndex].id : Date.now(), 
        year: year, 
        items: [] // In real app, scrape table data
    };
    
    // Scrape data for mock persistence
    const rows = document.querySelectorAll('#budgetItemsBody tr');
    rows.forEach(row => {
       newItem.items.push({
           activity: row.querySelector('.activity').value,
           unitValue: row.querySelector('.unit-value').value,
           quantity: row.querySelector('.quantity').value,
           unit: row.querySelector('.unit').value
       });
    });

    if (existingIndex >= 0) {
        window.budgetData[existingIndex] = newItem;
    } else {
        window.budgetData.push(newItem);
    }

    renderBudgetList();
    Swal.fire('Guardado', 'Presupuesto guardado correctamente', 'success');
    hideCreateBudget();
};

window.editBudget = (id) => {
    const budget = window.budgetData.find(b => b.id === id);
    if (!budget) return;

    showCreateBudget();
    
    // Set State for Edit
    document.getElementById('budgetYear').value = budget.year;
    document.getElementById('budgetYear').disabled = true; // Cannot change year key
    document.getElementById('btnInitBudget').style.display = 'none'; // Already init
    document.getElementById('budgetDetailSection').style.display = 'block'; // Show immediately
    
    // Populate items
    const tbody = document.getElementById('budgetItemsBody');
    tbody.innerHTML = '';
    let grandTotal = 0;

    budget.items.forEach(item => {
        const rowId = Date.now() + Math.random();
        const tr = document.createElement('tr');
        tr.id = `row_${rowId}`;
        const total = item.unitValue * item.quantity;
        grandTotal += total;

        tr.innerHTML = `
            <td class="table-actions">
                <button class="btn-delete-premium" title="Eliminar" onclick="removeItem('${rowId}')" style="width: 28px !important; height: 28px !important;">
                    <i class="fas fa-minus"></i>
                </button>
            </td>
            <td><input type="text" class="budget-input activity" value="${item.activity}"></td>
            <td><input type="number" class="budget-input unit-value" oninput="calculateRow('${rowId}')" value="${item.unitValue}"></td>
            <td><input type="number" class="budget-input quantity" oninput="calculateRow('${rowId}')" value="${item.quantity}"></td>
            <td><input type="text" class="budget-input unit" value="${item.unit}"></td>
            <td class="row-total" style="text-align: right;">${formatCurrency(total)}</td>
        `;
        tbody.appendChild(tr);
    });
    document.getElementById('grandTotal').innerText = formatCurrency(grandTotal);
};

window.deleteBudget = (id) => {
    Swal.fire({
        title: '¿Eliminar presupuesto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.budgetData = window.budgetData.filter(b => b.id !== id);
            renderBudgetList();
            Swal.fire('Eliminado', '', 'success');
        }
    });
};

window.printBudget = () => {
    const year = document.getElementById('budgetYear').value;
    const rows = document.getElementById('budgetItemsBody').innerHTML;
    const grandTotal = document.getElementById('grandTotal').innerText;
    
    // Clean up rows for print (remove action buttons, inputs to text)
    // For simplicity in this mock, we'll clone and modify or just simple table generation
    // Best interaction is to read values:
    
    let printRows = '';
    document.querySelectorAll('#budgetItemsBody tr').forEach(row => {
       const activity = row.querySelector('.activity').value;
       const val = row.querySelector('.unit-value').value;
       const qty = row.querySelector('.quantity').value;
       const unit = row.querySelector('.unit').value;
       const total = row.querySelector('.row-total').innerText;
       
       printRows += `
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${activity}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$ ${parseInt(val).toLocaleString()}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${qty}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${unit}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${total}</td>
        </tr>
       `; 
    });

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Presupuesto ${year}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background-color: #f8f9fa; border: 1px solid #ddd; padding: 10px; text-align: left; }
                h1 { color: #333; border-bottom: 2px solid #ff9d00; padding-bottom: 10px; }
            </style>
        </head>
        <body>
            <h1>Presupuesto Año: ${year}</h1>
            
            <table>
                <thead>
                    <tr>
                        <th>Actividad</th>
                        <th style="text-align: right;">Valor Unitario</th>
                        <th style="text-align: center;">Cantidad</th>
                        <th style="text-align: center;">Unidad</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${printRows}
                </tbody>
                <tfoot>
                     <tr>
                        <td colspan="4" style="text-align: right; padding: 10px; font-weight: bold; border-top: 2px solid #333;">TOTAL</td>
                        <td style="text-align: right; padding: 10px; font-weight: bold; border-top: 2px solid #333;">${grandTotal}</td>
                    </tr>
                </tfoot>
            </table>
            <script>window.print();</script>
        </body>
        </html>
    `);
    printWindow.document.close();
};

const formatCurrency = (val) => {
    return '$ ' + val.toLocaleString('es-CO');
};

// Check DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initBudget);
} else {
    initBudget();
}
