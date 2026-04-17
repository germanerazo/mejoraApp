import config from "../js/config.js";

const API = `${config.BASE_API_URL}audit.php`;

let token = null;
let auditDataTable;

const loadSession = () => {
    token = sessionStorage.getItem('token') || '';
    return token !== '';
};

const initAudit = () => {
    if (!loadSession()) {
        Swal.fire('Sesión Inválida', 'No se ha encontrado una sesión válida. Inicia sesión nuevamente.', 'error');
        return;
    }
    
    // Initialize Data table
    initDataTable();
    loadAuditData();
};

function initDataTable() {
    // Check if DataTable is already initialized, if so, destroy it first
    if ($.fn.DataTable.isDataTable('#auditTable')) {
        $('#auditTable').DataTable().destroy();
    }

    auditDataTable = $('#auditTable').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        },
        pageLength: 25,
        order: [[0, "desc"]], // Default sort by date_time descending
        columnDefs: [
            {
                targets: 7, // Detalles Column
                orderable: false
            }
        ]
    });
}

async function loadAuditData() {
    Swal.fire({
        title: 'Cargando Reportes',
        text: 'Extrayendo historial de auditoría...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const resp = await fetch(API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });
        
        const data = await resp.json();
        Swal.close();
        populateTable(data);
    } catch (error) {
        Swal.close();
        Swal.fire('Error', 'No se pudo cargar la auditoría', 'error');
        console.error('Audit Load Error:', error);
    }
}

    function populateTable(data) {
        auditDataTable.clear();
        
        data.forEach(item => {
            // Process the "action" for front-end friendly reading
            let actionBadgeClass = 'badge-general';
            if(item.action === 'Record creation') actionBadgeClass = 'badge-create';
            else if(item.action === 'Record modification') actionBadgeClass = 'badge-update';
            else if(item.action === 'Record deletion') actionBadgeClass = 'badge-delete';
            else if(item.action === 'Login') actionBadgeClass = 'badge-login';

            // Custom "view details" button holding raw info
            let btnInfo = `<button class="btn-detail" onclick="viewDetails('${btoa(unescape(encodeURIComponent(item.details)))}', '${item.action}')"><i class="fas fa-eye"></i> Leer</button>`;
            if (!item.details || item.details.trim() === '') {
                btnInfo = `<span style="color:#aaa;">-</span>`;
            }

            auditDataTable.row.add([
                formatDate(item.date_time),
                item.user || 'Desconocido',
                item.user_ident || 'N/A',
                item.company_name !== 'N/A' ? item.company_name : (item.company_id || 'N/A'),
                item.ip || 'Local',
                item.table_name || 'Global',
                `<span class="badge ${actionBadgeClass}">${mapActionFriendly(item.action)}</span>`,
                btnInfo
            ]);
        });
        
        auditDataTable.draw();
        
        // Populate filters now that data is fully loaded
        buildSelectFilters();
    }

    // Function exposed to global window to be callable from string templates
    window.viewDetails = function(b64Details, action) {
        const decoded = decodeURIComponent(escape(atob(b64Details)));
        let formattedData = `<div style="text-align:left; background:#1e1e1e; color:#0f0; padding:15px; border-radius:5px; font-family:monospace; max-height:400px; overflow-y:auto;">
                                ${decoded}
                             </div>`;
                             
        // Make it friendly if it's just login text
        if(action === 'Login') {
            formattedData = `<div style="padding:15px;">${decoded}</div>`;
        }

        Swal.fire({
            title: 'Detalles Técnicos',
            html: `A continuación se muestran los datos crudos extraídos de esta operación:<br><br>${formattedData}`,
            icon: 'info',
            width: '800px',
            confirmButtonColor: '#667eea',
            confirmButtonText: 'Cerrar'
        });
    };

    function mapActionFriendly(act) {
        switch(act) {
            case 'Record creation': return 'Creación';
            case 'Record modification': return 'Actualización';
            case 'Record deletion': return 'Eliminación';
            case 'Database modification': return 'Modificación DB';
            case 'Login': return 'Inicio de Sesión';
            default: return act;
        }
    }

    function formatDate(dateString) {
        if(!dateString) return '';
        const d = new Date(dateString);
        return d.toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit' });
    }

    // Filters integration
    let filtersBuilt = false;
    function buildSelectFilters() {
        if(filtersBuilt) return; // run once
        let users = new Set();
        let companies = new Set();
        let modules = new Set();
        let actions = new Set();
        
        auditDataTable.rows().data().each(function(row) {
            users.add(row[1]); // Usuario
            companies.add(row[3]); // Compañia
            modules.add(row[5]); // Modulo / Table
            // Extracts plain text from badge HTML
            let actionText = $(row[6]).text(); 
            actions.add(actionText);
        });

        const userFilter = $('#userFilter');
        users.forEach(u => {
            if(u && u !== '') {
                userFilter.append(`<option value="${u}">${u}</option>`);
            }
        });

        const compFilter = $('#companyFilter');
        companies.forEach(c => {
            if(c && c !== '') {
                compFilter.append(`<option value="${c}">${c}</option>`);
            }
        });

        const tblFilter = $('#tableFilter');
        modules.forEach(m => {
            if(m && m !== '') {
                tblFilter.append(`<option value="${m}">${m}</option>`);
            }
        });

        const actFilter = $('#actionFilter');
        actions.forEach(a => {
            if(a && a !== '') {
                actFilter.append(`<option value="${a}">${a}</option>`);
            }
        });

        filtersBuilt = true;

        // Apply Select2 for premium look
        $('#userFilter, #companyFilter, #tableFilter, #actionFilter').select2({ width: '100%' });

        // Event Listeners for Filters
        $('#userFilter').on('change', function() {
            // Using exact Regex match to avoid matching partial names mistakenly
            let val = $.fn.dataTable.util.escapeRegex($(this).val());
            auditDataTable.column(1).search(val ? '^' + val + '$' : '', true, false).draw();
        });

        $('#companyFilter').on('change', function() {
            let val = $.fn.dataTable.util.escapeRegex($(this).val());
            auditDataTable.column(3).search(val ? '^' + val + '$' : '', true, false).draw();
        });

        $('#tableFilter').on('change', function() {
            let val = $.fn.dataTable.util.escapeRegex($(this).val());
            auditDataTable.column(5).search(val ? '^' + val + '$' : '', true, false).draw();
        });

        $('#actionFilter').on('change', function() {
            // Because badge holds HTML, DataTables search matches actual text natively.
            let val = $.fn.dataTable.util.escapeRegex($(this).val());
            auditDataTable.column(6).search(val ? val : '', true, false).draw();
        });
    }

// ── Init ──────────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudit);
} else {
    initAudit();
}
