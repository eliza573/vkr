import React, { useState } from 'react';
import "./MektepWords.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function MektepWords() {
  const [selectedKg, setSelectedKg] = useState(null);
  const [matchStatus, setMatchStatus] = useState({ text: "", color: "" });
  
  // Состояния для предложений остаются
  const [sentence1, setSentence1] = useState("");
  const [sentence2, setSentence2] = useState("");

  const wordsList = [
    { kg: "мектеп", ru: "школа" },
    { kg: "эмне", ru: "что" },
    { kg: "ким", ru: "кто" },
    { kg: "балдар", ru: "дети" },
    { kg: "окуучу", ru: "ученик" },
  ];

  // Логика сопоставления
  const checkMatch = (ruWord) => {
    if (!selectedKg) {
      setMatchStatus({ text: "Алгач кыргызча сөздү тандаңыз!", color: "orange" });
      return;
    }

    const correctRu = {
      "сүрөт": "рисунок",
      "тамак": "еда",
      "мектеп": "школа"
    };

    if (correctRu[selectedKg] === ruWord) {
      setMatchStatus({ text: "Азаматсың! ✅", color: "green" });
    } else {
      setMatchStatus({ text: "Дагы аракет кылып көр ❌", color: "red" });
    }
    // Сбрасываем выбор через 2 секунды
    setTimeout(() => {
      setSelectedKg(null);
      setMatchStatus({ text: "", color: "" });
    }, 2000);
  };

// Внутри компонента MektepWords добавьте эти состояния:
const [msg1, setMsg1] = useState({ text: "", color: "" });
const [msg2, setMsg2] = useState({ text: "", color: "" });

// Функция проверки для первого предложения
const checkSentence1 = (word) => {
  setSentence1(word); // Вставляем слово в пропуск
  if (word === "тамак") {
    setMsg1({ text: "Азаматсың! ✅", color: "green" });
  } else {
    setMsg1({ text: "Дагы аракет кылып көр ❌", color: "red" });
  }
};

// Функция проверки для второго предложения
const checkSentence2 = (word) => {
  setSentence2(word); // Вставляем слово в пропуск
  if (word === "мектепке") {
    setMsg2({ text: "Азаматсың! ✅", color: "green" });
  } else {
    setMsg2({ text: "Дагы аракет кылып көр ❌", color: "red" });
  }
};

  return (
    <div className="main-container">
      <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="words-content">
          <h2 className="words-title">Мен мектепке барам / жаңы сөздөр</h2>

          <div className="dictionary-section">
            <div className="dict-column">
              <h3>Кыргызча</h3>
              <p className="sub-lang">по-кыргызски</p>
              {wordsList.map((w, i) => <p key={i}>{w.kg}</p>)}
            </div>
            <div className="dict-column">
              <h3>Орусча</h3>
              <p className="sub-lang">по-русски</p>
              {wordsList.map((w, i) => <p key={i}>{w.ru}</p>)}
            </div>
            {/* Аудио теперь вертикально */}
            <div className="dict-column audio-vertical">
              <h3>Аудио</h3>
              <p className="sub-lang">аудио</p>
              <div className="audio-list">
                {wordsList.map((_, i) => <button key={i} className="mini-audio-btn">🔊</button>)}
              </div>
            </div>
          </div>

          <div className="quiz-section">
            <div className="quiz-header">Өзүңдү текшер <br/><span>проверь себя</span></div>
            
            <div className="match-container">
              <div className="match-grid">
                {/* Левая колонка */}
                <div className="match-column">
                  <button onClick={() => setSelectedKg("сүрөт")} className={`quiz-chip ${selectedKg === "сүрөт" ? "selected" : ""}`}>сүрөт</button>
                  <button onClick={() => setSelectedKg("тамак")} className={`quiz-chip ${selectedKg === "тамак" ? "selected" : ""}`}>тамак</button>
                  <button onClick={() => setSelectedKg("мектеп")} className={`quiz-chip ${selectedKg === "мектеп" ? "selected" : ""}`}>мектеп</button>
                </div>
                {/* Правая колонка */}
                <div className="match-column">
                  <button onClick={() => checkMatch("школа")} className="quiz-chip">школа</button>
                  <button onClick={() => checkMatch("рисунок")} className="quiz-chip">рисунок</button>
                  <button onClick={() => checkMatch("еда")} className="quiz-chip">еда</button>
                </div>
              </div>
              {matchStatus.text && (
                <p className="match-result-text" style={{ color: matchStatus.color }}>
                  {matchStatus.text}
                </p>
              )}
            </div>

            {/* Предложение 1 */}
<div className="sentence-quiz">
  <p>Моя мама готовит еду</p>
  <p className="kg-sentence">Апам <span className={msg1.color}>{sentence1 || "....."}</span> жасайт</p>
  <div className="options-row">
    <button onClick={() => checkSentence1("сүрөт")} className="quiz-chip">сүрөт</button>
    <button onClick={() => checkSentence1("тамак")} className="quiz-chip">тамак</button>
    <button onClick={() => checkSentence1("сабак")} className="quiz-chip">сабак</button>
  </div>
  {msg1.text && <p style={{ color: msg1.color, fontWeight: "bold", marginTop: "5px" }}>{msg1.text}</p>}
</div>

{/* Предложение 2 */}
<div className="sentence-quiz">
  <p>Бакыт и Амина идут в школу.</p>
  <p className="kg-sentence">Бакыт жана Амина <span className={msg2.color}>{sentence2 || "......." }</span> барышат</p>
  <div className="options-row">
    <button onClick={() => checkSentence2("сүрөткө")} className="quiz-chip">сүрөткө</button>
    <button onClick={() => checkSentence2("окууга")} className="quiz-chip">окууга</button>
    <button onClick={() => checkSentence2("мектепке")} className="quiz-chip">мектепке</button>
  </div>
  {msg2.text && <p style={{ color: msg2.color, fontWeight: "bold", marginTop: "5px" }}>{msg2.text}</p>}
</div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default MektepWords;