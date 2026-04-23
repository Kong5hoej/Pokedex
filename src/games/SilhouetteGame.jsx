import { useEffect, useState } from "react";
import { fetchRandomPokemon, fetchPokemon } from "./pokemon";
import "./silhouette.css";

export default function SilhouetteGame({ setNavTitle }) {
  const [target, setTarget] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setNavTitle?.("Silhouette Game");
    startGame();
  }, []);

  async function startGame() {
    const poke = await fetchRandomPokemon();

    setTarget(poke);
    setGuesses([]);
    setInput("");
    setMessage("");
    setGameOver(false);
  }

  async function handleGuess() {
    if (!input || gameOver) return;

    try {
      const guess = await fetchPokemon(input.toLowerCase());

      setGuesses((prev) => [...prev, guess]);
      setInput("");
      setMessage("");

      if (guess.name === target.name) {
        setMessage(`Correct! It was: ${target.name}`);
        setGameOver(true);
      }
    } catch {
      setMessage("That Pokémon does not exist!");
    }
  }

  function giveUp() {
    setMessage(`You gave up! It was: ${target.name}`);
    setGameOver(true);
  }

  async function resetGame() {
    await startGame();
  }

  if (!target) return <p className="loading">Loading silhouette...</p>;

  const reveal = Math.min(guesses.length, 4);
  const brightness = gameOver ? 1 : reveal * 0.25;
  const showGiveUp = brightness >= 0.25 && !gameOver;

  return (
    <div className="game">
      <div className="silhouetteCard">
        <img
          src={target.sprites.front_default}
          alt="pokemon silhouette"
          className="silhouetteImage"
          style={{
            filter: `brightness(${brightness})`,
          }}
        />

        {!gameOver && (
          <div className="inputRow">
            <input
              value={input}
              placeholder="Guess Pokémon"
              onChange={(e) => {
                setInput(e.target.value);
                setMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGuess();
              }}
            />

            <button className="btn" onClick={handleGuess}>
              Guess
            </button>
          </div>
        )}

        {showGiveUp && (
          <button className="btn" onClick={giveUp}>
            Give Up
          </button>
        )}

        {gameOver && (
          <button className="btn" onClick={resetGame}>
            Play Again
          </button>
        )}

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}