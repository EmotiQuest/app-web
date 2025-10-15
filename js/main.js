
// ========================= VARIABLES GLOBALES =========================
const screens = {
  login: document.getElementById("login-screen"),
  quiz: document.getElementById("quiz-screen"),
  result: document.getElementById("result-screen"),
  report: document.getElementById("report-screen")
};

const formLogin = document.getElementById("login-form");
const preguntaContainer = document.getElementById("pregunta-container");
const opcionesContainer = document.getElementById("opciones-container");
const progressFill = document.getElementById("progress-fill");

const siguienteBtn = document.getElementById("siguiente-btn");
const terminarBtn = document.getElementById("terminar-btn");
const volverBtn = document.getElementById("volver-btn");
const verReporteBtn = document.getElementById("ver-reporte-btn");
const volverInicioReporte = document.getElementById("volver-inicio-reporte");
const exportarBtn = document.getElementById("exportar-btn");

let usuario = {};
let preguntas = [];
let indiceActual = 0;
let respuestas = [];


// ========================= NAVEGACIÓN ENTRE PANTALLAS =========================
function mostrarPantalla(pantalla) {
  document.querySelectorAll(".screen").forEach(sec => {
    sec.classList.remove("visible");
    sec.classList.add("hidden");
  });
  pantalla.classList.remove("hidden");
  pantalla.classList.add("visible");
}


// ========================= LOGIN FALSO =========================
formLogin.addEventListener("submit", e => {
  e.preventDefault();

  usuario = {
    nombre: document.getElementById("nombre").value.trim(),
    genero: document.getElementById("genero").value,
    edad: document.getElementById("edad").value,
    grado: document.getElementById("grado").value
  };

  if (!usuario.nombre || !usuario.genero || !usuario.edad || !usuario.grado) {
    alert("Por favor completa todos los campos.");
    return;
  }

  // Reiniciar datos de sesión
  indiceActual = 0;
  respuestas = [];
  localStorage.setItem("usuario", JSON.stringify(usuario));

  mostrarPantalla(screens.quiz);
  cargarPreguntas();
});


// ========================= CARGAR PREGUNTAS =========================
async function cargarPreguntas() {
  try {
    const res = await fetch("data/preguntas.json");
    if (!res.ok) throw new Error("No se pudo cargar el archivo de preguntas.");
    preguntas = await res.json();

    // Filtrar preguntas según el día actual (después de cargar el JSON)
    const hoy = new Date().getDay(); // 0 = domingo, 1 = lunes, ..., 5 = viernes
    preguntas = preguntas.filter(p => 
      p.condicion === "siempre" ||
      (p.condicion === "lunes" && hoy === 1) ||
      (p.condicion === "viernes" && hoy === 5)
    );

    // Mezclar aleatoriamente
    preguntas = preguntas.sort(() => Math.random() - 0.5);
    mostrarPregunta();
    actualizarProgreso();
  } catch (err) {
    console.error("Error al cargar las preguntas:", err);
    preguntaContainer.innerHTML = "<p style='color:red'>Error al cargar las preguntas.</p>";
  }
}


// ========================= MOSTRAR PREGUNTA =========================
function mostrarPregunta() {
  const actual = preguntas[indiceActual];
  preguntaContainer.innerHTML = `<h3>${actual.pregunta}</h3>`;
  opcionesContainer.innerHTML = "";

  actual.opciones.forEach(op => {
    const btn = document.createElement("button");
    btn.textContent = op.texto;
    btn.className = "btn-option";
    btn.onclick = () => seleccionarRespuesta(op, btn);
    opcionesContainer.appendChild(btn);
  });

  // Cambiar visibilidad de botones
  if (indiceActual === preguntas.length - 1) {
    siguienteBtn.classList.add("hidden");
    terminarBtn.classList.remove("hidden");
  } else {
    siguienteBtn.classList.remove("hidden");
    terminarBtn.classList.add("hidden");
  }

  actualizarProgreso();
}


// ========================= SELECCIONAR RESPUESTA =========================
function seleccionarRespuesta(opcion, boton) {
  // Quitar selección previa
  document.querySelectorAll(".btn-option").forEach(b => b.classList.remove("selected"));
  boton.classList.add("selected");

  // Guardar respuesta
  respuestas[indiceActual] = opcion;
}


