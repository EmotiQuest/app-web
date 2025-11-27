// ============================================
// EMOTIQUEST - ADMIN.JS (VERSIÓN CORREGIDA)
// Lógica completa del Dashboard de Administrador
// ============================================

// ==================== VARIABLES GLOBALES ====================
let todasLasSesiones = []; // Todas las sesiones cargadas
let sesionesFiltradas = []; // Sesiones después de aplicar filtros

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 Admin Dashboard inicializado');
  
  // Cargar datos
  cargarDatos();
  
  // Inicializar event listeners
  inicializarEventListeners();
  
  // Configurar modal de calificación
  configurarModalCalificacion();
  
  // Actualizar interfaz de sesiones
  actualizarDashboard();
  
  // Actualizar interfaz de calificaciones (NUEVO)
  actualizarDashboardCalificaciones();
  
  // Reemplazar exportar/importar con versiones completas
  document.getElementById('btn-exportar').removeEventListener('click', exportarDatos);
  document.getElementById('btn-exportar').addEventListener('click', exportarDatosCompleto);
  
  const fileInput = document.getElementById('file-input');
  fileInput.removeEventListener('change', importarDatos);
  fileInput.addEventListener('change', importarDatosCompleto);
});


// ==================== CARGAR DATOS (TAREA 1 - CORREGIDA) ====================
function cargarDatos() {
  try {
    // Cargar sesiones desde localStorage
    const sesionesJSON = localStorage.getItem('emotiquest_sesiones');
    
    console.log('🔍 DEBUG - localStorage raw:', sesionesJSON ? 'Contiene datos' : 'Vacío'); // DEBUG
    
    if (sesionesJSON) {
      todasLasSesiones = JSON.parse(sesionesJSON);
      sesionesFiltradas = [...todasLasSesiones]; // Copia para filtros
      console.log(`✅ ${todasLasSesiones.length} sesiones cargadas`);
      console.log('📊 DEBUG - Sesiones:', todasLasSesiones); // DEBUG
      
      // Verificar estructura de cada sesión
      if (todasLasSesiones.length > 0) {
        console.log('📋 DEBUG - Primera sesión:', todasLasSesiones[0]); // DEBUG
        console.log('📅 DEBUG - Fecha primera sesión:', todasLasSesiones[0].fecha); // DEBUG
        console.log('😊 DEBUG - Emoción primera sesión:', todasLasSesiones[0].emocionPredominante); // DEBUG
      }
    } else {
      console.log('📭 No hay sesiones en localStorage');
      todasLasSesiones = [];
      sesionesFiltradas = [];
    }
  } catch (error) {
    console.error('❌ Error al cargar datos:', error);
    console.error('Stack:', error.stack); // DEBUG
    todasLasSesiones = [];
    sesionesFiltradas = [];
  }
}

// ==================== EVENT LISTENERS ====================
function inicializarEventListeners() {
  // Botones de exportar/importar
  document.getElementById('btn-exportar').addEventListener('click', exportarDatos);
  document.getElementById('btn-importar').addEventListener('click', () => {
    document.getElementById('file-input').click();
  });
  document.getElementById('file-input').addEventListener('change', importarDatos);
  
  // Filtros
  document.getElementById('btn-aplicar-filtros').addEventListener('click', aplicarFiltros);
  document.getElementById('btn-limpiar-filtros').addEventListener('click', limpiarFiltros);
  
  // Modal
  const modalClose = document.getElementById('modal-close');
  const modal = document.getElementById('modal-detalles');
  
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  // Cerrar modal al hacer clic fuera
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
}

// ==================== ACTUALIZAR DASHBOARD ====================
function actualizarDashboard() {
  // Actualizar mensaje de bienvenida
  actualizarMensajeBienvenida();
  
  // Actualizar estadísticas
  actualizarEstadisticas();
  
  // Actualizar gráfico
  generarGrafico();
  
  // Actualizar tabla
  generarTabla();
}

// ==================== MENSAJE DE BIENVENIDA ====================
function actualizarMensajeBienvenida() {
  const mensaje = document.getElementById('welcome-message');
  const total = todasLasSesiones.length;
  
  if (total === 0) {
    mensaje.textContent = 'No hay sesiones registradas aún. Los datos aparecerán cuando los usuarios completen el cuestionario.';
  } else if (total === 1) {
    mensaje.textContent = 'Hay 1 sesión registrada. ¡Excelente inicio!';
  } else {
    mensaje.textContent = `Hay ${total} sesiones registradas. ¡Sigue monitoreando las emociones!`;
  }
}

