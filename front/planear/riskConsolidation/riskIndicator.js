import config from "../../js/config.js";

const SHEET_API = `${config.BASE_API_URL}processSheet.php`;
let idEmpresa = null;

const loadCargos = async () => {
    try {
        const res = await fetch(`${SHEET_API}?action=getPersonnelConsolidado&idEmpresa=${idEmpresa}`);
        const personnel = await res.json();
        
        const responsableSelect = document.getElementById('responsable');
        responsableSelect.innerHTML = '<option value="">Seleccione</option>';
        
        // Ensure uniqueness if roles are repeated across sheets
        const roles = [...new Set(personnel.map(p => p.role).filter(Boolean))].sort();
        
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            responsableSelect.appendChild(option);
        });
    } catch (e) {
        console.error("Error loading cargos:", e);
    }
};

const initRiskIndicator = async () => {
    // Get current date for the default value
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').value = today;

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        await loadCargos();
    }

    // Load existing indicator if editing (check URL params)
    const urlParams = new URLSearchParams(window.location.search);
    const indicatorId = urlParams.get('id');
    
    if (indicatorId) {
        // Logic to load existing indicator data would go here
        console.log('Editing indicator:', indicatorId);
    }
};

window.saveIndicador = async () => {
    // Collect form data
    const formulaEl = document.getElementById('formula');
    const responsableEl = document.getElementById('responsable');
    const limiteEsperadoEl = document.getElementById('limiteEsperado');
    const limiteOperadorEl = document.getElementById('limiteOperador');
    
    // Basic Validation
    if (!formulaEl.value || !responsableEl.value || !limiteEsperadoEl.value) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor complete todos los campos obligatorios',
            confirmButtonColor: '#329bd6'
        });
        return;
    }

    const data = {
        formula: formulaEl.value,
        responsable: responsableEl.value,
        limiteEsperado: `${limiteOperadorEl.value} ${limiteEsperadoEl.value}`,
        limiteCritico: document.getElementById('limiteCritico').value,
        fuente: document.getElementById('fuenteInformacion').value, 
        periodicidad: document.getElementById('periodicidad').value,
        tipoIndicador: document.getElementById('tipoIndicador').value,
        tipoLimite: document.getElementById('tipoLimite').value,
        dirigidoA: document.getElementById('dirigidoA').value,
        fecha: document.getElementById('fecha').value
    };

    try {
        const idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
        
        // 1. Fetch current consolidation data
        const getRes = await fetch(`${config.BASE_API_URL}riskConsolidation.php?idEmpresa=${idEmpresa}`);
        const getResp = await getRes.json();
        
        let payload = {
            idEmpresa: idEmpresa,
            objetivo: '',
            marcoLegal: '',
            indicadores: [],
            medidas: []
        };

        if (getResp.status === 'ok') {
            payload.objetivo = getResp.result.programa?.objetivo || '';
            payload.marcoLegal = getResp.result.programa?.marcoLegal || '';
            payload.indicadores = getResp.result.indicadores || [];
            payload.medidas = getResp.result.medidas || [];
        }

        // Add the new indicator
        const newId = payload.indicadores.length > 0 ? Math.max(...payload.indicadores.map(i => i.id)) + 1 : 1;
        data.id = newId;
        payload.indicadores.push(data);

        // 2. Post the updated data to save it
        const postRes = await fetch(`${config.BASE_API_URL}riskConsolidation.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const postResp = await postRes.json();

        if (postResp.status === 'ok') {
            Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'El indicador ha sido guardado correctamente',
                confirmButtonColor: '#329bd6'
            }).then(() => {
                goBack();
            });
        } else {
            Swal.fire('Error', 'Error al guardar el indicador', 'error');
        }
    } catch(e) {
        console.error("Error saving indicator:", e);
        Swal.fire('Error', 'Ocurrió un error en la solicitud', 'error');
    }
};

window.goBack = () => {
    // We want to go back to riskActions.php, preserving the riskId if possible
    // Since we don't have the riskId easily available unless passed in URL,
    // window.history.back() is the safest bet for now.
    window.history.back();
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRiskIndicator);
} else {
    initRiskIndicator();
}
