import { useState } from "react";
import "./PokemonSprite.css";

export default function PokemonSprite({
  pokemon,
  size = 96,
  onClick,
  style = {},
  shiny = false,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imgSrc = getBestSprite(pokemon, shiny);

  const showFallback = !loaded || error;

  return (
    <div className="Sprite"
      onClick={onClick}
      style={{
        width: size,
        height: size,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {showFallback && (
        <div className="Fallback"
           style={{
            fontSize: size*0.5,
           }}
        >
          ?
        </div>
      )}
        <img 
        src={imgSrc}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(false);
        }}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          opacity: loaded && !error ? 1 : 0,
          transition: "opacity 0.2s ease",
          ...style,
        }}
      />
    </div>
  );
}

function getBestSprite(pokemon, shiny) {
    if (pokemon.sprite ) return pokemon.sprite;

    var sprite = null;

    if(shiny)
    {
      sprite = 
      pokemon.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_shiny ||
      pokemon.sprites?.versions?.["generation-v"]?.["black-white"]?.front_shiny ||
      pokemon.sprites?.other?.["official-artwork"]?.front_shiny;
    }
    else{
      sprite = 
        pokemon.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default ||
        pokemon.sprites?.other?.["official-artwork"]?.front_default ||
        pokemon.sprites?.front_default;  
    }

    return sprite;
}