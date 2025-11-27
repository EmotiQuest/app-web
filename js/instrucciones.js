/**
 * ============================================
 * INSTRUCCIONES.JS - EmotiQuest
 * ============================================
 * Maneja la página de instrucciones antes del cuestionario
 * 
 * Funcionalidades:
 * - Muestra el nombre y avatar del usuario
 * - Explica el sistema de emociones y colores
 * - Registra que el usuario vio las instrucciones
 * - Navega al cuestionario o vuelve a avatar
 */

// ============================================
// ESPERAR A QUE EL DOM ESTÉ LISTO
// ============================================
document.addEventListener('DOMContentLoaded', inicializarInstrucciones);

// ============================================
// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
// ============================================
function inicializarInstrucciones() {
  console.log('📋 Inicializando página de instrucciones...');

  // Verificar que el usuario haya iniciado sesión
  const sesionActual = obtenerSesionActual();
  
  if (!sesionActual) {
    console.warn('⚠️ No hay sesión activa. Redirigiendo a inicio...');
    alert('Debes iniciar sesión primero');
    window.location.href = './index.html';
    return;
  }

  // Verificar que haya seleccionado avatar
  if (!sesionActual.avatar) {
    console.warn('⚠️ No hay avatar seleccionado. Redirigiendo...');
    alert('Debes seleccionar un avatar primero');
    window.location.href = './avatar-selection.html';
    return;
  }

  // Mostrar información del usuario
  mostrarInformacionUsuario(sesionActual);

  // Registrar que vio las instrucciones
  registrarVisualizacionInstrucciones(sesionActual);

  // Configurar botones
  configurarBotones();

  // Animaciones de entrada
  animarEmociones();

  console.log('✅ Instrucciones cargadas correctamente');
}

// ============================================
// MOSTRAR INFORMACIÓN DEL USUARIO
// ============================================
function mostrarInformacionUsuario(sesion) {
  // Mostrar nombre
  const greetingElement = document.getElementById('greeting-name');
  if (greetingElement) {
    greetingElement.textContent = `¡Perfecto, ${sesion.nombre}!`;
  }

  // Mostrar avatar seleccionado
  const avatarImg = document.getElementById('user-avatar');
  if (avatarImg && sesion.avatar) {
    avatarImg.src = sesion.avatar;
    avatarImg.alt = `Avatar de ${sesion.nombre}`;
  }
}

// ============================================
// REGISTRAR QUE VIO LAS INSTRUCCIONES
// ============================================
function registrarVisualizacionInstrucciones(sesion) {
  // Agregar timestamp de visualización
  sesion.instruccionesVistas = true;
  sesion.timestampInstrucciones = new Date().toISOString();

  // Guardar cambios en localStorage
  guardarSesionActual(sesion);

  console.log('📝 Registro: Usuario vio las instrucciones');
}

// ============================================
// CONFIGURAR BOTONES
// ============================================
function configurarBotones() {
  const btnVolver = document.getElementById('btn-volver');
  const btnComenzar = document.getElementById('btn-comenzar');

  // Botón: Volver a selección de avatar
  if (btnVolver) {
    btnVolver.addEventListener('click', () => {
      console.log('🔙 Volviendo a selección de avatar...');
      window.location.href = './avatar-selection.html';
    });
  }

  // Botón: Comenzar cuestionario
  if (btnComenzar) {
    btnComenzar.addEventListener('click', () => {
      console.log('🚀 Iniciando cuestionario...');
      window.location.href = './cuestionario.html';
    });
  }
}

// ============================================
// ANIMACIONES DE EMOCIONES
// ============================================
function animarEmociones() {
  const emocionItems = document.querySelectorAll('.emocion-item');
  
  emocionItems.forEach((item, index) => {
    // Retrasar la animación de cada emoción
    setTimeout(() => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.5s ease-out';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 50);
      
    }, index * 100); // 100ms de diferencia entre cada una
  });

  // Efecto hover para las emociones
  emocionItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const emoji = item.querySelector('.emocion-emoji');
      if (emoji) {
        emoji.style.transform = 'scale(1.2) rotate(10deg)';
      }
    });

    item.addEventListener('mouseleave', () => {
      const emoji = item.querySelector('.emocion-emoji');
      if (emoji) {
        emoji.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });
}

// ============================================
// FUNCIONES AUXILIARES DE STORAGE
// ============================================

/**
 * Obtener sesión actual del localStorage
 */
function obtenerSesionActual() {
  try {
    const sesionJSON = localStorage.getItem('emotiquest_sesion_actual');
    if (!sesionJSON) return null;
    return JSON.parse(sesionJSON);
  } catch (error) {
    console.error('❌ Error al obtener sesión actual:', error);
    return null;
  }
}

/**
 * Guardar sesión actual en localStorage
 */
function guardarSesionActual(sesion) {
  try {
    localStorage.setItem('emotiquest_sesion_actual', JSON.stringify(sesion));
    console.log('💾 Sesión actualizada en localStorage');
  } catch (error) {
    console.error('❌ Error al guardar sesión:', error);
  }
}