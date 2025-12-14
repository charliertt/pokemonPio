<script setup lang="ts">
import PokemonCard from '../components/PokemonCard.vue'
</script>

<template>
  <main class="main-content">
    <div class="cards-container">
      <PokemonCard
        nombre="Pikachu"
        sprite="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
        tipo="Eléctrico"
      />
      
      <PokemonCard
        nombre="Charmander"
        sprite="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
        tipo="Fuego"
      />
      
      <PokemonCard
        nombre="Bulbasaur"
        sprite="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
        tipo="Planta / Veneno"
      />
    </div>
  </main>
</template>

<style scoped>
.main-content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.cards-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .cards-container {
    gap: 24px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .cards-container {
    gap: 20px;
  }
}
</style>
