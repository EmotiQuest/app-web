// ============================================
// STORAGE.JS - Manejo de LocalStorage
// Sistema centralizado para guardar y recuperar datos
// ============================================

/**
 * Clase para manejar todas las operaciones de localStorage
 */
class EmotiQuestStorage {
  
    constructor() {
      this.KEYS = {
        SESION_ACTUAL: 'emotiquest_sesion_actual',
        HISTORIAL: 'emotiquest_historial',
        RESPUESTAS: 'emotiquest_respuestas'
      };
    }
  
    // ==================== SESIÓN ACTUAL ====================
    
    /**
     * Guarda la sesión actual del usuario
     * @param {Object} datos - Datos del usuario (nombre, género, edad, grado)
     * @returns {boolean} - true si se guardó exitosamente
     */
    guardarSesionActual(datos) {
      try {
        // Agregar timestamp y ID único
        const sesion = {
          ...datos,
          id: this.generarIdUnico(),
          fechaInicio: new Date().toISOString(),
          timestamp: Date.now()
        };
        
        localStorage.setItem(this.KEYS.SESION_ACTUAL, JSON.stringify(sesion));
        console.log('✅ Sesión guardada:', sesion.id);
        return true;
      } catch (error) {
        console.error('❌ Error al guardar sesión:', error);
        return false;
      }
    }
  
    /**
     * Obtiene la sesión actual del usuario
     * @returns {Object|null} - Datos de la sesión o null si no existe
     */
    obtenerSesionActual() {
      try {
        const sesion = localStorage.getItem(this.KEYS.SESION_ACTUAL);
        return sesion ? JSON.parse(sesion) : null;
      } catch (error) {
        console.error('❌ Error al obtener sesión:', error);
        return null;
      }
    }
  
    /**
     * Elimina la sesión actual
     */
    limpiarSesionActual() {
      try {
        localStorage.removeItem(this.KEYS.SESION_ACTUAL);
        console.log('🗑️ Sesión actual eliminada');
      } catch (error) {
        console.error('❌ Error al limpiar sesión:', error);
      }
    }
  
    // ==================== RESPUESTAS ====================
    
    /**
     * Guarda las respuestas del cuestionario
     * @param {Array} respuestas - Array de objetos con respuestas
     * @returns {boolean}
     */
    guardarRespuestas(respuestas) {
      try {
        localStorage.setItem(this.KEYS.RESPUESTAS, JSON.stringify(respuestas));
        console.log('✅ Respuestas guardadas:', respuestas.length);
        return true;
      } catch (error) {
        console.error('❌ Error al guardar respuestas:', error);
        return false;
      }
    }
  
    /**
     * Obtiene las respuestas guardadas
     * @returns {Array} - Array de respuestas
     */
    obtenerRespuestas() {
      try {
        const respuestas = localStorage.getItem(this.KEYS.RESPUESTAS);
        return respuestas ? JSON.parse(respuestas) : [];
      } catch (error) {
        console.error('❌ Error al obtener respuestas:', error);
        return [];
      }
    }
  
    /**
     * Elimina las respuestas guardadas
     */
    limpiarRespuestas() {
      try {
        localStorage.removeItem(this.KEYS.RESPUESTAS);
        console.log('🗑️ Respuestas eliminadas');
      } catch (error) {
        console.error('❌ Error al limpiar respuestas:', error);
      }
    }
  
    // ==================== HISTORIAL ====================
    
