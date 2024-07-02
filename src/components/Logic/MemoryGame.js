import React, { useState, useEffect } from 'react';
import Board from '../Board/Board';
import confetti from 'canvas-confetti';

import '../Logic/MemoryGameTeens.css'

import leftImage from '../../assents/img/Niño interrogacion.png'; // Importar la imagen izquierda
import rightImage from '../../assents/img/Niño con foco.png'; // Importar la imagen derecha

import gon from '../../assents/img/DESTRUIR COSAS.png';
import killua from '../../assents/img/MORDER.png';
import hisoka from '../../assents/img/ABUSO.png';
import leorio from '../../assents/img/BROMAS HIRIENTES.png';
import netero from '../../assents/img/GOLPEAR.png';
import kurapika from '../../assents/img/CONTROL.png';
import wing from '../../assents/img/IGNORAR.png';
import merum from '../../assents/img/SEÑALAMIENTOS.png';
import lucilfer from '../../assents/img/VIOLENCIA FISICA.png';
import biscuit from '../../assents/img/ACOSO.png';

const newimages = [netero, gon, killua, hisoka, leorio, kurapika, wing, merum, lucilfer, biscuit];
const initialSize = 4;
let size = initialSize;
let clicks = 0;

const MemoryGame = ({ timerEnded, goBackToMenu }) => {
  const [shuffledMemoBlocks, setShuffledMemoBlocks] = useState([]);
  const [selectedMemoBlock, setSelectedMemoBlock] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [gameEnded, setGameEnded] = useState(false); 

  useEffect(() => {
    initializeGame(size);
  }, []);

  useEffect(() => {
    let intervalId;
    if (gameStarted && timerSeconds > 0 && !timerEnded) {
      intervalId = setInterval(() => {
        setTimerSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
      if (timerEnded) {
        setGameEnded(true); 
      }
    };
  }, [gameStarted, timerSeconds, timerEnded]); 

  const initializeGame = (size) => {
    const imageList = newimages.slice(0, size);
    const shuffledImageList = shuffleArray([...imageList, ...imageList]);
    setShuffledMemoBlocks(
      shuffledImageList.map((image, i) => ({
        index: i,
        image,
        flipped: false,
      }))
    );
  };

  const shuffleArray = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const handleMemoClick = (memoBlock) => {
    if (!gameStarted || animating || timerEnded || gameEnded) return;

    if (timerEnded) return; // Si el temporizador ha terminado, salir sin hacer nada
    
    const flippedMemoBlock = { ...memoBlock, flipped: true };
    let shuffledMemoBlocksCopy = [...shuffledMemoBlocks];
    shuffledMemoBlocksCopy.splice(memoBlock.index, 1, flippedMemoBlock);
    setShuffledMemoBlocks(shuffledMemoBlocksCopy);
    clicks += 1;

    if (selectedMemoBlock === null) {
      setSelectedMemoBlock(memoBlock);
    } else if (selectedMemoBlock.image === memoBlock.image) {
      setSelectedMemoBlock(null);
      if (shuffledMemoBlocksCopy.every((block) => block.flipped)) {
        calculateScore();
        confetti({
          particleCount: 200,
          startVelocity: 30,
          spread: 300,
          gravity: 1.5,
          origin: { y: 0 },
        });
        size += 2;
        setTimeout(() => {
          setShuffledMemoBlocks([]);
          setSelectedMemoBlock(null);
          setAnimating(false);
          initializeGame(size);
        }, 500);
      }
    } else {
      setAnimating(true);
      setTimeout(() => {
        shuffledMemoBlocksCopy.splice(memoBlock.index, 1, memoBlock);
        shuffledMemoBlocksCopy.splice(selectedMemoBlock.index, 1, selectedMemoBlock);
        setShuffledMemoBlocks(shuffledMemoBlocksCopy);
        setSelectedMemoBlock(null);
        setAnimating(false);
      }, 500);
    }
  };

  const calculateScore = () => {
    const passLevel = size * 10;
    let total = score;
    const cards = size * 2;

    if (clicks === cards) {
      total = total + cards * 2 + passLevel;
    } else if (clicks > cards && clicks < cards + 5) {
      total = total + cards + passLevel;
    } else if (clicks > cards + 5 && clicks < cards + 10) {
      total = total + cards / 2 + passLevel;
    } else {
      total = total + Math.round(cards / 3) + passLevel;
    }
    clicks = 0;
    setScore(total);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div className='App'>
      <img src={leftImage} className='left-image' alt='Left' />
      
      <img src={rightImage} className='right-image' alt='Right' />
      
      <h1 className='h1'>Memory Game</h1>
      <div className='cont'>
        <div className='buttons'>
          {!gameStarted && (
            <button onClick={handleStartGame} className='start-button' variant='text' color='default'>
              Comenzar
            </button>
          )}
          {gameStarted && !timerEnded && <h2>Tiempo: {timerSeconds} segundos</h2>}
          {gameStarted && <h2>Puntaje: {score}</h2>}
          {gameEnded && <h2>The game has ended!</h2>}
        </div>
      </div>
      <Board className='bor' memoBlocks={shuffledMemoBlocks} animating={animating} handleMemoClick={handleMemoClick} />
      <button onClick={goBackToMenu} className='back-button'>Regresar al Menú</button>
    </div>
  );
};

export default MemoryGame;