// ==================== ESTADÍSTICAS GENERALES (TAREA 2 - CORREGIDA) ====================
function actualizarEstadisticas() {
  const total = todasLasSesiones.length;
  
  // 1. Total de sesiones
  document.getElementById('stat-total').textContent = total;
  console.log('📊 DEBUG - Total sesiones:', total); // DEBUG
  
  // 2. Sesiones de hoy (usando fecha local)
  const hoy = new Date();
  const fechaLocal = hoy.getFullYear() + '-' +
    String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
    String(hoy.getDate()).padStart(2, '0');
  console.log('📅 DEBUG - Fecha de hoy (local):', fechaLocal); // DEBUG
  
  const sesionesHoy = todasLasSesiones.filter(s => {
    console.log('🔍 DEBUG - Comparando:', s.fecha, 'con', fechaLocal); // DEBUG
    return s.fecha === fechaLocal;
  }).length;
  
  document.getElementById('stat-hoy').textContent = sesionesHoy;
  console.log('📊 DEBUG - Sesiones hoy:', sesionesHoy); // DEBUG
  
  // 3. Emoción predominante global
  if (total > 0) {
    const emocionPredominante = calcularEmocionPredominante(todasLasSesiones);
    console.log('😊 DEBUG - Emoción predominante:', emocionPredominante); // DEBUG
    
    if (emocionPredominante) {
      const emocionData = EMOCIONES[emocionPredominante];
      if (emocionData) {
        document.getElementById('stat-emocion').textContent = 
          `${emocionData.emoji} ${emocionData.nombre}`;
      } else {
        console.error('❌ No se encontró data para emoción:', emocionPredominante); // DEBUG
        document.getElementById('stat-emocion').textContent = '-';
      }
    } else {
      document.getElementById('stat-emocion').textContent = '-';
    }
  } else {
    document.getElementById('stat-emocion').textContent = '-';
  }
  
  // 4. Edad promedio
  if (total > 0) {
    const sumaEdades = todasLasSesiones.reduce((sum, s) => {
      const edad = parseInt(s.edad) || 0;
      console.log('🔢 DEBUG - Edad de sesión:', s.id, '=', edad); // DEBUG
      return sum + edad;
    }, 0);
    
    const promedioEdad = Math.round(sumaEdades / total);
    console.log('📊 DEBUG - Suma edades:', sumaEdades, '/ Total:', total, '= Promedio:', promedioEdad); // DEBUG
    document.getElementById('stat-promedio').textContent = promedioEdad;
  } else {
    document.getElementById('stat-promedio').textContent = '0';
  }
}

// ==================== CALCULAR EMOCIÓN PREDOMINANTE (TAREA 3 - CORREGIDA) ====================
function calcularEmocionPredominante(sesiones) {
  if (sesiones.length === 0) return null;
  
  const conteo = {};
  
  console.log('🔍 DEBUG - Calculando emoción predominante global...'); // DEBUG
  
  sesiones.forEach((sesion, index) => {
    const emocion = sesion.emocionPredominante;
    console.log(`📋 DEBUG - Sesión ${index + 1}:`, sesion.id, '- Emoción:', emocion); // DEBUG
    
    if (emocion) {
      conteo[emocion] = (conteo[emocion] || 0) + 1;
    }
  });
  
  console.log('📊 DEBUG - Conteo de emociones:', conteo); // DEBUG
  
  // Encontrar la emoción con mayor conteo
  let maxEmocion = null;
  let maxConteo = 0;
  
  for (const [emocion, cantidad] of Object.entries(conteo)) {
    if (cantidad > maxConteo) {
      maxConteo = cantidad;
      maxEmocion = emocion;
    }
  }
  
  console.log('🎯 DEBUG - Emoción predominante:', maxEmocion, 'con', maxConteo, 'apariciones'); // DEBUG
  
  return maxEmocion;
}

