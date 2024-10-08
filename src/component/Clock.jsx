import { useState, useEffect, useRef } from "react";
import upArrow from "../assets/up-arrow-svgrepo-com.svg";
import downArrow from "../assets/down-arrow-svgrepo-com.svg";
import playIcon from "../assets/multimedia-play-icon-circle-button-svgrepo-com.svg";
import pauseIcon from "../assets/multimedia-pause-icon-circle-button-svgrepo-com.svg";
import reloadIcon from "../assets/reload-svgrepo-com.svg";

const defaultConfig = {
  breakValue: 5,
  sessionValue: 25,
  timer: 1500, // default session time (in seconds)
};

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export default function Clock() {
  const [breakCount, setBreakCount] = useState(defaultConfig.breakValue);
  const [sessionCount, setSessionCount] = useState(defaultConfig.sessionValue);
  const [timer, setTimer] = useState(defaultConfig.sessionValue * 60); // initialize timer with session length
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true); // true if session, false if break
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const handlePlay = () => {
    audioRef.current.play();
  };

  const handleReset = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  // Toggle timer on and off
  /*
  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;

          // Timer hits zero, play the beep sound
          handlePlay();

          // Use the current value of isSession to decide what to do next
          if (isSession) {
            // Switch from session to break
            setIsSession(false);
            console.log("Switching to break time", isSession);
            // clearInterval(intervalRef.current);
            return breakCount * 60; // Set timer to the break length
          } else {
            // Switch from break to session
            setIsSession(true);
            // clearInterval(intervalRef.current);
            console.log("Switching to session time", isSession);
            return sessionCount * 60; // Set timer to the session length
          }
        });
      }, 1000);
    }
    setIsRunning(!isRunning);
  };
  */
  const toggleTimer = () => {
    if (isRunning) {
      // Stop the timer if it is currently running
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      // Start the timer
      setIsRunning(true);
  
      // Initialize the timer
      setTimer(isSession ? sessionCount * 60 : breakCount * 60);
  
      // Create the interval
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;
  
          // Timer hits zero, play the beep sound
          handlePlay();
  
          // Toggle the session state
          setIsSession((prevSession) => {
            const newSession = !prevSession; // Toggle the session state
            console.log(newSession ? "Switching to session time" : "Switching to break time");
            return newSession; // Update isSession state
          });
  
          // Reset timer for the next session/break
          return isSession ? breakCount * 60 : sessionCount * 60;
        });
      }, 1000);
    }
  };
  
  
  

  const increaseEvent = (type) => {
    if (type === "break") {
      setBreakCount((prev) => (prev < 60 ? prev + 1 : prev));
    } else {
      setSessionCount((prev) => (prev < 60 ? prev + 1 : prev));
      if (isSession) setTimer((prev) => (prev + 60)); // Increase timer only if in session
    }
  };

  const decreaseEvent = (type) => {
    if (type === "break") {
      setBreakCount((prev) => (prev > 1 ? prev - 1 : prev));
    } else {
      setSessionCount((prev) => (prev > 1 ? prev - 1 : prev));
      if (isSession) setTimer((prev) => (prev === 60 ? prev : prev - 60)); // Decrease timer only if in session
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setBreakCount(defaultConfig.breakValue);
    setSessionCount(defaultConfig.sessionValue);
    setTimer(defaultConfig.sessionValue * 60);
    setIsSession(true);
    handleReset();
  };

  useEffect(() => {
    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    // Update timer when session or break is changed
    setTimer(isSession ? sessionCount * 60 : breakCount * 60);
  }, [sessionCount, breakCount, isSession]);

  return (
    <div className="flex flex-col text-center">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-6xl font-bold py-4 text-white">25 + 5 Clock</h1>
          <div className="flex gap-10 py-4">
            <div className="block">
              <h4 id="break-label" className="text-3xl text-white">
                Break Length
              </h4>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={upArrow}
                  height={32}
                  width={32}
                  alt="Up arrow"
                  className="cursor-pointer"
                  onClick={() => increaseEvent("break")}
                  id="break-increment"
                />
                <h5 className="text-2xl text-white" id="break-length">
                  {breakCount}
                </h5>
                <img
                  src={downArrow}
                  height={32}
                  width={32}
                  alt="Down arrow"
                  className="cursor-pointer"
                  onClick={() => decreaseEvent("break")}
                  id="break-decrement"
                />
              </div>
            </div>
            <div className="block">
              <h4 id="session-label" className="text-3xl text-white">
                Session Length
              </h4>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={upArrow}
                  height={32}
                  width={32}
                  alt="Up arrow"
                  className="cursor-pointer"
                  onClick={() => increaseEvent("session")}
                  id="session-increment"
                />
                <h5 className="text-2xl text-white" id="session-length">
                  {sessionCount}
                </h5>
                <img
                  src={downArrow}
                  height={32}
                  width={32}
                  alt="Down arrow"
                  className="cursor-pointer"
                  onClick={() => decreaseEvent("session")}
                  id="session-decrement"
                />
              </div>
            </div>
          </div>
          <div className="timer my-4">
            <div className="rounded-full border-4 border-white p-4">
              <h4 className="text-3xl text-white leading-10" id="timer-label">
                {isSession ? "Session" : "Break"}
              </h4>
              <h5 className="text-6xl text-white" id="time-left">
                {formatTime(timer)}
              </h5>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              id="start_stop"
              onClick={toggleTimer}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {isRunning ? (
                <img src={pauseIcon} alt="Pause" height={32} width={32} />
              ) : (
                <img src={playIcon} alt="Play" height={32} width={32} />
              )}
            </button>
            <button
              id="reset"
              onClick={reset}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              <img src={reloadIcon} alt="Reset" height={32} width={32} />
            </button>
          </div>
          <audio
            id="beep"
            preload="auto"
            ref={audioRef}
            src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
          />
        </div>
      </main>
    </div>
  );
}
