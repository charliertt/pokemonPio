import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ZoneState = 'locked' | 'unlocked' | 'completed'

export interface Zone {
    id: number
    nombre: string
    nivelRecomendado: number
    estado: ZoneState
}

export const useZonesStore = defineStore('zones', () => {
    // State: lista de zonas
    const zonas = ref<Zone[]>([
        { id: 1, nombre: 'Bosque Verde', nivelRecomendado: 5, estado: 'unlocked' },
        { id: 2, nombre: 'Cueva Oscura', nivelRecomendado: 10, estado: 'locked' },
        { id: 3, nombre: 'Monte Plateado', nivelRecomendado: 15, estado: 'locked' },
        { id: 4, nombre: 'Lago Cristalino', nivelRecomendado: 20, estado: 'locked' },
        { id: 5, nombre: 'Torre Final', nivelRecomendado: 25, estado: 'locked' }
    ])

    // Getter: obtener zona por ID
    function getZoneById(id: number): Zone | undefined {
        return zonas.value.find(z => z.id === id)
    }

    // Getter: verificar si zona está accesible
    function isZoneAccessible(id: number): boolean {
        const zona = getZoneById(id)
        return zona ? zona.estado !== 'locked' : false
    }

    // Action: completar zona y desbloquear siguiente
    function completeZone(id: number) {
        const index = zonas.value.findIndex(z => z.id === id)
        if (index === -1) return

        // Marcar como completada
        zonas.value[index].estado = 'completed'

        // Desbloquear siguiente si existe y está locked
        if (index + 1 < zonas.value.length) {
            if (zonas.value[index + 1].estado === 'locked') {
                zonas.value[index + 1].estado = 'unlocked'
            }
        }
    }

    // Action: resetear todo el progreso
    function resetProgress() {
        // Confirmar con el usuario
        if (!confirm('¿Estás seguro de que quieres resetear todo el progreso? Esta acción no se puede deshacer.')) {
            return
        }

        // Resetear zonas
        zonas.value = [
            { id: 1, nombre: 'Bosque Verde', nivelRecomendado: 5, estado: 'unlocked' },
            { id: 2, nombre: 'Cueva Oscura', nivelRecomendado: 10, estado: 'locked' },
            { id: 3, nombre: 'Monte Plateado', nivelRecomendado: 15, estado: 'locked' },
            { id: 4, nombre: 'Lago Cristalino', nivelRecomendado: 20, estado: 'locked' },
            { id: 5, nombre: 'Torre Final', nivelRecomendado: 25, estado: 'locked' }
        ]

        // Limpiar localStorage de lobbies
        for (let i = 1; i <= 5; i++) {
            localStorage.removeItem(`lobby_zone_${i}`)
        }

        alert('Progreso reseteado exitosamente')
    }

    return {
        zonas,
        getZoneById,
        isZoneAccessible,
        completeZone,
        resetProgress
    }
})
