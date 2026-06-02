const tabla = document.getElementById("tabla");

const modal = document.getElementById("modal");

const cerrar = document.getElementById("cerrar");

const modalContenido = document.getElementById("modal-contenido");

fetch("http://52.159.250.150/api2.php")

.then(response => response.json())

.then(data => {

    data.forEach(elemento => {

        let columna = elemento.grupo;

        let fila = elemento.periodo;

        if(elemento.numero_atomico >= 57 && elemento.numero_atomico <= 71){

            fila = 8;

            columna = elemento.numero_atomico - 54;
        }

        if(elemento.numero_atomico >= 89 && elemento.numero_atomico <= 103){

            fila = 9;

            columna = elemento.numero_atomico - 86;
        }

        const div = document.createElement("div");

        div.classList.add("elemento");

        div.classList.add(elemento.categoria);

        div.style.gridColumn = columna;

        div.style.gridRow = fila;

        div.innerHTML = `

            <div class="numero">
                ${elemento.numero_atomico}
            </div>

            <div class="simbolo">
                ${elemento.simbolo}
            </div>

            <div class="nombre">
                ${elemento.nombre}
            </div>

        `;

        div.addEventListener("click", () => {

            modal.style.display = "flex";

            modalContenido.style.background =
            window.getComputedStyle(div).backgroundColor;

            modalContenido.style.color = "white";

            document.getElementById("titulo").innerText =
            elemento.simbolo;

            document.getElementById("nombre").innerText =
            "Nombre: " + elemento.nombre;

            document.getElementById("categoria").innerText =
            "Categoría: " + elemento.categoria;

            document.getElementById("descubridor").innerText =
            "Descubridor: " + elemento.descubridor;

            document.getElementById("anio").innerText =
            "Año: " + elemento.anio_descubrimiento;

            document.getElementById("familia").innerText =
            "Familia: " + elemento.familia;

        });
        tabla.appendChild(div);

    });

})

.catch(error => {

    console.log(error);

});

cerrar.addEventListener("click", () => {

    modal.style.display = "none";

});

function filtrar(categoria){

    const elementos =
    document.querySelectorAll(".elemento");

    elementos.forEach(elemento => {

        if(categoria == "todos"){

            elemento.style.display = "block";
        }

        else if(elemento.classList.contains(categoria)){

            elemento.style.display = "block";
        }

        else{

            elemento.style.display = "none";
        }

    });

}

function buscarElemento(){

    const texto =
    document.getElementById("buscador")
    .value
    .toLowerCase();

    const elementos =
    document.querySelectorAll(".elemento");

    elementos.forEach(elemento => {

        const contenido =
        elemento.innerText.toLowerCase();

        if(contenido.includes(texto)){

            elemento.style.display = "block";
        }

        else{

            elemento.style.display = "none";
        }

    });

}