// ==================== GENERAR GRÁFICO DE BARRAS (TAREA 4 - CORREGIDA) ====================
function generarGrafico() {
  const chartBars = document.getElementById('chart-bars');
  const chartLegend = document.getElementById('chart-legend');
  const chartEmpty = document.getElementById('chart-empty');
  const chartContainer = document.getElementById('chart-container');
  
  console.log('📊 DEBUG - Generando gráfico...'); // DEBUG
  console.log('📊 DEBUG - Sesiones filtradas:', sesionesFiltradas.length); // DEBUG
  
  // Limpiar contenido previo
  chartBars.innerHTML = '';
  chartLegend.innerHTML = '';
  
  // Verificar si hay datos
  if (sesionesFiltradas.length === 0) {
    console.log('⚠️ DEBUG - No hay datos para graficar'); // DEBUG
    chartContainer.style.display = 'none';
    chartEmpty.style.display = 'block';
    return;
  }
  
  console.log('✅ DEBUG - Hay datos, mostrando gráfico'); // DEBUG
  chartContainer.style.display = 'flex';
  chartEmpty.style.display = 'none';
  
  // Contar emociones en sesiones filtradas
  const conteoEmociones = {};
  
  sesionesFiltradas.forEach(sesion => {
    const emocion = sesion.emocionPredominante;
    console.log('🔢 DEBUG - Contando emoción:', emocion, 'de sesión', sesion.id); // DEBUG
    
    if (emocion) {
      conteoEmociones[emocion] = (conteoEmociones[emocion] || 0) + 1;
    }
  });
  
  console.log('📊 DEBUG - Distribución de emociones:', conteoEmociones); // DEBUG
  
  // Verificar que EMOCIONES está disponible
  if (typeof EMOCIONES === 'undefined') {
    console.error('❌ DEBUG - EMOCIONES no está definido'); // DEBUG
    return;
  }
  
  console.log('✅ DEBUG - EMOCIONES está disponible'); // DEBUG
  
  // ESCALA FIJA: 0-15
  const ESCALA_MAXIMA = 15;
  console.log('📈 DEBUG - Escala máxima:', ESCALA_MAXIMA); // DEBUG
  
  // Generar una barra por cada emoción encontrada
  Object.entries(conteoEmociones).forEach(([emocionKey, cantidad]) => {
    const emocionData = EMOCIONES[emocionKey];
    if (!emocionData){
      console.warn('⚠️ DEBUG - No se encontró data para emoción:', emocionKey); // DEBUG
      return; // Saltar si no existe en EMOCIONES
    }
    
    console.log('📊 DEBUG - Creando barra para:', emocionKey, 'con', cantidad, 'apariciones'); // DEBUG
    
    // Calcular altura basada en escala 0-15
    const alturaPorcentaje = Math.min((cantidad / ESCALA_MAXIMA) * 100, 100);
    
    // Crear elemento de barra
   const barElement = document.createElement('div');
    barElement.className = 'chart-bar';
    
    barElement.innerHTML = `
      <div class="bar-column" 
           style="height: ${alturaPorcentaje}%; 
                  background: ${emocionData.color}; 
                  box-shadow: 0 -4px 15px ${emocionData.color}40;"
           data-emocion="${emocionKey}"
           data-cantidad="${cantidad}">
        <div class="bar-value">${cantidad}</div>
      </div>
      <div class="bar-label">
        <div class="bar-emoji">${emocionData.emoji}</div>
      </div>
    `;
    
    chartBars.appendChild(barElement);
    
    // Agregar a la leyenda
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
      <div class="legend-color" style="background: ${emocionData.color};"></div>
      <span class="legend-text">${emocionData.emoji} ${emocionData.nombre}</span>
    `;
    chartLegend.appendChild(legendItem);
  });
  
  console.log('✅ DEBUG - Gráfico generado exitosamente'); // DEBUG
  
  // Agregar tooltips interactivos (hover)
 const barColumns = chartBars.querySelectorAll('.bar-column');
  barColumns.forEach(bar => {
    bar.addEventListener('mouseenter', () => {
      bar.style.filter = 'brightness(1.2)';
    });
    bar.addEventListener('mouseleave', () => {
      bar.style.filter = 'brightness(1)';
    });
  });
}

// ==================== GENERAR TABLA ====================
function generarTabla() {
  const tableBody = document.getElementById('table-body');
  const tableCount = document.getElementById('table-count');
  const tableEmpty = document.getElementById('table-empty');
  const tableWrapper = document.querySelector('.table-wrapper');
  
  // Limpiar tabla
  tableBody.innerHTML = '';
  
  if (sesionesFiltradas.length === 0) {
    tableWrapper.style.display = 'none';
    tableEmpty.style.display = 'block';
    tableCount.textContent = 'Total: 0 sesiones';
    return;
  }
  
  tableWrapper.style.display = 'block';
  tableEmpty.style.display = 'none';
  tableCount.textContent = `Total: ${sesionesFiltradas.length} sesiones`;
  
  // Generar filas (ordenar por fecha descendente)
  const sesionesOrdenadas = [...sesionesFiltradas].sort((a, b) => {
    return new Date(b.fecha + ' ' + b.hora) - new Date(a.fecha + ' ' + a.hora);
  });
  
  sesionesOrdenadas.forEach(sesion => {
    const emocionData = EMOCIONES[sesion.emocionPredominante];
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${sesion.id}</strong></td>
      <td>${formatearFecha(sesion.fecha)}</td>
      <td>${sesion.hora}</td>
      <td>${sesion.edad} años</td>
      <td style="text-transform: capitalize;">${sesion.genero}</td>
      <td>${sesion.grado}</td>
      <td>
        <span class="emotion-badge" style="background: ${emocionData.color};">
          ${emocionData.emoji} ${emocionData.nombre}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-table btn-ver-detalles" onclick="verDetalles('${sesion.id}')">
            👁️ Ver
          </button>
        </div>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// ==================== FORMATEAR FECHA ====================
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO + 'T00:00:00');
  const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
  return fecha.toLocaleDateString('es-ES', opciones);
}

// ==================== VER DETALLES DE SESIÓN ====================
function verDetalles(idSesion) {
  const sesion = todasLasSesiones.find(s => s.id === idSesion);
  if (!sesion) return;
  
  const modal = document.getElementById('modal-detalles');
  const modalBody = document.getElementById('modal-body');
  
  const emocionData = EMOCIONES[sesion.emocionPredominante];
  
  modalBody.innerHTML = `
    <div class="detail-row">
      <span class="detail-label">ID de Sesión:</span>
      <span class="detail-value">${sesion.id}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Fecha:</span>
      <span class="detail-value">${formatearFecha(sesion.fecha)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Hora:</span>
      <span class="detail-value">${sesion.hora}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Edad:</span>
      <span class="detail-value">${sesion.edad} años</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Género:</span>
      <span class="detail-value" style="text-transform: capitalize;">${sesion.genero}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Grado:</span>
      <span class="detail-value">${sesion.grado}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Emoción Predominante:</span>
      <span class="detail-value">
        <span class="emotion-badge" style="background: ${emocionData.color};">
          ${emocionData.emoji} ${emocionData.nombre}
        </span>
      </span>
    </div>
    
    <h3 style="margin-top: 1.5rem; margin-bottom: 1rem; color: var(--text-dark);">
      📊 Distribución de Respuestas:
    </h3>
    
    ${generarDistribucionRespuestas(sesion)}
  `;
  
  modal.style.display = 'flex';
}

// ==================== GENERAR DISTRIBUCIÓN DE RESPUESTAS ====================
function generarDistribucionRespuestas(sesion) {
  if (!sesion.respuestas || sesion.respuestas.length === 0) {
    return '<p>No hay respuestas registradas.</p>';
  }
  
  const conteoEmociones = {};
  
  sesion.respuestas.forEach(respuesta => {
    const emocion = respuesta.emocion;
    conteoEmociones[emocion] = (conteoEmociones[emocion] || 0) + 1;
  });
  
  let html = '<div style="display: flex; flex-direction: column; gap: 0.75rem;">';
  
  Object.entries(conteoEmociones).forEach(([emocionKey, cantidad]) => {
    const emocionData = EMOCIONES[emocionKey];
    const porcentaje = ((cantidad / sesion.respuestas.length) * 100).toFixed(1);
    
    html += `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 1.5rem;">${emocionData.emoji}</span>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
            <span style="font-weight: 600;">${emocionData.nombre}</span>
            <span style="font-weight: 600; color: var(--text-medium);">${cantidad} (${porcentaje}%)</span>
          </div>
          <div style="width: 100%; height: 10px; background: var(--color-lila-claro); border-radius: 10px; overflow: hidden;">
            <div style="width: ${porcentaje}%; height: 100%; background: ${emocionData.color}; transition: width 0.5s ease;"></div>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}

// ==================== APLICAR FILTROS ====================
function aplicarFiltros() {
  const filtroFecha = document.getElementById('filter-fecha').value;
  const filtroEmocion = document.getElementById('filter-emocion').value;
  const filtroEdad = document.getElementById('filter-edad').value;
  const filtroGenero = document.getElementById('filter-genero').value;
  
  sesionesFiltradas = todasLasSesiones.filter(sesion => {
    // Filtro por fecha
    if (filtroFecha && sesion.fecha !== filtroFecha) {
      return false;
    }
    
    // Filtro por emoción
    if (filtroEmocion && sesion.emocionPredominante !== filtroEmocion) {
      return false;
    }
    
    // Filtro por edad
    if (filtroEdad && parseInt(sesion.edad) !== parseInt(filtroEdad)) {
      return false;
    }
    
    // Filtro por género
    if (filtroGenero && sesion.genero !== filtroGenero) {
      return false;
    }
    
    return true;
  });
  
  console.log(`🔍 Filtros aplicados: ${sesionesFiltradas.length} resultados`);
  
  // Actualizar gráfico y tabla
  generarGrafico();
  generarTabla();
}

// ==================== LIMPIAR FILTROS ====================
function limpiarFiltros() {
  document.getElementById('filter-fecha').value = '';
  document.getElementById('filter-emocion').value = '';
  document.getElementById('filter-edad').value = '';
  document.getElementById('filter-genero').value = '';
  
  sesionesFiltradas = [...todasLasSesiones];
  
  console.log('🧹 Filtros limpiados');
  
  // Actualizar gráfico y tabla
  generarGrafico();
  generarTabla();
}

// ==================== EXPORTAR DATOS ====================
function exportarDatos() {
  if (todasLasSesiones.length === 0) {
    alert('❌ No hay datos para exportar');
    return;
  }
  
  try {
    // Crear objeto JSON
    const dataExport = {
      exportDate: new Date().toISOString(),
      totalSessions: todasLasSesiones.length,
      sessions: todasLasSesiones
    };
    
    // Convertir a JSON string
    const jsonString = JSON.stringify(dataExport, null, 2);
    
    // Crear blob y descargar
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotiquest_datos_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Datos exportados correctamente');
    alert(`✅ Datos exportados: ${todasLasSesiones.length} sesiones`);
  } catch (error) {
    console.error('❌ Error al exportar:', error);
    alert('❌ Error al exportar los datos');
  }
}

// ==================== IMPORTAR DATOS ====================
function importarDatos(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target.result);
      
      // Validar estructura
      if (!jsonData.sessions || !Array.isArray(jsonData.sessions)) {
        alert('❌ Archivo JSON inválido: falta el array de sesiones');
        return;
      }
      
      // Confirmar importación
      const confirmacion = confirm(
        `¿Deseas importar ${jsonData.sessions.length} sesiones?\n\n` +
        `Esto REEMPLAZARÁ todos los datos actuales (${todasLasSesiones.length} sesiones).`
      );
      
      if (!confirmacion) {
        console.log('❌ Importación cancelada por el usuario');
        return;
      }
      
      // Guardar en localStorage
      localStorage.setItem('emotiquest_sesiones', JSON.stringify(jsonData.sessions));
      
      // Recargar datos
      cargarDatos();
      actualizarDashboard();
      
      console.log('✅ Datos importados correctamente');
      alert(`✅ Datos importados: ${jsonData.sessions.length} sesiones`);
    } catch (error) {
      console.error('❌ Error al importar:', error);
      alert('❌ Error al leer el archivo JSON. Verifica que sea válido.');
    }
  };
  
  reader.readAsText(file);
  
  // Limpiar el input para permitir reimportar el mismo archivo
  event.target.value = '';
}
// ==================== SECCIÓN CALIFICACIONES (AGREGAR AL FINAL) ====================