    /**
     * Guarda una sesión completa en el historial (para el admin)
     * @param {Object} datosCompletos - Sesión + respuestas + emociones
     * @returns {boolean}
     */
    guardarEnHistorial(datosCompletos) {
      try {
        const historial = this.obtenerHistorial();
        
        // Crear entrada anónima para el historial (sin nombre)
        const entradaAnonima = {
          id: datosCompletos.id,
          genero: datosCompletos.genero,
          edad: datosCompletos.edad,
          grado: datosCompletos.grado,
          fechaInicio: datosCompletos.fechaInicio,
          fechaFin: new Date().toISOString(),
          emocionPredominante: datosCompletos.emocionPredominante,
          conteoEmociones: datosCompletos.conteoEmociones,
          totalRespuestas: datosCompletos.totalRespuestas
        };
        
        historial.push(entradaAnonima);
        localStorage.setItem(this.KEYS.HISTORIAL, JSON.stringify(historial));
        
        console.log('✅ Sesión agregada al historial:', entradaAnonima.id);
        return true;
      } catch (error) {
        console.error('❌ Error al guardar en historial:', error);
        return false;
      }
    }
  
    /**
     * Obtiene todo el historial de sesiones
     * @returns {Array} - Array de sesiones completadas
     */
    obtenerHistorial() {
      try {
        const historial = localStorage.getItem(this.KEYS.HISTORIAL);
        return historial ? JSON.parse(historial) : [];
      } catch (error) {
        console.error('❌ Error al obtener historial:', error);
        return [];
      }
    }
  
    /**
     * Limpia todo el historial (usar con precaución)
     */
    limpiarHistorial() {
      try {
        localStorage.removeItem(this.KEYS.HISTORIAL);
        console.log('🗑️ Historial eliminado');
      } catch (error) {
        console.error('❌ Error al limpiar historial:', error);
      }
    }
  
    // ==================== UTILIDADES ====================
    
    /**
     * Genera un ID único para cada sesión
     * Formato: EMQ-YYYYMMDD-HHMM-RANDOM
     * @returns {string}
     */
    generarIdUnico() {
      const fecha = new Date();
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const dia = String(fecha.getDate()).padStart(2, '0');
      const hora = String(fecha.getHours()).padStart(2, '0');
      const minuto = String(fecha.getMinutes()).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      return `EMQ-${año}${mes}${dia}-${hora}${minuto}-${random}`;
    }
  
    /**
     * Exporta todos los datos a JSON
     * @returns {string} - JSON con todos los datos
     */
    exportarDatos() {
      try {
        const datos = {
          sesionActual: this.obtenerSesionActual(),
          respuestas: this.obtenerRespuestas(),
          historial: this.obtenerHistorial(),
          exportadoEn: new Date().toISOString()
        };
        
        return JSON.stringify(datos, null, 2);
      } catch (error) {
        console.error('❌ Error al exportar datos:', error);
        return null;
      }
    }
  
    /**
     * Importa datos desde JSON
     * @param {string} jsonString - String JSON con los datos
     * @returns {boolean}
     */
    importarDatos(jsonString) {
      try {
        const datos = JSON.parse(jsonString);
        
        if (datos.historial && Array.isArray(datos.historial)) {
          localStorage.setItem(this.KEYS.HISTORIAL, JSON.stringify(datos.historial));
          console.log('✅ Datos importados exitosamente');
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('❌ Error al importar datos:', error);
        return false;
      }
    }
  
    /**
     * Limpia TODOS los datos de EmotiQuest
     */
    limpiarTodo() {
      try {
        this.limpiarSesionActual();
        this.limpiarRespuestas();
        this.limpiarHistorial();
        console.log('🗑️ Todos los datos eliminados');
      } catch (error) {
        console.error('❌ Error al limpiar todos los datos:', error);
      }
    }
  
    /**
     * Verifica si hay una sesión activa
     * @returns {boolean}
     */
    haySesionActiva() {
      return this.obtenerSesionActual() !== null;
    }
  }
  
  // ==================== INSTANCIA GLOBAL ====================
  // Crear instancia única para usar en toda la aplicación
  const storage = new EmotiQuestStorage();
  
  // Hacer disponible globalmente
  if (typeof window !== 'undefined') {
    window.EmotiQuestStorage = storage;
  }
  
  console.log('📦 Storage inicializado correctamente');