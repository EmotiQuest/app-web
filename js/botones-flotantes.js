/**
 * ============================================
 * BOTONES FLOTANTES - EmotiQuest
 * ============================================
 * Manejo de los botones de perfil y ruta
 * presentes en cuestionario y resultados
 */

(function() {
  'use strict';

  // ============================================
  // INICIALIZACIÓN
  // ============================================
  
  /**
   * Inicializa los botones flotantes al cargar la página
   */
  function inicializarBotonesFlotantes() {
    cargarNombreEstudiante();
    configurarEventos();
    
    // TODO: Cargar avatar personalizado cuando esté implementado
    // cargarAvatarPersonalizado();
  }

  // ============================================
  // BOTÓN DE PERFIL
  // ============================================
  
  /**
   * Carga el nombre del estudiante desde localStorage
   */
  function cargarNombreEstudiante() {
    try {
      const sesionActual = localStorage.getItem('emotiquest_sesion_actual');
      
      if (!sesionActual) {
        console.warn('No hay sesión activa');
        return;
      }

      const sesion = JSON.parse(sesionActual);
      const nombreElemento = document.getElementById('nombreEstudiante');
      
      if (nombreElemento && sesion.nombre) {
        // Mostrar solo el primer nombre si es muy largo
        const nombreCorto = sesion.nombre.split(' ')[0];
        nombreElemento.textContent = nombreCorto;
      }
    } catch (error) {
      console.error('Error al cargar nombre del estudiante:', error);
    }
  }

  /**
   * TODO: FUNCIÓN A IMPLEMENTAR
   * Carga el avatar personalizado del estudiante
   * Esta función se activará cuando envíes las imágenes predeterminadas
   */
  function cargarAvatarPersonalizado() {
    try {
      const sesionActual = localStorage.getItem('emotiquest_sesion_actual');
      
      if (!sesionActual) return;

      const sesion = JSON.parse(sesionActual);
      const avatarElemento = document.getElementById('avatarPerfil');
      
      if (!avatarElemento) return;

      // TODO: Implementar lógica de avatares predeterminados
      // Ejemplo de implementación futura:
      /*
      const rutaAvatar = obtenerRutaAvatar(sesion.genero, sesion.avatarId);
      avatarElemento.innerHTML = `
        <img src="${rutaAvatar}" alt="Avatar de ${sesion.nombre}">
      `;
      */
      
    } catch (error) {
      console.error('Error al cargar avatar:', error);
    }
  }

  /**
   * Maneja el clic en el botón de perfil
   */
  function manejarClicPerfil() {
    // TODO: Definir acción al hacer clic
    // Opciones posibles:
    // - Mostrar modal con información del usuario
    // - Ir a página de perfil
    // - Mostrar resumen de emociones del día
    
    console.log('Clic en botón de perfil');
    
    // Ejemplo: Mostrar alerta con datos del usuario (temporal)
    try {
      const sesionActual = localStorage.getItem('emotiquest_sesion_actual');
      if (sesionActual) {
        const sesion = JSON.parse(sesionActual);
        alert(`Perfil de ${sesion.nombre}\nEdad: ${sesion.edad}\nGrado: ${sesion.grado}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // ============================================
  // BOTÓN DE RUTA
  // ============================================
  
  /**
   * Maneja el clic en el botón de ruta
   */
  function manejarClicRuta() {
    // TODO: Implementar navegación a la página de rutas de bienestar
    
    console.log('Clic en botón de ruta');
    
    // Ejemplo temporal: redirigir a una página de rutas
    // window.location.href = './rutas-bienestar.html';
    
    alert('Próximamente: Rutas de Bienestar\nAquí encontrarás recursos para tu bienestar emocional.');
  }

  // ============================================
  // EVENTOS
  // ============================================
  
  /**
   * Configura los event listeners de los botones
   */
  function configurarEventos() {
    const botonPerfil = document.getElementById('botonPerfil');
    const botonRuta = document.getElementById('botonRuta');

    if (botonPerfil) {
      botonPerfil.addEventListener('click', manejarClicPerfil);
    }

    if (botonRuta) {
      botonRuta.addEventListener('click', manejarClicRuta);
    }
  }

  // ============================================
  // INICIAR AL CARGAR LA PÁGINA
  // ============================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBotonesFlotantes);
  } else {
    inicializarBotonesFlotantes();
  }

})();