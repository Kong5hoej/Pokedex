import React from "react";

export default function EvolutionChain({
  pokemon,
  evolution,
  visibleCount,
  navigate,
  formatCondition,
  PokemonSprite,
}) {
  if (!pokemon) return null;

  const evo = evolution ?? [];

  if (!evo.length) return null;

  const baseOffset =
    (pokemon.types?.length ?? 0) +
    (pokemon.abilities?.length ?? 0) +
    (pokemon.stats?.length ?? 0);

  return (
    <div className="evolution">
      <h3
        style={{
          opacity: visibleCount > baseOffset ? 1 : 0,
          transform:
            visibleCount > baseOffset
              ? "translateY(0)"
              : "translateY(10px)",
          transition: "all 0.3s ease",
        }}
      >
        Evolution Chain
      </h3>

      <div className="evoRow">
        {evo.map((evoItem, index) => {
          const isVisible = visibleCount > index + baseOffset;

          return (
            <div
              className="evoItem"
              key={evoItem.name || index}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateY(0)"
                  : "translateY(10px)",
                transition: "all 0.3s ease",
              }}
            >
              <PokemonSprite
                className="evoImage"
                pokemon={evoItem}
                size={90}
                onClick={() => navigate(`/pokemon/${evoItem.name}`)}
              />

              <span className="evoName">{evoItem.name}</span>

              {evoItem.details && (
                <span className="evoCondition">
                  {formatCondition(evoItem.details)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}