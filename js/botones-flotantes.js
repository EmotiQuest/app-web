/**
 * ============================================
 * BOTONES FLOTANTES - EmotiQuest
 * ============================================
 * Manejo de los botones de perfil y ruta
 * presentes en cuestionario y resultados
 * MODIFICADO: Ahora carga avatares personalizados
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
    
    // Cargar avatar personalizado
    cargarAvatarPersonalizado();
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
   * Carga el avatar personalizado del estudiante
   */
  function cargarAvatarPersonalizado() {
    try {
      const sesionActual = localStorage.getItem('emotiquest_sesion_actual');
      
      if (!sesionActual) return;

      const sesion = JSON.parse(sesionActual);
      const avatarElemento = document.getElementById('avatarPerfil');
      
      if (!avatarElemento) return;

      // Verificar si el usuario tiene avatar personalizado
      if (sesion.avatar) {
        console.log('✅ Avatar personalizado encontrado:', sesion.avatar);
        
        // Limpiar contenido actual
        avatarElemento.innerHTML = '';
        
        // Si tiene ruta de imagen, usar imagen
        if (sesion.avatar.ruta) {
          const img = document.createElement('img');
          img.src = sesion.avatar.ruta;
          img.alt = 'Avatar de ' + sesion.nombre;
          img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
          
          // Si la imagen falla, usar emoji
          img.onerror = function() {
            console.warn('⚠️ Imagen de avatar no encontrada, usando emoji');
            avatarElemento.innerHTML = `
              <span style="font-size: 1.8rem;">${sesion.avatar.emoji || '😊'}</span>
            `;
          };
          
          avatarElemento.appendChild(img);
        } 
        // Si solo tiene emoji, usar emoji
        else if (sesion.avatar.emoji) {
          avatarElemento.innerHTML = `
            <span style="font-size: 1.8rem;">${sesion.avatar.emoji}</span>
          `;
        }
        // Si no tiene nada, dejar el SVG por defecto
        else {
          console.warn('⚠️ Avatar sin ruta ni emoji, usando SVG por defecto');
        }
        
      } else {
        console.log('ℹ️ Usuario sin avatar personalizado, usando SVG por defecto');
      }
      
    } catch (error) {
      console.error('Error al cargar avatar:', error);
    }
  }

 
  /**
 * Maneja el clic en el botón de perfil
 * REDIRIGE A LA PÁGINA DE PERFIL
 */
function manejarClicPerfil() {
  console.log('🎨 Clic en botón de perfil - Redirigiendo...');
  
  try {
    // Verificar que hay sesión activa
    const sesionActual = localStorage.getItem('emotiquest_sesion_actual');
    
    if (!sesionActual) {
      alert('No hay sesión activa. Por favor, inicia sesión primero.');
      window.location.href = './index.html';
      return;
    }

    // Redirigir a página de perfil
    window.location.href = './perfil.html';
    
  } catch (error) {
    console.error('❌ Error al ir al perfil:', error);
    alert('Error al cargar el perfil. Intenta de nuevo.');
  }
}

  // ============================================
  // BOTÓN DE RUTA
  // ============================================
  
  /**
   * Maneja el clic en el botón de ruta
   */
  function manejarClicRuta() {
    console.log('Clic en botón de ruta - Redirigiendo a rutas.html');
    
    // Redirigir a la página de rutas
    window.location.href = './rutas.html';
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