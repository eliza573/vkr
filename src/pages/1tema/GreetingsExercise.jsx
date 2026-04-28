import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Exercise.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Character from "../../components/Character";
import { useEffect } from "react";

const GreetingsExercise = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); 
  const [connections, setConnections] = useState([]);
  const [activeStart, setActiveStart] = useState(null);
  const [placedLetters, setPlacedLetters] = useState(Array(5).fill(null));
  const [placedCaptions, setPlacedCaptions] = useState({});
  const containerRef = useRef(null);
  const [characterState, setCharacterState] = useState("idle");
  const [stepInitialized, setStepInitialized] = useState(false);
  
  const [selectedAnswer1, setSelectedAnswer1] = useState(null);
  const [selectedAnswer2, setSelectedAnswer2] = useState(null);
  const [quizLocked1, setQuizLocked1] = useState(false);
  const [quizLocked2, setQuizLocked2] = useState(false);

  const matchingData = {
    left: [
      { id: 'l1', text: "Саламатсыңарбы балдар?", img: "teacher_standing.png", width: "70px" },
      { id: 'l2', text: "Салам Айжан", img: "girl1.png", width: "90px" },
    ],
    right: [
      { id: 'r1', text: "Саламатсызбы эже?", img: "group_students.png", width: "130px" },
      { id: 'r3', text: "Салам Айдай", img: "girl2.png", width: "90px" },
    ],
    correct: { 'l1': 'r1', 'l2': 'r3' }
  };

  const correctScramble = ["С", "А", "Л", "А", "М"];
  const correctCaptions = {
    1: "Саламатсызбы чоң ата?",
    2: "Салам Айдай",
    3: "Саламатсызбы"
  };

  const scrambleLetters = ["С", "А", "М", "Л", "А"];

  const quizData1 = {
    question: "Кандайсын?",
    image: "bektur.png",
    options: ["Жакшы", "Саламатчылык", "Кандайсыз?"],
    correct: "Жакшы"
  };

  const quizData2 = {
    question: "Саламатсызбы чоң ата?",
    image: "aksakal.png",
    options: ["Салам Айдай", "Саламатсызбы", "Саламатчылык"],
    correct: "Саламатчылык"
  };

  const stepTalks = {
    0: "Дал келтиргиле! Сүйлөмдөрдү жана сүрөттөрдү туура дал келтиргиле.",
    1: "Туура жаз! Сөздү туура түзүү үчүн тамгаларды көчүрүп салгыла.",
    2: "Кантип саламдашабыз? Ар бир сүрөткө туура сөз айкашын тандап койгула.",
    3: "Кандайсын? Туура жоопту тандагыла.",
    4: "Саламатсызбы чоң апа? Туура жоопту тандагыла."
  };

  const playCharacterTalk = (step) => {
    setCharacterState("talk");
    setTimeout(() => {
      setCharacterState("idle");
    }, 3000);
  };

  const checkAnswerWithCharacter = (isCorrect) => {
    if (isCorrect) {
      setCharacterState("success");
      setTimeout(() => {
        setCharacterState("idle");
      }, 2000);
    } else {
      setCharacterState("error");
      setTimeout(() => {
        setCharacterState("idle");
      }, 2000);
    }
  };

  const isMatchingComplete = () => {
    return Object.keys(matchingData.correct).length === connections.filter(c => c.isCorrect).length;
  };

  const isScrambleComplete = () => {
    return placedLetters.every((letter, idx) => letter === correctScramble[idx]);
  };

  const isCaptionsComplete = () => {
    return Object.keys(correctCaptions).every(
      key => placedCaptions[key] === correctCaptions[key]
    );
  };

  const isQuiz1Complete = () => {
    return selectedAnswer1 === quizData1.correct;
  };

  const isQuiz2Complete = () => {
    return selectedAnswer2 === quizData2.correct;
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
    setStepInitialized(false);
  };

  useEffect(() => {
    if (currentStep < 5) {
      const timer = setTimeout(() => {
        playCharacterTalk(currentStep);
        setStepInitialized(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 0 && connections.length > 0 && stepInitialized) {
      const allCorrect = Object.keys(matchingData.correct).length === connections.filter(c => c.isCorrect).length;
      if (allCorrect) {
        checkAnswerWithCharacter(true);
      } else {
        const lastConnection = connections[connections.length - 1];
        if (lastConnection && !lastConnection.isCorrect) {
          checkAnswerWithCharacter(false);
        }
      }
    }
  }, [connections, currentStep, stepInitialized]);

  useEffect(() => {
    if (currentStep === 1 && stepInitialized) {
      const isComplete = isScrambleComplete();
      if (isComplete && placedLetters.some(l => l !== null)) {
        checkAnswerWithCharacter(true);
      } else if (placedLetters.some(l => l !== null) && !isComplete) {
        checkAnswerWithCharacter(false);
      }
    }
  }, [placedLetters, currentStep, stepInitialized]);

  useEffect(() => {
    if (currentStep === 2 && stepInitialized) {
      const isComplete = isCaptionsComplete();
      const hasAnyAnswer = Object.keys(placedCaptions).length > 0;
      if (isComplete && hasAnyAnswer) {
        checkAnswerWithCharacter(true);
      } else if (hasAnyAnswer && !isComplete) {
        checkAnswerWithCharacter(false);
      }
    }
  }, [placedCaptions, currentStep, stepInitialized]);

  const handleQuiz1Answer = (answer) => {
    if (quizLocked1) return;
    setSelectedAnswer1(answer);
    setQuizLocked1(true);
    
    const isCorrect = answer === quizData1.correct;
    checkAnswerWithCharacter(isCorrect);
  };

  const handleQuiz2Answer = (answer) => {
    if (quizLocked2) return;
    setSelectedAnswer2(answer);
    setQuizLocked2(true);
    
    const isCorrect = answer === quizData2.correct;
    checkAnswerWithCharacter(isCorrect);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setConnections([]);
    setPlacedLetters(Array(5).fill(null));
    setPlacedCaptions({});
    setActiveStart(null);
    setStepInitialized(false);
    setSelectedAnswer1(null);
    setSelectedAnswer2(null);
    setQuizLocked1(false);
    setQuizLocked2(false);
  };

  const getLetterClass = (char, index) => {
    if (!char) return "drop-slot";
    return char === correctScramble[index] ? "drop-slot correct" : "drop-slot wrong";
  };

  const getCaptionClass = (id) => {
    const placed = placedCaptions[id];
    if (!placed) return "drop-zone-green";
    return placed === correctCaptions[id] ? "drop-zone-green correct" : "drop-zone-green wrong";
  };

  const isMatched = (id) => connections.some(conn => (conn.start.id === id || conn.end.id === id) && conn.isCorrect);

  const handlePointClick = (id, side, e) => {
    if (isMatched(id)) return;
    const rect = e.target.getBoundingClientRect();
    const cRect = containerRef.current.getBoundingClientRect();
    const currentPoint = { x: rect.left + rect.width / 2 - cRect.left, y: rect.top + rect.height / 2 - cRect.top, id, side };

    if (!activeStart) { 
      setActiveStart(currentPoint); 
    } else {
      if (activeStart.side !== side) {
        const isCorrect = side === 'right' ? matchingData.correct[activeStart.id] === id : matchingData.correct[id] === activeStart.id;
        const newConnections = [...connections, { start: activeStart, end: currentPoint, isCorrect }];
        setConnections(newConnections);
      }
      setActiveStart(null);
    }
  };

  const handleDragStart = (e, content, type) => {
    e.dataTransfer.setData("content", content);
    e.dataTransfer.setData("type", type);
  };

  const handleDropToLetterSlot = (e, index) => {
    e.preventDefault();
    const content = e.dataTransfer.getData("content");
    if (e.dataTransfer.getData("type") === "letter") {
      const newLetters = [...placedLetters];
      newLetters[index] = content;
      setPlacedLetters(newLetters);
    }
  };

  const handleDropToCaptionSlot = (e, slotId) => {
    e.preventDefault();
    const content = e.dataTransfer.getData("content");
    setPlacedCaptions(prev => ({ ...prev, [slotId]: content }));
  };

  const getOptionClass = (option, selected, correct) => {
    if (!selected) return "quiz-option";
    if (selected === option) {
      return option === correct ? "quiz-option correct-answer" : "quiz-option wrong-answer";
    }
    return "quiz-option disabled";
  };

  return (
    <div className="greetings-ex-page">
      <Navbar />
      <div className="greetings-ex-layout">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="greetings-ex-content">
          <h2 className="ex1-title">Саламдашуу / көнүгүү</h2>
          
          <div className="progress-container">
            <div
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
            ></div>
          </div>
          
          <div className="ex-header-banner">
            {currentStep === 0 && "Дал келтиргиле"}
            {currentStep === 1 && "Туура жаз"}
            {currentStep === 2 && "Кантип саламдашабыз?"}
            {(currentStep === 3 || currentStep === 4) && "Туура жоопту танда"}
          </div>

          <div className="exercise-scroll-container">
            {/* Упражнение 0: Matching */}
            {currentStep === 0 && (
              <div className="step-content">
                <div className="matching-area" ref={containerRef}>
                  <svg className="arrows-svg">
                    {connections.map((conn, i) => (
                      <line key={i} x1={conn.start.x} y1={conn.start.y} x2={conn.end.x} y2={conn.end.y} 
                            stroke={conn.isCorrect ? "#66f877" : "#ff4d4d"} strokeWidth="3" />
                    ))}
                  </svg>
                  <div className="matching-grid">
                    <div className="items-column">
                      {matchingData.left.map(item => (
                        <div key={item.id} className={`match-row left ${isMatched(item.id) ? 'matched' : ''}`}>
                          <div className="bubble-text left">{item.text}</div>
                          <img src={`/src/assets/1tema/${item.img}`} style={{width: '80px', height: 'auto'}} alt=""/>
                          <div className={`dot ${activeStart?.id === item.id ? 'active' : ''}`} onClick={(e) => handlePointClick(item.id, 'left', e)}></div>
                        </div>
                      ))}
                    </div>
                    <div className="items-column">
                      {matchingData.right.map(item => (
                        <div key={item.id} className={`match-row right ${isMatched(item.id) ? 'matched' : ''}`}>
                          <div className="dot" onClick={(e) => handlePointClick(item.id, 'right', e)}></div>
                          <img src={`/src/assets/1tema/${item.img}`} style={{width: '120px', height: 'auto'}} alt=""/>
                          <div className="bubble-text right">{item.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Упражнение 1: Scramble */}
            {currentStep === 1 && (
              <div className="step-content">
                <div className="task-image-container">
                  <img src="/src/assets/1tema/askar_walk.png" className="task-img-large" alt="task" />
                </div>
                <div className="slots-row">
                  {placedLetters.map((char, i) => (
                    <div key={i} 
                         className={getLetterClass(char, i)} 
                         onDragOver={(e) => e.preventDefault()} 
                         onDrop={(e) => handleDropToLetterSlot(e, i)}>
                      {char}
                    </div>
                  ))}
                </div>
                <div className="letters-pool">
                  {scrambleLetters.map((l, i) => (
                    <div key={i} className="drag-item letter" draggable onDragStart={(e) => handleDragStart(e, l, "letter")}>{l}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Упражнение 2: Captions Drag & Drop */}
            {currentStep === 2 && (
              <div className="step-content">
                <div className="images-row">
                  {[
                    {id: 1, img: "aksakal.png", w: "130px"},
                    {id: 2, img: "girls_shaking_hands.png", w: "170px"},
                    {id: 3, img: "teacher_standing.png", w: "90px"}
                  ].map(item => (
                    <div key={item.id} className="cap-card">
                      <img src={`/src/assets/1tema/${item.img}`} style={{width: item.w, height: 'auto'}} alt=""/>
                      <div className={getCaptionClass(item.id)} 
                           onDragOver={(e) => e.preventDefault()} 
                           onDrop={(e) => handleDropToCaptionSlot(e, item.id)}>
                        {placedCaptions[item.id] || ""}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="options-pool">
                  {["Салам Айдай", "Саламатсызбы", "Саламатсызбы чоң ата?"].map(txt => (
                    <div key={txt} className="drag-item caption" draggable onDragStart={(e) => handleDragStart(e, txt, "caption")}>{txt}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Упражнение 3: Quiz - Кандайсын? */}
            {currentStep === 3 && (
              <div className="step-content">
                <div className="task-image-container">
                  <img src={`/src/assets/1tema/${quizData1.image}`} className="task-img-large" alt="task" />
                </div>
                <div className="question-text">
                  <p className="question-kg">{quizData1.question}</p>
                </div>
                <div className="quiz-options-horizontal">
                  {quizData1.options.map((option, idx) => (
                    <button
                      key={idx}
                      className={getOptionClass(option, selectedAnswer1, quizData1.correct)}
                      onClick={() => handleQuiz1Answer(option)}
                      disabled={quizLocked1}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Упражнение 4: Quiz - Саламатсызбы чоң ата? */}
            {currentStep === 4 && (
              <div className="step-content">
                <div className="task-image-container">
                  <img src={`/src/assets/1tema/${quizData2.image}`} className="task-img-large" alt="task" />
                </div>
                <div className="question-text">
                  <p className="question-kg">{quizData2.question}</p>
                </div>
                <div className="quiz-options-horizontal">
                  {quizData2.options.map((option, idx) => (
                    <button
                      key={idx}
                      className={getOptionClass(option, selectedAnswer2, quizData2.correct)}
                      onClick={() => handleQuiz2Answer(option)}
                      disabled={quizLocked2}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Упражнение 5: Финальный экран */}
            {currentStep === 5 && (
              <div className="finish-screen">
                <div className="finish-icon">🏆</div>
                <h2>Азаматсың!</h2>
                <p>Бардык көнүгүүнү ийгиликтүү аяктадың!</p>
                <div className="finish-buttons">
                  <button className="btn-retry" onClick={resetQuiz}>Кайра аткаруу</button>
                  <button className="btn-home" onClick={() => navigate("/")}>Башкы бет</button>
                </div>
              </div>
            )}
          </div>

          {currentStep < 5 && (
            <div className="nav-controls">
              <button 
                className="nav-btn back" 
                onClick={() => {
                  setCurrentStep(prev => prev - 1);
                  setStepInitialized(false);
                }}
                disabled={currentStep === 0}
              >
                Артка
              </button>
              <button 
                className="nav-btn next" 
                onClick={handleNextStep}>
                Кийинки
              </button>
            </div>
          )}
          
          <Character state={characterState} />
        </div>
      </div>
    </div>
  );
};

export default GreetingsExercise;