// ============================================
// RESULTADO.JS - Lógica de resultados
// MODIFICADO: Soporta avatares personalizados
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
 * Inicializa la página
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎉 === PÁGINA DE RESULTADOS INICIADA ===');
  
  // 1. Verificar datos
  if (!verificarDatos()) {
    return;
  }
  
  // 2. Calcular resultados
  calcularResultados();
  
  // 3. GUARDAR SESIÓN INMEDIATAMENTE
  guardarSesionInmediatamente();
  
  // 4. Mostrar batidos
  mostrarBatidos();
  
  // 5. Configurar controles
  configurarControles();
  
  // 6. Animación
  aplicarAnimacionEntrada();
  console.log('✅ === INICIALIZACIÓN COMPLETA ===');
});

/**
 * Verifica que existan datos
 */
function verificarDatos() {
  console.log('🔍 Verificando datos...');
  
  // Verificar SistemaEmociones
  if (!window.SistemaEmociones) {
    console.error('❌ SistemaEmociones no disponible');
    alert('Error del sistema. Redirigiendo...');
    window.location.href = './index.html';
    return false;
  }
  
  // Obtener sesión actual
  sesion = obtenerSesionActual();
  
  if (!sesion) {
    console.error('❌ No hay sesión actual');
    alert('No hay datos de sesión. Por favor, completa el cuestionario primero.');
    window.location.href = './index.html';
    return false;
  }
  
  console.log('📋 Sesión cargada:', sesion.id);
  
  // Obtener respuestas
  respuestas = sesion.respuestas || [];
  
  if (respuestas.length === 0) {
    console.error('❌ No hay respuestas');
    alert('No hay respuestas. Por favor, completa el cuestionario primero.');
    window.location.href = './cuestionario.html';
    return false;
  }
  
  console.log('✅ Respuestas:', respuestas.length);
  return true;
}

/**
 * Calcula los resultados
 */
function calcularResultados() {
  console.log('📊 Calculando resultados...');
  
  // Contar emociones
  conteoEmociones = {};
  respuestas.forEach(respuesta => {
    const emocion = respuesta.emocion;
    conteoEmociones[emocion] = (conteoEmociones[emocion] || 0) + 1;
  });
  
  console.log('📊 Conteo:', conteoEmociones);
  
  // Calcular predominante
  let maxConteo = 0;
  let emocionMax = null;
  
  for (const [emocion, conteo] of Object.entries(conteoEmociones)) {
    if (conteo > maxConteo) {
      maxConteo = conteo;
      emocionMax = emocion;
    }
  }
  
  emocionPredominante = emocionMax;
  
  console.log('🎯 Emoción predominante:', emocionPredominante);
  
  // Actualizar sesión
  sesion.emocionPredominante = emocionPredominante;
  sesion.distribucionEmociones = conteoEmociones;
  sesion.completada = true;
  sesion.fechaCompletado = new Date().toISOString();
}

/**
 * GUARDA LA SESIÓN INMEDIATAMENTE
 * ESTA ES LA FUNCIÓN MÁS IMPORTANTE
 */
