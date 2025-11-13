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
  
  // Actualizar interfaz
  actualizarDashboard();
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

// ==================== EXPONER FUNCIONES GLOBALES ====================
// Necesario para que onclick funcione en HTML generado dinámicamente
window.verDetalles = verDetalles;

// ==================== LOG FINAL ====================
console.log('✅ admin.js (VERSIÓN CORREGIDA) cargado completamente');
console.log('📊 Total sesiones al cargar:', todasLasSesiones.length);