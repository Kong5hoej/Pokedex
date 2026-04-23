import { useEffect, useState } from "react";
import { fetchPokemon, fetchRandomPokemon } from "./pokemon";
import "./wordle.css";

const MAX_TRIES = 6;
const rows = Array.from({ length: MAX_TRIES });

export default function WordleGame({ setNavTitle }) {
  const [target, setTarget] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [hints, setHints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);

useEffect(() => {
  setNavTitle("Poké Wordle");
}, []);

  useEffect(() => {
    startGame();
  }, []);

  async function resetGame() {
  setGuesses([]);
  setInput("");
  setGameOver(false);
  setHintCount(0);
  setHints([]);
  setMessage("");
  setLoading(false);

  await startGame();
}

function triggerShake() {
  setShake(true);
  setTimeout(() => setShake(false), 400);
}

  async function startGame() {
    const poke = await fetchRandomPokemon();
    const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${poke.id}`).then(res => res.json());
    const newHints = [
      "Types: " + poke.types.map(t => t.type.name).join(", "),
      "Was introduced in: " + (species.generation?.name?.replace("generation-", "Gen ") || "Unknown"),
      "Color: " + (species.color?.name || "Unknown"),
      "Habitat: " + (species.habitat?.name || "Unknown"),
    ];
    setTarget(poke);
    setGuesses([]);
    setHintCount(0);
    setHints(newHints);
  }

  async function handleGuess() {
  if (gameOver || loading) return;
  if (!input) return;

  setLoading(true);

  try {
    const guess = await fetchPokemon(input.toLowerCase());

    if (guess.name.length !== target.name.length) {
      setMessage(`Guess must be ${target.name.length} letters!`);
      triggerShake();
      setLoading(false);
      return;
    }

    const word = guess.name.toLowerCase();
    const targetWord = target.name.toLowerCase();

    if (word !== targetWord) {
      setHintCount((prev) => Math.min(prev + 1, hints.length));
    }

    const evaluation = evaluateGuess(word, targetWord);

    const newGuess = {
      word,
      evaluation,
      types: guess.types
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setInput("");

    if (word === targetWord) {
      setGameOver(true);
      setMessage("You won!");
    } else if (newGuesses.length >= MAX_TRIES) {
      setGameOver(true);
      setMessage(`You lost! It was ${target.name}`);
    }

  } catch (err) {
    setMessage("That Pokémon does not exist!");
    triggerShake();
    setLoading(false);
  }

  setLoading(false);
}

  function evaluateGuess(guess, target) {
  const result = Array(guess.length).fill("gray");
  const targetArr = target.split("");
  const guessArr = guess.split("");

  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = "green";
      targetArr[i] = null; 
      guessArr[i] = null;
    }
  }

  for (let i = 0; i < guessArr.length; i++) {
    if (!guessArr[i]) continue;

    const index = targetArr.indexOf(guessArr[i]);
    if (index !== -1) {
      result[i] = "yellow";
      targetArr[index] = null;
    }
  }

  return result;
  }

  if (!target) return <p>Loading Wordle...</p>;

  const lastGuess = guesses[guesses.length - 1];
  const visibleHints = hints.slice(0, hintCount);

  return (
    <div className="game">
{!gameOver && (
      <div className={`inputRow ${shake ? "shake" : ""}`}>
        <input
            value={input}
            placeholder="Guess"
            onChange={(e) => {setInput(e.target.value); setMessage("");}}
            onKeyDown={(e) => {
                if (e.key === "Enter") handleGuess();
            }}
        />
        

  <button className="btn" onClick={handleGuess} disabled={loading || gameOver}>
  Guess
</button>
</div>)}
{gameOver && (
  <div className="playAgainWrapper">
    <button className="btn" onClick={resetGame}>
      Play again
    </button>
  </div>
)}
{message && (
  <div className="message">
    {message}
  </div>
)}

<div className="gridRow">
      <div className="grid">
  {rows.map((_, rowIndex) => {
    const guess = guesses[rowIndex];

    return (
      <div key={rowIndex} className="row">
        {guess
          ? guess.word.split("").map((letter, i) => (
              <div
                key={i}
                className={`cell ${guess.evaluation[i]} reveal`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {letter}
              </div>
            ))
          : Array.from({
              length: target.name.length,
            }).map((_, i) => (
              <div key={i} className="cell empty"></div>
            ))}
      </div>
    );
  })}
</div>
{visibleHints.length > 0 && (
  <div className="hints">
    <h3>Hints</h3>
      {visibleHints.map((hint, i) => (
        <p key={i}>{hint}</p>
      ))}
  </div>
)}</div>
    </div>
  );
}