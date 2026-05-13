// pages/31tema/SandarExercise.jsx
import React, { useState, useRef } from 'react';
import ExerciseTemplate from '../../components/ExerciseTemplate';
import "../../components/ExerciseCommon.css";
import "./SandarExercise.css";

const SandarExercise = () => {
  const containerRef = useRef(null);
  
  // Состояния для упражнений
  const [connections, setConnections] = useState([]);
  const [activeStart, setActiveStart] = useState(null);
  const [wrongDots, setWrongDots] = useState([]);
  const [correctDots, setCorrectDots] = useState([]);
  
  const [flowerAnswer, setFlowerAnswer] = useState(null);
  const [flowerLocked, setFlowerLocked] = useState(false);
  
  const [chairAnswer, setChairAnswer] = useState(null);
  const [chairLocked, setChairLocked] = useState(false);
  
  const [lemonAnswer, setLemonAnswer] = useState(null);
  const [lemonLocked, setLemonLocked] = useState(false);
  
  const [bananaAnswer, setBananaAnswer] = useState(null);
  const [bananaLocked, setBananaLocked] = useState(false);

  // Данные для сопоставления чисел (Шаг 1)
  const matchingNumbers = {
    left: [
      
      { id: 'l3', text: "Үч", value: 3, width: "80px" },
      { id: 'l4', text: "Төрт", value: 4, width: "80px" },
      { id: 'l5', text: "Беш", value: 5, width: "80px" },
      { id: 'l6', text: "Алты", value: 6, width: "80px" },
      { id: 'l7', text: "Жети", value: 7, width: "80px" },
      { id: 'l8', text: "Сегиз", value: 8, width: "80px" },
      { id: 'l9', text: "Тогуз", value: 9, width: "80px" },
      { id: 'l10', text: "Он", value: 10, width: "80px" },
    ],
    right: [
   
      { id: 'r3', text: "5", value: 5, width: "60px" },
      { id: 'r4', text: "4", value: 4, width: "60px" },
      { id: 'r5', text: "3", value: 3, width: "60px" },
      { id: 'r6', text: "7", value: 7, width: "60px" },
      { id: 'r7', text: "6", value: 6, width: "60px" },
      { id: 'r8', text: "10", value: 10, width: "60px" },
      { id: 'r9', text: "9", value: 9, width: "60px" },
      { id: 'r10', text: "8", value: 8, width: "60px" },
    ],
    correct: { 
     'l3': 'r5', 'l4': 'r4', 'l5': 'r3',
      'l6': 'r7', 'l7': 'r6', 'l8': 'r10', 'l9': 'r9', 'l10': 'r8'
    }
  };

  // Данные для упражнения 2 - Цветы (3 цветка)
  const flowerOptions = [
    { id: 1, value: "Бир", correct: "Бир", count: 1 },
    { id: 2, value: "Эки", correct: "Эки", count: 2 },
    { id: 3, value: "Үч", correct: "Үч", count: 3 }
  ];

  // Данные для упражнения 3 - Стулья (4 стула)
  const chairOptions = [
    { id: 1, value: "Бир", correct: "Бир", count: 1 },
    { id: 2, value: "Эки", correct: "Эки", count: 2 },
    { id: 3, value: "Үч", correct: "Үч", count: 3 },
    { id: 4, value: "Төрт", correct: "Төрт", count: 4 }
  ];

  // Данные для упражнения 4 - Лимоны (5 лимонов)
  const lemonOptions = [
    { id: 1, value: "Беш лимон", correct: "Беш лимон", count: 5 },
    { id: 2, value: "Сегиз лимон", correct: "Сегиз лимон", count: 8 },
    { id: 3, value: "Алты лимон", correct: "Алты лимон", count: 6 }
  ];

  // Данные для упражнения 5 - Бананы (3 банана)
  const bananaOptions = [
    { id: 1, value: "беш банан", correct: "беш банан", count: 5 },
    { id: 2, value: "Эки банан", correct: "Эки банан", count: 2 },
    { id: 3, value: "Үч банан", correct: "Үч банан", count: 3 }
  ];

  // Функции для matching
  const isMatched = (id) => {
    return connections.some(conn => (conn.start.id === id || conn.end.id === id) && conn.isCorrect);
  };

  const handlePointClick = (id, side, e) => {
    if (isMatched(id)) return;
    
    const rect = e.target.getBoundingClientRect();
    const cRect = containerRef.current.getBoundingClientRect();
    const point = {
      x: rect.left + rect.width / 2 - cRect.left,
      y: rect.top + rect.height / 2 - cRect.top,
      id,
      side,
    };

    if (!activeStart) {
      setActiveStart(point);
      return;
    }

    if (activeStart.side !== side) {
      const isCorrect = side === 'right' 
        ? matchingNumbers.correct[activeStart.id] === id 
        : matchingNumbers.correct[id] === activeStart.id;

      setConnections(prev => [...prev, { start: activeStart, end: point, isCorrect }]);

      if (isCorrect) {
        setCorrectDots(prev => [...prev, activeStart.id, point.id]);
      } else {
        setWrongDots(prev => [...prev, activeStart.id, point.id]);
        setTimeout(() => {
          setWrongDots(prev => prev.filter(d => d !== activeStart.id && d !== point.id));
        }, 500);
      }
    }
    setActiveStart(null);
  };

  const getOptionClass = (optionValue, selected, correct) => {
    if (!selected) return "quiz-option";
    if (selected === optionValue) {
      return optionValue === correct ? "quiz-option correct-answer" : "quiz-option wrong-answer";
    }
    return "quiz-option disabled";
  };

  // Шаги упражнения
  const steps = [
    // Шаг 1: Сандарды туура көрсөткүлө (Matching)
    {
      banner: "Сандарды туура көрсөткүлө",
      content: (
        <div className="matching-area" ref={containerRef}>
          <svg className="arrows-svg">
            {connections.map((conn, i) => (
              <line key={i} x1={conn.start.x} y1={conn.start.y} x2={conn.end.x} y2={conn.end.y} 
                    stroke={conn.isCorrect ? "#66f877" : "#ff4d4d"} strokeWidth="3" />
            ))}
          </svg>
          <div className="matching-grid">
            <div className="items-column">
              {matchingNumbers.left.map(item => (
                <div key={item.id} className={`match-row left ${isMatched(item.id) ? 'matched' : ''}`}>
                  <div className="bubble-text left">{item.text}</div>
                  <div className={`dot ${activeStart?.id === item.id ? 'active' : ''} ${wrongDots.includes(item.id) ? 'wrong-dot' : ''} ${correctDots.includes(item.id) ? 'correct-dot' : ''}`} 
                       onClick={(e) => handlePointClick(item.id, 'left', e)}></div>
                </div>
              ))}
            </div>
            <div className="items-column">
              {matchingNumbers.right.map(item => (
                <div key={item.id} className={`match-row right ${isMatched(item.id) ? 'matched' : ''}`}>
                  <div className={`dot ${wrongDots.includes(item.id) ? 'wrong-dot' : ''} ${correctDots.includes(item.id) ? 'correct-dot' : ''}`} 
                       onClick={(e) => handlePointClick(item.id, 'right', e)}></div>
                  <div className="bubble-text right">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      checkAnswer: () => {
        const allCorrect = Object.keys(matchingNumbers.correct).length === connections.filter(c => c.isCorrect).length;
        return allCorrect && connections.length > 0 ? true : (connections.length > 0 ? false : null);
      }
    },
    // Шаг 2: Канча гүл бар?
    {
      banner: "Канча гүл бар?",
      content: (
        <div className="step-content">
          <div className="task-image-container">
            <img src="/src/assets/31tema/flowers.png" className="task-img-large" alt="flowers" />
          </div>
          <p className="question-kg">Канча гүл бар?</p>
          <div className="quiz-options-horizontal">
            {flowerOptions.map(opt => (
              <button 
                key={opt.id}
                className={getOptionClass(opt.value, flowerAnswer, opt.correct)}
                onClick={() => !flowerLocked && setFlowerAnswer(opt.value)}
                disabled={flowerLocked}
              >
                {opt.value}
              </button>
            ))}
          </div>
        </div>
      ),
      checkAnswer: () => {
        if (!flowerAnswer) return null;
        return flowerAnswer === "Үч";
      }
    },
    // Шаг 3: Канча отургуч бар?
    {
      banner: "Канча отургуч бар?",
      content: (
        <div className="step-content">
          <div className="task-image-container">
            <img src="/src/assets/31tema/chairs.png" className="task-img-large" alt="chairs" />
          </div>
          <p className="question-kg">Канча отургуч бар?</p>
          <div className="quiz-options-horizontal">
            {chairOptions.map(opt => (
              <button 
                key={opt.id}
                className={getOptionClass(opt.value, chairAnswer, opt.correct)}
                onClick={() => !chairLocked && setChairAnswer(opt.value)}
                disabled={chairLocked}
              >
                {opt.value}
              </button>
            ))}
          </div>
        </div>
      ),
      checkAnswer: () => {
        if (!chairAnswer) return null;
        return chairAnswer === "Төрт";
      }
    },
    // Шаг 4: Бул канча? (Лимоны)
    {
      banner: "Бул канча?",
      content: (
        <div className="step-content">
          <div className="task-image-container">
            <img src="/src/assets/31tema/lemons.png" className="task-img-large" alt="lemons" />
          </div>
          <p className="question-kg">Бул канча?</p>
          <div className="quiz-options-horizontal">
            {lemonOptions.map(opt => (
              <button 
                key={opt.id}
                className={getOptionClass(opt.value, lemonAnswer, opt.correct)}
                onClick={() => !lemonLocked && setLemonAnswer(opt.value)}
                disabled={lemonLocked}
              >
                {opt.value}
              </button>
            ))}
          </div>
        </div>
      ),
      checkAnswer: () => {
        if (!lemonAnswer) return null;
        return lemonAnswer === "Беш лимон";
      }
    },
    // Шаг 5: Бул канча? (Бананы)
    {
      banner: "Бул канча?",
      content: (
        <div className="step-content">
          <div className="task-image-container">
            <img src="/src/assets/31tema/bananas.png" className="task-img-large" alt="bananas" />
          </div>
          <p className="question-kg">Бул канча?</p>
          <div className="quiz-options-horizontal">
            {bananaOptions.map(opt => (
              <button 
                key={opt.id}
                className={getOptionClass(opt.value, bananaAnswer, opt.correct)}
                onClick={() => !bananaLocked && setBananaAnswer(opt.value)}
                disabled={bananaLocked}
              >
                {opt.value}
              </button>
            ))}
          </div>
        </div>
      ),
      checkAnswer: () => {
        if (!bananaAnswer) return null;
        return bananaAnswer === "Үч банан";
      }
    }
  ];

  const handleReset = () => {
    setConnections([]);
    setActiveStart(null);
    setWrongDots([]);
    setCorrectDots([]);
    setFlowerAnswer(null);
    setFlowerLocked(false);
    setChairAnswer(null);
    setChairLocked(false);
    setLemonAnswer(null);
    setLemonLocked(false);
    setBananaAnswer(null);
    setBananaLocked(false);
  };

  return (
    <ExerciseTemplate
      title="Сандар / көнүгүү"
      steps={steps}
      totalSteps={5}
      onReset={handleReset}
      containerClass="sandar-exercise"
    />
  );
};

export default SandarExercise;