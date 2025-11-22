# 🎨 EmotiQuest

**Versión mejorada y separada en páginas independientes**

## 📋 Descripción

EmotiQuest es una aplicación web interactiva 100% local y portable que permite a estudiantes responder un cuestionario emocional de forma anónima. Cada respuesta genera una "emoción-batido" con un color específico. Al finalizar, todos los batidos se mezclan en una animación de licuadora, y un avatar personalizado reacciona según la emoción predominante.

### 🌟 Características Principales

- ✅ **100% Local y Portable** - Funciona sin internet ni servidor
- ✅ **Páginas Separadas** - Login, cuestionario, resultados y admin en archivos independientes
- ✅ **Responsive** - Funciona en PC, tablet y móvil
- ✅ **Animaciones CSS** - Suaves y fluidas
- ✅ **Privacidad** - No muestra nombres en reportes
- ✅ **Exportación/Importación** - Datos en formato JSON

---

## 🚀 Cómo Usar

### Opción 1: Abrir Directamente

1. Ingresa al link de la página
2. Abre github pages en tu navegador
3. ¡Listo! No necesitas instalar nada

### Opción 2: Con Live Server (Recomendado para desarrollo)

1. Instala [Visual Studio Code](https://code.visualstudio.com/)
2. Instala la extensión "Live Server"
3. Click derecho en `index.html` → "Open with Live Server"

---

## 📂 Estructura Principal del Proyecto 

```
EmotiQuest/
│
├── index.html              ← Página de LOGIN
├── cuestionario.html       ← Página de PREGUNTAS
├── resultado.html          ← Página de RESULTADOS
├── admin.html              ← Página de ADMINISTRACIÓN
│
├── css/
│   ├── styles.css          ← Estilos globales
│   ├── quiz.css            ← Estilos del cuestionario
│   ├── resultado.css       ← Estilos de resultados
│   └── admin.css           ← Estilos del admin
│
├── js/
│   ├── storage.js          ← Manejo de localStorage
│   ├── emociones.js        ← Sistema de emociones
│   ├── login.js            ← Lógica del login
│   ├── cuestionario.js     ← Lógica del quiz
│   ├── resultado.js        ← Lógica de resultados
│   └── admin.js            ← Lógica del reporte
│
├── data/
│   └── preguntas.json      ← Banco de preguntas
│
├── avatars/            ← Imágenes de avatares
│   
│
├── .gitignore
└── README.md
```

---

## 🎮 Flujo de la Aplicación

### 1. **Login** (`index.html`)
- Usuario ingresa: nombre, género, edad, grado
- Se genera un ID único (formato: EMQ-20251016-1430-542)
- Datos se guardan en localStorage
- Redirección automática a cuestionario

### 2. **Cuestionario** (`cuestionario.html`)
- Preguntas aleatorias del banco JSON
- Filtradas según el día de la semana
- Cada respuesta asigna una emoción
- Preview del "batido emocional"
- Barra de progreso visual

### 3. **Resultados** (`resultado.html`)
- Animación de batidos mezclándose
- Licuadora en acción
- Avatar reaccionando según emoción predominante
- Mensaje personalizado

### 4. **Administración** (`admin.html`)
- Lista de participantes (sin nombres)
- Gráficos de distribución emocional
- Exportar/Importar datos en JSON
- Estadísticas agregadas

---

## 🎭 Sistema de Emociones

| Emoción | Color | Emoji | Mensaje por defecto |
|---------|-------|-------|---------|
| Alegría | #e1c03c | 😊 | "¡Tu día estuvo lleno de momentos felices!" |
| Tristeza | #4860cb | 😢 | "Has tenido momentos de melancolía." |
| Enojo | #f44339 | 😠 | "Has experimentado frustración hoy." |
| Calma | #62e85e | 😌 | "La tranquilidad te acompaña." |
| Miedo | #9746d5 | 😨 | "Hay inquietudes en tu mente." |
| Nerviosismo | #FF9A76 | 😰 | "Los nervios han estado presentes." |
| Desmotivación | #6b698c | 😔 | "Te has sentido sin energía." |
| Motivación | #9746d5 | 🤩 | "¡Tu motivación es contagiosa!" |
| Inseguridad | #c434a0 | 😕 | "Has dudado de ti mismo." |

---

## 💾 Almacenamiento de Datos

### LocalStorage Keys:

- `emotiquest_sesion_actual` - Sesión activa del usuario
- `emotiquest_respuestas` - Respuestas del cuestionario actual
- `emotiquest_historial` - Historial de sesiones completadas (anónimo)

### Formato de Datos:

```javascript
// Sesión actual
{
  id: "EMQ-20251016-1430-542",
  nombre: "Juan",
  genero: "masculino",
  edad: 15,
  grado: "9no grado",
  fechaInicio: "2025-10-16T14:30:00.000Z"
}

// Historial (sin nombres)
[
  {
    id: "EMQ-20251016-1430-542",
    genero: "masculino",
    edad: 15,
    grado: "9no grado",
    fechaInicio: "2025-10-16T14:30:00.000Z",
    fechaFin: "2025-10-16T14:35:00.000Z",
    emocionPredominante: "alegria",
    conteoEmociones: { alegria: 4, calma: 2 },
    totalRespuestas: 6
  }
]
```

---

## 🔧 Personalización

### Agregar Nuevas Preguntas

Edita `data/preguntas.json`:

```json
{
  "id": 7,
  "pregunta": "¿Cómo te sientes hoy?",
  "condicion": "siempre",
  "opciones": [
    { "texto": "Muy bien", "emocion": "alegria" },
    { "texto": "Regular", "emocion": "calma" },
    { "texto": "Mal", "emocion": "tristeza" }
  ]
}
```

### Agregar Nuevas Emociones

Edita `js/emociones.js`:

```javascript
nuevaEmocion: {
  nombre: 'Nueva Emoción',
  color: '#FF5733',
  emoji: '🎉',
  gesto: 'descripción',
  mensajes: [
    'Mensaje 1',
    'Mensaje 2'
  ]
}
```

### Cambiar Colores Globales

Edita `css/styles.css`:

```css
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  /* ... más variables */
}
```

---

## 📱 Portabilidad

### Cómo Mover a Otro Dispositivo:

1. **USB:**
   - Copia toda la carpeta `EmotiQuest`
   - Pega en el nuevo dispositivo
   - Abre `index.html`

2. **Bluetooth:**
   - Comprime la carpeta en ZIP
   - Envía por Bluetooth
   - Descomprime y abre `index.html`

3. **Red Local:**
   - Comparte la carpeta en red
   - Accede desde otro dispositivo
   - Abre `index.html`

### Migrar Datos:

1. En el dispositivo original:
   - Ve a `admin.html`
   - Click en "Exportar datos"
   - Descarga el archivo JSON

2. En el nuevo dispositivo:
   - Abre `admin.html`
   - Click en "Importar datos"
   - Selecciona el archivo JSON

---

## 🐛 Solución de Problemas

### El cuestionario no carga
- **Causa:** No hay sesión activa
- **Solución:** Vuelve a `index.html` e inicia sesión

### Las preguntas no aparecen
- **Causa:** Error al cargar `preguntas.json`
- **Solución:** Verifica que el archivo existe en `data/preguntas.json`

### Los datos no se guardan
- **Causa:** localStorage deshabilitado
- **Solución:** Habilita cookies/localStorage en tu navegador

### Las animaciones no funcionan
- **Causa:** Navegador antiguo
- **Solución:** Usa un navegador moderno (Chrome, Firefox, Edge, Safari)

---

## 🚀 Mejoras Futuras

- [ ] Modo oscuro
- [ ] Más avatares
- [ ] Sonidos de notificación
- [ ] Exportar reportes en PDF
- [ ] Gráficos interactivos
- [ ] Internacionalización (inglés/español)
- [ ] PWA (Progressive Web App)

---

## 📄 Licencia

Proyecto educativo.

---

## 👥 Créditos

- **Concepto:** Proyecto educativo EmotiQuest
- **Desarrollo:** Versión mejorada con páginas separadas
- **Año:** 2025

---

## 📞 Soporte

Para reportar bugs o sugerir mejoras, crea un issue en el repositorio.

---

**¡Disfruta descubriendo tus emociones! 🎨✨**
