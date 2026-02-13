// Períodos mock data
const periodsData = [
  { id: 1, startDate: "2017-04-01", endDate: "2018-03-31" },
  { id: 2, startDate: "2018-04-01", endDate: "2019-04-01" },
  { id: 3, startDate: "2019-06-15", endDate: "2020-06-30" },
  { id: 4, startDate: "2020-06-30", endDate: "2021-06-01" },
  { id: 5, startDate: "2021-06-02", endDate: "2022-06-30" },
  { id: 6, startDate: "2022-07-01", endDate: "2023-07-30" },
  { id: 7, startDate: "2023-08-01", endDate: "2024-08-30" },
  { id: 8, startDate: "2024-08-31", endDate: "2025-09-01" },
  { id: 9, startDate: "2025-09-01", endDate: "2026-09-02" },
];

// Mock Data for Consolidation (mimicking a real database dump)
const consolidationData = [
  {
    id: 101,
    proceso: "Gestión Administrativa",
    peligro: "Movimientos Repetitivos",
    medidas: "Pausas activas, Sillas ergonómicas, Descansos cada 2 horas",
    programas: "Ergonomía y Bienestar",
    pve: "PVE-01",
    subProgramas: "Pausas activas",
  },
  {
    id: 102,
    proceso: "Operaciones",
    peligro: "Ruido intermitente > 85dB",
    medidas:
      "Protección auditiva, Mantenimiento de equipos, Audiometrías anuales",
    programas: "Protección Auditiva",
    pve: "PVE-02",
    subProgramas: "Equipos de protección",
  },
  {
    id: 103,
    proceso: "Mantenimiento",
    peligro: "Caída a distinto nivel",
    medidas: "Línea de vida, Arnés, Permiso de altura, Capacitación",
    programas: "Trabajo en Alturas",
    pve: "PVE-03",
    subProgramas: "Líneas de vida",
  },
  {
    id: 104,
    proceso: "Gestión Administrativa",
    peligro: "Estrés laboral y carga mental",
    medidas: "Distribución de cargas, batería psicosocial, Apoyo psicológico",
    programas: "Salud Mental",
    pve: "PVE-04",
    subProgramas: "Evaluación psicosocial",
  },
  {
    id: 105,
    proceso: "Operaciones",
    peligro: "Inhalación de vapores",
    medidas:
      "Mascarilla media cara, Ventilación forzada, Hojas de seguridad, Monitoreo",
    programas: "",
    pve: "",
    subProgramas: "",
  },
  {
    id: 106,
    proceso: "Operaciones",
    peligro: "Contacto con energía eléctrica",
    medidas:
      "Aislamiento de circuitos, Puesta a tierra, EPP eléctrico, Señalización",
    programas: "Seguridad Eléctrica",
    pve: "PVE-06",
    subProgramas: "Instalaciones seguras",
  },
  {
    id: 107,
    proceso: "Mantenimiento",
    peligro: "Atrapamiento por máquinas",
    medidas:
      "Guardas de protección, Paros de emergencia, Bloqueos, Capacitación",
    programas: "Máquinas y Equipos",
    pve: "PVE-07",
    subProgramas: "Guardas y dispositivos",
  },
  {
    id: 108,
    proceso: "Gestión Administrativa",
    peligro: "Carga visual excesiva",
    medidas:
      "Descansos visuales, Pantallas antirreflejantes, Iluminación adecuada",
    programas: "Ergonomía y Bienestar",
    pve: "PVE-01",
    subProgramas: "Espacios de trabajo",
  },
  {
    id: 109,
    proceso: "Operaciones",
    peligro: "Exposición a temperaturas extremas",
    medidas:
      "Ropa térmica, Aclimatación gradual, Rotación de personal, Monitoreo",
    programas: "",
    pve: "",
    subProgramas: "",
  },
  {
    id: 110,
    proceso: "Mantenimiento",
    peligro: "Heridas punzocortantes",
    medidas: "Guantes reforzados, Herramientas seguras, Botiquín de emergencia",
    programas: "Prevención de Lesiones",
    pve: "PVE-09",
    subProgramas: "EPP especializado",
  },
  {
    id: 111,
    proceso: "Gestión Administrativa",
    peligro: "Falta de pausas activas",
    medidas: "Programa de pausas cada 60 minutos, Ejercicios de estiramiento",
    programas: "Ergonomía y Bienestar",
    pve: "PVE-01",
    subProgramas: "Pausa Saludable",
  },
  {
    id: 112,
    proceso: "Operaciones",
    peligro: "Proyección de fragmentos",
    medidas:
      "Gafas de seguridad, Pantallas protectoras, Mantenimiento preventivo",
    programas: "Protección Personal",
    pve: "PVE-10",
    subProgramas: "Protección ocular",
  },
  {
    id: 113,
    proceso: "Mantenimiento",
    peligro: "Exposición a polvo",
    medidas: "Mascarilla N95, Sistema de extracción, Limpieza periódica",
    programas: "",
    pve: "",
    subProgramas: "",
  },
  {
    id: 114,
    proceso: "Gestión Administrativa",
    peligro: "Traslado manual de cargas",
    medidas:
      "Técnicas de levantamiento, Carros de carga, Límite de peso máximo",
    programas: "Ergonomía y Bienestar",
    pve: "PVE-01",
    subProgramas: "Manipulación segura",
  },
  {
    id: 115,
    proceso: "Operaciones",
    peligro: "Resbalones y caídas",
    medidas:
      "Suelos antideslizantes, Señalización de peligro, Limpieza constante",
    programas: "Orden y Limpieza",
    pve: "PVE-11",
    subProgramas: "5S implementado",
  },
  {
    id: 116,
    proceso: "Mantenimiento",
    peligro: "Incendios y explosiones",
    medidas:
      "Extintores, Salidas de emergencia, Plan de evacuación, Inspecciones",
    programas: "Preparación para Emergencias",
    pve: "PVE-12",
    subProgramas: "Primeros auxilios",
  },
  {
    id: 117,
    proceso: "Gestión Administrativa",
    peligro: "Acoso laboral",
    medidas:
      "Política de buen trato, Denuncias anónimas, Mediación, Seguimiento",
    programas: "",
    pve: "",
    subProgramas: "",
  },
  {
    id: 118,
    proceso: "Operaciones",
    peligro: "Golpes por objetos",
    medidas: "Cascos de seguridad, Zonas de carga restringidas, Señalización",
    programas: "Protección Personal",
    pve: "PVE-10",
    subProgramas: "EPP obligatorio",
  },
  {
    id: 119,
    proceso: "Mantenimiento",
    peligro: "Radiación ionizante",
    medidas:
      "Dosímetros personales, Blindaje, Control de exposición, Monitoreo",
    programas: "Seguridad Radiológica",
    pve: "PVE-13",
    subProgramas: "Control ambiental",
  },
  {
    id: 120,
    proceso: "Gestión Administrativa",
    peligro: "Síndrome del túnel carpiano",
    medidas:
      "Mousepad ergonómico, Teclados especiales, Fisioterapia preventiva",
    programas: "Ergonomía y Bienestar",
    pve: "PVE-01",
    subProgramas: "Prevención RSL",
  },
];

const initConsolidation = () => {
  renderPeriodsList();
};

const renderPeriodsList = () => {
  const tbody = document.getElementById("periodBody");
  if (!tbody) return;

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
  const period = periodsData.find((p) => p.id === periodId);
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
