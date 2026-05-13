// pages/7tema/AnimalsExercise.jsx
import React, { useState, useRef } from 'react';
import ExerciseTemplate from '../../components/ExerciseTemplate';
import "./AnimalsExercise.css";

const AnimalsExercise = () => {
  // Состояния для упражнений
  const [connections, setConnections] = useState({});
  const [activeStart, setActiveStart] = useState(null);
  const [wrongDots, setWrongDots] = useState([]);
  const [correctDots, setCorrectDots] = useState([]);
  const [placedLetters, setPlacedLetters] = useState({});
  const [usedLetterIds, setUsedLetterIds] = useState({});
  const [showWriteErrors, setShowWriteErrors] = useState({});
  const [placedGroups, setPlacedGroups] = useState({ domestic: [], wild: [] });
  const [groupError, setGroupError] = useState(false);

  const containerRef = useRef(null);

  // Данные сопоставлений
  const matchGames = {
    0: {
      title: "Дал келтиргиле",
      left: [
        { id: "l1", text: "Уй", img: "cow.png" },
        { id: "l2", text: "Бээ", img: "horse.png" },
        { id: "l3", text: "Эчки", img: "goat.png" },
      ],
      right: [
        { id: "r1", text: "Улак", img: "ulak.png" },
        { id: "r2", text: "Музоо", img: "muzo.png" },
        { id: "r3", text: "Кулун", img: "kulun.png" },
      ],
      correct: { l1: "r2", l2: "r3", l3: "r1" },
    },
    4: {
      title: "Дал келтиргиле",
      left: [
        { id: "l1", text: "Бөрү", img: "wolf.png" },
        { id: "l2", text: "Коён", img: "rabbit.png" },
        { id: "l3", text: "Аюу", img: "bear.png" },
      ],
      right: [
        { id: "r1", text: "Мамалак", img: "bearbaby.png" },
        { id: "r2", text: "Бөлтүрүк", img: "wolfbaby.png" },
        { id: "r3", text: "Көжөк", img: "rabbitbaby.png" },
      ],
      correct: { l1: "r2", l2: "r3", l3: "r1" },
    },
    5: {
      title: "Кайда жашайт?",
      left: [
        { id: "l1", text: "Түлкү", img: "fox.png" },
        { id: "l2", text: "Аркар", img: "arkar.png" },
        { id: "l3", text: "Суур", img: "marmot.png" },
      ],
      right: [
        { id: "r1", text: "Тоо", img: "mountain.png" },
        { id: "r2", text: "Ийин", img: "burrow.png" },
        { id: "r3", text: "Токой", img: "forest.png" },
      ],
      correct: { l1: "r3", l2: "r1", l3: "r2" },
    },
  };

  // Данные написания слов
  const writeGames = {
    1: { word: ["К", "О", "Й"], letters: ["Й", "К", "О", "Т"], img: "koi.png" },
    2: { word: ["Ч", "О", "Ч", "К", "О"], letters: ["О", "О", "Ч", "К", "Ч", "Р"], img: "pig.png" },
    3: { word: ["К", "Ү", "Ч", "Ү", "К"], letters: ["Ү", "К", "Ч", "Ү", "К"], img: "babydog.png" },
    6: { word: ["М", "Ө", "Н", "Д", "Ө", "Л", "Ө", "Й"], letters: ["Ө", "М", "Д", "Й", "Н", "Ө", "Л", "Ө"], img: "mondoloy.png", clickMode: true },
    7: { word: ["Ч", "Ө", "Н", "Д", "Ө", "Л", "Ө", "Й"], letters: ["Ө", "Ч", "Д", "Й", "Н", "Ө", "Л", "Ө"], img: "chondoloy.png", clickMode: true },
  };

  // Данные для группировки животных
  const groupAnimals = [
    { id: "cow", name: "Уй", img: "cow.png", group: "domestic" },
    { id: "goat", name: "Эчки", img: "goat.png", group: "domestic" },
    { id: "wolf", name: "Бөрү", img: "wolf.png", group: "wild" },
    { id: "fox", name: "Түлкү", img: "fox.png", group: "wild" },
  ];

  const isMatched = (step, id) => {
    return connections[step]?.some(
      (conn) => (conn.start.id === id || conn.end.id === id) && conn.isCorrect
    );
  };

  const handlePointClick = (step, id, side, e, currentMatching) => {
    if (isMatched(step, id)) return;

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
      const isCorrect =
        side === "right"
          ? currentMatching.correct[activeStart.id] === id
          : currentMatching.correct[id] === activeStart.id;

      setConnections(prev => ({
        ...prev,
        [step]: [...(prev[step] || []), { start: activeStart, end: point, isCorrect }]
      }));

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

  const handleDragStart = (e, letterData) => {
    e.dataTransfer.setData("letterData", JSON.stringify(letterData));
  };

  const handleDrop = (e, step, index, correctWord) => {
    e.preventDefault();
    const letterData = JSON.parse(e.dataTransfer.getData("letterData"));
    const newLetters = { ...placedLetters };
    const stepLetters = newLetters[step] || Array(correctWord.length).fill(null);

    if (stepLetters[index]) {
      setUsedLetterIds(prev => ({
        ...prev,
        [step]: (prev[step] || []).filter(id => id !== stepLetters[index].id)
      }));
    }

    stepLetters[index] = letterData;
    newLetters[step] = stepLetters;
    setPlacedLetters(newLetters);
    setUsedLetterIds(prev => ({
      ...prev,
      [step]: [...(prev[step] || []), letterData.id]
    }));
    setShowWriteErrors(prev => ({ ...prev, [step]: true }));
  };

  const handleLetterClick = (step, letterData, correctWord) => {
    const currentLetters = placedLetters[step] || Array(correctWord.length).fill(null);
    const emptyIndex = currentLetters.findIndex((item, idx) => idx < correctWord.length && item === null);
    if (emptyIndex === -1) return;

    const newLetters = { ...placedLetters };
    const stepLetters = [...currentLetters];
    stepLetters[emptyIndex] = letterData;
    newLetters[step] = stepLetters;
    setPlacedLetters(newLetters);
    setUsedLetterIds(prev => ({
      ...prev,
      [step]: [...(prev[step] || []), letterData.id]
    }));
    setShowWriteErrors(prev => ({ ...prev, [step]: true }));
  };

  const handleSlotClick = (step, index, correctWord) => {
    const currentLetters = placedLetters[step] || [];
    const selectedLetter = currentLetters[index];
    if (!selectedLetter) return;

    const newLetters = { ...placedLetters };
    const stepLetters = [...currentLetters];
    stepLetters[index] = null;
    newLetters[step] = stepLetters;
    setPlacedLetters(newLetters);
    setUsedLetterIds(prev => ({
      ...prev,
      [step]: (prev[step] || []).filter(id => id !== selectedLetter.id)
    }));
  };

  const getLetterClass = (step, letterData, index, correctWord, showError) => {
    if (!letterData) return "animal-drop-slot";
    if (letterData.letter === correctWord[index]) {
      return "animal-drop-slot correct";
    }
    return showError ? "animal-drop-slot wrong shake-error" : "animal-drop-slot wrong";
  };

  const handleAnimalGroupDrag = (e, animalId) => {
    e.dataTransfer.setData("animalId", animalId);
  };

  const handleGroupDrop = (e, groupName) => {
    e.preventDefault();
    const animalId = e.dataTransfer.getData("animalId");
    const animal = groupAnimals.find(item => item.id === animalId);
    if (!animal) return;

    if (animal.group === groupName) {
      setPlacedGroups(prev => ({
        ...prev,
        [groupName]: prev[groupName].includes(animalId) ? prev[groupName] : [...prev[groupName], animalId]
      }));
      setGroupError(false);
    } else {
      setGroupError(true);
      setTimeout(() => setGroupError(false), 600);
    }
  };

  const isAnimalPlaced = (id) => {
    return placedGroups.domestic.includes(id) || placedGroups.wild.includes(id);
  };

  const removeAnimalFromGroup = (animalId, groupName) => {
    setPlacedGroups(prev => ({
      ...prev,
      [groupName]: prev[groupName].filter(id => id !== animalId)
    }));
  };

  const isSpellingComplete = (step, correctWord) => {
    const letters = placedLetters[step] || [];
    return letters.length === correctWord.length && letters.every(l => l !== null);
  };

  const isMatchingComplete = (step, currentMatching) => {
    const stepConnections = connections[step] || [];
    const correctCount = stepConnections.filter(c => c.isCorrect).length;
    return correctCount === Object.keys(currentMatching.correct).length;
  };

  const isGroupingComplete = () => {
    return groupAnimals.every(animal => isAnimalPlaced(animal.id));
  };

  // Создание шагов
  const steps = [
    // Шаг 0 - Сопоставление (Уй, Бээ, Эчки)
    {
      banner: matchGames[0]?.title,
      content: (
        <div className="animals-matching-area" ref={containerRef}>
          <svg className="animals-arrows-svg">
            {(connections[0] || []).map((conn, i) => (
              <line key={i} x1={conn.start.x} y1={conn.start.y} x2={conn.end.x} y2={conn.end.y} 
                    stroke={conn.isCorrect ? "#4CAF50" : "#ff4d4d"} strokeWidth="3" />
            ))}
          </svg>
          <div className="animals-matching-grid">
            <div className="animals-column">
              {matchGames[0].left.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className="animal-bubble">{item.text}</div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img" alt="" />
                  <div className={`animal-dot ${activeStart?.id === item.id ? "active" : ""} ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(0, item.id, "left", e, matchGames[0])}></div>
                </div>
              ))}
            </div>
            <div className="animals-column">
              {matchGames[0].right.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className={`animal-dot ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(0, item.id, "right", e, matchGames[0])}></div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img" alt="" />
                  <div className="animal-bubble">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      checkAnswer: () => isMatchingComplete(0, matchGames[0])
    },
    // Шаг 1 - Написание "КОЙ"
    {
      banner: "Туура жаз",
      content: (
        <div className="animals-write-area">
          <img src={`/src/assets/animals/${writeGames[1].img}`} className="animal-task-img" alt="" />
          <div className="animal-slots-row">
            {writeGames[1].word.map((_, i) => (
              <div key={i} className={getLetterClass(1, (placedLetters[1] || [])[i], i, writeGames[1].word, showWriteErrors[1])}
                   onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 1, i, writeGames[1].word)}
                   onClick={() => handleSlotClick(1, i, writeGames[1].word)}>
                {(placedLetters[1] || [])[i]?.letter}
              </div>
            ))}
          </div>
          <div className="animal-letters-pool">
            {writeGames[1].letters.map((letter, i) => {
              const letterData = { id: `1-${i}`, letter };
              if ((usedLetterIds[1] || []).includes(letterData.id)) return null;
              return <div key={letterData.id} className="animal-letter" draggable onDragStart={(e) => handleDragStart(e, letterData)}
                          onClick={() => handleLetterClick(1, letterData, writeGames[1].word)}>{letter}</div>;
            })}
          </div>
        </div>
      ),
      checkAnswer: () => {
        if (!isSpellingComplete(1, writeGames[1].word)) return null;
        const letters = placedLetters[1] || [];
        return letters.map(l => l?.letter).join("") === writeGames[1].word.join("");
      }
    },
    // Шаг 2 - Написание "ЧОЧКО"
    {
      banner: "Туура жаз",
      content: (
        <div className="animals-write-area">
          <img src={`/src/assets/animals/${writeGames[2].img}`} className="animal-task-img" alt="" />
          <div className="animal-slots-row">
            {writeGames[2].word.map((_, i) => (
              <div key={i} className={getLetterClass(2, (placedLetters[2] || [])[i], i, writeGames[2].word, showWriteErrors[2])}
                   onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 2, i, writeGames[2].word)}
                   onClick={() => handleSlotClick(2, i, writeGames[2].word)}>
                {(placedLetters[2] || [])[i]?.letter}
              </div>
            ))}
          </div>
          <div className="animal-letters-pool">
            {writeGames[2].letters.map((letter, i) => {
              const letterData = { id: `2-${i}`, letter };
              if ((usedLetterIds[2] || []).includes(letterData.id)) return null;
              return <div key={letterData.id} className="animal-letter" draggable onDragStart={(e) => handleDragStart(e, letterData)}
                          onClick={() => handleLetterClick(2, letterData, writeGames[2].word)}>{letter}</div>;
            })}
          </div>
        </div>
      ),
      checkAnswer: () => {
        if (!isSpellingComplete(2, writeGames[2].word)) return null;
        const letters = placedLetters[2] || [];
        return letters.map(l => l?.letter).join("") === writeGames[2].word.join("");
      }
    },
    // Шаг 3 - Написание "КҮЧҮК"
    {
      banner: "Туура жаз",
      content: (
        <div className="animals-write-area">
          <img src={`/src/assets/animals/${writeGames[3].img}`} className="animal-task-img" alt="" />
          <div className="animal-slots-row">
            {writeGames[3].word.map((_, i) => (
              <div key={i} className={getLetterClass(3, (placedLetters[3] || [])[i], i, writeGames[3].word, showWriteErrors[3])}
                   onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 3, i, writeGames[3].word)}
                   onClick={() => handleSlotClick(3, i, writeGames[3].word)}>
                {(placedLetters[3] || [])[i]?.letter}
              </div>
            ))}
          </div>
          <div className="animal-letters-pool">
            {writeGames[3].letters.map((letter, i) => {
              const letterData = { id: `3-${i}`, letter };
              if ((usedLetterIds[3] || []).includes(letterData.id)) return null;
              return <div key={letterData.id} className="animal-letter" draggable onDragStart={(e) => handleDragStart(e, letterData)}
                          onClick={() => handleLetterClick(3, letterData, writeGames[3].word)}>{letter}</div>;
            })}
          </div>
        </div>
      ),
      checkAnswer: () => {
        if (!isSpellingComplete(3, writeGames[3].word)) return null;
        const letters = placedLetters[3] || [];
        return letters.map(l => l?.letter).join("") === writeGames[3].word.join("");
      }
    },
    // Шаг 4 - Сопоставление (Бөрү, Коён, Аюу)
    {
      banner: matchGames[4]?.title,
      content: (
        <div className="animals-matching-area" ref={containerRef}>
          <svg className="animals-arrows-svg">
            {(connections[4] || []).map((conn, i) => (
              <line key={i} x1={conn.start.x} y1={conn.start.y} x2={conn.end.x} y2={conn.end.y} 
                    stroke={conn.isCorrect ? "#4CAF50" : "#ff4d4d"} strokeWidth="3" />
            ))}
          </svg>
          <div className="animals-matching-grid">
            <div className="animals-column">
              {matchGames[4].left.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className="animal-bubble">{item.text}</div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img" alt="" />
                  <div className={`animal-dot ${activeStart?.id === item.id ? "active" : ""} ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(4, item.id, "left", e, matchGames[4])}></div>
                </div>
              ))}
            </div>
            <div className="animals-column">
              {matchGames[4].right.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className={`animal-dot ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(4, item.id, "right", e, matchGames[4])}></div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img" alt="" />
                  <div className="animal-bubble">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      checkAnswer: () => isMatchingComplete(4, matchGames[4])
    },
    // Шаг 5 - Сопоставление (Где живут)
    {
      banner: matchGames[5]?.title,
      content: (
        <div className="animals-matching-area" ref={containerRef}>
          <svg className="animals-arrows-svg">
            {(connections[5] || []).map((conn, i) => (
              <line key={i} x1={conn.start.x} y1={conn.start.y} x2={conn.end.x} y2={conn.end.y} 
                    stroke={conn.isCorrect ? "#4CAF50" : "#ff4d4d"} strokeWidth="3" />
            ))}
          </svg>
          <div className="animals-matching-grid">
            <div className="animals-column">
              {matchGames[5].left.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className="animal-bubble">{item.text}</div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img" alt="" />
                  <div className={`animal-dot ${activeStart?.id === item.id ? "active" : ""} ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(5, item.id, "left", e, matchGames[5])}></div>
                </div>
              ))}
            </div>
            <div className="animals-column">
              {matchGames[5].right.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className={`animal-dot ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(5, item.id, "right", e, matchGames[5])}></div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img" alt="" />
                  <div className="animal-bubble">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      checkAnswer: () => isMatchingComplete(5, matchGames[5])
    },
    // Шаг 6 - Написание "МӨНДӨЛӨЙ" (клик режим)
    {
      banner: "Туура жаз",
      content: (
        <div className="animals-write-area">
          <img src={`/src/assets/animals/${writeGames[6].img}`} className="animal-task-img" alt="" />
          <div className="animal-slots-row">
            {writeGames[6].word.map((_, i) => (
              <div key={i} className={getLetterClass(6, (placedLetters[6] || [])[i], i, writeGames[6].word, showWriteErrors[6])}
                   onClick={() => handleSlotClick(6, i, writeGames[6].word)}>
                {(placedLetters[6] || [])[i]?.letter}
              </div>
            ))}
          </div>
          <div className="animal-letters-pool">
            {writeGames[6].letters.map((letter, i) => {
              const letterData = { id: `6-${i}`, letter };
              if ((usedLetterIds[6] || []).includes(letterData.id)) return null;
              return <div key={letterData.id} className="animal-letter" onClick={() => handleLetterClick(6, letterData, writeGames[6].word)}>{letter}</div>;
            })}
          </div>
        </div>
      ),
      checkAnswer: () => {
        if (!isSpellingComplete(6, writeGames[6].word)) return null;
        const letters = placedLetters[6] || [];
        return letters.map(l => l?.letter).join("") === writeGames[6].word.join("");
      }
    },
    // Шаг 7 - Написание "ЧӨНДӨЛӨЙ" (клик режим)
    {
      banner: "Туура жаз",
      content: (
        <div className="animals-write-area">
          <img src={`/src/assets/animals/${writeGames[7].img}`} className="animal-task-img" alt="" />
          <div className="animal-slots-row">
            {writeGames[7].word.map((_, i) => (
              <div key={i} className={getLetterClass(7, (placedLetters[7] || [])[i], i, writeGames[7].word, showWriteErrors[7])}
                   onClick={() => handleSlotClick(7, i, writeGames[7].word)}>
                {(placedLetters[7] || [])[i]?.letter}
              </div>
            ))}
          </div>
          <div className="animal-letters-pool">
            {writeGames[7].letters.map((letter, i) => {
              const letterData = { id: `7-${i}`, letter };
              if ((usedLetterIds[7] || []).includes(letterData.id)) return null;
              return <div key={letterData.id} className="animal-letter" onClick={() => handleLetterClick(7, letterData, writeGames[7].word)}>{letter}</div>;
            })}
          </div>
        </div>
      ),
      checkAnswer: () => {
        if (!isSpellingComplete(7, writeGames[7].word)) return null;
        const letters = placedLetters[7] || [];
        return letters.map(l => l?.letter).join("") === writeGames[7].word.join("");
      }
    },
    // Шаг 8 - Группировка животных
    {
      banner: "Жаныбарларды бөлүштүр",
      content: (
        <div className="group-game-area">
          <div className="group-zones">
            <div className={`group-zone ${groupError ? "group-error" : ""}`}
                 onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleGroupDrop(e, "domestic")}>
              <div className="zone-header">
                <h3>Үй</h3>
                <img src="/src/assets/animals/home.png" className="zone-img" alt="" />
              </div>
              <div className="group-placed">
                {placedGroups.domestic.map((id) => {
                  const animal = groupAnimals.find(a => a.id === id);
                  return <img key={id} src={`/src/assets/animals/${animal.img}`} className="group-placed-img" alt=""
                              title="Кайтаруу" onClick={() => removeAnimalFromGroup(id, "domestic")} />;
                })}
              </div>
            </div>
            <div className={`group-zone ${groupError ? "group-error" : ""}`}
                 onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleGroupDrop(e, "wild")}>
              <div className="zone-header">
                <h3>Токой</h3>
                <img src="/src/assets/animals/forest.png" className="zone-img" alt="" />
              </div>
              <div className="group-placed">
                {placedGroups.wild.map((id) => {
                  const animal = groupAnimals.find(a => a.id === id);
                  return <img key={id} src={`/src/assets/animals/${animal.img}`} className="group-placed-img" alt=""
                              title="Кайтаруу" onClick={() => removeAnimalFromGroup(id, "wild")} />;
                })}
              </div>
            </div>
          </div>
          <div className="group-animals-pool">
            {groupAnimals.filter(animal => !isAnimalPlaced(animal.id)).map((animal) => (
              <div key={animal.id} className="group-animal-card" draggable onDragStart={(e) => handleAnimalGroupDrag(e, animal.id)}>
                <img src={`/src/assets/animals/${animal.img}`} className="group-animal-img" alt="" />
                <p>{animal.name}</p>
              </div>
            ))}
          </div>
        </div>
      ),
      checkAnswer: () => isGroupingComplete()
    }
  ];

  const handleReset = () => {
    setConnections({});
    setActiveStart(null);
    setWrongDots([]);
    setCorrectDots([]);
    setPlacedLetters({});
    setUsedLetterIds({});
    setShowWriteErrors({});
    setPlacedGroups({ domestic: [], wild: [] });
    setGroupError(false);
  };

  return (
    <ExerciseTemplate
      title="Үй / жапайы жаныбарлар"
      steps={steps}
      totalSteps={9}
      onReset={handleReset}
      containerClass="animals-exercise"
    />
  );
};

export default AnimalsExercise;