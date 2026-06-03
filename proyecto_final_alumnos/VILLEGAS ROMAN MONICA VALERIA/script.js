const API_URL = 'http://20.151.88.175/api2.php';
 
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('table-container');
    const modalInstance = new bootstrap.Modal(document.getElementById('elementModal'));
 
    // Petición al servidor
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Error en la respuesta del servidor");
            return response.json();
        })
        .then(elements => {
            container.innerHTML = ''; // Limpiamos el contenedor por si había un spinner
            elements.forEach(elem => {
                const div = document.createElement('div');
                div.className = `element ${elem.type}`;
                div.style.gridColumn = elem.col;
                div.style.gridRow = elem.row;
               
                // Marcador visual para la serie de lantánidos
                if (elem.row == 9 && elem.col == 3) div.classList.add('lanthanide-series-start');
 
                div.innerHTML = `
                    <div class="num">${elem.num}</div>
                    <div class="sym">${elem.sym}</div>
                    <div class="name">${elem.name}</div>
                `;
 
                // Añadimos evento click solo si tiene información real
                if (elem.sym !== "La-Lu" && elem.sym !== "Ac-Lr") {
                    div.addEventListener('click', () => showDetails(elem, modalInstance));
                }
               
                container.appendChild(div);
            });
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = `<p class="text-danger p-3">Error al conectar con la base de datos.</p>`;
        });
});
 
function showDetails(elementData, modalInstance) {
    document.getElementById('elementModalLabel').innerText = `Elemento: ${elementData.sym}`;
    const modalContent = document.getElementById('modal-content-card');
    modalContent.className = `modal-content ${elementData.type}`;
   
    // Mapeo seguro: usamos elementData tal cual viene de la API
    document.getElementById('elementModalBody').innerHTML = `
        <div class="p-2">
            <h3><strong>${elementData.nombre}</strong> (${elementData.simbolo})</h3>
            <p class="text-muted small" style="text-transform: uppercase;">Categoría: ${elementData.categoria}</p>
            <hr>
            <p><strong>Número Atómico:</strong> ${elementData.numero_atomico}</p>
            <p><strong>Peso Atómico:</strong> ${elementData.peso_atomico || 'N/A'}</p>
            <p><strong>Configuración:</strong> <code>${elementData.configuracion_electronica || 'N/A'}</code></p>
            <p><strong>Electronegatividad:</strong> ${elementData.electronegatividad || 'N/A'}</p>
            <p><strong>Estado de Oxidación:</strong> ${elementData.estado_oxidacion || 'N/A'}</p>
            <p><strong>Familia:</strong> ${elementData.familia || 'N/A'}</p>
            <p><strong>Descubridor:</strong> ${elementData.descubridor || 'N/A'} (${elementData.anio_descubrimiento || 'N/A'})</p>
        </div>
    `;
    modalInstance.show();
}
 
function filterElements(category) {
    document.querySelectorAll('.element').forEach(elem => {
        if (category === 'all') {
            elem.classList.remove('dimmed');
        } else {
            elem.classList.toggle('dimmed', !elem.classList.contains(category));
        }
    });
}