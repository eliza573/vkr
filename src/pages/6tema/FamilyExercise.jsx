import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./FamilyExercise.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function FamilyExercise() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Состояния для сопоставления (Matching)
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const [spellingWords, setSpellingWords] = useState({
    word1: ["Ч", "О", "", "А", "Т", "А"],
    word2: ["Т", "А", "", "Т", "А"],
    word3: ["Т", "А", "", "Н", "Е"],
    word4: ["К", "А", "", "Ы", "Н", "Д", "А", "Ш"],
    word5: ["", "Ж", "Е"]
  });

  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

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
      correctState: {
        word1: ["Ч", "О", "Ң", "А", "Т", "А"],
        word2: ["Т", "А", "Я", "Т", "А"],
        word3: ["Т", "А", "Е", "Н", "Е"],
        word4: ["К", "А", "Р", "Ы", "Н", "Д", "А", "Ш"],
        word5: ["Э", "Ж", "Е"]
      }
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
      id: 8,
      type: "choice",
      question: "Кимдерди коруп турасын?",
      translation: "Кого ты видишь?",
      img: "dinner.png",
      options: ["Атасы, апасы", "Апасы, кызы", "эжеси, иниси"],
      correct: "Апасы, кызы"
    },
    {
      id: 9,
      type: "inline-select",
      question: "Биздин уй-булоодо ___ адам бар.",
      translation: "В нашей семье ___ человек.",
      img: "big_family.png",
      options: ["4", "9", "7"],
      correct: "9"
    },
    {
      id: 10,
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
      id: 11,
      type: "inline-select",
      question: "Бул менин ___ .",
      translation: "Это мой ___.",
      img: "brother_big.png",
      options: ["эжем", "байке", "байкем"],
      correct: "байкем"
    },
    {
      id: 12,
      type: "inline-select",
      question: "Сенин апаңдын апасы — ___",
      translation: "Мама твоей мамы — кто?",
      img: "all_family.png",
      options: ["таята", "таене", "чоң апа"],
      correct: "таене"
    },
    {
      id: 13,
      type: "inline-select",
      question: "Сенин атаңдын апасы — ___",
      translation: "Мама твоей папы — кто?",
      img: "all_family.png",
      options: ["таята", "таене", "чоң апа"],
      correct: "чоң апа"
    }
  ];

  const currentTask = quizData[currentStep];

  // Логика сопоставления при клике
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const isMatch = currentTask.pairs?.some(
        p => p.left === selectedLeft && p.right === selectedRight
      );

      if (isMatch) {
        setMatchedPairs(prev => [...prev, selectedLeft]);
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // Если ошибка, сбрасываем выделение через короткую паузу
        const timer = setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedLeft, selectedRight, currentTask]);

  const handleCheck = () => {
    let correct = false;
    if (currentTask.type === "choice" || currentTask.type === "inline-select") {
      correct = selectedOption === currentTask.correct;
    } else if (currentTask.type === "spelling-grid") {
      correct = JSON.stringify(spellingWords) === JSON.stringify(currentTask.correctState);
    } else if (currentTask.type === "matching-translation") {
      // Проверяем, все ли пары найдены
      correct = matchedPairs.length === currentTask.pairs.length;
    }
    setIsCorrect(correct);
    setIsChecked(true);
  };

  const handleNext = () => {
    if (currentStep < quizData.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(null);
      setIsSelectOpen(false);
      setMatchedPairs([]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setSpellingWords({
        word1: ["Ч", "О", "", "А", "Т", "А"],
        word2: ["Т", "А", "", "Т", "А"],
        word3: ["Т", "А", "", "Н", "Е"],
        word4: ["К", "А", "", "Ы", "Н", "Д", "А", "Ш"],
        word5: ["", "Ж", "Е"]
      });
    } else {
      setIsFinished(true);
    }
  };

  const handleLetterClick = (letter) => {
    if (isChecked) return;
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

  return (
    <div className="family-ex-container">
      <Navbar />
      <div className="family-ex-layout">
        <Sidebar />
        <div className="family-ex-content">
          <h2 className="ex-title">Менин үй-бүлөм / көнүгүү</h2>

          {!isFinished ? (
            <div className="ex-card">
              <div className="ex-progress">
                <div className="ex-progress-fill" style={{ width: `${((currentStep + 1) / quizData.length) * 100}%` }}></div>
              </div>

              <div className="ex-main-body">
                {currentTask.img && (
                  <div className="ex-image-holder">
                    <img src={`/src/assets/6tema/${currentTask.img}`} alt="task" />
                  </div>
                )}

                <div className="ex-question-bubble">
                  <h3>{currentTask.type === "inline-select" ? "Сүйлөмдү толукта" : currentTask.question} 🔊</h3>
                  <p>{currentTask.translation}</p>
                </div>

                {/* Обычный выбор */}
                {currentTask.type === "choice" && (
                  <div className="ex-options-row">
                    {currentTask.options.map(opt => (
                      <button 
                        key={opt}
                        className={`ex-opt-btn ${selectedOption === opt ? "selected" : ""}`}
                        onClick={() => !isChecked && setSelectedOption(opt)}
                        disabled={isChecked}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Сетка из букв */}
                {currentTask.type === "spelling-grid" && (
                  <div className="ex-spelling-grid">
                    {Object.keys(spellingWords).map((key, i) => (
                      <div key={i} className="spelling-row">
                        {spellingWords[key].map((char, j) => (
                          <div key={j} className={`spelling-cell ${char === "" ? "empty" : "filled"}`}>
                            {char}
                          </div>
                        ))}
                      </div>
                    ))}
                    <div className="available-letters">
                      {currentTask.letters.map((l, i) => (
                        <button key={i} className="letter-chip" onClick={() => handleLetterClick(l)} disabled={isChecked}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inline Select */}
                {currentTask.type === "inline-select" && (
                  <div className="inline-select-container">
                    <div className="sentence-bubble">
                      <p className="sentence-text">
                        {currentTask.question.split("___")[0]}
                        <span className="custom-select-wrapper">
                          <button 
                            className={`select-trigger ${selectedOption ? 'active' : ''}`}
                            onClick={() => !isChecked && setIsSelectOpen(!isSelectOpen)}
                          >
                            {selectedOption || "тандаңыз"}
                          </button>
                          {!isChecked && isSelectOpen && (
                            <div className="select-options-list">
                              {currentTask.options.map(opt => (
                                <div 
                                  key={opt} 
                                  className="select-item"
                                  onClick={() => {
                                    setSelectedOption(opt);
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

                {/* ИСПРАВЛЕННОЕ ЗАДАНИЕ ID 10: Сопоставление */}
                {currentTask.type === "matching-translation" && (
                  <div className="translation-grid">
                    <div className="column">
                      {currentTask.pairs.map((p, i) => (
                        <button 
                          key={i} 
                          className={`pill-btn kg ${selectedLeft === p.left ? 'active' : ''} ${matchedPairs.includes(p.left) ? 'matched' : ''}`}
                          onClick={() => !isChecked && !matchedPairs.includes(p.left) && setSelectedLeft(p.left)}
                        >
                          {p.left}
                        </button>
                      ))}
                    </div>
                    <div className="column">
                      {/* Сортировка или перемешивание для сложности */}
                      {[...currentTask.pairs].reverse().map((p, i) => (
                        <button 
                          key={i} 
                          className={`pill-btn ru ${selectedRight === p.right ? 'active' : ''} ${matchedPairs.some(mp => currentTask.pairs.find(pair => pair.left === mp)?.right === p.right) ? 'matched' : ''}`}
                          onClick={() => !isChecked && setSelectedRight(p.right)}
                        >
                          {p.right}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="ex-footer">
                {isChecked && (
                  <div className={`feedback ${isCorrect ? "pos" : "neg"}`}>
                    {isCorrect ? "Азаматсың! ✅" : "Ката! Кайра аракет кыл ❌"}
                  </div>
                )}
                <button 
                  className="ex-check-btn"
                  onClick={isChecked ? handleNext : handleCheck}
                  disabled={
                    (!selectedOption && (currentTask.type === "choice" || currentTask.type === "inline-select")) ||
                    (currentTask.type === "matching-translation" && matchedPairs.length < currentTask.pairs.length && !isChecked)
                  }
                >
                  {isChecked ? "Кийинки" : "Текшерүү"}
                </button>
              </div>
            </div>
         ) : (
            <div className="finish-screen">
              <div className="finish-icon">🏆</div>
              <h2>Азаматсың!</h2>
              <p>Үй-бүлө темасын ийгиликтүү аяктадың!</p>
              
              <div className="finish-buttons">
                <button 
                  className="btn-retry" 
                  onClick={() => {
                    // Сброс всех состояний для повторного прохождения
                    setCurrentStep(0);
                    setIsFinished(false);
                    setIsChecked(false);
                    setMatchedPairs([]);
                    setSelectedOption(null);
                  }}
                >
                  Кайра аткаруу
                </button>
                
                <button 
                  className="btn-home" 
                  onClick={() => navigate("/")}
                >
                  Башкы бет
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FamilyExercise;