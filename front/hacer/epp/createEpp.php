<!-- CSS Import -->
<link rel="stylesheet" href="../hacer/epp/createEpp.css?v=1.0">

<div class="page-header">
    <div>
        <h1 class="page-title">
            <i class="fas fa-hard-hat" style="color:#e67e22;"></i>
            Catálogo de Elementos de Protección Personal
        </h1>
        <p class="breadcrumbs">Inicio &gt; Hacer &gt; EPP &gt; Catálogo EPP</p>
    </div>
    <button class="btn-new-record" onclick="openCreateEppModal()">
        <i class="fas fa-plus-circle"></i> Nuevo Registro
    </button>
</div>

<div class="content-card" style="padding: 0;">
    <div class="table-responsive">
        <table class="modern-table" id="eppCatalogTable">
            <thead>
                <tr>
                    <th style="width: 60px; text-align: center;">Nro.</th>
                    <th>Elemento de Protección Personal</th>
                    <th>Norma Técnica</th>
                    <th style="width: 100px; text-align: center;">Acción</th>
                </tr>
            </thead>
            <tbody id="eppCatalogBody">
                <!-- Cargado via JS -->
            </tbody>
        </table>
    </div>
</div>

<script type="module" src="../hacer/epp/createEpp.js?v=2.0"></script>
