// Mock Data
let policies = [
    { id: 1, name: "Política de Calidad", date: "2024-01-15", file: "politica_calidad_v3.pdf" },
    { id: 2, name: "Política de Seguridad y Salud en el Trabajo", date: "2024-02-10", file: "politica_sst_2024.pdf" },
    { id: 3, name: "Política de Tratamiento de Datos", date: "2023-11-05", file: "tratamiento_datos.pdf" },
    { id: 4, name: "Política de Uso Responsable de Recursos", date: "2024-03-20", file: "uso_recursos.docx" },
    { id: 5, name: "Política Ambiental", date: "2024-01-20", file: "politica_ambiental.pdf" }
];

// Initialization
const initPolicies = () => {
    renderPolicies();
};

// Check if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initPolicies);
} else {
    initPolicies();
}

function renderPolicies() {
    const tbody = document.querySelector('#policiesTable tbody');
    if (!tbody) return;

    if (policies.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-state">No hay políticas registradas.</td></tr>`;
        return;
    }

    let html = '';
    policies.forEach(item => {
        html += `<tr>
            <td>
                <button class="btn-icon btn-edit" title="Editar" onclick="editPolicy(${item.id})">✏️</button>
                <button class="btn-icon btn-delete" title="Eliminar" onclick="deletePolicy(${item.id})">🗑️</button>
            </td>
            <td>${item.name}</td>
            <td>${item.date}</td>
            <td><a href="#" onclick="return false;" style="color: var(--primary-color); text-decoration: none;">⬇️ ${item.file}</a></td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// Global Functions
window.addPolicy = async function() {
    const { value: formValues } = await Swal.fire({
        title: 'Nueva Política',
        html: `
            <input id="swal-pol-name" class="swal2-input" placeholder="Nombre de la Política">
            <input type="date" id="swal-pol-date" class="swal2-input" value="${new Date().toISOString().split('T')[0]}">
            <div class="file-upload-wrapper" style="margin-top: 15px;">
                <label for="swal-pol-file" class="btn-secondary" style="cursor: pointer; display: inline-block; padding: 10px; border: 1px dashed #ccc; width: 80%;">
                    📂 Seleccionar Archivo
                </label>
                <input type="file" id="swal-pol-file" style="display: none;" onchange="document.getElementById('file-name-display').innerText = this.files[0] ? this.files[0].name : ''">
                <div id="file-name-display" style="margin-top: 5px; font-size: 12px; color: #666;"></div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        preConfirm: () => {
            const fileInput = document.getElementById('swal-pol-file');
            const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'Sin archivo';
            return {
                name: document.getElementById('swal-pol-name').value,
                date: document.getElementById('swal-pol-date').value,
                file: fileName
            }
        }
    });

    if (formValues && formValues.name) {
        policies.push({ id: policies.length + 1, ...formValues });
        renderPolicies();
        Swal.fire({
            icon: 'success',
            title: 'Agregada',
            text: 'La política ha sido registrada exitosamente.',
            timer: 1500,
            showConfirmButton: false
        });
    }
}

window.editPolicy = async function(id) {
    const item = policies.find(p => p.id === id);
    if (!item) return;

    const { value: formValues } = await Swal.fire({
        title: 'Editar Política',
        html: `
            <input id="swal-pol-name" class="swal2-input" placeholder="Nombre de la Política" value="${item.name}">
            <input type="date" id="swal-pol-date" class="swal2-input" value="${item.date}">
            <div class="file-upload-wrapper" style="margin-top: 15px;">
                <label for="swal-pol-file" class="btn-secondary" style="cursor: pointer; display: inline-block; padding: 10px; border: 1px dashed #ccc; width: 80%;">
                    📂 Actualizar Archivo
                </label>
                <input type="file" id="swal-pol-file" style="display: none;" onchange="document.getElementById('file-name-display-edit').innerText = this.files[0] ? this.files[0].name : ''">
                <div id="file-name-display-edit" style="margin-top: 5px; font-size: 12px; color: #666;">${item.file}</div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        preConfirm: () => {
            const fileInput = document.getElementById('swal-pol-file');
            return {
                name: document.getElementById('swal-pol-name').value,
                date: document.getElementById('swal-pol-date').value,
                file: fileInput.files.length > 0 ? fileInput.files[0].name : item.file
            }
        }
    });

    if (formValues && formValues.name) {
        Object.assign(item, formValues);
        renderPolicies();
        Swal.fire('Actualizado', 'La política ha sido actualizada.', 'success');
    }
}

window.deletePolicy = function(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            policies = policies.filter(p => p.id !== id);
            renderPolicies();
            Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
        }
    });
}
