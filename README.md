# Pokédex MMO-Lite

Proyecto académico desarrollado en **Vue 3** como parte de un diplomado frontend.  
El objetivo es construir una aplicación tipo **Pokémon MMO-Lite**, aplicando conceptos clave de componentes reutilizables, estado reactivo y navegación con Vue Router, con una UI inspirada en juegos y plataformas educativas (estilo Duolingo).

---

## Descripción del Proyecto

Pokédex MMO-Lite es una aplicación frontend que simula la estructura base de un juego Pokémon multizona.  
El proyecto evoluciona por actividades, cada una agregando nuevas funcionalidades y complejidad:

- Mapa interactivo de zonas
- Componentes reutilizables (cards)
- Lobbies dinámicos por zona
- Manejo de estado interno y reactivo
- Navegación entre vistas con Vue Router

El diseño sigue una estética **dark/neón**, con tarjetas (cards) limpias, bordes redondeados y una jerarquía visual clara.

---

##  Tecnologías Utilizadas

- **Vue 3**
- **Composition API**
- **Vue Router**
- JavaScript (ES6+)
- CSS (sin frameworks externos)
- Vite

---

## Estructura del Proyecto

```txt
src/
├── components/
│   ├── PokemonCard.vue
│   ├── ZoneNode.vue
│   └── NeonPanel.vue
│
├── views/
│   ├── MapView.vue
│   ├── ZoneView.vue
│   ├── MissionsView.vue
│   └── PvpView.vue
│
├── router/
│   └── index.js
│
├── App.vue
└── main.js

Diseño y UI

Tema oscuro con detalles neón (verde / azul)

Cards con:

Border-radius: 12px

Bordes suaves

Glow sutil

Botones con hover ligero






