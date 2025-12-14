import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'

export interface NPC {
    id: number
    nombre: string
    rol: string
    avatarUrl?: string
}

export interface FoundPokemon {
    nombre: string
    spriteUrl: string
    tipo: string
    rareza: string
}

export interface LobbyState {
    npcs: NPC[]
    mostrarEntrenadores: boolean
    capturaActiva: boolean
    capturaSearching: boolean
    capturaFound: boolean
    foundPokemon: FoundPokemon | null
    npcCounter: number
}

// URLs de avatares para NPCs
const NPC_AVATARS = [
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png'
]

// Estado inicial por zona
const defaultLobbyState = (): LobbyState => ({
    npcs: [
        { id: 1, nombre: 'Prof. Roble', rol: 'Investigador', avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
        { id: 2, nombre: 'Líder Flama', rol: 'Líder de Gimnasio', avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' }
    ],
    mostrarEntrenadores: false,
    capturaActiva: false,
    capturaSearching: false,
    capturaFound: false,
    foundPokemon: null,
    npcCounter: 3
})

export const useLobbyStore = defineStore('lobby', () => {
    // Map de estados por zona (zoneId -> LobbyState)
    const lobbyStates = reactive<Record<number, LobbyState>>({})

    // Cargar estado desde localStorage
    function loadLobbyState(zoneId: number): LobbyState {
        const stored = localStorage.getItem(`lobby_zone_${zoneId}`)
        if (stored) {
            try {
                return JSON.parse(stored)
            } catch (e) {
                return defaultLobbyState()
            }
        }
        return defaultLobbyState()
    }

    // Guardar estado en localStorage
    function saveLobbyState(zoneId: number, state: LobbyState) {
        localStorage.setItem(`lobby_zone_${zoneId}`, JSON.stringify(state))
    }

    // Obtener o crear estado de lobby para una zona
    function getLobbyState(zoneId: number): LobbyState {
        if (!lobbyStates[zoneId]) {
            lobbyStates[zoneId] = loadLobbyState(zoneId)

            // Persistir automáticamente cuando cambie
            watch(
                () => lobbyStates[zoneId],
                (newState) => saveLobbyState(zoneId, newState),
                { deep: true }
            )
        }
        return lobbyStates[zoneId]
    }

    // Actions para modificar estado de lobby
    function agregarNPC(zoneId: number) {
        const state = getLobbyState(zoneId)
        const avatarIndex = (state.npcCounter - 3) % NPC_AVATARS.length
        state.npcs.push({
            id: state.npcCounter++,
            nombre: `Visitante #${state.npcCounter - 2}`,
            rol: 'Explorador',
            avatarUrl: NPC_AVATARS[avatarIndex]
        })
    }

    function toggleEntrenadores(zoneId: number) {
        const state = getLobbyState(zoneId)
        state.mostrarEntrenadores = !state.mostrarEntrenadores
    }

    function setMostrarEntrenadores(zoneId: number, value: boolean) {
        const state = getLobbyState(zoneId)
        state.mostrarEntrenadores = value
    }

    function iniciarCaptura(zoneId: number) {
        const state = getLobbyState(zoneId)
        state.capturaActiva = true
        state.capturaSearching = true
        state.capturaFound = false
        state.foundPokemon = null

        // Simular búsqueda de 2-3 segundos
        setTimeout(() => {
            if (state.capturaSearching) {
                state.capturaSearching = false
                state.capturaFound = true

                // Pokémon aleatorio
                const randomPokemon = [
                    { nombre: 'Rattata', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png', tipo: 'Normal', rareza: 'Común' },
                    { nombre: 'Pidgey', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png', tipo: 'Volador', rareza: 'Común' },
                    { nombre: 'Pikachu', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', tipo: 'Eléctrico', rareza: 'Raro' },
                    { nombre: 'Charmander', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', tipo: 'Fuego', rareza: 'Raro' }
                ]
                state.foundPokemon = randomPokemon[Math.floor(Math.random() * randomPokemon.length)]
            }
        }, 2500)
    }

    function intentarAtrapar(zoneId: number) {
        // Simular 50% éxito
        const exito = Math.random() > 0.5
        if (exito) {
            alert('¡Captura exitosa! 🎉')
        } else {
            alert('¡El Pokémon escapó! 😢')
        }
        cancelarCaptura(zoneId)
    }

    function cancelarCaptura(zoneId: number) {
        const state = getLobbyState(zoneId)
        state.capturaActiva = false
        state.capturaSearching = false
        state.capturaFound = false
        state.foundPokemon = null
    }

    return {
        getLobbyState,
        agregarNPC,
        toggleEntrenadores,
        setMostrarEntrenadores,
        iniciarCaptura,
        intentarAtrapar,
        cancelarCaptura
    }
})
