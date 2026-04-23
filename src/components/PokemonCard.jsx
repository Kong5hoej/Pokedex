import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { typeColors, typeColorsDark } from "../utils/typeColors";
import PokemonSprite from "./PokemonSprite";
import "./PokemonCard.css";

export default function PokemonCard({ pokemon }) {
  const [theme, setTheme] = useState(document.body.getAttribute("data-theme"));

  const types = pokemon.types.map(t => t.type.name);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute("data-theme"));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const colors = theme === "dark" ? typeColorsDark : typeColors;

  const bgStyle =
    types.length === 1
      ? colors[types[0]]
      : `linear-gradient(135deg, ${colors[types[0]]} 50%, ${colors[types[1]]} 50%)`;

  return (
    <div className="Wrapper">
      <div className="Image">
        <PokemonSprite pokemon={pokemon} />
      </div>

      <Link className="Link" to={`/pokemon/${pokemon.name}`}>
        <div
          className="Card"
          style={{
            background: bgStyle,
            color: theme === "dark" ? "black" : "white",
          }}
        >
          <p className="ID">No. {pokemon.id}</p>
          <h2 className="Name">{pokemon.name}</h2>
        </div>
      </Link>
    </div>
  );
}