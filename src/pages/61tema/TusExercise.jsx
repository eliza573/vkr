import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./TusExercise.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Character from "../../components/Character";

const TusExercise = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [characterState, setCharacterState] = useState("idle");
  const [stepInitialized, setStepInitialized] = useState(false);
  
  // Упражнение 1: Кайсыл тамга жок
  const [missingLetterAnswers, setMissingLetterAnswers] = useState({
    1: null,
    2: null
  });
  const [missingLocked, setMissingLocked] = useState(false);
  
  // Упражнение 2: Түстөрдү окшоштуруп тапкыла
  const [colorMatches, setColorMatches] = useState({});
  const [activeColor, setActiveColor] = useState(null);
  const [matchLocked, setMatchLocked] = useState(false);
  
  // Упражнение 3: Такта кандай түстө?
  const [boardAnswer, setBoardAnswer] = useState(null);
  const [boardLocked, setBoardLocked] = useState(false);
  
  // Упражнение 4: Кыздын чачы кандай түстө?
  const [hairAnswer, setHairAnswer] = useState(null);
  const [hairLocked, setHairLocked] = useState(false);
  
  // Упражнение 5: Калем кандай түстө?
  const [penAnswer, setPenAnswer] = useState(null);
  const [penLocked, setPenLocked] = useState(false);

  const missingLetterData = {
    1: { word: "Кызыл", display: "Кыз_л", correct: "ы", options: ["ы", "и", "у"] },
    2: { word: "Жашыл", display: "Ж_зыл", correct: "а", options: ["а", "о", "е"] }
  };

  const colorMatchingData = {
    left: [
      { id: "l1", color: "red", name: "Кызыл", rgb: "#FF4136" },
      { id: "l2", color: "green", name: "Жашыл", rgb: "#2ECC40" },
      { id: "l3", color: "blue", name: "Көк", rgb: "#0074D9" }
    ],
    right: [
      { id: "r1", color: "green", name: "Жашыл", rgb: "#2ECC40" },
      { id: "r2", color: "red", name: "Кызыл", rgb: "#FF4136" },
      { id: "r3", color: "blue", name: "Көк", rgb: "#0074D9" }
    ],
    correct: { "l1": "r2", "l2": "r1", "l3": "r3" }
  };

  const boardQuiz = {
    question: "Такта кандай түстө?",
    questionRu: "Какого цвета доска?",
    image: "board.png",
    options: [
      { value: "red", label: "кызыл", color: "#FF4136" },
      { value: "green", label: "жашыл", color: "#2ECC40" },
      { value: "black", label: "кара", color: "#111111" }
    ],
    correct: "black"
  };

  const hairQuiz = {
    question: "Кыздын чачы кандай түстө?",
    questionRu: "Какого цвета волосы у девочки?",
    image: "girl_black_hair.png",
    options: [
      { value: "red", label: "кызыл", color: "#FF4136" },
      { value: "green", label: "жашыл", color: "#2ECC40" },
      { value: "black", label: "кара", color: "#111111" }
    ],
    correct: "black"
  };

  const penQuiz = {
    question: "Калем кандай түстө?",
    questionRu: "Какого цвета ручка?",
    image: "white_pen.png",
    options: [
      { value: "red", label: "кызыл", color: "#FF4136" },
      { value: "white", label: "ак", color: "#FFFFFF", border: true },
      { value: "black", label: "кара", color: "#111111" }
    ],
    correct: "white"
  };

  const playCharacterTalk = (step) => {
    setCharacterState("talk");
    setTimeout(() => {
      setCharacterState("idle");
    }, 3000);
  };

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

  const isMissingComplete = () => {
    return missingLetterAnswers[1] === missingLetterData[1].correct &&
           missingLetterAnswers[2] === missingLetterData[2].correct;
  };

  const isMatchingComplete = () => {
    return Object.keys(colorMatchingData.correct).length === Object.keys(colorMatches).length &&
           Object.entries(colorMatches).every(([leftId, rightId]) => 
             colorMatchingData.correct[leftId] === rightId
           );
  };

  const handleMissingAnswer = (index, answer) => {
    if (missingLocked) return;
    const newAnswers = { ...missingLetterAnswers, [index]: answer };
    setMissingLetterAnswers(newAnswers);
    
    const isCorrect = answer === missingLetterData[index].correct;
    if (newAnswers[1] && newAnswers[2]) {
      const allCorrect = newAnswers[1] === missingLetterData[1].correct && 
                        newAnswers[2] === missingLetterData[2].correct;
      if (allCorrect) {
        setMissingLocked(true);
        checkAnswerWithCharacter(true);
      } else if (!allCorrect && isCorrect) {
        checkAnswerWithCharacter(true);
      } else if (!isCorrect) {
        checkAnswerWithCharacter(false);
      }
    } else {
      checkAnswerWithCharacter(isCorrect);
    }
  };

  const handleColorClick = (id, side) => {
    if (matchLocked) return;
    
    if (!activeColor) {
      setActiveColor({ id, side });
    } else {
      if (activeColor.side !== side) {
        const leftId = activeColor.side === 'left' ? activeColor.id : id;
        const rightId = activeColor.side === 'right' ? activeColor.id : id;
        const isCorrect = colorMatchingData.correct[leftId] === rightId;
        
        if (isCorrect && !colorMatches[leftId]) {
          const newMatches = { ...colorMatches, [leftId]: rightId };
          setColorMatches(newMatches);
          
          if (Object.keys(newMatches).length === 3) {
            setMatchLocked(true);
            checkAnswerWithCharacter(true);
          } else {
            checkAnswerWithCharacter(true);
          }
        } else if (!isCorrect) {
          checkAnswerWithCharacter(false);
        }
      }
      setActiveColor(null);
    }
  };

  const handleBoardAnswer = (answer) => {
    if (boardLocked) return;
    setBoardAnswer(answer);
    setBoardLocked(true);
    const isCorrect = answer === boardQuiz.correct;
    checkAnswerWithCharacter(isCorrect);
  };

  const handleHairAnswer = (answer) => {
    if (hairLocked) return;
    setHairAnswer(answer);
    setHairLocked(true);
    const isCorrect = answer === hairQuiz.correct;
    checkAnswerWithCharacter(isCorrect);
  };

  const handlePenAnswer = (answer) => {
    if (penLocked) return;
    setPenAnswer(answer);
    setPenLocked(true);
    const isCorrect = answer === penQuiz.correct;
    checkAnswerWithCharacter(isCorrect);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
    setStepInitialized(false);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setMissingLetterAnswers({ 1: null, 2: null });
    setMissingLocked(false);
    setColorMatches({});
    setActiveColor(null);
    setMatchLocked(false);
    setBoardAnswer(null);
    setBoardLocked(false);
    setHairAnswer(null);
    setHairLocked(false);
    setPenAnswer(null);
    setPenLocked(false);
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

  const getOptionClass = (selected, value, correct) => {
    if (!selected) return "tus-ex-quiz-option";
    if (selected === value) {
      return value === correct ? "tus-ex-quiz-option tus-ex-correct-answer" : "tus-ex-quiz-option tus-ex-wrong-answer";
    }
    return "tus-ex-quiz-option tus-ex-disabled";
  };

  const getMissingOptionClass = (selected, value, isCorrectSelected) => {
    if (!selected) return "tus-ex-missing-option";
    if (selected === value) {
      return isCorrectSelected ? "tus-ex-missing-option tus-ex-missing-correct" : "tus-ex-missing-option tus-ex-missing-wrong";
    }
    return "tus-ex-missing-option tus-ex-missing-disabled";
  };

  const getColorItemClass = (id, side) => {
    const isMatched = (side === 'left' && colorMatches[id]) || 
                     (side === 'right' && Object.values(colorMatches).includes(id));
    if (isMatched) return "tus-ex-color-item tus-ex-color-matched";
    if (activeColor?.id === id && activeColor?.side === side) return "tus-ex-color-item tus-ex-color-active";
    return "tus-ex-color-item";
  };

  return (
    <div className="tus-ex-page">
      <Navbar />
      <div className="tus-ex-layout">
        <div className="tus-ex-sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="tus-ex-content">
          <h2 className="tus-ex-title">Түстер / көнүгүү</h2>
          
          <div className="tus-ex-progress-container">
            <div
              className="tus-ex-progress-fill"
              style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
            ></div>
          </div>
          
          <div className="tus-ex-header-banner">
            {currentStep === 0 && "Кайсыл тамга жок"}
            {currentStep === 1 && "Түстөрдү окшоштуруп тапкыла"}
            {currentStep === 2 && "Такта кандай түстө?"}
            {currentStep === 3 && "Кыздын чачы кандай түстө?"}
            {currentStep === 4 && "Калем кандай түстө?"}
          </div>

          <div className="tus-ex-scroll-container">
            {currentStep === 0 && (
              <div className="tus-ex-step-content">
                <div className="tus-ex-missing-container">
                  {[1, 2].map((index) => (
                    <div key={index} className="tus-ex-missing-card">
                      <div className="tus-ex-word-display">
                        <span className="tus-ex-word-text">{missingLetterData[index].display}</span>
                      </div>
                      <div className="tus-ex-options-group">
                        {missingLetterData[index].options.map((opt) => (
                          <button
                            key={opt}
                            className={getMissingOptionClass(
                              missingLetterAnswers[index], 
                              opt, 
                              missingLetterAnswers[index] === missingLetterData[index].correct
                            )}
                            onClick={() => handleMissingAnswer(index, opt)}
                            disabled={missingLocked}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {missingLetterAnswers[index] && (
                        <div className="tus-ex-feedback-icon">
                          {missingLetterAnswers[index] === missingLetterData[index].correct ? "✅" : "❌"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="tus-ex-task-hint">
                  <p>💡 Кандай тамга жок? / Какой буквы не хватает?</p>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="tus-ex-step-content">
                <div className="tus-ex-matching-area">
                  <div className="tus-ex-colors-column">
                    <h4>Түстөр</h4>
                    {colorMatchingData.left.map((item) => (
                      <div
                        key={item.id}
                        className={getColorItemClass(item.id, 'left')}
                        onClick={() => handleColorClick(item.id, 'left')}
                      >
                        <div className="tus-ex-color-square" style={{ backgroundColor: item.rgb }}></div>
                        <span className="tus-ex-color-name">{item.name}</span>
                        {colorMatches[item.id] && <span className="tus-ex-match-check">✓</span>}
                      </div>
                    ))}
                  </div>
                  <div className="tus-ex-colors-column">
                    <h4>Окшош түстөр</h4>
                    {colorMatchingData.right.map((item) => (
                      <div
                        key={item.id}
                        className={getColorItemClass(item.id, 'right')}
                        onClick={() => handleColorClick(item.id, 'right')}
                      >
                        <div className="tus-ex-color-square" style={{ backgroundColor: item.rgb }}></div>
                        <span className="tus-ex-color-name">{item.name}</span>
                        {Object.values(colorMatches).includes(item.id) && <span className="tus-ex-match-check">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="tus-ex-task-hint">
                  <p>💡 Бирдей түстөрдү чыкылдатып бириктиргиле / Нажмите на одинаковые цвета</p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="tus-ex-step-content">
                <div className="tus-ex-task-image-container">
                  <img src={`/src/assets/5tema/${boardQuiz.image}`} className="tus-ex-task-img-large" alt="board" />
                </div>
                <div className="tus-ex-question-text">
                  <p className="tus-ex-question-kg">{boardQuiz.question}</p>
                  <p className="tus-ex-question-ru">{boardQuiz.questionRu}</p>
                </div>
                <div className="tus-ex-quiz-options">
                  {boardQuiz.options.map((option, idx) => (
                    <button
                      key={idx}
                      className={getOptionClass(boardAnswer, option.value, boardQuiz.correct)}
                      onClick={() => handleBoardAnswer(option.value)}
                      disabled={boardLocked}
                      style={{ 
                        backgroundColor: option.border ? 'transparent' : option.color,
                        color: option.value === 'white' ? '#333' : 'white',
                        border: option.value === 'white' ? '2px solid #ddd' : 'none'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="tus-ex-step-content">
                <div className="tus-ex-task-image-container">
                  <img src={`/src/assets/5tema/${hairQuiz.image}`} className="tus-ex-task-img-large" alt="girl with hair" />
                </div>
                <div className="tus-ex-question-text">
                  <p className="tus-ex-question-kg">{hairQuiz.question}</p>
                  <p className="tus-ex-question-ru">{hairQuiz.questionRu}</p>
                </div>
                <div className="tus-ex-quiz-options">
                  {hairQuiz.options.map((option, idx) => (
                    <button
                      key={idx}
                      className={getOptionClass(hairAnswer, option.value, hairQuiz.correct)}
                      onClick={() => handleHairAnswer(option.value)}
                      disabled={hairLocked}
                      style={{ backgroundColor: option.color, color: option.value === 'black' ? 'white' : '#333' }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="tus-ex-step-content">
                <div className="tus-ex-task-image-container">
                  <img src={`/src/assets/5tema/${penQuiz.image}`} className="tus-ex-task-img-large" alt="pen" />
                </div>
                <div className="tus-ex-question-text">
                  <p className="tus-ex-question-kg">{penQuiz.question}</p>
                  <p className="tus-ex-question-ru">{penQuiz.questionRu}</p>
                </div>
                <div className="tus-ex-quiz-options">
                  {penQuiz.options.map((option, idx) => (
                    <button
                      key={idx}
                      className={getOptionClass(penAnswer, option.value, penQuiz.correct)}
                      onClick={() => handlePenAnswer(option.value)}
                      disabled={penLocked}
                      style={{ 
                        backgroundColor: option.border ? 'transparent' : option.color,
                        color: option.value === 'white' ? '#333' : 'white',
                        border: option.value === 'white' ? '2px solid #ccc' : 'none'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="tus-ex-finish-screen">
                <div className="tus-ex-finish-icon">🎨</div>
                <h2>Азаматсың!</h2>
                <p>Сен бардык түстөрдү билесиң!</p>
                <p>Ты знаешь все цвета!</p>
                <div className="tus-ex-finish-buttons">
                  <button className="tus-ex-btn-retry" onClick={resetQuiz}>Кайра аткаруу</button>
                  <button className="tus-ex-btn-home" onClick={() => navigate("/")}>Башкы бет</button>
                </div>
              </div>
            )}
          </div>

          {currentStep < 5 && (
            <div className="tus-ex-nav-controls">
              <button 
                className="tus-ex-nav-btn tus-ex-nav-back" 
                onClick={() => {
                  setCurrentStep(prev => prev - 1);
                  setStepInitialized(false);
                }}
                disabled={currentStep === 0}
              >
                Артка
              </button>
              <button 
                className="tus-ex-nav-btn tus-ex-nav-next" 
                onClick={handleNextStep}
                disabled={
                  (currentStep === 0 && !isMissingComplete()) ||
                  (currentStep === 1 && !isMatchingComplete()) ||
                  (currentStep === 2 && !boardAnswer) ||
                  (currentStep === 3 && !hairAnswer) ||
                  (currentStep === 4 && !penAnswer)
                }
              >
                Кийинки
              </button>
            </div>
          )}
          
          <Character state={characterState} />
        </div>
      </div>
    </div>
  );
};

export default TusExercise;