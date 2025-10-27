// ============================================
// EMOTIQUEST - CUESTIONARIO.JS (CORREGIDO)
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
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnTerminar = document.getElementById('btn-terminar');

// Elementos de emoción seleccionada
let emocionSeleccionada = document.getElementById('emocion-seleccionada');
let emocionNombre = document.getElementById('emocion-nombre');

// Si no existen, crearlos
if (!emocionSeleccionada) {
  emocionSeleccionada = document.createElement('div');
  emocionSeleccionada.id = 'emocion-seleccionada';
  emocionSeleccionada.className = 'emocion-seleccionada hidden';
  
  emocionNombre = document.createElement('p');
  emocionNombre.id = 'emocion-nombre';
  emocionNombre.className = 'emocion-nombre';
  
  emocionSeleccionada.appendChild(emocionNombre);
  optionsGrid.parentNode.insertBefore(emocionSeleccionada, optionsGrid.nextSibling);
}

/**
 * Inicializa el cuestionario
 */
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 Inicializando cuestionario...');
  
  // Verificar sesión
  if (!verificarSesion()) {
    return;
  }
  
  // Cargar preguntas
  await cargarPreguntas();
  
  // Configurar controles
  configurarControles();
  
  // Mostrar primera pregunta
  mostrarPregunta();
  
  // Animación de entrada
  aplicarAnimacionEntrada();
});

/**
 * Verifica que existe una sesión activa
 */
