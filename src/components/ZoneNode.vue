<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: number
  nombre: string
  nivelRecomendado: number
  estado: 'locked' | 'unlocked' | 'completed'
  position: 'left' | 'center' | 'right'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'click', id: number): void
  (e: 'complete', id: number): void
}>()

const isLocked = computed(() => props.estado === 'locked')
const isCompleted = computed(() => props.estado === 'completed')
const isUnlocked = computed(() => props.estado === 'unlocked')

const handleClick = () => {
  if (!isLocked.value) {
    emit('click', props.id)
  }
}

const handleComplete = (e: Event) => {
  e.stopPropagation()
  emit('complete', props.id)
}
</script>

<template>
  <div 
    class="zone-node-wrapper"
    :class="[`position-${position}`]"
  >
    <div 
      class="zone-node"
      :class="estado"
      @click="handleClick"
    >
      <div class="node-content">
        <div class="node-header">
          <h3 class="zone-name">{{ nombre }}</h3>
          <span class="status-icon" v-if="isLocked">🔒</span>
          <span class="status-icon success" v-if="isCompleted">✔</span>
        </div>
        
        <p class="zone-level">Nivel Rec: {{ nivelRecomendado }}</p>
        
        <button 
          v-if="isUnlocked" 
          class="complete-btn"
          @click="handleComplete"
        >
          Marcar Completada
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.zone-node-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
}

/* Conectores */
.zone-node-wrapper:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: -40px;
  width: 4px;
  height: 40px;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2) 0px,
    rgba(255, 255, 255, 0.2) 8px,
    transparent 8px,
    transparent 16px
  );
  z-index: 0;
}

/* Posicionamiento alternado para sensación de "camino" */
.position-center .zone-node { transform: translateX(0); }
.position-right .zone-node { transform: translateX(40px); }
.position-left .zone-node { transform: translateX(-40px); }
.position-right::after { transform: translateX(40px); }
.position-left::after { transform: translateX(-40px); }

.zone-node {
  width: 260px;
  background: #1a1a1a;
  border-radius: 16px;
  padding: 20px;
  border: 2px solid transparent; /* Base border */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.zone-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.zone-level {
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  color: #888;
  margin-bottom: 12px;
}

.status-icon {
  font-size: 18px;
}

.status-icon.success {
  color: #78c850;
  text-shadow: 0 0 8px rgba(120, 200, 80, 0.6);
}

/* Estado: Locked */
.zone-node.locked {
  border-color: #444;
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(0.8);
}

/* Estado: Unlocked */
.zone-node.unlocked {
  border-color: #8b92ff;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(139, 146, 255, 0.2);
}

.zone-node.unlocked:hover {
  transform: translateY(-5px) scale(1.02);
  border-color: #5865f2;
  box-shadow: 0 8px 20px rgba(88, 101, 242, 0.4);
}

.position-right .zone-node.unlocked:hover { transform: translateX(40px) translateY(-5px) scale(1.02); }
.position-left .zone-node.unlocked:hover { transform: translateX(-40px) translateY(-5px) scale(1.02); }


/* Estado: Completed */
.zone-node.completed {
  border-color: #78c850;
  background: linear-gradient(135deg, #1a1a1a 0%, #112211 100%);
  cursor: pointer;
}

.zone-node.completed:hover {
  box-shadow: 0 0 15px rgba(120, 200, 80, 0.4);
}

/* Botón de acción */
.complete-btn {
  width: 100%;
  padding: 8px;
  background: linear-gradient(90deg, #5865f2, #8b92ff);
  border: none;
  border-radius: 8px;
  color: white;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.complete-btn:hover {
  opacity: 0.9;
}

@media (max-width: 600px) {
  .position-right .zone-node, 
  .position-left .zone-node,
  .position-right::after,
  .position-left::after {
    transform: none; /* Eliminar desplazamiento en móviles */
  }
}
</style>
