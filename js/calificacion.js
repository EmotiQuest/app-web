// ============================================
// CALIFICACION.JS - Sistema de Feedback
// ============================================

console.log('🚀 calificacion.js cargado');

// Variables globales
let sesion = null;
let ratingSeleccionado = 0;
let volveriaSeleccionado = '';

// Referencias del DOM
const nombreInput = document.getElementById('nombre');
const edadInput = document.getElementById('edad');
const generoInput = document.getElementById('genero');
const gradoInput = document.getElementById('grado');

const starsContainer = document.getElementById('stars-container');
const stars = document.querySelectorAll('.star');
const ratingLabel = document.getElementById('rating-label');
const ratingValueInput = document.getElementById('rating-value');

const choiceButtons = document.querySelectorAll('.choice-btn');
const volveriaValueInput = document.getElementById('volveria-value');

const comentariosTextarea = document.getElementById('comentarios');
const charCounter = document.getElementById('char-counter');

const calificacionForm = document.getElementById('calificacion-form');
const errorMessage = document.getElementById('error-message');

const btnOmitir = document.getElementById('btn-omitir');
const btnEnviar = document.getElementById('btn-enviar');

const mensajeGracias = document.getElementById('mensaje-gracias');
const btnFinalizar = document.getElementById('btn-finalizar');

/**
 * Inicialización
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('📋 Inicializando página de calificación...');
  
  // Verificar sesión
  if (!verificarSesion()) {
    return;
  }
  
  // Cargar datos del usuario
  cargarDatosUsuario();
  
  // Configurar sistema de estrellas
  configurarEstrellas();
  
  // Configurar botones de elección
  configurarBotonesChoice();
  
  // Configurar contador de caracteres
  configurarContadorCaracteres();
  
  // Configurar eventos del formulario
  configurarFormulario();
  
  console.log('✅ Página de calificación lista');
});

/**
 * Verifica que existe una sesión activa
 */
function verificarSesion() {
  sesion = obtenerSesionActual();
  
  if (!sesion) {
    console.error('❌ No hay sesión activa');
    alert('No hay sesión activa. Serás redirigido al inicio.');
    window.location.href = './index.html';
    return false;
  }
  
  console.log('✅ Sesión verificada:', sesion.id);
  return true;
}

/**
 * Carga los datos del usuario en el formulario
 */


/**
 * Configura el sistema de estrellas
 */
function configurarEstrellas() {
  // Evento click en cada estrella
  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      seleccionarEstrellas(index + 1);
    });
    
    // Evento hover
    star.addEventListener('mouseenter', () => {
      highlightEstrellas(index + 1);
    });
  });
  
  // Restaurar al salir del contenedor
  starsContainer.addEventListener('mouseleave', () => {
    if (ratingSeleccionado > 0) {
      highlightEstrellas(ratingSeleccionado);
    } else {
      highlightEstrellas(0);
    }
  });
  
  console.log('⭐ Sistema de estrellas configurado');
}

/**
 * Selecciona una calificación de estrellas
 */
function seleccionarEstrellas(rating) {
  ratingSeleccionado = rating;
  ratingValueInput.value = rating;
  
  // Actualizar visualización
  highlightEstrellas(rating);
  
  // Actualizar label
  const labels = {
    1: '😞 Muy insatisfecho',
    2: '😕 Insatisfecho',
    3: '😐 Neutral',
    4: '😊 Satisfecho',
    5: '🤩 Muy satisfecho'
  };
  
  ratingLabel.textContent = labels[rating] || 'Selecciona una calificación';
  ratingLabel.style.animation = 'none';
  setTimeout(() => {
    ratingLabel.style.animation = 'fadeInUp 0.3s ease';
  }, 10);
  
  console.log(`⭐ Calificación seleccionada: ${rating}`);
}

/**
 * Resalta las estrellas hasta el índice dado
 */
function highlightEstrellas(count) {
  stars.forEach((star, index) => {
    if (index < count) {
      star.classList.add('hover');
      if (index < ratingSeleccionado) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    } else {
      star.classList.remove('hover');
      star.classList.remove('selected');
    }
  });
  
  // Aplicar 'selected' solo a las calificadas
  if (ratingSeleccionado > 0) {
    stars.forEach((star, index) => {
      if (index < ratingSeleccionado) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    });
  }
}

/**
 * Configura los botones de elección (Sí/No/Tal vez)
 */
function configurarBotonesChoice() {
  choiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.choice;
      
      // Remover selección previa
      choiceButtons.forEach(b => b.classList.remove('selected'));
      
      // Seleccionar actual
      btn.classList.add('selected');
      
      // Guardar valor
      volveriaSeleccionado = choice;
      volveriaValueInput.value = choice;
      
      console.log(`✅ Elección: ${choice}`);
    });
  });
  
  console.log('🔘 Botones de elección configurados');
}