function verificarSesion() {
  // Obtener sesión actual
  sesion = obtenerSesionActual();
  
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
 * Carga las preguntas desde JSON
 */
async function cargarPreguntas() {
  try {
    const respuesta = await fetch('./data/preguntas.json');
    
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    
    preguntas = await respuesta.json();
    console.log(`📋 ${preguntas.length} preguntas cargadas`);
    
    // Filtrar y mezclar
    filtrarPreguntasPorDia();
    
    console.log(`✅ ${preguntasFiltradas.length} preguntas disponibles`);
  } catch (error) {
    console.error('❌ Error al cargar preguntas:', error);
    alert('Error al cargar las preguntas. Por favor, recarga la página.');
  }
}

/**
 * Filtra preguntas según el día
 */
function filtrarPreguntasPorDia() {
  const hoy = new Date().getDay();
  
  let preguntaFinal = null;
  let preguntasNormales = [];
  
  preguntas.forEach(pregunta => {
    if (pregunta.id === 6) {
      preguntaFinal = pregunta;
      return;
    }
    
    if (pregunta.condicion === 'siempre') {
      preguntasNormales.push(pregunta);
    } else if (pregunta.condicion === 'lunes' && hoy === 1) {
      preguntasNormales.push(pregunta);
    } else if (pregunta.condicion === 'viernes' && hoy === 5) {
      preguntasNormales.push(pregunta);
    }
  });
  
  preguntasNormales = mezclarArray(preguntasNormales);
  
  if (preguntaFinal) {
    preguntasNormales.push(preguntaFinal);
  }
  
  preguntasFiltradas = preguntasNormales;
}

/**
 * Mezcla array aleatoriamente
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
  
  // Actualizar título
  questionTitle.textContent = pregunta.pregunta;
  
  // Limpiar opciones
  optionsGrid.innerHTML = '';
  
  // Verificar SistemaEmociones
  if (!window.SistemaEmociones) {
    console.error('❌ SistemaEmociones NO disponible');
    return;
  }
  
  // Crear botellas
  pregunta.opciones.forEach((opcion, index) => {
    const color = window.SistemaEmociones.obtenerColor(opcion.emocion);
    const emoji = window.SistemaEmociones.obtenerEmoji(opcion.emocion);
    
    const botellaContainer = document.createElement('div');
    botellaContainer.className = 'botella-option';
    botellaContainer.dataset.emocion = opcion.emocion;
    botellaContainer.dataset.texto = opcion.texto;
    
    // Si ya hay respuesta, marcarla
    if (respuestas[indiceActual] && respuestas[indiceActual].texto === opcion.texto) {
      botellaContainer.classList.add('selected');
    }
    
    const botella = document.createElement('div');
    botella.className = 'botella';
    botella.style.background = color;
    
    const tapa = document.createElement('div');
    tapa.className = 'tapa-botella';

    // NUEVO: Crear reflejo brillante para efecto 3D
    const reflejo = document.createElement('div');
    reflejo.className = 'reflejo-botella';
    
    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'botella-emoji';
    emojiSpan.textContent = emoji;
    
    botella.appendChild(tapa);
     botella.appendChild(reflejo); // Agregar reflejo antes del emoji
    botella.appendChild(emojiSpan);
    botellaContainer.appendChild(botella);
    
    // Evento click
    botellaContainer.addEventListener('click', () => seleccionarOpcion(opcion, botellaContainer));
    
    optionsGrid.appendChild(botellaContainer);
  });
  
  // Actualizar progreso
  actualizarProgreso();
  
  // Actualizar controles
  actualizarControles();
  
  // Ocultar nombre de emoción
  emocionSeleccionada.classList.add('hidden');
}

/**
 * Selecciona una opción
 */
function seleccionarOpcion(opcion, botellaContainer) {
  // Remover selección anterior
  document.querySelectorAll('.botella-option').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  // Marcar nueva selección
  botellaContainer.classList.add('selected');
  
  // Guardar respuesta
  respuestas[indiceActual] = {
    preguntaId: preguntasFiltradas[indiceActual].id,
    pregunta: preguntasFiltradas[indiceActual].pregunta,
    texto: opcion.texto,
    emocion: opcion.emocion
  };
  
  // Guardar en sesión
  sesion.respuestas = respuestas;
  guardarSesionActual(sesion);
  
  // Habilitar botones
  btnSiguiente.disabled = false;
  btnTerminar.disabled = false;
  
  // Mostrar nombre de emoción
  mostrarNombreEmocion(opcion.emocion);
  
  console.log(`✅ Respuesta ${indiceActual + 1}:`, opcion.texto, `(${opcion.emocion})`);
}

/**
 * Muestra el nombre de la emoción
 */
function mostrarNombreEmocion(emocion) {
  const emocionData = window.SistemaEmociones.obtenerEmocion(emocion);
  const emoji = window.SistemaEmociones.obtenerEmoji(emocion);
  
  emocionNombre.textContent = `${emoji} ${emocionData.nombre}`;
  emocionSeleccionada.classList.remove('hidden');
  emocionSeleccionada.style.animation = 'fadeInUp 0.5s ease';
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
 * Actualiza los controles
 */
function actualizarControles() {
  // Botón anterior
  if (indiceActual > 0) {
    btnAnterior.classList.remove('hidden');
  } else {
    btnAnterior.classList.add('hidden');
  }
  
  // Botones siguiente/terminar
  const esUltima = indiceActual === preguntasFiltradas.length - 1;
  
  if (esUltima) {
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
 * Configura los controles
 */
function configurarControles() {
  btnAnterior.addEventListener('click', () => {
    if (indiceActual > 0) {
      indiceActual--;
      mostrarPregunta();
    }
  });
  
  btnSiguiente.addEventListener('click', () => {
    if (!respuestas[indiceActual]) {
      alert('Por favor, selecciona una opción.');
      return;
    }
    
    if (indiceActual < preguntasFiltradas.length - 1) {
      indiceActual++;
      mostrarPregunta();
    }
  });
  
  btnTerminar.addEventListener('click', () => {
    if (!respuestas[indiceActual]) {
      alert('Por favor, selecciona una opción.');
      return;
    }
    
    finalizarCuestionario();
  });
}

/**
 * Finaliza el cuestionario
 */
function finalizarCuestionario() {
  console.log('🎉 Finalizando cuestionario...');
  
  // Verificar respuestas
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
  
  // Actualizar sesión con respuestas finales
  sesion.respuestas = respuestas.filter(r => r !== undefined);
  sesion.totalRespuestas = sesion.respuestas.length;
  
  // Guardar sesión actualizada
  guardarSesionActual(sesion);
  
  console.log('✅ Sesión actualizada con', sesion.respuestas.length, 'respuestas');
  console.log('📊 Respuestas:', sesion.respuestas);
  
  // Transición
  aplicarTransicionSalida();
  
  // Redirigir a resultados
  setTimeout(() => {
    window.location.href = './resultado.html';
  }, 600);
}

/**
 * Animación de entrada
 */
function aplicarAnimacionEntrada() {
  const container = document.querySelector('.quiz-container');
  if (container) {
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      container.style.transition = 'all 0.6s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 100);
  }
}

/**
 * Transición de salida
 */
function aplicarTransicionSalida() {
  const container = document.querySelector('.quiz-container');
  if (container) {
    container.style.transition = 'all 0.5s ease';
    container.style.opacity = '0';
    container.style.transform = 'scale(0.95)';
  }
}

console.log('✅ cuestionario.js cargado');