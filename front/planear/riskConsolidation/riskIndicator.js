// JavaScript for Risk Indicator Form

const initRiskIndicator = () => {
    // Get current date for the default value
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').value = today;

    // Load existing indicator if editing (check URL params)
    const urlParams = new URLSearchParams(window.location.search);
    const indicatorId = urlParams.get('id');
    
    if (indicatorId) {
        // Logic to load existing indicator data would go here
        console.log('Editing indicator:', indicatorId);
    }
};

window.saveIndicador = () => {
    // Collect form data
    const data = {
        formula: document.getElementById('formula').value,
        responsable: document.getElementById('responsable').value,
        limiteOperador: document.getElementById('limiteOperador').value,
        limiteEsperado: document.getElementById('limiteEsperado').value,
        limiteCritico: document.getElementById('limiteCritico').value,
        fuenteInformacion: document.getElementById('formula').value, // Assuming this maps to source, or check field name
        periodicidad: document.getElementById('periodicidad').value,
        tipoIndicador: document.getElementById('tipoIndicador').value,
        tipoLimite: document.getElementById('tipoLimite').value,
        dirigidoA: document.getElementById('dirigidoA').value,
        fecha: document.getElementById('fecha').value
    };

    // Basic Validation
    if (!data.formula || !data.responsable || !data.limiteEsperado) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor complete todos los campos obligatorios',
            confirmButtonColor: '#329bd6'
        });
        return;
    }

    // Simulate saving
    console.log('Saving Indicator:', data);

    Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'El indicador ha sido guardado correctamente',
        confirmButtonColor: '#329bd6'
    }).then(() => {
        // In a real app, you might save to localStorage or backend here
        // For now, let's just go back
        goBack();
    });
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
