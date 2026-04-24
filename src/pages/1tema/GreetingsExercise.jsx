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
  
  // Состояния для новых упражнений (выбор ответа)
  const [selectedAnswer1, setSelectedAnswer1] = useState(null);
  const [selectedAnswer2, setSelectedAnswer2] = useState(null);
  const [quizLocked1, setQuizLocked1] = useState(false);
  const [quizLocked2, setQuizLocked2] = useState(false);

  const matchingData = {
    left: [
      { id: 'l1', text: "Саламатсыңарбы балдар?", img: "teacher_standing.png", width: "70px" },
      { id: 'l2', text: "Салам Айжан", img: "girl1.png", width: "90px" },
      { id: 'l3', text: "Кандайсыз? Бектур байке", img: "boy_standing.png", width: "90px" },
    ],
    right: [
      { id: 'r1', text: "Саламатсызбы эже?", img: "group_students.png", width: "130px" },
      { id: 'r2', text: "Жакшы", img: "boy_red_shirt.png", width: "80px" },
      { id: 'r3', text: "Салам Айдай", img: "girl2.png", width: "90px" },
    ],
    correct: { 'l1': 'r1', 'l2': 'r3', 'l3': 'r2' }
  };

  // Правильные ответы для 2 и 3 упражнения
  const correctScramble = ["С", "А", "Л", "А", "М"];
  const correctCaptions = {
    1: "Саламатсызбы чоң ата?",
    2: "Салам Айдай",
    3: "Саламатсызбы"
  };

  const scrambleLetters = ["С", "А", "М", "Л", "А"];

  // Данные для упражнения 3 (выбор ответа) - "Кандайсын?"
  const quizData1 = {
    question: "Кандайсын?",
    image: "bektur.png",
    options: ["Жакшы", "Саламатчылык", "Кандайсыз?"],
    correct: "Жакшы"
  };

  // Данные для упражнения 4 (выбор ответа) - "Саламатсызбы чоң ата?"
  const quizData2 = {
    question: "Саламатсызбы чоң ата?",
    image: "aksakal.png",
    options: ["Салам Айдай", "Саламатсызбы", "Саламатчылык"],
    correct: "Саламатчылык"
  };

  // Текст для озвучки персонажа на каждом шаге (теперь 5 шагов)
  const stepTalks = {
    0: "Дал келтиргиле! Сүйлөмдөрдү жана сүрөттөрдү туура дал келтиргиле.",
    1: "Туура жаз! Сөздү туура түзүү үчүн тамгаларды көчүрүп салгыла.",
    2: "Кантип саламдашабыз? Ар бир сүрөткө туура сөз айкашын тандап койгула.",
    3: "Кандайсын? Туура жоопту тандагыла.",
    4: "Саламатсызбы чоң апа? Туура жоопту тандагыла."
  };

  // Функция для воспроизведения речи персонажа
  const playCharacterTalk = (step) => {
    setCharacterState("talk");
    setTimeout(() => {
      setCharacterState("idle");
    }, 3000);
  };

  // Функция для проверки ответов с анимацией персонажа (без автоматического перехода)
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

  // Проверка Matching упражнения (шаг 0)
  const isMatchingComplete = () => {
    return Object.keys(matchingData.correct).length === connections.filter(c => c.isCorrect).length;
  };

  // Проверка Scramble упражнения (шаг 1)
  const isScrambleComplete = () => {
    return placedLetters.every((letter, idx) => letter === correctScramble[idx]);
  };

  // Проверка Captions упражнения (шаг 2)
  const isCaptionsComplete = () => {
    return Object.keys(correctCaptions).every(
      key => placedCaptions[key] === correctCaptions[key]
    );
  };

  // Проверка Quiz 1 (шаг 3)
  const isQuiz1Complete = () => {
    return selectedAnswer1 === quizData1.correct;
  };

  // Проверка Quiz 2 (шаг 4)
  const isQuiz2Complete = () => {
    return selectedAnswer2 === quizData2.correct;
  };


  const handleNextStep = () => {
    //  переход на следующий шаг без проверки
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

  // Автоматическая ПРОВЕРКА (без перехода) для Matching (шаг 0)
  useEffect(() => {
    if (currentStep === 0 && connections.length > 0 && stepInitialized) {
      const allCorrect = Object.keys(matchingData.correct).length === connections.filter(c => c.isCorrect).length;
      if (allCorrect) {
        checkAnswerWithCharacter(true);
      } else {
        // Проверяем было ли последнее соединение неправильным
        const lastConnection = connections[connections.length - 1];
        if (lastConnection && !lastConnection.isCorrect) {
          checkAnswerWithCharacter(false);
        }
      }
    }
  }, [connections, currentStep, stepInitialized]);

  // Автоматическая проверка для Scramble (шаг 1)
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

  // Автоматическая проверка для Captions (шаг 2)
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

  // Обработчики для выбора ответа в викторинах (с проверкой, но без перехода)
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

  // Логика проверки для букв
  const getLetterClass = (char, index) => {
    if (!char) return "drop-slot";
    return char === correctScramble[index] ? "drop-slot correct" : "drop-slot wrong";
  };

  // Логика проверки для подписей
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

  // Получение класса для кнопки варианта ответа
  const getOptionClass = (option, selected, correct) => {
    if (!selected) return "quiz-option";
    if (selected === option) {
      return option === correct ? "quiz-option correct-answer" : "quiz-option wrong-answer";
    }
    return "quiz-option disabled";
  };

  return (
    <div className="greetings-container">
      <Navbar />
      <div className="exercise-layout">
        <Sidebar />
        <div className="exercise-main-content">
          <h2 className="ex1-title">Саламдашуу/ көнүгүү</h2>
          {/* Прогресс */}
          <div className="progress-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
            ></div>
          </div>
          
          {/* Упражнение 0: Matching */}
          {currentStep === 0 && (
            <div className="step-wrapper">
              <div className="header-banner">Дал келтиргиле</div>
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
                        <img src={`/src/assets/1tema/${item.img}`} style={{width: item.width, height: 'auto'}} alt=""/>
                        <div className={`dot ${activeStart?.id === item.id ? 'active' : ''}`} onClick={(e) => handlePointClick(item.id, 'left', e)}></div>
                      </div>
                    ))}
                  </div>
                  <div className="items-column">
                    {matchingData.right.map(item => (
                      <div key={item.id} className={`match-row right ${isMatched(item.id) ? 'matched' : ''}`}>
                        <div className="dot" onClick={(e) => handlePointClick(item.id, 'right', e)}></div>
                        <img src={`/src/assets/1tema/${item.img}`} style={{width: item.width, height: 'auto'}} alt=""/>
                        <div className="bubble-text right">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Упражнение 1: Scramble (Туура жаз) */}
          {currentStep === 1 && (
            <div className="scramble-section">
              <div className="header-banner">Туура жаз</div>
              <img src="/src/assets/1tema/askar_walk.png" style={{width: '180px', marginBottom: '20px'}} alt=""/>
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
            <div className="captions-drag-section">
              <div className="header-banner">Кантип саламдашабыз?</div>
              <div className="images-row">
                {[
                  {id: 1, img: "aksakal.png", w: "140px"},
                  {id: 2, img: "girls_shaking_hands.png", w: "190px"},
                  {id: 3, img: "teacher_standing.png", w: "100px"}
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
            <div className="scramble-section">
              <div className="header-banner">Туура жоопту танда</div>           
                  <img src={`/src/assets/1tema/${quizData1.image}`} style={{width: '200px', marginBottom: '0px'}} alt=""/>
                  <h3>{quizData1.question}</h3>
              
                <div className="quiz-options">
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
            <div className="scramble-section">
              <div className="header-banner">Туура жоопту танда</div>
                  <img src={`/src/assets/1tema/${quizData2.image}`} style={{width: '130px', marginBottom: '0px'}} />
                  <h3>{quizData2.question}</h3>
                
                <div className="quiz-options">
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
              <p>Бардык 5 көнүгүүнү ийгиликтүү аяктадың!</p>
              <div className="finish-buttons">
                <button className="btn-retry" onClick={resetQuiz}>Кайра аткаруу</button>
                <button className="btn-home" onClick={() => navigate("/")}>Башкы бет</button>
              </div>
            </div>
          )}

          {currentStep < 5 && (
            <div className="controls-row">
              <button 
                className="prev-btn" 
                onClick={() => {
                  setCurrentStep(prev => prev - 1);
                  setStepInitialized(false);
                }}
                disabled={currentStep === 0}
              >
                Артка
              </button>

              <button 
                className="next-btn" 
                onClick={handleNextStep}>
                Кийинки
              </button>
            </div>
          )}
          
          {/* Компонент персонажа */}
          <Character state={characterState} />
        </div>
      </div>
    </div>
  );
};

export default GreetingsExercise;