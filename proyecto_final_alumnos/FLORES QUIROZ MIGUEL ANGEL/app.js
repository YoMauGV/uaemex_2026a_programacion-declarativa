document.addEventListener("DOMContentLoaded", () => {
  cargarElementos();
});

async function cargarElementos() {
  try {
    const respuesta = await fetch("http://20.245.7.90/api.php");
    const elementos = await respuesta.json();

    const contenedor = document.getElementById("tabla-periodica");

    elementos.forEach((el) => {
      const div = document.createElement("div");

      div.className = `
                elemento-card transition-all duration-500 ease-in-out opacity-100
                border border-gray-600 rounded p-2 flex flex-col items-center justify-center 
                cursor-pointer hover:scale-110 hover:z-10 hover:shadow-lg
                text-xs sm:text-sm h-16 sm:h-20
            `;
      div.dataset.categoria = el.categoria;

      div.style.gridColumn = el.grupo;
      div.style.gridRow = el.periodo;

      if (el.numero_atomico >= 57 && el.numero_atomico <= 71) {
        div.style.gridColumn = el.numero_atomico - 54;
        div.style.gridRow = 8;
      }

      if (el.numero_atomico >= 89 && el.numero_atomico <= 103) {
        div.style.gridColumn = el.numero_atomico - 86;
        div.style.gridRow = 9;
      }

      if (el.categoria.includes("metal-alcalino"))
        div.classList.add("bg-red-900", "border-stone");
      else if (el.categoria.includes("alcalinoterreo"))
        div.classList.add("bg-indigo-900", "border-stone");
      else if (el.categoria.includes("metal-transicion"))
        div.classList.add("bg-sky-800", "border-stone");
      else if (el.categoria.includes("metal-post-transicion"))
        div.classList.add("bg-lime-600", "border-stone");
      else if (el.categoria.includes("lantanido"))
        div.classList.add("bg-teal-600", "border-stone");
      else if (el.categoria.includes("actinido"))
        div.classList.add("bg-emerald-600", "border-stone");
      else if (el.categoria.includes("metaloide"))
        div.classList.add("bg-lime-800", "border-stone");
      else if (el.categoria.includes("no-metal"))
        div.classList.add("bg-lime-800/90", "border-stone");
      else if (el.categoria.includes("halogeno"))
        div.classList.add("bg-lime-700", "border-stone");
      else if (el.categoria.includes("noble"))
        div.classList.add("bg-yellow-800/90", "border-stone");
      else if (el.categoria.includes("desconocido"))
        div.classList.add("bg-green-700", "border-stone");
      else div.classList.add("bg-gray-800");

      div.innerHTML = `
                <div class="text-[10px] text-gray-400 self-start">${el.numero_atomico}</div>
                <strong class="text-lg sm:text-xl font-bold">${el.simbolo}</strong>
                <div class="text-[9px] sm:text-[10px] truncate w-full text-center">${el.nombre}</div>
                <div class="text-[9px] text-gray-300 self-start w-full text-center">${el.peso_atomico}</div>
            `;

      div.addEventListener("click", () => mostrarDetalles(el));

      contenedor.appendChild(div);
    });
  } catch (error) {
    console.error("Error cargando los elementos:", error);
  }
}

