import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Pokedex from "./pages/Pokedex";
import PokemonDetail from "./pages/PokemonDetail";
import Games from "./pages/Games";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";
import WordleGame from "./games/WordleGame";
import SilhouetteGame from "./games/SilhouetteGame";

function App() {
  const [navTitle, setNavTitle] = useState("Benjamin's Pokédex");

  return (
    <>
    <div className="app-container">
      <nav className="nav">
        <div className="nav-left">
          <ThemeToggle />
        </div>

        <h2 className="nav-title">{navTitle}</h2>

        <div className="nav-right">
          <Link to="/">Home</Link>
          <Link to="/games">Games</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Pokedex setNavTitle={setNavTitle} />} />
        <Route path="/pokemon/:name" element={<PokemonDetail setNavTitle={setNavTitle} />} />
        <Route path="/games" element={<Games setNavTitle={setNavTitle} />} />
        <Route path="/games/wordle" element={<WordleGame setNavTitle={setNavTitle} />} />
        <Route path="/games/silhouette" element={<SilhouetteGame setNavTitle={setNavTitle} />} />
      </Routes>
      </div>
    </>
  );
}

export default App;