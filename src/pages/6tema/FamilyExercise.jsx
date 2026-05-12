// pages/6tema/FamilyExercise.jsx
import React, { useState } from 'react';
import ExerciseTemplate from '../../components/ExerciseTemplate';
import "./FamilyExercise.css";

const FamilyExercise = () => {
  // Состояния для упражнений
  const [choiceAnswers, setChoiceAnswers] = useState({});
  const [choiceLocked, setChoiceLocked] = useState({});
  
  const [spellingWords, setSpellingWords] = useState({
    word1: ["Ч", "О", "", "А", "Т", "А"],
    word2: ["Т", "А", "", "Т", "А"],
    word3: ["Т", "А", "", "Н", "Е"],
    word4: ["К", "А", "", "Ы", "Н", "Д", "А", "Ш"],
    word5: ["", "Ж", "Е"]
  });
  const [spellingLocked, setSpellingLocked] = useState(false);
  
  const [inlineAnswers, setInlineAnswers] = useState({});
  const [inlineLocked, setInlineLocked] = useState({});
  const [openSelect, setOpenSelect] = useState(null);
  
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [matchingLocked, setMatchingLocked] = useState(false);

  const correctSpellingState = {
    word1: ["Ч", "О", "Ң", "А", "Т", "А"],
    word2: ["Т", "А", "Я", "Т", "А"],
    word3: ["Т", "А", "Е", "Н", "Е"],
    word4: ["К", "А", "Р", "Ы", "Н", "Д", "А", "Ш"],
    word5: ["Э", "Ж", "Е"]
  };

  // Данные упражнений
  const exercises = [
    {
      type: "choice",
      question: "Бул ким?",
      translation: "Кто это?",
      img: "father.png",
      options: ["Ата", "Апа", "Сызгыч"],
      correct: "Ата"
    },
    {
      type: "choice",
      question: "Бул ким?",
      translation: "Кто это?",
      img: "grandma.png",
      options: ["Ата", "Апа", "Чоң апа"],
      correct: "Чоң апа"
    },
    {
      type: "spelling-grid",
      question: "Сөздөрдү толуктагыла",
      translation: "Дополните слова",
      letters: ["Ң", "Я", "Е", "Р", "Э"]
    },
    {
      type: "choice",
      question: "Булар кимдер?",
      translation: "Кто они?",
      img: "siblings.png",
      options: ["аталар", "бир туугандар", "Чоң апа"],
      correct: "бир туугандар"
    },
    {
      type: "choice",
      question: "Кимдерди коруп турасын?",
      translation: "Кого ты видишь?",
      img: "dinner.png",
      options: ["Атасы, апасы", "Апасы, кызы", "эжеси, иниси"],
      correct: "Апасы, кызы"
    },
    {
      type: "inline-select",
      question: "Биздин уй-булоодо ___ адам бар.",
      translation: "В нашей семье ___ человек.",
      img: "big_family.png",
      options: ["4", "9", "7"],
      correct: "9"
    },
    {
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
      type: "inline-select",
      question: "Бул менин ___ .",
      translation: "Это мой ___.",
      img: "brother_big.png",
      options: ["эжем", "байке", "байкем"],
      correct: "байкем"
    },
    {
      type: "inline-select",
      question: "Сенин апаңдын апасы — ___",
      translation: "Мама твоей мамы — кто?",
      img: "all_family.png",
      options: ["таята", "таене", "чоң апа"],
      correct: "таене"
    },
    {
      type: "inline-select",
      question: "Сенин атаңдын апасы — ___",
      translation: "Мама твоей папы — кто?",
      img: "all_family.png",
      options: ["таята", "таене", "чоң апа"],
      correct: "чоң апа"
    }
  ];

  // Обработчики
  const handleChoiceClick = (idx, option) => {
    if (!choiceLocked[idx]) {
      setChoiceAnswers(prev => ({ ...prev, [idx]: option }));
      setChoiceLocked(prev => ({ ...prev, [idx]: true }));
    }
  };

  const handleLetterClick = (letter) => {
    if (spellingLocked) return;
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

  const handleInlineSelect = (idx, value) => {
    if (!inlineLocked[idx]) {
      setInlineAnswers(prev => ({ ...prev, [idx]: value }));
      setInlineLocked(prev => ({ ...prev, [idx]: true }));
      setOpenSelect(null);
    }
  };

  const handleLeftClick = (leftText, stepIdx) => {
    if (!matchingLocked && !matchedPairs.includes(leftText)) {
      setSelectedLeft(leftText);
    }
  };

  const handleRightClick = (rightText, stepIdx, pairs) => {
    if (!matchingLocked) {
      setSelectedRight(rightText);
      
      if (selectedLeft) {
        const isMatch = pairs.some(p => p.left === selectedLeft && p.right === rightText);
        if (isMatch) {
          setMatchedPairs(prev => [...prev, selectedLeft]);
          setSelectedLeft(null);
          setSelectedRight(null);
        } else {
          setSelectedLeft(null);
          setSelectedRight(null);
        }
      }
    }
  };

  const getChoiceClass = (idx, option, correct) => {
    const selected = choiceAnswers[idx];
    const locked = choiceLocked[idx];
    
    if (!selected || !locked) {
      return selected === option ? "quiz-option selected" : "quiz-option";
    }
    if (option === correct) return "quiz-option correct-answer";
    if (selected === option) return "quiz-option wrong-answer";
    return "quiz-option disabled";
  };

  const getSpellingCellClass = (wordKey, index, char) => {
    if (!spellingLocked) {
      return char === "" ? "spelling-cell empty" : "spelling-cell";
    }
    const correctChar = correctSpellingState[wordKey][index];
    if (char === "") return "spelling-cell empty";
    return char === correctChar ? "spelling-cell correct-cell" : "spelling-cell wrong-cell";
  };

  const getInlineSelectClass = (idx, selected, correct) => {
    if (!inlineLocked[idx]) return "select-trigger";
    if (selected === correct) return "select-trigger correct-select";
    if (selected && selected !== correct) return "select-trigger wrong-select";
    return "select-trigger";
  };

  const isSpellingComplete = () => {
    return Object.values(spellingWords).every(word => word.every(char => char !== ""));
  };

  // Создание шагов
  const steps = exercises.map((ex, idx) => {
    let checkAnswerFn = () => null;
    
    if (ex.type === "choice") {
      checkAnswerFn = () => {
        const answer = choiceAnswers[idx];
        if (!answer) return null;
        return answer === ex.correct;
      };
    } else if (ex.type === "spelling-grid") {
      checkAnswerFn = () => {
        if (!isSpellingComplete()) return null;
        const isCorrect = JSON.stringify(spellingWords) === JSON.stringify(correctSpellingState);
        if (isCorrect && !spellingLocked) setSpellingLocked(true);
        return isCorrect;
      };
    } else if (ex.type === "inline-select") {
      checkAnswerFn = () => {
        const answer = inlineAnswers[idx];
        if (!answer) return null;
        return answer === ex.correct;
      };
    } else if (ex.type === "matching-translation") {
      checkAnswerFn = () => {
        if (matchedPairs.length !== ex.pairs.length) return null;
        if (!matchingLocked) setMatchingLocked(true);
        return true;
      };
    }
    
    return {
      banner: ex.type === "choice" ? "Туура жоопту танда" :
             ex.type === "spelling-grid" ? "Сөздөрдү толуктагыла" :
             ex.type === "inline-select" ? "Сүйлөмдү толукта" :
             "Котормосун туура тап",
      content: (
        <div className="step-content">
          {ex.img && (
            <div className="task-image-container">
              <img src={`/src/assets/6tema/${ex.img}`} className="task-img-large" alt="task" />
            </div>
          )}
          
          <div className="question-text">
            <p className="question-kg">{ex.question}</p>
            <p className="question-ru">{ex.translation}</p>
          </div>

          {ex.type === "choice" && (
            <div className="quiz-options-horizontal">
              {ex.options.map((opt, optIdx) => (
                <button 
                  key={optIdx}
                  className={getChoiceClass(idx, opt, ex.correct)}
                  onClick={() => handleChoiceClick(idx, opt)}
                  disabled={choiceLocked[idx]}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {ex.type === "spelling-grid" && (
            <div className="spelling-container">
              {Object.keys(spellingWords).map((wordKey, wordIdx) => (
                <div key={wordIdx} className="spelling-row">
                  {spellingWords[wordKey].map((char, charIdx) => (
                    <div key={charIdx} className={getSpellingCellClass(wordKey, charIdx, char)}>
                      {char}
                    </div>
                  ))}
                </div>
              ))}
              <div className="letters-pool">
                {ex.letters.map((l, i) => (
                  <button key={i} className="letter-btn" onClick={() => handleLetterClick(l)} disabled={spellingLocked}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {ex.type === "inline-select" && (
            <div className="inline-select-container">
              <div className="sentence-bubble">
                <p className="sentence-text">
                  {ex.question.split("___")[0]}
                  <span className="custom-select-wrapper">
                    <button 
                      className={getInlineSelectClass(idx, inlineAnswers[idx], ex.correct)}
                      onClick={() => !inlineLocked[idx] && setOpenSelect(openSelect === idx ? null : idx)}
                      disabled={inlineLocked[idx]}
                    >
                      {inlineAnswers[idx] || "тандаңыз"}
                    </button>
                    {!inlineLocked[idx] && openSelect === idx && (
                      <div className="select-options-list">
                        {ex.options.map(opt => (
                          <div 
                            key={opt} 
                            className="select-item"
                            onClick={() => handleInlineSelect(idx, opt)}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </span>
                  {ex.question.split("___")[1]}
                </p>
              </div>
            </div>
          )}

          {ex.type === "matching-translation" && (
            <div className="matching-container">
              <div className="matching-column">
                {ex.pairs.map((p, i) => (
                  <button 
                    key={i} 
                    className={`match-item kg ${selectedLeft === p.left ? 'active' : ''} ${matchedPairs.includes(p.left) ? 'matched' : ''}`}
                    onClick={() => handleLeftClick(p.left, idx)}
                    disabled={matchingLocked || matchedPairs.includes(p.left)}
                  >
                    {p.left}
                  </button>
                ))}
              </div>
              <div className="matching-column">
                {[...ex.pairs].reverse().map((p, i) => (
                  <button 
                    key={i} 
                    className={`match-item ru ${selectedRight === p.right ? 'active' : ''} ${matchedPairs.includes(ex.pairs.find(pair => pair.right === p.right)?.left) ? 'matched' : ''}`}
                    onClick={() => handleRightClick(p.right, idx, ex.pairs)}
                    disabled={matchingLocked}
                  >
                    {p.right}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
      checkAnswer: checkAnswerFn
    };
  });

  const handleReset = () => {
    setChoiceAnswers({});
    setChoiceLocked({});
    setSpellingWords({
      word1: ["Ч", "О", "", "А", "Т", "А"],
      word2: ["Т", "А", "", "Т", "А"],
      word3: ["Т", "А", "", "Н", "Е"],
      word4: ["К", "А", "", "Ы", "Н", "Д", "А", "Ш"],
      word5: ["", "Ж", "Е"]
    });
    setSpellingLocked(false);
    setInlineAnswers({});
    setInlineLocked({});
    setOpenSelect(null);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setMatchingLocked(false);
  };

  return (
    <ExerciseTemplate
      title="Үй-бүлө / көнүгүү"
      steps={steps}
      totalSteps={10}
      onReset={handleReset}
      containerClass="family-exercise"
    />
  );
};

export default FamilyExercise;