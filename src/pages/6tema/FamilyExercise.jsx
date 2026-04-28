import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./FamilyExercise.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Character from "../../components/Character";

const FamilyExercise = () => {
  const navigate = useNavigate();
  const [characterState, setCharacterState] = useState("idle");
  const [step, setStep] = useState(1);

  // Состояния для упражнений
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [quizLocked, setQuizLocked] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const [spellingWords, setSpellingWords] = useState({
    word1: ["Ч", "О", "", "А", "Т", "А"],
    word2: ["Т", "А", "", "Т", "А"],
    word3: ["Т", "А", "", "Н", "Е"],
    word4: ["К", "А", "", "Ы", "Н", "Д", "А", "Ш"],
    word5: ["", "Ж", "Е"]
  });

  const correctSpellingState = {
    word1: ["Ч", "О", "Ң", "А", "Т", "А"],
    word2: ["Т", "А", "Я", "Т", "А"],
    word3: ["Т", "А", "Е", "Н", "Е"],
    word4: ["К", "А", "Р", "Ы", "Н", "Д", "А", "Ш"],
    word5: ["Э", "Ж", "Е"]
  };

  const quizData = [
    {
      id: 1,
      type: "choice",
      question: "Бул ким?",
      translation: "Кто это?",
      img: "father.png",
      options: ["Ата", "Апа", "Сызгыч"],
      correct: "Ата"
    },
    {
      id: 2,
      type: "choice",
      question: "Бул ким?",
      translation: "Кто это?",
      img: "grandma.png",
      options: ["Ата", "Апа", "Чоң апа"],
      correct: "Чоң апа"
    },
    {
      id: 3,
      type: "spelling-grid",
      question: "Сөздөрдү толуктагыла",
      translation: "Дополните слова",
      letters: ["Ң", "Я", "Е", "Р", "Э"],
      correctState: correctSpellingState
    },
    {
      id: 4,
      type: "choice",
      question: "Булар кимдер?",
      translation: "Кто они?",
      img: "siblings.png",
      options: ["аталар", "бир туугандар", "Чоң апа"],
      correct: "бир туугандар"
    },
    {
      id: 5,
      type: "choice",
      question: "Кимдерди коруп турасын?",
      translation: "Кого ты видишь?",
      img: "dinner.png",
      options: ["Атасы, апасы", "Апасы, кызы", "эжеси, иниси"],
      correct: "Апасы, кызы"
    },
    {
      id: 6,
      type: "inline-select",
      question: "Биздин уй-булоодо ___ адам бар.",
      translation: "В нашей семье ___ человек.",
      img: "big_family.png",
      options: ["4", "9", "7"],
      correct: "9"
    },
    {
      id: 7,
      type: "matching-translation",
      question: "Котормосун туура тап",
      translation: "Найди правильный перевод",
      pairs: [
        { left: "менин апам", right: "моя мама" },
        { left: "менин эжем", right: "моя сестра" },
        { left: "менин таятам", right: "мой дедушка" }
      ]
    },
    {
      id: 8,
      type: "inline-select",
      question: "Бул менин ___ .",
      translation: "Это мой ___.",
      img: "brother_big.png",
      options: ["эжем", "байке", "байкем"],
      correct: "байкем"
    },
    {
      id: 9,
      type: "inline-select",
      question: "Сенин апаңдын апасы — ___",
      translation: "Мама твоей мамы — кто?",
      img: "all_family.png",
      options: ["таята", "таене", "чоң апа"],
      correct: "таене"
    },
    {
      id: 10,
      type: "inline-select",
      question: "Сенин атаңдын апасы — ___",
      translation: "Мама твоей папы — кто?",
      img: "all_family.png",
      options: ["таята", "таене", "чоң апа"],
      correct: "чоң апа"
    }
  ];

  const currentTask = quizData[step - 1];
  const totalSteps = quizData.length;

  const triggerCharacter = (state) => {
    setCharacterState(state);
    setTimeout(() => setCharacterState("idle"), 1500);
  };

  // Автоматическая проверка для choice
  useEffect(() => {
    if (!quizLocked && selectedOption && (currentTask?.type === "choice")) {
      const isCorrect = selectedOption === currentTask.correct;
      triggerCharacter(isCorrect ? "success" : "error");
      setQuizLocked(true);
    }
  }, [selectedOption, currentTask, quizLocked]);

  // Автоматическая проверка для inline-select
  useEffect(() => {
    if (!quizLocked && selectedOption && (currentTask?.type === "inline-select")) {
      const isCorrect = selectedOption === currentTask.correct;
      triggerCharacter(isCorrect ? "success" : "error");
      setQuizLocked(true);
    }
  }, [selectedOption, currentTask, quizLocked]);

  // Автоматическая проверка для spelling-grid
  useEffect(() => {
    if (!quizLocked && currentTask?.type === "spelling-grid") {
      const allFilled = Object.values(spellingWords).every(word => word.every(char => char !== ""));
      if (allFilled) {
        const isCorrect = JSON.stringify(spellingWords) === JSON.stringify(currentTask.correctState);
        triggerCharacter(isCorrect ? "success" : "error");
        setQuizLocked(true);
      }
    }
  }, [spellingWords, currentTask, quizLocked]);

  // Автоматическая проверка для matching-translation
  useEffect(() => {
    if (!quizLocked && currentTask?.type === "matching-translation") {
      if (matchedPairs.length === currentTask.pairs.length) {
        triggerCharacter(true);
        setQuizLocked(true);
      }
    }
  }, [matchedPairs, currentTask, quizLocked]);

  // Логика для matching (клик по парам)
  useEffect(() => {
    if (selectedLeft && selectedRight && !quizLocked && currentTask?.type === "matching-translation") {
      const isMatch = currentTask.pairs.some(p => p.left === selectedLeft && p.right === selectedRight);
      if (isMatch) {
        setMatchedPairs(prev => [...prev, selectedLeft]);
        triggerCharacter("success");
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        triggerCharacter("error");
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    }
  }, [selectedLeft, selectedRight, currentTask, quizLocked]);

  const handleLetterClick = (letter) => {
    if (quizLocked) return;
    setSpellingWords(prev => {
      const newWords = { ...prev };
      for (let key in newWords) {
        const emptyIndex = newWords[key].indexOf("");
        if (emptyIndex !== -1) {
          const updatedWordArray = [...newWords[key]];
          updatedWordArray[emptyIndex] = letter;
          newWords[key] = updatedWordArray;
          break;
        }
      }
      return newWords;
    });
  };

  const handleSelectChange = (val) => {
    if (quizLocked) return;
    setSelectedOption(val);
  };

  const handleDragStart = (e, text) => e.dataTransfer.setData("text", text);

  const handleDrop6 = (e, id) => {
    e.preventDefault();
    if (quizLocked) return;
    const droppedText = e.dataTransfer.getData("text");
    const item = currentTask.pairs?.find(d => d.id === id);
    const isCorrect = droppedText === item?.correct;
    if (isCorrect) {
      setMatchedPairs(prev => [...prev, id]);
      triggerCharacter("success");
    } else {
      triggerCharacter("error");
    }
  };

  const isComplete = () => {
    if (currentTask?.type === "choice") return selectedOption !== null;
    if (currentTask?.type === "inline-select") return selectedOption !== null;
    if (currentTask?.type === "spelling-grid") {
      return Object.values(spellingWords).every(word => word.every(char => char !== ""));
    }
    if (currentTask?.type === "matching-translation") {
      return matchedPairs.length === currentTask.pairs.length;
    }
    return false;
  };

  const getOptionClass = (option) => {
    if (!quizLocked) return selectedOption === option ? "quiz-option selected" : "quiz-option";
    if (option === currentTask?.correct) return "quiz-option correct-answer";
    if (selectedOption === option && option !== currentTask?.correct) return "quiz-option wrong-answer";
    return "quiz-option disabled";
  };

  const getSelectClass = () => {
    if (!quizLocked) return "select-trigger";
    if (selectedOption === currentTask?.correct) return "select-trigger correct-select";
    if (selectedOption && selectedOption !== currentTask?.correct) return "select-trigger wrong-select";
    return "select-trigger";
  };

  const getSpellingCellClass = (wordKey, index, char) => {
    if (!quizLocked) return char === "" ? "spelling-cell empty" : "spelling-cell filled";
    const isCorrectChar = char === currentTask?.correctState[wordKey][index];
    if (char === "") return "spelling-cell empty";
    return isCorrectChar ? "spelling-cell correct-cell" : "spelling-cell wrong-cell";
  };

  const resetStep = () => {
    setSelectedOption(null);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setQuizLocked(false);
    setIsSelectOpen(false);
    setSpellingWords({
      word1: ["Ч", "О", "", "А", "Т", "А"],
      word2: ["Т", "А", "", "Т", "А"],
      word3: ["Т", "А", "", "Н", "Е"],
      word4: ["К", "А", "", "Ы", "Н", "Д", "А", "Ш"],
      word5: ["", "Ж", "Е"]
    });
  };

  if (step === totalSteps + 1) {
    return (
      <div className="family-ex-page">
        <Navbar />
        <div className="family-ex-layout">
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>
          <main className="family-ex-content">
            <div className="finish-screen">
              <div className="finish-icon">🏆</div>
              <h2>Азаматсың!</h2>
              <p>Бардык көнүгүүлөрдү ийгиликтүү аяктадың!</p>
              <div className="finish-buttons">
                <button className="btn-retry" onClick={() => { setStep(1); resetStep(); }}>Кайра аткаруу</button>
                <button className="btn-home" onClick={() => navigate("/")}>Башкы бет</button>
              </div>
            </div>
            <Character state={characterState} />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="family-ex-page">
      <Navbar />
      <div className="family-ex-layout">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <main className="family-ex-content">
          <h2 className="ex1-title">Үй-бүлө / көнүгүү</h2>

          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>

          <div className="ex-header-banner">
            {currentTask?.type === "choice" && "Туура жоопту танда"}
            {currentTask?.type === "spelling-grid" && "Сөздөрдү толуктагыла"}
            {currentTask?.type === "inline-select" && "Сүйлөмдү толукта"}
            {currentTask?.type === "matching-translation" && "Котормосун туура тап"}
          </div>

          <div className="exercise-scroll-container">
            <div className="step-content">
              {/* Изображение */}
              {currentTask?.img && (
                <div className="task-image-container">
                  <img src={`/src/assets/6tema/${currentTask.img}`} className="task-img-large" alt="task" />
                </div>
              )}

              {/* Текст вопроса */}
              <div className="question-text">
                <p className="question-kg">{currentTask?.question}</p>
                <p className="question-ru">{currentTask?.translation}</p>
              </div>

              {/* CHOICE тип */}
              {currentTask?.type === "choice" && (
                <div className="quiz-options-horizontal">
                  {currentTask.options.map((opt, idx) => (
                    <button 
                      key={idx}
                      className={getOptionClass(opt)}
                      onClick={() => !quizLocked && setSelectedOption(opt)}
                      disabled={quizLocked}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* SPELLING GRID тип */}
              {currentTask?.type === "spelling-grid" && (
                <div className="spelling-container">
                  {Object.keys(spellingWords).map((wordKey, idx) => (
                    <div key={idx} className="spelling-row">
                      {spellingWords[wordKey].map((char, charIdx) => (
                        <div key={charIdx} className={getSpellingCellClass(wordKey, charIdx, char)}>
                          {char}
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="letters-pool">
                    {currentTask.letters.map((l, i) => (
                      <button key={i} className="letter-btn" onClick={() => handleLetterClick(l)} disabled={quizLocked}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* INLINE-SELECT тип */}
              {currentTask?.type === "inline-select" && (
                <div className="inline-select-container">
                  <div className="sentence-bubble">
                    <p className="sentence-text">
                      {currentTask.question.split("___")[0]}
                      <span className="custom-select-wrapper">
                        <button 
                          className={getSelectClass()}
                          onClick={() => !quizLocked && setIsSelectOpen(!isSelectOpen)}
                          disabled={quizLocked}
                        >
                          {selectedOption || "тандаңыз"}
                        </button>
                        {!quizLocked && isSelectOpen && (
                          <div className="select-options-list">
                            {currentTask.options.map(opt => (
                              <div 
                                key={opt} 
                                className="select-item"
                                onClick={() => {
                                  handleSelectChange(opt);
                                  setIsSelectOpen(false);
                                }}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </span>
                      {currentTask.question.split("___")[1]}
                    </p>
                  </div>
                </div>
              )}

              {/* MATCHING TRANSLATION тип */}
              {currentTask?.type === "matching-translation" && (
                <div className="matching-container">
                  <div className="matching-column">
                    {currentTask.pairs.map((p, i) => (
                      <button 
                        key={i} 
                        className={`match-item kg ${selectedLeft === p.left ? 'active' : ''} ${matchedPairs.includes(p.left) ? 'matched' : ''}`}
                        onClick={() => !quizLocked && !matchedPairs.includes(p.left) && setSelectedLeft(p.left)}
                        disabled={quizLocked}
                      >
                        {p.left}
                      </button>
                    ))}
                  </div>
                  <div className="matching-column">
                    {[...currentTask.pairs].reverse().map((p, i) => (
                      <button 
                        key={i} 
                        className={`match-item ru ${selectedRight === p.right ? 'active' : ''} ${matchedPairs.includes(currentTask.pairs.find(pair => pair.right === p.right)?.left) ? 'matched' : ''}`}
                        onClick={() => !quizLocked && setSelectedRight(p.right)}
                        disabled={quizLocked}
                      >
                        {p.right}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="nav-controls">
            <button 
              className="nav-btn back" 
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1);
                  resetStep();
                }
              }} 
              disabled={step === 1}
            >
              Артка
            </button>
            <button 
              className="nav-btn next" 
              onClick={() => {
                if (step < totalSteps) {
                  setStep(step + 1);
                  resetStep();
                } else {
                  setStep(totalSteps + 1);
                }
              }}
              disabled={!quizLocked && !isComplete()}
            >
              {step === totalSteps ? "Аяктоо" : "Кийинки"}
            </button>
          </div>

          <Character state={characterState} />
        </main>
      </div>
    </div>
  );
};

export default FamilyExercise;