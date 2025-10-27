// ============================================
// EMOTIQUEST - LOGIN.JS (CORREGIDO)
// ============================================

console.log('🔐 login.js cargado');

// Variables globales
const formularioLogin = document.getElementById('login-form');
const errorMessageDiv = document.getElementById('error-message');

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('📋 Página de login inicializada');
  
  // Verificar si hay sesión activa
  verificarSesionActiva();
  
  // Event listener del formulario
  if (formularioLogin) {
    formularioLogin.addEventListener('submit', manejarLogin);
    console.log('✅ Event listener agregado al formulario');
  } else {
    console.error('❌ No se encontró el formulario de login');
  }
});

// ==================== VERIFICAR SESIÓN ACTIVA ====================
function verificarSesionActiva() {
  const sesionActual = obtenerSesionActual();
  
  if (sesionActual && !sesionActual.completada) {
    console.log('⚠️ Hay una sesión activa sin completar');
    
    const continuar = confirm(
      'Tienes una sesión en progreso.\n\n' +
      '¿Deseas continuar con esa sesión?'
    );
    
    if (continuar) {
      window.location.href = './cuestionario.html';
    } else {
      limpiarSesionActual();
      console.log('🧹 Sesión anterior limpiada');
    }
  }
}

// ==================== MANEJAR LOGIN ====================
function manejarLogin(event) {
  event.preventDefault();
  
  console.log('📝 === PROCESANDO FORMULARIO DE LOGIN ===');
  
  // Limpiar errores previos
  limpiarErrores();
  
  // Obtener datos del formulario
  const nombre = document.getElementById('nombre').value.trim();
  const genero = document.getElementById('genero').value;
  const edad = document.getElementById('edad').value;
  const grado = document.getElementById('grado').value;
  
  console.log('📊 Datos capturados:', { nombre, genero, edad, grado });
  
  // Validar datos
  if (!validarDatos(nombre, genero, edad, grado)) {
    console.error('❌ Validación fallida');
    return;
  }
  
  console.log('✅ Validación exitosa');
  
  // Crear usuario
  const usuario = crearUsuario(nombre, genero, edad, grado);
  console.log('👤 Usuario creado:', usuario);
  
  // Guardar usuario
  const guardadoUsuario = guardarUsuarioActual(usuario);
  
  if (!guardadoUsuario) {
    mostrarError('Error al guardar datos. Intenta nuevamente.');
    console.error('❌ Error al guardar usuario');
    return;
  }
  
  console.log('✅ Usuario guardado en localStorage');
  
  // Crear sesión inicial
  const sesionCreada = crearSesionInicial(usuario);
  
  if (!sesionCreada) {
    mostrarError('Error al crear sesión. Intenta nuevamente.');
    console.error('❌ Error al crear sesión');
    return;
  }
  
  console.log('✅ Sesión inicial creada');
  console.log('🚀 Redirigiendo a cuestionario...');
  
  // Redirigir al cuestionario
  setTimeout(() => {
    window.location.href = './cuestionario.html';
  }, 300);
}

// ==================== VALIDAR DATOS ====================
function validarDatos(nombre, genero, edad, grado) {
  let esValido = true;
  
  // Validar nombre
  if (!nombre || nombre.length < 2) {
    mostrarErrorCampo('nombre', 'El nombre debe tener al menos 2 caracteres');
    esValido = false;
  }
  
  // Validar género
  if (!genero) {
    mostrarErrorCampo('genero', 'Debes seleccionar un género');
    esValido = false;
  }
  
  // Validar edad
  const edadNum = parseInt(edad);
  if (!edad || edadNum < 5 || edadNum > 100) {
    mostrarErrorCampo('edad', 'La edad debe estar entre 5 y 100 años');
    esValido = false;
  }
  
  // Validar grado
  if (!grado) {
    mostrarErrorCampo('grado', 'Debes seleccionar tu nivel de escolaridad');
    esValido = false;
  }
  
  return esValido;
}

// ==================== CREAR USUARIO ====================
function crearUsuario(nombre, genero, edad, grado) {
  const ahora = new Date();
  const id = generarID();
  
  const usuario = {
    id: id,
    nombre: nombre,
    genero: genero,
    edad: parseInt(edad),
    grado: grado,
    fechaRegistro: ahora.toISOString().split('T')[0],
    horaRegistro: ahora.toTimeString().split(' ')[0]
  };
  
  return usuario;
}

// ==================== CREAR SESIÓN INICIAL ====================
function crearSesionInicial(usuario) {
  try {
    const ahora = new Date();
    
    const sesion = {
      id: usuario.id,
      nombre: usuario.nombre,
      genero: usuario.genero,
      edad: usuario.edad,
      grado: usuario.grado,
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toTimeString().split(' ')[0].substring(0, 5),
      respuestas: [],
      completada: false,
      emocionPredominante: null
    };
    
    // Guardar sesión actual
    const guardado = guardarSesionActual(sesion);
    
    if (guardado) {
      console.log('✅ Sesión inicial guardada:', sesion.id);
      return true;
    } else {
      console.error('❌ Error al guardar sesión inicial');
      return false;
    }
  } catch (error) {
    console.error('❌ Error al crear sesión:', error);
    return false;
  }
}

// ==================== GENERAR ID ÚNICO ====================
function generarID() {
  const ahora = new Date();
  const fecha = ahora.toISOString().split('T')[0].replace(/-/g, '');
  const hora = ahora.toTimeString().split(' ')[0].replace(/:/g, '').substring(0, 4);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `EMQ-${fecha}-${hora}-${random}`;
}

// ==================== MOSTRAR ERROR EN CAMPO ====================
function mostrarErrorCampo(idCampo, mensaje) {
  const campo = document.getElementById(idCampo);
  if (!campo) return;
  
  const formGroup = campo.closest('.form-group');
  if (!formGroup) return;
  
  // Agregar clase de error
  formGroup.classList.add('error');
  
  // Crear mensaje de error si no existe
  let errorMensaje = formGroup.querySelector('.field-error');
  if (!errorMensaje) {
    errorMensaje = document.createElement('span');
    errorMensaje.className = 'field-error';
    formGroup.appendChild(errorMensaje);
  }
  
  errorMensaje.textContent = mensaje;
  
  // Hacer focus en el campo
  campo.focus();
}

// ==================== MOSTRAR ERROR GENERAL ====================
function mostrarError(mensaje) {
  if (errorMessageDiv) {
    errorMessageDiv.textContent = mensaje;
    errorMessageDiv.classList.remove('hidden');
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      errorMessageDiv.classList.add('hidden');
    }, 5000);
  } else {
    alert(mensaje);
  }
}

// ==================== LIMPIAR ERRORES ====================
function limpiarErrores() {
  // Limpiar errores de campos
  const formGroups = document.querySelectorAll('.form-group.error');
  formGroups.forEach(group => {
    group.classList.remove('error');
    const errorMsg = group.querySelector('.field-error');
    if (errorMsg) {
      errorMsg.remove();
    }
  });
  
  // Limpiar error general
  if (errorMessageDiv) {
    errorMessageDiv.classList.add('hidden');
  }
}

console.log('✅ login.js completamente cargado');