const API_URL = 'http://135.235.138.117/api2.php';

const ESTADO = {
    elementos: [],
    modal: { abierto: false, elemento: null },
    filtros: { catBuscada: 'todos', grupoBuscado: 'todos', textoBuscado: '' }
};


const limpiarCategoria = (catRaw) => {
    const cat = (catRaw || 'desconocido').toLowerCase().trim().replace(/\s+/g, '-');
    return cat === 'metal-del-bloque-p' ? 'metal-post-transicion' : cat;
};

const obtenerGrupoReal = (elemento, categoria) => 
    ['lantanido', 'lanthanide', 'actinido', 'actinide'].includes(categoria) 
        ? '3' 
        : String(elemento.grupo || elemento.group || 'N/A');

const calcularPosicionVisual = (elemento, categoria, indexEnGrupo) => {
    if (categoria === 'lantanido' || categoria === 'lanthanide') return { fila: 9, columna: 3 + indexEnGrupo };
    if (categoria === 'actinido' || categoria === 'actinide') return { fila: 10, columna: 3 + indexEnGrupo };
    return { fila: elemento.periodo || elemento.period, columna: elemento.grupo || elemento.group };
};

const evaluarFiltroElemento = (elemento, categoria, grupoReal, { catBuscada, grupoBuscado, textoBuscado }) => {
    const nombre = (elemento.nombre || elemento.name || '').toLowerCase();
    const simbolo = (elemento.simbolo || elemento.symbol || '').toLowerCase();

    const coincideCat = catBuscada === 'todos' || categoria === catBuscada ||
                        (catBuscada === 'no-metal' && categoria === 'reactive-nonmetal') ||
                        (catBuscada === 'lantanido' && categoria === 'lanthanide') ||
                        (catBuscada === 'actinido' && categoria === 'actinide');

    const coincideGrupo = grupoBuscado === 'todos' || grupoReal === grupoBuscado;
    const coincideTexto = textoBuscado === '' || nombre.includes(textoBuscado) || simbolo.includes(textoBuscado);

    return coincideCat && coincideGrupo && coincideTexto;
};


const ComponenteElemento = ({ elemento, categoria, fila, columna, grupoReal, pasaFiltro }) => {
    const numAtomico = elemento.numero_atomico || elemento.atomicNumber;
    const simbolo = elemento.simbolo || elemento.symbol;
    const nombre = elemento.nombre || elemento.name;

    return !(columna && fila) ? '' : `
        <div class="elemento-quimico ${pasaFiltro ? '' : 'elemento-opacado'}" 
             style="--col: ${columna}; --row: ${fila};"
             data-categoria="${categoria}"
             data-grupo="${grupoReal}"
             data-numero="${numAtomico}">
            <span class="numero-atomico">${numAtomico}</span>
            <strong class="simbolo">${simbolo}</strong>
            <span class="nombre">${nombre}</span>
        </div>
    `;
};

const ComponenteModal = (elemento, categoria, grupoReal) => `
    <div class="modal-contenido" id="modal-cuerpo" data-categoria="${categoria}">
        <span id="boton-cerrar">&times;</span>
        <div id="modal-informacion">
            <h2 style="text-align: center;">${elemento.nombre || elemento.name} (${elemento.simbolo || elemento.symbol})</h2>
            <hr>
            <p><strong>Número Atómico:</strong> ${elemento.numero_atomico || elemento.atomicNumber}</p>
            <p><strong>Familia / Categoría:</strong> ${elemento.categoria || elemento.groupBlock || 'General'}</p>
            <p><strong>Grupo:</strong> ${grupoReal}</p>
            <p><strong>Descubridor:</strong> ${elemento.descubridor || 'N/A'}</p>
            <p><strong>Año de descubrimiento:</strong> ${elemento.anio_descubrimiento || 'Desconocido'}</p>
            <p><strong>Configuración Electrónica:</strong></p>
            <code style="display:block; background:rgba(0, 0, 0, 0.25); padding:8px; border-radius:4px; word-break:break-all; font-family:monospace; color:#ffffff;">${elemento.configuracion_electronica || elemento.electronicConfiguration || 'N/A'}</code>
        </div>
    </div>
`;


const render = () => {
    const { elementos, filtros, modal } = ESTADO;

    const lantanidos = elementos.filter(el => ['lantanido', 'lanthanide'].includes(limpiarCategoria(el.categoria || el.groupBlock)));
    const actinidos = elementos.filter(el => ['actinido', 'actinide'].includes(limpiarCategoria(el.categoria || el.groupBlock)));

    document.getElementById('tabla-contenedor').innerHTML = elementos.map(elemento => {
        const categoria = limpiarCategoria(elemento.categoria || elemento.groupBlock);
        const indexEnGrupo = lantanidos.includes(elemento) ? lantanidos.indexOf(elemento) 
                           : actinidos.includes(elemento) ? actinidos.indexOf(elemento) : 0;

        const { fila, columna } = calcularPosicionVisual(elemento, categoria, indexEnGrupo);
        const grupoReal = obtenerGrupoReal(elemento, categoria);
        const pasaFiltro = evaluarFiltroElemento(elemento, categoria, grupoReal, filtros);

        return ComponenteElemento({ elemento, categoria, fila, columna, grupoReal, pasaFiltro });
    }).join('');

    const modalContenedor = document.getElementById('mi-modal');
    modalContenedor.className = modal.abierto ? 'modal-visible' : 'modal-oculto';
    modalContenedor.innerHTML = modal.abierto 
        ? ComponenteModal(modal.elemento, limpiarCategoria(modal.elemento.categoria || modal.elemento.groupBlock), obtenerGrupoReal(modal.elemento, limpiarCategoria(modal.elemento.categoria || modal.elemento.groupBlock))) 
        : '';
};

const actualizarFiltros = (nuevosCriterios) => {
    Object.assign(ESTADO.filtros, nuevosCriterios);
    render();
};

const abrirDetalleElemento = (numeroAtomico) => {
    const encontrado = ESTADO.elementos.find(el => (el.numero_atomico === numeroAtomico || el.atomicNumber === numeroAtomico));
    Object.assign(ESTADO.modal, { abierto: !!encontrado, elemento: encontrado || null });
    render();
};

const cerrarDetalleElemento = () => {
    Object.assign(ESTADO.modal, { abierto: false, elemento: null });
    render();
};


const inicializarEventos = () => {
    document.body.addEventListener('click', (evento) => {
        const tarjeta = evento.target.closest('.elemento-quimico');
        const esBotonCerrar = evento.target.id === 'boton-cerrar';
        const esFondoModal = evento.target.id === 'mi-modal';

        if (tarjeta) abrirDetalleElemento(parseInt(tarjeta.dataset.numero));
        if (esBotonCerrar || esFondoModal) cerrarDetalleElemento();
    });

    document.getElementById('filtro-categoria').onchange = (e) => actualizarFiltros({ catBuscada: e.target.value });
    document.getElementById('filtro-grupo').onchange = (e) => actualizarFiltros({ grupoBuscado: e.target.value });
    document.getElementById('buscar-nombre').oninput = (e) => actualizarFiltros({ textoBuscado: e.target.value.toLowerCase().trim() });
};


fetch(API_URL)
    .then(res => res.json())
    .then(elementos => {
        ESTADO.elementos = elementos;
        inicializarEventos();
        render();
    })
    .catch(error => console.error('Error al poblar la tabla periódica:', error));