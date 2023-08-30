import React, { useState } from 'react';
import './MoveDirection.css'; // Importa tu archivo de estilos CSS

function SliderComponent({ onDirectionSubmit }) {
  const [moveDirection, setMoveDirection] = useState(1);

  const handleSliderChange = (event) => {
    const newMoveDirection = parseFloat(event.target.value);
    setMoveDirection(newMoveDirection);
    onDirectionSubmit(3-newMoveDirection);
  };

  return (
    <div className="slider-container">
      <label>Velocidad: {moveDirection}</label>
      <input
        type="range"
        min="0"
        max="3"
        step="0.1"
        value={moveDirection}
        onChange={handleSliderChange}
      />
    </div>
  );
}

export default SliderComponent;
