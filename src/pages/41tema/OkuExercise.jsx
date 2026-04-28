import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./OkuExercise.css"; 
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Character from "../../components/Character";

const OkuExercise = () => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [characterState, setCharacterState] = useState("idle");
  const [quizLocked, setQuizLocked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [activeWordId, setActiveWordId] = useState(null);
  const [inputs, setInputs] = useState({});

  const tasks = [
    {
      id: 1,
      type: "multi-choice",
      question: "Устолдо эмне бар?",
      translation: "Что есть на столе?",
      img: "desk_items.png",
      options: ["Клей", "Кайчы", "Боек", "Калем", "Кагаз", "Сызгыч"],
      correctItems: ["Клей", "Кайчы", "Боек", "Калем", "Кагаз"] 
    },
    {
      id: 2,
      type: "matching",
      question: "Дал келтир",
      translation: "Сопоставление",
      pairs: [
        { id: 1, text: "кайчы", img: "scissors.png" },
        { id: 2, text: "сызгыч", img: "ruler.png" },
        { id: 3, text: "боек", img: "paints.png" },
        { id: 4, text: "жон баштык", img: "backpack.png" },
        { id: 5, text: "бор", img: "chalks.png" },
        { id: 6, text: "китеп", img: "book.png" }
      ]
    },
    {
      id: 3,
      type: "fill-letters",
      question: "Сөздөрдү толуктагыла",
      translation: "Дополните слова",
      items: [
        { id: "w1", word: "дептер", missing: [2], correct: "п" },
        { id: "w2", word: "калемсап", missing: [7], correct: "п" },
        { id: "w3", word: "кызгылт", missing: [2], correct: "з" },
        { id: "w4", word: "очургуч", missing: [6], correct: "ч" }
      ]
    },
    {
      id: 4,
      type: "dropdown-sentence",
      question: "Сүйлөмдү толуктагыла",
      translation: "Дополните предложение",
      img: "backpak_ruler.png", 
      sentence: ["Бул", "___", "жана", "___"],
      options: ["жон баштык", "сызгыч", "калем"],
      correct: { select1: "жон баштык", select2: "сызгыч" }
    }
  ];

  const currentTask = tasks[currentStep];
  const totalSteps = tasks.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const triggerCharacter = (state) => {
    setCharacterState(state);
    setTimeout(() => setCharacterState("idle"), 1500);
  };

  const checkAndLockAnswer = (isCorrect) => {
    if (!quizLocked) {
      triggerCharacter(isCorrect ? "success" : "error");
      setQuizLocked(true);
    }
  };

  const isMultiChoiceComplete = () => {
    return selectedItems.length === currentTask.correctItems.length && 
           selectedItems.every(val => currentTask.correctItems.includes(val));
  };

  const isMatchingComplete = () => {
    return matchedPairs.length === currentTask.pairs.length;
  };

  const isFillLettersComplete = () => {
    return currentTask.items.every(item => inputs[item.id] === item.correct);
  };

  const isDropdownComplete = () => {
    return inputs.select1 === currentTask.correct.select1 && 
           inputs.select2 === currentTask.correct.select2;
  };

  const isCurrentTaskComplete = () => {
    if (currentTask.type === "multi-choice") return isMultiChoiceComplete();
    if (currentTask.type === "matching") return isMatchingComplete();
    if (currentTask.type === "fill-letters") return isFillLettersComplete();
    if (currentTask.type === "dropdown-sentence") return isDropdownComplete();
    return false;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
      resetStepStates();
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      resetStepStates();
    }
  };

  const resetStepStates = () => {
    setSelectedItems([]);
    setMatchedPairs([]);
    setInputs({});
    setActiveWordId(null);
    setQuizLocked(false);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setIsFinished(false);
    resetStepStates();
  };

  // Автоматическая проверка для multi-choice
  React.useEffect(() => {
    if (!quizLocked && currentTask?.type === "multi-choice" && selectedItems.length > 0) {
      const isComplete = isMultiChoiceComplete();
      if (selectedItems.length === currentTask.correctItems.length) {
        checkAndLockAnswer(isComplete);
      }
    }
  }, [selectedItems, currentTask, quizLocked]);

  // Автоматическая проверка для matching
  React.useEffect(() => {
    if (!quizLocked && currentTask?.type === "matching" && matchedPairs.length > 0) {
      if (matchedPairs.length === currentTask.pairs.length) {
        checkAndLockAnswer(true);
      }
    }
  }, [matchedPairs, currentTask, quizLocked]);

  // Автоматическая проверка для fill-letters
  React.useEffect(() => {
    if (!quizLocked && currentTask?.type === "fill-letters") {
      const allFilled = currentTask.items.every(item => inputs[item.id] !== undefined && inputs[item.id] !== "");
      if (allFilled) {
        const isComplete = isFillLettersComplete();
        checkAndLockAnswer(isComplete);
      }
    }
  }, [inputs, currentTask, quizLocked]);

  // Автоматическая проверка для dropdown-sentence
  React.useEffect(() => {
    if (!quizLocked && currentTask?.type === "dropdown-sentence") {
      if (inputs.select1 && inputs.select2) {
        const isComplete = isDropdownComplete();
        checkAndLockAnswer(isComplete);
      }
    }
  }, [inputs, currentTask, quizLocked]);

  const renderTaskBody = () => {
    switch (currentTask.type) {
      case "multi-choice":
        return (
          <div className="quiz-options-horizontal">
            {currentTask.options.map((opt, i) => (
              <button 
                key={i} 
                className={`quiz-option ${selectedItems.includes(opt) ? "selected" : ""}`} 
                onClick={() => {
                  if (!quizLocked) {
                    setSelectedItems(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
                  }
                }}
                disabled={quizLocked}
              >
                {opt}
              </button>
            ))}
          </div>
        );
case "matching":
        return (
          <div className="matching-container-horizontal">
            {/* Верхний ряд: Слова */}
            <div className="matching-row-words">
              {currentTask.pairs.map(pair => (
                <button
                  key={pair.id}
                  className={`match-item ${activeWordId === pair.id ? "active" : ""} ${matchedPairs.includes(pair.id) ? "matched" : ""}`}
                  onClick={() => !quizLocked && !matchedPairs.includes(pair.id) && setActiveWordId(pair.id)}
                  disabled={quizLocked || matchedPairs.includes(pair.id)}
                >
                  {pair.text} 🔊
                </button>
              ))}
            </div>

            {/* Нижний ряд: Картинки */}
            <div className="matching-row-images">
              {currentTask.pairs.map(pair => (
                <div 
                  key={pair.id} 
                  className={`match-image-item ${matchedPairs.includes(pair.id) ? "matched-img" : ""} ${activeWordId === pair.id ? "active-match" : ""}`}
                  onClick={() => {
                    if (!quizLocked && !matchedPairs.includes(pair.id) && activeWordId === pair.id) {
                      setMatchedPairs(prev => [...prev, pair.id]);
                      setActiveWordId(null);
                    } else if (!quizLocked && activeWordId !== null && activeWordId !== pair.id && !matchedPairs.includes(pair.id)) {
                      setActiveWordId(null);
                    }
                  }}
                >
                  <img src={`/src/assets/31tema/${pair.img}`} alt="item" />
                </div>
              ))}
            </div>
          </div>
        );
      case "fill-letters":
        return (
          <div className="fill-letters-container">
            {currentTask.items.map((item) => (
              <div key={item.id} className="word-row">
                {item.word.split('').map((char, charIdx) => (
                  <span key={charIdx} className={`char-box ${inputs[item.id] && inputs[item.id] === item.correct ? "correct" : inputs[item.id] ? "wrong" : ""}`}>
                    {item.missing.includes(charIdx) ? (
                      <input 
                        type="text" 
                        maxLength="1" 
                        value={inputs[item.id] || ""}
                        onChange={(e) => !quizLocked && setInputs(prev => ({...prev, [item.id]: e.target.value.toLowerCase()}))}
                        disabled={quizLocked}
                      />
                    ) : char}
                  </span>
                ))}
              </div>
            ))}
          </div>
        );
      case "dropdown-sentence":
        return (
          <div className="dropdown-container">
            <div className="sentence-row">
              <span className="sentence-word">{currentTask.sentence[0]}</span>
              <select 
                className={`sentence-select ${inputs.select1 === currentTask.correct.select1 ? "correct-select" : inputs.select1 ? "wrong-select" : ""}`}
                value={inputs.select1 || ""} 
                onChange={(e) => !quizLocked && setInputs(prev => ({...prev, select1: e.target.value}))}
                disabled={quizLocked}
              >
                <option value="">___</option>
                {currentTask.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <span className="sentence-word">{currentTask.sentence[2]}</span>
              <select 
                className={`sentence-select ${inputs.select2 === currentTask.correct.select2 ? "correct-select" : inputs.select2 ? "wrong-select" : ""}`}
                value={inputs.select2 || ""} 
                onChange={(e) => !quizLocked && setInputs(prev => ({...prev, select2: e.target.value}))}
                disabled={quizLocked}
              >
                <option value="">___</option>
                {currentTask.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (isFinished) {
    return (
      <div className="oku-ex-page">
        <Navbar />
        <div className="oku-ex-layout">
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>
          <div className="oku-ex-content">
            <div className="finish-screen">
              <div className="finish-icon">🏆</div>
              <h2>Азаматсың!</h2>
              <p>Бардык көнүгүүлөрдү ийгиликтүү аяктадың!</p>
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
    <div className="oku-ex-page">
      <Navbar />
      <div className="oku-ex-layout">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="oku-ex-content">
          <h2 className="ex1-title">Окуу куралдары / көнүгүү</h2>

          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="ex-header-banner">
            {currentTask.question}
          </div>

          <div className="exercise-scroll-container">
            <div className="step-content">
              {currentTask.img && (
                <div className="task-image-container">
                  <img src={`/src/assets/31tema/${currentTask.img}`} alt="task" className="task-img-large" />
                </div>
              )}
              <p className="question-translation">{currentTask.translation}</p>
              {renderTaskBody()}
            </div>
          </div>

          <div className="nav-controls">
            <button className="nav-btn back" onClick={handlePrev} disabled={currentStep === 0}>
              Артка
            </button>
            <button 
              className="nav-btn next" 
              onClick={handleNext}
              disabled={!quizLocked}
            >
              {currentStep === totalSteps - 1 ? "Аяктоо" : "Кийинки"}
            </button>
          </div>

          <Character state={characterState} />
        </div>
      </div>
    </div>
  );
};

export default OkuExercise;