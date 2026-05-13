// pages/7tema/BirdsExercise.jsx
import React, { useState, useRef } from 'react';
import ExerciseTemplate from '../../components/ExerciseTemplate';
import "./AnimalsExercise.css";

const BirdsExercise = () => {
  // Состояния для упражнений
  const [connections, setConnections] = useState({});
  const [activeStart, setActiveStart] = useState(null);
  const [wrongDots, setWrongDots] = useState([]);
  const [correctDots, setCorrectDots] = useState([]);
  const [placedLetters, setPlacedLetters] = useState({});
  const [usedLetterIds, setUsedLetterIds] = useState({});
  const [showWriteErrors, setShowWriteErrors] = useState({});
  const [placedGroups, setPlacedGroups] = useState({
    domestic: [],
    forest: [],
    steppe: [],
    lake: [],
  });
  const [groupError, setGroupError] = useState(false);

  const containerRef = useRef(null);
  const audioRef = useRef(null);

  const playSound = (audioFile) => {
    if (!audioFile) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(`/src/assets/animals/sounds/${audioFile}`);
    audioRef.current = audio;
    audio.play();
  };

  // Данные сопоставлений
  const matchingGames = {
    0: {
      title: "Дал келтиргиле",
      left: [
        { id: "l1", text: "Тоок", img: "chicken.png" },
        { id: "l2", text: "Өрдөк", img: "duck.png" },
        { id: "l3", text: "Каз", img: "goose.png" },
      ],
      right: [
        { id: "r1", text: "Өрдөк балапаны", img: "duckling.png" },
        { id: "r2", text: "Каз балапаны", img: "gosling.png" },
        { id: "r3", text: "Жөжө", img: "chick.png" },
      ],
      correct: { l1: "r3", l2: "r1", l3: "r2" },
    },
    4: {
      title: "Ким кайда жашайт?",
      left: [
        { id: "l1", text: "Индюк", img: "turkey.png" },
        { id: "l2", text: "Бүркүт", img: "berkut.png" },
        { id: "l3", text: "Ак куу", img: "swan.png" },
      ],
      right: [
        { id: "r1", text: "Үй", img: "home.png" },
        { id: "r2", text: "Тоо", img: "mountain.png" },
        { id: "r3", text: "Көл", img: "lake.png" },
      ],
      correct: { l1: "r1", l2: "r2", l3: "r3" },
    },
    7: {
      title: "Ким кандай үн чыгарат?",
      left: [
        { id: "l1", text: "Үкү", img: "sova.png" },
        { id: "l2", text: "Көгүчкөн", img: "golub.png" },
        { id: "l3", text: "Бүркүт", img: "berkut.png" },
      ],
      right: [
        { id: "r1", text: "Гүүлдөйт", img: "sound.png", audio: "golub.mp3" },
        { id: "r2", text: "Шаңшыйт", img: "sound.png", audio: "berkut.mp3" },
        { id: "r3", text: "Уу-уу", img: "sound.png", audio: "sova.mp3" },
      ],
      correct: { l1: "r3", l2: "r1", l3: "r2" },
      soundMode: true,
    },
    8: {
      title: "Ким кандай үн чыгарат?",
      left: [
        { id: "l1", text: "Ак куу", img: "swan.png" },
        { id: "l2", text: "Тоңкулдак", img: "tonkuldak.png" },
        { id: "l3", text: "Турна", img: "turna.png" },
      ],
      right: [
        { id: "r1", text: "Кыйкуулайт", img: "sound.png", audio: "turna.mp3" },
        { id: "r2", text: "Кайкылдайт", img: "sound.png", audio: "swan.mp3" },
        { id: "r3", text: "Тоңкулдайт", img: "sound.png", audio: "tonkuldak.mp3" },
      ],
      correct: { l1: "r2", l2: "r3", l3: "r1" },
      soundMode: true,
    },
  };

  // Данные написания слов
  const writeGames = {
    1: { word: ["Т", "О", "О", "К"], letters: ["О", "К", "Т", "О"], img: "chicken.png" },
    2: { word: ["Ө", "Р", "Д", "Ө", "К"], letters: ["Д", "Ө", "К", "Р", "Ө"], img: "duck.png" },
    3: { word: ["К", "А", "З"], letters: ["З", "К", "А"], img: "goose.png" },
    5: { word: ["Л", "Е", "Й", "Л", "Е", "К"], letters: ["Е", "К", "Й", "Л", "Л", "Е"], img: "stork.png", clickMode: true },
    6: { word: ["Ү", "К", "Ү"], letters: ["Ү", "К", "Ү"], img: "sova.png", clickMode: true },
  };

  // Данные для группировки птиц
  const groupBirds = [
    { id: "chicken", name: "Тоок", img: "chicken.png", group: "domestic" },
    { id: "turkey", name: "Индюк", img: "turkey.png", group: "domestic" },
    { id: "sparrow", name: "Таранчы", img: "taranchy.png", group: "domestic" },
    { id: "eagle", name: "Бүркүт", img: "berkut.png", group: "steppe" },
    { id: "owl", name: "Үкү", img: "sova.png", group: "forest" },
    { id: "crow", name: "Карга", img: "karga.png", group: "forest" },
    { id: "stork", name: "Лейлек", img: "stork.png", group: "lake" },
    { id: "swallow", name: "Чабалекей", img: "chabalekey.png", group: "forest" },
    { id: "falcon", name: "Ителги", img: "itelgi.png", group: "steppe" },
    { id: "duck", name: "Өрдөк", img: "duck.png", group: "lake" },
    { id: "goose", name: "Каз", img: "goose.png", group: "lake" },
    { id: "swan", name: "Ак куу", img: "swan.png", group: "lake" },
    { id: "seagull", name: "Чардак", img: "chardak.png", group: "lake" },
  ];

  const zones = [
    { key: "domestic", title: "Үй", img: "home.png" },
    { key: "forest", title: "Токой", img: "forest.png" },
    { key: "steppe", title: "Тоо", img: "mountain.png" },
    { key: "lake", title: "Көл", img: "lake.png" },
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

  const handleBirdGroupDrag = (e, birdId) => {
    e.dataTransfer.setData("birdId", birdId);
  };

  const handleGroupDrop = (e, groupName) => {
    e.preventDefault();
    const birdId = e.dataTransfer.getData("birdId");
    const bird = groupBirds.find(item => item.id === birdId);
    if (!bird) return;

    if (bird.group === groupName) {
      setPlacedGroups(prev => ({
        ...prev,
        [groupName]: prev[groupName].includes(birdId) ? prev[groupName] : [...prev[groupName], birdId]
      }));
      setGroupError(false);
    } else {
      setGroupError(true);
      setTimeout(() => setGroupError(false), 600);
    }
  };

  const isBirdPlaced = (id) => {
    return Object.values(placedGroups).some(group => group.includes(id));
  };

  const removeBirdFromGroup = (birdId, groupName) => {
    setPlacedGroups(prev => ({
      ...prev,
      [groupName]: prev[groupName].filter(id => id !== birdId)
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
    return groupBirds.every(bird => isBirdPlaced(bird.id));
  };

  // Создание шагов
  const steps = [
    // Шаг 0 - Сопоставление
    {
      banner: matchingGames[0]?.title,
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
              {matchingGames[0].left.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className="animal-bubble">{item.text}</div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img" alt="" />
                  <div className={`animal-dot ${activeStart?.id === item.id ? "active" : ""} ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(0, item.id, "left", e, matchingGames[0])}></div>
                </div>
              ))}
            </div>
            <div className="animals-column">
              {matchingGames[0].right.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className={`animal-dot ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(0, item.id, "right", e, matchingGames[0])}></div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img" alt="" />
                  <div className="animal-bubble">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      checkAnswer: () => isMatchingComplete(0, matchingGames[0])
    },
    // Шаг 1 - Написание "ТООК"
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
    // Шаг 2 - Написание "ӨРДӨК"
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
    // Шаг 3 - Написание "КАЗ"
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
    // Шаг 4 - Сопоставление (где живут)
    {
      banner: matchingGames[4]?.title,
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
              {matchingGames[4].left.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className="animal-bubble">{item.text}</div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img" alt="" />
                  <div className={`animal-dot ${activeStart?.id === item.id ? "active" : ""} ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(4, item.id, "left", e, matchingGames[4])}></div>
                </div>
              ))}
            </div>
            <div className="animals-column">
              {matchingGames[4].right.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className={`animal-dot ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(4, item.id, "right", e, matchingGames[4])}></div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img" alt="" />
                  <div className="animal-bubble">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      checkAnswer: () => isMatchingComplete(4, matchingGames[4])
    },
    // Шаг 5 - Написание "ЛЕЙЛЕК"
    {
      banner: "Туура жаз",
      content: (
        <div className="animals-write-area">
          <img src={`/src/assets/animals/${writeGames[5].img}`} className="animal-task-img" alt="" />
          <div className="animal-slots-row">
            {writeGames[5].word.map((_, i) => (
              <div key={i} className={getLetterClass(5, (placedLetters[5] || [])[i], i, writeGames[5].word, showWriteErrors[5])}
                   onClick={() => handleSlotClick(5, i, writeGames[5].word)}>
                {(placedLetters[5] || [])[i]?.letter}
              </div>
            ))}
          </div>
          <div className="animal-letters-pool">
            {writeGames[5].letters.map((letter, i) => {
              const letterData = { id: `5-${i}`, letter };
              if ((usedLetterIds[5] || []).includes(letterData.id)) return null;
              return <div key={letterData.id} className="animal-letter" onClick={() => handleLetterClick(5, letterData, writeGames[5].word)}>{letter}</div>;
            })}
          </div>
        </div>
      ),
      checkAnswer: () => {
        if (!isSpellingComplete(5, writeGames[5].word)) return null;
        const letters = placedLetters[5] || [];
        return letters.map(l => l?.letter).join("") === writeGames[5].word.join("");
      }
    },
    // Шаг 6 - Написание "ҮКҮ"
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
    // Шаг 7 - Звуки птиц 1
    {
      banner: matchingGames[7]?.title,
      content: (
        <div className="animals-matching-area" ref={containerRef}>
          <svg className="animals-arrows-svg">
            {(connections[7] || []).map((conn, i) => (
              <line key={i} x1={conn.start.x} y1={conn.start.y} x2={conn.end.x} y2={conn.end.y} 
                    stroke={conn.isCorrect ? "#4CAF50" : "#ff4d4d"} strokeWidth="3" />
            ))}
          </svg>
          <div className="animals-matching-grid">
            <div className="animals-column">
              {matchingGames[7].left.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className="animal-bubble">{item.text}</div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img" alt="" />
                  <div className={`animal-dot ${activeStart?.id === item.id ? "active" : ""} ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(7, item.id, "left", e, matchingGames[7])}></div>
                </div>
              ))}
            </div>
            <div className="animals-column">
              {matchingGames[7].right.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className={`animal-dot ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(7, item.id, "right", e, matchingGames[7])}></div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img animal-sound-img" alt="" 
                       onClick={() => playSound(item.audio)} style={{ cursor: "pointer" }} />
                  <div className="animal-bubble">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      checkAnswer: () => isMatchingComplete(7, matchingGames[7])
    },
    // Шаг 8 - Звуки птиц 2
    {
      banner: matchingGames[8]?.title,
      content: (
        <div className="animals-matching-area" ref={containerRef}>
          <svg className="animals-arrows-svg">
            {(connections[8] || []).map((conn, i) => (
              <line key={i} x1={conn.start.x} y1={conn.start.y} x2={conn.end.x} y2={conn.end.y} 
                    stroke={conn.isCorrect ? "#4CAF50" : "#ff4d4d"} strokeWidth="3" />
            ))}
          </svg>
          <div className="animals-matching-grid">
            <div className="animals-column">
              {matchingGames[8].left.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className="animal-bubble">{item.text}</div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img" alt="" />
                  <div className={`animal-dot ${activeStart?.id === item.id ? "active" : ""} ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(8, item.id, "left", e, matchingGames[8])}></div>
                </div>
              ))}
            </div>
            <div className="animals-column">
              {matchingGames[8].right.map(item => (
                <div key={item.id} className="animals-match-row">
                  <div className={`animal-dot ${wrongDots.includes(item.id) ? "wrong-dot" : ""} ${correctDots.includes(item.id) ? "correct-dot" : ""}`}
                       onClick={(e) => handlePointClick(8, item.id, "right", e, matchingGames[8])}></div>
                  <img src={`/src/assets/animals/${item.img}`} className="animal-img animal-sound-img" alt="" 
                       onClick={() => playSound(item.audio)} style={{ cursor: "pointer" }} />
                  <div className="animal-bubble">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      checkAnswer: () => isMatchingComplete(8, matchingGames[8])
    },
    // Шаг 9 - Группировка птиц
    {
      banner: "Канаттууларды бөлүштүр",
      content: (
        <div className="group-game-area">
          <div className="group-zones four-zones">
            {zones.map((zone) => (
              <div key={zone.key} className={`group-zone ${groupError ? "group-error" : ""}`}
                   onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleGroupDrop(e, zone.key)}>
                <div className="zone-header">
                  <h3>{zone.title}</h3>
                  <img src={`/src/assets/animals/${zone.img}`} className="zone-img" alt="" />
                </div>
                <div className="group-placed">
                  {placedGroups[zone.key].map((id) => {
                    const bird = groupBirds.find(b => b.id === id);
                    return <img key={id} src={`/src/assets/animals/${bird.img}`} className="group-placed-img" alt=""
                                title="Кайтаруу" onClick={() => removeBirdFromGroup(id, zone.key)} />;
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="group-animals-pool">
            {groupBirds.filter(bird => !isBirdPlaced(bird.id)).map((bird) => (
              <div key={bird.id} className="group-animal-card" draggable onDragStart={(e) => handleBirdGroupDrag(e, bird.id)}>
                <img src={`/src/assets/animals/${bird.img}`} className="group-animal-img" alt="" />
                <p>{bird.name}</p>
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
    setPlacedGroups({ domestic: [], forest: [], steppe: [], lake: [] });
    setGroupError(false);
  };

  return (
    <ExerciseTemplate
      title="Канаттуулар / көнүгүү"
      steps={steps}
      totalSteps={10}
      onReset={handleReset}
      containerClass="birds-exercise"
    />
  );
};

export default BirdsExercise;