function guardarSesionInmediatamente() {
  console.log('💾 === GUARDANDO SESIÓN ===');
  console.log('📋 Sesión a guardar:', sesion);
  
  try {
    // Validar datos mínimos
    if (!sesion.id) {
      console.error('❌ Falta ID de sesión');
      return false;
    }
    
    if (!sesion.emocionPredominante) {
      console.error('❌ Falta emoción predominante');
      return false;
    }
    
    // GUARDAR CON LA FUNCIÓN GLOBAL
    const guardado = guardarSesionCompletada(sesion);
    
    if (guardado) {
      console.log('✅ ========================================');
      console.log('✅ SESIÓN GUARDADA EXITOSAMENTE');
      console.log('✅ ========================================');
      console.log('📊 ID:', sesion.id);
      console.log('😊 Emoción:', sesion.emocionPredominante);
      console.log('📝 Respuestas:', sesion.respuestas.length);
      console.log('📅 Fecha:', sesion.fecha);
      
      // VERIFICAR QUE SE GUARDÓ
      const todasSesiones = obtenerTodasLasSesiones();
      console.log('📈 TOTAL DE SESIONES EN LOCALSTORAGE:', todasSesiones.length);
      
      // Buscar esta sesión específica
      const sesionGuardada = todasSesiones.find(s => s.id === sesion.id);
      if (sesionGuardada) {
        console.log('✅ VERIFICACIÓN: Sesión encontrada en localStorage');
      } else {
        console.error('❌ VERIFICACIÓN FALLIDA: Sesión NO encontrada');
      }
      
      return true;
    } else {
      console.error('❌ ========================================');
      console.error('❌ ERROR AL GUARDAR SESIÓN');
      console.error('❌ ========================================');
      return false;
    }
  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ ERROR CRÍTICO:', error);
    console.error('❌ ========================================');
    return false;
  }
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
    
    // Crear reflejo brillante para efecto 3D
    const reflejo = document.createElement('div');
    reflejo.className = 'reflejo-botella';
    // Crear emoji
    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'batido-emoji';
    emojiSpan.textContent = emoji;
    
     // Agregar elementos en orden correcto
    batido.appendChild(tapa);
    batido.appendChild(reflejo);
    batido.appendChild(emojiSpan);
    batidosGrid.appendChild(batido);
  });
  
  console.log('✅ Batidos mostrados:', respuestas.length);
}
//Configura los controles
function configurarControles() {
  btnMezclar.addEventListener('click', iniciarMezcla);
  
  if (btnVerReporte) {
    btnVerReporte.addEventListener('click', () => {
      window.location.href = './admin.html';
    });
  }
  
  btnVolverInicio.addEventListener('click', () => {
    // Limpiar sesión actual (ya está guardada)
    limpiarSesionActual();
    window.location.href = './index.html';
  });
}

/**
 * Inicia la mezcla
 */
function iniciarMezcla() {
  console.log('🔄 Iniciando mezcla...');
  
  cambiarSeccion(seccionBatidos, seccionLicuadora);
  
  setTimeout(() => {
    animarBatidosALicuadora();
  }, 500);
  
  setTimeout(() => {
    activarLicuadora();
  }, 2000);
  
  setTimeout(() => {
    mostrarResultadoFinal();
  }, 5000);
}

/**
 * Anima batidos cayendo
 */
function animarBatidosALicuadora() {
  licuadoraContenido.innerHTML = '';
  
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
}

/**
 * Activa licuadora
 */
function activarLicuadora() {
  const licuadora = document.getElementById('licuadora');
  if (licuadora) {
    licuadora.classList.add('mezclando');
  }
}

/**
 * Muestra resultado final
 */
function mostrarResultadoFinal() {
  cambiarSeccion(seccionLicuadora, seccionAvatar);
  
  generarAvatar();
  mostrarBadgeEmocion();
  mostrarMensajeFinal();
  mostrarEstadisticas();
}

/**
 * Genera avatar con soporte para avatares personalizados
 * El avatar personalizado REEMPLAZA el emoji de género (👦 👧 🧑)
 * NO reemplaza el emoji de emoción (😊 😢 😠)
 */
function generarAvatar() {
  const emojiEmocion = window.SistemaEmociones.obtenerEmoji(emocionPredominante);
  const color = window.SistemaEmociones.obtenerColor(emocionPredominante);
  
  // Siempre mostrar el emoji de emoción en el círculo principal
  let avatarHTML = `
    <div class="avatar-circle" style="border-color: ${color}">
      <span class="avatar-emoji">${emojiEmocion}</span>
    </div>
  `;
  
  // Verificar si el usuario tiene avatar personalizado
  if (sesion.avatar) {
    console.log('🎨 Usando avatar personalizado:', sesion.avatar);
    
    // El avatar personalizado va en la etiqueta (debajo del círculo)
    if (sesion.avatar.ruta) {
      // Si tiene ruta de imagen, usar imagen en la etiqueta
      avatarHTML += `
        <div class="avatar-label" style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid ${color};">
            <img src="${sesion.avatar.ruta}" 
                 alt="Avatar" 
                 style="width: 100%; height: 100%; object-fit: cover;" 
                 onerror="this.outerHTML='<span style=\\'font-size: 2rem;\\'>${sesion.avatar.emoji || '😊'}</span>'">
          </div>
        </div>
      `;
    } 
    // Si solo tiene emoji, usar emoji en la etiqueta
    else if (sesion.avatar.emoji) {
      avatarHTML += `
        <div class="avatar-label" style="font-size: 2rem;">
          ${sesion.avatar.emoji}
        </div>
      `;
    }
    // Fallback: usar emoji de género predeterminado
    else {
      const generoEmoji = sesion.genero === 'masculino' ? '👦' : sesion.genero === 'femenino' ? '👧' : '🧑';
      avatarHTML += `<div class="avatar-label">${generoEmoji}</div>`;
    }
    
  } else {
    // Fallback: usar emoji de género predeterminado (comportamiento original)
    console.log('ℹ️ Usuario sin avatar personalizado, usando emoji de género por defecto');
    
    const genero = sesion.genero;
    const generoEmoji = genero === 'masculino' ? '👦' : genero === 'femenino' ? '👧' : '🧑';
    
    avatarHTML += `<div class="avatar-label">${generoEmoji}</div>`;
  }
  
  avatar.innerHTML = avatarHTML;
  avatar.style.animation = 'zoomIn 0.8s ease';
} 


/**
 * Muestra badge
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
}

/**
 * Muestra mensaje
 */
function mostrarMensajeFinal() {
  const emocion = window.SistemaEmociones.obtenerEmocion(emocionPredominante);
  
  mensajeFinal.innerHTML = `
    <p class="mensaje-principal">${emocion.mensajes[0]}</p>
    <p class="mensaje-secundario">¡Gracias por compartir tus emociones, ${sesion.nombre}!</p>
  `;
  mensajeFinal.style.animation = 'fadeIn 0.8s ease 0.5s backwards';
}

/**
 * Muestra estadísticas
 */
function mostrarEstadisticas() {
  let html = '<h3 class="stats-title">Tus emociones del día</h3>';
  html += '<div class="stats-grid">';
  
  Object.entries(conteoEmociones).forEach(([emocionKey, cantidad]) => {
    const emocion = window.SistemaEmociones.obtenerEmocion(emocionKey);
    
    html += `
      <div class="stat-item-simple">
        <span class="stat-emoji">${emocion.emoji}</span>
        <span class="stat-nombre">${emocion.nombre}</span>
        <span class="stat-cantidad">${cantidad} ${cantidad === 1 ? 'vez' : 'veces'}</span>
      </div>
    `;
  });
  
  html += '</div>';
  estadisticas.innerHTML = html;
  estadisticas.style.animation = 'fadeIn 1s ease 0.7s backwards';
}

/**
 * Cambia entre secciones
 */
function cambiarSeccion(saliente, entrante) {
  saliente.style.animation = 'fadeOut 0.5s ease';
  
  setTimeout(() => {
    saliente.classList.remove('visible');
    saliente.classList.add('hidden');
    
    entrante.classList.remove('hidden');
    entrante.classList.add('visible');
    entrante.style.animation = 'fadeIn 0.5s ease';
  }, 500);
}

/**
 * Animación de entrada
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

// VERIFICACIÓN AUTOMÁTICA
setTimeout(() => {
  console.log('=== VERIFICACIÓN AUTOMÁTICA ===');
  console.log('Sesión actual:', sesion);
  console.log('Todas las sesiones:', obtenerTodasLasSesiones());
}, 3000);

console.log('✅ resultado.js cargado');