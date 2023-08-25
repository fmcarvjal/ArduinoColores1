import React, { useEffect, useRef, useState } from "react";
import * as handTrack from "handtrackjs";
import "./App.css";
import imagen from "./assets/imagen/Rojo.png";
import imagen2 from "./assets/imagen/Azul.png";
import imagen3 from "./assets/imagen/Verde.png";
import imagen1 from "./assets/imagen/naranja.png";
import imagen0 from "./assets/imagen/pacman3.png";

import ButtonComponent from "./ButtonComponent";

function Game({ imageUrls, moveDirections }) {
  const videoRef = useRef(null);
  const [handClosed, setHandClosed] = useState(false);
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  const [buttonColors, setButtonColors] = useState([
    "00",
    "#0000",
    "#0000",
    "Verde",
    "Azul",
  ]);
  const [lastClickedButton, setLastClickedButton] = useState(null);

  const [disabledButtons, setDisabledButtons] = useState([]);
  const [buttonPosition, setButtonPosition] = useState(0);
  const [moveDirection, setMoveDirection] = useState(0);
  const [ocultarButtons, setOcultarButtons] = useState(Array(23).fill(true));

  const [buttonOpacities, setButtonOpacities] = useState(Array(23).fill(1)); // Inicializar las opacidades

  const [scrollSpeed, setScrollSpeed] = useState(2);

  const handImageRef = useRef(null); // Referencia a la imagen de la mano
  const [prevHandPosition, setPrevHandPosition] = useState({ x: 0, y: 0 }); // Agregar esta línea

  

  useEffect(() => {
    const runHandDetection = async () => {
      const video = videoRef.current;
      const defaultParams = {
        flipHorizontal: true,
        outputStride: 8,
        imageScaleFactor: 0.3,
        maxNumBoxes: 8,
        iouThreshold: 0.2,
        scoreThreshold: 0.8,
        modelType: "ssd320fpnlite",
        modelSize: "low",
        bboxLineWidth: "1",
        fontSize: 17,
      };

      const model = await handTrack.load(defaultParams);
      await handTrack.startVideo(video);

      const detectHand = async () => {
        const predictions = await model.detect(video);

        predictions.forEach((prediction) => {
          const { label, bbox } = prediction;
          const [x, y] = bbox;

          if (label === "closed") {
            console.log("¡Mano cerrada detectada!");
            setHandClosed(true);
            setHandPosition({ x, y });
            setLastClickedButton(null); // Reset last clicked button when hand is closed
          } else if (label === "open") {
            console.log("¡Mano abierta detectada!");
            setHandClosed(false);
            setHandPosition({ x, y });
            handleButtonClick(x, y);
          } else if (label === "pinchtipoo") {
            console.log("¡Escribir!");
          }
        });

        requestAnimationFrame(detectHand);
      };

      detectHand();

      return () => {
        model.dispose();
        clearInterval(moveButtonInterval);
      };
    };

    if (videoRef.current) {
      runHandDetection();
    }
  }, []);

  useEffect(() => {
    const moveButtonInterval = setInterval(() => {
      setButtonPosition((prevPosition) => prevPosition+1.3);

      if (buttonPosition >= window.innerHeight + 1550) {
       setMoveDirection(moveDirections);
        setButtonPosition(10);
      } else if (buttonPosition <= 0) {
       setMoveDirection(moveDirections);
        setButtonPosition(10);
      }  
     
      
    }, moveDirection);

    return () => {
      clearInterval(moveButtonInterval);
    };
  }, [buttonPosition]);

  useEffect(() => {
    // Calcular las diferencias entre las coordenadas actuales y previas
    const deltaX = handPosition.x - prevHandPosition.x;
    const deltaY = handPosition.y - prevHandPosition.y;

    // Calcular el ángulo de rotación en radianes
    const angle = Math.atan2(deltaY, deltaX);

    // Convertir el ángulo a grados y aplicar la rotación
    if (handImageRef.current) {
      handImageRef.current.style.transform = `rotate(${angle}rad)`;
    }

    // Actualizar la posición previa de la mano
    setPrevHandPosition(handPosition);
  }, [handPosition]);

  const handleButtonClick = (x, y) => {
    const buttons = document.getElementsByClassName("button");
    const buttonWidth = buttons[0].offsetWidth;
    const buttonHeight = buttons[0].offsetHeight;

    let clickedButton = null;

    Array.from(buttons).forEach((button) => {
      const rect = button.getBoundingClientRect();
      const buttonX = rect.left + rect.width / 2;
      const buttonY = rect.top + rect.height / 2;

      if (
        x >= buttonX - buttonWidth / 2 &&
        x <= buttonX + buttonWidth / 2 &&
        y >= buttonY - buttonHeight / 2 &&
        y <= buttonY + buttonHeight / 2
      ) {
        clickedButton = button;
      }
    });

    if (clickedButton && clickedButton !== lastClickedButton) {
      clickedButton.click();
      setLastClickedButton(clickedButton);
    }
  };

  const handleClick = (index) => {
    if (!disabledButtons.includes(index)) {
      const updatedColors = [...buttonColors];
      updatedColors[index] =
        buttonColors[index] === "Verde" ? "Amarillo" : "Verde";
      setButtonColors(updatedColors);

      const updatedOcultar = [...ocultarButtons];
      updatedOcultar[index] = ocultarButtons[index] = false;
      setOcultarButtons(updatedOcultar);

      const updatedOpacities = [...buttonOpacities];
      updatedOpacities[index] = 0; // Cambiar la opacidad a 0.5 (puedes ajustar este valor)
      setButtonOpacities(updatedOpacities);

      setTimeout(() => {
        setDisabledButtons((prevDisabled) =>
          prevDisabled.filter((btnIndex) => btnIndex !== index)
        );
      }, 300); // Habilita el botón después de 1/2 segundo (ajusta el tiempo según tus necesidades)
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const video = videoRef.current;
      video.width = window.innerWidth;
      video.height = window.innerHeight;
      // Centrar el video en la pantalla
      video.style.left = `${(window.innerWidth - video.width) / 2}px`;
      video.style.top = `${(window.innerHeight - video.height) / 2}px`;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="app-container">
      <div className="video-container">
        <video ref={videoRef} autoPlay={true} />
      </div>

      <img
        className="hand-image"
        src={handClosed ? imagen1 : imagen0}
        alt="Hand"
        ref={handImageRef}
        style={{
          left: handPosition.x,
          top: handPosition.y,
          zIndex: handClosed ? 998 : 999,
        }}
      />

  
      <div className="button-container">
        <div className="button-row">
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(0)}
            imageUrl={imageUrls[0] || imagen}
            buttonText="00"
            isVisible={ocultarButtons[0]} // Pasar el valor de visibilidad como prop
            opacidad={buttonOpacities[0]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(1)}
            imageUrl={imageUrls[3] || imagen3}
            buttonText="11"
            isVisible={ocultarButtons[1]} // Pasar el valor de visibilidad como prop
            opacidad={buttonOpacities[1]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(2)}
            imageUrl={imageUrls[2] ||imagen2}
            buttonText="22"
            opacidad={buttonOpacities[2]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(3)}
            imageUrl={imageUrls[3] || imagen3}
            buttonText="33"
            opacidad={buttonOpacities[3]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(4)}
            imageUrl={imageUrls[1] || imagen2}
            buttonText="44"
            opacidad={buttonOpacities[4]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(5)}
            imageUrl={imageUrls[2] || imagen}
            buttonText="55"
            opacidad={buttonOpacities[5]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(6)}
            imageUrl={imageUrls[1] || imagen3}
            buttonText="66"
            opacidad={buttonOpacities[6]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(7)}
            imageUrl={imageUrls[0] || imagen}
            buttonText="77"
            opacidad={buttonOpacities[7]}
          />
        </div>

        <div className="button-row2">
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 750}
            handleClick={() => handleClick(8)}
            imageUrl={imageUrls[1] || imagen2}
            buttonText="88"
            opacidad={buttonOpacities[8]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 750}
            handleClick={() => handleClick(9)}
            imageUrl={imageUrls[1] || imagen}
            buttonText="99"
            opacidad={buttonOpacities[9]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 750}
            handleClick={() => handleClick(10)}
            imageUrl={imageUrls[2] || imagen2}
            buttonText="10"
            opacidad={buttonOpacities[10]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 750}
            handleClick={() => handleClick(11)}
            imageUrl={imageUrls[3] || imagen3}
            buttonText="11"
            opacidad={buttonOpacities[11]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 750}
            handleClick={() => handleClick(12)}
            imageUrl={imageUrls[0] || imagen2}
            buttonText="12"
            opacidad={buttonOpacities[12]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 750}
            handleClick={() => handleClick(13)}
            imageUrl={imageUrls[2] || imagen}
            buttonText="13"
            opacidad={buttonOpacities[13]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 750}
            handleClick={() => handleClick(14)}
            imageUrl={imageUrls[0] || imagen3}
            buttonText="14"
            opacidad={buttonOpacities[14]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 750}
            handleClick={() => handleClick(15)}
            imageUrl={imageUrls[1] || imagen2}
            buttonText="15"
            opacidad={buttonOpacities[15]}
          />
        </div>

        <div className="button-row2">
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1150}
            handleClick={() => handleClick(16)}
            imageUrl={imageUrls[3] || imagen}
            buttonText="16"
            opacidad={buttonOpacities[16]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1350}
            handleClick={() => handleClick(17)}
            imageUrl={imageUrls[2] || imagen3}
            buttonText="17"
            opacidad={buttonOpacities[17]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1550}
            handleClick={() => handleClick(18)}
            imageUrl={imageUrls[1] || imagen}
            buttonText="18"
            opacidad={buttonOpacities[18]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1250}
            handleClick={() => handleClick(19)}
            imageUrl={imageUrls[0] || imagen2}
            buttonText="19"
            opacidad={buttonOpacities[19]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1250}
            handleClick={() => handleClick(20)}
            imageUrl={imageUrls[2] || imagen}
            buttonText="20"
            opacidad={buttonOpacities[20]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1850}
            handleClick={() => handleClick(21)}
            imageUrl={imageUrls[1] || imagen3}
            buttonText="21"
            opacidad={buttonOpacities[21]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1850}
            handleClick={() => handleClick(22)}
            imageUrl={imageUrls[0] || imagen}
            buttonText="22"
            opacidad={buttonOpacities[22]}
          />
        </div>
      </div>
    </div>
  );
}

export default Game;
