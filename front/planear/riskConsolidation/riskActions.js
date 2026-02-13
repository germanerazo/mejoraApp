// Get risk data from localStorage
const selectedRisk = JSON.parse(localStorage.getItem('selectedRisk') || '{}');
const selectedPeriod = JSON.parse(localStorage.getItem('selectedPeriod') || '{}');

// Mock data for Programa de Gestión
let programaData = {
    objetivo: 'Actividades encaminadas a prevenir y proteger la integridad física y mental de los trabajadores mediante la identificación, evaluación y control de los riesgos asociados.',
    marcoLegal: 'Decreto 1072 de 2015, Resolución 312 de 2019, Ley 1562 de 2012',
    peligrosAsociados: [
        { id: 1, nombre: 'SARS-COV 2' },
        { id: 2, nombre: 'Radiaciones no ionizantes' },
        { id: 3, nombre: 'Locativo' }
    ]
};

// Indicadores mock data
let indicadoresData = [
    {
        id: 1,
        formula: '(N° DE CAPACITACIONES DESARROLLADAS/ N° DE CAPACITACIONES PROGRAMADAS)*100',
        limiteEsperado: '>= 80',
        limiteCritico: '20',
        fuente: 'Plan de trabajo',
        periodicidad: 'Trimestral',
        dirigidoA: 'Trabajadores'
    },
    {
        id: 2,
        formula: '(N° DE INSPECCIONES REALIZADAS / N° DE INSPECCIONES PROGRAMADAS)*100',
        limiteEsperado: '>= 90',
        limiteCritico: '30',
        fuente: 'Cronograma de inspecciones',
        periodicidad: 'Semestral',
        dirigidoA: 'Áreas operativas'
    }
];

// Medidas mock data
let medidasData = [
    {
        id: 1,
        medida: 'Verificación de entrega y uso completo de EPP para Poda',
        responsable: 'Responsable del SG-SST',
        recurso: 'Humano',
        fechaPlaneacion: '2024-03-15',
        cargos: ['Operarios de campo']
    },
    {
        id: 2,
        medida: 'Pausas activas visuales',
        responsable: 'Representante Legal',
        recurso: 'Financiero',
        fechaPlaneacion: '2024-04-01',
        cargos: ['Personal administrativo', 'Auxiliar Contable']
    }
];

const initRiskActions = () => {
    // Set program title with risk info
    if (selectedRisk.peligro) {
        document.getElementById('programTitle').textContent = 
            `PROGRAMA DE GESTIÓN - ${selectedRisk.programas || 'SIN PROGRAMA'}`;
    }

    // Load existing data
    const objetivoEl = document.getElementById('objetivo');
    const marcoLegalEl = document.getElementById('marcoLegal');
    
    if (objetivoEl) objetivoEl.value = programaData.objetivo;
    if (marcoLegalEl) marcoLegalEl.value = programaData.marcoLegal;

     renderPeligros();
    renderIndicadores();
    renderMedidas();
};

const renderPeligros = () => {
    const container = document.getElementById('peligrosContainer');
    if (!container) return;

    let html = '';
    programaData.peligrosAsociados.forEach(peligro => {
        html += `
            <div class="peligro-tag">
                <span>${peligro.nombre}</span>
                <i class="fas fa-times" onclick="removePeligro(${peligro.id})" style="margin-left: 8px; cursor: pointer; color: #e74c3c;"></i>
            </div>
        `;
    });
    container.innerHTML = html;
};

