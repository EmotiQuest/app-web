// ============================================
// LOGIN.JS - Sistema de inicio de sesión
// ============================================

/**
 * Inicializa el sistema de login cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando página de login...');
    
    // Verificar si ya hay una sesión activa
    verificarSesionExistente();
    
    // Configurar el formulario
    configurarFormulario();
    
    // Agregar animación de entrada
    aplicarAnimacionEntrada();
  });
  
  /**
   * Verifica si ya existe una sesión activa
   */
  function verificarSesionExistente() {
    if (window.EmotiQuestStorage && window.EmotiQuestStorage.haySesionActiva()) {
      const sesion = window.EmotiQuestStorage.obtenerSesionActual();
      
      // Preguntar si quiere continuar o iniciar nueva sesión
      const continuar = confirm(
        `Ya existe una sesión iniciada como "${sesion.nombre}".\n\n` +
        '¿Deseas continuar con esa sesión?\n\n' +
        'OK = Continuar sesión\n' +
        'Cancelar = Iniciar nueva sesión'
      );
      
      if (continuar) {
        // Redirigir al cuestionario
        window.location.href = './cuestionario.html';
      } else {
        // Limpiar sesión anterior
        window.EmotiQuestStorage.limpiarSesionActual();
        window.EmotiQuestStorage.limpiarRespuestas();
      }
    }
  }
  
  /**
   * Configura los event listeners del formulario
   */
  function configurarFormulario() {
    const formulario = document.getElementById('login-form');
    
    if (!formulario) {
      console.error('❌ Formulario de login no encontrado');
      return;
    }
    
    // Event listener para el submit
    formulario.addEventListener('submit', manejarSubmit);
    
    // Event listeners para validación en tiempo real
    const campos = formulario.querySelectorAll('input, select');
    campos.forEach(campo => {
      campo.addEventListener('blur', validarCampo);
      campo.addEventListener('input', function() {
        // Limpiar error cuando el usuario empieza a escribir
        limpiarError(this);
      });
    });
  }
  
  /**
   * Maneja el envío del formulario
   * @param {Event} evento - Evento de submit
   */
  function manejarSubmit(evento) {
    evento.preventDefault();
    
    console.log('📝 Procesando formulario de login...');
    
    // Obtener datos del formulario
    const datos = obtenerDatosFormulario();
    
    // Validar todos los campos
    if (!validarFormularioCompleto(datos)) {
      console.log('❌ Validación fallida');
      return;
    }
    
    // Guardar sesión
    if (window.EmotiQuestStorage) {
      const guardado = window.EmotiQuestStorage.guardarSesionActual(datos);
      
      if (guardado) {
        console.log('✅ Sesión guardada exitosamente');
        
        // Aplicar transición de salida
        aplicarTransicionSalida();
        
        // Redirigir al cuestionario después de la animación
        setTimeout(() => {
          window.location.href = './cuestionario.html';
        }, 600);
      } else {
        mostrarError('Error al guardar la sesión. Por favor, intenta de nuevo.');
      }
    } else {
      console.error('❌ Storage no disponible');
      mostrarError('Error del sistema. Por favor, recarga la página.');
    }
  }
  
  /**
   * Obtiene los datos del formulario
   * @returns {Object} Objeto con los datos del usuario
   */
  function obtenerDatosFormulario() {
    return {
      nombre: document.getElementById('nombre').value.trim(),
      genero: document.getElementById('genero').value,
      edad: parseInt(document.getElementById('edad').value),
      grado: document.getElementById('grado').value.trim()
    };
  }
  
  /**
   * Valida el formulario completo
   * @param {Object} datos - Datos a validar
   * @returns {boolean} true si todo es válido
   */
  function validarFormularioCompleto(datos) {
    let esValido = true;
    
    // Validar nombre
    if (!datos.nombre || datos.nombre.length < 2) {
      mostrarErrorCampo('nombre', 'Por favor, ingresa tu nombre (mínimo 2 caracteres)');
      esValido = false;
    }
    
    // Validar género
    if (!datos.genero) {
      mostrarErrorCampo('genero', 'Por favor, selecciona tu género');
      esValido = false;
    }
    
    // Validar edad
    if (!datos.edad || datos.edad < 5 || datos.edad > 100) {
      mostrarErrorCampo('edad', 'Por favor, ingresa una edad válida (entre 5 y 100 años)');
      esValido = false;
    }
    
    // Validar grado
    if (!datos.grado || datos.grado.length < 2) {
      mostrarErrorCampo('grado', 'Por favor, ingresa tu grado escolar');
      esValido = false;
    }
    
    // Si hay errores, hacer scroll al primero
    if (!esValido) {
      const primerError = document.querySelector('.form-group.error');
      if (primerError) {
        primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    return esValido;
  }
  
  /**
   * Valida un campo individual cuando pierde el foco
   * @param {Event} evento
   */
  function validarCampo(evento) {
    const campo = evento.target;
    const valor = campo.value.trim();
    const id = campo.id;
    
    // Limpiar error anterior
    limpiarError(campo);
    
    // Validaciones específicas
    switch(id) {
      case 'nombre':
        if (!valor || valor.length < 2) {
          mostrarErrorCampo(id, 'Nombre muy corto');
        }
        break;
        
      case 'genero':
        if (!valor) {
          mostrarErrorCampo(id, 'Selecciona una opción');
        }
        break;
        
      case 'edad':
        const edad = parseInt(valor);
        if (!edad || edad < 5 || edad > 100) {
          mostrarErrorCampo(id, 'Edad no válida');
        }
        break;
        
      case 'grado':
        if (!valor || valor.length < 2) {
          mostrarErrorCampo(id, 'Ingresa tu grado');
        }
        break;
    }
  }
  
  /**
   * Muestra un error en un campo específico
   * @param {string} idCampo - ID del campo
   * @param {string} mensaje - Mensaje de error
   */
  function mostrarErrorCampo(idCampo, mensaje) {
    const campo = document.getElementById(idCampo);
    if (!campo) return;
    
    const formGroup = campo.closest('.form-group');
    if (!formGroup) return;
    
    // Agregar clase de error
    formGroup.classList.add('error');
    campo.classList.add('error');
    
    // Crear o actualizar mensaje de error
    let errorSpan = formGroup.querySelector('.field-error');
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'field-error';
      formGroup.appendChild(errorSpan);
    }
    errorSpan.textContent = mensaje;
    
    // Animar el error
    errorSpan.style.animation = 'shake 0.3s';
    setTimeout(() => {
      errorSpan.style.animation = '';
    }, 300);
  }
  
  /**
   * Limpia el error de un campo
   * @param {HTMLElement} campo - Elemento del campo
   */
  function limpiarError(campo) {
    const formGroup = campo.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.remove('error');
    campo.classList.remove('error');
    
    const errorSpan = formGroup.querySelector('.field-error');
    if (errorSpan) {
      errorSpan.remove();
    }
  }
  
  /**
   * Muestra un mensaje de error general
   * @param {string} mensaje - Mensaje a mostrar
   */
  function mostrarError(mensaje) {
    const contenedorError = document.getElementById('error-message');
    
    if (contenedorError) {
      contenedorError.textContent = mensaje;
      contenedorError.classList.remove('hidden');
      contenedorError.classList.add('visible');
      
      // Animar
      contenedorError.style.animation = 'shake 0.5s';
      
      // Auto-ocultar después de 5 segundos
      setTimeout(() => {
        contenedorError.classList.remove('visible');
        contenedorError.classList.add('hidden');
      }, 5000);
    } else {
      // Fallback si no existe el contenedor
      alert(mensaje);
    }
  }
  
  /**
   * Aplica animación de entrada a la página
   */
  function aplicarAnimacionEntrada() {
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
      loginCard.style.opacity = '0';
      loginCard.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        loginCard.style.transition = 'all 0.6s ease';
        loginCard.style.opacity = '1';
        loginCard.style.transform = 'translateY(0)';
      }, 100);
    }
  }
  
  /**
   * Aplica transición de salida antes de cambiar de página
   */
  function aplicarTransicionSalida() {
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
      loginCard.style.transition = 'all 0.5s ease';
      loginCard.style.opacity = '0';
      loginCard.style.transform = 'scale(0.95)';
    }
    
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0.7';
  }
  
  console.log('✅ login.js cargado correctamente');
  