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
      letters: ["К", "Т", "Т", "А", "А"],
      correct: "ТАКТА"
    },
    {
      id: 2,
      type: "spelling",
      question: "Бул ким?",
      translation: "Кто это?",
      img: "student_boy.png",
      letters: ["О", "К", "Ч", "У", "У", "У"],
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
    // Изменено на type: "dropdown" для отображения списка
    { id: 4, type: "dropdown", question: "Тиешелүү ат атоочту тандаңыз:", verb: "..... окуйм", correct: "Мен", trans: "..... читаю", img: "reading_book.png", options: pronouns },
    { id: 5, type: "dropdown", question: "Тиешелүү ат атоочту тандаңыз:", verb: "..... окуйсуң", correct: "Сен", trans: "..... читаешь", img: "student_boy.png", options: pronouns },
    { id: 6, type: "image-choice", question: "Сүрөттө балдар эмне кылып жатышат?", trans: "Что делают дети на картинке?", img: "students_in_class.png", options: ["Алар сабак жазып жатышат", "Ал китеп окуйт", "Силер сүрөт тартышат"], correct: 0 },
    { id: 7, type: "image-choice", question: "Оля эмне кылат?", trans: "Что делает Оля?", img: "olya_enter.png", options: ["Ал класска кирет", "Алар класска кирет", "Силер класска киресиңер"], correct: 0 }
  ];

  const currentTask = quizData[currentStep];

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
    if (currentStep < quizData.length - 1) {
      setCurrentStep(prev => prev + 1);
      resetStepStates();
    } else {
      setCurrentStep(quizData.length);
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
    if (currentStep < quizData.length) {
      const timer = setTimeout(() => {
        playCharacterTalk();
        setStepInitialized(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  useEffect(() => {
    if (stepInitialized && !quizLocked) {
      if (currentTask.type === "spelling" && inputWord.length === currentTask.correct.length) {
        checkAndLockAnswer(inputWord.toUpperCase() === currentTask.correct);
      }
      if (currentTask.type === "dropdown" && selectedOption !== null) {
        checkAndLockAnswer(selectedOption === currentTask.correct);
      }
      if (currentTask.type === "image-choice" && selectedOption !== null) {
        checkAndLockAnswer(selectedOption === currentTask.correct);
      }
    }
  }, [inputWord, selectedOption, stepInitialized]);

  const getOptionClass = (opt, idx) => {
    const isSelected = selectedOption === idx;
    if (!quizLocked) return isSelected ? "quiz-option selected" : "quiz-option";
    if (idx === currentTask.correct) return "quiz-option correct-answer";
    if (isSelected) return "quiz-option wrong-answer";
    return "quiz-option disabled";
  };

  if (currentStep === quizData.length) {
    return (
      <div className="greetings-container">
        <Navbar />
        <div className="exercise-layout">
          <Sidebar />
          <div className="exercise-main-content">
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
    <div className="greetings-container">
      <Navbar />
      <div className="exercise-layout">
        <Sidebar />
        <div className="exercise-main-content">
          <h2 className="exercise-header">Бул менин классым / көнүгүү</h2>

          <div className="progress-container">
            <div className="progress-bar-fill" style={{ width: `${((currentStep + 1) / quizData.length) * 100}%` }}></div>
          </div>

          <div className="quiz-section">
            <div className="quiz-content">
              
              <div className="quiz-question">
                <img src={`/src/assets/5tema/${currentTask.img}`} style={{width: '200px', marginBottom: '15px'}} alt=""/>
                <h3>{currentTask.question}</h3>
                {currentTask.translation && <p className="question-translation">{currentTask.translation || currentTask.trans}</p>}
              </div>

              {currentTask.type === "spelling" && (
                <div className="spelling-area">
                  <div className={`word-display ${quizLocked ? (isCorrect ? "correct-text" : "wrong-text") : ""}`}>
                    {inputWord || "______"}
                  </div>
                  <div className="letter-chips">
                    {currentTask.letters.map((L, i) => (
                      <button key={i} className="chip" onClick={() => !quizLocked && setInputWord(prev => prev + L)} disabled={quizLocked}>
                        {L}
                      </button>
                    ))}
                  </div>
                  {!quizLocked && <button className="clear-btn" onClick={() => setInputWord("")}>Тазалоо</button>}
                </div>
              )}

              {currentTask.type === "dropdown" && (
                <div className="dropdown-simple-center">
                   <select 
                    value={selectedOption || ""} 
                    onChange={(e) => setSelectedOption(e.target.value)}
                    disabled={quizLocked}
                    className={quizLocked ? (isCorrect ? "correct-select" : "wrong-select") : ""}
                   >
                     <option value="">...</option>
                     {currentTask.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                   <span className="verb-text" style={{marginLeft: "10px"}}>{currentTask.verb}</span>
                </div>
              )}

              {currentTask.type === "image-choice" && (
                <div className="quiz-options">
                  {currentTask.options.map((opt, idx) => (
                    <button 
                      key={idx} 
                      className={getOptionClass(opt, idx)} 
                      onClick={() => !quizLocked && setSelectedOption(idx)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {currentTask.type === "dropdown-fill" && (
                <div className="dropdown-container-klass">
                  {currentTask.sentences.map((sentence, sIdx) => {
                    const parts = sentence.text.split("___");
                    return (
                      <div key={sIdx} className="sentence-row-simple">
                        {parts.map((part, pIdx) => (
                          <React.Fragment key={pIdx}>
                            <span>{part}</span>
                            {pIdx < parts.length - 1 && (
                              <select 
                                onChange={(e) => !quizLocked && setDropdownAnswers(p => ({...p, [`${sIdx}-${pIdx}`]: e.target.value}))}
                                disabled={quizLocked}
                                className={quizLocked ? "locked-select" : ""}
                              >
                                <option value="">...</option>
                                {currentTask.allOptions.map(o => <option key={o} value={o}>{o}</option>)}
                              </select>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    );
                  })}
                  {!quizLocked && (
                    <button className="check-btn-manual" onClick={() => {
                      let allRight = true;
                      currentTask.sentences.forEach((s, sIdx) => {
                        s.correct.forEach((corrAns, pIdx) => {
                          if (dropdownAnswers[`${sIdx}-${pIdx}`] !== corrAns) allRight = false;
                        });
                      });
                      checkAndLockAnswer(allRight);
                    }}>Текшерүү</button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="controls-row">
            <button className="prev-btn" onClick={handlePrevStep} disabled={currentStep === 0}>Артка</button>
            <button className="next-btn" onClick={handleNextStep}>
              {currentStep === quizData.length - 1 ? "Аягы" : "Кийинки"}
            </button>
          </div>

          <Character state={characterState} />
        </div>
      </div>
    </div>
  );
}

export default KlassExercise;