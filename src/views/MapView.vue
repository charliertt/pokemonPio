<script setup lang="ts">
import { useRouter } from 'vue-router'
import ZoneNode from '../components/ZoneNode.vue'
import { useZonesStore } from '../stores/zones'

const router = useRouter()
const zonesStore = useZonesStore()

// Lógica para desbloquear zona y avanzar
const handleCompleteZone = (id: number) => {
  zonesStore.completeZone(id)
}

// Navegación segura
const handleZoneClick = (id: number) => {
  if (zonesStore.isZoneAccessible(id)) {
    router.push(`/zone/${id}`)
  }
}

// Helper para posición visual (zig-zag)
const getPosition = (index: number): 'left' | 'center' | 'right' => {
  const pattern = ['center', 'right', 'center', 'left']
  return pattern[index % 4] as 'left' | 'center' | 'right'
}
</script>

<template>
  <div class="map-view">
    <h2 class="section-title">Mapa de Zonas</h2>
    <p class="section-subtitle">Explora las zonas y completa desafíos</p>
    
    <div class="map-container">
      <ZoneNode
        v-for="(zona, index) in zonesStore.zonas"
        :key="zona.id"
        :id="zona.id"
        :nombre="zona.nombre"
        :nivel-recomendado="zona.nivelRecomendado"
        :estado="zona.estado"
        :position="getPosition(index)"
        @click="handleZoneClick"
        @complete="handleCompleteZone"
      />
    </div>
    
    <!-- Botón de reset discreto -->
    <button class="reset-btn" @click="zonesStore.resetProgress" title="Resetear todo el progreso">
      🔄 Reset Progress
    </button>
  </div>
</template>

<style scoped>
.map-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.section-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 0 0 10px rgba(88, 101, 242, 0.4);
}

.section-subtitle {
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  color: #8b92ff;
  margin-bottom: 40px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.map-container {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* --- Reset Button --- */
.reset-btn {
  margin-top: 40px;
  padding: 10px 20px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 6px;
  color: #ff6b6b;
  font-family: 'Rajdhani', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.reset-btn:hover {
  opacity: 1;
  background: rgba(255, 107, 107, 0.15);
  border-color: #ff6b6b;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.2);
}

.reset-btn:active {
  transform: scale(0.98);
}
</style>
