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
    color: '#e1c83cff',
    emoji: '😊',
    gesto: 'sonrisa',
    mensajes: [

      'Tu energía mueve montañas',
      'Tienes una energía que ilumina todo a tu alrededor',
      'Tu alegría ilumina el día; deja que esa energía positiva te acompañe y contagie a quienes te rodean.'
    ]
  },
  tristeza: {
    nombre: 'Tristeza',
    color: '#3e54aeff',
    emoji: '😢',
    gesto: 'puchero',
    mensajes: [
      'Hoy está bien no sentirse bien',
      'No tener claridad también es un paso hacia encontrarte',
      'Permítete sentir; incluso la tristeza trae consigo un pequeño acto de sanación.'
    ]
  },
  enojo: {
    nombre: 'Enojo',
    color: '#ee2c22ff',
    emoji: '😠',
    gesto: 'ceño',
    mensajes: [
      'El enojo es válido, aprende de él.',
      'Deja que tu enojo se transforme en energía que crea, no que destruye',
      'Esa intensidad que sientes no es carga, es poder: condúcela con sabiduría y te hará más fuerte'
    ]
  },
  calma: {
    nombre: 'Calma',
    color: '#4ee249ff',
    emoji: '😌',
    gesto: 'respiro',
    mensajes: [
      
      'Tu paz interior es más fuerte que cualquier tormenta.',
      'Hacer una pausa también es seguir, solo con más calma',
      'Esa calma interior te da luz para avanzar. Respira, fluye y confía en ti.'
    ]
  },
  miedo: {
    nombre: 'Miedo',
    color: '#943ad8ff',
    emoji: '😨',
    gesto: 'temblor',
    mensajes: [
      'Lo que sientes es real, pero no manda sobre ti.',
      'Puedes avanzar incluso con miedo; cada paso cuenta.',
    'El miedo no es un freno, es una señal. Escúchalo sin dejar que decida por ti; dentro de ti hay más fuerza de la que imaginas.'
    ]
  },
  nerviosismo: {
    nombre: 'Nerviosismo',
    color: '#f06e3eff',
    emoji: '😰',
    gesto: 'nervios',
    mensajes: [
      
      'Respira profundo, estás haciendo lo mejor que puedes',
      'Detente un momento y respira; vas bien, incluso si no lo parece',
      'Reconocer tu ansiedad es un gesto valiente; recuerda que no te define. Poco a poco, todo se equilibra'
    ]
  },
  desmotivacion: {
    nombre: 'Desmotivación',
    color: '#6b698c',
    emoji: '😔',
    gesto: 'desanimo',
    mensajes: [
    
      'Hacer una pausa también es seguir, solo con más calma',
      'A veces la desmotivación solo te susurra que es momento de cambiar el ritmo.',
      'La desmotivación no siempre es pérdida; a veces es el inicio de un nuevo rumbo'
    ]
  },
  motivacion: {
    nombre: 'Motivación',
    color: '#38d5c6ff',
    emoji: '🤩',
    gesto: 'entusiasmo',
    mensajes: [
     
      'Tu energía mueve montañas',
      'Tienes una energía que ilumina todo a tu alrededor',
      'Que la chispa que hoy te mueve también ilumine a quienes te rodean'
    ]
  },
  inseguridad: {
    nombre: 'Inseguridad',
    color: '#c434a0',
    emoji: '😕',
    gesto: 'duda',
    mensajes: [
      'No tener claridad también es un paso hacia encontrarte',
      'Sentir de todo es normal, cada emoción tiene su razón',
      'Entre dudas también hay claridad; cada una te acerca un poco más a ti.'
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