/**
 * Actualiza el dashboard de calificaciones
 */
function actualizarDashboardCalificaciones() {
  const calificaciones = obtenerTodasLasCalificaciones();
  
  console.log('⭐ Actualizando dashboard de calificaciones:', calificaciones.length);
  
  // Actualizar estadísticas
  actualizarEstadisticasCalificaciones(calificaciones);
  
  // Actualizar gráfico de estrellas
  generarGraficoEstrellas(calificaciones);
  
  // Actualizar gráfico de "Volvería"
  generarGraficoVolveria(calificaciones);
  
  // Actualizar tabla
  generarTablaCalificaciones(calificaciones);
}

/**
 * Actualiza las estadísticas de calificaciones
 */
function actualizarEstadisticasCalificaciones(calificaciones) {
  const total = calificaciones.length;
  
  // Total de calificaciones
  document.getElementById('cal-stat-total').textContent = total;
  
  if (total === 0) {
    document.getElementById('cal-stat-promedio').textContent = '0.0';
    document.getElementById('cal-stat-volverian').textContent = '0%';
    return;
  }
  
  // Promedio de estrellas
  const sumaRating = calificaciones.reduce((sum, cal) => sum + cal.rating, 0);
  const promedioRating = (sumaRating / total).toFixed(1);
  document.getElementById('cal-stat-promedio').textContent = promedioRating;
  
  // Porcentaje de "Sí volverían"
  const volverianSi = calificaciones.filter(cal => cal.volveria === 'si').length;
  const porcentajeSi = Math.round((volverianSi / total) * 100);
  document.getElementById('cal-stat-volverian').textContent = `${porcentajeSi}%`;
  
  console.log('✅ Estadísticas de calificaciones actualizadas');
}

