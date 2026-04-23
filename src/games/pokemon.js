export async function fetchPokemon(nameOrId) {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${nameOrId}`
  );
  return await res.json();
}

export async function fetchRandomPokemon() {
  const id = Math.floor(Math.random() * 1010) + 1;

  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${id}`
  );

  return await res.json();
}