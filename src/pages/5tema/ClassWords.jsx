import React, { useState } from 'react';
import "./ClassWords.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function ClassWords() {
  const [selectedKg, setSelectedKg] = useState(null);
  const [matchStatus, setMatchStatus] = useState({ text: "", color: "" });
  
  const [sentence1, setSentence1] = useState("");
  const [msg1, setMsg1] = useState({ text: "", color: "" });

  const wordsList = [
    { kg: "окуу", ru: "читать" },
    { kg: "жазуу", ru: "писать" },
    { kg: "саноо", ru: "считать" },
    { kg: "эсептөө", ru: "решать" },
    { kg: "доска", ru: "доска" },
  ];

  // Логика сопоставления слов
  const checkMatch = (ruWord) => {
    if (!selectedKg) {
      setMatchStatus({ text: "Алгач кыргызча сөздү тандаңыз!", color: "orange" });
      return;
    }

    const correctPairs = {
      "окуу": "читать",
      "жазуу": "писать",
      "саноо": "считать"
    };

    if (correctPairs[selectedKg] === ruWord) {
      setMatchStatus({ text: "Азаматсың! ✅", color: "green" });
    } else {
      setMatchStatus({ text: "Дагы аракет кылып көр ❌", color: "red" });
    }

    setTimeout(() => {
      setSelectedKg(null);
      setMatchStatus({ text: "", color: "" });
    }, 2000);
  };

  // Проверка предложения
  const checkSentence = (word) => {
    setSentence1(word);
    if (word === "жазып") {
      setMsg1({ text: "Азаматсың! ✅", color: "green" });
    } else {
      setMsg1({ text: "Дагы аракет кылып көр ❌", color: "red" });
    }
  };

  return (
    <div className="main-container">
      <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="words-content">
          <h2 className="words-title">Бул менин классым / жаңы сөздөр</h2>

          <div className="dictionary-section">
            <div className="dict-column">
              <h3>Кыргызча</h3>
              {wordsList.map((w, i) => <p key={i}>{w.kg}</p>)}
            </div>
            <div className="dict-column">
              <h3>Орусча</h3>
              {wordsList.map((w, i) => <p key={i}>{w.ru}</p>)}
            </div>
            <div className="dict-column audio-vertical">
              <h3>Аудио</h3>
              <div className="audio-list">
                {wordsList.map((_, i) => <button key={i} className="mini-audio-btn">🔊</button>)}
              </div>
            </div>
          </div>

          <div className="quiz-section">
            <div className="quiz-header">Өзүңдү текшер <br/><span>проверь себя</span></div>
            
            <div className="match-grid">
              <div className="match-column">
                <button onClick={() => setSelectedKg("окуу")} className={`quiz-chip ${selectedKg === "окуу" ? "selected" : ""}`}>окуу</button>
                <button onClick={() => setSelectedKg("жазуу")} className={`quiz-chip ${selectedKg === "жазуу" ? "selected" : ""}`}>жазуу</button>
                <button onClick={() => setSelectedKg("саноо")} className={`quiz-chip ${selectedKg === "саноо" ? "selected" : ""}`}>саноо</button>
              </div>
              <div className="match-column">
                <button onClick={() => checkMatch("писать")} className="quiz-chip">писать</button>
                <button onClick={() => checkMatch("читать")} className="quiz-chip">читать</button>
                <button onClick={() => checkMatch("считать")} className="quiz-chip">считать</button>
              </div>
            </div>
            {matchStatus.text && <p className="match-result-text" style={{ color: matchStatus.color }}>{matchStatus.text}</p>}

            <div className="sentence-quiz">
              <p>Мы пишем на доске</p>
              <p className="kg-sentence">Биз доскага <span>{sentence1 || "....."}</span> жатабыз</p>
              <div className="options-row">
                <button onClick={() => checkSentence("окуп")} className="quiz-chip">окуп</button>
                <button onClick={() => checkSentence("жазып")} className="quiz-chip">жазып</button>
                <button onClick={() => checkSentence("санап")} className="quiz-chip">санап</button>
              </div>
              {msg1.text && <p style={{ color: msg1.color, fontWeight: "bold" }}>{msg1.text}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassWords;