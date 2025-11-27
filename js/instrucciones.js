// ============================================
// INSTRUCCIONES.JS - EmotiQuest
// Lógica de la página de instrucciones
// ============================================

console.log('🚀 instrucciones.js cargado');

// Referencias del DOM
const greetingName = document.getElementById('greeting-name');
const btnVolver = document.getElementById('btn-volver');
const btnComenzar = document.getElementById('btn-comenzar');

/**
 * Inicialización
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('📋 DOM cargado');
  
  // Verificar que storage.js está cargado
  if (!window.EmotiQuestStorage) {
    console.error('❌ storage.js NO está cargado');
    alert('Error: Sistema de almacenamiento no disponible. Recarga la página.');
    return;
  }
  
  console.log('✅ storage.js disponible');
  
  // Cargar datos del usuario
  cargarDatosUsuario();
  
  // Configurar eventos de botones
  configurarEventos();
  
  // Animaciones de entrada
  aplicarAnimacionesEntrada();
});

/**
 * Carga los datos del usuario actual
 */
function cargarDatosUsuario() {
  try {
    const sesion = window.EmotiQuestStorage.obtenerSesionActual();
    
    if (sesion && sesion.nombre) {
      greetingName.textContent = `¡Perfecto, ${sesion.nombre}!`;
      console.log('✅ Usuario:', sesion.nombre);
    } else {
      greetingName.textContent = '¡Perfecto!';
      console.log('⚠️ No hay sesión activa');
    }
  } catch (error) {
    console.error('❌ Error al cargar datos:', error);
    greetingName.textContent = '¡Perfecto!';
  }
}

/**
 * Configura los event listeners de los botones
 */
function configurarEventos() {
  if (btnVolver) {
    btnVolver.addEventListener('click', volverAlInicio);
  }
  
  if (btnComenzar) {
    btnComenzar.addEventListener('click', comenzarCuestionario);
  }
  
  console.log('✅ Eventos configurados');
}

/**
 * Vuelve a la página de inicio
 */
function volverAlInicio() {
  console.log('🔙 Volviendo al inicio...');
  
  // Mostrar confirmación
  const confirmar = confirm('¿Deseas volver al inicio? Se perderán los datos actuales.');
  
  if (confirmar) {
    // Limpiar sesión actual
    try {
      window.EmotiQuestStorage.limpiarSesionActual();
      console.log('🧹 Sesión limpiada');
    } catch (error) {
      console.error('❌ Error al limpiar sesión:', error);
    }
    
    // Redirigir
    window.location.href = './index.html';
  }
}

/**
 * Comienza el cuestionario
 */
function comenzarCuestionario() {
  console.log('🚀 Iniciando cuestionario...');
  
  // Verificar que hay sesión activa
  const sesion = window.EmotiQuestStorage.obtenerSesionActual();
  
  if (!sesion) {
    console.error('❌ No hay sesión activa');
    alert('Error: No hay sesión activa. Por favor, vuelve al inicio y completa el registro.');
    window.location.href = './index.html';
    return;
  }
  
  // Mostrar mensaje de carga
  mostrarMensajeCarga();
  
  // Redirigir después de un momento
  setTimeout(() => {
    window.location.href = './cuestionario.html';
  }, 800);
}

/**
 * Muestra un mensaje de carga
 */
function mostrarMensajeCarga() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
  `;
  
  const mensaje = document.createElement('div');
  mensaje.style.cssText = `
    background: linear-gradient(135deg, #d180fd, #fde895);
    color: white;
    padding: 2.5rem 3rem;
    border-radius: 25px;
    font-size: 1.3rem;
    font-weight: 700;
    text-align: center;
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
    animation: scaleIn 0.5s ease;
  `;
  
  mensaje.innerHTML = `
    <div style="font-size: 4rem; margin-bottom: 1rem; animation: bounce 1s infinite;">🎨</div>
    <div>Preparando el cuestionario...</div>
  `;
  
  overlay.appendChild(mensaje);
  document.body.appendChild(overlay);
  
  // Agregar animaciones CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { transform: scale(0.5); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
  `;
  document.head.appendChild(style);
  
  console.log('✅ Mensaje de carga mostrado');
}

/**
 * Aplica animaciones de entrada a las emociones
 */
function aplicarAnimacionesEntrada() {
  const emocionItems = document.querySelectorAll('.emocion-item');
  
  emocionItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      item.style.transition = 'all 0.5s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100 * index);
  });
  
  console.log('✅ Animaciones aplicadas');
}

console.log('✅ instrucciones.js configurado correctamente');