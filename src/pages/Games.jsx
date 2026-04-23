import "./games.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import WordleGame from "../games/WordleGame";
import SilhouetteGame from "../games/SilhouetteGame";

export default function Games({ setNavTitle }) {
  useEffect(() => {
    setNavTitle("Games");
  }, []);

  return (
    <div className="gamesPage">

      <div className="gamesGrid">
        <div className="gameCard">
          <h2>Poké Wordle</h2>
          <p>
            Guess the hidden Pokémon name in six tries using hints and letter colors.
          </p>

          <Link to="/games/wordle">
            <button className="btn">Play Wordle</button>
          </Link>
        </div>

        <div className="gameCard">
          <h2>Silhouette Game</h2>
          <p>
            Guess the hidden Pokémon from its silhouette before the image is revealed.
          </p>

          <Link to="/games/silhouette">
            <button className="btn">Play Silhouette</button>
          </Link>
        </div>
      </div>
    </div>
  );
}