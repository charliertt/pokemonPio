<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useZonesStore } from '../stores/zones'
import { useLobbyStore } from '../stores/lobby'
import { useZonePokemon } from '../composables/useZonePokemon'

const route = useRoute()
const router = useRouter()

// Stores
const zonesStore = useZonesStore()
const lobbyStore = useLobbyStore()
const { getPokemonByZone } = useZonePokemon()

// Obtener ID de la zona desde la URL
const zoneId = computed(() => Number(route.params.id))

// Obtener zona actual desde store
const currentZone = computed(() => zonesStore.getZoneById(zoneId.value))

// Verificar si está bloqueada
const isLocked = computed(() => !zonesStore.isZoneAccessible(zoneId.value))

// Obtener estado del lobby para esta zona
const lobbyState = computed(() => lobbyStore.getLobbyState(zoneId.value))

// Pok émon permitidos en esta zona
const zonePokemon = computed(() => getPokemonByZone(zoneId.value))

// Lista de entrenadores online (estática, podrías moverla a store si quieres)
const entrenadoresOnline = [
  { nombre: 'PlayerJuan', estado: 'Online' },
  { nombre: 'CodeMaster', estado: 'Buscando batalla' }
]

// Helper para obtener iniciales de NPC
function getInitials(nombre: string): string {
  return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
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
              <div v-for="npc in lobbyState.npcs" :key="npc.id" class="npc-item">
                <div class="npc-avatar-wrapper">
                  <img v-if="npc.avatarUrl" :src="npc.avatarUrl" class="npc-avatar" :alt="npc.nombre" />
                  <div v-else class="npc-avatar-fallback">{{ getInitials(npc.nombre) }}</div>
                </div>
                <div class="npc-info">
                  <span class="npc-name">{{ npc.nombre }}</span>
                  <span class="npc-rol">{{ npc.rol }}</span>
                </div>
              </div>
            </div>
            <button class="neon-btn small" @click="lobbyStore.agregarNPC(zoneId)">
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
                  :checked="lobbyState.mostrarEntrenadores"
                  @change="lobbyStore.setMostrarEntrenadores(zoneId, !lobbyState.mostrarEntrenadores)"
                  class="toggle-input"
                />
                <span class="toggle-text">Mostrar entrenadores online</span>
              </label>
            </div>
            
            <transition name="fade">
              <div v-if="lobbyState.mostrarEntrenadores" class="trainers-list">
                <div 
                  v-for="(trainer, idx) in entrenadoresOnline" 
                  :key="idx" 
                  class="trainer-item"
                >
                  <span class="trainer-name">{{ trainer.nombre }}</span>
                  <div class="trainer-status-wrapper">
                    <span :class="['ping-indicator', trainer.estado === 'Online' ? 'online' : 'searching']"></span>
                    <span class="trainer-status">{{ trainer.estado }}</span>
                  </div>
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
            
            <!-- Estado: Idle -->
            <div v-if="!lobbyState.capturaActiva" class="capture-idle">
              <button class="neon-btn" @click="lobbyStore.iniciarCaptura(zoneId)">
                Iniciar Captura
              </button>
            </div>
            
            <!-- Estado: Searching -->
            <div v-else-if="lobbyState.capturaSearching" class="capture-searching">
              <div class="capture-banner">
                <span class="capture-text">🔍 Buscando Pokémon salvaje...</span>
                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>
                <div class="loading-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <button class="neon-btn cancel" @click="lobbyStore.cancelarCaptura(zoneId)">
                Cancelar
              </button>
            </div>
            
            <!-- Estado: Found -->
            <div v-else-if="lobbyState.capturaFound && lobbyState.foundPokemon" class="capture-found">
              <p class="found-text">¡Apareció un Pokémon!</p>
              <div class="found-pokemon-card">
                <img :src="lobbyState.foundPokemon.spriteUrl" :alt="lobbyState.foundPokemon.nombre" class="pokemon-sprite" />
                <div class="pokemon-details">
                  <h4 class="pokemon-name">{{ lobbyState.foundPokemon.nombre }}</h4>
                  <span class="pokemon-type">{{ lobbyState.foundPokemon.tipo }}</span>
                  <span :class="['pokemon-rarity', lobbyState.foundPokemon.rareza.toLowerCase()]">{{ lobbyState.foundPokemon.rareza }}</span>
                </div>
              </div>
              <div class="capture-actions">
                <button class="neon-btn" @click="lobbyStore.intentarAtrapar(zoneId)">Intentar Atrapar</button>
                <button class="neon-btn cancel" @click="lobbyStore.cancelarCaptura(zoneId)">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabla de Pokémon permitidos -->
      <div v-if="zonePokemon.length > 0" class="panel pokemon-table-panel">
        <h3 class="panel-title">📋 Pokémon permitidos en esta zona</h3>
        <div class="pokemon-table">
          <div v-for="(pokemon, idx) in zonePokemon" :key="idx" class="pokemon-row">
            <img :src="pokemon.spriteUrl" :alt="pokemon.nombre" class="pokemon-sprite-small" />
            <span class="pokemon-name-small">{{ pokemon.nombre }}</span>
            <span class="pokemon-type-small">{{ pokemon.tipo }}</span>
            <span :class="['pokemon-rarity-badge', pokemon.rareza.toLowerCase().replace(' ', '-')]">{{ pokemon.rareza }}</span>
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
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(139, 146, 255, 0.2);
  transition: all 0.2s ease;
}

