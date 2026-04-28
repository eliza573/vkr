import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TanyshuuExercise.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Character from "../../components/Character";

import img1 from "../../assets/3tema/kids.png";
import girlImg from "../../assets/3tema/girl_wave.png";
import schoolImg from "../../assets/3tema/school.png";

function TanyshuuExercise() {
  const navigate = useNavigate();

  const [characterState, setCharacterState] = useState("idle");
  const [stepInitialized, setStepInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [selectedAnswer1, setSelectedAnswer1] = useState(null);
  const [quizLocked1, setQuizLocked1] = useState(false);

  const [placedLettersKyz, setPlacedLettersKyz] = useState(Array(3).fill(null));
  const correctKyz = ["К", "Ы", "З"];
  const scrambleKyz = ["К", "Ы", "З"];

  const [placedLettersMektep, setPlacedLettersMektep] = useState(Array(6).fill(null));
  const correctMektep = ["М", "Е", "К", "Т", "Е", "П"];
  const scrambleMektep = ["М", "Е", "К", "Т", "Е", "П"];

  const [selectedAnswer4, setSelectedAnswer4] = useState(null);
  const [quizLocked4, setQuizLocked4] = useState(false);

  const [selectedAnswer5, setSelectedAnswer5] = useState(null);
  const [quizLocked5, setQuizLocked5] = useState(false);

  const quizData1 = { 
    question: "___ атым Айгерим", 
    options: ["Менин", "Сенин", "Айгерим"], 
    correct: "Менин", 
    image: img1 
  };
  
  const quizData4 = { 
    question: "Сенин атың ___?", 
    options: ["кайда", "эмне", "ким"], 
    correct: "ким", 
    image: img1 
  };
  
  const quizData5 = { 
    question: "Менин фамилиям ___", 
    options: ["жакшы", "салам", "Абакарова"], 
    correct: "Абакарова", 
    image: img1 
  };

  const playCharacterTalk = () => {
    setCharacterState("talk");
    setTimeout(() => setCharacterState("idle"), 3000);
  };

  const checkAnswerWithCharacter = (isCorrect) => {
    setCharacterState(isCorrect ? "success" : "error");
    setTimeout(() => setCharacterState("idle"), 2000);
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      setStepInitialized(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setStepInitialized(false);
    }
  };

  const resetExercise = () => {
    setCurrentStep(0);
    setSelectedAnswer1(null);
    setSelectedAnswer4(null);
    setSelectedAnswer5(null);
    setQuizLocked1(false);
    setQuizLocked4(false);
    setQuizLocked5(false);
    setPlacedLettersKyz(Array(3).fill(null));
    setPlacedLettersMektep(Array(6).fill(null));
    setStepInitialized(false);
  };

  useEffect(() => {
    if (currentStep < 5) {
      const timer = setTimeout(() => {
        playCharacterTalk();
        setStepInitialized(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleDragStart = (e, content) => e.dataTransfer.setData("content", content);
  
  const handleDropToLetterSlot = (e, index, type) => {
    e.preventDefault();
    const content = e.dataTransfer.getData("content");
    if (type === "kyz") {
      const newLetters = [...placedLettersKyz];
      newLetters[index] = content;
      setPlacedLettersKyz(newLetters);
      if (content) {
        checkAnswerWithCharacter(content === correctKyz[index]);
      }
    } else {
      const newLetters = [...placedLettersMektep];
      newLetters[index] = content;
      setPlacedLettersMektep(newLetters);
      if (content) {
        checkAnswerWithCharacter(content === correctMektep[index]);
      }
    }
  };

  const getLetterClass = (char, correctArray, index) => {
    if (!char) return "drop-slot";
    return char === correctArray[index] ? "drop-slot correct" : "drop-slot wrong";
  };

  const getOptionClass = (option, selected, correct, locked) => {
    if (!selected || !locked) return "quiz-option";
    if (selected === option) {
      return option === correct ? "quiz-option correct-answer" : "quiz-option wrong-answer";
    }
    if (option === correct && locked) return "quiz-option correct-answer";
    return "quiz-option disabled";
  };

  return (
    <div className="tanyshuu-ex-page">
      <Navbar />
      <div className="tanyshuu-ex-layout">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="tanyshuu-ex-content">
          <h2 className="ex1-title">Таанышуу / көнүгүү</h2>
          
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${((currentStep + 1) / 6) * 100}%` }}></div>
          </div>

          <div className="ex-header-banner">
            {(currentStep === 0 || currentStep === 3 || currentStep === 4) && "Туура жоопту танда"}
            {currentStep === 1 && "Бул ким?"}
            {currentStep === 2 && "Бул эмне?"}
          </div>

          <div className="exercise-scroll-container">
            {currentStep === 0 && (
              <div className="step-content">
                <div className="task-image-container">
                  <img src={quizData1.image} className="task-img-large" alt="task" />
                </div>
                <div className="question-text">
                  <p className="question-kg">{quizData1.question}</p>
                </div>
                <div className="quiz-options-horizontal">
                  {quizData1.options.map((opt, i) => (
                    <button 
                      key={i} 
                      className={getOptionClass(opt, selectedAnswer1, quizData1.correct, quizLocked1)}
                      onClick={() => { 
                        setSelectedAnswer1(opt); 
                        setQuizLocked1(true); 
                        checkAnswerWithCharacter(opt === quizData1.correct); 
                      }}
                      disabled={quizLocked1}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="step-content">
                <div className="task-image-container">
                  <img src={girlImg} className="task-img-large" alt="task" />
                </div>
                <div className="slots-row">
                  {placedLettersKyz.map((char, i) => (
                    <div 
                      key={i} 
                      className={getLetterClass(char, correctKyz, i)} 
                      onDragOver={e => e.preventDefault()} 
                      onDrop={e => handleDropToLetterSlot(e, i, "kyz")}
                    >
                      {char}
                    </div>
                  ))}
                </div>
                <div className="letters-pool">
                  {scrambleKyz.map((l, i) => (
                    <div key={i} className="drag-item letter" draggable onDragStart={e => handleDragStart(e, l)}>{l}</div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <div className="task-image-container">
                  <img src={schoolImg} className="task-img-large mektep-img" alt="task" />
                </div>
                <div className="slots-row">
                  {placedLettersMektep.map((char, i) => (
                    <div 
                      key={i} 
                      className={getLetterClass(char, correctMektep, i)} 
                      onDragOver={e => e.preventDefault()} 
                      onDrop={e => handleDropToLetterSlot(e, i, "mektep")}
                    >
                      {char}
                    </div>
                  ))}
                </div>
                <div className="letters-pool">
                  {scrambleMektep.map((l, i) => (
                    <div key={i} className="drag-item letter" draggable onDragStart={e => handleDragStart(e, l)}>{l}</div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content">
                <div className="task-image-container">
                  <img src={quizData4.image} className="task-img-large" alt="task" />
                </div>
                <div className="question-text">
                  <p className="question-kg">{quizData4.question}</p>
                </div>
                <div className="quiz-options-horizontal">
                  {quizData4.options.map((opt, i) => (
                    <button 
                      key={i} 
                      className={getOptionClass(opt, selectedAnswer4, quizData4.correct, quizLocked4)}
                      onClick={() => { 
                        setSelectedAnswer4(opt); 
                        setQuizLocked4(true); 
                        checkAnswerWithCharacter(opt === quizData4.correct); 
                      }}
                      disabled={quizLocked4}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="step-content">
                <div className="task-image-container">
                  <img src={quizData5.image} className="task-img-large" alt="task" />
                </div>
                <div className="question-text">
                  <p className="question-kg">{quizData5.question}</p>
                </div>
                <div className="quiz-options-horizontal">
                  {quizData5.options.map((opt, i) => (
                    <button 
                      key={i} 
                      className={getOptionClass(opt, selectedAnswer5, quizData5.correct, quizLocked5)}
                      onClick={() => { 
                        setSelectedAnswer5(opt); 
                        setQuizLocked5(true); 
                        checkAnswerWithCharacter(opt === quizData5.correct); 
                      }}
                      disabled={quizLocked5}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="finish-screen">
                <div className="finish-icon">🏆</div>
                <h2>Азаматсың!</h2>
                <p>Бардык көнүгүүнү ийгиликтүү аяктадың!</p>
                <div className="finish-buttons">
                  <button className="btn-retry" onClick={resetExercise}>Кайра аткаруу</button>
                  <button className="btn-home" onClick={() => navigate("/")}>Башкы бет</button>
                </div>
              </div>
            )}
          </div>

          {currentStep < 5 && (
            <div className="nav-controls">
              <button className="nav-btn back" onClick={handlePrevStep} disabled={currentStep === 0}>Артка</button>
              <button className="nav-btn next" onClick={handleNextStep}>Кийинки</button>
            </div>
          )}

          <Character state={characterState} />
        </div>
      </div>
    </div>
  );
}

export default TanyshuuExercise;