// ========================= CONTROLES DE NAVEGACIÓN =========================
siguienteBtn.addEventListener("click", () => {
  if (!respuestas[indiceActual]) {
    alert("Selecciona una opción antes de continuar.");
    return;
  }
  indiceActual++;
  if (indiceActual < preguntas.length) {
    mostrarPregunta();
  }
});

terminarBtn.addEventListener("click", () => {
  if (!respuestas[indiceActual]) {
    alert("Selecciona una opción antes de finalizar.");
    return;
  }
  mostrarPantalla(screens.result);
  mostrarResultados();
});

volverBtn.addEventListener("click", reiniciarFlujo);
verReporteBtn.addEventListener("click", () => mostrarPantalla(screens.report));
volverInicioReporte.addEventListener("click", reiniciarFlujo);


// ========================= MOSTRAR RESULTADOS =========================
function mostrarResultados() {
  const batidosList = document.getElementById("batidos-list");
  const mensajeFinal = document.getElementById("mensaje-final");
  batidosList.innerHTML = "";

  const conteo = {};
  respuestas.forEach(r => {
    conteo[r.emocion] = (conteo[r.emocion] || 0) + 1;
  });

  for (const [emocion, cantidad] of Object.entries(conteo)) {
    for (let i = 0; i < cantidad; i++) {
      const div = document.createElement("div");
      div.style.background = rColor(emocion);
      batidosList.appendChild(div);
    }
  }

  const emocionDominante = emocionPredominante(conteo);
  mensajeFinal.textContent = `Tu mezcla emocional muestra predominio de ${emocionDominante}.`;

  guardarResultado(usuario, conteo);
}


// ========================= FUNCIONES AUXILIARES =========================
function rColor(emocion) {
  const colores = {
    alegria: "#e1c03cff",
    tristeza: "#4860cbff",
    enojo: "#f44339ff",
    calma: "#62e85eff",
    nerviosismo: "#FF9A76",
    desmotivacion: "#6b698cff",
    motivacion: "#9746d5ff",
    inseguridad: "#c434a0ff"
  };
  return colores[emocion] || "#ccc";
}

function emocionPredominante(conteo) {
  return Object.entries(conteo).sort((a, b) => b[1] - a[1])[0][0];
}

function actualizarProgreso() {
  const progreso = ((indiceActual + 1) / preguntas.length) * 100;
  progressFill.style.width = `${progreso}%`;
}


// ========================= REPORTE DE PARTICIPANTES =========================
function guardarResultado(usuario, conteo) {
  const data = JSON.parse(localStorage.getItem("resultados")) || [];
  const emocion = emocionPredominante(conteo);
  data.push({ ...usuario, conteo, emocion });
  localStorage.setItem("resultados", JSON.stringify(data));
  generarReporte();
}

function generarReporte() {
  const reportSummary = document.getElementById("report-summary");
  const data = JSON.parse(localStorage.getItem("resultados")) || [];

  if (data.length === 0) {
    reportSummary.innerHTML = "<p>No hay participantes registrados todavía.</p>";
    return;
  }

  reportSummary.innerHTML = `
    <table class="report-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Edad</th>
          <th>Grado</th>
          <th>Emoción predominante</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(p => `
          <tr>
            <td>${p.nombre}</td>
            <td>${p.edad}</td>
            <td>${p.grado}</td>
            <td>${p.emocion}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// ========================= EXPORTAR REPORTE (CSV SIMPLE) =========================
if (exportarBtn) {
  exportarBtn.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("resultados")) || [];
    if (data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const csvRows = [
      ["Nombre", "Edad", "Grado", "Emoción predominante"],
      ...data.map(p => [p.nombre, p.edad, p.grado, p.emocion])
    ];

    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_emotiquest.csv";
    a.click();
    URL.revokeObjectURL(url);
  });
}


// ========================= REINICIAR FLUJO =========================
function reiniciarFlujo() {
  indiceActual = 0;
  respuestas = [];
  mostrarPantalla(screens.login);
}
