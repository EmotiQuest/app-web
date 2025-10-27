// ============================================
// RESULTADO.JS - Lógica de resultados
// ============================================

// Variables globales
let sesion = null;
let respuestas = [];
let conteoEmociones = {};
let emocionPredominante = '';

// Referencias del DOM
const seccionBatidos = document.getElementById('seccion-batidos');
const seccionLicuadora = document.getElementById('seccion-licuadora');
const seccionAvatar = document.getElementById('seccion-avatar');

const batidosGrid = document.getElementById('batidos-grid');
const licuadoraContenido = document.getElementById('licuadora-contenido');
const avatar = document.getElementById('avatar');
const emocionBadge = document.getElementById('emocion-badge');
const mensajeFinal = document.getElementById('mensaje-final');
const estadisticas = document.getElementById('estadisticas');

const btnMezclar = document.getElementById('btn-mezclar');
const btnVerReporte = document.getElementById('btn-ver-reporte');
const btnVolverInicio = document.getElementById('btn-volver-inicio');

/**
 * Inicializa la página de resultados
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎉 Inicializando página de resultados...');
  
  // Verificar datos necesarios
  if (!verificarDatos()) {
    return;
  }
  
  // Calcular emociones
  calcularResultados();
  
  // Mostrar batidos iniciales
  mostrarBatidos();
  
  // Configurar controles
  configurarControles();
  
  // Aplicar animación de entrada
  aplicarAnimacionEntrada();
});

/**
 * Verifica que existan los datos necesarios
 * @returns {boolean}
 */
function verificarDatos() {
  if (!window.EmotiQuestStorage || !window.SistemaEmociones) {
    console.error('❌ Sistemas no disponibles');
    alert('Error del sistema. Redirigiendo al inicio...');
    window.location.href = './index.html';
    return false;
  }
  
  sesion = window.EmotiQuestStorage.obtenerSesionActual();
  respuestas = window.EmotiQuestStorage.obtenerRespuestas();
  
  if (!sesion || !respuestas || respuestas.length === 0) {
    alert('No hay datos de respuestas. Por favor, completa el cuestionario primero.');
    window.location.href = './index.html';
    return false;
  }
  
  console.log('✅ Datos verificados:', respuestas.length, 'respuestas');
  return true;
}

/**
 * Calcula los resultados de las emociones
 */
function calcularResultados() {
  conteoEmociones = window.SistemaEmociones.contarEmociones(respuestas);
  emocionPredominante = window.SistemaEmociones.calcularPredominante(conteoEmociones);
  
  console.log('📊 Conteo de emociones:', conteoEmociones);
  console.log('🎯 Emoción predominante:', emocionPredominante);
}

/**
 * Muestra los batidos individuales
 */
function mostrarBatidos() {
  batidosGrid.innerHTML = '';
  
  // Crear un batido por cada respuesta
  respuestas.forEach((respuesta, index) => {
    const emocion = respuesta.emocion;
    const color = window.SistemaEmociones.obtenerColor(emocion);
    const emoji = window.SistemaEmociones.obtenerEmoji(emocion);
    
    const batido = document.createElement('div');
    batido.className = 'batido';
    batido.style.background = color; // Color de la emoción
    batido.style.animationDelay = `${index * 0.1}s`;
    
    // Crear tapa de la botella
    const tapa = document.createElement('div');
    tapa.className = 'tapa-botella';
    
    // Crear emoji
    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'batido-emoji';
    emojiSpan.textContent = emoji;
    
    batido.appendChild(tapa);
    batido.appendChild(emojiSpan);
    batidosGrid.appendChild(batido);
  });
  
  console.log('✅ Batidos mostrados:', respuestas.length);
}

/**
 * Configura los controles de navegación
 */
function configurarControles() {
  btnMezclar.addEventListener('click', iniciarMezcla);
  btnVerReporte.addEventListener('click', () => {
    window.location.href = './admin.html';
  });
  btnVolverInicio.addEventListener('click', () => {
    // Limpiar sesión actual
    if (window.EmotiQuestStorage) {
      window.EmotiQuestStorage.limpiarSesionActual();
      window.EmotiQuestStorage.limpiarRespuestas();
    }
    window.location.href = './index.html';
  });
}

/**
 * Inicia el proceso de mezcla
 */
function iniciarMezcla() {
  console.log('🔄 Iniciando mezcla...');
  
  // Transición a licuadora
  cambiarSeccion(seccionBatidos, seccionLicuadora);
  
  // Animar batidos cayendo a la licuadora
  setTimeout(() => {
    animarBatidosALicuadora();
  }, 500);
  
  // Activar licuadora
  setTimeout(() => {
    activarLicuadora();
  }, 2000);
  
  // Mostrar resultado final
  setTimeout(() => {
    mostrarResultadoFinal();
  }, 5000);
}

/**
 * Anima los batidos cayendo a la licuadora
 */
