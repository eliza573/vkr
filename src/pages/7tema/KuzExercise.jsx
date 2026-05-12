// pages/7tema/KuzExercise.jsx
import React, { useState } from 'react';
import ExerciseTemplate from '../../components/ExerciseTemplate';
import "./KuzExercise.css";

const KuzExercise = () => {
  // Состояния для упражнений
  const [seasonAnswer, setSeasonAnswer] = useState("");
  const [weatherAnswer, setWeatherAnswer] = useState("");
  const [wordLetters, setWordLetters] = useState(["", "", ""]);
  const [syllableGroups, setSyllableGroups] = useState({});
  const [constructedWords, setConstructedWords] = useState([]);
  const [selectedLeaf, setSelectedLeaf] = useState(null);
  const [sentenceOrder, setSentenceOrder] = useState(["", "", "", ""]);
  const [availableWords, setAvailableWords] = useState(["жаан", "Эшикте", "жаап", "жатат"]);
  const [sentenceComplete, setSentenceComplete] = useState(false);

  // Данные
  const seasonOptions = ["кыш", "күз", "жаз"];
  const weatherOptions = ["салкын", "ысык", "суук"];
  const correctScramble = ["к", "ү", "з"];
  
  const syllables = [
    { id: 1, text: "жа", group: "word1" },
    { id: 2, text: "рак", group: "word2" },
    { id: 3, text: "бы", group: "word2" },
    { id: 4, text: "жал", group: "word2" },
    { id: 5, text: "шыл", group: "word1" }
  ];

  const targetWords = [
    { id: "word1", syllables: ["жа", "шыл"], correct: "жашыл" },
    { id: "word2", syllables: ["жал", "бы", "рак"], correct: "жалбырак" },
  ];

  const leaves = [
    { id: 1, color: "green", name: "Жашыл жалбырак", isCorrect: false },
    { id: 2, color: "yellow", name: "Сары жалбырак", isCorrect: true },
    { id: 3, color: "brown", name: "Күрөң жалбырак", isCorrect: false },
    { id: 4, color: "orange", name: "Кызгылт сары жалбырак", isCorrect: false },
  ];

  const correctSentence = ["Эшикте", "жаан", "жаап", "жатат"];

  // Функции для упражнений
  const handleSeasonChange = (val) => setSeasonAnswer(val);
  const handleWeatherChange = (val) => setWeatherAnswer(val);

  const handleLetterClick = (letter) => {
    const nextIdx = wordLetters.indexOf("");
    if (nextIdx !== -1) {
      const newWord = [...wordLetters];
      newWord[nextIdx] = letter;
      setWordLetters(newWord);
    }
  };

  const handleLetterRemove = (index) => {
    if (wordLetters[index]) {
      const newWord = [...wordLetters];
      newWord[index] = "";
      setWordLetters(newWord);
    }
  };

  const handleSyllableClick = (syllable, groupId) => {
    const currentGroup = syllableGroups[groupId] || [];
    if (!currentGroup.includes(syllable.text)) {
      const newGroup = [...currentGroup, syllable.text];
      setSyllableGroups(prev => ({ ...prev, [groupId]: newGroup }));
      
      const targetWord = targetWords.find(w => w.id === groupId);
      if (newGroup.length === targetWord.syllables.length) {
        const constructed = newGroup.join("");
        if (constructed === targetWord.correct) {
          setConstructedWords(prev => [...prev, groupId]);
        }
      }
    }
  };

  const handleLeafClick = (leafId) => {
    if (selectedLeaf === null) setSelectedLeaf(leafId);
  };

  const handleWordClick = (word, index) => {
    if (sentenceOrder[index] === "") {
      const newOrder = [...sentenceOrder];
      newOrder[index] = word;
      setSentenceOrder(newOrder);
      setAvailableWords(availableWords.filter(w => w !== word));
      setSentenceComplete(newOrder.every(slot => slot !== ""));
    }
  };

  const handleSlotRemove = (index) => {
    if (sentenceOrder[index]) {
      const removedWord = sentenceOrder[index];
      const newOrder = [...sentenceOrder];
      newOrder[index] = "";
      setSentenceOrder(newOrder);
      setAvailableWords([...availableWords, removedWord]);
      setSentenceComplete(false);
    }
  };

  // CSS классы
  const getLetterClass = (char, index) => {
    if (!char) return "letter-box";
    return char === correctScramble[index] ? "letter-box correct" : "letter-box wrong";
  };

  const getSeasonBtnClass = (opt) => {
    if (!seasonAnswer) return "season-btn";
    if (seasonAnswer === opt) {
      return opt === "күз" ? "season-btn selected correct" : "season-btn selected wrong";
    }
    return "season-btn disabled";
  };

  const getWeatherBtnClass = (opt) => {
    if (!weatherAnswer) return "weather-btn";
    if (weatherAnswer === opt) {
      return opt === "салкын" ? "weather-btn selected correct" : "weather-btn selected wrong";
    }
    return "weather-btn disabled";
  };

  const getLeafClass = (leaf) => {
    if (selectedLeaf === null) return "leaf-card";
    if (selectedLeaf === leaf.id) {
      return leaf.isCorrect ? "leaf-card selected correct" : "leaf-card selected wrong";
    }
    return "leaf-card disabled";
  };

  // Определение шагов
  const steps = [
    {
      banner: "1. Азыр кайсы мезгил?",
      content: (
        <div className="select-step">
          <div className="word-block">
            <img src="/src/assets/31tema/main_kuz.png" className="task-img-large" alt="autumn" />
            <div className="select-container">
              <p className="question-text">Азыр кайсы мезгил?</p>
              <div className="options-row">
                {seasonOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    className={getSeasonBtnClass(opt)}
                    onClick={() => handleSeasonChange(opt)}
                    disabled={seasonAnswer !== ""}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      checkComplete: () => seasonAnswer === "күз"
    },
    {
      banner: "2. Күзүндө күн кандай болот?",
      content: (
        <div className="select-step">
          <div className="word-block">
            <img src="/src/assets/31tema/main_kuz.png" className="task-img-large" alt="weather" />
            <div className="select-container">
              <p className="question-text">Күзүндө күн кандай болот?</p>
              <div className="options-row">
                {weatherOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    className={getWeatherBtnClass(opt)}
                    onClick={() => handleWeatherChange(opt)}
                    disabled={weatherAnswer !== ""}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      checkComplete: () => weatherAnswer === "салкын"
    },
    {
      banner: "3. Туура жаз",
      content: (
        <div className="words-step">
          <div className="word-block">
            <img src="/src/assets/31tema/weather_compare.png" className="task-img-large" alt="spring" />
            <p className="task-hint">Туура жаз</p>
            <div className="letter-slots">
              {wordLetters.map((l, i) => (
                <div key={i} className={getLetterClass(l, i)} onClick={() => handleLetterRemove(i)}>
                  {l}
                </div>
              ))}
            </div>
            <div className="letters-pool">
              {["к", "ү", "з"].map((l, i) => (
                <button 
                  key={i} 
                  className="letter-btn" 
                  onClick={() => handleLetterClick(l)}
                  disabled={wordLetters.every(letter => letter !== "")}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      checkComplete: () => wordLetters.join("") === "күз"
    },
    {
      banner: "4. Муундардан сөздөрдү түзгүлө",
      content: (
        <div className="syllables-step">
          <div className="syllables-container">
            <div className="syllables-pool">
              <h3>Муундар:</h3>
              <div className="syllables-grid">
                {syllables.map((syllable) => {
                  const isUsed = Object.values(syllableGroups).some(group => group.includes(syllable.text));
                  return (
                    <button
                      key={syllable.id}
                      className={`syllable-card ${isUsed ? "used" : ""}`}
                      onClick={() => {
                        if (!isUsed) {
                          if (syllable.text === "жа" || syllable.text === "шыл") {
                            handleSyllableClick(syllable, "word1");
                          } else {
                            handleSyllableClick(syllable, "word2");
                          }
                        }
                      }}
                      disabled={isUsed}
                    >
                      {syllable.text}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="constructed-words">
              <h3>Түзүлгөн сөздөр:</h3>
              <div className="words-list">
                {targetWords.map((word) => (
                  <div key={word.id} className="word-result">
                    <span className="word-label">{word.id === "word1" ? "1-сөз:" : "2-сөз:"}</span>
                    <span className={`word-value ${constructedWords.includes(word.id) ? "completed" : ""}`}>
                      {constructedWords.includes(word.id) ? word.correct : (syllableGroups[word.id]?.join("") || "___")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      checkComplete: () => constructedWords.length === targetWords.length
    },
    {
      banner: "5. Сары жалбыракты тапкыла",
      content: (
        <div className="leaf-step">
          <div className="leaf-container">
            <p className="leaf-question">Сары жалбыракты тапкыла</p>
            <div className="leaves-grid">
              {leaves.map((leaf) => (
                <div key={leaf.id} className={getLeafClass(leaf)} onClick={() => handleLeafClick(leaf.id)}>
                  <div className={`leaf-icon leaf-${leaf.color}`}>🍂</div>
                  <span className="leaf-name">{leaf.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      checkComplete: () => selectedLeaf === 2
    },
    {
      banner: "6. Сүйлөмдү туура түзгүлө",
      content: (
        <div className="sentence-step">
          <div className="sentence-container">
            <p className="sentence-question">Сүйлөмдү туура түзгүлө</p>
            <div className="sentence-slots">
              {sentenceOrder.map((word, idx) => (
                <div key={idx} className="sentence-slot" onClick={() => handleSlotRemove(idx)}>
                  {word || "___"}
                </div>
              ))}
            </div>
            <div className="words-pool">
              {availableWords.map((word, idx) => (
                <button
                  key={idx}
                  className="word-btn"
                  onClick={() => {
                    const emptyIndex = sentenceOrder.findIndex(slot => slot === "");
                    if (emptyIndex !== -1) handleWordClick(word, emptyIndex);
                  }}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      checkComplete: () => sentenceComplete && sentenceOrder.join(" ") === correctSentence.join(" ")
    }
  ];

  const handleReset = () => {
    setSeasonAnswer("");
    setWeatherAnswer("");
    setWordLetters(["", "", ""]);
    setSyllableGroups({});
    setConstructedWords([]);
    setSelectedLeaf(null);
    setSentenceOrder(["", "", "", ""]);
    setAvailableWords(["жаан", "Эшикте", "жаап", "жатат"]);
    setSentenceComplete(false);
  };

  return (
    <ExerciseTemplate
      title="Күз мезгили / көнүгүү"
      steps={steps}
      onReset={handleReset}
      containerClass="kuz-exercise"
    />
  );
};

export default KuzExercise;