/**
 * Genera el gráfico de distribución de estrellas
 */
function generarGraficoEstrellas(calificaciones) {
  const starsChart = document.getElementById('stars-chart');
  starsChart.innerHTML = '';
  
  if (calificaciones.length === 0) {
    starsChart.innerHTML = '<p style="text-align: center; color: var(--text-medium);">No hay datos para mostrar</p>';
    return;
  }
  
  // Contar calificaciones por estrellas
  const conteo = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  calificaciones.forEach(cal => {
    conteo[cal.rating] = (conteo[cal.rating] || 0) + 1;
  });
  
  const total = calificaciones.length;
  
  // Generar barras (de 5 a 1)
  for (let stars = 5; stars >= 1; stars--) {
    const cantidad = conteo[stars];
    const porcentaje = total > 0 ? (cantidad / total) * 100 : 0;
    
    const row = document.createElement('div');
    row.className = 'star-bar-row';
    
    row.innerHTML = `
      <div class="star-bar-label">
        <span>${'⭐'.repeat(stars)}</span>
      </div>
      <div class="star-bar-container">
        <div class="star-bar-fill" style="width: ${porcentaje}%;">
          ${cantidad > 0 ? cantidad : ''}
        </div>
      </div>
      <div class="star-bar-count">${cantidad} (${porcentaje.toFixed(0)}%)</div>
    `;
    
    starsChart.appendChild(row);
  }
  
  console.log('✅ Gráfico de estrellas generado');
}

