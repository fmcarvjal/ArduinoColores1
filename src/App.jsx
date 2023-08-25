import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import AppPage from "./Game";
import ImageInputPage from "./ImageInputPage";
import MoveDirection from "./MoveDirection";

function App() {
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
  const [moveDirections, setMoveDirections] = useState(0);

  const handleImageSubmit = (newUrls) => {
    setImageUrls(newUrls);
  };

  const handleDirectionSubmit = (direction) => {
    setMoveDirections(direction);
  };

  return (
    <div>
      <Router>
        <div className="app-container">
          <div className="nav-container">
            <nav>
              <ul>
                
                <li>
                  <Link to="/image-input">Ingresar Imágenes</Link>
                </li>
                <li>
                  <Link to="/direcction-input">Ingresar Velocidad</Link>
                </li>
                <li>
                  <Link to="/">Ir al Juego</Link>
                </li>
              </ul>
            </nav>
          </div>
          <Routes>
            <Route
              path="/"
              element={
                <AppPage
                  imageUrls={imageUrls}
                  moveDirections={moveDirections}
                />
              }
            />
            <Route
              path="/image-input"
              element={<ImageInputPage onImageSubmit={handleImageSubmit} />}
            />
            <Route
              path="/direcction-input"
              element={
                <MoveDirection onDirectionSubmit={handleDirectionSubmit} />
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
