import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { typeColors, typeColorsDark } from "../utils/typeColors"; 
import PokemonSprite from "../components/PokemonSprite";
import './PokemonDetail.css';
import EvolutionChain from "../components/EvolutionChain"; 

export default function PokemonDetail({ setNavTitle }) {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);

  const [animate, setAnimate] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  const [selectedAbility, setSelectedAbility] = useState(null);
  const [abilityData, setAbilityData] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const requestIdRef = useRef(0);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [typeData, setTypeData] = useState(null);
  const [isShiny, setIsShiny] = useState(false);
  const [speciesData, setSpeciesData] = useState(null);
  const [theme, setTheme] = useState(document.body.getAttribute("data-theme"));
  

const handleCry = async () => {
  if(!pokemon) return;
  const cry = pokemon.cries?.latest; 

  if (!cry) return;
  if (isPlaying) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
  
  try {
    const audio = new Audio(cry);
    audio.volume = 0.3;

    audioRef.current = audio;
    setIsPlaying(true);

    await audio.play(); 

    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);

  } catch (err) {
    setIsPlaying(false);
  }
};

const fetchEvolutionChainSafe = async (pokemonData, requestId) => {
  try {
    const speciesRes = await fetch(pokemonData.species.url);
    const speciesData = await speciesRes.json();

    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();

    const result = [];

    const traverse = async (node, parent = null) => {
      const name = node.species.name;

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const pokeData = await res.json();

      if (requestId !== requestIdRef.current) return;

      result.push({
        name,
        sprite:
          pokeData.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default ||
          pokeData.sprites.front_default,
        evolves_from: parent,
        details: node.evolution_details[0] || null,
      });

      for (const evo of node.evolves_to) {
        await traverse(evo, name);
      }
    };

    await traverse(evoData.chain);

    return result;
  } catch (err) {
    return [];
  }
};

useEffect(() => {
    setNavTitle("Benjamin's Pokédex");
  }, []);

useEffect(() => {
  requestIdRef.current += 1;
  const currentRequestId = requestIdRef.current;

  setPokemon(null);
  setAnimate(false);
  setVisibleCount(0);
  setEvolution([]);

  fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then(res => res.json())
    .then(async data => {
      if (currentRequestId !== requestIdRef.current) return;

      setPokemon(data);
      setIsShiny(false);

      const speciesRes = await fetch(data.species.url);
      const species = await speciesRes.json();

      if (currentRequestId !== requestIdRef.current) return;
      setSpeciesData(species);

      const evoData = await fetchEvolutionChainSafe(data, currentRequestId);
      if (currentRequestId !== requestIdRef.current) return;

      setEvolution(evoData);

      setTimeout(() => {
        if (currentRequestId === requestIdRef.current) {
          setAnimate(true);
        }
      }, 600);

      let i = 0;
      const interval = setInterval(() => {
        i++;
        if (currentRequestId === requestIdRef.current) {
          setVisibleCount(i);
        }
      }, 80);

      setTimeout(() => clearInterval(interval), 2000);
    });
}, [name]);

useEffect(() => {
  if (!pokemon) return;

  document.title = `${capitalize(pokemon.name)} | Pokédex`;

  return () => {
    document.title = "Pokédex";
  };

}, [pokemon]);

