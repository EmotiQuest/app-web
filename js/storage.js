// ============================================
// EMOTIQUEST - STORAGE.JS (VERSIÓN CORREGIDA CON DEBUG)
// Sistema de almacenamiento 100% funcional
// ============================================

// ==================== CLAVES DE LOCALSTORAGE ====================
const STORAGE_KEYS = {
  SESIONES: 'emotiquest_sesiones',
  SESION_ACTUAL: 'emotiquest_sesion_actual',
  USUARIO_ACTUAL: 'emotiquest_usuario_actual'
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
    console.log(`📊 DEBUG - ${sesiones.length} sesiones cargadas desde localStorage`);
    return sesiones;
  } catch (error) {
    console.error('❌ Error al obtener sesiones:', error);
    return [];
  }
}

/**
 * Guarda una sesión completada en el historial (TAREA 6 - CORREGIDA)
 */
function guardarSesionCompletada(sesion) {
  try {
    console.log('💾 DEBUG - Guardando sesión completada:', sesion.id); // DEBUG
    
    // Validar que la sesión tenga datos mínimos
    if (!sesion.id || !sesion.emocionPredominante) {
      console.error('❌ DEBUG - Sesión incompleta:', sesion);
      return false;
    }

    // Obtener sesiones existentes
    const sesiones = obtenerTodasLasSesiones();
    console.log('📊 DEBUG - Sesiones actuales:', sesiones.length); // DEBUG
    
    // Verificar si ya existe
    const indice = sesiones.findIndex(s => s.id === sesion.id);
    
    if (indice !== -1) {
      // Actualizar sesión existente
      sesiones[indice] = sesion;
      console.log('🔄 DEBUG - Sesión actualizada:', sesion.id);
    } else {
      // Agregar nueva sesión
      sesiones.push(sesion);
      console.log('➕ DEBUG - Nueva sesión agregada:', sesion.id);
    }
    
    console.log('📊 DEBUG - Total sesiones después de agregar:', sesiones.length); // DEBUG
    
    // Guardar en localStorage
    const jsonString = JSON.stringify(sesiones);
    console.log('📝 DEBUG - JSON a guardar (primeros 100 chars):', jsonString.substring(0, 100)); // DEBUG
    
    localStorage.setItem(STORAGE_KEYS.SESIONES, jsonString);
    
    // VERIFICAR que se guardó
    const verificacion = localStorage.getItem(STORAGE_KEYS.SESIONES);
    if (verificacion) {
      const sesionesVerificadas = JSON.parse(verificacion);
      console.log('✅ DEBUG - Verificación exitosa: datos guardados en localStorage');
      console.log('📊 DEBUG - Total sesiones guardadas:', sesionesVerificadas.length);
      
      // Verificar que la sesión actual está en el array
      const sesionEncontrada = sesionesVerificadas.find(s => s.id === sesion.id);
      if (sesionEncontrada) {
        console.log('✅ DEBUG - Sesión específica encontrada en localStorage');
        console.log('📅 DEBUG - Fecha de la sesión guardada:', sesionEncontrada.fecha);
        console.log('😊 DEBUG - Emoción de la sesión guardada:', sesionEncontrada.emocionPredominante);
      } else {
        console.error('❌ DEBUG - Sesión NO encontrada después de guardar');
        return false;
      }
    } else {
      console.error('❌ DEBUG - Verificación falló: no se guardó en localStorage');
      return false;
    }
    
    console.log('✅ ========================================');
    console.log('✅ SESIÓN GUARDADA EXITOSAMENTE');
    console.log('✅ ========================================');
    console.log(`📊 Total de sesiones: ${sesiones.length}`);
    console.log(`🎯 ID: ${sesion.id}`);
    console.log(`😊 Emoción: ${sesion.emocionPredominante}`);
    console.log(`📅 Fecha: ${sesion.fecha}`);
    console.log(`🕐 Hora: ${sesion.hora}`);
    
    return true;
  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ ERROR CRÍTICO al guardar sesión:', error);
    console.error('Stack:', error.stack); // DEBUG
    console.error('❌ ========================================');
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
  obtenerHistorial: obtenerTodasLasSesiones, // Alias
  guardarEnHistorial: guardarSesionCompletada, // Alias
  obtenerTodasLasSesiones: obtenerTodasLasSesiones,
  guardarSesionCompletada: guardarSesionCompletada,
  eliminarSesion: eliminarSesion,
  limpiarHistorial: limpiarTodasLasSesiones,
  
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
console.log('✅ storage.js (VERSIÓN CORREGIDA) cargado correctamente');

const sesionesExistentes = obtenerTodasLasSesiones();
console.log('📊 DEBUG - Sesiones guardadas al cargar:', sesionesExistentes.length);

if (sesionesExistentes.length > 0) {
  console.log('📋 DEBUG - Primera sesión en localStorage:', sesionesExistentes[0]);
  console.log('📅 DEBUG - Fecha primera sesión:', sesionesExistentes[0].fecha);
  
  // Verificar sesiones de hoy
  const hoy = new Date().toISOString().split('T')[0];
  const sesionesHoy = sesionesExistentes.filter(s => s.fecha === hoy);
  console.log(`📅 DEBUG - Sesiones de hoy (${hoy}):`, sesionesHoy.length);
}

// Verificar si hay sesión activa
const sesionActiva = obtenerSesionActual();
if (sesionActiva) {
  console.log('⚠️ Hay una sesión activa:', sesionActiva.id);
}