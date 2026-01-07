<!-- CSS Import -->
<link rel="stylesheet" href="../verificar/budget/budget.css?v=1.0">

<div class="page-header">
    <h1 class="page-title">PRESUPUESTO POR AÑO</h1>
</div>

<!-- List View -->
<div id="budgetListView" class="content-card">
    <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
        <button class="btn-create-orange" onclick="showCreateBudget()">Nuevo registro</button>
    </div>

    <div class="table-responsive">
        <table class="modern-table" id="tableBudgetList">
            <thead>
                <tr>
                    <th style="width: 100px; text-align: center;">Acción</th>
                    <th>Año</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JS -->
            </tbody>
        </table>
    </div>
</div>

<!-- Create/Edit View (Hidden initially) -->
<div id="budgetFormView" class="content-card" style="display: none;">
    <div class="section-header">
        <h2 class="section-title">DETALLE PRESUPUESTO</h2>
        <div style="display: flex; gap: 10px;">
            <button class="btn-primary" onclick="saveBudget()">Guardar</button>
            <button class="btn-secondary" onclick="hideCreateBudget()">Volver</button>
            <button class="btn-icon" title="Imprimir" onclick="printBudget()" style="background: white; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; cursor: pointer;">🖨️</button>
        </div>
    </div>

    <div style="display: flex; align-items: flex-end; gap: 10px; margin-bottom: 20px;">
        <div style="flex-grow: 0;">
            <label class="input-label">Año Presupuesto</label>
            <input type="number" id="budgetYear" class="swal2-input" placeholder="Ej: 2025" style="margin: 0; background: white; width: 150px;">
        </div>
        <button id="btnInitBudget" class="btn-primary" onclick="initBudgetYear()" style="height: 48px; margin-bottom: 1px;">Crear</button>
    </div>

    <div id="budgetDetailSection" class="section-container" style="display: none;">
        <div class="section-header">
            <h3 class="section-title" style="font-size: 16px;">PRESUPUESTO</h3>
            <button class="btn-create-orange" onclick="addItem()">Nuevo registro</button>
        </div>
        <div class="table-responsive">
            <table class="modern-table" id="tableBudgetItems">
                <thead>
                    <tr>
                        <th style="width: 80px; text-align: center;">Acción</th>
                        <th>Actividades</th>
                        <th style="width: 150px;">Valor Unitario ($)</th>
                        <th style="width: 100px;">Cantidad</th>
                        <th style="width: 100px;">Unidad</th>
                        <th style="width: 150px;">Total ($)</th>
                    </tr>
                </thead>
                <tbody id="budgetItemsBody">
                    <!-- Dynamic Items -->
                </tbody>
                <tfoot>
                    <tr class="budget-total-row">
                        <td colspan="5">TOTAL</td>
                        <td id="grandTotal">$ 0</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>

<script type="module" src="../verificar/budget/budget.js?v=1.0"></script>
