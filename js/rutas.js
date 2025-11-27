// ============================================
// EMOTIQUEST - RUTAS.JS
// Lógica de modales para Rutas de Bienestar
// ============================================

(function() {
  'use strict';

  // ==================== VARIABLES GLOBALES ====================
  const modales = {
    meditacion: null,
    lineas: null,
    guias: null,
    ejercicios: null
  };

  // ==================== INICIALIZACIÓN ====================
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Rutas de Bienestar inicializado');
    
    inicializarModales();
    configurarEventos();
    cargarDatosUsuario();
    aplicarAnimacionEntrada();
  });

  // ==================== INICIALIZAR MODALES ====================
  function inicializarModales() {
    // Obtener referencias de los modales
    modales.meditacion = document.getElementById('modal-meditacion');
    modales.lineas = document.getElementById('modal-lineas');
    modales.guias = document.getElementById('modal-guias');
    modales.ejercicios = document.getElementById('modal-ejercicios');

    console.log('✅ Modales inicializados');
  }

  // ==================== CONFIGURAR EVENTOS ====================
  function configurarEventos() {
    // Cerrar modal al hacer clic fuera del contenido
    Object.values(modales).forEach(modal => {
      if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            cerrarTodosLosModales();
          }
        });
      }
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        cerrarTodosLosModales();
      }
    });

    console.log('✅ Eventos configurados');
  }

  // ==================== ABRIR MODAL ====================
  window.abrirModal = function(nombreModal) {
    const modal = modales[nombreModal];
    
    if (!modal) {
      console.error(`❌ Modal "${nombreModal}" no encontrado`);
      return;
    }

    // Cerrar otros modales primero
    cerrarTodosLosModales();

    // Mostrar modal con animación
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    
    setTimeout(() => {
      modal.style.transition = 'opacity 0.3s ease';
      modal.style.opacity = '1';
    }, 10);

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';

    console.log(`✅ Modal "${nombreModal}" abierto`);
    
    // Registrar analítica (opcional)
    registrarVisualizacion(nombreModal);
  };

  // ==================== CERRAR MODAL ====================
  window.cerrarModal = function(nombreModal) {
    const modal = modales[nombreModal];
    
    if (!modal) {
      console.error(`❌ Modal "${nombreModal}" no encontrado`);
      return;
    }

    // Animación de salida
    modal.style.transition = 'opacity 0.3s ease';
    modal.style.opacity = '0';
    
    setTimeout(() => {
      modal.style.display = 'none';
      // Restaurar scroll del body
      document.body.style.overflow = 'auto';
    }, 300);

    console.log(`✅ Modal "${nombreModal}" cerrado`);
  };

  // ==================== CERRAR TODOS LOS MODALES ====================
  function cerrarTodosLosModales() {
    Object.keys(modales).forEach(nombreModal => {
      const modal = modales[nombreModal];
      if (modal && modal.style.display === 'flex') {
        cerrarModal(nombreModal);
      }
    });
  }

  // ==================== CARGAR DATOS DEL USUARIO ====================
  function cargarDatosUsuario() {
    try {
      const sesionActual = localStorage.getItem('emotiquest_sesion_actual');
      
      if (sesionActual) {
        const sesion = JSON.parse(sesionActual);
        console.log('👤 Usuario:', sesion.nombre);
        
        // Personalizar mensaje de bienvenida (opcional)
        const introCard = document.querySelector('.intro-card h2');
        if (introCard && sesion.nombre) {
          const primerNombre = sesion.nombre.split(' ')[0];
          introCard.textContent = `🌟 ¡Bienvenido ${primerNombre}!`;
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  // ==================== REGISTRAR VISUALIZACIÓN ====================
  function registrarVisualizacion(nombreModal) {
    try {
      // Obtener o crear registro de visualizaciones
      const registroJSON = localStorage.getItem('emotiquest_visualizaciones');
      const registro = registroJSON ? JSON.parse(registroJSON) : {};

      // Incrementar contador del módulo
      if (!registro[nombreModal]) {
        registro[nombreModal] = 0;
      }
      registro[nombreModal]++;

      // Guardar registro actualizado
      localStorage.setItem('emotiquest_visualizaciones', JSON.stringify(registro));

      console.log(`📊 Visualización registrada: ${nombreModal} (${registro[nombreModal]} veces)`);
    } catch (error) {
      console.error('Error al registrar visualización:', error);
    }
  }

  // ==================== OBTENER ESTADÍSTICAS ====================
  window.obtenerEstadisticasRutas = function() {
    try {
      const registroJSON = localStorage.getItem('emotiquest_visualizaciones');
      const registro = registroJSON ? JSON.parse(registroJSON) : {};

      console.log('📊 Estadísticas de Rutas:', registro);
      return registro;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {};
    }
  };

  // ==================== ANIMACIÓN DE ENTRADA ====================
  function aplicarAnimacionEntrada() {
    const container = document.querySelector('.rutas-container');
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

  // ==================== FUNCIONES AUXILIARES ====================

  /**
   * Función para compartir recurso (futuro)
   */
  window.compartirRecurso = function(nombreRecurso, url) {
    if (navigator.share) {
      navigator.share({
        title: `EmotiQuest - ${nombreRecurso}`,
        text: 'Descubre este recurso de bienestar emocional',
        url: url || window.location.href
      }).then(() => {
        console.log('✅ Recurso compartido');
      }).catch((error) => {
        console.log('❌ Error al compartir:', error);
      });
    } else {
      // Fallback: copiar al portapapeles
      copiarAlPortapapeles(url || window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  /**
   * Copiar texto al portapapeles
   */
  function copiarAlPortapapeles(texto) {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  /**
   * Guardar recurso favorito (futuro)
   */
  window.guardarFavorito = function(tipo, nombre, url) {
    try {
      const favoritosJSON = localStorage.getItem('emotiquest_favoritos');
      const favoritos = favoritosJSON ? JSON.parse(favoritosJSON) : [];

      const nuevoFavorito = {
        tipo: tipo,
        nombre: nombre,
        url: url,
        fecha: new Date().toISOString()
      };

      favoritos.push(nuevoFavorito);
      localStorage.setItem('emotiquest_favoritos', JSON.stringify(favoritos));

      console.log('⭐ Favorito guardado:', nombre);
      alert(`"${nombre}" guardado en favoritos`);
    } catch (error) {
      console.error('Error al guardar favorito:', error);
    }
  };

  /**
   * Validar llamada telefónica
   */
  window.confirmarLlamada = function(numero, nombre) {
    const confirmacion = confirm(
      `¿Deseas llamar a ${nombre}?\n\n` +
      `Número: ${numero}\n\n` +
      `Esta llamada puede tener costo según tu operador.`
    );

    if (confirmacion) {
      window.location.href = `tel:${numero}`;
    }
  };

  // ==================== DETECCIÓN DE CONECTIVIDAD ====================
  
  /**
   * Verificar si hay conexión a internet
   */
  function verificarConexion() {
    if (!navigator.onLine) {
      mostrarMensajeOffline();
    }
  }

  /**
   * Mostrar mensaje de modo offline
   */
  function mostrarMensajeOffline() {
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-offline';
    mensaje.innerHTML = `
      <div class="mensaje-offline-content">
        <span>📡</span>
        <p>Sin conexión a internet. Algunos recursos externos no estarán disponibles.</p>
      </div>
    `;
    
    document.body.appendChild(mensaje);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      mensaje.style.animation = 'fadeOut 0.5s ease';
      setTimeout(() => {
        mensaje.remove();
      }, 500);
    }, 5000);
  }

  // Verificar conexión al cargar
  window.addEventListener('load', verificarConexion);

  // Detectar cambios en la conexión
  window.addEventListener('online', () => {
    console.log('✅ Conexión restaurada');
  });

  window.addEventListener('offline', () => {
    console.log('❌ Conexión perdida');
    mostrarMensajeOffline();
  });

  // ==================== ACCESIBILIDAD ====================
  
  /**
   * Navegación por teclado en modales
   */
  document.addEventListener('keydown', function(e) {
    // Tab trap dentro del modal abierto
    const modalAbierto = Object.values(modales).find(m => m && m.style.display === 'flex');
    
    if (modalAbierto && e.key === 'Tab') {
      const elementosFocusables = modalAbierto.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const primerElemento = elementosFocusables[0];
      const ultimoElemento = elementosFocusables[elementosFocusables.length - 1];
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === primerElemento) {
          e.preventDefault();
          ultimoElemento.focus();
        }
      } else {
        // Tab
        if (document.activeElement === ultimoElemento) {
          e.preventDefault();
          primerElemento.focus();
        }
      }
    }
  });

  console.log('✅ rutas.js cargado completamente');

})();