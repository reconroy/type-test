// src/components/Timer.js
import React, { useEffect } from 'react';

const Timer = ({ timeLeft, setTimeLeft, isTestActive }) => {
  useEffect(() => {
    if (isTestActive && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [timeLeft, isTestActive, setTimeLeft]);

  return (
    <div>
      <h2>Time Left: {timeLeft}s</h2>
    </div>
  );
};

export default Timer;
