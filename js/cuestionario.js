// ============================================
// CUESTIONARIO.JS - Lógica del cuestionario
// ============================================

// Variables globales
let preguntas = [];
let preguntasFiltradas = [];
let indiceActual = 0;
let respuestas = [];
let sesion = null;

// Referencias del DOM
const userGreeting = document.getElementById('user-greeting');
const questionTitle = document.getElementById('question-title');
const optionsGrid = document.getElementById('options-grid');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const batidoPreview = document.getElementById('batido-preview');
const batidoCup = document.getElementById('batido-cup');
const batidoLabel = document.getElementById('batido-label');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnTerminar = document.getElementById('btn-terminar');

/**
 * Inicializa el cuestionario
 */
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 Inicializando cuestionario...');
  
  // Verificar que existe una sesión
  if (!verificarSesion()) {
    return;
  }
  
  // Cargar preguntas
  await cargarPreguntas();
  
  // Configurar controles
  configurarControles();
  
  // Mostrar primera pregunta
  mostrarPregunta();
  
  // Aplicar animación de entrada
  aplicarAnimacionEntrada();
});

/**
 * Verifica que existe una sesión activa
 * @returns {boolean}
 */
function verificarSesion() {
  if (!window.EmotiQuestStorage) {
    console.error('❌ Storage no disponible');
    alert('Error del sistema. Redirigiendo al inicio...');
    window.location.href = './index.html';
    return false;
  }
  
  sesion = window.EmotiQuestStorage.obtenerSesionActual();
  
  if (!sesion) {
    alert('No hay sesión activa. Por favor, inicia sesión primero.');
    window.location.href = './index.html';
    return false;
  }
  
  // Mostrar saludo
  if (userGreeting) {
    userGreeting.textContent = `¡Hola, ${sesion.nombre}! 👋`;
  }
  
  console.log('✅ Sesión verificada:', sesion.id);
  return true;
}

/**
 * Carga las preguntas desde el archivo JSON
 */
async function cargarPreguntas() {
  try {
    const respuesta = await fetch('./data/preguntas.json');
    
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    
    preguntas = await respuesta.json();
    console.log(`📋 ${preguntas.length} preguntas cargadas`);
    
    // Filtrar preguntas según el día
    filtrarPreguntasPorDia();
    
    // NO mezclar aquí porque filtrarPreguntasPorDia ya lo hace
    // y coloca la pregunta 6 al final
    
    console.log(`✅ ${preguntasFiltradas.length} preguntas disponibles`);
    
  } catch (error) {
    console.error('❌ Error al cargar preguntas:', error);
    alert('Error al cargar las preguntas. Por favor, recarga la página.');
  }
}

/**
 * Filtra preguntas según el día de la semana
 */
function filtrarPreguntasPorDia() {
  const hoy = new Date().getDay(); // 0 = domingo, 1 = lunes, ..., 5 = viernes, 6 = sábado
  
  // Separar pregunta 6 (final) del resto
  let preguntaFinal = null;
  let preguntasNormales = [];
  
  preguntas.forEach(pregunta => {
    // La pregunta con id 6 siempre va al final
    if (pregunta.id === 6) {
      preguntaFinal = pregunta;
      return;
    }
    
    // Filtrar el resto según condición
    if (pregunta.condicion === 'siempre') {
      preguntasNormales.push(pregunta);
    } else if (pregunta.condicion === 'lunes' && hoy === 1) {
      preguntasNormales.push(pregunta);
    } else if (pregunta.condicion === 'viernes' && hoy === 5) {
      preguntasNormales.push(pregunta);
    }
  });
  
  // Mezclar solo las preguntas normales
  preguntasNormales = mezclarArray(preguntasNormales);
  
  // Agregar pregunta final al último
  if (preguntaFinal) {
    preguntasNormales.push(preguntaFinal);
  }
  
  preguntasFiltradas = preguntasNormales;
  
  console.log(`🗓️ Día: ${obtenerNombreDia(hoy)}, Preguntas filtradas: ${preguntasFiltradas.length}`);
  console.log('📌 Pregunta final (ID 6) colocada al último');
}

