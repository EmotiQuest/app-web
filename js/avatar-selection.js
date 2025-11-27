// ============================================
// AVATAR-SELECTION.JS - Selección de Avatar
// ============================================

console.log('🎨 avatar-selection.js cargado');

// ==================== CONFIGURACIÓN DE AVATARES ====================

/**
 * Lista de avatares disponibles por género
 * IMPORTANTE: Ajusta estas rutas según tus imágenes reales
 */
const AVATARES = {
  masculino: [
    { id: 'avatar-m1', ruta: './images/avatars/masculino/1.png', emoji: '🧒🏻' },
    { id: 'avatar-m2', ruta: './images/avatars/masculino/2.png', emoji: '👨🏿‍🦱' },
    { id: 'avatar-m3', ruta: './images/avatars/masculino/3.png', emoji: '🧑🏼‍🦰' },
    { id: 'avatar-m4', ruta: './images/avatars/masculino/4.png', emoji: '🧔🏾‍♂️' },
    { id: 'avatar-m5', ruta: './images/avatars/masculino/5.png', emoji: '👦🏻' },
    { id: 'avatar-m6', ruta: './images/avatars/masculino/6.png', emoji: '👨🏽' },
    { id: 'avatar-m7', ruta: './images/avatars/masculino/7.png', emoji: '🧔🏽' },
    { id: 'avatar-m8', ruta: './images/avatars/masculino/8.png', emoji: '👨🏻' },
  ],
  femenino: [
    { id: 'avatar-f1', ruta: './images/avatars/femenino/1.png', emoji: '👧🏻' },
    { id: 'avatar-f2', ruta: './images/avatars/femenino/2.png', emoji: '👩🏼' },
    { id: 'avatar-f3', ruta: './images/avatars/femenino/3.png', emoji: '👩🏿‍🦱' },
    { id: 'avatar-f4', ruta: './images/avatars/femenino/4.png', emoji: '👩🏽' },
    { id: 'avatar-f5', ruta: './images/avatars/femenino/5.png', emoji: '👩🏼‍🦰' },
    { id: 'avatar-f6', ruta: './images/avatars/femenino/6.png', emoji: '👧🏾' },
  ],
  pnd:[
    { id: 'avatar-neutro', ruta: './images/avatars/pnd/n1.png', emoji: '🧑🏽' },
    { id: 'avatar-neutro2', ruta: './images/avatars/pnd/n2.png', emoji: '🧑🏽‍🦰' },
    { id: 'avatar-neutro3', ruta: './images/avatars/pnd/n3.png', emoji: '🧑🏾‍🦱' },
    { id: 'avatar-neutro4', ruta: './images/avatars/pnd/n4.png', emoji: '👱🏼' },
    { id: 'avatar-neutro5', ruta: './images/avatars/pnd/n5.png', emoji: '🧑🏻‍🦲' },
    { id: 'avatar-neutro6', ruta: './images/avatars/pnd/n6.png', emoji: '🧑🏼‍🦰' },
    { id: 'avatar-neutro7', ruta: './images/avatars/pnd/n7.png', emoji: '🧓🏼' },
    { id: 'avatar-neutro8', ruta: './images/avatars/pnd/n8.png', emoji: '👱🏽' },
  ]
};

// ==================== VARIABLES GLOBALES ====================

let sesion = null;
let avatarSeleccionado = null;
let usarEmojis = false; // Cambiar a false cuando tengas imágenes reales

// Referencias del DOM
const greetingName = document.getElementById('greeting-name');
const avatarsGrid = document.getElementById('avatars-grid');
const selectedPreview = document.getElementById('selected-preview');
const previewImage = document.getElementById('preview-image');
const btnVolver = document.getElementById('btn-volver');
const btnContinuar = document.getElementById('btn-continuar');

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Inicializando selección de avatar...');
  
  // Verificar que storage.js está cargado
  if (!window.EmotiQuestStorage) {
    console.error('❌ storage.js NO está cargado');
    alert('Error del sistema. Redirigiendo al inicio...');
    window.location.href = './index.html';
    return;
  }
  
  // Verificar sesión
  if (!verificarSesion()) {
    return;
  }
  
  // Mostrar saludo personalizado
  mostrarSaludo();
  
  // Generar grid de avatares
  generarAvatares();
  
  // Configurar event listeners
  configurarEventos();
  
  console.log('✅ Selección de avatar inicializada');
});

// ==================== VERIFICACIÓN DE SESIÓN ====================

/**
 * Verifica que existe una sesión activa
 */
function verificarSesion() {
  console.log('🔍 Verificando sesión...');
  
  sesion = obtenerSesionActual();
  
  if (!sesion) {
    console.error('❌ No hay sesión activa');
    alert('No hay sesión activa. Por favor, inicia sesión primero.');
    window.location.href = './index.html';
    return false;
  }
  
  console.log('✅ Sesión verificada:', sesion.id);
  console.log('👤 Género:', sesion.genero);
  return true;
}

// ==================== MOSTRAR SALUDO ====================

/**
 * Muestra el saludo personalizado con el nombre del usuario
 */
function mostrarSaludo() {
  if (sesion && sesion.nombre) {
    greetingName.textContent = `¡Hola, ${sesion.nombre}!`;
  }
}

// ==================== GENERAR AVATARES ====================

/**
 * Genera el grid de avatares según el género del usuario
 */
