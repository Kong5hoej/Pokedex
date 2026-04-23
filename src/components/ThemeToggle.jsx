import { useEffect, useState } from "react";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
      document.body.setAttribute("data-theme", saved);
    }
  }, []);

  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };
  

  return (
    <button className="themeToggle" onClick={toggleTheme}>
      <div className={`ball ${theme}`}>
        <img
          src={theme === "light" ? "/lightball.png" : "/darkball.png"}
          alt="theme"
        />
      </div>
    </button>
  );
}