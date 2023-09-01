import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import AppPage from "./Game";
import ImageInputPage from "./ImageInputPage";
import MoveDirection from "./MoveDirection";
import ImageVisibilityChecker from "./ImageVisibilityChecker"

function App() {
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
  const [moveDirections, setMoveDirections] = useState(0);
  const [Indexs, setIndex] = useState(Array.from({ length: 40 }, () => "")); // Inicializar con ceros

  const handleImageSubmit = (newUrls) => {
    setImageUrls(newUrls);
  };

  const handleDirectionSubmit = (direction) => {
    setMoveDirections(direction);
  };

  const toggleSelectedIndex =(index)=>{
    setIndex(index)
  }

  return (
    <div>
      <Router>
        <div className="app-container">
          <div className="nav-container">
            <nav>
              <ul>
                
                <li>
                  <Link to="/ArduinoColores1/image-input">Ingresar Imágenes</Link>
                </li>
                <li>
                  <Link to="/ArduinoColores1/direcction-input">Ingresar Velocidad</Link>
                </li>
                <li>
                  <Link to="/ArduinoColores1/imagen-index">Seleccionar Index</Link>
                </li>
                <li>
                  <Link to="/ArduinoColores1/">Ir al Juego</Link>
                </li>
              </ul>
            </nav>
          </div>
          <Routes>
            <Route
              path="/ArduinoColores1/"
              element={
                <AppPage
                  imageUrls={imageUrls}
                  moveDirections={moveDirections}
                  Indexs={Indexs}
                />
              }
            />
            <Route
              path="/ArduinoColores1/image-input"
              element={<ImageInputPage onImageSubmit={handleImageSubmit} />}
            />
            <Route
              path="/ArduinoColores1/direcction-input"
              element={
                <MoveDirection onDirectionSubmit={handleDirectionSubmit} />
              }
            />
            <Route
              path="/ArduinoColores1/imagen-index"
              element={
              <ImageVisibilityChecker onIndexSubmit={toggleSelectedIndex}
            
               />
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
