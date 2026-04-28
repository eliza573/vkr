import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./KlassExercise.css"; 
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Character from "../../components/Character";

function KlassExercise() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [characterState, setCharacterState] = useState("idle");
  const [stepInitialized, setStepInitialized] = useState(false);
  
  const [inputWord, setInputWord] = useState("");
  const [dropdownAnswers, setDropdownAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  
  const [quizLocked, setQuizLocked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const pronouns = ["Мен", "Сен", "Сиз", "Ал", "Биз", "Силер", "Сиздер", "Алар"];

  const quizData = [
    {
      id: 1,
      type: "spelling",
      question: "Бул эмне?",
      translation: "Что это?",
      img: "board_desk.png",
      letters: ["Т", "А", "К", "Т", "А"],
      correct: "ТАКТА"
    },
    {
      id: 2,
      type: "spelling",
      question: "Бул ким?",
      translation: "Кто это?",
      img: "student_boy.png",
      letters: ["О", "К", "У", "У", "Ч", "У"],
      correct: "ОКУУЧУ"
    },
    {
      id: 3,
      type: "dropdown-fill",
      question: "Сүйлөмдү толуктагыла",
      translation: "Дополняем предложения",
      img: "classroom.png",
      sentences: [
        { text: "Бул ___ класс", correct: ["биздин"] },
        { text: "Класста ___, ___ бар.", correct: ["саат", "желек"] }
      ],
      allOptions: ["биздин", "саат", "желек", "жарык", "таза"]
    },
    { 
      id: 4, 
      type: "dropdown", 
      question: "Тиешелүү ат атоочту тандаңыз:", 
      verb: "..... окуйм", 
      correct: "Мен", 
      trans: "..... читаю", 
      img: "reading_book.png", 
      options: pronouns 
    },
    { 
      id: 5, 
      type: "dropdown", 
      question: "Тиешелүү ат атоочту тандаңыз:", 
      verb: "..... окуйсуң", 
      correct: "Сен", 
      trans: "..... читаешь", 
      img: "student_boy.png", 
      options: pronouns 
    },
    { 
      id: 6, 
      type: "image-choice", 
      question: "Сүрөттө балдар эмне кылып жатышат?", 
      trans: "Что делают дети на картинке?", 
      img: "students_in_class.png", 
      options: ["Алар сабак жазып жатышат", "Ал китеп окуйт", "Силер сүрөт тартышат"], 
      correct: 0 
    },
    { 
      id: 7, 
      type: "image-choice", 
      question: "Оля эмне кылат?", 
      trans: "Что делает Оля?", 
      img: "olya_enter.png", 
      options: ["Ал класска кирет", "Алар класска кирет", "Силер класска киресиңер"], 
      correct: 0 
    }
  ];

  const currentTask = quizData[currentStep];
  const totalSteps = quizData.length;

  const playCharacterTalk = () => {
    setCharacterState("talk");
    setTimeout(() => setCharacterState("idle"), 3000);
  };

  const checkAnswerWithCharacter = (correct) => {
    setCharacterState(correct ? "success" : "error");
    setTimeout(() => setCharacterState("idle"), 2000);
  };

  const checkAndLockAnswer = (correct) => {
    if (!quizLocked) {
      setIsCorrect(correct);
      setQuizLocked(true);
      checkAnswerWithCharacter(correct);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      resetStepStates();
    } else {
      setCurrentStep(totalSteps);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      resetStepStates();
    }
  };

  const resetStepStates = () => {
    setInputWord("");
    setDropdownAnswers({});
    setSelectedOption(null);
    setQuizLocked(false);
    setIsCorrect(null);
    setStepInitialized(false);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    resetStepStates();
  };

  useEffect(() => {
    if (currentStep < totalSteps) {
      const timer = setTimeout(() => {
        playCharacterTalk();
        setStepInitialized(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Автоматическая проверка для spelling
  useEffect(() => {
    if (stepInitialized && !quizLocked && currentTask?.type === "spelling" && inputWord.length === currentTask.correct.length) {
      checkAndLockAnswer(inputWord.toUpperCase() === currentTask.correct);
    }
  }, [inputWord, stepInitialized, currentTask, quizLocked]);

  // Автоматическая проверка для dropdown
  useEffect(() => {
    if (stepInitialized && !quizLocked && currentTask?.type === "dropdown" && selectedOption !== null) {
      checkAndLockAnswer(selectedOption === currentTask.correct);
    }
  }, [selectedOption, stepInitialized, currentTask, quizLocked]);

  // Автоматическая проверка для image-choice
  useEffect(() => {
    if (stepInitialized && !quizLocked && currentTask?.type === "image-choice" && selectedOption !== null) {
      checkAndLockAnswer(selectedOption === currentTask.correct);
    }
  }, [selectedOption, stepInitialized, currentTask, quizLocked]);

  // Автоматическая проверка для dropdown-fill
  useEffect(() => {
    if (stepInitialized && !quizLocked && currentTask?.type === "dropdown-fill") {
      const allFilled = Object.keys(dropdownAnswers).length === 3;
      if (allFilled) {
        let allCorrect = true;
        currentTask.sentences.forEach((s, sIdx) => {
          s.correct.forEach((corrAns, pIdx) => {
            if (dropdownAnswers[`${sIdx}-${pIdx}`] !== corrAns) allCorrect = false;
          });
        });
        checkAndLockAnswer(allCorrect);
      }
    }
  }, [dropdownAnswers, stepInitialized, currentTask, quizLocked]);

  const getOptionClass = (idx) => {
    const isSelected = selectedOption === idx;
    if (!quizLocked) return isSelected ? "quiz-option selected" : "quiz-option";
    if (idx === currentTask?.correct) return "quiz-option correct-answer";
    if (isSelected) return "quiz-option wrong-answer";
    return "quiz-option disabled";
  };

  const getHeaderBannerText = () => {
    if (currentTask?.type === "spelling") return currentTask.question;
    if (currentTask?.type === "dropdown") return currentTask.question;
    if (currentTask?.type === "image-choice") return currentTask.question;
    if (currentTask?.type === "dropdown-fill") return currentTask.question;
    return "";
  };

  if (currentStep === totalSteps) {
    return (
      <div className="klass-ex-page">
        <Navbar />
        <div className="klass-ex-layout">
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>
          <div className="klass-ex-content">
            <div className="finish-screen">
              <div className="finish-icon">🏆</div>
              <h2>Азаматсың!</h2>
              <p>Класс темасын ийгиликтүү аяктадың!</p>
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
    <div className="klass-ex-page">
      <Navbar />
      <div className="klass-ex-layout">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="klass-ex-content">
          <h2 className="ex1-title">Бул менин классым / көнүгүү</h2>

          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}></div>
          </div>

          <div className="ex-header-banner">
            {getHeaderBannerText()}
          </div>

          <div className="exercise-scroll-container">
            <div className="step-content">
              <div className="task-image-container">
                <img src={`/src/assets/5tema/${currentTask.img}`} className="task-img-large" alt="task" />
              </div>
              
              {currentTask.translation && <p className="question-translation">{currentTask.translation || currentTask.trans}</p>}

              {currentTask.type === "spelling" && (
                <div className="spelling-area">
                  <div className={`word-display ${quizLocked ? (isCorrect ? "correct-text" : "wrong-text") : ""}`}>
                    {inputWord || "______"}
                  </div>
                  <div className="letters-pool">
                    {currentTask.letters.map((L, i) => (
                      <button key={i} className="letter-chip" onClick={() => !quizLocked && inputWord.length < currentTask.correct.length && setInputWord(prev => prev + L)} disabled={quizLocked}>
                        {L}
                      </button>
                    ))}
                  </div>
                  {!quizLocked && inputWord.length > 0 && <button className="clear-btn" onClick={() => setInputWord("")}>Тазалоо</button>}
                </div>
              )}

              {currentTask.type === "dropdown" && (
                <div className="dropdown-container">
                  <select 
                    value={selectedOption || ""} 
                    onChange={(e) => !quizLocked && setSelectedOption(e.target.value)}
                    disabled={quizLocked}
                    className={quizLocked ? (isCorrect ? "correct-select" : "wrong-select") : ""}
                  >
                    <option value="">---</option>
                    {currentTask.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <span className="verb-text">{currentTask.verb}</span>
                </div>
              )}

              {currentTask.type === "image-choice" && (
                <div className="quiz-options-horizontal">
                  {currentTask.options.map((opt, idx) => (
                    <button 
                      key={idx} 
                      className={getOptionClass(idx)} 
                      onClick={() => !quizLocked && setSelectedOption(idx)}
                      disabled={quizLocked}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {currentTask.type === "dropdown-fill" && (
                <div className="dropdown-fill-container">
                  {currentTask.sentences.map((sentence, sIdx) => {
                    const parts = sentence.text.split("___");
                    return (
                      <div key={sIdx} className="sentence-row-simple">
                        {parts.map((part, pIdx) => (
                          <React.Fragment key={pIdx}>
                            <span>{part}</span>
                            {pIdx < parts.length - 1 && (
                              <select 
                                onChange={(e) => !quizLocked && setDropdownAnswers(prev => ({...prev, [`${sIdx}-${pIdx}`]: e.target.value}))}
                                disabled={quizLocked}
                                className={quizLocked ? "locked-select" : ""}
                                value={dropdownAnswers[`${sIdx}-${pIdx}`] || ""}
                              >
                                <option value="">---</option>
                                {currentTask.allOptions.map(o => <option key={o} value={o}>{o}</option>)}
                              </select>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="nav-controls">
            <button className="nav-btn back" onClick={handlePrevStep} disabled={currentStep === 0}>
              Артка
            </button>
            <button 
              className="nav-btn next" 
              onClick={handleNextStep}
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
}

export default KlassExercise;