/**
 * Configura el contador de caracteres del textarea
 */
function configurarContadorCaracteres() {
  comentariosTextarea.addEventListener('input', () => {
    const length = comentariosTextarea.value.length;
    charCounter.textContent = length;
    
    // Advertencia si se acerca al límite
    const charCountDiv = charCounter.parentElement;
    if (length >= 450) {
      charCountDiv.classList.add('warning');
    } else {
      charCountDiv.classList.remove('warning');
    }
  });
  
  console.log('🔢 Contador de caracteres configurado');
}

/**
 * Configura los eventos del formulario
 */
function configurarFormulario() {
  // Evento submit
  calificacionForm.addEventListener('submit', manejarEnvio);
  
  // Botón omitir
  btnOmitir.addEventListener('click', omitirCalificacion);
  
  // Botón finalizar (en mensaje de gracias)
  btnFinalizar.addEventListener('click', () => {
    window.location.href = './index.html';
  });
  
  console.log('📝 Formulario configurado');
}

/**
 * Maneja el envío del formulario
 */
function manejarEnvio(e) {
  e.preventDefault();
  console.log('📤 Enviando calificación...');
  
  // Limpiar errores previos
  limpiarError();
  
  // Validar calificación
  if (ratingSeleccionado === 0) {
    mostrarError('Por favor, selecciona una calificación de estrellas.');
    return;
  }
  
  // Validar elección
  if (!volveriaSeleccionado) {
    mostrarError('Por favor, indica si volverías a usar EmotiQuest.');
    return;
  }
  
  // Crear objeto de calificación
  const calificacion = {
    id: generarIdCalificacion(),
    sesionId: sesion.id,
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
    edad: sesion.edad,
    genero: sesion.genero,
    grado: sesion.grado,
    emocionPredominante: sesion.emocionPredominante || 'No disponible',
    rating: ratingSeleccionado,
    volveria: volveriaSeleccionado,
    comentarios: comentariosTextarea.value.trim()
  };
  
  console.log('📊 Calificación a guardar:', calificacion);
  
  // Guardar en localStorage
  if (guardarCalificacion(calificacion)) {
    console.log('✅ Calificación guardada exitosamente');
    mostrarMensajeGracias();
  } else {
    console.error('❌ Error al guardar calificación');
    mostrarError('Hubo un error al guardar tu calificación. Por favor, intenta de nuevo.');
  }
}

/**
 * Genera un ID único para la calificación
 */
function generarIdCalificacion() {
  const fecha = new Date();
  const timestamp = fecha.getTime();
  const random = Math.floor(Math.random() * 1000);
  return `CAL-${timestamp}-${random}`;
}

/**
 * Guarda la calificación en localStorage
 */
function guardarCalificacion(calificacion) {
  try {
    // Obtener calificaciones existentes
    const calificaciones = obtenerTodasLasCalificaciones();
    
    // Agregar nueva calificación
    calificaciones.push(calificacion);
    
    // Guardar en localStorage
    localStorage.setItem('emotiquest_calificaciones', JSON.stringify(calificaciones));
    
    console.log(`✅ Total de calificaciones: ${calificaciones.length}`);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar calificación:', error);
    return false;
  }
}

/**
 * Obtiene todas las calificaciones guardadas
 */
function obtenerTodasLasCalificaciones() {
  try {
    const data = localStorage.getItem('emotiquest_calificaciones');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('❌ Error al obtener calificaciones:', error);
    return [];
  }
}

/**
 * Muestra el mensaje de agradecimiento
 */
function mostrarMensajeGracias() {
  // Ocultar formulario
  calificacionForm.style.animation = 'fadeOut 0.5s ease';
  
  setTimeout(() => {
    calificacionForm.style.display = 'none';
    mensajeGracias.classList.remove('hidden');
    mensajeGracias.style.animation = 'fadeInUp 0.6s ease';
  }, 500);
}

/**
 * Omite la calificación y redirige
 */
function omitirCalificacion() {
  const confirmar = confirm(
    '¿Estás seguro de que quieres omitir la calificación?\n\n' +
    'Tu opinión nos ayuda a mejorar EmotiQuest.'
  );
  
  if (confirmar) {
    console.log('⏭️ Calificación omitida');
    window.location.href = './index.html';
  }
}

/**
 * Muestra un mensaje de error
 */
function mostrarError(mensaje) {
  errorMessage.textContent = mensaje;
  errorMessage.classList.remove('hidden');
  errorMessage.style.animation = 'shake 0.5s ease';
  
  // Scroll al error
  errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    limpiarError();
  }, 5000);
}

/**
 * Limpia el mensaje de error
 */
function limpiarError() {
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';
}

console.log('✅ calificacion.js configurado completamente');