// Datos de Pokémon permitidos por zona
export interface ZonePokemon {
    nombre: string
    spriteUrl: string
    tipo: string
    rareza: string
}

export function useZonePokemon() {
    const zonePokemonData: Record<number, ZonePokemon[]> = {
        1: [ // Bosque Verde
            { nombre: 'Caterpie', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png', tipo: 'Bicho', rareza: 'Común' },
            { nombre: 'Weedle', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png', tipo: 'Bicho/Veneno', rareza: 'Común' },
            { nombre: 'Pidgey', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png', tipo: 'Volador', rareza: 'Común' },
            { nombre: 'Pikachu', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', tipo: 'Eléctrico', rareza: 'Raro' }
        ],
        2: [ // Cueva Oscura
            { nombre: 'Zubat', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png', tipo: 'Volador/Veneno', rareza: 'Común' },
            { nombre: 'Geodude', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png', tipo: 'Roca/Tierra', rareza: 'Común' },
            { nombre: 'Onix', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png', tipo: 'Roca/Tierra', rareza: 'Raro' }
        ],
        3: [ // Monte Plateado
            { nombre: 'Machop', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png', tipo: 'Lucha', rareza: 'Común' },
            { nombre: 'Rhyhorn', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/111.png', tipo: 'Tierra/Roca', rareza: 'Raro' },
            { nombre: 'Graveler', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/75.png', tipo: 'Roca/Tierra', rareza: 'Común' }
        ],
        4: [ // Lago Cristalino
            { nombre: 'Magikarp', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png', tipo: 'Agua', rareza: 'Común' },
            { nombre: 'Goldeen', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/118.png', tipo: 'Agua', rareza: 'Común' },
            { nombre: 'Staryu', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png', tipo: 'Agua', rareza: 'Raro' },
            { nombre: 'Lapras', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png', tipo: 'Agua/Hielo', rareza: 'Muy Raro' }
        ],
        5: [ // Torre Final
            { nombre: 'Gastly', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png', tipo: 'Fantasma/Veneno', rareza: 'Raro' },
            { nombre: 'Haunter', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/93.png', tipo: 'Fantasma/Veneno', rareza: 'Raro' },
            { nombre: 'Gengar', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png', tipo: 'Fantasma/Veneno', rareza: 'Muy Raro' }
        ]
    }

    function getPokemonByZone(zoneId: number): ZonePokemon[] {
        return zonePokemonData[zoneId] || []
    }

    return {
        getPokemonByZone
    }
}
