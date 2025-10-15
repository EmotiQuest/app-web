# 🎭 EmotiQuest

**EmotiQuest** es una aplicación web educativa e interactiva diseñada para representar emociones a través de preguntas, colores y animaciones.  
Su objetivo es fomentar el reconocimiento emocional en un entorno lúdico y visualmente atractivo.

---

## 🌈 Características principales

- Dos perfiles de usuario:
  - **Participante:** responde preguntas, genera emociones y observa un avatar con gestos personalizados.
  - **Administrador:** visualiza reportes anónimos de las respuestas y emociones predominantes.
- Sistema de login **falso** (sin autenticación real).
- Totalmente **funcional sin conexión**.
- **LocalStorage** como base de datos local.
- **Sin frameworks ni dependencias externas** (100% HTML, CSS y JavaScript Vanilla).
- **Diseño responsive** y portable.

---

## 📁 Estructura del proyecto
/EmotiQuest
│
├── index.html # Pantalla de login
├── cuestionario.html # Preguntas y respuestas
├── resultado.html # Resultados y animaciones
├── admin.html # Reporte del administrador
│
├── /css
│ ├── styles.css # Estilos base
│ ├── animations.css # Animaciones del batido/licuadora
│ └── responsive.css # Ajustes para móvil
│
├── /js
│ ├── login.js # Lógica de login falso
│ ├── cuestionario.js # Lógica del cuestionario
│ ├── licuadora.js # Animación de licuadora
│ ├── avatar.js # Gesto del avatar
│ ├── admin.js # Reporte del perfil 2
│ ├── storage.js # Manejo de LocalStorage
│ └── emociones.js # Asignación de emociones
│
├── /data
│ ├── preguntas.json # Banco de preguntas
│ └── emociones.json # Colores y gestos
│
├── /assets
│ ├── avatars/ # Avatares por género
│ ├── canva/ # Elementos del diseño original
│ └── licuadora/ # Elementos visuales animados
│
└── README.md


🔒 Privacidad

Este proyecto no almacena información personal identificable.
Los reportes son anónimos y se basan únicamente en:

ID generado automáticamente.

Edad, género y grado.

Resultados emocionales.

🧑‍💻 Tecnologías utilizadas

HTML5

CSS3 / Animaciones @keyframes

JavaScript Vanilla

LocalStorage API

❤️ Créditos

Proyecto desarrollado como parte del programa educativo EmotiQuest para estudiantes del Tecnologico Comfenalco.
Inspirado en la expresión emocional y el aprendizaje visual como parte de la solucion del proyecto de curso de la carrera de Trabajo Social.
Diseño original adaptado desde Canva por estudiantes del programa de Trabajo Social.
Desarrollado por estudiantes de Ingenieria de sistemas de la Universidad de Cartagena
