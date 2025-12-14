<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header>
      <div class="logo-area">
        <h1 class="title">⚡ POKÉDEX MMO-LITE</h1>
        <p class="subtitle">Colección de Pokémon</p>
      </div>

      <nav>
        <RouterLink to="/">Colección</RouterLink>
        <RouterLink to="/map">Mapa de Zonas</RouterLink>
      </nav>
    </header>

    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  width: 100%;
  background: #050509;
  background-image: 
    radial-gradient(ellipse at 20% 30%, rgba(88, 101, 242, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 50%);
  display: flex;
  flex-direction: column;
  padding: 40px 20px;
  position: relative;
  overflow-x: hidden;
}

header {
  text-align: center;
  margin-bottom: 40px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.title {
  font-family: 'Orbitron', sans-serif;
  font-size: 56px;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 
    0 0 20px rgba(88, 101, 242, 0.6),
    0 0 40px rgba(88, 101, 242, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.8);
  margin: 0;
  letter-spacing: 4px;
  text-transform: uppercase;
  animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 
      0 0 20px rgba(88, 101, 242, 0.6),
      0 0 40px rgba(88, 101, 242, 0.4),
      0 4px 8px rgba(0, 0, 0, 0.8);
  }
  to {
    text-shadow: 
      0 0 30px rgba(88, 101, 242, 0.8),
      0 0 60px rgba(88, 101, 242, 0.5),
      0 4px 8px rgba(0, 0, 0, 0.8);
  }
}

.subtitle {
  font-family: 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #8b92ff;
  margin-top: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
}

nav {
  display: flex;
  gap: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

nav a {
  color: #8b92ff;
  text-decoration: none;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 16px;
  padding: 8px 24px;
  border-radius: 25px;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

nav a:hover {
  color: #fff;
  background: rgba(88, 101, 242, 0.2);
}

nav a.router-link-active {
  color: #fff;
  background: #5865f2;
  box-shadow: 0 0 15px rgba(88, 101, 242, 0.5);
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .title {
    font-size: 36px;
    letter-spacing: 2px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  header {
    margin-bottom: 30px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 28px;
  }
}
</style>
