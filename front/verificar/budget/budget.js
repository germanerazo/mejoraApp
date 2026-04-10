// ============================================================
// budget.js  –  Presupuesto por Año (CRUD real)
// ============================================================
import config from "../../js/config.js";

const API = `${config.BASE_API_URL}budget.php`;

// ── Sesión ────────────────────────────────────────────────────────────────────
let idEmpresa   = null;
let token       = null;
let currentBudgetId = null;   // idBudget activo en el formulario

const loadSession = () => {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        token     = sessionStorage.getItem('token') || '';
        return true;
    }
    return false;
};

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const initBudget = async () => {
    if (!loadSession()) {
        const tbody = document.querySelector('#tableBudgetList tbody');
        if (tbody) tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;padding:30px;color:#e74c3c;">
            <i class="fas fa-lock"></i> No se encontró sesión de empresa.</td></tr>`;
        return;
    }
    await renderBudgetList();
};

// ── LIST ──────────────────────────────────────────────────────────────────────
window.renderBudgetList = async () => {
    const tbody = document.querySelector('#tableBudgetList tbody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;padding:20px;">
        <i class="fas fa-spinner fa-spin"></i> Cargando...</td></tr>`;

    try {
        const resp = await fetch(`${API}?idEmpresa=${idEmpresa}`);
        const data = await resp.json();
        const list = Array.isArray(data) ? data : [];

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="2" class="empty-state">No hay presupuestos registrados.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(item => `
            <tr>
                <td class="table-actions" style="display:flex;gap:5px;">
                    <button class="btn-edit-premium" title="Editar" onclick="editBudget(${item.idBudget})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete-premium" title="Eliminar" onclick="deleteBudget(${item.idBudget}, ${item.year})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
                <td>${item.year}</td>
            </tr>`).join('');

    } catch (err) {
        console.error('Error cargando presupuestos:', err);
        tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;padding:20px;color:#e74c3c;">
            <i class="fas fa-exclamation-triangle"></i> Error al cargar los presupuestos.</td></tr>`;
    }
};

// ── VIEW SWITCHING ────────────────────────────────────────────────────────────
window.showCreateBudget = () => {
    currentBudgetId = null;
    document.getElementById('budgetListView').style.display  = 'none';
    document.getElementById('budgetFormView').style.display  = 'block';

    // Reset form
    document.getElementById('budgetYear').value    = '';
    document.getElementById('budgetYear').disabled = false;
    document.getElementById('btnInitBudget').style.display = 'inline-block';
    document.getElementById('budgetDetailSection').style.display = 'none';
    document.getElementById('budgetItemsBody').innerHTML = '';
    document.getElementById('grandTotal').innerText = '$ 0';
};

window.hideCreateBudget = () => {
    document.getElementById('budgetFormView').style.display  = 'none';
    document.getElementById('budgetListView').style.display  = 'block';
    currentBudgetId = null;
};

// ── INIT YEAR (CREATE HEADER) ─────────────────────────────────────────────────
window.initBudgetYear = async () => {
    const year = parseInt(document.getElementById('budgetYear').value);
    if (!year || year < 2000 || year > 2100) {
        Swal.fire('Error', 'Debe ingresar un año válido para continuar.', 'error');
        return;
    }

    try {
        const resp = await fetch(`${API}?action=createBudget`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ token, idEmpresa, year }),
        });
        const data = await resp.json();

        if (data.status !== 'ok') {
            Swal.fire('Error', data.result?.error_message || 'No se pudo crear el presupuesto.', 'error');
            return;
        }

        currentBudgetId = data.result.idBudget;

        document.getElementById('budgetYear').disabled = true;
        document.getElementById('btnInitBudget').style.display = 'none';
        document.getElementById('budgetDetailSection').style.display = 'block';

        Swal.fire({
            title: 'Año Definido',
            text:  'Ahora puede agregar los registros del presupuesto.',
            icon:  'success',
            timer: 1500,
            showConfirmButton: false,
        });

    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Error de conexión.', 'error');
    }
};

// ── ADD ROW (inline) ──────────────────────────────────────────────────────────
window.addItem = () => {
    const id = `new_${Date.now()}`;
    const tr = document.createElement('tr');
    tr.id = `row_${id}`;
    tr.dataset.idItem = '';   // empty = new
    tr.innerHTML = `
        <td class="table-actions">
            <button class="btn-delete-premium" title="Eliminar" onclick="removeItem('${id}')" style="width:28px !important;height:28px !important;">
                <i class="fas fa-minus"></i>
            </button>
        </td>
        <td><input type="text" class="budget-input activity" placeholder="Descripción..."></td>
        <td><input type="number" class="budget-input unit-value" oninput="calculateRow('${id}')" placeholder="0"></td>
        <td><input type="number" class="budget-input quantity"   oninput="calculateRow('${id}')" placeholder="0"></td>
        <td><input type="text"   class="budget-input unit"       placeholder="Und"></td>
        <td class="row-total" style="text-align:right;">$ 0</td>
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
    const qty   = parseFloat(row.querySelector('.quantity').value)   || 0;
    row.querySelector('.row-total').innerText = formatCurrency(price * qty);
    calculateGrandTotal();
};

window.calculateGrandTotal = () => {
    let sum = 0;
    document.querySelectorAll('#budgetItemsBody tr').forEach(row => {
        const price = parseFloat(row.querySelector('.unit-value')?.value) || 0;
        const qty   = parseFloat(row.querySelector('.quantity')?.value)   || 0;
        sum += price * qty;
    });
    document.getElementById('grandTotal').innerText = formatCurrency(sum);
};

// ── SAVE (bulk replace all items) ────────────────────────────────────────────
window.saveBudget = async () => {
    if (!currentBudgetId) {
        Swal.fire('Error', 'Primero defina el año del presupuesto.', 'error');
        return;
    }

    const items = [];
    let valid = true;

    document.querySelectorAll('#budgetItemsBody tr').forEach(row => {
        const activity  = row.querySelector('.activity')?.value.trim()  || '';
        const unitValue = parseFloat(row.querySelector('.unit-value')?.value) || 0;
        const quantity  = parseFloat(row.querySelector('.quantity')?.value)   || 0;
        const unit      = row.querySelector('.unit')?.value.trim() || '';

        if (!activity) { valid = false; }
        items.push({ activity, unitValue, quantity, unit });
    });

    if (!valid) {
        Swal.fire('Error', 'Todas las filas deben tener una actividad.', 'error');
        return;
    }

    try {
        const resp = await fetch(`${API}?action=saveAllItems`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ token, idBudget: currentBudgetId, items }),
        });
        const data = await resp.json();

        if (data.status !== 'ok') {
            Swal.fire('Error', data.result?.error_message || 'No se pudo guardar.', 'error');
            return;
        }

        Swal.fire({ icon: 'success', title: 'Guardado', text: 'Presupuesto guardado correctamente.', timer: 1600, showConfirmButton: false });
        await renderBudgetList();
        hideCreateBudget();

    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Error de conexión.', 'error');
    }
};

