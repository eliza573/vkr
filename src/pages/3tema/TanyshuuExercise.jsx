import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./TanyshuuExercise.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Character from "../../components/Character";
import { useEffect } from "react";

import img1 from "../../assets/3tema/teacher.png";
import girlImg from "../../assets/3tema/girl.png";
import schoolImg from "../../assets/3tema/school.png";

function TanyshuuExercise() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Состояние для персонажа
  const [characterState, setCharacterState] = useState("idle");
  const [stepInitialized, setStepInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Данные для упражнения 1: выбор ответа "Менин атым Айгерим"
  const [selectedAnswer1, setSelectedAnswer1] = useState(null);
  const [quizLocked1, setQuizLocked1] = useState(false);

  // Данные для упражнения 2: перетаскивание букв "Кыз"
  const [placedLettersKyz, setPlacedLettersKyz] = useState(Array(3).fill(null));
  const correctKyz = ["К", "Ы", "З"];
  const scrambleKyz = ["К", "Ы", "З"];

  // Данные для упражнения 3: перетаскивание букв "Мектеп"
  const [placedLettersMektep, setPlacedLettersMektep] = useState(Array(6).fill(null));
  const correctMektep = ["М", "Е", "К", "Т", "Е", "П"];
  const scrambleMektep = ["М", "Е", "К", "Т", "Е", "П"];

  // Данные для упражнения 4: выбор ответа "Сенин атың ким?"
  const [selectedAnswer4, setSelectedAnswer4] = useState(null);
  const [quizLocked4, setQuizLocked4] = useState(false);

  // Данные для упражнения 5: выбор ответа "Менин фамилиям Абакарова"
  const [selectedAnswer5, setSelectedAnswer5] = useState(null);
  const [quizLocked5, setQuizLocked5] = useState(false);

  // Данные для викторин
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

  // Текст для озвучки персонажа на каждом шаге (5 шагов)
  const stepTalks = {
    0: "Бош орунга туура сөздү койгула.",
    1: "Бул ким? Кыз деген сөздү туура түзгүлө.",
    2: "Бул эмне? Мектеп деген сөздү туура түзгүлө.",
    3: "Сенин атың ким? Туура жоопту тандагыла.",
    4: "Менин фамилиям Абакарова. Туура жоопту тандагыла."
  };

  // Функция для воспроизведения речи персонажа
  const playCharacterTalk = (step) => {
    setCharacterState("talk");
    setTimeout(() => {
      setCharacterState("idle");
    }, 3000);
  };

  // Функция для проверки ответов с анимацией персонажа
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

  // Проверка Scramble упражнения (шаг 1)
  const isScrambleKyzComplete = () => {
    return placedLettersKyz.every((letter, idx) => letter === correctKyz[idx]);
  };

  // Проверка Scramble упражнения (шаг 2)
  const isScrambleMektepComplete = () => {
    return placedLettersMektep.every((letter, idx) => letter === correctMektep[idx]);
  };

  // Проверка Quiz 1 (шаг 0)
  const isQuiz1Complete = () => {
    return selectedAnswer1 === quizData1.correct;
  };

  // Проверка Quiz 4 (шаг 3)
  const isQuiz4Complete = () => {
    return selectedAnswer4 === quizData4.correct;
  };

  // Проверка Quiz 5 (шаг 4)
  const isQuiz5Complete = () => {
    return selectedAnswer5 === quizData5.correct;
  };

  // Кнопка "Кийинки" всегда переходит вперед
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      setStepInitialized(false);
    } else {
      navigate("/tanyshuu");
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setStepInitialized(false);
    }
  };

  // При смене шага - персонаж объясняет задание
  useEffect(() => {
    if (currentStep < 5) {
      const timer = setTimeout(() => {
        playCharacterTalk(currentStep);
        setStepInitialized(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Автоматическая проверка для Quiz 1 (шаг 0)
  useEffect(() => {
    if (currentStep === 0 && stepInitialized && selectedAnswer1 !== null) {
      const isCorrect = selectedAnswer1 === quizData1.correct;
      checkAnswerWithCharacter(isCorrect);
    }
  }, [selectedAnswer1, currentStep, stepInitialized]);

  // Автоматическая проверка для Scramble Kyz (шаг 1)
  useEffect(() => {
    if (currentStep === 1 && stepInitialized) {
      const isComplete = isScrambleKyzComplete();
      const hasAnyLetter = placedLettersKyz.some(l => l !== null);
      if (isComplete && hasAnyLetter) {
        checkAnswerWithCharacter(true);
      } else if (hasAnyLetter && !isComplete) {
        checkAnswerWithCharacter(false);
      }
    }
  }, [placedLettersKyz, currentStep, stepInitialized]);

  // Автоматическая проверка для Scramble Mektep (шаг 2)
  useEffect(() => {
    if (currentStep === 2 && stepInitialized) {
      const isComplete = isScrambleMektepComplete();
      const hasAnyLetter = placedLettersMektep.some(l => l !== null);
      if (isComplete && hasAnyLetter) {
        checkAnswerWithCharacter(true);
      } else if (hasAnyLetter && !isComplete) {
        checkAnswerWithCharacter(false);
      }
    }
  }, [placedLettersMektep, currentStep, stepInitialized]);

  // Автоматическая проверка для Quiz 4 (шаг 3)
  useEffect(() => {
    if (currentStep === 3 && stepInitialized && selectedAnswer4 !== null) {
      const isCorrect = selectedAnswer4 === quizData4.correct;
      checkAnswerWithCharacter(isCorrect);
    }
  }, [selectedAnswer4, currentStep, stepInitialized]);

  // Автоматическая проверка для Quiz 5 (шаг 4)
  useEffect(() => {
    if (currentStep === 4 && stepInitialized && selectedAnswer5 !== null) {
      const isCorrect = selectedAnswer5 === quizData5.correct;
      checkAnswerWithCharacter(isCorrect);
    }
  }, [selectedAnswer5, currentStep, stepInitialized]);

  // Обработчики для выбора ответа в викторинах
  const handleQuiz1Answer = (answer) => {
    if (quizLocked1) return;
    setSelectedAnswer1(answer);
    setQuizLocked1(true);
  };

  const handleQuiz4Answer = (answer) => {
    if (quizLocked4) return;
    setSelectedAnswer4(answer);
    setQuizLocked4(true);
  };

  const handleQuiz5Answer = (answer) => {
    if (quizLocked5) return;
    setSelectedAnswer5(answer);
    setQuizLocked5(true);
  };

  // Drag & Drop функции для scramble упражнений
  const handleDragStart = (e, content) => {
    e.dataTransfer.setData("content", content);
  };

  const handleDropToLetterSlot = (e, index, type) => {
    e.preventDefault();
    const content = e.dataTransfer.getData("content");
    
    if (type === "kyz") {
      const newLetters = [...placedLettersKyz];
      newLetters[index] = content;
      setPlacedLettersKyz(newLetters);
    } else if (type === "mektep") {
      const newLetters = [...placedLettersMektep];
      newLetters[index] = content;
      setPlacedLettersMektep(newLetters);
    }
  };

  const getLetterClass = (char, correctArray, index) => {
    if (!char) return "drop-slot";
    return char === correctArray[index] ? "drop-slot correct" : "drop-slot wrong";
  };

  // Получение класса для кнопки варианта ответа
  const getOptionClass = (option, selected, correct, locked) => {
    if (!selected || !locked) return "quiz-option";
    if (selected === option) {
      return option === correct ? "quiz-option correct-answer" : "quiz-option wrong-answer";
    }
    if (option === correct && locked) {
      return "quiz-option correct-answer";
    }
    return "quiz-option disabled";
  };

  // Сброс всех состояний (опционально)
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

  return (
    <div className="greetings-container">
      <Navbar />
      <div className="exercise-layout">
        <Sidebar />
        <div className="exercise-main-content">
          {/* Прогресс-бар */}
          <div className="progress-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
            ></div>
          </div>

          {/* Упражнение 0: Quiz - Менин атым Айгерим */}
          {currentStep === 0 && (
            <div className="quiz-section">
              <div className="header-banner">Туура жоопту танда</div>
              <div className="quiz-content">
                <div className="quiz-question">
                  <img src={quizData1.image} style={{width: '290px', marginBottom: '20px'}} alt=""/>
                  <h3>{quizData1.question}</h3>
                </div>
                <div className="quiz-options">
                  {quizData1.options.map((option, idx) => (
                    <button
                      key={idx}
                      className={getOptionClass(option, selectedAnswer1, quizData1.correct, quizLocked1)}
                      onClick={() => handleQuiz1Answer(option)}
                      disabled={quizLocked1}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Упражнение 1: Scramble - Кыз */}
          {currentStep === 1 && (
            <div className="scramble-section">
              <div className="header-banner">Бул ким?</div>
              <div className="scramble-question">
                <img src={girlImg} style={{width: '250px', marginBottom: '0px'}} alt="Кыз"/>
                <h3 className="scramble-subtitle">Кыз</h3>
              </div>
              <div className="slots-row">
                {placedLettersKyz.map((char, i) => (
                  <div key={i} 
                       className={getLetterClass(char, correctKyz, i)} 
                       onDragOver={(e) => e.preventDefault()} 
                       onDrop={(e) => handleDropToLetterSlot(e, i, "kyz")}>
                    {char}
                  </div>
                ))}
              </div>
              <div className="letters-pool">
                {scrambleKyz.map((l, i) => (
                  <div key={i} className="drag-item letter" draggable onDragStart={(e) => handleDragStart(e, l)}>{l}</div>
                ))}
              </div>
            </div>
          )}

          {/* Упражнение 2: Scramble - Мектеп */}
          {currentStep === 2 && (
            <div className="scramble-section">
              <div className="header-banner">Бул эмне?</div>
              <div className="scramble-question">
                <img src={schoolImg} style={{width: '390px', marginBottom: '0px'}} alt="Мектеп"/>
                <h3 className="scramble-subtitle">Мектеп</h3>
              </div>
              <div className="slots-row">
                {placedLettersMektep.map((char, i) => (
                  <div key={i} 
                       className={getLetterClass(char, correctMektep, i)} 
                       onDragOver={(e) => e.preventDefault()} 
                       onDrop={(e) => handleDropToLetterSlot(e, i, "mektep")}>
                    {char}
                  </div>
                ))}
              </div>
              <div className="letters-pool">
                {scrambleMektep.map((l, i) => (
                  <div key={i} className="drag-item letter" draggable onDragStart={(e) => handleDragStart(e, l)}>{l}</div>
                ))}
              </div>
            </div>
          )}

          {/* Упражнение 3: Quiz - Сенин атың ким? */}
          {currentStep === 3 && (
            <div className="quiz-section">
              <div className="header-banner">Туура жоопту танда</div>
              <div className="quiz-content">
                <div className="quiz-question">
                  <img src={quizData4.image} style={{width: '250px'}} alt=""/>
                  <h3>{quizData4.question}</h3>
                </div>
                <div className="quiz-options">
                  {quizData4.options.map((option, idx) => (
                    <button
                      key={idx}
                      className={getOptionClass(option, selectedAnswer4, quizData4.correct, quizLocked4)}
                      onClick={() => handleQuiz4Answer(option)}
                      disabled={quizLocked4}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Упражнение 4: Quiz - Менин фамилиям Абакарова */}
          {currentStep === 4 && (
            <div className="quiz-section">
              <div className="header-banner">Туура жоопту танда</div>
              <div className="quiz-content">
                <div className="quiz-question">
                  <img src={quizData5.image} style={{width: '250px', marginBottom: '0px'}} alt=""/>
                  <h3>{quizData5.question}</h3>
                </div>
                <div className="quiz-options">
                  {quizData5.options.map((option, idx) => (
                    <button
                      key={idx}
                      className={getOptionClass(option, selectedAnswer5, quizData5.correct, quizLocked5)}
                      onClick={() => handleQuiz5Answer(option)}
                      disabled={quizLocked5}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Кнопки навигации */}
          <div className="controls-row">
            <button 
              className="prev-btn" 
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              Артка
            </button>

            <button 
              className="next-btn" 
              onClick={handleNextStep}>
              {currentStep === 4 ? "Аягы" : "Кийинки"}
            </button>
          </div>

          {/* Компонент персонажа */}
          <Character state={characterState} />
        </div>
      </div>
    </div>
  );
}

export default TanyshuuExercise;