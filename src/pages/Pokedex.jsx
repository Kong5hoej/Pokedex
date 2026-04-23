import { useEffect, useState } from "react";
import PokemonList from "../components/PokemonList";
import Pagination from "../components/Pagination";
import { useRef } from "react";
import "./Pokedex.css";

const API_URL = "https://pokeapi.co/api/v2/pokemon";

export default function Pokedex({ setNavTitle }) {
  const [pokemon, setPokemon] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [url, setUrl] = useState(API_URL);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const abortRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setNavTitle("Benjamin's Pokédex");
  }, []);

  useEffect(() => {
    async function fetchAllPokemon() {
      const res = await fetch(`${API_URL}?limit=100000`);
      const data = await res.json();
      setAllPokemon(data.results);
    }

    fetchAllPokemon();
  }, []);

useEffect(() => {
  if (search) return;

  const controller = new AbortController();
  abortRef.current?.abort(); 
  abortRef.current = controller;

  async function fetchPokemon() {
    try {
      setLoading(true);

      const res = await fetch(url, { signal: controller.signal });
      const data = await res.json();

      setNextUrl(data.next);
      setPrevUrl(data.previous);

      setPokemon([]);

      const detailedPokemon = await Promise.all(
        data.results.map((p) =>
          fetch(p.url, { signal: controller.signal }).then(r => r.json())
        )
      );

      if (controller.signal.aborted) return;

      setPokemon(detailedPokemon);
      setLoading(false);

    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  fetchPokemon();

  return () => controller.abort();
}, [url, search]);

  useEffect(() => {
  if (!search) return;
  setErrorMessage("");

  async function searchPokemon() {
    const searchLower = search.toLowerCase().trim();

    if (!isNaN(searchLower)) {
      try {
  const res = await fetch(`${API_URL}/${searchLower}`);

  if (!res.ok) {
    throw new Error("Not found");
  }

  const data = await res.json();

  setPokemon([data]);
  setErrorMessage("");
  return;

} catch (error) {
  setPokemon([]);
  setErrorMessage(`No Pokémon found with No. ${searchLower}`);
  return;
}
    }

    const filtered = allPokemon
      .filter((p) => p.name.includes(searchLower))
      .sort((a, b) => {
        const aName = a.name;
        const bName = b.name;

        if (aName === searchLower) return -1;
        if (bName === searchLower) return 1;

        if (
          aName.startsWith(searchLower) &&
          !bName.startsWith(searchLower)
        )
          return -1;

        if (
          bName.startsWith(searchLower) &&
          !aName.startsWith(searchLower)
        )
          return 1;

        return aName.localeCompare(bName);
      });

    const limited = filtered.slice(0, 20);

    const detailedPokemon = await Promise.all(
      limited.map((p) => fetch(p.url).then((r) => r.json()))
    );

    setPokemon(detailedPokemon);
  }

  searchPokemon();
}, [search, allPokemon]);


  return (
    <div>
      <div className="Search">
      <div className="SearchContainer">
        <input className="SearchInput"
          type="text"
          placeholder="Search Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
      </div>
        {errorMessage && <p className="SearchError">{errorMessage}</p>}
        </div>
      <PokemonList key={renderKey} pokemon={pokemon} />
      
      {!search && (
        <Pagination
          next={() => setUrl(nextUrl)}
          prev={() => setUrl(prevUrl)}
          hasNext={!!nextUrl}
          hasPrev={!!prevUrl}
      />
      )}
    </div>
  );
}