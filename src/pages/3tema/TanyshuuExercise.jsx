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

  // Состояние для персонажа
  const [characterState, setCharacterState] = useState("idle");
  const [stepInitialized, setStepInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Состояния упражнений
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

  // Данные викторин
  const quizData1 = { question: "___ атым Айгерим", options: ["Менин", "Сенин", "Айгерим"], correct: "Менин", image: img1 };
  const quizData4 = { question: "Сенин атың ___?", options: ["кайда", "эмне", "ким"], correct: "ким", image: img1 };
  const quizData5 = { question: "Менин фамилиям ___", options: ["жакшы", "салам", "Абакарова"], correct: "Абакарова", image: img1 };

  // Управление персонажем
  const playCharacterTalk = () => {
    setCharacterState("talk");
    setTimeout(() => setCharacterState("idle"), 3000);
  };

  const checkAnswerWithCharacter = (isCorrect) => {
    setCharacterState(isCorrect ? "success" : "error");
    setTimeout(() => setCharacterState("idle"), 2000);
  };

  // Навигация
  const handleNextStep = () => {
    if (currentStep < 5) { // Теперь шаг 5 (финал) доступен
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
    setSelectedAnswer1(null); setSelectedAnswer4(null); setSelectedAnswer5(null);
    setQuizLocked1(false); setQuizLocked4(false); setQuizLocked5(false);
    setPlacedLettersKyz(Array(3).fill(null));
    setPlacedLettersMektep(Array(6).fill(null));
    setStepInitialized(false);
  };

  // Эффекты
  useEffect(() => {
    if (currentStep < 5) {
      const timer = setTimeout(() => {
        playCharacterTalk();
        setStepInitialized(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Drag & Drop логика
  const handleDragStart = (e, content) => e.dataTransfer.setData("content", content);
  
  const handleDropToLetterSlot = (e, index, type) => {
    e.preventDefault();
    const content = e.dataTransfer.getData("content");
    if (type === "kyz") {
      const newLetters = [...placedLettersKyz];
      newLetters[index] = content;
      setPlacedLettersKyz(newLetters);
      checkAnswerWithCharacter(content === correctKyz[index]);
    } else {
      const newLetters = [...placedLettersMektep];
      newLetters[index] = content;
      setPlacedLettersMektep(newLetters);
      checkAnswerWithCharacter(content === correctMektep[index]);
    }
  };

  const getLetterClass = (char, correctArray, index) => {
    if (!char) return "drop-slot";
    return char === correctArray[index] ? "drop-slot correct" : "drop-slot wrong";
  };

  const getOptionClass = (option, selected, correct, locked) => {
    if (!selected || !locked) return "quiz-option";
    if (selected === option) return option === correct ? "quiz-option correct-answer" : "quiz-option wrong-answer";
    if (option === correct && locked) return "quiz-option correct-answer";
    return "quiz-option disabled";
  };

  return (
    <div className="greetings-container">
      <Navbar />
      <div className="exercise-layout">
        <Sidebar />
        <div className="exercise-main-content">
          <h2 className="ex3-title">Таанышуу / көнүгүү</h2>
          
          <div className="progress-container">
            <div className="progress-bar-fill" style={{ width: `${Math.min(((currentStep + 1) / 5) * 100, 100)}%` }}></div>
          </div>

          {currentStep === 0 && (
            <div className="scramble-section">
              <div className="header-banner">Туура жоопту танда</div>
              <div className="quiz-question">
                <img src={quizData1.image} style={{width: '290px', marginBottom: '20px'}} alt=""/>
                <h3>{quizData1.question}</h3>
              </div>
              <div className="quiz-options">
                {quizData1.options.map((opt, i) => (
                  <button key={i} className={getOptionClass(opt, selectedAnswer1, quizData1.correct, quizLocked1)}
                    onClick={() => { setSelectedAnswer1(opt); setQuizLocked1(true); checkAnswerWithCharacter(opt === quizData1.correct); }}
                    disabled={quizLocked1}>{opt}</button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="scramble-section">
              <div className="header-banner">Бул ким?</div>
              <img src={girlImg} style={{width: '180px'}} alt=""/>
              <div className="slots-row">
                {placedLettersKyz.map((char, i) => (
                  <div key={i} className={getLetterClass(char, correctKyz, i)} onDragOver={e => e.preventDefault()} onDrop={e => handleDropToLetterSlot(e, i, "kyz")}>{char}</div>
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
            <div className="scramble-section">
              <div className="header-banner">Бул эмне?</div>
              <img src={schoolImg} style={{width: '390px'}} alt=""/>
              <div className="slots-row">
                {placedLettersMektep.map((char, i) => (
                  <div key={i} className={getLetterClass(char, correctMektep, i)} onDragOver={e => e.preventDefault()} onDrop={e => handleDropToLetterSlot(e, i, "mektep")}>{char}</div>
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
            <div className="scramble-section">
              <div className="header-banner">Туура жоопту танда</div>
              <div className="quiz-question">
                <img src={quizData4.image} style={{width: '250px'}} alt=""/>
                <h3>{quizData4.question}</h3>
              </div>
              <div className="quiz-options">
                {quizData4.options.map((opt, i) => (
                  <button key={i} className={getOptionClass(opt, selectedAnswer4, quizData4.correct, quizLocked4)}
                    onClick={() => { setSelectedAnswer4(opt); setQuizLocked4(true); checkAnswerWithCharacter(opt === quizData4.correct); }}
                    disabled={quizLocked4}>{opt}</button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="scramble-section">
              <div className="header-banner">Туура жоопту танда</div>
              <div className="quiz-question">
                <img src={quizData5.image} style={{width: '250px'}} alt=""/>
                <h3>{quizData5.question}</h3>
              </div>
              <div className="quiz-options">
                {quizData5.options.map((opt, i) => (
                  <button key={i} className={getOptionClass(opt, selectedAnswer5, quizData5.correct, quizLocked5)}
                    onClick={() => { setSelectedAnswer5(opt); setQuizLocked5(true); checkAnswerWithCharacter(opt === quizData5.correct); }}
                    disabled={quizLocked5}>{opt}</button>
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

          {currentStep < 5 && (
            <div className="controls-row">
              <button className="prev-btn" onClick={handlePrevStep} disabled={currentStep === 0}>Артка</button>
              <button className="next-btn" onClick={handleNextStep}>Кийинки</button>
            </div>
          )}

          <Character state={characterState} />
        </div>
      </div>
    </div>
  );
}

export default TanyshuuExercise;