import config from "../../js/config.js";

const ANNUAL_API = `${config.BASE_API_URL}annual.php`;
const DANGER_API = `${config.BASE_API_URL}dangerMgmt.php`;

let periodsData = [];
let consolidationData = [];
let idEmpresa = null;

const getToken = () => sessionStorage.getItem('token');

const initConsolidation = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.idClient) {
        idEmpresa = user.idClient;
        await loadInitialData();
        renderPeriodsList();
    } else {
        Swal.fire('Error', 'No se ha encontrado la sesión de la empresa.', 'error');
    }
};

const loadInitialData = async () => {
    try {
        // Load Periods from annual
        const resPeriods = await fetch(`${ANNUAL_API}?idEmpresa=${idEmpresa}`);
        const periodsRaw = await resPeriods.json();
        if (Array.isArray(periodsRaw)) {
            periodsData = periodsRaw.map(p => ({
                id: p.idPlan,
                startDate: p.startDate,
                endDate: p.endDate
            }));
        }

        // Load Dangers and Measures from dangerMgmt
        const resDangers = await fetch(`${DANGER_API}?action=fullReport&idEmpresa=${idEmpresa}`);
        const dangersRaw = await resDangers.json();
        
        if (Array.isArray(dangersRaw)) {
            consolidationData = dangersRaw.map(item => ({
                id: item.adc_id,
                proceso: item.process_name || "Sin proceso", // Use actual process name from DB
                peligro: item.danger_name, // Map danger_name to peligro
                medidas: item.measures, // Map measures 
                programas: "", // Initially empty until API supports saving these dynamically
                pve: "",
                subProgramas: ""
            }));
        }
    } catch (err) {
        console.error("Error loading data:", err);
    }
};

