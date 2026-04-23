import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import Pokedex from "./pages/Pokedex";
import PokemonDetail from "./pages/PokemonDetail";
import Games from "./pages/Games";
import WordleGame from "./games/WordleGame";
import SilhouetteGame from "./games/SilhouetteGame";

const router = createHashRouter([{
  path: "/",
  element: <App />,
  children: [
    {
      path: "/",
      element: <Pokedex  />
    },
    {
      path: "/pokemon/:name",
      element: <PokemonDetail  />
    },
    {
      path: "/games",
      element: <Games  />
    },
    {
      path: "/games/wordle",
      element: <WordleGame  />
    },
    {
      path: "/games/silhouette",
      element: <SilhouetteGame  />
    }
  ]
}]);

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)