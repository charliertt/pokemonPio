<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import ZoneNode from '../components/ZoneNode.vue'

const router = useRouter()

// Definición de tipos
type ZoneState = 'locked' | 'unlocked' | 'completed'

interface Zone {
  id: number
  nombre: string
  nivelRecomendado: number
  estado: ZoneState
}

// Estado reactivo del mapa
const mapState = reactive({
  zonas: [
    { id: 1, nombre: 'Bosque Verde', nivelRecomendado: 5, estado: 'unlocked' },
    { id: 2, nombre: 'Cueva Oscura', nivelRecomendado: 10, estado: 'locked' },
    { id: 3, nombre: 'Monte Plateado', nivelRecomendado: 15, estado: 'locked' },
    { id: 4, nombre: 'Lago Cristalino', nivelRecomendado: 20, estado: 'locked' },
    { id: 5, nombre: 'Torre Final', nivelRecomendado: 25, estado: 'locked' }
  ] as Zone[]
})

// Lógica para desbloquear zona y avanzar
const handleCompleteZone = (id: number) => {
  const currentIndex = mapState.zonas.findIndex(z => z.id === id)
  if (currentIndex === -1) return

  // Marcar actual como completada
  mapState.zonas[currentIndex].estado = 'completed'

  // Desbloquear siguiente si existe
  if (currentIndex + 1 < mapState.zonas.length) {
    if (mapState.zonas[currentIndex + 1].estado === 'locked') {
      mapState.zonas[currentIndex + 1].estado = 'unlocked'
    }
  }
}

// Navegación segura
const handleZoneClick = (id: number) => {
  const zona = mapState.zonas.find(z => z.id === id)
  if (zona && zona.estado !== 'locked') {
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
        v-for="(zona, index) in mapState.zonas"
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
</style>
