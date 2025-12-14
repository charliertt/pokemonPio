<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Obtener ID de la zona desde la URL
const zoneId = computed(() => Number(route.params.id))

// Simular datos de zonas (deberías compartir esto con MapView idealmente)
const zonesData = [
  { id: 1, nombre: 'Bosque Verde', estado: 'unlocked' },
  { id: 2, nombre: 'Cueva Oscura', estado: 'locked' },
  { id: 3, nombre: 'Monte Plateado', estado: 'locked' },
  { id: 4, nombre: 'Lago Cristalino', estado: 'locked' },
  { id: 5, nombre: 'Torre Final', estado: 'locked' }
]

// Obtener zona actual
const currentZone = computed(() => zonesData.find(z => z.id === zoneId.value))

// Verificar si está bloqueada
const isLocked = computed(() => currentZone.value?.estado === 'locked')

// --- A) NPCs de la zona ---
interface NPC {
  id: number
  nombre: string
  rol: string
}

const npcs = reactive<NPC[]>([
  { id: 1, nombre: 'Prof. Roble', rol: 'Investigador' },
  { id: 2, nombre: 'Líder Flama', rol: 'Líder de Gimnasio' }
])

let npcCounter = 3

const agregarNPC = () => {
  npcs.push({
    id: npcCounter++,
    nombre: `Visitante #${npcCounter - 2}`,
    rol: 'Explorador'
  })
}

// --- B) Entrenadores online ---
const mostrarEntrenadores = ref(false)

const entrenadoresOnline = [
  { nombre: 'PlayerJuan', estado: 'Online' },
  { nombre: 'CodeMaster', estado: 'Buscando batalla' }
]

// --- C) Captura Pokémon ---
const capturaActiva = ref(false)

const iniciarCaptura = () => {
  capturaActiva.value = true
}

const cancelarCaptura = () => {
  capturaActiva.value = false
}

// --- Navegación ---
const irAMisiones = () => {
  router.push(`/missions?zone=${zoneId.value}`)
}

const irAPVP = () => {
  router.push('/pvp')
}

const volverAlMapa = () => {
  router.push('/map')
}
</script>

<template>
  <div class="zone-lobby">
    <!-- Si la zona está bloqueada -->
    <div v-if="isLocked" class="locked-panel">
      <div class="locked-content">
        <h2 class="locked-title">🔒 Zona Bloqueada</h2>
        <p class="locked-text">Debes completar las zonas anteriores para acceder aquí.</p>
        <button class="neon-btn" @click="volverAlMapa">Volver al Mapa</button>
      </div>
    </div>

    <!-- Si la zona está desbloqueada -->
    <div v-else class="lobby-content">
      <!-- Header -->
      <header class="lobby-header">
        <h1 class="lobby-title">Zone Lobby</h1>
        <p class="lobby-subtitle">
          Zona: {{ currentZone?.nombre || 'Desconocida' }} (ID: {{ zoneId }})
        </p>
      </header>

      <!-- Layout de 2 columnas -->
      <div class="lobby-grid">
        <!-- Columna Izquierda -->
        <div class="left-column">
          <!-- Panel NPCs -->
          <div class="panel npc-panel">
            <h3 class="panel-title">👥 NPCs de la Zona</h3>
            <div class="npc-list">
              <div v-for="npc in npcs" :key="npc.id" class="npc-item">
                <span class="npc-name">{{ npc.nombre }}</span>
                <span class="npc-rol">{{ npc.rol }}</span>
              </div>
            </div>
            <button class="neon-btn small" @click="agregarNPC">
              + Agregar NPC Visitante
            </button>
          </div>

          <!-- Panel Entrenadores Online -->
          <div class="panel trainers-panel">
            <h3 class="panel-title">🌐 Entrenadores Online</h3>
            <div class="toggle-container">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  v-model="mostrarEntrenadores"
                  class="toggle-input"
                />
                <span class="toggle-text">Mostrar entrenadores online</span>
              </label>
            </div>
            
            <transition name="fade">
              <div v-if="mostrarEntrenadores" class="trainers-list">
                <div 
                  v-for="(trainer, idx) in entrenadoresOnline" 
                  :key="idx" 
                  class="trainer-item"
                >
                  <span class="trainer-name">{{ trainer.nombre }}</span>
                  <span class="trainer-status">{{ trainer.estado }}</span>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Columna Derecha -->
        <div class="right-column">
          <!-- Panel Acciones -->
          <div class="panel actions-panel">
            <h3 class="panel-title">⚔️ Acciones</h3>
            <div class="actions-grid">
              <button class="action-btn" @click="irAMisiones">
                📜 Ver Misiones
              </button>
              <button class="action-btn" @click="irAPVP">
                ⚔️ Ir a PVP
              </button>
              <button class="action-btn back" @click="volverAlMapa">
                🗺️ Volver al Mapa
              </button>
            </div>
          </div>

          <!-- Panel Captura -->
          <div class="panel capture-panel">
            <h3 class="panel-title">🎯 Captura Pokémon</h3>
            
            <div v-if="!capturaActiva" class="capture-idle">
              <button class="neon-btn" @click="iniciarCaptura">
                Iniciar Captura
              </button>
            </div>
            
            <div v-else class="capture-active">
              <div class="capture-banner">
                <span class="capture-text">🔍 Buscando Pokémon salvaje...</span>
                <div class="loading-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <button class="neon-btn cancel" @click="cancelarCaptura">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@600;700&display=swap');

