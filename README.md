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

## 🧩 Tecnologías Utilizadas

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

Layout responsive (desktop / mobile)

<img width="990" height="556" alt="image" src="https://github.com/user-attachments/assets/38ae6a8a-2604-4cef-b5df-ce93b106dc99" />
<img width="1099" height="580" alt="image" src="https://github.com/user-attachments/assets/383d510f-e8c7-4743-b8f6-457730cfd139" />
<img width="970" height="589" alt="image" src="https://github.com/user-attachments/assets/ba49a647-0691-4e10-838d-9f87dcb95f09" />