function generarAvatares() {
  console.log('🎨 Generando avatares...');
  
  const genero = sesion.genero;
  const avatares = AVATARES[genero];
  
  if (!avatares || avatares.length === 0) {
    console.error('❌ No hay avatares para este género');
    alert('Error al cargar avatares. Redirigiendo...');
    window.location.href = './index.html';
    return;
  }
  
  // Limpiar grid
  avatarsGrid.innerHTML = '';
  
  // Generar cada avatar
  avatares.forEach((avatar, index) => {
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar-option';
    avatarDiv.dataset.avatarId = avatar.id;
    avatarDiv.dataset.avatarRuta = avatar.ruta;
    avatarDiv.dataset.avatarEmoji = avatar.emoji;
    
    // Crear círculo del avatar
    const circle = document.createElement('div');
    circle.className = 'avatar-circle';
    
    if (usarEmojis) {
      // TEMPORAL: Usar emojis mientras no tengas imágenes
      const emoji = document.createElement('span');
      emoji.className = 'avatar-emoji';
      emoji.textContent = avatar.emoji;
      circle.appendChild(emoji);
    } else {
      // Usar imágenes reales
      const img = document.createElement('img');
      img.src = avatar.ruta;
      img.alt = avatar.id;
      img.onerror = function() {
        // Si la imagen falla, usar emoji
        console.warn(`⚠️ Imagen no encontrada: ${avatar.ruta}, usando emoji`);
        this.parentElement.innerHTML = `<span class="avatar-emoji">${avatar.emoji}</span>`;
      };
      circle.appendChild(img);
    }
    
    avatarDiv.appendChild(circle);
    
    // Event listener para selección
    avatarDiv.addEventListener('click', () => seleccionarAvatar(avatar, avatarDiv));
    
    avatarsGrid.appendChild(avatarDiv);
  });
  
  console.log(`✅ ${avatares.length} avatares generados`);
}

// ==================== SELECCIONAR AVATAR ====================

/**
 * Maneja la selección de un avatar
 */
function seleccionarAvatar(avatar, avatarDiv) {
  console.log('🎯 Avatar seleccionado:', avatar.id);
  
  // Remover selección anterior
  document.querySelectorAll('.avatar-option').forEach(option => {
    option.classList.remove('selected');
  });
  
  // Marcar como seleccionado
  avatarDiv.classList.add('selected');
  
  // Guardar avatar seleccionado
  avatarSeleccionado = avatar;
  
  // Mostrar preview
  mostrarPreview(avatar);
  
  // Habilitar botón continuar
  btnContinuar.disabled = false;
}

// ==================== MOSTRAR PREVIEW ====================

/**
 * Muestra el preview del avatar seleccionado
 */
function mostrarPreview(avatar) {
  if (usarEmojis) {
    // Usar emoji en preview
    previewImage.outerHTML = `<span class="avatar-emoji" style="font-size: 4rem;">${avatar.emoji}</span>`;
  } else {
    // Usar imagen en preview
    previewImage.src = avatar.ruta;
    previewImage.alt = avatar.id;
  }
  
  selectedPreview.classList.remove('hidden');
  selectedPreview.style.animation = 'fadeInUp 0.5s ease';
}

// ==================== CONFIGURAR EVENTOS ====================

/**
 * Configura los event listeners de los botones
 */
function configurarEventos() {
  btnVolver.addEventListener('click', volverAlLogin);
  btnContinuar.addEventListener('click', continuarAlCuestionario);
}

// ==================== VOLVER AL LOGIN ====================

/**
 * Vuelve a la página de login
 */
function volverAlLogin() {
  console.log('⬅️ Volviendo al login...');
  
  const confirmar = confirm('¿Deseas volver al inicio y cambiar tus datos?');
  
  if (confirmar) {
    // Limpiar sesión actual
    limpiarSesionActual();
    window.location.href = './index.html';
  }
}

// ==================== CONTINUAR AL CUESTIONARIO ====================

/**
 * Guarda el avatar seleccionado y continúa al cuestionario
 */
function continuarAlCuestionario() {
  console.log('✅ Guardando avatar y continuando...');
  
  if (!avatarSeleccionado) {
    alert('Por favor, selecciona un avatar');
    return;
  }
  
  // Guardar avatar en la sesión
  sesion.avatar = avatarSeleccionado;
  
  const guardado = guardarSesionActual(sesion);
  
  if (!guardado) {
    console.error('❌ Error al guardar avatar');
    alert('Error al guardar. Intenta de nuevo.');
    return;
  }
  
  console.log('✅ Avatar guardado:', avatarSeleccionado);
  
  // Mostrar animación de transición
  mostrarAnimacionTransicion();
  
  // Redirigir a cuestionario
  setTimeout(() => {
    redirigirACuestionario();
  }, 800);
}

// ==================== ANIMACIÓN DE TRANSICIÓN ====================

/**
 * Muestra una animación durante la transición
 */
function mostrarAnimacionTransicion() {
  const card = document.querySelector('.avatar-selection-card');
  if (card) {
    card.style.transition = 'all 0.5s ease';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
  }
}

// ==================== REDIRIGIR A CUESTIONARIO ====================

/**
 * Redirige a la página del cuestionario
 */
function redirigirACuestionario() {
  console.log('🚀 Redirigiendo a cuestionario...');
  
  // Detectar si estamos en GitHub Pages
  const hostname = window.location.hostname;
  const esGitHubPages = hostname.includes('github.io');
  
  let urlCuestionario;
  
  if (esGitHubPages) {
    const pathParts = window.location.pathname.split('/');
    pathParts.pop();
    const basePath = pathParts.join('/') || '';
    urlCuestionario = `${basePath}/cuestionario.html`;
  } else {
    urlCuestionario = './cuestionario.html';
  }
  
  console.log('🎯 URL destino:', urlCuestionario);
  window.location.href = urlCuestionario;
}

// ==================== LOG FINAL ====================

console.log('✅ avatar-selection.js configurado correctamente');