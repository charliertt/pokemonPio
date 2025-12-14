<script setup lang="ts">
import { computed } from 'vue'

// Definir las props que recibe el componente
interface Props {
  nombre: string
  sprite: string
  tipo: string
}

const props = defineProps<Props>()

// Función para obtener el color según el tipo de Pokémon
const getTypeColor = computed(() => {
  const tipo = props.tipo.toLowerCase()
  
  const typeColors: Record<string, { border: string, glow: string, badge: string }> = {
    'eléctrico': { 
      border: '#f7d02c', 
      glow: 'rgba(247, 208, 44, 0.4)',
      badge: 'linear-gradient(135deg, #f7d02c 0%, #f39c12 100%)'
    },
    'fuego': { 
      border: '#ff6b35', 
      glow: 'rgba(255, 107, 53, 0.4)',
      badge: 'linear-gradient(135deg, #ff6b35 0%, #e74c3c 100%)'
    },
    'agua': { 
      border: '#4a90e2', 
      glow: 'rgba(74, 144, 226, 0.4)',
      badge: 'linear-gradient(135deg, #4a90e2 0%, #3498db 100%)'
    },
    'planta': { 
      border: '#78c850', 
      glow: 'rgba(120, 200, 80, 0.4)',
      badge: 'linear-gradient(135deg, #78c850 0%, #27ae60 100%)'
    },
    'veneno': { 
      border: '#a040a0', 
      glow: 'rgba(160, 64, 160, 0.4)',
      badge: 'linear-gradient(135deg, #a040a0 0%, #8e44ad 100%)'
    }
  }
  
  // Si el tipo contiene "planta / veneno", usar color de planta
  if (tipo.includes('planta')) return typeColors['planta']
  if (tipo.includes('veneno')) return typeColors['veneno']
  
  return typeColors[tipo] || { 
    border: '#8b92ff', 
    glow: 'rgba(139, 146, 255, 0.4)',
    badge: 'linear-gradient(135deg, #8b92ff 0%, #5865f2 100%)'
  }
})
</script>

<template>
  <div class="pokemon-card" :style="{ 
    '--type-color': getTypeColor.border,
    '--type-glow': getTypeColor.glow,
    '--type-badge': getTypeColor.badge
  }">
    <div class="card-glow"></div>
    
    <div class="card-header">
      <h2 class="pokemon-name">{{ nombre.toUpperCase() }}</h2>
    </div>
    
    <div class="sprite-container">
      <div class="sprite-background"></div>
      <img :src="sprite" :alt="nombre" class="pokemon-sprite" />
    </div>
    
    <div class="card-footer">
      <div class="type-badge">
        <span class="type-label">{{ tipo.toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&display=swap');

.pokemon-card {
  width: 280px;
  border-radius: 16px;
  overflow: hidden;
  background: #1a1a1a;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 0 2px var(--type-color),
    0 0 20px var(--type-glow);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  border: 2px solid var(--type-color);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--type-glow) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.pokemon-card:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.8),
    0 0 0 3px var(--type-color),
    0 0 40px var(--type-glow),
    0 0 60px var(--type-glow);
}

.pokemon-card:hover .card-glow {
  opacity: 0.6;
}

.card-header {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  padding: 20px 16px;
  border-bottom: 2px solid var(--type-color);
  position: relative;
  z-index: 2;
}

.pokemon-name {
  margin: 0;
  font-family: 'Rajdhani', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  text-shadow: 
    0 0 10px var(--type-glow),
    0 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
}

.sprite-container {
  background: #141414;
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  position: relative;
  overflow: hidden;
}

.sprite-background {
  position: absolute;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, var(--type-glow) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0.3;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}

.pokemon-sprite {
  width: 140px;
  height: 140px;
  image-rendering: pixelated;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6));
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  z-index: 2;
}

.pokemon-card:hover .pokemon-sprite {
  transform: scale(1.15) translateY(-4px);
  filter: 
    drop-shadow(0 12px 24px rgba(0, 0, 0, 0.8))
    drop-shadow(0 0 20px var(--type-glow));
}

.card-footer {
  background: linear-gradient(135deg, #1f1f1f 0%, #141414 100%);
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 2;
}

.type-badge {
  background: var(--type-badge);
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.pokemon-card:hover .type-badge {
  transform: scale(1.05);
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0 20px var(--type-glow);
}

.type-label {
  display: block;
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .pokemon-card {
    width: 260px;
  }
  
  .pokemon-name {
    font-size: 22px;
  }
  
  .sprite-container {
    padding: 28px;
    min-height: 180px;
  }
  
  .pokemon-sprite {
    width: 120px;
    height: 120px;
  }
  
  .sprite-background {
    width: 120px;
    height: 120px;
  }
}

@media (max-width: 480px) {
  .pokemon-card {
    width: 240px;
  }
  
  .pokemon-name {
    font-size: 20px;
  }
  
  .sprite-container {
    padding: 24px;
    min-height: 160px;
  }
  
  .pokemon-sprite {
    width: 100px;
    height: 100px;
  }
  
  .sprite-background {
    width: 100px;
    height: 100px;
  }
  
  .type-label {
    font-size: 12px;
  }
}
</style>
