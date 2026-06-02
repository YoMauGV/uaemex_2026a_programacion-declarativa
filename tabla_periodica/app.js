// 1. Constantes y Variables de Estado Inmutables
const API_URL = 'http://158.23.163.86/api2.php'; // ¡Pida a los alumnos cambiar esto!
const contenedorTabla = document.getElementById('contenedor-tabla');
const contenedorLeyenda = document.getElementById('contenedor-leyenda');
const contenedorLeyendaEstados = document.getElementById('contenedor-leyenda-estados');
const modal = document.getElementById('modal-elemento');
const contenedorDetalle = document.getElementById('datos-elemento');
const btnCerrar = document.getElementById('btn-cerrar');

let elementosGlobales = [];

// 1. Catálogos Inmutables para las Leyendas Automáticas
const CATEGORIAS = [
    { id: 'metal-alcalino', nombre: 'M. Alcalinos' },
    { id: 'alcalinoterreo', nombre: 'Alcalinotérreos' },
    { id: 'metal-transicion', nombre: 'M. Transición' },
    { id: 'metal-post-transicion', nombre: 'Otros Metales' },
    { id: 'metaloide', nombre: 'Metaloides' },
    { id: 'no-metal', nombre: 'No Metales' },
    { id: 'halogeno', nombre: 'Halógenos' },
    { id: 'gas-noble', nombre: 'Gases Nobles' },
    { id: 'lantanido', nombre: 'Lantánidos' },
    { id: 'actinido', nombre: 'Actínidos' }
];

const ESTADOS = [
    { clase: 'texto-solido', letra: 'A', nombre: 'Sólido' },
    { clase: 'texto-liquido', letra: 'A', nombre: 'Líquido' },
    { clase: 'texto-gas', letra: 'A', nombre: 'Gas' },
    { clase: 'texto-sintetico', letra: 'A', nombre: 'Sintético' }
];

// Inyección funcional de Leyenda de Categorías
contenedorLeyenda.innerHTML = CATEGORIAS.map(cat => `
    <div class="leyenda-item">
        <span class="leyenda-color ${cat.id}"></span>
        <span>${cat.nombre}</span>
    </div>
`).join('');

// Inyección funcional de Leyenda de Estados de la Materia
contenedorLeyendaEstados.innerHTML = ESTADOS.map(est => `
    <div class="leyenda-item">
        <span class="${est.clase}" style="font-size: 1.2rem; font-weight: 900; padding: 0 4px;">${est.letra}</span>
        <span>${est.nombre}</span>
    </div>
`).join('');

// 2. Control de Estados Química Frontend (Inferencia de datos)
const obtenerClaseTexto = (simbolo, origen) => {
    if (origen === 'Sintético') return 'texto-sintetico';
    
    const gases = ['H', 'N', 'O', 'F', 'Cl', 'He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'];
    const liquidos = ['Hg', 'Br'];
    
    if (gases.includes(simbolo)) return 'texto-gas';
    if (liquidos.includes(simbolo)) return 'texto-liquido';
    
    return 'texto-solido';
};

// Mapeo espacial en CSS Grid
const obtenerEstiloGrid = (el) => {
    if (el.categoria === 'lantanido') return `grid-column: ${el.numero_atomico - 57 + 4}; grid-row: 9;`;
    if (el.categoria === 'actinido') return `grid-column: ${el.numero_atomico - 89 + 4}; grid-row: 10;`;
    return `grid-column: ${el.grupo}; grid-row: ${el.periodo};`;
};

// 3. Renderizadores de Componentes
const generarTarjetaHTML = (el) => {
    const claseTexto = obtenerClaseTexto(el.simbolo, el.origen);
    return `
        <div class="elemento ${el.categoria}" style="${obtenerEstiloGrid(el)}" data-id="${el.numero_atomico}">
            <span class="numero">${el.numero_atomico}</span>
            <span class="simbolo ${claseTexto}">${el.simbolo}</span>
            <span class="nombre">${el.nombre}</span>
        </div>
    `;
};