.npc-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(139, 146, 255, 0.2);
}

.npc-item:active {
  transform: scale(0.98);
}

.npc-avatar-wrapper {
  flex-shrink: 0;
}

.npc-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  background: rgba(0, 0, 0, 0.3);
}

.npc-avatar-fallback {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #5865f2, #8b92ff);
  color: white;
  font-family: 'Rajdhani', sans-serif;
  font-size: 11px;
  font-weight: 700;
}

.npc-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.npc-name {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  color: #fff;
  font-size: 16px;
}

.npc-rol {
  font-family: 'Rajdhani', sans-serif;
  font-size: 13px;
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
  padding: 10px 12px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(120, 200, 80, 0.3);
  transition: all 0.2s ease;
}

.trainer-item:hover {
  background: rgba(120, 200, 80, 0.15);
  transform: translateY(-1px);
}

.trainer-name {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  color: #fff;
}

.trainer-status-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trainer-status {
  font-family: 'Rajdhani', sans-serif;
  font-size: 13px;
  color: #78c850;
}

/* Ping indicators */
.ping-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  display: inline-block;
}

.ping-indicator.online {
  background: #78c850;
  box-shadow: 0 0 0 0 rgba(120, 200, 80, 1);
  animation: ping-online 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.ping-indicator.searching {
  background: #f5a623;
  box-shadow: 0 0 0 0 rgba(245, 166, 35, 1);
  animation: ping-searching 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping-online {
  75%, 100% {
    box-shadow: 0 0 0 8px rgba(120, 200, 80, 0);
  }
}

@keyframes ping-searching {
  75%, 100% {
    box-shadow: 0 0 0 8px rgba(245, 166, 35, 0);
  }
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
.capture-searching,
.capture-found {
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

/* Progress bar */
.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;
  margin: 12px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #78c850, #a0e870);
  border-radius: 3px;
  animation: progress-fill 2.5s ease-in-out;
  box-shadow: 0 0 8px rgba(120, 200, 80, 0.6);
}

@keyframes progress-fill {
  from { width: 0%; }
  to { width: 100%; }
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

/* Found Pokemon */
.found-text {
  font-family: 'Rajdhani', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #78c850;
  margin: 0 0 16px 0;
  animation: found-glow 1s ease-in-out;
}

@keyframes found-glow {
  0%, 100% { text-shadow: 0 0 10px rgba(120, 200, 80, 0.6); }
  50% { text-shadow: 0 0 20px rgba(120, 200, 80, 1); }
}

.found-pokemon-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid #78c850;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  animation: card-appear 0.3s ease-out;
}

@keyframes card-appear {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.pokemon-sprite {
  width: 80px;
  height: 80px;
  image-rendering: pixelated;
}

.pokemon-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pokemon-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.pokemon-type {
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  color: #8b92ff;
}

.pokemon-rarity {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.pokemon-rarity.común { background: #888; color: #fff; }
.pokemon-rarity.raro { background: #5865f2; color: #fff; }
.pokemon-rarity.muy-raro { background: #f5a623; color: #fff; }

.capture-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}

.capture-actions .neon-btn {
  flex: 1;
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

/* --- Pokémon Table --- */
.pokemon-table-panel {
  margin-top: 24px;
  
  width: 100%;
}

.pokemon-table {
  display: grid;
  gap: 8px;
}

.pokemon-row {
  display: grid;
  grid-template-columns: 50px 1fr 120px 100px;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(139, 146, 255, 0.15);
  transition: all 0.2s ease;
}

.pokemon-row:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(139, 146, 255, 0.2);
}

.pokemon-sprite-small {
  width: 40px;
  height: 40px;
  image-rendering: pixelated;
}

.pokemon-name-small {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  color: #fff;
  font-size: 16px;
}

.pokemon-type-small {
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  color: #8b92ff;
}

.pokemon-rarity-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
}

.pokemon-rarity-badge.común { background: #888; color: #fff; }
.pokemon-rarity-badge.raro { background: #5865f2; color: #fff; }
.pokemon-rarity-badge.muy-raro { background: #f5a623; color: #fff; }

@media (max-width: 600px) {
  .pokemon-row {
    grid-template-columns: 40px 1fr 80px;
  }
  
  .pokemon-type-small {
    display: none;
  }
}

/* --- Premium Microinteractions --- */
.neon-btn:hover,
.action-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 16px rgba(88, 101, 242, 0.5);
}

.neon-btn:active,
.action-btn:active {
  transform: scale(0.98);
}

.panel {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* --- Accessibility: Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .ping-indicator {
    animation: none !important;
  }
  
  .progress-fill {
    animation: none !important;
    width: 100%;
  }
}
</style>