/**
 * Obtiene el nombre del día
 * @param {number} dia - Número del día (0-6)
 * @returns {string}
 */
function obtenerNombreDia(dia) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[dia];
}

/**
 * Mezcla aleatoriamente un array
 * @param {Array} array
 * @returns {Array}
 */
function mezclarArray(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Muestra la pregunta actual
 */
function mostrarPregunta() {
  if (indiceActual >= preguntasFiltradas.length) {
    console.log('✅ Todas las preguntas respondidas');
    return;
  }
  
  const pregunta = preguntasFiltradas[indiceActual];
  
  // Actualizar título de la pregunta
  questionTitle.textContent = pregunta.pregunta;
  
  // Limpiar opciones anteriores
  optionsGrid.innerHTML = '';
  
  // Crear botones de opciones
  pregunta.opciones.forEach((opcion, index) => {
    const boton = document.createElement('button');
    boton.className = 'option-btn';
    boton.textContent = opcion.texto;
    boton.dataset.emocion = opcion.emocion;
    boton.dataset.index = index;
    
    // Evento click
    boton.addEventListener('click', () => seleccionarOpcion(opcion, boton));
    
    // Si ya hay respuesta guardada, marcarla
    if (respuestas[indiceActual] && respuestas[indiceActual].texto === opcion.texto) {
      boton.classList.add('selected');
    }
    
    optionsGrid.appendChild(boton);
  });
  
  // Actualizar barra de progreso
  actualizarProgreso();
  
  // Actualizar controles
  actualizarControles();
  
  // Ocultar preview del batido
  batidoPreview.classList.add('hidden');
  
  console.log(`❓ Mostrando pregunta ${indiceActual + 1}/${preguntasFiltradas.length}`);
}

/**
 * Maneja la selección de una opción
 * @param {Object} opcion - Opción seleccionada
 * @param {HTMLElement} boton - Botón clickeado
 */
function seleccionarOpcion(opcion, boton) {
  // Remover selección anterior
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  // Marcar nueva selección
  boton.classList.add('selected');
  
  // Guardar respuesta
  respuestas[indiceActual] = {
    preguntaId: preguntasFiltradas[indiceActual].id,
    pregunta: preguntasFiltradas[indiceActual].pregunta,
    texto: opcion.texto,
    emocion: opcion.emocion
  };
  
  // Habilitar botón siguiente/terminar
  btnSiguiente.disabled = false;
  btnTerminar.disabled = false;
  
  // NO MOSTRAR preview del batido (comentado)
  // mostrarBatidoPreview(opcion.emocion);
  
  console.log(`✅ Respuesta seleccionada: ${opcion.texto} (${opcion.emocion})`);
}

/**
 * Muestra el preview del batido seleccionado
 * @param {string} emocion - Nombre de la emoción
 */
function mostrarBatidoPreview(emocion) {
  if (!window.SistemaEmociones) return;
  
  const color = window.SistemaEmociones.obtenerColor(emocion);
  const emoji = window.SistemaEmociones.obtenerEmoji(emocion);
  
  batidoCup.style.background = color;
  batidoLabel.textContent = `${emoji} ¡Respuesta registrada!`;
  
  batidoPreview.classList.remove('hidden');
  batidoPreview.style.animation = 'bounceIn 0.5s ease';
  
  setTimeout(() => {
    batidoPreview.style.animation = '';
  }, 500);
}

/**
 * Actualiza la barra de progreso
 */
function actualizarProgreso() {
  const total = preguntasFiltradas.length;
  const actual = indiceActual + 1;
  const porcentaje = (actual / total) * 100;
  
  progressFill.style.width = `${porcentaje}%`;
  progressText.textContent = `Pregunta ${actual} de ${total}`;
}

/**
 * Actualiza los controles de navegación
 */
function actualizarControles() {
  // Botón anterior
  if (indiceActual > 0) {
    btnAnterior.classList.remove('hidden');
  } else {
    btnAnterior.classList.add('hidden');
  }
  
  // Botones siguiente/terminar
  const esUltimaPregunta = indiceActual === preguntasFiltradas.length - 1;
  
  if (esUltimaPregunta) {
    btnSiguiente.classList.add('hidden');
    btnTerminar.classList.remove('hidden');
  } else {
    btnSiguiente.classList.remove('hidden');
    btnTerminar.classList.add('hidden');
  }
  
  // Deshabilitar si no hay respuesta
  const hayRespuesta = respuestas[indiceActual] !== undefined;
  btnSiguiente.disabled = !hayRespuesta;
  btnTerminar.disabled = !hayRespuesta;
}

/**
 * Configura los event listeners de los controles
 */
function configurarControles() {
  // Botón anterior
  btnAnterior.addEventListener('click', () => {
    if (indiceActual > 0) {
      indiceActual--;
      mostrarPregunta();
    }
  });
  
  // Botón siguiente
  btnSiguiente.addEventListener('click', () => {
    if (!respuestas[indiceActual]) {
      alert('Por favor, selecciona una opción antes de continuar.');
      return;
    }
    
    if (indiceActual < preguntasFiltradas.length - 1) {
      indiceActual++;
      mostrarPregunta();
    }
  });
  
  // Botón terminar
  btnTerminar.addEventListener('click', () => {
    if (!respuestas[indiceActual]) {
      alert('Por favor, selecciona una opción antes de finalizar.');
      return;
    }
    
    finalizarCuestionario();
  });
}

/**
 * Finaliza el cuestionario y guarda los resultados
 */
function finalizarCuestionario() {
  console.log('🎉 Finalizando cuestionario...');
  
  // Verificar que todas las preguntas fueron respondidas
  const preguntasRespondidas = respuestas.filter(r => r !== undefined).length;
  
  if (preguntasRespondidas < preguntasFiltradas.length) {
    const confirmar = confirm(
      `Has respondido ${preguntasRespondidas} de ${preguntasFiltradas.length} preguntas.\n\n` +
      '¿Deseas terminar de todos modos?'
    );
    
    if (!confirmar) {
      return;
    }
  }
  
  // Guardar respuestas en storage
  if (window.EmotiQuestStorage) {
    window.EmotiQuestStorage.guardarRespuestas(respuestas);
  }
  
  // Calcular emociones
  if (window.SistemaEmociones) {
    const conteo = window.SistemaEmociones.contarEmociones(respuestas);
    const emocionPredominante = window.SistemaEmociones.calcularPredominante(conteo);
    
    // Guardar en historial
    if (window.EmotiQuestStorage) {
      const datosCompletos = {
        ...sesion,
        respuestas: respuestas,
        conteoEmociones: conteo,
        emocionPredominante: emocionPredominante,
        totalRespuestas: preguntasRespondidas
      };
      
      window.EmotiQuestStorage.guardarEnHistorial(datosCompletos);
    }
    
    console.log('📊 Emoción predominante:', emocionPredominante);
    console.log('📊 Conteo:', conteo);
  }
  
  // Aplicar transición de salida
  aplicarTransicionSalida();
  
  // Redirigir a resultados
  setTimeout(() => {
    window.location.href = './resultado.html';
  }, 600);
}

/**
 * Aplica animación de entrada a la página
 */
function aplicarAnimacionEntrada() {
  const quizContainer = document.querySelector('.quiz-container');
  if (quizContainer) {
    quizContainer.style.opacity = '0';
    quizContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      quizContainer.style.transition = 'all 0.6s ease';
      quizContainer.style.opacity = '1';
      quizContainer.style.transform = 'translateY(0)';
    }, 100);
  }
}

/**
 * Aplica transición de salida antes de cambiar de página
 */
function aplicarTransicionSalida() {
  const quizContainer = document.querySelector('.quiz-container');
  if (quizContainer) {
    quizContainer.style.transition = 'all 0.5s ease';
    quizContainer.style.opacity = '0';
    quizContainer.style.transform = 'scale(0.95)';
  }
  
  document.body.style.transition = 'opacity 0.5s ease';
  document.body.style.opacity = '0.7';
}

console.log('✅ cuestionario.js cargado correctamente');