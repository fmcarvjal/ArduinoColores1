import React, { useState } from 'react';
import './MoveDirection.css'; // Importa tu archivo de estilos CSS

function SliderComponent({ onDirectionSubmit }) {
  const [moveDirection, setMoveDirection] = useState(1);

  const handleSliderChange = (event) => {
    const newMoveDirection = parseFloat(event.target.value);
    setMoveDirection(newMoveDirection);
    onDirectionSubmit(newMoveDirection);
  };

  return (
    <div className="slider-container">
      <label>Velocidad: {moveDirection}</label>
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        value={moveDirection}
        onChange={handleSliderChange}
      />
    </div>
  );
}

export default SliderComponent;
