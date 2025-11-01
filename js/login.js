// ============================================
// LOGIN.JS - Lógica del formulario de login
// COMPATIBLE CON GITHUB PAGES
// MODIFICADO: Redirige a avatar-selection.html
// ============================================

console.log('🚀 login.js cargado');

// Referencias del DOM
const loginForm = document.getElementById('login-form');
const nombreInput = document.getElementById('nombre');
const generoInput = document.getElementById('genero');
const edadInput = document.getElementById('edad');
const gradoInput = document.getElementById('grado');
const errorMessage = document.getElementById('error-message');

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
  
  // Limpiar sesión anterior si existe
  limpiarSesionPrevia();
  
  // Configurar evento del formulario
  if (loginForm) {
    loginForm.addEventListener('submit', manejarEnvio);
    console.log('✅ Evento submit configurado');
  } else {
    console.error('❌ Formulario no encontrado');
  }
});

/**
 * Limpia cualquier sesión anterior
 */
function limpiarSesionPrevia() {
  try {
    window.EmotiQuestStorage.limpiarSesionActual();
    window.EmotiQuestStorage.limpiarRespuestas();
    console.log('🗑️ Sesión anterior limpiada');
  } catch (error) {
    console.error('❌ Error al limpiar sesión:', error);
  }
}

/**
 * Maneja el envío del formulario
 * @param {Event} e - Evento del formulario
 */
function manejarEnvio(e) {
  console.log('🔵 === INICIO manejarEnvio ===');
  e.preventDefault();
  
  // Limpiar errores previos
  limpiarErrores();
  
  // Obtener valores
  const datos = {
    nombre: nombreInput.value.trim(),
    genero: generoInput.value,
    edad: parseInt(edadInput.value),
    grado: gradoInput.value
  };
  
  console.log('📊 Datos obtenidos:', datos);
  
  // Validar
  if (!validarDatos(datos)) {
    console.log('❌ Validación fallida');
    return;
  }
  
  console.log('✅ Validación exitosa');
  
  // Guardar en localStorage
  try {
    const exito = window.EmotiQuestStorage.guardarSesionActual(datos);
    
    if (!exito) {
      throw new Error('guardarSesionActual retornó false');
    }
    
    console.log('✅ Sesión guardada correctamente');
    
    // Verificar que se guardó
    const sesionGuardada = window.EmotiQuestStorage.obtenerSesionActual();
    console.log('🔍 Verificación:', sesionGuardada);
    
    if (!sesionGuardada) {
      throw new Error('No se pudo verificar la sesión guardada');
    }
    
    // Redirigir (ahora a avatar-selection o cuestionario según género)
    redirigirSegunGenero();
    
  } catch (error) {
    console.error('❌ Error al guardar sesión:', error);
    mostrarError('Error al guardar la sesión. Por favor, intenta de nuevo.');
  }
  
  console.log('🔵 === FIN manejarEnvio ===');
}

/**
 * Valida los datos del formulario
 * @param {Object} datos
 * @returns {boolean}
 */
function validarDatos(datos) {
  console.log('🔍 Validando datos...');
  
  // Validar nombre
  if (!datos.nombre || datos.nombre.length < 2) {
    mostrarError('Por favor, ingresa tu nombre completo.');
    nombreInput.focus();
    return false;
  }
  
  // Validar género
  if (!datos.genero) {
    mostrarError('Por favor, selecciona tu género.');
    generoInput.focus();
    return false;
  }
  
  // Validar edad
  if (!datos.edad || datos.edad < 5 || datos.edad > 100) {
    mostrarError('Por favor, ingresa una edad válida (5-100 años).');
    edadInput.focus();
    return false;
  }
  
  // Validar grado
  if (!datos.grado) {
    mostrarError('Por favor, selecciona tu grado escolar.');
    gradoInput.focus();
    return false;
  }
  
  console.log('✅ Todos los datos válidos');
  return true;
}

/**
 * Redirige según el género seleccionado
 * - Si género es "pnd" (prefiero no decirlo) → cuestionario.html
 * - Si género es "masculino" o "femenino" → avatar-selection.html
 */
function redirigirSegunGenero() {
  console.log('🚀 Iniciando redirección según género...');
  
  const sesion = obtenerSesionActual();
  
  if (!sesion) {
    console.error('❌ No se pudo obtener sesión');
    alert('Error al obtener sesión. Intenta de nuevo.');
    return;
  }
  
  // Detectar si estamos en GitHub Pages
  const hostname = window.location.hostname;
  const esGitHubPages = hostname.includes('github.io');
  
  console.log('🌐 Hostname:', hostname);
  console.log('🌐 ¿Es GitHub Pages?', esGitHubPages);
  console.log('👤 Género del usuario:', sesion.genero);
  
  // Determinar página destino
  let paginaDestino;
  
  if (sesion.genero === 'pnd') {
    // Si prefiere no decirlo, ir directo al cuestionario
    paginaDestino = 'cuestionario.html';
    console.log('⏩ Usuario prefirió no especificar género, ir a cuestionario');
    
    // Asignar avatar neutro
    sesion.avatar = {
      id: 'avatar-neutro',
      ruta: null,
      emoji: '😊'
    };
    guardarSesionActual(sesion);
    
  } else {
    // Si especificó masculino o femenino, ir a selección de avatar
    paginaDestino = 'avatar-selection.html';
    console.log('👤 Usuario especificó género, ir a selección de avatar');
  }
  
  // Construir URL correcta
  let urlDestino;
  
  if (esGitHubPages) {
    // En GitHub Pages: usar pathname completo
    const pathParts = window.location.pathname.split('/');
    pathParts.pop(); // Remover index.html o página actual
    const basePath = pathParts.join('/') || '';
    urlDestino = `${basePath}/${paginaDestino}`;
  } else {
    // En local: usar ruta relativa simple
    urlDestino = `./${paginaDestino}`;
  }
  
  console.log('🎯 URL destino:', urlDestino);
  console.log('🎯 URL completa:', window.location.origin + urlDestino);
  
  // Mostrar mensaje visual
  mostrarMensajeRedireccion();
  
  // Redirigir después de un momento
  setTimeout(() => {
    console.log('🔄 Redirigiendo con window.location.href');
    window.location.href = urlDestino;
  }, 800);
}

/**
 * Muestra un mensaje visual durante la redirección
 */
function mostrarMensajeRedireccion() {
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
    <div>Cargando tu aventura emocional...</div>
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
  
  console.log('✅ Mensaje de redirección mostrado');
}

/**
 * Muestra un mensaje de error
 * @param {string} mensaje
 */
function mostrarError(mensaje) {
  console.log('⚠️ Error:', mensaje);
  
  if (errorMessage) {
    errorMessage.textContent = mensaje;
    errorMessage.classList.remove('hidden');
    errorMessage.style.animation = 'shake 0.5s ease';
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      errorMessage.classList.add('hidden');
    }, 5000);
  } else {
    alert(mensaje);
  }
}

/**
 * Limpia los mensajes de error
 */
function limpiarErrores() {
  if (errorMessage) {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
  }
  
  // Limpiar clases de error de los campos
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => {
    group.classList.remove('error');
  });
}

console.log('✅ login.js configurado correctamente');