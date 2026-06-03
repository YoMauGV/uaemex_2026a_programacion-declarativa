const API_URL = 'http://20.63.91.201/api2.php'; 

// Respaldo del bloque inferior por si la API no cuenta con ellos
const respaldoFaltantes = [
    { numero_atomico: 58, simbolo: "Ce", nombre: "Cerio", peso_atomico: "140.12", categoria: "lantanido" },
    { numero_atomico: 59, simbolo: "Pr", nombre: "Praseodimio", peso_atomico: "140.91", categoria: "lantanido" },
    { numero_atomico: 60, simbolo: "Nd", nombre: "Neodimio", peso_atomico: "144.24", categoria: "lantanido" },
    { numero_atomico: 61, simbolo: "Pm", nombre: "Prometio", peso_atomico: "145", categoria: "lantanido" },
    { numero_atomico: 62, simbolo: "Sm", nombre: "Samario", peso_atomico: "150.36", categoria: "lantanido" },
    { numero_atomico: 63, simbolo: "Eu", nombre: "Europio", peso_atomico: "151.96", categoria: "lantanido" },
    { numero_atomico: 64, simbolo: "Gd", nombre: "Gadolinio", peso_atomico: "157.25", categoria: "lantanido" },
    { numero_atomico: 65, simbolo: "Tb", nombre: "Terbio", peso_atomico: "158.93", categoria: "lantanido" },
    { numero_atomico: 66, simbolo: "Dy", nombre: "Disprosio", peso_atomico: "162.50", categoria: "lantanido" },
    { numero_atomico: 67, simbolo: "Ho", nombre: "Holmio", peso_atomico: "164.93", categoria: "lantanido" },
    { numero_atomico: 68, simbolo: "Er", nombre: "Erbio", peso_atomico: "167.26", categoria: "lantanido" },
    { numero_atomico: 69, simbolo: "Tm", nombre: "Tulio", peso_atomico: "168.93", categoria: "lantanido" },
    { numero_atomico: 70, simbolo: "Yb", nombre: "Iterbio", peso_atomico: "173.05", categoria: "lantanido" },
    { numero_atomico: 71, simbolo: "Lu", nombre: "Lutecio", peso_atomico: "174.97", categoria: "lantanido" },
    { numero_atomico: 90, simbolo: "Th", nombre: "Torio", peso_atomico: "232.04", categoria: "actinido" },
    { numero_atomico: 91, simbolo: "Pa", nombre: "Protactinio", peso_atomico: "231.04", categoria: "actinido" },
    { numero_atomico: 92, simbolo: "U", nombre: "Uranio", peso_atomico: "238.03", categoria: "actinido" },
    { numero_atomico: 93, simbolo: "Np", nombre: "Neptunio", peso_atomico: "237", categoria: "actinido" },
    { numero_atomico: 94, simbolo: "Pu", nombre: "Plutonio", peso_atomico: "244", categoria: "actinido" },
    { numero_atomico: 95, simbolo: "Am", nombre: "Americio", peso_atomico: "243", categoria: "actinido" },
    { numero_atomico: 96, simbolo: "Cm", nombre: "Curio", peso_atomico: "247", categoria: "actinido" },
    { numero_atomico: 97, simbolo: "Bk", nombre: "Berkelio", peso_atomico: "247", categoria: "actinido" },
    { numero_atomico: 98, simbolo: "Cf", nombre: "Californio", peso_atomico: "251", categoria: "actinido" },
    { numero_atomico: 99, simbolo: "Es", nombre: "Einstenio", peso_atomico: "252", categoria: "actinido" },
    { numero_atomico: 100, simbolo: "Fm", nombre: "Fermio", peso_atomico: "257", categoria: "actinido" },
    { numero_atomico: 101, simbolo: "Md", nombre: "Mendelevio", peso_atomico: "258", categoria: "actinido" },
    { numero_atomico: 102, simbolo: "No", nombre: "Nobelio", peso_atomico: "259", categoria: "actinido" },
    { numero_atomico: 103, simbolo: "Lr", nombre: "Laurencio", peso_atomico: "262", categoria: "actinido" }
];

document.addEventListener('DOMContentLoaded', () => {
    fetchElementos();
    setupBotones();
});

// Cambiar de vistas
function setupBotones() {
    const mainView = document.getElementById('main-view');
    const bloquefView = document.getElementById('bloquef-view');
    
    document.getElementById('go-to-bloquef').addEventListener('click', () => {
        mainView.classList.add('hidden');
        bloquefView.classList.remove('hidden');
    });

    document.getElementById('back-to-main').addEventListener('click', () => {
        bloquefView.classList.add('hidden');
        mainView.classList.remove('hidden');
    });
}

