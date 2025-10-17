// ============================================
// EMOCIONES.JS - Sistema de emociones
// Define colores, gestos y mensajes para cada emoción
// ============================================

/**
 * Configuración de emociones del sistema
 */
const EMOCIONES = {
  alegria: {
    nombre: 'Alegría',
    color: '#e1c03c',
    emoji: '😊',
    gesto: 'sonrisa',
    mensajes: [
      '¡Tu día estuvo lleno de momentos felices!',
      'La alegría es tu compañera principal.',
      'Tu energía positiva brilla con fuerza.'
    ]
  },
  tristeza: {
    nombre: 'Tristeza',
    color: '#4860cb',
    emoji: '😢',
    gesto: 'puchero',
    mensajes: [
      'Has tenido momentos de melancolía.',
      'Es normal sentir tristeza a veces.',
      'Recuerda que mañana puede ser mejor.'
    ]
  },
  enojo: {
    nombre: 'Enojo',
    color: '#f44339',
    emoji: '😠',
    gesto: 'ceño',
    mensajes: [
      'Has experimentado frustración hoy.',
      'El enojo es válido, aprende de él.',
      'Respira profundo y busca calma.'
    ]
  },
  calma: {
    nombre: 'Calma',
    color: '#62e85e',
    emoji: '😌',
    gesto: 'respiro',
    mensajes: [
      'La tranquilidad te acompaña.',
      'Has mantenido la serenidad.',
      'Tu paz interior se nota.'
    ]
  },
  miedo: {
    nombre: 'Miedo',
    color: '#9746d5',
    emoji: '😨',
    gesto: 'temblor',
    mensajes: [
      'Hay inquietudes en tu mente.',
      'Es valiente reconocer tus miedos.',
      'No estás solo, pide apoyo si lo necesitas.'
    ]
  },
  nerviosismo: {
    nombre: 'Nerviosismo',
    color: '#FF9A76',
    emoji: '😰',
    gesto: 'nervios',
    mensajes: [
      'Los nervios han estado presentes.',
      'La ansiedad es temporal, respira.',
      'Paso a paso lograrás calmarte.'
    ]
  },
  desmotivacion: {
    nombre: 'Desmotivación',
    color: '#6b698c',
    emoji: '😔',
    gesto: 'desanimo',
    mensajes: [
      'Te has sentido sin energía.',
      'Busca algo que te inspire de nuevo.',
      'Es temporal, volverás a motivarte.'
    ]
  },
  motivacion: {
    nombre: 'Motivación',
    color: '#9746d5',
    emoji: '🤩',
    gesto: 'entusiasmo',
    mensajes: [
      '¡Tu motivación es contagiosa!',
      'Estás listo para lograr tus metas.',
      'Tu energía es imparable.'
    ]
  },
  inseguridad: {
    nombre: 'Inseguridad',
    color: '#c434a0',
    emoji: '😕',
    gesto: 'duda',
    mensajes: [
      'Has dudado de ti mismo.',
      'Eres más capaz de lo que crees.',
      'Confía en tu potencial.'
    ]
  }
};

/**
 * Clase para manejar el sistema de emociones
 */
class SistemaEmociones {
  
  constructor() {
    this.emociones = EMOCIONES;
  }

  /**
   * Obtiene la configuración de una emoción
   * @param {string} nombreEmocion - Nombre de la emoción
   * @returns {Object|null}
   */
  obtenerEmocion(nombreEmocion) {
    return this.emociones[nombreEmocion] || null;
  }

  /**
   * Obtiene el color de una emoción
   * @param {string} nombreEmocion
   * @returns {string}
   */
  obtenerColor(nombreEmocion) {
    const emocion = this.obtenerEmocion(nombreEmocion);
    return emocion ? emocion.color : '#cccccc';
  }

