/* estado global */
let elementos = [];
let base = [];

/* referencias DOM */
const tabla = document.getElementById("tabla");
const buscar = document.getElementById("buscar");
const filtroTipo = document.getElementById("filtroTipo");
const filtroPeriodo = document.getElementById("filtroPeriodo");
const modal = document.getElementById("modal");
const detalle = document.getElementById("detalle");
const cerrar = document.getElementById("cerrar");

/* posiciones en grid */
const posiciones = {
  1: [1, 1],
  2: [1, 18],
  3: [2, 1],
  4: [2, 2],
  5: [2, 13],
  6: [2, 14],
  7: [2, 15],
  8: [2, 16],
  9: [2, 17],
  10: [2, 18],
  11: [3, 1],
  12: [3, 2],
  13: [3, 13],
  14: [3, 14],
  15: [3, 15],
  16: [3, 16],
  17: [3, 17],
  18: [3, 18],
  19: [4, 1],
  20: [4, 2],
  21: [4, 3],
  22: [4, 4],
  23: [4, 5],
  24: [4, 6],
  25: [4, 7],
  26: [4, 8],
  27: [4, 9],
  28: [4, 10],
  29: [4, 11],
  30: [4, 12],
  31: [4, 13],
  32: [4, 14],
  33: [4, 15],
  34: [4, 16],
  35: [4, 17],
  36: [4, 18],
  37: [5, 1],
  38: [5, 2],
  39: [5, 3],
  40: [5, 4],
  41: [5, 5],
  42: [5, 6],
  43: [5, 7],
  44: [5, 8],
  45: [5, 9],
  46: [5, 10],
  47: [5, 11],
  48: [5, 12],
  49: [5, 13],
  50: [5, 14],
  51: [5, 15],
  52: [5, 16],
  53: [5, 17],
  54: [5, 18],
  55: [6, 1],
  56: [6, 2],
  57: [8, 3],
  58: [8, 4],
  59: [8, 5],
  60: [8, 6],
  61: [8, 7],
  62: [8, 8],
  63: [8, 9],
  64: [8, 10],
  65: [8, 11],
  66: [8, 12],
  67: [8, 13],
  68: [8, 14],
  69: [8, 15],
  70: [8, 16],
  71: [8, 17],
  72: [6, 4],
  73: [6, 5],
  74: [6, 6],
  75: [6, 7],
  76: [6, 8],
  77: [6, 9],
  78: [6, 10],
  79: [6, 11],
  80: [6, 12],
  81: [6, 13],
  82: [6, 14],
  83: [6, 15],
  84: [6, 16],
  85: [6, 17],
  86: [6, 18],
  87: [7, 1],
  88: [7, 2],
  89: [9, 3],
  90: [9, 4],
  91: [9, 5],
  92: [9, 6],
  93: [9, 7],
  94: [9, 8],
  95: [9, 9],
  96: [9, 10],
  97: [9, 11],
  98: [9, 12],
  99: [9, 13],
  100: [9, 14],
  101: [9, 15],
  102: [9, 16],
  103: [9, 17],
  104: [7, 4],
  105: [7, 5],
  106: [7, 6],
  107: [7, 7],
  108: [7, 8],
  109: [7, 9],
  110: [7, 10],
  111: [7, 11],
  112: [7, 12],
  113: [7, 13],
  114: [7, 14],
  115: [7, 15],
  116: [7, 16],
  117: [7, 17],
  118: [7, 18],
};

/* clase por tipo */
function tipo(t) {
  const m = {
    "No metal": "no-metal",
    Metal: "metal",
    Metaloide: "metaloide",
    Halógeno: "halogeno",
    "Gas noble": "gas-noble",
    "Metal de transición": "metal-transicion",
  };
  return m[t] || "metaloide";
}

/* carga API */
async function cargar() {
  const r = await fetch("api.php");
  base = await r.json();
  elementos = base;

  llenar();
  render(elementos);
}

/* carga filtros */
function llenar() {
  const tipos = [...new Set(base.map((e) => e.TIPO))];

  tipos.forEach((t) => {
    const o = document.createElement("option");
    o.value = t;
    o.textContent = t;
    filtroTipo.appendChild(o);
  });
}

/* render grid */
function render(list) {
  tabla.innerHTML = "";

  list.forEach((e) => {
    const p = posiciones[e.NUMERO_ATOMICO];
    if (!p) return;

    const d = document.createElement("div");
    d.className = "elemento " + tipo(e.TIPO);
    d.style.gridRow = p[0];
    d.style.gridColumn = p[1];

    /* celda mínima */
    d.innerHTML = `
${e.NUMERO_ATOMICO}<br>
<b>${e.SIMBOLO}</b><br>
${e.NOMBRE}
`;

    /* evento click */
    d.onclick = () => ver(e);

    tabla.appendChild(d);
  });
}

/* modal detalle */
function ver(e) {
  detalle.innerHTML = `
<h2>${e.NOMBRE}</h2>

<p><b>Símbolo:</b> ${e.SIMBOLO}</p>
<p><b>Número:</b> ${e.NUMERO_ATOMICO}</p>
<p><b>Masa:</b> ${e.MASA_ATOMICA}</p>
<p><b>Tipo:</b> ${e.TIPO}</p>

<p><b>Familia:</b> ${e.FAMILIA || "N/A"}</p>
<p><b>Período:</b> ${e.PERIODO}</p>
<p><b>Grupo:</b> ${e.GRUPO || "N/A"}</p>

<p><b>Configuración:</b> ${e.CONFIGURACION_ELECTRONICA || "N/A"}</p>
<p><b>Oxidación:</b> ${e.ESTADO_OXIDACION || "N/A"}</p>

<p><b>Electronegatividad:</b> ${e.ELECTRONEGATIVIDAD || "N/A"}</p>
<p><b>Origen:</b> ${e.ORIGEN || "N/A"}</p>

<p><b>Descubridor:</b> ${e.DESCUBRIDOR || "N/A"}</p>
<p><b>Año:</b> ${e.ANIO_DESCUBRIMIENTO || "N/A"}</p>
`;

  /* abrir modal */
  modal.style.display = "block";
}

/* filtro global */
function filtrar() {
  const t = buscar.value.toLowerCase();
  const tp = filtroTipo.value;
  const p = filtroPeriodo.value;

  elementos = base.filter(
    (e) =>
      (!t ||
        e.NOMBRE.toLowerCase().includes(t) ||
        e.SIMBOLO.toLowerCase().includes(t) ||
        String(e.NUMERO_ATOMICO).includes(t)) &&
      (!tp || e.TIPO == tp) &&
      (!p || e.PERIODO == p),
  );

  render(elementos);
}

/* eventos UI */
buscar.oninput = filtrar;
filtroTipo.onchange = filtrar;
filtroPeriodo.onchange = filtrar;

/* reset filtros */
document.getElementById("limpiar").onclick = () => {
  buscar.value = "";
  filtroTipo.value = "";
  filtroPeriodo.value = "";
  elementos = base;
  render(base);
};

/* cerrar modal */
cerrar.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target == modal) modal.style.display = "none";
};

/* init */
cargar();