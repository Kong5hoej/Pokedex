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
      element: <Pokedex setNavTitle={setNavTitle} />
    },
    {
      path: "/pokemon/:name",
      element: <PokemonDetail setNavTitle={setNavTitle} />
    },
    {
      path: "/games",
      element: <Games setNavTitle={setNavTitle} />
    },
    {
      path: "/games/wordle",
      element: <WordleGame setNavTitle={setNavTitle} />
    },
    {
      path: "/games/silhouette",
      element: <SilhouetteGame setNavTitle={setNavTitle} />
    }
  ]
}]);


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

/*
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
); */