/**
 * Genera el gráfico de "Volvería a usar"
 */
function generarGraficoVolveria(calificaciones) {
  const volveriaChart = document.getElementById('volveria-chart');
  volveriaChart.innerHTML = '';
  
  if (calificaciones.length === 0) {
    volveriaChart.innerHTML = '<p style="text-align: center; color: var(--text-medium);">No hay datos para mostrar</p>';
    return;
  }
  
  // Contar respuestas
  const conteo = {
    'si': 0,
    'tal-vez': 0,
    'no': 0
  };
  
  calificaciones.forEach(cal => {
    const volveria = cal.volveria || 'no';
    conteo[volveria] = (conteo[volveria] || 0) + 1;
  });
  
  const total = calificaciones.length;
  
  // Configuración de opciones
  const opciones = [
    { key: 'si', label: 'Sí', emoji: '👍', clase: 'si' },
    { key: 'tal-vez', label: 'Tal vez', emoji: '🤔', clase: 'tal-vez' },
    { key: 'no', label: 'No', emoji: '👎', clase: 'no' }
  ];
  
  // Generar barras
  opciones.forEach(opcion => {
    const cantidad = conteo[opcion.key];
    const porcentaje = total > 0 ? (cantidad / total) * 100 : 0;
    
    const row = document.createElement('div');
    row.className = 'volveria-bar-row';
    
    row.innerHTML = `
      <div class="volveria-bar-label">
        <span>${opcion.emoji}</span>
        <span>${opcion.label}</span>
      </div>
      <div class="volveria-bar-container">
        <div class="volveria-bar-fill ${opcion.clase}" style="width: ${porcentaje}%;">
          ${cantidad > 0 ? `${cantidad}` : ''}
        </div>
      </div>
      <div class="volveria-bar-count">${cantidad} (${porcentaje.toFixed(0)}%)</div>
    `;
    
    volveriaChart.appendChild(row);
  });
  
  console.log('✅ Gráfico de volvería generado');
}

