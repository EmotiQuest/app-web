// ============================================
// EMOTIQUEST - STORAGE.JS (VERSIÓN CON CALIFICACIONES)
// Sistema de almacenamiento 100% funcional
// ============================================

// ==================== CLAVES DE LOCALSTORAGE ====================
const STORAGE_KEYS = {
  SESIONES: 'emotiquest_sesiones',
  SESION_ACTUAL: 'emotiquest_sesion_actual',
  USUARIO_ACTUAL: 'emotiquest_usuario_actual',
  CALIFICACIONES: 'emotiquest_calificaciones' // NUEVO
};

// ==================== FUNCIONES DE SESIÓN ACTUAL ====================

/**
 * Guarda la sesión en progreso
 */
function guardarSesionActual(sesion) {
  try {
    localStorage.setItem(STORAGE_KEYS.SESION_ACTUAL, JSON.stringify(sesion));
    console.log('✅ Sesión actual guardada:', sesion.id);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar sesión actual:', error);
    return false;
  }
}

/**
 * Obtiene la sesión en progreso
 */
function obtenerSesionActual() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESION_ACTUAL);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ Error al obtener sesión actual:', error);
    return null;
  }
}

/**
 * Limpia la sesión actual
 */
function limpiarSesionActual() {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESION_ACTUAL);
    console.log('🧹 Sesión actual limpiada');
    return true;
  } catch (error) {
    console.error('❌ Error al limpiar sesión:', error);
    return false;
  }
}

// ==================== FUNCIONES DE USUARIO ====================

/**
 * Guarda el usuario actual
 */
function guardarUsuarioActual(usuario) {
  try {
    localStorage.setItem(STORAGE_KEYS.USUARIO_ACTUAL, JSON.stringify(usuario));
    console.log('✅ Usuario guardado:', usuario.id);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar usuario:', error);
    return false;
  }
}

/**
 * Obtiene el usuario actual
 */
function obtenerUsuarioActual() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USUARIO_ACTUAL);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    return null;
  }
}

/**
 * Limpia el usuario actual
 */
function limpiarUsuarioActual() {
  try {
    localStorage.removeItem(STORAGE_KEYS.USUARIO_ACTUAL);
    console.log('🧹 Usuario limpiado');
    return true;
  } catch (error) {
    console.error('❌ Error al limpiar usuario:', error);
    return false;
  }
}

// ==================== FUNCIONES DE SESIONES GUARDADAS ====================

/**
 * Obtiene todas las sesiones guardadas
 */
function obtenerTodasLasSesiones() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESIONES);
    const sesiones = data ? JSON.parse(data) : [];
    console.log(`📊 ${sesiones.length} sesiones cargadas`);
    return sesiones;
  } catch (error) {
    console.error('❌ Error al obtener sesiones:', error);
    return [];
  }
}

/**
 * Guarda una sesión completada en el historial
 */
function guardarSesionCompletada(sesion) {
  try {
    // Validar que la sesión tenga datos mínimos
    if (!sesion.id || !sesion.emocionPredominante) {
      console.error('❌ Sesión incompleta:', sesion);
      return false;
    }

    // Obtener sesiones existentes
    const sesiones = obtenerTodasLasSesiones();
    
    // Verificar si ya existe
    const indice = sesiones.findIndex(s => s.id === sesion.id);
    
    if (indice !== -1) {
      // Actualizar sesión existente
      sesiones[indice] = sesion;
      console.log('🔄 Sesión actualizada:', sesion.id);
    } else {
      // Agregar nueva sesión
      sesiones.push(sesion);
      console.log('➕ Nueva sesión agregada:', sesion.id);
    }
    
    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEYS.SESIONES, JSON.stringify(sesiones));
    
    console.log('✅ SESIÓN GUARDADA EXITOSAMENTE');
    console.log(`📊 Total de sesiones: ${sesiones.length}`);
    console.log(`🎯 Emoción: ${sesion.emocionPredominante}`);
    
    return true;
  } catch (error) {
    console.error('❌ ERROR CRÍTICO al guardar sesión:', error);
    return false;
  }
}

/**
 * Elimina una sesión específica
 */
function eliminarSesion(idSesion) {
  try {
    const sesiones = obtenerTodasLasSesiones();
    const filtradas = sesiones.filter(s => s.id !== idSesion);
    
    if (sesiones.length === filtradas.length) {
      console.log('⚠️ Sesión no encontrada:', idSesion);
      return false;
    }
    
    localStorage.setItem(STORAGE_KEYS.SESIONES, JSON.stringify(filtradas));
    console.log('🗑️ Sesión eliminada:', idSesion);
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar sesión:', error);
    return false;
  }
}

/**
 * Limpia TODAS las sesiones (con confirmación)
 */
function limpiarTodasLasSesiones() {
  try {
    const confirmacion = confirm(
      '⚠️ ¿Eliminar TODAS las sesiones?\n\n' +
      'Esta acción NO se puede deshacer.'
    );
    
    if (!confirmacion) {
      return false;
    }
    
    localStorage.removeItem(STORAGE_KEYS.SESIONES);
    console.log('🗑️ Todas las sesiones eliminadas');
    return true;
  } catch (error) {
    console.error('❌ Error al limpiar sesiones:', error);
    return false;
  }
}