function mostrarDetalles(elemento) {
  const existing = document.getElementById("modal-elemento");
  if (existing) existing.remove();

  const nombreCategoria = {
    "metal-alcalino": "Metal Alcalino",
    alcalinoterreo: "Metal Alcalinotérreo",
    "metal-transicion": "Metal de Transición",
    "metal-post-transicion": "Metal Post-Transición",
    lantanido: "Lantánido",
    actinido: "Actínido",
    metaloide: "Metaloide",
    "no-metal": "No Metal",
    halogeno: "Halógeno",
    "gas-noble": "Gas Noble",
    desconocido: "Propiedades Desconocidas",
  };

  const colorCategoria = {
    "metal-alcalino": "#7f1d1d",
    alcalinoterreo: "#1e1b4b",
    "metal-transicion": "#0c4a6e",
    "metal-post-transicion": "#365314",
    lantanido: "#134e4a",
    actinido: "#064e3b",
    metaloide: "#3f6212",
    "no-metal": "#3f6212",
    halogeno: "#3d6400",
    "gas-noble": "#451a03",
    desconocido: "#14532d",
  };

  const bgColor = colorCategoria[elemento.categoria] || "#1f2937";
  const categoriaNombre =
    nombreCategoria[elemento.categoria] || elemento.categoria;

  const campos = [
    { label: "Número Atómico", valor: elemento.numero_atomico },
    {
      label: "Masa Atómica",
      valor: elemento.masa_atomica ? `${elemento.masa_atomica} u` : null,
    },
    { label: "Período", valor: elemento.periodo },
    { label: "Grupo", valor: elemento.grupo },
    { label: "Categoría", valor: categoriaNombre },
    {
      label: "Configuración Electrónica",
      valor: elemento.configuracion_electronica,
    },
    { label: "Electronegatividad", valor: elemento.electronegatividad },
    {
      label: "Punto de Fusión",
      valor: elemento.punto_fusion ? `${elemento.punto_fusion} °C` : null,
    },
    {
      label: "Punto de Ebullición",
      valor: elemento.punto_ebullicion
        ? `${elemento.punto_ebullicion} °C`
        : null,
    },
    {
      label: "Densidad",
      valor: elemento.densidad ? `${elemento.densidad} g/cm³` : null,
    },
    { label: "Estado Natural", valor: elemento.estado },
    { label: "Descubierto por", valor: elemento.descubridor },
    { label: "Año de Descubrimiento", valor: elemento.año_descubrimiento },
  ].filter((c) => c.valor !== null && c.valor !== undefined && c.valor !== "");

  const filasHTML = campos
    .map(
      (c) => `
    <div class="modal-fila">
      <span class="modal-label">${c.label}</span>
      <span class="modal-valor">${c.valor}</span>
    </div>
  `,
    )
    .join("");

  const modal = document.createElement("div");
  modal.id = "modal-elemento";
  modal.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-contenedor" style="--bg-cat: ${bgColor};">
        <button class="modal-cerrar" id="modal-cerrar" aria-label="Cerrar">✕</button>
 
        <div class="modal-encabezado">
          <div class="modal-numero">${elemento.numero_atomico}</div>
          <div class="modal-simbolo">${elemento.simbolo}</div>
          <div class="modal-nombre">${elemento.nombre}</div>
          <div class="modal-categoria-badge">${categoriaNombre}</div>
        </div>
 
        <div class="modal-descripcion">
          ${elemento.descripcion || ""}
        </div>
 
        <div class="modal-grid">
          ${filasHTML}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) cerrarModal();
  });
  document
    .getElementById("modal-cerrar")
    .addEventListener("click", cerrarModal);

  document.addEventListener("keydown", escHandler);

  requestAnimationFrame(() => {
    modal.querySelector(".modal-overlay").classList.add("activo");
    modal.querySelector(".modal-contenedor").classList.add("activo");
  });
}

function cerrarModal() {
  const modal = document.getElementById("modal-elemento");
  if (!modal) return;
  const overlay = modal.querySelector(".modal-overlay");
  const contenedor = modal.querySelector(".modal-contenedor");
  overlay.classList.remove("activo");
  contenedor.classList.remove("activo");
  overlay.classList.add("saliendo");
  contenedor.classList.add("saliendo");
  setTimeout(() => modal.remove(), 300);
  document.removeEventListener("keydown", escHandler);
}

function escHandler(e) {
  if (e.key === "Escape") cerrarModal();
}

window.filtrar = function (categoriaFiltro) {
  document.querySelectorAll(".btn-filtro").forEach((btn) => {
    const esteBoton = btn.dataset.filtro === categoriaFiltro;
    btn.classList.toggle("activo", esteBoton);
    btn.classList.toggle("inactivo", categoriaFiltro !== "todos" && !esteBoton);
  });

  const tarjetas = document.querySelectorAll(".elemento-card");

  tarjetas.forEach((tarjeta) => {
    const categoriaElemento = tarjeta.dataset.categoria;

    if (categoriaFiltro === "todos" || categoriaElemento === categoriaFiltro) {
      tarjeta.classList.remove("opacity-10", "scale-90", "grayscale");
      tarjeta.classList.add("opacity-100");
    } else {
      tarjeta.classList.remove("opacity-100");
      tarjeta.classList.add("opacity-10", "scale-90", "grayscale");
    }
  });
};