const renderPeriodsList = () => {
    const tbody = document.getElementById("periodBody");
    if (!tbody) return;

    if (!Array.isArray(periodsData) || periodsData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" style="text-align: center; padding: 20px;">No hay períodos registrados.</td></tr>`;
        return;
    }

    let html = "";
  periodsData.forEach((period) => {
    html += `
      <tr>
        <td style="text-align: center; font-weight: 500;">Desde: ${period.startDate}- Hasta: ${period.endDate}</td>
        <td style="text-align: center;">
          <button class="btn-edit-premium" onclick="viewPeriodConsolidation(${period.id})" title="Ver consolidación">
            <i class="fas fa-search"></i>
          </button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
};

window.viewPeriodConsolidation = (periodId) => {
  const period = periodsData.find((p) => p.id == periodId);
  if (!period) return;

  // Hide list view, show detail view
  document.getElementById("listView").style.display = "none";
  document.getElementById("detailView").style.display = "block";

  // Initialize event listeners
  const searchInput = document.getElementById("searchRisk");
  const filterProcess = document.getElementById("filterProcess");

  // Remove old listeners
  searchInput.removeEventListener("input", applyFilters);
  filterProcess.removeEventListener("change", applyFilters);

  // Add new listeners
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (filterProcess) filterProcess.addEventListener("change", applyFilters);

  // Render table
  renderTable(consolidationData);

  // Store selected period
  window.currentPeriod = period;
};

window.goBackToList = () => {
  document.getElementById("detailView").style.display = "none";
  document.getElementById("listView").style.display = "block";
};

const renderTable = (data) => {
  const tbody = document.getElementById("consolidationBody");
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="8" class="empty-state">No se encontraron riesgos que coincidan con los filtros.</td></tr>';
    return;
  }

  let html = "";
  data.forEach((item) => {
    const hasProgramas = item.programas && item.programas.trim() !== "";
    const hasPVE = item.pve && item.pve.trim() !== "";
    const hasSubProgramas =
      item.subProgramas && item.subProgramas.trim() !== "";
    
    const hasAllData = hasProgramas || hasPVE;

    html += `
            <tr class="fade-in">
                <td style="text-align: center; cursor: ${hasAllData ? 'pointer' : 'default'};" ${hasAllData ? `onclick="toggleExpandRow(${item.id})"` : ''}>
                    ${hasAllData ? `<i class="fas fa-chevron-down" id="arrow-${item.id}"></i>` : ''}
                </td>
                <td style="font-weight: 600; color: #34495e;">${item.peligro}</td>
                <td><div style="font-size: 0.95em; line-height: 1.4;">${item.medidas}</div></td>
                <td>${item.proceso}</td>
                <td>${item.programas || '<span style="color: #999;">-</span>'}</td>
                <td>${item.pve || '<span style="color: #999;">-</span>'}</td>
                <td>${item.subProgramas || '<span style="color: #999;">-</span>'}</td>
                <td style="text-align: center;">
                    <button class="btn-edit-premium" onclick="addProgramData(${item.id})" title="${hasAllData ? 'Editar Programas' : 'Crear Programas'}">
                        <i class="fas ${hasAllData ? 'fa-edit' : 'fa-plus'}"></i>
                    </button>
                    ${hasAllData ? `
                    <button class="btn-edit-premium" onclick="viewRiskActions(${item.id})" title="Ver Acciones">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    ` : ''}
                </td>
            </tr>
        `;
  });
  tbody.innerHTML = html;
};

window.toggleExpandRow = (id) => {
  const expandRow = document.getElementById(`expand-${id}`);
  const arrow = document.getElementById(`arrow-${id}`);

  if (expandRow) {
    expandRow.classList.toggle("active");
    arrow.style.transform = expandRow.classList.contains("active")
      ? "rotate(180deg)"
      : "rotate(0deg)";
  }
};

const applyFilters = () => {
  const search = document.getElementById("searchRisk").value.toLowerCase();
  const process = document.getElementById("filterProcess").value;

  const filtered = consolidationData.filter((item) => {
    const matchesSearch =
      item.peligro.toLowerCase().includes(search) ||
      (item.proceso && item.proceso.toLowerCase().includes(search)) ||
      (item.medidas && item.medidas.toLowerCase().includes(search)) ||
      (item.programas && item.programas.toLowerCase().includes(search)) ||
      (item.pve && item.pve.toLowerCase().includes(search)) ||
      (item.subProgramas && item.subProgramas.toLowerCase().includes(search));

    const matchesProcess = process === "" || item.proceso.includes(process);

    return matchesSearch && matchesProcess;
  });

  renderTable(filtered);
};

window.editRisk = (id) => {
  const risk = consolidationData.find((r) => r.id === id);
  Swal.fire({
    title: "Editar Controles",
    html: `
            <p style="text-align: left; margin-bottom: 5px;"><strong>Peligro:</strong> ${risk.peligro}</p>
            <p style="text-align: left; margin-bottom: 20px;"><strong>Medidas Actuales:</strong> ${risk.medidas}</p>
            <textarea id="swal-input-medidas" class="swal2-textarea" placeholder="Nuevas medidas de intervención">${risk.medidas}</textarea>
        `,
    showCancelButton: true,
    confirmButtonText: "Guardar Cambios",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#329bd6",
    preConfirm: () => {
      return document.getElementById("swal-input-medidas").value;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      risk.medidas = result.value;
      renderTable(consolidationData);
      Swal.fire(
        "¡Actualizado!",
        "Las medidas de intervención han sido actualizadas.",
        "success",
      );
    }
  });
};

window.addProgramData = (id) => {
  const risk = consolidationData.find((r) => r.id === id);
  Swal.fire({
    title: "Crear/Editar Programas y Planes",
    html: `
            <p style="text-align: left; margin-bottom: 10px;"><strong>Peligro:</strong> ${
              risk.peligro
            }</p>
            <div style="text-align: left; margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Programas de Gestión: <span style="color: #d9534f;">*</span></label>
                <input type="text" id="swal-input-programas" class="swal2-input" value="${
                  risk.programas || ""
                }" placeholder="Ej: Ergonomía y Bienestar">
                <small style="color: #999; display: block; margin-top: 3px;">Requerido si PVE está vacío</small>
                
                <label style="display: block; margin-bottom: 8px; margin-top: 15px; font-weight: 500;">PVE: <span style="color: #d9534f;">*</span></label>
                <input type="text" id="swal-input-pve" class="swal2-input" value="${
                  risk.pve || ""
                }" placeholder="Ej: PVE-01">
                <small style="color: #999; display: block; margin-top: 3px;">Requerido si Programas de Gestión está vacío</small>
                
                <label style="display: block; margin-bottom: 8px; margin-top: 15px; font-weight: 500;">Sub Programas: <span style="color: #999;">(Opcional)</span></label>
                <input type="text" id="swal-input-subProgramas" class="swal2-input" value="${
                  risk.subProgramas || ""
                }" placeholder="Ej: Pausas activas">
            </div>
        `,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#329bd6",
    preConfirm: () => {
      const programas = document.getElementById("swal-input-programas").value.trim();
      const pve = document.getElementById("swal-input-pve").value.trim();
      const subProgramas = document.getElementById(
        "swal-input-subProgramas",
      ).value.trim();

      // Validación: Al menos uno de Programas o PVE debe estar diligenciado
      if (!programas && !pve) {
        Swal.showValidationMessage("Debes diligenciar al menos Programas de Gestión o PVE");
        return false;
      }

      // Sub Programas es opcional
      return { programas, pve, subProgramas };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      risk.programas = result.value.programas;
      risk.pve = result.value.pve;
      risk.subProgramas = result.value.subProgramas;
      renderTable(consolidationData);
      Swal.fire(
        "¡Guardado!",
        "Los programas y planes han sido creados/actualizados.",
        "success",
      );
    }
  });
};

window.goBackRisk = () => {
  window.location.href = "../risk/risk.php";
};

window.viewRiskActions = (id) => {
  const risk = consolidationData.find((r) => r.id === id);
  if (!risk) {
    console.error('Riesgo no encontrado');
    return;
  }
  
  // Guardar el riesgo seleccionado en localStorage para pasar a la nueva pantalla
  localStorage.setItem('selectedRisk', JSON.stringify(risk));
  localStorage.setItem('selectedPeriod', JSON.stringify(window.currentPeriod));
  
  // Redirigir a la nueva pantalla de acciones usando hash para mantener el dashboard
  window.location.hash = `../planear/riskConsolidation/riskActions.php?riskId=${id}`;
};

// Initialization
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initConsolidation);
} else {
  initConsolidation();
}
