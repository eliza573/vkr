import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./OkuExercise.css"; 
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Character from "../../components/Character";

const OkuExercise = () => {
  const navigate = useNavigate();
  
  // Состояния
  const [currentStep, setCurrentStep] = useState(0);
  const [characterState, setCharacterState] = useState("idle");
  const [isFinished, setIsFinished] = useState(false);

  // Состояния ответов
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
        { id: 5, text: "бор", img: "chalk.png" },
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
  const progress = ((currentStep + 1) / tasks.length) * 100;

  const triggerCharacter = (state) => {
    setCharacterState(state);
    setTimeout(() => setCharacterState("idle"), 1500);
  };

  // --- Логика переключения ---

  const handleNext = () => {
    // 1. Проверяем текущее задание только для анимации персонажа
    let isCorrect = false;
    if (currentTask.type === "multi-choice") {
      isCorrect = selectedItems.length === currentTask.correctItems.length && 
                  selectedItems.every(val => currentTask.correctItems.includes(val));
    } else if (currentTask.type === "matching") {
      isCorrect = matchedPairs.length === currentTask.pairs.length;
    } else if (currentTask.type === "fill-letters") {
      isCorrect = currentTask.items.every(item => inputs[item.id] === item.correct);
    } else if (currentTask.type === "dropdown-sentence") {
      isCorrect = inputs.select1 === currentTask.correct.select1 && 
                  inputs.select2 === currentTask.correct.select2;
    }

    // 2. Показываем результат
    triggerCharacter(isCorrect ? "success" : "error");

    // 3. ПЕРЕХОДИМ В ЛЮБОМ СЛУЧАЕ (через небольшую задержку для анимации)
    setTimeout(() => {
      if (currentStep < tasks.length - 1) {
        setCurrentStep(s => s + 1);
        setSelectedItems([]);
        setMatchedPairs([]);
        setInputs({});
      } else {
        setIsFinished(true);
      }
    }, 800);
  };

  // --- Рендеринг типов заданий ---
  const renderTaskBody = () => {
    switch (currentTask.type) {
      case "multi-choice":
        return (
          <div className="options-grid">
            {currentTask.options.map((opt, i) => (
              <button 
                key={i} 
                className={`option-btn ${selectedItems.includes(opt) ? "selected" : ""}`} 
                onClick={() => setSelectedItems(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])}
              >
                {opt}
              </button>
            ))}
          </div>
        );
      case "matching":
        return (
          <div className="matching-task-container">
            <div className="words-grid-layout">
              {currentTask.pairs.map(pair => (
                <button
                  key={pair.id}
                  className={`match-chip ${activeWordId === pair.id ? "active" : ""} ${matchedPairs.includes(pair.id) ? "matched" : ""}`}
                  onClick={() => setActiveWordId(pair.id)}
                >
                  {pair.text} 🔊
                </button>
              ))}
            </div>
            <div className="images-horizontal-row">
              {currentTask.pairs.map(pair => (
                <div 
                  key={pair.id} 
                  className={`match-image-item ${matchedPairs.includes(pair.id) ? "matched-img" : ""}`}
                  onClick={() => {
                    if (activeWordId === pair.id) {
                      setMatchedPairs(prev => [...prev, pair.id]);
                      triggerCharacter("success");
                    } else if (activeWordId !== null) {
                      triggerCharacter("error");
                    }
                    setActiveWordId(null);
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
                  <span key={charIdx} className="char-box">
                    {item.missing.includes(charIdx) ? (
                      <input 
                        type="text" 
                        maxLength="1" 
                        value={inputs[item.id] || ""}
                        onChange={(e) => setInputs(prev => ({...prev, [item.id]: e.target.value.toLowerCase()}))}
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
          <div className="sentence-builder">
            <div className="sentence-row">
              <span>{currentTask.sentence[0]}</span>
              <select value={inputs.select1 || ""} onChange={(e) => setInputs(prev => ({...prev, select1: e.target.value}))}>
                <option value="">...</option>
                {currentTask.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <span>{currentTask.sentence[2]}</span>
              <select value={inputs.select2 || ""} onChange={(e) => setInputs(prev => ({...prev, select2: e.target.value}))}>
                <option value="">...</option>
                {currentTask.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="exercise-page">
      <Navbar />
      <div className="exercise-layout">
        <Sidebar />
        <main className="exercise-content">
        <h2 className="ex1-title">Окуу куралдары/ көнүгүү</h2>

          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>

          {!isFinished ? (
            <div className="task-card">
              {currentTask.img && (
                <div className="task-image-container">
                  <img src={`/src/assets/31tema/${currentTask.img}`} alt="task" className="main-task-img" />
                </div>
              )}

              <h2 className="task-title">{currentTask.question}</h2>
              <p className="task-translation">{currentTask.translation}</p>

              <div className="task-body">
                {renderTaskBody()}
              </div>

              <div className="controls-footer">
                <button 
                  className="nav-btn prev-btn" 
                  onClick={() => setCurrentStep(s => s - 1)} 
                  disabled={currentStep === 0}
                >
                  Артка
                </button>
                <button className="nav-btn next-btn" onClick={handleNext}>
                  {currentStep === tasks.length - 1 ? "Аяктоо" : "Кийинки"}
                </button>
              </div>
            </div>
          ) : (
            <div className="finish-screen">
              <div className="finish-icon">🏆</div>
              <h2>Азаматсың!</h2>
              <p>Бардык көнүгүүлөрдү ийгиликтүү аяктадың!</p>
              <div className="finish-buttons">
                <button className="btn-retry" onClick={() => {setIsFinished(false); setCurrentStep(0);}}>Кайра аткаруу</button>
                <button className="btn-home" onClick={() => navigate("/")}>Башкы бет</button>
              </div>
            </div>
          )}

          <Character state={characterState} />
        </main>
      </div>
    </div>
  );
};

export default OkuExercise;