.zone-lobby {
  width: 100%;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* --- Zona Bloqueada --- */
.locked-panel {
  max-width: 500px;
  width: 100%;
  margin-top: 80px;
}

.locked-content {
  background: #1a1a1a;
  border: 2px solid #ff6b6b;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
}

.locked-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 28px;
  color: #fff;
  margin-bottom: 16px;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
}

.locked-text {
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  color: #aaa;
  margin-bottom: 24px;
}

/* --- Lobby Desbloqueado --- */
.lobby-content {
  width: 100%;
  max-width: 1200px;
}

.lobby-header {
  text-align: center;
  margin-bottom: 40px;
}

.lobby-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 42px;
  font-weight: 900;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 0 15px rgba(88, 101, 242, 0.6);
}

.lobby-subtitle {
  font-family: 'Rajdhani', sans-serif;
  font-size: 18px;
  color: #8b92ff;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* --- Grid Layout --- */
.lobby-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* --- Paneles --- */
.panel {
  background: #1a1a1a;
  border: 2px solid #8b92ff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 0 15px rgba(139, 146, 255, 0.2);
  transition: all 0.3s ease;
}

.panel:hover {
  box-shadow: 0 0 20px rgba(139, 146, 255, 0.4);
}

.panel-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  text-shadow: 0 0 8px rgba(139, 146, 255, 0.4);
}

/* --- NPCs --- */
.npc-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.npc-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(139, 146, 255, 0.2);
}

.npc-name {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  color: #fff;
  font-size: 16px;
}

.npc-rol {
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  color: #8b92ff;
}

/* --- Toggle Entrenadores --- */
.toggle-container {
  margin-bottom: 16px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.toggle-input {
  width: 50px;
  height: 26px;
  appearance: none;
  background: #444;
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-input:checked {
  background: #78c850;
}

.toggle-input::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  top: 3px;
  left: 3px;
  transition: transform 0.3s;
}

.toggle-input:checked::before {
  transform: translateX(24px);
}

.toggle-text {
  font-family: 'Rajdhani', sans-serif;
  color: #aaa;
  font-size: 16px;
}

.trainers-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trainer-item {
  background: rgba(120, 200, 80, 0.1);
  padding: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  border: 1px solid rgba(120, 200, 80, 0.3);
}

.trainer-name {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  color: #fff;
}

.trainer-status {
  font-family: 'Rajdhani', sans-serif;
  font-size: 13px;
  color: #78c850;
}

/* --- Acciones --- */
.actions-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  padding: 14px;
  background: linear-gradient(90deg, #5865f2, #8b92ff);
  border: none;
  border-radius: 8px;
  color: white;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 0 10px rgba(88, 101, 242, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(88, 101, 242, 0.5);
}

.action-btn.back {
  background: linear-gradient(90deg, #666, #888);
}

/* --- Captura --- */
.capture-panel {
  border-color: #78c850;
  box-shadow: 0 0 15px rgba(120, 200, 80, 0.2);
}

.capture-idle,
.capture-active {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.capture-banner {
  background: rgba(120, 200, 80, 0.1);
  border: 2px solid #78c850;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 100%;
}

.capture-text {
  font-family: 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #78c850;
  display: block;
  margin-bottom: 12px;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #78c850;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* --- Botones Neón --- */
.neon-btn {
  padding: 12px 24px;
  background: linear-gradient(90deg, #5865f2, #8b92ff);
  border: none;
  border-radius: 8px;
  color: white;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 0 10px rgba(88, 101, 242, 0.3);
}

.neon-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(88, 101, 242, 0.5);
}

.neon-btn.small {
  padding: 8px 16px;
  font-size: 14px;
  width: 100%;
}

.neon-btn.cancel {
  background: linear-gradient(90deg, #888, #aaa);
}

/* --- Transiciones --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .lobby-grid {
    grid-template-columns: 1fr;
  }

  .lobby-title {
    font-size: 32px;
  }
}
</style>