async function fetchElementos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        let elementos = await response.json();
        
        // Si falta el Cerio (58) en tu base de datos, inyectamos el respaldo
        const tieneBloqueInferior = elementos.some(e => parseInt(e.numero_atomico) === 58);
        if (!tieneBloqueInferior) {
            elementos = [...elementos, ...respaldoFaltantes];
        }
        
        renderTabla(elementos);
    } catch (error) {
        console.error('Error al jalar la API:', error);
    }
}

function renderTabla(elementos) {
    const mainTable = document.getElementById('periodic-table');
    const bloquefTable = document.getElementById('bloquef-table');
    
    mainTable.innerHTML = '';
    bloquefTable.innerHTML = '';

    elementos.forEach(elem => {
        const elementDiv = document.createElement('div');
        elementDiv.classList.add('element');
        
        // Estilo por categoría
        if (elem.categoria) {
            const claseCategoria = elem.categoria.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
            elementDiv.classList.add(claseCategoria);
        } else {
            elementDiv.classList.add('desconocido');
        }

        elementDiv.innerHTML = `
            <span class="num">${elem.numero_atomico}</span>
            <span class="sym">${elem.simbolo}</span>
            <span class="name">${elem.nombre}</span>
        `;
        elementDiv.addEventListener('click', () => mostrarDetalle(elem));

        const numAtomico = parseInt(elem.numero_atomico);

        // SEPARACIÓN DE TABLAS POR BOTÓN (¡Se queda exactamente igual para no mover tu diseño!)
        if (numAtomico >= 58 && numAtomico <= 71) {
            elementDiv.style.gridRow = 1;
            elementDiv.style.gridColumn = (numAtomico - 58) + 1;
            bloquefTable.appendChild(elementDiv);
        } else if (numAtomico >= 90 && numAtomico <= 103) {
            elementDiv.style.gridRow = 2;
            elementDiv.style.gridColumn = (numAtomico - 90) + 1;
            bloquefTable.appendChild(elementDiv);
        } else {
            let gridColumn = parseInt(elem.grupo);
            let gridRow = parseInt(elem.periodo);
            
            // Forzar Lantano (57) y Actinio (89) en su lugar del cuerpo principal
            if (numAtomico === 57) { gridRow = 6; gridColumn = 3; }
            if (numAtomico === 89) { gridRow = 7; gridColumn = 3; }

            if (isNaN(gridColumn) || isNaN(gridRow)) return;

            elementDiv.style.gridColumn = gridColumn;
            elementDiv.style.gridRow = gridRow;
            mainTable.appendChild(elementDiv);
        }

        // GUARDAMOS LOS DATOS EN LA PROPIA CELDA PARA EL BUSCADOR (Evita que se cruce el orden)
        elementDiv.dataset.nombre = (elem.nombre || '').toLowerCase();
        elementDiv.dataset.simbolo = (elem.simbolo || '').toLowerCase();
        elementDiv.dataset.numero = (elem.numero_atomico || '').toString();
    });

    // === LÓGICA DEL BUSCADOR CORREGIDA (Busca en ambas tablas de forma independiente) ===
    const searchInput = document.getElementById('element-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            // Obtenemos absolutamente todas las celdas creadas sin importar en qué tabla estén
            const allCards = document.querySelectorAll('.element');

            allCards.forEach(card => {
                const nombre = card.dataset.nombre;
                const simbolo = card.dataset.simbolo;
                const numero = card.dataset.numero;

                if (nombre.includes(query) || simbolo.includes(query) || numero.includes(query)) {
                    card.classList.remove('search-hidden');
                } else {
                    card.classList.add('search-hidden');
                }
            });
        });
    }
}

function mostrarDetalle(elem) {
    const coloresCategoria = {
        'no-metal': '#22c55e', 'gas-noble': '#3b82f6', 'metal-alcalino': '#ef4444',
        'alcalinoterreo': '#f97316', 'metaloide': '#eab308', 'halogeno': '#06b6d4',
        'metal-post-transicion': '#0f5c42', 'metal-transicion': '#1e3a8a',
        'lantanido': '#a855f7', 'actinido': '#ec4899', 'desconocido': '#475569'
    };

    let catFormateada = 'desconocido';
    if (elem.categoria) {
        catFormateada = elem.categoria.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
    }

    const colorHex = coloresCategoria[catFormateada] || coloresCategoria['desconocido'];
    document.getElementById('element-detail').style.setProperty('--current-color', colorHex);

    document.getElementById('detail-number').textContent = `Número Atómico: ${elem.numero_atomico}`;
    document.getElementById('detail-symbol').textContent = elem.simbolo;
    document.getElementById('detail-name').textContent = elem.nombre;
    document.getElementById('detail-mass').textContent = elem.peso_atomico || '-';
    document.getElementById('detail-config').textContent = elem.configuracion_electronica || '-';
    document.getElementById('detail-category').textContent = elem.categoria ? elem.categoria.replace(/-/g, ' ') : '-';
}