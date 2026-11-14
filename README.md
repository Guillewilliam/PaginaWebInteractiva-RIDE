# RIDE — PONTE EN MARCHA
## Plataforma Web Interactiva de Movilidad Sostenible y Cartografía Ciclista
### IES José María Infantes («El Pastorcito») — Utrera (Sevilla)

> **Candidatura al IX Concurso Escolar «Ponte en Marcha»**  
> *«Circula con respeto / Disfruta del camino / Aprende y colabora / Construye tu futuro»*

---

## 🚴 Descripción del Proyecto

**RIDE** es una experiencia digital e interactiva basada en la memoria educativa del **IES José María Infantes** de Utrera. La web articula todas las evidencias del proyecto alrededor de un **mapa interactivo de Utrera**, combinando ortofotografía aérea de alta resolución (estilo Google Earth), callejero vectorial, rutas escolares, catálogo de las 9 bicicletas recuperadas en el **Ciclotaller Solidario Bartali** y un **álbum fotográfico editorial tipo bitácora**.

El acrónimo **RIDE** representa los 4 pilares fundamentales de la campaña:
- **R (Respeto / Respect):** Convivencia positiva entre peatones, ciclistas y conductores.
- **I (Inclusión / Inclusion):** Acceso universal a la bicicleta para todo el alumnado mediante donaciones y préstamos.
- **D (Diversión / Discovery):** Aprendizaje vivencial, ocio activo y descubrimiento del entorno.
- **E (Entorno / Environment):** Cuidado del medio ambiente, reducción de emisiones y vida saludable.

---

## 🗺️ Elemento Principal: El Mapa de Utrera

El mapa interactivo se ha construido con **Leaflet.js** y almacena las rutas en **GeoJSON desacoplado**:

### Clasificación Metodológica de las Vías (Memoria Pág. 10):
- <span style="color:#27ae60; font-weight:bold;">● VERDE (Carriles bici protegidos):</span> Segregados del tráfico motorizado y peatonal (*Paseo de Consolación*, *Puerta Verde de Utrera*, *Ruta El Junquillo*).
- <span style="color:#2980b9; font-weight:bold;">● AZUL (Carriles sobre la acera):</span> Señalizados sobre el pavimento peatonal (*Avenida de Portugal*, *Ruta Los Militares*, *Ruta Los Molinos*, *Ruta Masa Crítica*).
- <span style="color:#e74c3c; font-weight:bold;">● ROJO (Zonas 30 compartidas):</span> Calzadas pacificadas de coexistencia (*Centro Histórico Gibaxa - Corredera - Altozano*, *Ruta 1 Centro*, *Ruta 3 Renfe*).
- <span style="color:#111111; font-weight:bold;">● NEGRO (Tramos peligrosos / solicitados):</span> Puntos negros de red (*Calle Antonio Machado y Calle Jilguero* —solicitados al Ayuntamiento— y *Glorieta A-394 Este*).

### Funciones Interactivas del Mapa:
- **Conmutador Aéreo / Callejero:** Permite alternar entre la ortofoto satelital de alta resolución (*Esri World Imagery*) y el callejero urbano (*CartoDB Voyager*).
- **Efecto Foco y Atenuación:** Al hacer clic en cualquier ruta o seleccionarla en el menú, la polilínea elegida se resalta con brillo propio y grosor reforzado, mientras el resto de rutas se atenúan al 18% de opacidad.
- **Tarjeta Contextual Flotante:** Muestra longitud, dificultad, procedencia oficial, la cita literal de la memoria y el consejo del **Decálogo RIDE** de cortesía vial.
- **Filtro de Capas en Leyenda:** Las 4 casillas de la leyenda permiten activar o desactivar independientemente los carriles verdes, azules, rojos o negros.
- **Puntos de Interés (POIs):** Marcadores para el *IES José María Infantes*, el *Ayuntamiento de Utrera*, el *Ciclotaller Bartali*, el *Paseo de Consolación*, el *Parque del Quinto Centenario*, la *Estación Renfe*, la *Plaza del Altozano* y el *Punto Peligroso Machado-Jilguero*.

---

## 🔧 Ciclotaller Solidario Bartali

Homenaje al ciclista **Gino Bartali**, héroe silencioso de la Resistencia durante la Segunda Guerra Mundial:
- **Casi 50 bicicletas donadas** por familias y comunidad educativa.
- **9 bicicletas puestas a punto** por alumnado voluntario en los *recreos activos*, disponibles en préstamo.
- **Las 9 leyendas simbólicas bautizadas por el alumnado de «El Pastorcito»:**
  1. *Nº 1:* «Bicicleta salvada del olvido por el alumnado de El Pastorcito»
  2. *Nº 2:* «Bicicleta resucitada por el alumnado del José María Infantes»
  3. *Nº 3:* «Bicicleta rescatada de la obsolescencia por el alumnado de El Pastorcito»
  4. *Nº 4:* «Del rincón del olvido a las calles del futuro gracias al alumnado de El Pastorcito»
  5. *Nº 5:* «Donde algunos veían un trasto otros vieron una segunda oportunidad»
  6. *Nº 6:* «De chatarra a compañera de aventuras gracias al alumnado de El Pastorcito»
  7. *Nº 7:* «Una segunda vida sobre ruedas gracias al esfuerzo del alumnado de El Pastorcito»
  8. *Nº 8:* «Esta bicicleta volvió a rodar gracias al trabajo del alumnado de El Pastorcito»
  9. *Nº 9:* «Bicicleta rescatada del abandono gracias al alumnado de El Pastorcito»

