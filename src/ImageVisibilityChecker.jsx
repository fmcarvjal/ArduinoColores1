import React, { useState, useEffect } from "react";
import "./ImageVisibilityChecker.css";
import { Link } from "react-router-dom";
import marioSound from "./pacman-intermission.mp3";

function ImageVisibilityChecker({ onIndexSubmit }) {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [checkboxesDisabled, setCheckboxesDisabled] = useState(
    Array.from({ length: 40 }, () => false)
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [mensaje, setMensaje] = useState(""); // Estado para almacenar el mensaje seleccionado

  

  useEffect(() => {
    // Llama a checkSelectedButtons cada vez que selectedIndices o mensaje cambien
    checkSelectedButtons();

  /*  setTimeout(() => {
      window.location.href = '/';
    }, 4000); // 2000 milisegundos de retraso*/
  }, [selectedIndices, mensaje]);

  const handleSelectIndices = (indices, message) => {
    setSelectedIndices(indices);
    setMensaje(message);
  };

  const handleSelectIndices1 = () => {
    handleSelectIndices([0, 9, 16, 18, 26, 33, 34], " Seleccionar las imágenes de color ROJO de la  Izquierda");
  
  };

  const handleSelectIndices2 = () => {
    handleSelectIndices([5, 7, 13, 22, 29, 38, 39], "Seleccionar las imágenes de color ROJO de la derecha");
    
  };

  const handleSelectIndices3 = () => {
    handleSelectIndices([1, 17, 24], "Seleccionar las imágenes de color VERDE de la izquierda");
  };

  const handleSelectIndices4 = () => {
    handleSelectIndices([6, 14, 21, 30, 31, 37], "Seleccionar las imágenes de color VERDE de la derecha");
  };

  const handleSelectIndices5 = () => {
    handleSelectIndices([2, 8, 10, 25, 32], "Seleccionar las imágenes de color AZUL de la izquierda");
  };

  const handleSelectIndices6 = () => {
    handleSelectIndices([15, 23], "Seleccionar las imágenes de color AZUL de la derecha");
  };

  useEffect(() => {
    const storedIndices = localStorage.getItem("selectedIndices");
    if (storedIndices) {
      setSelectedIndices(JSON.parse(storedIndices));
    }
    setCheckboxesDisabled(Array.from({ length: 40 }, () => false));
  }, []);

  const toggleIndex = (index) => {
    const updatedIndices = selectedIndices.includes(index)
      ? selectedIndices.filter((i) => i !== index)
      : [...selectedIndices, index];
    setSelectedIndices(updatedIndices);
    localStorage.setItem("selectedIndices", JSON.stringify(updatedIndices));
  };

  const toggleSelectAll = () => {
    const allSelected = !selectAllChecked;
    setSelectAllChecked(allSelected);
    const updatedIndices = allSelected
      ? Array.from({ length: 40 }, (_, index) => index)
      : [];
    setSelectedIndices(updatedIndices);
    localStorage.setItem("selectedIndices", JSON.stringify(updatedIndices));
  };

  const checkSelectedButtons = () => {
    console.log("Índices seleccionados:", selectedIndices);
    console.log("Mensaje seleccionado:", mensaje); // Muestra el mensaje seleccionado
    onIndexSubmit(selectedIndices, mensaje || textInput); // Envía el mensaje desde el usuario de texto si el mensaje preexistente está vacío o viceversa
  
  };

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };

  return (
    <div>
    <div className="ImageVisibilityChecker">
      <h2>Selecciona una opción:</h2>

     {/* <button onClick={toggleSelectAll}>
        {selectAllChecked ? "NADA" : "TODO"}
      </button>*/}
        
      <button onClick={handleSelectIndices1}>ROJO I</button>
      <button onClick={handleSelectIndices2}>ROJO D</button>
      <button onClick={handleSelectIndices3}>VERDE I</button>
      <button onClick={handleSelectIndices4}>VERDE D</button>
      <button onClick={handleSelectIndices5}>AZUL I</button>
      <button onClick={handleSelectIndices6}>AZUL D</button>
     {/* <ul className="grid">
        {Array.from({ length: 40 }, (_, index) => (
          <li key={index} className="grid-item">
            <label>
              <input
                className="entradas"
                type="checkbox"
                checked={selectedIndices.includes(index)}
                onChange={() => toggleIndex(index)}
                disabled={checkboxesDisabled[index]}
              />
              Imagen {index}
            </label>
          </li>
        ))}
      </ul>

      <button onClick={checkSelectedButtons}>Grabar</button>

      <input
        type="text"
        placeholder="Ingresa un texto"
        value={textInput}
        onChange={handleTextInputChange}
      />

      <div>
        <p>Mensaje seleccionado: {mensaje}</p>
      </div> */}
    </div>
    </div>
  );
}

export default ImageVisibilityChecker;
