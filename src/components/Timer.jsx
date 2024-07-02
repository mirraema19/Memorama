import React, { useEffect, useRef } from "react";
import Countdown from "react-countdown";

const Counter = ({ seconds }) => <span>{seconds === 0 ? 60 : seconds}</span>;

const Timer = ({ start, setTimerEnded }) => {
  const timerRef = useRef();

  const handleEnd = () => {
    console.log("Timer ended");
    setTimerEnded(true);
  };

  useEffect(() => {
    if (start) {
      timerRef.current.start();
    }
  }, [start]);

  return (
    <div className="timer">
      
    </div>
  );
};

export default Timer;