---

## 📸 Álbum de Experiencias RIDE (Galería Editorial)

- Estética scrapbook con tarjetas polaroid, cintas washi tape y sellos temáticos.
- Fotografías reales extraídas de la memoria: logotipo de Cristina Aparicio, roll-up institucional, cartel ganador de Yaiza Rodríguez, tríptico, fotos del taller mecánico, masa crítica con 59 alumnos, stand y circuito de INFATUR, recepción en el Ayuntamiento con los concejales y movilidades en Alemania.
- **Visor Lightbox:** Con navegación por teclado (`←`, `→`, `Esc`), botones Anterior/Siguiente y contador dinámico.

---

## 📂 Estructura del Código

```
ProyectoMAMAWEB/
├── index.html                     # Entrada principal de la aplicación
├── package.json                   # Metadatos del proyecto y scripts
├── README.md                      # Documentación completa
│
├── css/
│   ├── styles.css                 # Paleta RIDE, reset, tipografías y HUD superior
│   ├── map.css                    # Estilos del mapa Leaflet, controles flotantes y leyenda
│   ├── panels.css                 # Slide-over drawer, actividades, Bartali y modales
│   ├── gallery.css                # Álbum editorial scrapbook y visor Lightbox
│   └── responsive.css             # Adaptación móvil (<768px) y tablet (<1024px)
│
├── js/
│   ├── main.js                    # Orquestador y arranque modular
│   ├── navigation.js              # Controlador de vistas, menús y modales
│   ├── map.js                     # Motor cartográfico Leaflet, capas y lógica de foco
│   ├── activities.js              # Carga y renderizado de las 12 actividades
│   ├── bartali.js                 # Catálogo interactivo de las 9 bicicletas
│   └── gallery.js                 # Galería polaroid con navegación Lightbox
│
├── data/
│   ├── activities.json            # Base de datos de las 12 actividades documentadas
│   ├── bikes_bartali.json         # Las 9 bicicletas restauradas y sus leyendas
│   ├── routes.geojson             # 12 rutas y tramos cartográficos con metadatos
│   └── points.geojson             # 8 puntos de interés emblemáticos de Utrera
│
└── assets/
    ├── images/                    # 11 imágenes y fotos auténticas en alta resolución
    └── maps/                      # Cartografía urbana de referencia
```

---

## 🚀 Cómo Ejecutar la Web Localmente

La aplicación está construida con **HTML5, CSS3 y JavaScript ES6 Modules estándar**, por lo que **no requiere instalación previa de paquetes pesados ni procesos de compilación**.

### Opción 1: Con Python (Cualquier sistema operativo)
Abre un terminal en la carpeta del proyecto y ejecuta:
```bash
python -m http.server 8080
```
Luego abre tu navegador en:  
`http://localhost:8080`

### Opción 2: Con Node / npx
```bash
npx serve -l 8080
```
Luego abre tu navegador en:  
`http://localhost:8080`

### Opción 3: Con la extensión Live Server de VS Code
Haz clic derecho en `index.html` y selecciona **«Open with Live Server»**.

---

## 👥 Créditos del Proyecto

- **Coordinación:** Lucía Nieto Sánchez y Daniel Fernández Postigo.
- **Centro Educativo:** IES José María Infantes («El Pastorcito»), Utrera (Sevilla).
- **Diseño del Logotipo Oficial:** Cristina Aparicio (1º Bachillerato de Arte).
- **Diseño del Cartel del Concurso:** Yaiza Rodríguez (3º ESO).
- **Profesorado y Comunidad Participante:** Jesús Sánchez Espín, Mª Isabel Cabello Conejo, José Galán Molina, Pablo Ocaña Gil, Pablo Ocaña González, Antonio Medina, Elena Patricia Yerpes Arenas, Beatriz López Escobar Rituerto, Miriam Morillo Terrino, Francisco Javier Marchena Alba, Ana María Guzmán Tenorio, Miguel Peña Gallardo, María Beatriz Hurtado Molina, Rafael Camacho López, Laura María Fernández González, Macarena Piña Rodríguez, Elizabeth Pozo Núñez, Montserrat Donaire.

---

## 📄 Licencia

Este proyecto educativo está distribuido bajo licencia **Creative Commons Reconocimiento - NoComercial - CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)**.

