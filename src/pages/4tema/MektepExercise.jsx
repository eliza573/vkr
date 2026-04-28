import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./MektepExercise.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Character from "../../components/Character";

function MektepExercise() {
  const navigate = useNavigate();
  
  const [characterState, setCharacterState] = useState("idle");
  const [stepInitialized, setStepInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputWord, setInputWord] = useState("");
  const [dropdownAnswers, setDropdownAnswers] = useState({});
  
  const [quizLocked, setQuizLocked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const exercises = [
    {
      id: 1,
      type: "image-click",
      question: "Окуучу кызды тап?",
      translation: "Найдите ученицу",
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
      id: 3,
      type: "spelling",
      question: "Бул эмне?",
      translation: "Что это?",
      image: "school_main.png",
      letters: ["М", "Е", "К", "Т", "Е", "П"],
      correct: "МЕКТЕП"
    },
    {
      id: 4,
      type: "spelling",
      question: "Бул ким?",
      translation: "Кто это?",
      image: "teacher_stand.png",
      letters: ["М", "У", "Г", "А", "Л", "И", "М"],
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
      options: ["Назик сабак жазат", "Назик китеп окуйт", "Назик мектепке барат"],
      correct: 1
    }
  ];

  const currentExercise = exercises[currentStep];
  const totalSteps = exercises.length;

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
    if (currentStep < exercises.length - 1) {
      setCurrentStep(prev => prev + 1);
      resetStepStates();
    } else {
      setCurrentStep(exercises.length);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      resetStepStates();
    }
  };

  const resetStepStates = () => {
    setSelectedOption(null);
    setInputWord("");
    setDropdownAnswers({});
    setQuizLocked(false);
    setIsCorrect(null);
    setStepInitialized(false);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    resetStepStates();
  };

  useEffect(() => {
    if (currentStep < exercises.length) {
      const timer = setTimeout(() => {
        playCharacterTalk();
        setStepInitialized(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  useEffect(() => {
    if (stepInitialized && !quizLocked) {
      if (currentExercise?.type === "image-click" && selectedOption) {
        checkAndLockAnswer(selectedOption === currentExercise.correctId);
      }
      if (currentExercise?.type === "choice" && selectedOption !== null) {
        checkAndLockAnswer(selectedOption === currentExercise.correct);
      }
      if (currentExercise?.type === "dropdown-fill") {
        const allFilled = Object.keys(dropdownAnswers).length === currentExercise.sentences.length;
        if (allFilled) {
          const correct = currentExercise.sentences.every((s, idx) => dropdownAnswers[idx] === s.correct);
          checkAndLockAnswer(correct);
        }
      }
      if (currentExercise?.type === "spelling" && inputWord.length === currentExercise.letters.length) {
        checkAndLockAnswer(inputWord.toUpperCase() === currentExercise.correct);
      }
    }
  }, [selectedOption, dropdownAnswers, inputWord, stepInitialized, currentExercise, quizLocked]);

  const getImageCardClass = (item) => {
    if (!quizLocked) return selectedOption === item.id ? "image-card selected" : "image-card";
    if (item.isCorrect) return "image-card correct-border";
    if (selectedOption === item.id) return "image-card wrong-border";
    return "image-card";
  };

  const getOptionClass = (idx) => {
    if (!quizLocked) return selectedOption === idx ? "quiz-option selected" : "quiz-option";
    if (idx === currentExercise.correct) return "quiz-option correct-answer";
    if (selectedOption === idx) return "quiz-option wrong-answer";
    return "quiz-option disabled";
  };

  const getHeaderBannerText = () => {
    if (currentExercise?.type === "image-click") return currentExercise.question;
    if (currentExercise?.type === "dropdown-fill") return currentExercise.question;
    if (currentExercise?.type === "spelling") return currentExercise.question;
    if (currentExercise?.type === "choice") return "Туура жоопту танда";
    return "";
  };

  if (currentStep === exercises.length) {
    return (
      <div className="mektep-ex-page">
        <Navbar />
        <div className="mektep-ex-layout">
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>
          <div className="mektep-ex-content">
            <div className="finish-screen">
              <div className="finish-icon">🏆</div>
              <h2>Азаматсың!</h2>
              <p>Сен бардык тапшырманы аткардың!</p>
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
    <div className="mektep-ex-page">
      <Navbar />
      <div className="mektep-ex-layout">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="mektep-ex-content">
          <h2 className="ex1-title">Мен мектепке барам / көнүгүү</h2>

          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}></div>
          </div>

          <div className="ex-header-banner">
            {getHeaderBannerText()}
          </div>

          <div className="exercise-scroll-container">
            <div className="step-content">
              {currentExercise.type === "image-click" && (
                <>
                  <div className="task-image-container">
                    <img src={`/src/assets/4tema/${currentExercise.image}`} className="task-img-large" alt="task" style={{ display: 'none' }} />
                  </div>
                  <p className="question-translation">{currentExercise.translation}</p>
                  <div className="image-options-grid">
                    {currentExercise.options.map((item) => (
                      <div key={item.id} className={getImageCardClass(item)} onClick={() => !quizLocked && setSelectedOption(item.id)}>
                        <img src={`/src/assets/4tema/${item.img}`} alt="choice" />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {currentExercise.type === "dropdown-fill" && (
                <>
                  <div className="task-image-container">
                    <img src={`/src/assets/4tema/${currentExercise.image}`} className="task-img-large" alt="task" />
                  </div>
                  <div className="dropdown-container">
                    {currentExercise.sentences.map((sentence, idx) => (
                      <div key={idx} className="sentence-row">
                        <span>{sentence.text.split("___")[0]}</span>
                        <select 
                          onChange={(e) => !quizLocked && setDropdownAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                          disabled={quizLocked}
                          className={quizLocked ? (dropdownAnswers[idx] === sentence.correct ? "correct-select" : "wrong-select") : ""}
                          value={dropdownAnswers[idx] || ""}
                        >
                          <option value="">---</option>
                          {currentExercise.allOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <span>{sentence.text.split("___")[1]}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {currentExercise.type === "spelling" && (
                <>
                  <div className="task-image-container">
                    <img src={`/src/assets/4tema/${currentExercise.image}`} className="task-img-large" alt="task" />
                  </div>
                  <div className={`word-display ${quizLocked ? (isCorrect ? "correct-text" : "wrong-text") : ""}`}>
                    {inputWord || "______"}
                  </div>
                  <div className="letters-pool">
                    {currentExercise.letters.map((L, i) => (
                      <button key={i} className="letter-chip" onClick={() => !quizLocked && inputWord.length < currentExercise.letters.length && setInputWord(prev => prev + L)} disabled={quizLocked}>
                        {L}
                      </button>
                    ))}
                  </div>
                  {!quizLocked && inputWord.length > 0 && <button className="clear-btn" onClick={() => setInputWord("")}>Тазалоо</button>}
                </>
              )}

              {currentExercise.type === "choice" && (
                <>
                  <div className="task-image-container">
                    <img src={`/src/assets/4tema/${currentExercise.image}`} className="task-img-large" alt="task" />
                  </div>
                  <div className="question-text">
                    <p className="question-kg">{currentExercise.question}</p>
                    <p className="question-ru">{currentExercise.translation}</p>
                  </div>
                  <div className="quiz-options-horizontal">
                    {currentExercise.options.map((option, idx) => (
                      <button key={idx} className={getOptionClass(idx)} onClick={() => !quizLocked && setSelectedOption(idx)} disabled={quizLocked}>
                        {option}
                      </button>
                    ))}
                  </div>
                </>
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
              {currentStep === exercises.length - 1 ? "Аяктоо" : "Кийинки"}
            </button>
          </div>

          <Character state={characterState} />
        </div>
      </div>
    </div>
  );
}

export default MektepExercise;