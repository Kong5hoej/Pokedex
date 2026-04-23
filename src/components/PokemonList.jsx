import PokemonCard from "./PokemonCard";
import "./PokemonList.css"

const styles = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "20px",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
  },
};

export default function PokemonList({ pokemon }) {
  return ( 
    <>
      <div style={styles.wrapper}
      >
        {pokemon.map((p, index) => (
          <div
            key={p.id}
            className="CardWrapper"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <PokemonCard pokemon={p} />
          </div>
        ))}
      </div>
    </>
  );
}