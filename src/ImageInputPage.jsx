import React, { useState, useEffect } from "react";
import "./ImageInputPage.css"; // Importa tu archivo de estilos CSS

function ImageInputPage({ onImageSubmit }) {
  const initialUrls = ["", "", "", ""];
  const [imageUrls, setImageUrls] = useState(initialUrls);
  // Cargar los enlaces almacenados en el almacenamiento local al inicio
  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem("imageUrls")) || initialUrls;
    setImageUrls(storedUrls);
  }, []);

  const handleImageUrlChange = (index, newUrl) => {
    const updatedImageUrls = [...imageUrls];
    updatedImageUrls[index] = newUrl;
    setImageUrls(updatedImageUrls);
  };

  const handleClearUrl = (index) => {
    const updatedImageUrls = [...imageUrls];
    updatedImageUrls[index] = ""; // Borra el valor del input
    setImageUrls(updatedImageUrls);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onImageSubmit(imageUrls); // Enviamos las URLs al componente App

    // Guardar los enlaces en el almacenamiento local
    localStorage.setItem("imageUrls", JSON.stringify(imageUrls));
  };

  return (
    <div className="image-input-container"> {/* Aplica el estilo al contenedor */}
      <h2>Ingrese las URLs de las imágenes para cada índice:</h2>
      <form onSubmit={handleSubmit}>
        {imageUrls.map((url, index) => (
          <div className="image-input-row" key={index}> {/* Estilo para cada fila */}
            <label>Índice {index}:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => handleImageUrlChange(index, e.target.value)}
            />
            {url && (
              <img src={url} alt={`Imagen ${index}`} className="image-preview" />
            )}
            <button
              type="button"
              onClick={() => handleClearUrl(index)}
              className="clear-button"
            >
              Borrar
            </button>
          </div>
        ))}
        <button type="submit" className="submit-button">Agregar Imágenes</button>
      </form>
    </div>
  );
}

export default ImageInputPage;
