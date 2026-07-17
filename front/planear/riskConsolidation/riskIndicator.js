import config from "../../js/config.js";

const SHEET_API = `${config.BASE_API_URL}processSheet.php`;
let idEmpresa = null;

const loadCargos = async () => {
    try {
        let cargoIdEmpresa = idEmpresa;
        try {
            const userStr = sessionStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user && user.idClient) {
                    cargoIdEmpresa = user.idClient;
                }
            }
        } catch (e) {
            console.warn("Could not parse user from sessionStorage:", e);
        }
        
        const res = await fetch(`${SHEET_API}?action=getPersonnelConsolidado&idEmpresa=${cargoIdEmpresa}`);
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

    idEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
    
    // Always load cargos
    await loadCargos();

    // Load existing indicator if editing (check URL hash params)
    let indicatorId = null;
    const hash = window.location.hash;
    if (hash.includes('?')) {
        const hashParams = new URLSearchParams(hash.split('?')[1]);
        indicatorId = hashParams.get('indicatorId') || hashParams.get('id');
    }
    
    if (indicatorId) {
        console.log('Editing indicator:', indicatorId);
        try {
            const getRes = await fetch(`${config.BASE_API_URL}riskConsolidation.php?idEmpresa=${idEmpresa}`);
            const getResp = await getRes.json();
            
            if (getResp.status === 'ok') {
                const indicadoresData = getResp.result.indicadores || [];
                
                console.log("Raw indicadoresData from API:", JSON.stringify(indicadoresData));
                
                // Assign local IDs so they match
                indicadoresData.forEach((item, index) => { 
                    if (item.id === undefined || item.id === null) {
                        item.id = index + 1; 
                    }
                });
                
                console.log("indicadoresData after assigning IDs:", JSON.stringify(indicadoresData));
                
                const indicator = indicadoresData.find(i => i.id == indicatorId);
                console.log("Found indicator object:", indicator);
                
                if (indicator) {
                    document.getElementById('formula').value = indicator.formula || '';
                    document.getElementById('responsable').value = indicator.responsable || ''; // usually missing in DB, but try
                    document.getElementById('limiteCritico').value = indicator.limiteCritico || '';
                    document.getElementById('fuenteInformacion').value = indicator.fuente || '';
                    document.getElementById('periodicidad').value = indicator.periodicidad || 'Mensual';
                    
                    if (indicator.tipo_indicador) {
                        document.getElementById('tipoIndicador').value = indicator.tipo_indicador;
                    }
                    if (indicator.tipo_limite) {
                        document.getElementById('tipoLimite').value = indicator.tipo_limite;
                    }
                    
                    document.getElementById('dirigidoA').value = indicator.dirigidoA || '';
                    
                    // limiteEsperado was combined operator + value
                    const esperado = indicator.limiteEsperado || '';
                    if (esperado.startsWith('>=') || esperado.startsWith('<=')) {
                        document.getElementById('limiteOperador').value = esperado.substring(0, 2);
                        document.getElementById('limiteEsperado').value = esperado.substring(2).trim();
                    } else if (esperado.startsWith('>') || esperado.startsWith('<') || esperado.startsWith('=')) {
                        document.getElementById('limiteOperador').value = esperado.charAt(0);
                        document.getElementById('limiteEsperado').value = esperado.substring(1).trim();
                    } else {
                        document.getElementById('limiteEsperado').value = esperado.trim();
                    }
                }
            }
        } catch (e) {
            console.error("Error loading indicator data for edit:", e);
        }
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
        let currentIdEmpresa = sessionStorage.getItem('idEmpresa') || localStorage.getItem('idEmpresa') || 1;
        
        // 1. Fetch current consolidation data
        const getRes = await fetch(`${config.BASE_API_URL}riskConsolidation.php?idEmpresa=${currentIdEmpresa}`);
        const getResp = await getRes.json();
        
        let payload = {
            idEmpresa: currentIdEmpresa,
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

        // Assign local IDs just like in riskActions.js
        payload.indicadores.forEach((item, index) => { if (item.id === undefined) item.id = index + 1; });

        // Add or Edit the indicator
        let indicatorId = null;
        const hash = window.location.hash;
        if (hash.includes('?')) {
            const hashParams = new URLSearchParams(hash.split('?')[1]);
            indicatorId = hashParams.get('indicatorId') || hashParams.get('id');
        }
        
        if (indicatorId) {
            // Edit existing
            const index = payload.indicadores.findIndex(i => i.id == indicatorId);
            if (index !== -1) {
                // Keep the same ID
                data.id = payload.indicadores[index].id;
                payload.indicadores[index] = data;
            } else {
                // Failsafe if not found
                data.id = parseInt(indicatorId);
                payload.indicadores.push(data);
            }
        } else {
            // Add new indicator
            const newId = payload.indicadores.length > 0 ? Math.max(...payload.indicadores.map(i => i.id)) + 1 : 1;
            data.id = newId;
            payload.indicadores.push(data);
        }

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
