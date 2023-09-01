import React, { useEffect, useRef, useState } from "react";
import * as handTrack from "handtrackjs";
import "./App.css";
import imagen from "./assets/imagen/Rojo.png";
import imagen2 from "./assets/imagen/Azul.png";
import imagen3 from "./assets/imagen/Verde.png";
import imagen1 from "./assets/imagen/naranja.png";
import imagen0 from "./assets/imagen/pacman3.png";
import imagen4 from "./assets/imagen/barra.png";

import ButtonComponent from "./ButtonComponent";

import marioSound from "./pacman-intermission.mp3";
import SoundOver from "./pacman-5.mp3";

// Importar librería de voz
const synth = window.speechSynthesis;

function Game({ imageUrls, moveDirections, Indexs }) {
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
  const [ocultarButtons, setOcultarButtons] = useState(Array(40).fill(true));

  const [buttonOpacities, setButtonOpacities] = useState(Array(40).fill(1)); // Inicializar las opacidades

  const [scrollSpeed, setScrollSpeed] = useState(2);

  const handImageRef = useRef(null); // Referencia a la imagen de la mano
  const [prevHandPosition, setPrevHandPosition] = useState({ x: 0, y: 0 }); // Agregar esta línea

  const [successMessageShown, setSuccessMessageShown] = useState(false);

  const [hiddenIncorrectImages, setHiddenIncorrectImages] = useState(0);

  const showAlert = () => {
    // Reproduce el sonido del alert
    const alertAudio = new Audio(SoundOver);

    alertAudio.play();

    // Muestra el alert
    alert("¡Game Over! Has ocultado 3 imágenes incorrectas.");
  };

  useEffect(() => {
    const audio = new Audio(marioSound);
    audio.loop = true; // Reproducir el sonido en bucle
    audio.pause();

    return () => {
      audio.pause();
    };
  }, []);

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

      // ...

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
      setButtonPosition((prevPosition) => prevPosition + 1.3);

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
      updatedOpacities[index] = 0; // Cambiar la opacidad a 0 (puedes ajustar este valor)
      setButtonOpacities(updatedOpacities);

      setTimeout(() => {
        setDisabledButtons((prevDisabled) =>
          prevDisabled.filter((btnIndex) => btnIndex !== index)
        );

        const incorrectHiddenImages = updatedOpacities.reduce(
          (count, opacity, buttonIndex) =>
            opacity === 0 && !Indexs.includes(buttonIndex) ? count + 1 : count,
          0
        );
        setHiddenIncorrectImages(incorrectHiddenImages);
        if (!Indexs || Indexs.length > 40) {
          //cuando la matriz esta vacia tiene una longitud de 40

          alert("Por favor seleccionar la opción : Seleccionar Index");
          window.location.reload();
          // return;  Detener la ejecución si la matriz Indexs está vacía
        }

        if (hiddenIncorrectImages >= 3) {
          const successMessage = new SpeechSynthesisUtterance(
            "¡Intenta otra vez!  Has ocultado 3 imágenes incorrectas.  "
          );
          synth.speak(successMessage);
          showAlert();
          window.location.reload();
        }

        const allButtonsHidden = Indexs.every(
          (buttonIndex) => updatedOpacities[buttonIndex] === 0
        );

        if (allButtonsHidden && !successMessageShown) {
          setSuccessMessageShown(true);
          // Cambiar el mensaje de alerta por un mensaje de voz
          const successMessage = new SpeechSynthesisUtterance(
            "¡Bien hecho! Felicitaciones "
          );
          synth.speak(successMessage);

          window.location.reload();
        }
        console.log("Matriz Indexs:", Indexs.length);
      }, 0);
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

      <div className="incorrect-images-count">
        {/* Muestra el número de imágenes incorrectas */}
        <div>{3- hiddenIncorrectImages}</div>
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
            buttonText="01"
            isVisible={ocultarButtons[1]} // Pasar el valor de visibilidad como prop
            opacidad={buttonOpacities[1]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(2)}
            imageUrl={imageUrls[2] || imagen2}
            buttonText="02"
            opacidad={buttonOpacities[2]}
          />

          <ButtonComponent
            className="ButtonComponent" /* Asigna la clase directamente */
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(3)}
            imageUrl={imagen4}
            buttonText=""
            opacidad={buttonOpacities[113]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(4)}
            imageUrl={imagen4}
            buttonText=""
            opacidad={buttonOpacities[114]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(5)}
            imageUrl={imageUrls[2] || imagen}
            buttonText="05"
            opacidad={buttonOpacities[5]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(6)}
            imageUrl={imageUrls[1] || imagen3}
            buttonText="06"
            opacidad={buttonOpacities[6]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 150}
            handleClick={() => handleClick(7)}
            imageUrl={imageUrls[0] || imagen}
            buttonText="07"
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
            imageUrl={imagen4}
            buttonText=""
            opacidad={buttonOpacities[111]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 750}
            handleClick={() => handleClick(12)}
            imageUrl={imagen4}
            buttonText=""
            opacidad={buttonOpacities[112]}
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
            position={buttonPosition - 1100}
            handleClick={() => handleClick(16)}
            imageUrl={imageUrls[3] || imagen}
            buttonText="16"
            opacidad={buttonOpacities[16]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1100}
            handleClick={() => handleClick(17)}
            imageUrl={imageUrls[2] || imagen3}
            buttonText="17"
            opacidad={buttonOpacities[17]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1100}
            handleClick={() => handleClick(18)}
            imageUrl={imageUrls[1] || imagen}
            buttonText="18"
            opacidad={buttonOpacities[18]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1100}
            handleClick={() => handleClick(19)}
            imageUrl={imagen4}
            buttonText=""
            opacidad={buttonOpacities[119]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1100}
            handleClick={() => handleClick(20)}
            imageUrl={imagen4}
            buttonText=""
            opacidad={buttonOpacities[201]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1100}
            handleClick={() => handleClick(21)}
            imageUrl={imageUrls[1] || imagen3}
            buttonText="21"
            opacidad={buttonOpacities[21]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1100}
            handleClick={() => handleClick(22)}
            imageUrl={imageUrls[0] || imagen}
            buttonText="22"
            opacidad={buttonOpacities[22]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1100}
            handleClick={() => handleClick(23)}
            imageUrl={imageUrls[3] || imagen2}
            buttonText="23"
            opacidad={buttonOpacities[23]}
          />
        </div>
        <div className="button-row3">
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1700}
            handleClick={() => handleClick(24)}
            imageUrl={imageUrls[2] || imagen3}
            buttonText="24"
            opacidad={buttonOpacities[24]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1700}
            handleClick={() => handleClick(25)}
            imageUrl={imageUrls[1] || imagen2}
            buttonText="25"
            opacidad={buttonOpacities[25]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1700}
            handleClick={() => handleClick(26)}
            imageUrl={imageUrls[0] || imagen}
            buttonText="26"
            opacidad={buttonOpacities[26]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1700}
            handleClick={() => handleClick(27)}
            imageUrl={imagen4}
            buttonText=""
            opacidad={buttonOpacities[271]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1700}
            handleClick={() => handleClick(28)}
            imageUrl={imagen4}
            buttonText=""
            opacidad={buttonOpacities[281]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1700}
            handleClick={() => handleClick(29)}
            imageUrl={imageUrls[0] || imagen}
            buttonText="29"
            opacidad={buttonOpacities[29]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1700}
            handleClick={() => handleClick(30)}
            imageUrl={imageUrls[3] || imagen3}
            buttonText="30"
            opacidad={buttonOpacities[30]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1700}
            handleClick={() => handleClick(31)}
            imageUrl={imageUrls[2] || imagen3}
            buttonText="31"
            opacidad={buttonOpacities[31]}
          />
        </div>
        <div className="button-row4">
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1500}
            handleClick={() => handleClick(32)}
            imageUrl={imageUrls[1] || imagen2}
            buttonText="32"
            opacidad={buttonOpacities[32]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1500}
            handleClick={() => handleClick(33)}
            imageUrl={imageUrls[0] || imagen}
            buttonText="33"
            opacidad={buttonOpacities[33]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1500}
            handleClick={() => handleClick(34)}
            imageUrl={imageUrls[2] || imagen}
            buttonText="34"
            opacidad={buttonOpacities[34]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1500}
            handleClick={() => handleClick(35)}
            imageUrl={imagen4}
            buttonText=""
            opacidad={buttonOpacities[351]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1500}
            handleClick={() => handleClick(36)}
            imageUrl={imagen4}
            buttonText=""
            opacidad={buttonOpacities[361]}
          />
          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1500}
            handleClick={() => handleClick(37)}
            imageUrl={imageUrls[1] || imagen3}
            buttonText="37"
            opacidad={buttonOpacities[37]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1500}
            handleClick={() => handleClick(38)}
            imageUrl={imageUrls[0] || imagen}
            buttonText="38"
            opacidad={buttonOpacities[38]}
          />

          <ButtonComponent
            color={buttonColors[0]}
            position={buttonPosition - 1500}
            handleClick={() => handleClick(39)}
            imageUrl={imageUrls[0] || imagen}
            buttonText="39"
            opacidad={buttonOpacities[39]}
          />
        </div>
      </div>
    </div>
  );
}

export default Game;