// ==================== FUNCIONES DE CALIFICACIONES (NUEVO) ====================

/**
 * Obtiene todas las calificaciones guardadas
 */
function obtenerTodasLasCalificaciones() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CALIFICACIONES);
    const calificaciones = data ? JSON.parse(data) : [];
    console.log(`⭐ ${calificaciones.length} calificaciones cargadas`);
    return calificaciones;
  } catch (error) {
    console.error('❌ Error al obtener calificaciones:', error);
    return [];
  }
}

/**
 * Guarda una calificación
 */
function guardarCalificacion(calificacion) {
  try {
    const calificaciones = obtenerTodasLasCalificaciones();
    calificaciones.push(calificacion);
    
    localStorage.setItem(STORAGE_KEYS.CALIFICACIONES, JSON.stringify(calificaciones));
    
    console.log('✅ Calificación guardada:', calificacion.id);
    console.log(`⭐ Total de calificaciones: ${calificaciones.length}`);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar calificación:', error);
    return false;
  }
}

/**
 * Elimina una calificación específica
 */
function eliminarCalificacion(idCalificacion) {
  try {
    const calificaciones = obtenerTodasLasCalificaciones();
    const filtradas = calificaciones.filter(c => c.id !== idCalificacion);
    
    if (calificaciones.length === filtradas.length) {
      console.log('⚠️ Calificación no encontrada:', idCalificacion);
      return false;
    }
    
    localStorage.setItem(STORAGE_KEYS.CALIFICACIONES, JSON.stringify(filtradas));
    console.log('🗑️ Calificación eliminada:', idCalificacion);
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar calificación:', error);
    return false;
  }
}

/**
 * Limpia TODAS las calificaciones
 */
function limpiarTodasLasCalificaciones() {
  try {
    const confirmacion = confirm(
      '⚠️ ¿Eliminar TODAS las calificaciones?\n\n' +
      'Esta acción NO se puede deshacer.'
    );
    
    if (!confirmacion) {
      return false;
    }
    
    localStorage.removeItem(STORAGE_KEYS.CALIFICACIONES);
    console.log('🗑️ Todas las calificaciones eliminadas');
    return true;
  } catch (error) {
    console.error('❌ Error al limpiar calificaciones:', error);
    return false;
  }
}

// ==================== FUNCIONES DE EMOTIQUEST (COMPATIBILIDAD) ====================

/**
 * Sistema EmotiQuestStorage como objeto global
 * Para compatibilidad con código que usa window.EmotiQuestStorage
 */
window.EmotiQuestStorage = {
  // Sesión actual
  guardarSesionActual: guardarSesionActual,
  obtenerSesionActual: obtenerSesionActual,
  limpiarSesionActual: limpiarSesionActual,
  
  // Usuario
  guardarUsuarioActual: guardarUsuarioActual,
  obtenerUsuarioActual: obtenerUsuarioActual,
  limpiarUsuarioActual: limpiarUsuarioActual,
  
  // Sesiones guardadas
  obtenerHistorial: obtenerTodasLasSesiones,
  guardarEnHistorial: guardarSesionCompletada,
  obtenerTodasLasSesiones: obtenerTodasLasSesiones,
  guardarSesionCompletada: guardarSesionCompletada,
  eliminarSesion: eliminarSesion,
  limpiarHistorial: limpiarTodasLasSesiones,
  
  // Calificaciones (NUEVO)
  obtenerTodasLasCalificaciones: obtenerTodasLasCalificaciones,
  guardarCalificacion: guardarCalificacion,
  eliminarCalificacion: eliminarCalificacion,
  limpiarTodasLasCalificaciones: limpiarTodasLasCalificaciones,
  
  // Respuestas (para compatibilidad)
  guardarRespuestas: function(respuestas) {
    const sesion = obtenerSesionActual();
    if (sesion) {
      sesion.respuestas = respuestas;
      return guardarSesionActual(sesion);
    }
    return false;
  },
  
  obtenerRespuestas: function() {
    const sesion = obtenerSesionActual();
    return sesion ? (sesion.respuestas || []) : [];
  },
  
  limpiarRespuestas: function() {
    const sesion = obtenerSesionActual();
    if (sesion) {
      sesion.respuestas = [];
      return guardarSesionActual(sesion);
    }
    return false;
  }
};

// ==================== VERIFICACIÓN INICIAL ====================
console.log('✅ storage.js (CON CALIFICACIONES) cargado correctamente');
console.log('📊 Sesiones guardadas:', obtenerTodasLasSesiones().length);
console.log('⭐ Calificaciones guardadas:', obtenerTodasLasCalificaciones().length);

// Verificar si hay sesión activa
const sesionActiva = obtenerSesionActual();
if (sesionActiva) {
  console.log('⚠️ Hay una sesión activa:', sesionActiva.id);
}