/**
 * Genera la tabla de calificaciones
 */
function generarTablaCalificaciones(calificaciones) {
  const tableBody = document.getElementById('calificaciones-table-body');
  const tableCount = document.getElementById('calificaciones-count');
  const tableEmpty = document.getElementById('calificaciones-empty');
  const tableWrapper = document.querySelector('.calificaciones-tabla .table-wrapper');
  
  // Limpiar tabla
  tableBody.innerHTML = '';
  
  if (calificaciones.length === 0) {
    tableWrapper.style.display = 'none';
    tableEmpty.style.display = 'block';
    tableCount.textContent = 'Total: 0 calificaciones';
    return;
  }
  
  tableWrapper.style.display = 'block';
  tableEmpty.style.display = 'none';
  tableCount.textContent = `Total: ${calificaciones.length} calificaciones`;
  
  // Ordenar por fecha descendente
  const calificacionesOrdenadas = [...calificaciones].sort((a, b) => {
    return new Date(b.fecha + ' ' + b.hora) - new Date(a.fecha + ' ' + a.hora);
  });
  
  // Generar filas
  calificacionesOrdenadas.forEach(cal => {
    const row = document.createElement('tr');
    
    // Generar estrellas visuales
    let estrellasHTML = '<div class="rating-stars">';
    for (let i = 1; i <= 5; i++) {
      if (i <= cal.rating) {
        estrellasHTML += '<span class="star-filled">⭐</span>';
      } else {
        estrellasHTML += '<span class="star-empty">☆</span>';
      }
    }
    estrellasHTML += '</div>';
    
    // Badge de "Volvería"
    const volveriaTexto = {
      'si': 'Sí',
      'tal-vez': 'Tal vez',
      'no': 'No'
    };
    
    const volveriaClase = cal.volveria || 'no';
    
    row.innerHTML = `
      <td>${formatearFecha(cal.fecha)}</td>
      <td>${cal.edad} años</td>
      <td style="text-transform: capitalize;">${formatearGenero(cal.genero)}</td>
      <td>${cal.grado}</td>
      <td>${estrellasHTML}</td>
      <td>
        <span class="volveria-badge ${volveriaClase}">
          ${volveriaTexto[volveriaClase] || 'No'}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-table btn-ver-detalles" onclick="verDetallesCalificacion('${cal.id}')">
            👁️ Ver
          </button>
        </div>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  console.log('✅ Tabla de calificaciones generada');
}

/**
 * Formatea el género para mostrar
 */
function formatearGenero(genero) {
  if (genero === 'pnd') {
    return 'Prefiero no decirlo';
  }
  return genero.charAt(0).toUpperCase() + genero.slice(1);
}

/**
 * Muestra los detalles de una calificación en modal
 */
function verDetallesCalificacion(idCalificacion) {
  const calificaciones = obtenerTodasLasCalificaciones();
  const cal = calificaciones.find(c => c.id === idCalificacion);
  
  if (!cal) {
    alert('Calificación no encontrada');
    return;
  }
  
  const modal = document.getElementById('modal-calificacion');
  const modalBody = document.getElementById('modal-calificacion-body');
  
  // Generar estrellas visuales
  let estrellasHTML = '<div class="rating-stars">';
  for (let i = 1; i <= 5; i++) {
    if (i <= cal.rating) {
      estrellasHTML += '<span class="star-filled">⭐</span>';
    } else {
      estrellasHTML += '<span class="star-empty">☆</span>';
    }
  }
  estrellasHTML += '</div>';
  
  // Badge de volvería
  const volveriaTexto = {
    'si': '👍 Sí',
    'tal-vez': '🤔 Tal vez',
    'no': '👎 No'
  };
  
  const volveriaClase = cal.volveria || 'no';
  
  modalBody.innerHTML = `
    <div class="detail-row">
      <span class="detail-label">ID de Calificación:</span>
      <span class="detail-value">${cal.id}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">ID de Sesión:</span>
      <span class="detail-value">${cal.sesionId}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Fecha:</span>
      <span class="detail-value">${formatearFecha(cal.fecha)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Hora:</span>
      <span class="detail-value">${cal.hora}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Edad:</span>
      <span class="detail-value">${cal.edad} años</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Género:</span>
      <span class="detail-value" style="text-transform: capitalize;">${formatearGenero(cal.genero)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Escolaridad:</span>
      <span class="detail-value">${cal.grado}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Emoción del Usuario:</span>
      <span class="detail-value">${cal.emocionPredominante}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Calificación:</span>
      <span class="detail-value">${estrellasHTML}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">¿Volvería a usar?:</span>
      <span class="detail-value">
        <span class="volveria-badge ${volveriaClase}">
          ${volveriaTexto[volveriaClase] || 'No'}
        </span>
      </span>
    </div>
    
    <h3 style="margin-top: 1.5rem; margin-bottom: 1rem; color: var(--text-dark);">
      💬 Comentarios:
    </h3>
    
    <div class="comentarios-box">
      ${cal.comentarios && cal.comentarios.trim() !== '' 
        ? cal.comentarios 
        : '<span class="comentarios-vacio">Sin comentarios</span>'}
    </div>
  `;
  
  modal.style.display = 'flex';
  
  console.log('👁️ Mostrando detalles de calificación:', idCalificacion);
}

/**
 * Configura el modal de calificación
 */
function configurarModalCalificacion() {
  const modalClose = document.getElementById('modal-calificacion-close');
  const modal = document.getElementById('modal-calificacion');
  
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
}

/**
 * Modifica la función exportarDatos para incluir calificaciones
 */
function exportarDatosCompleto() {
  const sesiones = obtenerTodasLasSesiones();
  const calificaciones = obtenerTodasLasCalificaciones();
  
  if (sesiones.length === 0 && calificaciones.length === 0) {
    alert('❌ No hay datos para exportar');
    return;
  }
  
  try {
    const dataExport = {
      exportDate: new Date().toISOString(),
      totalSessions: sesiones.length,
      totalCalificaciones: calificaciones.length,
      sessions: sesiones,
      calificaciones: calificaciones
    };
    
    const jsonString = JSON.stringify(dataExport, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotiquest_completo_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Datos completos exportados');
    alert(`✅ Datos exportados:\n${sesiones.length} sesiones\n${calificaciones.length} calificaciones`);
  } catch (error) {
    console.error('❌ Error al exportar:', error);
    alert('❌ Error al exportar los datos');
  }
}

/**
 * Modifica la función importarDatos para incluir calificaciones
 */
function importarDatosCompleto(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target.result);
      
      // Validar estructura
      if (!jsonData.sessions || !Array.isArray(jsonData.sessions)) {
        alert('❌ Archivo JSON inválido: falta el array de sesiones');
        return;
      }
      
      const numSesiones = jsonData.sessions.length;
      const numCalificaciones = jsonData.calificaciones ? jsonData.calificaciones.length : 0;
      
      // Confirmar importación
      const confirmacion = confirm(
        `¿Deseas importar estos datos?\n\n` +
        `Sesiones: ${numSesiones}\n` +
        `Calificaciones: ${numCalificaciones}\n\n` +
        `Esto REEMPLAZARÁ todos los datos actuales.`
      );
      
      if (!confirmacion) {
        console.log('❌ Importación cancelada');
        return;
      }
      
      // Guardar sesiones
      localStorage.setItem('emotiquest_sesiones', JSON.stringify(jsonData.sessions));
      
      // Guardar calificaciones (si existen)
      if (jsonData.calificaciones && Array.isArray(jsonData.calificaciones)) {
        localStorage.setItem('emotiquest_calificaciones', JSON.stringify(jsonData.calificaciones));
      }
      
      // Recargar datos
      cargarDatos();
      actualizarDashboard();
      actualizarDashboardCalificaciones();
      
      console.log('✅ Datos completos importados');
      alert(`✅ Datos importados:\n${numSesiones} sesiones\n${numCalificaciones} calificaciones`);
    } catch (error) {
      console.error('❌ Error al importar:', error);
      alert('❌ Error al leer el archivo JSON');
    }
  };
  
  reader.readAsText(file);
  event.target.value = '';
}


// Exponer función global
window.verDetallesCalificacion = verDetallesCalificacion;

console.log('✅ admin.js con CALIFICACIONES cargado completamente');
// ==================== EXPONER FUNCIONES GLOBALES ====================
// Necesario para que onclick funcione en HTML generado dinámicamente
window.verDetalles = verDetalles;

// ==================== LOG FINAL ====================
console.log('✅ admin.js (VERSIÓN CORREGIDA) cargado completamente');
console.log('📊 Total sesiones al cargar:', todasLasSesiones.length);