const renderIndicadores = () => {
    const tbody = document.getElementById('indicadoresBody');
    if (!tbody) return;

    if (indicadoresData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No hay indicadores registrados.</td></tr>';
        return;
    }

    let html = '';
    indicadoresData.forEach(item => {
        html += `
            <tr class="fade-in">
                <td style="text-align: center;">
                    <button class="btn-edit-premium" onclick="editIndicador(${item.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete-premium" onclick="deleteIndicador(${item.id})" title="Eliminar">
                        <i class="fas fa-minus-circle"></i>
                    </button>
                </td>
                <td>${item.formula}</td>
                <td style="text-align: center;">${item.limiteEsperado}</td>
                <td style="text-align: center;">${item.limiteCritico}</td>
                <td>${item.fuente}</td>
                <td>${item.periodicidad}</td>
                <td>${item.dirigidoA}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
};

const renderMedidas = () => {
    const tbody = document.getElementById('medidasBody');
    if (!tbody) return;

    if (medidasData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No hay medidas registradas.</td></tr>';
        return;
    }

    let html = '';
    medidasData.forEach(item => {
        // Create HTML for cargos list
        let cargosHtml = '<div style="display: flex; align-items: flex-start; justify-content: space-between;">';
        cargosHtml += '<div style="flex-grow: 1;">';
        if (Array.isArray(item.cargos) && item.cargos.length > 0) {
            cargosHtml += '<ul style="margin: 0; padding-left: 15px; font-size: 0.9em;">';
            item.cargos.forEach(cargo => {
                cargosHtml += `<li>${cargo}</li>`;
            });
            cargosHtml += '</ul>';
        } else {
            cargosHtml += '<span style="color: #999; font-style: italic;">Sin cargos asignados</span>';
        }
        cargosHtml += '</div>';
        
        // Add "+" button
        cargosHtml += `
            <button class="btn-edit-premium" onclick="manageCargos(${item.id})" title="Gestionar Cargos" style="margin-left: 8px; flex-shrink: 0; padding: 2px 6px; font-size: 0.8rem; background-color: #ff9800; border-color: #f57c00; color: white;">
                <i class="fas fa-plus"></i>
            </button>
        `;
        cargosHtml += '</div>';

        html += `
            <tr class="fade-in">
                <td style="text-align: center;">
                    <button class="btn-edit-premium" onclick="editMedida(${item.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete-premium" onclick="deleteMedida(${item.id})" title="Eliminar">
                        <i class="fas fa-minus-circle"></i>
                    </button>
                </td>
                <td>${item.medida}</td>
                <td>${item.responsable}</td>
                <td>${item.recurso}</td>
                <td>${item.fechaPlaneacion}</td>
                <td>${cargosHtml}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
};

window.addPeligro = () => {
    Swal.fire({
        title: 'Agregar Peligro Asociado',
        input: 'text',
        inputPlaceholder: 'Nombre del peligro',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#329bd6',
        inputValidator: (value) => {
            if (!value) {
                return 'Debes ingresar un nombre para el peligro';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newId = programaData.peligrosAsociados.length > 0 
                ? Math.max(...programaData.peligrosAsociados.map(p => p.id)) + 1 
                : 1;
            programaData.peligrosAsociados.push({
                id: newId,
                nombre: result.value
            });
            renderPeligros();
        }
    });
};

window.removePeligro = (id) => {
    Swal.fire({
        title: '¿Eliminar peligro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            programaData.peligrosAsociados = programaData.peligrosAsociados.filter(p => p.id !== id);
            renderPeligros();
            Swal.fire('Eliminado', 'El peligro ha sido eliminado', 'success');
        }
    });
};

window.addIndicador = () => {
    // Get the current risk ID from the URL or localStorage if available
    const urlParams = new URLSearchParams(window.location.search);
    const riskId = urlParams.get('riskId');
    
    // Redirect to the new indicator form page with HASH navigation to keep dashboard context
    window.location.hash = `../planear/riskConsolidation/riskIndicator.php?riskId=${riskId}`;
};

window.editIndicador = (id) => {
    const indicador = indicadoresData.find(i => i.id === id);
    if (!indicador) return;

    Swal.fire({
        title: 'Editar Indicador',
        html: `
            <div style="text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Descripción de Fórmula:</label>
                <textarea id="swal-formula" class="swal2-textarea">${indicador.formula}</textarea>
                
                <label style="display: block; margin-bottom: 5px; margin-top: 10px; font-weight: 500;">Límite Esperado:</label>
                <input type="text" id="swal-esperado" class="swal2-input" value="${indicador.limiteEsperado}">
                
                <label style="display: block; margin-bottom: 5px; margin-top: 10px; font-weight: 500;">Límite Crítico:</label>
                <input type="text" id="swal-critico" class="swal2-input" value="${indicador.limiteCritico}">
                
                <label style="display: block; margin-bottom: 5px; margin-top: 10px; font-weight: 500;">Fuente de Información:</label>
                <input type="text" id="swal-fuente" class="swal2-input" value="${indicador.fuente}">
                
                <label style="display: block; margin-bottom: 5px; margin-top: 10px; font-weight: 500;">Periodicidad:</label>
                <select id="swal-periodicidad" class="swal2-input">
                    <option value="Mensual" ${indicador.periodicidad === 'Mensual' ? 'selected' : ''}>Mensual</option>
                    <option value="Trimestral" ${indicador.periodicidad === 'Trimestral' ? 'selected' : ''}>Trimestral</option>
                    <option value="Semestral" ${indicador.periodicidad === 'Semestral' ? 'selected' : ''}>Semestral</option>
                    <option value="Anual" ${indicador.periodicidad === 'Anual' ? 'selected' : ''}>Anual</option>
                </select>
                
                <label style="display: block; margin-bottom: 5px; margin-top: 10px; font-weight: 500;">Dirigido A:</label>
                <input type="text" id="swal-dirigido" class="swal2-input" value="${indicador.dirigidoA}">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#329bd6',
        width: '600px',
        preConfirm: () => {
            return {
                formula: document.getElementById('swal-formula').value,
                esperado: document.getElementById('swal-esperado').value,
                critico: document.getElementById('swal-critico').value,
                fuente: document.getElementById('swal-fuente').value,
                periodicidad: document.getElementById('swal-periodicidad').value,
                dirigido: document.getElementById('swal-dirigido').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            indicador.formula = result.value.formula;
            indicador.limiteEsperado = result.value.esperado;
            indicador.limiteCritico = result.value.critico;
            indicador.fuente = result.value.fuente;
            indicador.periodicidad = result.value.periodicidad;
            indicador.dirigidoA = result.value.dirigido;
            renderIndicadores();
            Swal.fire('Actualizado', 'Indicador actualizado correctamente', 'success');
        }
    });
};

window.deleteIndicador = (id) => {
    Swal.fire({
        title: '¿Eliminar indicador?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            indicadoresData = indicadoresData.filter(i => i.id !== id);
            renderIndicadores();
            Swal.fire('Eliminado', 'Indicador eliminado correctamente', 'success');
        }
    });
};

window.addMedida = () => {
    Swal.fire({
        title: 'Nueva Medida de Prevención',
        html: `
            <div style="text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Medida de Prevención y Control:</label>
                <textarea id="swal-medida" class="swal2-textarea" placeholder="Descripción de la medida"></textarea>
                
                <label style="display: block; margin-bottom: 5px; margin-top: 10px; font-weight: 500;">Responsable:</label>
                <input type="text" id="swal-responsable" class="swal2-input" placeholder="Ej: Responsable del SG-SST">
                
                <label style="display: block; margin-bottom: 5px; margin-top: 10px; font-weight: 500;">Recurso:</label>
                <select id="swal-recurso" class="swal2-input">
                    <option value="">Seleccione...</option>
                    <option value="Humano">Humano</option>
                    <option value="Financiero">Financiero</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Mixto">Mixto</option>
                </select>
                
                <label style="display: block; margin-bottom: 5px; margin-top: 10px; font-weight: 500;">Fecha de Planeación:</label>
                <input type="date" id="swal-fecha" class="swal2-input">
                
                <label style="display: block; margin-bottom: 5px; margin-top: 10px; font-weight: 500;">Cargo Inicial (Opcional):</label>
                <input type="text" id="swal-cargos" class="swal2-input" placeholder="Ej: Operarios de campo">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#329bd6',
        width: '600px',
        preConfirm: () => {
            const medida = document.getElementById('swal-medida').value;
            const responsable = document.getElementById('swal-responsable').value;
            const recurso = document.getElementById('swal-recurso').value;
            const fecha = document.getElementById('swal-fecha').value;
            const cargo = document.getElementById('swal-cargos').value;

            if (!medida || !responsable || !recurso || !fecha) {
                Swal.showValidationMessage('Todos los campos son obligatorios excepto Cargo Inicial');
                return false;
            }

            return { medida, responsable, recurso, fecha, cargo };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newId = medidasData.length > 0 
                ? Math.max(...medidasData.map(m => m.id)) + 1 
                : 1;
            
            const initialCargos = result.value.cargo ? [result.value.cargo] : [];

            medidasData.push({
                id: newId,
                medida: result.value.medida,
                responsable: result.value.responsable,
                recurso: result.value.recurso,
                fechaPlaneacion: result.value.fecha,
                cargos: initialCargos
            });
            renderMedidas();
            Swal.fire('Guardado', 'Medida agregada correctamente', 'success');
        }
    });
};

window.editMedida = (id) => {
    const medida = medidasData.find(m => m.id === id);
    if (!medida) return;

    Swal.fire({
        title: 'Editar Medida',
        html: `
            <div style="text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Medida de Prevención y Control:</label>
                <textarea id="swal-medida" class="swal2-textarea">${medida.medida}</textarea>
                
                <label style="display: block; margin-bottom: 5px; margin-top: 10px; font-weight: 500;">Responsable:</label>
                <input type="text" id="swal-responsable" class="swal2-input" value="${medida.responsable}">
                
                <label style="display: block; margin-bottom: 5px; margin-top: 10px; font-weight: 500;">Recurso:</label>
                <select id="swal-recurso" class="swal2-input">
                    <option value="Humano" ${medida.recurso === 'Humano' ? 'selected' : ''}>Humano</option>
                    <option value="Financiero" ${medida.recurso === 'Financiero' ? 'selected' : ''}>Financiero</option>
                    <option value="Técnico" ${medida.recurso === 'Técnico' ? 'selected' : ''}>Técnico</option>
                    <option value="Mixto" ${medida.recurso === 'Mixto' ? 'selected' : ''}>Mixto</option>
                </select>
                
                <label style="display: block; margin-bottom: 5px; margin-top: 10px; font-weight: 500;">Fecha de Planeación:</label>
                <input type="date" id="swal-fecha" class="swal2-input" value="${medida.fechaPlaneacion}">
                
                <p style="margin-top: 15px; font-size: 0.9em; color: #666; font-style: italic;">
                    <i class="fas fa-info-circle"></i> Para gestionar los cargos dirigidos, utilice el botón (+) en la tabla principal.
                </p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#329bd6',
        width: '600px',
        preConfirm: () => {
            return {
                medida: document.getElementById('swal-medida').value,
                responsable: document.getElementById('swal-responsable').value,
                recurso: document.getElementById('swal-recurso').value,
                fecha: document.getElementById('swal-fecha').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            medida.medida = result.value.medida;
            medida.responsable = result.value.responsable;
            medida.recurso = result.value.recurso;
            medida.fechaPlaneacion = result.value.fecha;
            renderMedidas();
            Swal.fire('Actualizado', 'Medida actualizada correctamente', 'success');
        }
    });
};

window.manageCargos = (id) => {
    const medida = medidasData.find(m => m.id === id);
    if (!medida) return;

    // Generate List HTML
    let listHtml = '';
    if (Array.isArray(medida.cargos) && medida.cargos.length > 0) {
        listHtml = '<ul style="list-style: none; padding: 0; margin-top: 15px; border: 1px solid #eee; border-radius: 4px;">';
        medida.cargos.forEach((cargo, index) => {
            listHtml += `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; background-color: ${index % 2 === 0 ? '#f9f9f9' : '#fff'};">
                    <span>${cargo}</span>
                    <button onclick="removeCargo(${id}, ${index})" style="background: none; border: none; color: #dc3545; cursor: pointer;" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </li>
            `;
        });
        listHtml += '</ul>';
    } else {
        listHtml = '<p style="color: #666; font-style: italic; margin-top: 15px;">No hay cargos asignados</p>';
    }

    Swal.fire({
        title: 'Gestión de Cargos',
        html: `
            <div style="text-align: left;">
                <p style="font-size: 0.9em; color: #555; margin-bottom: 15px;"><strong>Medida:</strong> ${medida.medida}</p>
                
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <input type="text" id="swal-new-cargo" class="swal2-input" placeholder="Nuevo cargo" style="margin: 0; flex-grow: 1;">
                    <button type="button" onclick="addCargo(${id})" class="swal2-confirm swal2-styled" style="margin: 0; background-color: #329bd6; width: auto; padding: 0 20px;">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <div id="cargos-list-container">
                    ${listHtml}
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        width: '500px'
    });
};

window.addCargo = (medidaId) => {
    const input = document.getElementById('swal-new-cargo');
    const newCargo = input.value.trim();
    
    if (!newCargo) return;

    const medida = medidasData.find(m => m.id === medidaId);
    if (medida) {
        if (!Array.isArray(medida.cargos)) medida.cargos = [];
        medida.cargos.push(newCargo);
        renderMedidas(); // Update main table
        
        // Refresh the modal content specifically without closing it
        window.manageCargos(medidaId); 
    }
};

window.removeCargo = (medidaId, index) => {
    const medida = medidasData.find(m => m.id === medidaId);
    if (medida && Array.isArray(medida.cargos)) {
        medida.cargos.splice(index, 1);
        renderMedidas(); // Update main table
        window.manageCargos(medidaId); // Refresh modal
    }
};

window.savePrograma = () => {
    programaData.objetivo = document.getElementById('objetivo').value;
    programaData.marcoLegal = document.getElementById('marcoLegal').value;

    Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'El programa de gestión ha sido guardado correctamente',
        confirmButtonColor: '#329bd6'
    });
};

window.goBackToConsolidation = () => {
    window.history.back();
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRiskActions);
} else {
    initRiskActions();
}
