import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./MektepExercise.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Character from "../../components/Character";

function MektepExercise() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // Состояния для персонажа и шага
  const [characterState, setCharacterState] = useState("idle");
  const [stepInitialized, setStepInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Состояния для упражнений
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputWord, setInputWord] = useState("");
  const [dropdownAnswers, setDropdownAnswers] = useState({});
  
  // Состояния блокировки для каждого упражнения
  const [quizLocked, setQuizLocked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Данные упражнений (7 шагов)
  const exercises = [
    {
      id: 1,
      type: "image-click",
      question: "Окуучу кызды тап?",
      translation: "Найдите ученицу",
      image: null,
      options: [
        { id: "boy", img: "teacher_agai.png", isCorrect: false },
        { id: "girl", img: "girl_aiday.png", isCorrect: true },
        { id: "teacher", img: "teacher_eje.png", isCorrect: false }
      ],
      correctId: "girl"
    },
    {
      id: 2,
      type: "dropdown-fill",
      question: "Тийиштүү сөздөрдү тандаңыз",
      translation: "Выберите подходящие слова",
      image: "people.png",
      sentences: [
        { text: "Булар эмнелер? Булар ___", correct: "жалбырактар" },
        { text: "Бул эмне? Бул ___", correct: "дарак" },
        { text: "Булар кимдер? Булар ___", correct: "окуучулар" },
        { text: "Бул ким? Бул ___", correct: "мугалим" }
      ],
      allOptions: ["жалбырактар", "мугалим", "дарак", "окуучулар"]
    },
 
    {
      id: 4,
      type: "spelling",
      question: "Бул ким?",
      translation: "Кто это?",
      image: "teacher_stand.png",
      letters: ["У", "М", "А", "Г", "И", "Л", "М"],
      correct: "МУГАЛИМ"
    },
    {
      id: 5,
      type: "choice",
      question: "Окуучулар _________ барышат.",
      translation: "Дети идут _______.",
      image: "students.png",
      options: ["Мектепке", "Китепке", "Базарга"],
      correct: 0
    },
    {
      id: 6,
      type: "choice",
      question: "Сүрөттө балдар эмне кылышат?",
      translation: "Что делают дети на картинке?",
      image: "students_reading.png",
      options: ["Окуучулар сабак жазышат", "Окуучулар китеп окушат", "Балдар сүрөт тартышат"],
      correct: 1
    },
    {
      id: 7,
      type: "choice",
      question: "Назик эмне кылат?",
      translation: "Что делает Назик?",
      image: "nazik.png",
      options: ["Назик сабак жазышат", "Назик китеп окуйт", "Назик мектепке барат"],
      correct: 2
    }
  ];

  const currentExercise = exercises[currentStep];

  // Текст для озвучки персонажа на каждом шаге
  const stepTalks = {
    0: "Окуучу кызды тап. Туура сүрөттү тандагыла.",
    1: "Тийиштүү сөздөрдү танда. Бош орундарды толтургула.",
    2: "Бул эмне? Мектеп деген сөздү туура түзгүлө.",
    3: "Бул ким? Мугалим деген сөздү туура түзгүлө.",
    4: "Окуучулар мектепке барат. Туура жоопту тандагыла.",
    5: "Сүрөттө балдар китеп окушат. Туура жоопту тандагыла.",
    6: "Назик мектепке барат. Туура жоопту тандагыла."
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

  // Функция проверки текущего упражнения (автоматическая)
  const checkAndLockAnswer = (correct) => {
    if (!quizLocked) {
      setIsCorrect(correct);
      setQuizLocked(true);
      checkAnswerWithCharacter(correct);
    }
  };

  // Кнопка "Кийинки" - всегда переходит вперед
  const handleNextStep = () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep(prev => prev + 1);
      // Сброс состояний при переходе
      setSelectedOption(null);
      setInputWord("");
      setDropdownAnswers({});
      setQuizLocked(false);
      setIsCorrect(null);
      setStepInitialized(false);
    } else {
      setCurrentStep(exercises.length);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setSelectedOption(null);
      setInputWord("");
      setDropdownAnswers({});
      setQuizLocked(false);
      setIsCorrect(null);
      setStepInitialized(false);
    }
  };

  // При смене шага - персонаж объясняет задание
  useEffect(() => {
    if (currentStep < exercises.length) {
      const timer = setTimeout(() => {
        playCharacterTalk(currentStep);
        setStepInitialized(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Автоматическая проверка для image-click
  useEffect(() => {
    if (currentStep < exercises.length && stepInitialized && currentExercise.type === "image-click" && selectedOption && !quizLocked) {
      const correct = selectedOption === currentExercise.correctId;
      checkAndLockAnswer(correct);
    }
  }, [selectedOption, currentStep, stepInitialized]);

  // Автоматическая проверка для choice
  useEffect(() => {
    if (currentStep < exercises.length && stepInitialized && currentExercise.type === "choice" && selectedOption !== null && !quizLocked) {
      const correct = selectedOption === currentExercise.correct;
      checkAndLockAnswer(correct);
    }
  }, [selectedOption, currentStep, stepInitialized]);

  // Автоматическая проверка для dropdown-fill
  useEffect(() => {
    if (currentStep < exercises.length && stepInitialized && currentExercise.type === "dropdown-fill" && !quizLocked) {
      const allFilled = Object.keys(dropdownAnswers).length === currentExercise.sentences.length;
      if (allFilled) {
        const correct = currentExercise.sentences.every((s, idx) => dropdownAnswers[idx] === s.correct);
        checkAndLockAnswer(correct);
      }
    }
  }, [dropdownAnswers, currentStep, stepInitialized]);

  // Автоматическая проверка для spelling
  useEffect(() => {
    if (currentStep < exercises.length && stepInitialized && currentExercise.type === "spelling" && !quizLocked) {
      if (inputWord.length === currentExercise.letters.length) {
        const correct = inputWord.toUpperCase() === currentExercise.correct;
        checkAndLockAnswer(correct);
      }
    }
  }, [inputWord, currentStep, stepInitialized]);

  // Получение класса для кнопки варианта ответа (choice)
  const getOptionClass = (optionIndex) => {
    if (!quizLocked) {
      return selectedOption === optionIndex ? "quiz-option selected" : "quiz-option";
    }
    if (optionIndex === currentExercise.correct) {
      return "quiz-option correct-answer";
    }
    if (selectedOption === optionIndex && optionIndex !== currentExercise.correct) {
      return "quiz-option wrong-answer";
    }
    return "quiz-option disabled";
  };

  // Получение класса для картинки (image-click)
  const getImageCardClass = (item) => {
    if (!quizLocked) {
      return selectedOption === item.id ? "image-card selected" : "image-card";
    }
    if (item.isCorrect) {
      return "image-card correct-border";
    }
    if (selectedOption === item.id && !item.isCorrect) {
      return "image-card wrong-border";
    }
    return "image-card";
  };

  // Получение класса для выпадающего списка
  const getDropdownClass = (idx, correct) => {
    if (!quizLocked) return "";
    return dropdownAnswers[idx] === correct ? "correct-sel" : "wrong-sel";
  };

  // Добавление буквы для spelling
  const addLetter = (letter) => {
    if (!quizLocked && inputWord.length < currentExercise.letters.length) {
      setInputWord(prev => prev + letter);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setInputWord("");
    setDropdownAnswers({});
    setQuizLocked(false);
    setIsCorrect(null);
    setStepInitialized(false);
  };

  // Финальный экран
  if (currentStep === exercises.length) {
    return (
      <div className="greetings-container">
        <Navbar />
        <div className="exercise-layout">
          <Sidebar />
          <div className="exercise-main-content">
            <div className="finish-screen">
              <div className="finish-icon">🏆</div>
              <h2>Азаматсың!</h2>
              <p>Сен бардык  тапшырманы аткардың!</p>
              <div className="finish-buttons">
                <button className="btn-retry" onClick={resetQuiz}>Кайра аткаруу</button>
                <button className="btn-home" onClick={() => navigate("/")}>Башкы бет</button>
              </div>
            </div>
            <Character state={characterState} />
          </div>
        </div>
      </div>
    );
  }

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
              style={{ width: `${((currentStep + 1) / exercises.length) * 100}%` }}
            ></div>
          </div>

          {/* Заголовок */}
          <h2 className="exercise-header">Мен мектепке барам / көнүгүү</h2>

          {/* Упражнение: Image Click */}
          {currentExercise.type === "image-click" && (
            <div className="quiz-section">
              <div className="quiz-content">
                <div className="quiz-question">
                  <h3>{currentExercise.question}</h3>
                  {currentExercise.translation && <p className="question-translation">{currentExercise.translation}</p>}
                </div>
                <div className="image-options-grid">
                  {currentExercise.options.map((item) => (
                    <div 
                      key={item.id}
                      className={getImageCardClass(item)}
                      onClick={() => !quizLocked && setSelectedOption(item.id)}
                    >
                      <img src={`/src/assets/4tema/${item.img}`} alt="choice" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Упражнение: Dropdown Fill */}
          {currentExercise.type === "dropdown-fill" && (
            <div className="quiz-section">
              <div className="quiz-content">
                <div className="quiz-question">
                  <img src={`/src/assets/4tema/${currentExercise.image}`} style={{width: '200px', marginBottom: '20px'}} alt=""/>
                  <h3>{currentExercise.question}</h3>
                  {currentExercise.translation && <p className="question-translation">{currentExercise.translation}</p>}
                </div>
                <div className="dropdown-sentences">
                  {currentExercise.sentences.map((sentence, idx) => (
                    <div key={idx} className="sentence-row">
                      <span>{sentence.text.split("___")[0]}</span>
                      <select 
                        onChange={(e) => !quizLocked && setDropdownAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                        disabled={quizLocked}
                        className={getDropdownClass(idx, sentence.correct)}
                        value={dropdownAnswers[idx] || ""}
                      >
                        <option value="">...</option>
                        {currentExercise.allOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <span>{sentence.text.split("___")[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Упражнение: Spelling (составление слова) */}
          {currentExercise.type === "spelling" && (
            <div className="quiz-section">
              <div className="quiz-content">
                <div className="quiz-question">
                  <img src={`/src/assets/4tema/${currentExercise.image}`} style={{width: '90px', marginBottom: '20px'}} alt=""/>
                  <h3>{currentExercise.question}</h3>
                  {currentExercise.translation && <p className="question-translation">{currentExercise.translation}</p>}
                </div>
                <div className={`word-display ${quizLocked ? (isCorrect ? "correct-text" : "wrong-text") : ""}`}>
                  {inputWord || "______"}
                </div>
                <div className="letter-chips">
                  {currentExercise.letters.map((L, i) => (
                    <button 
                      key={i} 
                      className="chip" 
                      onClick={() => addLetter(L)}
                      disabled={quizLocked}
                    >
                      {L}
                    </button>
                  ))}
                </div>
                {!quizLocked && inputWord.length > 0 && (
                  <button className="clear-btn" onClick={() => setInputWord("")}>Тазалоо</button>
                )}
              </div>
            </div>
          )}

          {/* Упражнение: Choice (выбор ответа) */}
          {currentExercise.type === "choice" && (
            <div className="quiz-section">
              <div className="quiz-content">
                <div className="quiz-question">
                  <img src={`/src/assets/4tema/${currentExercise.image}`} style={{width: '150px', marginBottom: '20px'}} alt=""/>
                  <h3>{currentExercise.question}</h3>
                  {currentExercise.translation && <p className="question-translation">{currentExercise.translation}</p>}
                </div>
                <div className="quiz-options">
                  {currentExercise.options.map((option, idx) => (
                    <button
                      key={idx}
                      className={getOptionClass(idx)}
                      onClick={() => !quizLocked && setSelectedOption(idx)}
                      disabled={quizLocked}
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

            {quizLocked && (
              <button 
                className="next-btn" 
                onClick={handleNextStep}>
                {currentStep === exercises.length - 1 ? "Аягы" : "Кийинки"}
              </button>
            )}
          </div>

          {/* Компонент персонажа */}
          <Character state={characterState} />
        </div>
      </div>
    </div>
  );
}

export default MektepExercise;