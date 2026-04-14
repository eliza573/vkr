import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./KlassExercise.css"; 
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function KlassExercise() {
  const navigate = useNavigate();

  // --- СОСТОЯНИЯ ---
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]); 
  const [inputWord, setInputWord] = useState("");
  const [dropdownAnswers, setDropdownAnswers] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const [activeWordId, setActiveWordId] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const pronouns = ["Мен", "Сен", "Сиз", "Ал", "Биз", "Силер", "Сиздер", "Алар"];

  const quizData = [
    {
      id: 1,
      type: "spelling",
      question: "Бул эмне?",
      img: "board_desk.png",
      letters: ["К", "Т", "Т", "А", "А"],
      correct: "ТАКТА"
    },
    {
      id: 2,
      type: "spelling",
      question: "Бул ким?",
      img: "student_boy.png",
      letters: ["О", "К", "Ч", "У", "У", "У"],
      correct: "ОКУУЧУ"
    },
    {
      id: 3,
      type: "multi-choice",
      question: "Устолдо эмне бар?",
      translation: "Что есть на столе?",
      img: "desk_items.png",
      options: ["Клей", "Кайчы", "Боек", "Калем", "Кагаз", "Сызгыч"],
      correctItems: ["Клей", "Кайчы", "Боек", "Калем", "Кагаз"] 
    },
    {
      id: 4,
      type: "dropdown-fill",
      question: "Сүйлөмдү толуктагыла",
      translation: "Дополняем предложения",
      img: "classroom.png",
      sentences: [
        { text: "Бул ___ класс", correct: "биздин" },
        { text: "Класста ___, ___ бар.", correct: ["саат", "желек"] }, 
        { text: "Класс ___ жана ___", correct: ["жарык", "таза"] }
      ],
      allOptions: ["биздин", "саат", "желек", "жарык", "таза"]
    },
    {
      id: 5,
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
    }, // <-- Здесь добавлена запятая
    { id: 6, type: "dropdown", question: "Тиешелүү ат атоочту тандаңыз:", verb: "..... окуйм", correct: "Мен", trans: "..... читаю", img: "reading_book.png" },
    { id: 7, type: "dropdown", question: "Тиешелүү ат атоочту тандаңыз:", verb: "..... окуйсуң", correct: "Сен", trans: "..... читаешь", img: "student_boy.png" },
    { id: 8, type: "dropdown", question: "Тиешелүү ат атоочту тандаңыз:", verb: "..... эсептешет", correct: "Алар", trans: "..... считают", img: "counting.png" },
    {  
      id: 9, 
      type: "image-choice", 
      question: "Сүрөттө балдар эмне кылып жатышат?", 
      trans: "Что делают дети на картинке?",
      img: "students_in_class.png", 
      options: ["Алар сабак жазып жатышат", "Ал китеп окуйт", "Силер сүрөт тартышат"],
      correct: "0" // Сохраняем как строку для удобства сравнения
    },
    {  
      id: 10, 
      type: "image-choice", 
      question: "Оля эмне кылат?", 
      trans: "Что делает Оля?",
      img: "olya_enter.png", 
      options: ["Ал класска кирет", "Алар класска кирет", "Силер класска киресиңер"],
      correct: "0" 
    }
  ];

  const currentTask = quizData[currentStep];

  const handleDropdownChange = (idx, value) => {
    setDropdownAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const toggleItem = (item) => {
    if (isChecked) return;
    setSelectedItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleMatch = (type, id) => {
    if (isChecked) return;
    if (type === 'word') setActiveWordId(id);
    else if (type === 'image' && activeWordId !== null) {
      if (activeWordId === id) setMatchedPairs(prev => [...prev, id]);
      setActiveWordId(null);
    }
  };

  const handleCheck = () => {
    let correct = false;
    
    if (currentTask.type === "spelling") {
      correct = inputWord.toUpperCase() === currentTask.correct;
    } 
    else if (currentTask.type === "multi-choice") {
      correct = selectedItems.length >= 3; 
    } 
   else if (currentTask.type === "dropdown-fill") {
  // Считаем общее количество "___" во всех предложениях
  const totalGaps = currentTask.sentences.reduce((acc, s) => acc + (s.text.split("___").length - 1), 0);
  correct = Object.keys(dropdownAnswers).length === totalGaps;
}
    else if (currentTask.type === "matching") {
      correct = matchedPairs.length === currentTask.pairs.length;
    }
    else if (currentTask.type === "dropdown" || currentTask.type === "image-choice") {
      correct = inputWord === currentTask.correct;
    }

    setIsCorrect(correct);
    setIsChecked(true);
  };
  

  const handleNext = () => {
    if (currentStep < quizData.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedItems([]);
      setInputWord("");
      setDropdownAnswers({});
      setMatchedPairs([]);
      setActiveWordId(null);
      setIsChecked(false);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setIsFinished(false);
    setIsChecked(false);
    setInputWord("");
    setDropdownAnswers({});
    setMatchedPairs([]);
  };

  

  return (
    <div className="main-container">
      <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="exercise-content">
          <h2 className="exercise-header">Бул менин классым / көнүгүү</h2>

          {!isFinished ? (
            <div className="quiz-wrapper">
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${((currentStep + 1) / quizData.length) * 100}%` }}></div>
              </div>

              <div className={`quiz-card ${isChecked && isCorrect ? "success-light" : ""}`}>
                
                {/* 1. Блок изображения */}
                {currentTask.type !== "matching" && (
                  <div className="quiz-image-box">
                    <img src={`/src/assets/5tema/${currentTask.img}`} alt="task" />
                  </div>
                )}

                {/* 2. Блок вопроса */}
                <div className="question-text">
                  <h3>{currentTask.question}</h3>
                  {(currentTask.translation || currentTask.trans) && (
                    <p className="question-translation">{currentTask.translation || currentTask.trans}</p>
                  )}
                </div>

                {/* 3. Отрисовка контента в зависимости от типа */}
                <div className="task-body">
                  {currentTask.type === "spelling" && (
                    <div className="spelling-area">
                      <div className={`word-display ${isChecked ? (isCorrect ? "correct-text" : "wrong-text") : ""}`}>
                        {inputWord || "______"}
                      </div>
                      <div className="letter-chips">
                        {currentTask.letters.map((L, i) => (
                          <button key={i} className="chip" onClick={() => !isChecked && setInputWord(prev => prev + L)} disabled={isChecked}>
                            {L}
                          </button>
                        ))}
                      </div>
                      {!isChecked && <button className="clear-btn" onClick={() => setInputWord("")}>Тазалоо</button>}
                    </div>
                  )}

                  {currentTask.type === "multi-choice" && (
                    <div className="options-grid">
                      {currentTask.options.map((option, index) => (
                        <button
                          key={index}
                          className={`option-btn ${selectedItems.includes(option) ? "selected" : ""} ${isChecked ? "disabled-opt" : ""}`}
                          onClick={() => toggleItem(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                {currentTask.type === "dropdown-fill" && (
  <div className="dropdown-container-klass">
    {currentTask.sentences.map((sentence, idx) => {
      // Разделяем строку на части по маркеру "___"
      const parts = sentence.text.split("___");
      
      return (
        <div key={idx} className="sentence-item">
          {parts.map((part, pIdx) => (
            <React.Fragment key={pIdx}>
              <span>{part}</span>
              {/* Если это не последняя текстовая часть, вставляем select */}
              {pIdx < parts.length - 1 && (
                <select 
                  onChange={(e) => handleDropdownChange(`${idx}-${pIdx}`, e.target.value)}
                  disabled={isChecked}
                  className={isChecked ? "checked-select" : ""}
                >
                  <option value="">...</option>
                  {currentTask.allOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </React.Fragment>
          ))}
        </div>
      );
    })}
  </div>
)}

                 {currentTask.type === "matching" && (
  <div className="matching-task-container">
    {/* Сетка кнопок со словами */}
    <div className="words-grid-layout">
      {currentTask.pairs.map(pair => (
        <button
          key={pair.id}
          className={`match-chip ${activeWordId === pair.id ? "active" : ""} ${matchedPairs.includes(pair.id) ? "matched" : ""}`}
          onClick={() => handleMatch('word', pair.id)}
          disabled={matchedPairs.includes(pair.id) || isChecked}
        >
          {pair.text} 📎
        </button>
      ))}
    </div>

    {/* Горизонтальный ряд картинок */}
    <div className="images-horizontal-row">
      {currentTask.pairs.map(pair => (
        <div 
          key={pair.id} 
          className={`match-image-item ${matchedPairs.includes(pair.id) ? "matched-img" : ""}`}
          onClick={() => handleMatch('image', pair.id)}
        >
          <img src={`/src/assets/5tema/${pair.img}`} alt="item" />
        </div>
      ))}
    </div>
  </div>
)}

                  {currentTask.type === "dropdown" && (
                    <div className="sentence-row-center">
                      <select 
                        className="pronoun-select" 
                        onChange={(e) => setInputWord(e.target.value)}
                        disabled={isChecked}
                        value={inputWord}
                      >
                        <option value="">???</option>
                        {pronouns.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <span className="verb-text">{currentTask.verb}</span>
                    </div>
                  )}

                  {currentTask.type === "image-choice" && (
                    <div className="options-vertical">
                      {currentTask.options.map((opt, idx) => (
                        <button 
                          key={idx} 
                          className={`option-btn-choice ${inputWord === idx.toString() ? "selected" : ""} ${isChecked ? "disabled-opt" : ""}`}
                          onClick={() => !isChecked && setInputWord(idx.toString())}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Обратная связь и кнопка */}
                {isChecked && (
                  <p className={`feedback-msg ${isCorrect ? "success" : "error"}`}>
                    {isCorrect ? "Азаматсың! ✅" : "Ката! Кайра аракет кылып көр"}
                  </p>
                )}

                <button 
                  className="action-btn-main"
                  onClick={isChecked ? handleNext : handleCheck}
                  disabled={
                    !isChecked && 
                    inputWord === "" && 
                    selectedItems.length === 0 && 
                    Object.keys(dropdownAnswers).length === 0 &&
                    matchedPairs.length === 0
                  }
                >
                  {isChecked ? (currentStep === quizData.length - 1 ? "Аягы" : "Кийинки") : "Текшерүү"}
                </button>
              </div>
            </div>
          ) : (
            <div className="finish-screen">
              <div className="finish-icon">🏆</div>
              <h2>Азаматсың!</h2>
              <p>Класс темасын ийгиликтүү аяктадың!</p>
              <div className="finish-buttons">
                <button className="btn-retry" onClick={resetQuiz}>Кайра аткаруу</button>
                <button className="btn-home" onClick={() => navigate("/")}>Башкы бет</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KlassExercise;