  /**
   * Obtiene el emoji de una emoción
   * @param {string} nombreEmocion
   * @returns {string}
   */
  obtenerEmoji(nombreEmocion) {
    const emocion = this.obtenerEmocion(nombreEmocion);
    return emocion ? emocion.emoji : '😐';
  }

  /**
   * Obtiene un mensaje aleatorio para una emoción
   * @param {string} nombreEmocion
   * @returns {string}
   */
  obtenerMensaje(nombreEmocion) {
    const emocion = this.obtenerEmocion(nombreEmocion);
    if (!emocion || !emocion.mensajes.length) {
      return 'Has completado el cuestionario.';
    }
    
    const indiceAleatorio = Math.floor(Math.random() * emocion.mensajes.length);
    return emocion.mensajes[indiceAleatorio];
  }

  /**
   * Cuenta las emociones en un array de respuestas
   * @param {Array} respuestas - Array de objetos con propiedad 'emocion'
   * @returns {Object} Objeto con conteo por emoción
   */
  contarEmociones(respuestas) {
    const conteo = {};
    
    console.log('🔍 Contando emociones...');
    console.log('Total de respuestas a contar:', respuestas.length);
    
    respuestas.forEach((respuesta, index) => {
      const emocion = respuesta.emocion;
      
      console.log(`  Respuesta ${index + 1}: emoción = "${emocion}"`);
      
      if (emocion) {
        conteo[emocion] = (conteo[emocion] || 0) + 1;
      } else {
        console.warn(`  ⚠️ Respuesta ${index + 1} no tiene emoción definida`);
      }
    });
    
    console.log('📊 Resultado del conteo:', conteo);
    return conteo;
  }

  /**
   * Calcula la emoción predominante
   * @param {Object} conteo - Objeto con conteo de emociones
   * @returns {string} Nombre de la emoción predominante
   */
  calcularPredominante(conteo) {
    if (Object.keys(conteo).length === 0) {
      return 'calma'; // Default
    }
    
    // Encontrar la emoción con mayor conteo
    let emocionPredominante = null;
    let maxConteo = 0;
    
    for (const [emocion, cantidad] of Object.entries(conteo)) {
      if (cantidad > maxConteo) {
        maxConteo = cantidad;
        emocionPredominante = emocion;
      }
    }
    
    return emocionPredominante;
  }

  /**
   * Genera un mensaje personalizado basado en las emociones
   * @param {Object} conteo - Conteo de emociones
   * @returns {string}
   */
  generarMensajeFinal(conteo) {
    const emocionPrincipal = this.calcularPredominante(conteo);
    const mensajeBase = this.obtenerMensaje(emocionPrincipal);
    const emoji = this.obtenerEmoji(emocionPrincipal);
    const nombre = this.emociones[emocionPrincipal].nombre;
    
    const totalRespuestas = Object.values(conteo).reduce((sum, val) => sum + val, 0);
    const porcentaje = Math.round((conteo[emocionPrincipal] / totalRespuestas) * 100);
    
    return `${emoji} ${mensajeBase}\n\nTu emoción predominante es ${nombre} (${porcentaje}% de tus respuestas).`;
  }

  /**
   * Obtiene todas las emociones disponibles
   * @returns {Array} Array de nombres de emociones
   */
  obtenerTodasLasEmociones() {
    return Object.keys(this.emociones);
  }

  /**
   * Genera datos para gráficos
   * @param {Object} conteo - Conteo de emociones
   * @returns {Array} Array de objetos para gráficos
   */
  generarDatosGrafico(conteo) {
    return Object.entries(conteo).map(([emocion, cantidad]) => ({
      emocion: this.emociones[emocion].nombre,
      cantidad: cantidad,
      color: this.obtenerColor(emocion),
      emoji: this.obtenerEmoji(emocion)
    }));
  }
}

// ==================== INSTANCIA GLOBAL ====================
const sistemaEmociones = new SistemaEmociones();

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  window.SistemaEmociones = sistemaEmociones;
}

console.log('🎭 Sistema de emociones inicializado');