// Renderizador del Modal (Diseño simétrico de laboratorio)
const generarDetalleHTML = (el) => {
    const claseTexto = obtenerClaseTexto(el.simbolo, el.origen);
    return `
        <div class="ficha-detallada ${el.categoria}">
            <div class="seccion-borde-superior">
                <div class="dato-bloque">
                    <span class="primario">${el.numero_atomico}</span>
                    <span class="secundario">Electroneg.: ${el.electronegatividad || 'N/A'}</span>
                </div>
                <div class="dato-bloque derecha">
                    <span class="primario">${parseFloat(el.peso_atomico).toFixed(4)}</span>
                    <span class="secundario">Oxidación: ${el.estado_oxidacion || '0'}</span>
                </div>
            </div>
            
            <div class="nucleo-quimico">
                <h1 class="simbolo-gigante ${claseTexto}">${el.simbolo}</h1>
                <h2 class="nombre-gigante">${el.nombre}</h2>
            </div>
            
            <div class="seccion-borde-inferior">
                <div class="dato-bloque">
                    <span class="secundario">Configuración Electrónica:</span>
                    <strong><code>${el.configuracion_electronica || 'Desconocida'}</code></strong>
                </div>
                <div class="dato-bloque derecha">
                    <span class="secundario">Periodo: ${el.periodo} | Grupo: ${el.grupo || 'Lant/Act'}</span>
                    <span class="secundario" style="text-transform: capitalize;">${el.categoria.replace('-', ' ')}</span>
                </div>
            </div>
        </div>
        
        <div class="info-historica">
            <strong>Descubrimiento:</strong> ${el.descubridor} (${el.anio_descubrimiento}) | <strong>Origen:</strong> ${el.origen}
        </div>
    `;
};

// 4. Consumo Asíncrono Reutilizable (Nuestra Tubería de Datos)
const cargarDatos = (urlConsulta) => {
    // Mostramos estado de carga
    contenedorTabla.innerHTML = '<p class="mensaje-error" style="color: #a5d6a7;">Cargando datos...</p>';

    fetch(urlConsulta)
        .then(res => {
            // Si la API devuelve error 404 (no hay resultados)
            if (!res.ok) throw new Error("No se encontraron elementos con esos filtros.");
            return res.json();
        })
        .then(datos => {
            elementosGlobales = datos; // Guardamos en caché para el modal
            // ¡Magia declarativa! Mapeamos la nueva lista filtrada
            contenedorTabla.innerHTML = datos.map(generarTarjetaHTML).join('');
        })
        .catch(err => {
            // Si no hay resultados, mostramos un mensaje limpio que ocupe todo el Grid
            contenedorTabla.innerHTML = `<div class="mensaje-error">${err.message}</div>`;
            elementosGlobales = [];
        });
};

// 5. Lógica de los Filtros (Eventos del Formulario)
const formFiltros = document.getElementById('formulario-filtros');
const btnLimpiar = document.getElementById('btn-limpiar');

formFiltros.addEventListener('submit', (evento) => {
    evento.preventDefault(); // Evita que la página se recargue
    
    // Objeto URL inteligente para construir los query parameters (?key=value)
    const url = new URL(API_URL);

    // Leer valores del DOM
    const categoria = document.getElementById('filtro-categoria').value;
    const origen = document.getElementById('filtro-origen').value;
    const descubridor = document.getElementById('filtro-descubridor').value;

    // Solo agregamos el parámetro si el alumno seleccionó o escribió algo
    if (categoria) url.searchParams.append('categoria', categoria);
    if (origen) url.searchParams.append('origen', origen);
    if (descubridor) url.searchParams.append('descubridor', descubridor);

    // Ejecutamos la tubería con la nueva URL dinámica
    cargarDatos(url.toString());
});

// Limpiar filtros y traer toda la tabla nuevamente
btnLimpiar.addEventListener('click', () => {
    formFiltros.reset(); // Limpia los inputs visualmente
    cargarDatos(API_URL); // Vuelve a pedir la tabla completa
});

// 6. Gestión del Árbol de Eventos para el Modal
contenedorTabla.addEventListener('click', (evento) => {
    const tarjeta = evento.target.closest('.elemento');
    if (tarjeta) {
        const idAtomico = parseInt(tarjeta.getAttribute('data-id'));
        const elementoSeleccionado = elementosGlobales.find(el => el.numero_atomico === idAtomico);
        
        if (elementoSeleccionado) {
            contenedorDetalle.innerHTML = generarDetalleHTML(elementoSeleccionado);
            modal.showModal();
        }
    }
});

btnCerrar.addEventListener('click', () => modal.close());

// 7. Encendido de la aplicación (Carga inicial)
cargarDatos(API_URL);