function animarBatidosALicuadora() {
  licuadoraContenido.innerHTML = '';
  
  // Agregar colores de las emociones
  Object.entries(conteoEmociones).forEach(([emocion, cantidad], index) => {
    const color = window.SistemaEmociones.obtenerColor(emocion);
    
    for (let i = 0; i < cantidad; i++) {
      const capa = document.createElement('div');
      capa.className = 'licuadora-capa';
      capa.style.background = color;
      capa.style.animationDelay = `${index * 0.2 + i * 0.1}s`;
      licuadoraContenido.appendChild(capa);
    }
  });
  
  console.log('✅ Batidos vertidos en licuadora');
}

/**
 * Activa la animación de la licuadora
 */
function activarLicuadora() {
  const licuadora = document.getElementById('licuadora');
  licuadora.classList.add('mezclando');
  
  console.log('🌀 Licuadora activada');
}

/**
 * Muestra el resultado final con avatar
 */
function mostrarResultadoFinal() {
  console.log('🎭 Mostrando resultado final...');
  
  // Transición a avatar
  cambiarSeccion(seccionLicuadora, seccionAvatar);
  
  // Generar avatar
  generarAvatar();
  
  // Mostrar badge de emoción
  mostrarBadgeEmocion();
  
  // Mostrar mensaje personalizado
  mostrarMensajeFinal();
  
  // Mostrar estadísticas
  mostrarEstadisticas();
}

/**
 * Genera el avatar según género y emoción
 */
function generarAvatar() {
  const genero = sesion.genero;
  const emoji = window.SistemaEmociones.obtenerEmoji(emocionPredominante);
  const color = window.SistemaEmociones.obtenerColor(emocionPredominante);
  
  // Crear avatar simple con emoji gigante
  avatar.innerHTML = `
    <div class="avatar-circle" style="border-color: ${color}">
      <span class="avatar-emoji">${emoji}</span>
    </div>
    <div class="avatar-label">${genero === 'masculino' ? '👦' : genero === 'femenino' ? '👧' : '🧑'}</div>
  `;
  
  // Animar entrada
  avatar.style.animation = 'zoomIn 0.8s ease';
  
  console.log('✅ Avatar generado');
}

/**
 * Muestra el badge de emoción predominante
 */
function mostrarBadgeEmocion() {
  const emocion = window.SistemaEmociones.obtenerEmocion(emocionPredominante);
  const color = window.SistemaEmociones.obtenerColor(emocionPredominante);
  
  emocionBadge.innerHTML = `
    <span class="badge-emoji">${emocion.emoji}</span>
    <span class="badge-texto">${emocion.nombre}</span>
  `;
  emocionBadge.style.background = color;
  emocionBadge.style.animation = 'slideInDown 0.6s ease 0.3s backwards';
  
  console.log('✅ Badge mostrado');
}

/**
 * Muestra el mensaje personalizado
 */
function mostrarMensajeFinal() {
  const mensaje = window.SistemaEmociones.generarMensajeFinal(conteoEmociones);
  
  mensajeFinal.innerHTML = `
    <p class="mensaje-principal">${mensaje}</p>
    <p class="mensaje-secundario">¡Gracias por compartir tus emociones, ${sesion.nombre}!</p>
  `;
  mensajeFinal.style.animation = 'fadeIn 0.8s ease 0.5s backwards';
  
  console.log('✅ Mensaje mostrado');
}

/**
 * Muestra las estadísticas de emociones (SIN PORCENTAJES)
 */
function mostrarEstadisticas() {
  const totalRespuestas = respuestas.length;
  const datosGrafico = window.SistemaEmociones.generarDatosGrafico(conteoEmociones);
  
  let html = '<h3 class="stats-title">Tus emociones del día</h3>';
  html += '<div class="stats-grid">';
  
  datosGrafico.forEach(dato => {
    // Mostrar solo emoji y nombre, SIN porcentaje ni barra
    html += `
      <div class="stat-item-simple">
        <span class="stat-emoji">${dato.emoji}</span>
        <span class="stat-nombre">${dato.emocion}</span>
        <span class="stat-cantidad">${dato.cantidad} ${dato.cantidad === 1 ? 'vez' : 'veces'}</span>
      </div>
    `;
  });
  
  html += '</div>';
  estadisticas.innerHTML = html;
  estadisticas.style.animation = 'fadeIn 1s ease 0.7s backwards';
  
  console.log('✅ Estadísticas mostradas (sin porcentajes)');
}

/**
 * Cambia entre secciones con animación
 * @param {HTMLElement} saliente - Sección a ocultar
 * @param {HTMLElement} entrante - Sección a mostrar
 */
function cambiarSeccion(saliente, entrante) {
  // Ocultar sección actual
  saliente.style.animation = 'fadeOut 0.5s ease';
  
  setTimeout(() => {
    saliente.classList.remove('visible');
    saliente.classList.add('hidden');
    
    // Mostrar nueva sección
    entrante.classList.remove('hidden');
    entrante.classList.add('visible');
    entrante.style.animation = 'fadeIn 0.5s ease';
  }, 500);
}

/**
 * Aplica animación de entrada a la página
 */
function aplicarAnimacionEntrada() {
  const container = document.querySelector('.resultado-container');
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

console.log('✅ resultado.js cargado correctamente');