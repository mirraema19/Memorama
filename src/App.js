import React, { useState } from 'react';
import MemoryIntro from './components/MemoryIntro';
import MemoryGame from './components/Logic/MemoryGame';
import MemoryGameTeens from './components/Logic/MemoryGameTeens';
import Timer from './components/Timer';
import './App.css';
import introImage from './assents/img/logo_fiscalia.png'; // Importa tu imagen aquí

const App = () => {
  const [showGame, setShowGame] = useState(false);
  const [showTeensGame, setShowTeensGame] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);

  const startGame = () => {
    setShowGame(true);
  };

  const startTeensGame = () => {
    setShowTeensGame(true);
  };

  const goBackToMenu = () => {
    setShowGame(false);
    setShowTeensGame(false);
    setTimerEnded(false);
  };

  return (
    <div className='App'>
      {!showGame && !showTeensGame ? (
        <div className='intro-container'>
          <img src={introImage} alt='Intro' className='intro-image' />
          <MemoryIntro startGame={startGame} startTeensGame={startTeensGame} />
        </div>
      ) : showTeensGame ? (
        <MemoryGameTeens goBackToMenu={goBackToMenu} />
      ) : (
        <>
          <Timer setTimerEnded={setTimerEnded} />
          <MemoryGame timerEnded={timerEnded} goBackToMenu={goBackToMenu} />
        </>
      )}
    </div>
  );
};

export default App;
