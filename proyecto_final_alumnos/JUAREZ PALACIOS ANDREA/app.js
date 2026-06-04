const API_URL =
'http://158.23.164.175/api2.php';

const tablaPrincipal =
document.getElementById(
    'tabla-principal'
);

const tablaInferior =
document.getElementById(
    'tabla-inferior'
);

let todosLosElementos = [];

function obtenerClaseCategoria(
    categoria
){

    if(!categoria){
        return 'no-metales';
    }

    const cat = categoria
    .toLowerCase()
    .normalize("NFD")
    .replace(
        /[\u0300-\u036f]/g,
        ""
    );

    if(
        cat.includes('alcalino')
        &&
        !cat.includes('terreo')
    ){
        return 'metales-alcalinos';
    }
    if(cat.includes('alcalinoterreo')){
        return 'alcalinoterreos';
    }
    if(cat.includes('transicion')){
        return 'metales-transicion';
    }
    if(cat.includes('metaloide')){
        return 'metaloides';
    }
    if(
        cat.includes('no metal')
        ||
        cat.includes('nometal')
    ){
        return 'no-metales';
    }
    if(cat.includes('halogeno')){
        return 'halogenos';
    }
    if(
        cat.includes('gas')
        ||
        cat.includes('noble')
    ){
        return 'gases-nobles';
    }
    if(cat.includes('lantanido')){
        return 'lantanidos';
    }
    if(cat.includes('actinido')){
        return 'actinidos';
    }
    return 'no-metales';
}


async function cargarElementos(){

    try{

        const response =
        await fetch(API_URL);

        todosLosElementos =
        await response.json();

        renderizarTabla(
            todosLosElementos
        );

    }catch(error){

        console.error(
            'Error API:',
            error
        );

    }

}

function renderizarTabla(
    elementos
){

    tablaPrincipal.innerHTML = '';
    tablaInferior.innerHTML = '';

    elementos.forEach(
        elemento => {

        if(!elemento.simbolo){
            return;
        }
        const card =
        document.createElement(
            'div'
        );
        const claseColor =
        obtenerClaseCategoria(
            elemento.familia ||
            elemento.categoria
        );
        card.className =
        `elemento-card ${claseColor}`;
        const numero =
        parseInt(
            elemento.numero_atomic ||
            elemento.numero_atomico
        );
        const col =
        parseInt(elemento.grupo);

        const row =
        parseInt(elemento.periodo);

        card.style.gridColumn = col;
        card.style.gridRow = row;

        card.innerHTML = `

            <div class="numero">
                ${numero}
            </div>

            <div class="simbolo">
                ${elemento.simbolo}
            </div>

            <div class="nombre">
                ${elemento.nombre || ''}
            </div>

        `;

        card.addEventListener(
            'click',
            () => abrirModalFicha(elemento)
        );

        if(
            numero >= 57 &&
            numero <= 71
        ){

            card.style.gridColumn =
            numero - 53;

            card.style.gridRow = 1;

            tablaInferior.appendChild(
                card
            );

        }
        else if(
            numero >= 89 &&
            numero <= 103
        ){

            card.style.gridColumn =
            numero - 85;

            card.style.gridRow = 2;

            tablaInferior.appendChild(
                card
            );

        }
        else{

            tablaPrincipal.appendChild(
                card
            );

        }

    });

}

function aplicarFiltros(){

    const categoriaSeleccionada =
    document.getElementById(
        'filter-categoria'
    ).value;

    const origenSeleccionado =
    document.getElementById(
        'filter-origen'
    ).value;

    const descubridorTexto =
    document.getElementById(
        'filter-descubridor'
    )
    .value
    .toLowerCase();

    const filtrados =
    todosLosElementos.filter(
        elemento => {

        const categoriaElemento =
        obtenerClaseCategoria(
            elemento.familia ||
            elemento.categoria ||
            ''
        );
        if(
            categoriaSeleccionada !==
            'todas'
            &&
            categoriaElemento !==
            categoriaSeleccionada
        ){
            return false;
        }
        const origen =
        (
            elemento.origen || ''
        )
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

        if(
            origenSeleccionado ===
            'natural'
        ){

            if(
                !origen.includes(
                    'natural'
                )
            ){
                return false;
            }
        }

        if(
            origenSeleccionado ===
            'sintetico'
        ){

            if(
                !origen.includes(
                    'sintet'
                )
                &&
                !origen.includes(
                    'artificial'
                )
            ){
                return false;
            }
        }

    
        const descubridor =
        (
            elemento.descubridor ||
            ''
        ).toLowerCase();

        if(
            descubridorTexto
            &&
            !descubridor.includes(
                descubridorTexto
            )
        ){
            return false;
        }

        return true;

    });

    renderizarTabla(
        filtrados
    );

}


function limpiarFiltros(){

    document.getElementById(
        'filter-categoria'
    ).value = 'todas';

    document.getElementById(
        'filter-origen'
    ).value = 'todos';

    document.getElementById(
        'filter-descubridor'
    ).value = '';

    renderizarTabla(
        todosLosElementos
    );

}


document
.getElementById(
    'btn-aplicar'
)
.addEventListener(
    'click',
    aplicarFiltros
);

document
.getElementById(
    'btn-limpiar'
)
.addEventListener(
    'click',
    limpiarFiltros
);


function abrirModalFicha(
    elemento
){

    document.getElementById(
        'modal-num'
    ).textContent =
    elemento.numero_atomic ||
    elemento.numero_atomico ||
    '';

    document.getElementById(
        'modal-simbolo'
    ).textContent =
    elemento.simbolo || '';

    document.getElementById(
        'modal-nombre'
    ).textContent =
    elemento.nombre || '';

    document.getElementById(
        'modal-masa'
    ).textContent =
    elemento.masa_atomica ||
    elemento.peso_atomico ||
    'N/A';

    document.getElementById(
        'modal-config'
    ).textContent =
    elemento.configuracion_electronica ||
    elemento.configuracion ||
    'N/A';

    document.getElementById(
        'modal-descubridor'
    ).textContent =
    elemento.descubridor ||
    'Desconocido';

    document.getElementById(
        'modal-origen'
    ).textContent =
    elemento.origen ||
    'Desconocido';

    document.getElementById(
        'modal-coordenadas'
    ).textContent =
    `Periodo ${elemento.periodo}
    | Grupo ${elemento.grupo}`;

    document.getElementById(
        'modal-familia-texto'
    ).textContent =
    elemento.familia ||
    elemento.categoria ||
    '';

    document.getElementById(
        'modal-elemento'
    ).classList.add(
        'active'
    );

}

document
.getElementById(
    'modal-cerrar'
)
.addEventListener(
    'click',
    () => {

        document
        .getElementById(
            'modal-elemento'
        )
        .classList.remove(
            'active'
        );

    }
);

window.addEventListener(
    'click',
    e => {

        const modal =
        document.getElementById(
            'modal-elemento'
        );

        if(e.target === modal){

            modal.classList.remove(
                'active'
            );

        }

    }
);


cargarElementos();