// ── EDIT ──────────────────────────────────────────────────────────────────────
window.editBudget = async (idBudget) => {
    try {
        const resp = await fetch(`${API}?idBudget=${idBudget}`);
        const budget = await resp.json();

        if (!budget || !budget.idBudget) {
            Swal.fire('Error', 'No se encontró el presupuesto.', 'error');
            return;
        }

        currentBudgetId = budget.idBudget;
        showCreateBudget();   // reset UI first

        // Override reset
        document.getElementById('budgetYear').value    = budget.year;
        document.getElementById('budgetYear').disabled = true;
        document.getElementById('btnInitBudget').style.display   = 'none';
        document.getElementById('budgetDetailSection').style.display = 'block';

        const tbody = document.getElementById('budgetItemsBody');
        tbody.innerHTML = '';
        let grandTotal = 0;

        (budget.items || []).forEach(item => {
            const rowId = `db_${item.idItem}`;
            const total = parseFloat(item.unitValue) * parseFloat(item.quantity);
            grandTotal += total;

            const tr = document.createElement('tr');
            tr.id = `row_${rowId}`;
            tr.dataset.idItem = item.idItem;
            tr.innerHTML = `
                <td class="table-actions">
                    <button class="btn-delete-premium" title="Eliminar" onclick="removeItem('${rowId}')" style="width:28px !important;height:28px !important;">
                        <i class="fas fa-minus"></i>
                    </button>
                </td>
                <td><input type="text"   class="budget-input activity"   value="${esc(item.activity)}"></td>
                <td><input type="number" class="budget-input unit-value" oninput="calculateRow('${rowId}')" value="${item.unitValue}"></td>
                <td><input type="number" class="budget-input quantity"   oninput="calculateRow('${rowId}')" value="${item.quantity}"></td>
                <td><input type="text"   class="budget-input unit"       value="${esc(item.unit)}"></td>
                <td class="row-total" style="text-align:right;">${formatCurrency(total)}</td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('grandTotal').innerText = formatCurrency(grandTotal);

    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Error de conexión.', 'error');
    }
};

// ── DELETE ────────────────────────────────────────────────────────────────────
window.deleteBudget = (idBudget, year) => {
    Swal.fire({
        title: `¿Eliminar presupuesto ${year}?`,
        text:  'Esta acción eliminará el presupuesto y todos sus ítems.',
        icon:  'warning',
        showCancelButton:   true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText:  'Sí, eliminar',
        cancelButtonText:   'Cancelar',
    }).then(async (result) => {
        if (!result.isConfirmed) return;
        try {
            await fetch(`${API}?action=deleteBudget`, {
                method:  'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ token, idBudget }),
            });
            Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
            await renderBudgetList();
        } catch (err) {
            Swal.fire('Error', 'Error de conexión.', 'error');
        }
    });
};

// ── PRINT ─────────────────────────────────────────────────────────────────────
window.printBudget = () => {
    const year = document.getElementById('budgetYear').value;
    let printRows = '';

    document.querySelectorAll('#budgetItemsBody tr').forEach(row => {
        const activity = row.querySelector('.activity')?.value  || '';
        const val      = row.querySelector('.unit-value')?.value || 0;
        const qty      = row.querySelector('.quantity')?.value   || 0;
        const unit     = row.querySelector('.unit')?.value       || '';
        const total    = row.querySelector('.row-total')?.innerText || '';

        printRows += `
        <tr>
            <td style="border:1px solid #ddd;padding:8px;">${activity}</td>
            <td style="border:1px solid #ddd;padding:8px;text-align:right;">$ ${parseInt(val).toLocaleString()}</td>
            <td style="border:1px solid #ddd;padding:8px;text-align:center;">${qty}</td>
            <td style="border:1px solid #ddd;padding:8px;text-align:center;">${unit}</td>
            <td style="border:1px solid #ddd;padding:8px;text-align:right;">${total}</td>
        </tr>`;
    });

    const grandTotal = document.getElementById('grandTotal').innerText;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html><head><title>Presupuesto ${year}</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f8f9fa; border: 1px solid #ddd; padding: 10px; text-align: left; }
            h1 { color: #333; border-bottom: 2px solid #ff9d00; padding-bottom: 10px; }
        </style></head>
        <body>
            <h1>Presupuesto Año: ${year}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Actividad</th>
                        <th style="text-align:right;">Valor Unitario</th>
                        <th style="text-align:center;">Cantidad</th>
                        <th style="text-align:center;">Unidad</th>
                        <th style="text-align:right;">Total</th>
                    </tr>
                </thead>
                <tbody>${printRows}</tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align:right;padding:10px;font-weight:bold;border-top:2px solid #333;">TOTAL</td>
                        <td style="text-align:right;padding:10px;font-weight:bold;border-top:2px solid #333;">${grandTotal}</td>
                    </tr>
                </tfoot>
            </table>
            <script>window.print();<\/script>
        </body></html>
    `);
    printWindow.document.close();
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatCurrency = (val) => '$ ' + (val || 0).toLocaleString('es-CO');

const esc = (str) =>
    String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                     .replace(/"/g,'&quot;').replace(/'/g,'&#039;');

// ── Init ──────────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBudget);
} else {
    initBudget();
}