useEffect(() => {
  const observer = new MutationObserver(() => {
    const newTheme = document.body.getAttribute("data-theme");
    setTheme(newTheme);
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  return () => observer.disconnect();
}, []);

useEffect(() => {
  const isOverlayOpen = abilityData || typeData;

  if (isOverlayOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [abilityData, typeData]);

useEffect(() => {
  handleCry();
}, [pokemon]);

  if (!pokemon) {
    return (
      <div 
      className="loader"
      >
        <img
          src="/pokeball.png"
          alt="loading"
          className="spinner"
        />
      </div>
    ); 
  }

  const types = pokemon.types?.map(t => t.type.name) || [];

  const colors = theme === "dark" ? typeColorsDark : typeColors;

  let bgStyle;
  if (types.length === 1) {
    bgStyle = colors[types[0]];
  } else {
    bgStyle = `linear-gradient(135deg, ${colors[types[0]]} 50%, ${colors[types[1]]} 50%)`;
  }

  const prevId = pokemon.id - 1;
  const nextId = pokemon.id + 1;

  const formatCondition = (details) => {
    if (!details) return "";

    if (details.min_level) return `Lvl ${details.min_level}`;
    if (details.item) return `Use ${details.item.name}`;
    if (details.trigger?.name === "trade") return "Trade";

    return details.trigger?.name || "";
  };

  const handleAbilityClick = (abilityName) => {
  fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`)
    .then(res => res.json())
    .then(data => setAbilityData(data));

  setSelectedAbility(abilityName);
  };

  const handleTypeClick = (typeName) => {
  fetch(`https://pokeapi.co/api/v2/type/${typeName}`)
    .then(res => res.json())
    .then(data => setTypeData(data));

  setSelectedType(typeName);
};

  const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

  const formatGeneration = (gen) => {
  return gen
    .replace("generation-", "Gen ");
};

  const offset = pokemon.types.length + pokemon.abilities.length;
    
  return (
    <div 
    className="page"
    >

      <div 
      className="topBar"
      >
        <button className="navBtn" onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>
    <div className="card" style={{ background: bgStyle}}>

    
      <div className="top"
        style={{ 
          opacity: animate ? 1 : 0, 
          transform: animate ? "translateY(0)" : "translateY(20px)", 
          transition: "all 0.5s ease", 
        }}> 
        
        <div className="info"> 
              <p className="id">
                No. {pokemon.id} 
              </p>

              <h1 className="pokemonName">
                {pokemon.name}
              </h1> 
              
              {speciesData && ( 
                <p className="id"> 
                  {formatGeneration(speciesData.generation.name)} 
                </p> )} 
              </div>

          </div>
        

<div className="bottom">

  <div className="left"> 
      <div className="block">
        <PokemonSprite 
          pokemon={pokemon} 
          size={110} 
          onClick={() => { 
              if(!isPlaying) {
                setIsShiny(prev => !prev); 
                handleCry();  
              }
          }} 
          style = {{ 
            cursor: pokemon.cries?.latest && !isPlaying ? "pointer" : "default", 
          }} 
          shiny = {isShiny} />

      <h3
        style={{
        opacity: visibleCount > 0 ? 1 : 0,
        transform: visibleCount > 0 ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.3s ease",
        }}
      >
        {pokemon.types.length === 1 ? "Type" : "Types"}
      </h3>

      <div className="badges">
      {pokemon.types.map((t, index) => (
        <span className="badge"
          key={t.type.name}
          onClick={() => handleTypeClick(t.type.name)}
          style={{
            background: colors[t.type.name],
            cursor: "pointer",
            opacity: visibleCount > index ? 1 : 0,
            transform: visibleCount > index ? "scale(1)" : "scale(0.8)",
            transition: "all 0.2s ease",
          }}
        >
        {t.type.name}
        </span>
      ))}
  </div>

      <div className="block">
      <h3
        style={{
        opacity: visibleCount > pokemon.types.length ? 1 : 0,
        transform:
          visibleCount > pokemon.types.length
          ? "translateY(0)"
          : "translateY(10px)",
        transition: "all 0.3s ease",
        }}
      >
        {pokemon.abilities.length === 1 ? "Ability" : "Abilities"}
      </h3>

      <div className="badges">
      {pokemon.abilities.map((a, index) => (
        <span className="badge"
          key={a.ability.name}
          onClick={() => handleAbilityClick(a.ability.name)}
          style={{
            background: colors[types[0]],
            opacity: visibleCount > index + pokemon.types.length ? 1 : 0,
            transform:
              visibleCount > index + pokemon.types.length
              ? "scale(1)"
              : "scale(0.8)",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}
        > 
        {a.ability.name}
        </span>
      ))}
      </div>

    {abilityData && (
      <div className="overlay">
        <div className="modal" style={{ background: colors[types[0]]}}>
          <h2 className="modelTitle">
            {capitalize(abilityData.name)}
          </h2>

          <p className="modelText">
            {
              abilityData.effect_entries.find(
                e => e.language.name === "en"
              )?.effect
            }
          </p>

          <button
            className="navBtn"
            onClick={() => setAbilityData(null)}
          >
            Close
          </button>
    </div>
  </div>
)}
{typeData && (
  <div className="overlay">
    <div className="modal" style={{background: colors[selectedType]}}>

      <h2 className="modalTitle">
        {capitalize(selectedType)} Type
      </h2>

      <div className="typeSection">
        <strong>Strong against</strong>
        <div className="badgesRow">
          {typeData.damage_relations.double_damage_to.length > 0 ? (
            typeData.damage_relations.double_damage_to.map(t => (
              <span className="badge"
                key={t.name}
                style={{
                  background: colors[t.name],
                }}
              >
                {t.name}
              </span>
            ))
          ) : (
            <span className="noneText">
              None
            </span>
          )}
        </div>
      </div>

      <div className="typeSection">
        <strong>Weak against</strong>
        <div className="badgesRow">
          {typeData.damage_relations.double_damage_from.length > 0 ? (
            typeData.damage_relations.double_damage_from.map(t => (
              <span className="badge"
                key={t.name}
                style={{
                  background: colors[t.name],
                }}
              >
                {t.name}
              </span>
            ))
          ) : (
            <span className="noneText">
              None
            </span>
          )}
        </div>
      </div>

      <div className="typeSection">
        <strong>Resists</strong>
        <div className="badgesRow">
          {typeData.damage_relations.half_damage_from.length > 0 ? (
            typeData.damage_relations.half_damage_from.map(t => (
              <span className="badge"
                key={t.name}
                style={{
                  background: colors[t.name],
                }}
              >
                {t.name}
              </span>
            ))
          ) : (
            <span className="noneText">
              None
            </span>
          )}
        </div>
      </div>

      <div className="typeSection">
        <strong>No damage from</strong>
        <div className="badgesRow">
          {typeData.damage_relations.no_damage_from.length > 0 ? (
            typeData.damage_relations.no_damage_from.map(t => (
              <span className="badge"
                key={t.name}
                style={{
                  background: colors[t.name],
                }}
              >
                {t.name}
              </span>
            ))
          ) : (
            <span className="noneText">
              None
            </span>
          )}
        </div>
      </div>

      <button className="navBtn" onClick={() => setTypeData(null)}>
        Close
      </button>
    </div>
  </div>
)}

        
      </div>
    </div>
  </div>

  <div className="right">
    <h3
      style={{
        opacity:
          visibleCount >
          pokemon.types.length + pokemon.abilities.length
          ? 1
          : 0,
        transform:
          visibleCount >
          pokemon.types.length + pokemon.abilities.length
          ? "translateY(0)"
          : "translateY(10px)",
        transition: "all 0.3s ease",
      }}
  >
    Stats
    </h3>

    {[
  {
    name: "height",
    display: `${pokemon.height / 10}m`,
  },
  {
    name: "weight",
    display: `${pokemon.weight / 10}kg`,
  },
].map((stat, index) => (
  <div className="statRow"
    key={stat.name}
    style={{
      opacity: visibleCount > index + offset ? 1 : 0,
      transform:
        visibleCount > index + offset
          ? "translateY(0)"
          : "translateY(10px)",
      transition: "all 0.3s ease",
    }}
  >
    <span className="statName">
      {stat.name}
    </span>

    <span className="statValue">
      {stat.display}
    </span>
 </div>
))}

    {pokemon.stats.map((stat, index) => {
      return (
        <div className="statRow"
          key={stat.stat.name}
          style={{
            opacity: visibleCount > 2 + index + offset ? 1 : 0,
            transform:
              visibleCount > index + offset
              ? "translateY(0)"
              : "translateY(10px)",
            transition: "all 0.3s ease",
          }}
        >
      <span className="statName">
        {stat.stat.name}
      </span>

      <span className="statValue">
        {stat.base_stat}
      </span>

      <div className="bar" style={{ background: theme === "dark" ? "rgba(163, 162, 162, 0.25)" : "rgba(255,255,255,0.25)", }}>
        <div className="fill"
          style={{
            width:
              visibleCount > index + offset && animate
                ? `${Math.min(stat.base_stat, 100)}%`
                : "0%",
          }}
        />
      </div>

    </div>
    
  );
})}

    </div>
  </div>

{evolution.length > 1 &&  (
  <EvolutionChain
  pokemon={pokemon}
  evolution={evolution}
  visibleCount={visibleCount}
  navigate={navigate}
  formatCondition={formatCondition}
  PokemonSprite={PokemonSprite}
/>
)}

</div>
<div className="navButtons">
        <button className="navBtn"
          style={{ opacity: prevId < 1 ? 0.3 : 1 }}
          onClick={() => navigate(`/pokemon/${prevId}`)}
          disabled={prevId < 1}
          >
            ← Previous
        </button>

        <button className="navBtn"
          onClick={() => navigate(`/pokemon/${nextId}`)}
        >
          Next →
        </button>
      </div>

    </div>
  );
}