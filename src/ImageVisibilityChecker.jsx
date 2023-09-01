import React, { useState, useEffect } from "react";
import "./ImageVisibilityChecker.css"
import marioSound from "./pacman-intermission.mp3"

function ImageVisibilityChecker({ onIndexSubmit }) {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [checkboxesDisabled, setCheckboxesDisabled] = useState(Array.from({ length: 40 }, () => false)); // Inicializar todos los checkboxes como deshabilitados
  const [selectAllChecked, setSelectAllChecked] = useState(false); // Estado para el botón Seleccionar Todo

  useEffect(() => {
    const storedIndices = localStorage.getItem("selectedIndices");
    if (storedIndices) {
      setSelectedIndices(JSON.parse(storedIndices));
    }
    setCheckboxesDisabled(Array.from({ length: 40 }, () => false)); // Habilitar los checkboxes después de cargar los datos
  }, []);

  const toggleIndex = (index) => {
    const updatedIndices = selectedIndices.includes(index)
      ? selectedIndices.filter((i) => i !== index)
      : [...selectedIndices, index];
    setSelectedIndices(updatedIndices);
    localStorage.setItem("selectedIndices", JSON.stringify(updatedIndices));
    // playMarioSound();
    console.log(selectedIndices);
  };

  const toggleSelectAll = () => {
    const allSelected = !selectAllChecked;
    setSelectAllChecked(allSelected);
    const updatedIndices = allSelected ? Array.from({ length: 40 }, (_, index) => index) : [];
    setSelectedIndices(updatedIndices);
    localStorage.setItem("selectedIndices", JSON.stringify(updatedIndices));
  };

  const playMarioSound = () => {
    const audio = new Audio(marioSound);
    audio.play();
  };

  const checkSelectedButtons = () => {
    console.log("Índices seleccionados:", selectedIndices);
    onIndexSubmit(selectedIndices); // Llama a la función de componente padre
  };

  return (
    <div className="ImageVisibilityChecker">
      <h2>Selecciona los índices de las imágenes a verificar:</h2>
      <button onClick={toggleSelectAll}>
        {selectAllChecked ? "Desmarcar Todo" : "Marcar Todo"}
      </button>
      <ul className="grid">
        {Array.from({ length: 40 }, (_, index) => (
          <li key={index} className="grid-item">
            <label>
              <input
                className="entradas"
                type="checkbox"
                checked={selectedIndices.includes(index)}
                onChange={() => toggleIndex(index)}
                disabled={checkboxesDisabled[index]} // Establece el estado de habilitación/deshabilitación
              />
              Imagen {index}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={checkSelectedButtons}>Grabar</button>
    </div>
  );
}

export default ImageVisibilityChecker;
