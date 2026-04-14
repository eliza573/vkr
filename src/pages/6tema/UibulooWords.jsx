import React, { useState } from 'react';
import "./UibulooWords.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

// 1. Дополнительное приложение: Викторина "Бул ким?"
function FamilyMemberQuiz() {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState({ text: "", color: "" }); // Состояние для сообщения

  const questions = [
    { img: "mother.png", options: ["апа", "эже", "сиңди"], correct: "апа" },
    { img: "brother.png", options: ["ата", "ага", "ини"], correct: "ага" }
  ];

  const handleAnswer = (ans) => {
    if (ans === questions[step].correct) {
      setFeedback({ text: "Азаматсың! ✅", color: "green" });
      
      setTimeout(() => {
        setFeedback({ text: "", color: "" });
        if (step < questions.length - 1) setStep(step + 1);
      }, 1500);
    } else {
      setFeedback({ text: "Кайра аракет кыл! ❌", color: "red" });
    }
  };

  return (
    <div className="mini-app-card">
      <h3>Бул ким? (Кто это?)</h3>
      <div className="quiz-image-placeholder">
        <img src={`/src/assets/6tema/${questions[step].img}`} width="150" alt="family" />
      </div>
      <div className="options-row">
        {questions[step].options.map(opt => (
          <button key={opt} onClick={() => handleAnswer(opt)} className="quiz-chip">{opt}</button>
        ))}
      </div>
      {/* Место для сообщения Азаматсың! */}
      {feedback.text && <p className="feedback-text" style={{ color: feedback.color }}>{feedback.text}</p>}
    </div>
  );
}
// 2. Дополнительное приложение: Конструктор предложений
function SentenceBuilder() {
  const [currentSentence, setCurrentSentence] = useState([]);
  const [feedback, setFeedback] = useState({ text: "", color: "" });
  
  const correctOrder = ["Мен", "үй-бүлөмдү", "жакшы", "көрөм"];
  const scrambled = ["жакшы", "Мен", "көрөм", "үй-бүлөмдү"];

  const addWord = (word) => {
    if (!currentSentence.includes(word)) {
      const newSentence = [...currentSentence, word];
      setCurrentSentence(newSentence);
      
      if (newSentence.length === correctOrder.length) {
        if (JSON.stringify(newSentence) === JSON.stringify(correctOrder)) {
          setFeedback({ text: "Азаматсың! ✅", color: "green" });
        } else {
          setFeedback({ text: "Кайра аракет кыл ❌", color: "red" });
          setTimeout(() => {
            setCurrentSentence([]);
            setFeedback({ text: "", color: "" });
          }, 1500);
        }
      }
    }
  };

  const reset = () => {
    setCurrentSentence([]);
    setFeedback({ text: "", color: "" });
  };

  return (
    <div className="mini-app-card">
      <h3>Сүйлөмдү кура (Составь предложение)</h3>
      <p className="sentence-display">
        {currentSentence.length > 0 ? currentSentence.join(" ") : "...... ...... ...... ......" }
      </p>
      <div className="options-row">
        {scrambled.map(word => (
          <button 
            key={word} 
            onClick={() => addWord(word)} 
            className={`quiz-chip ${currentSentence.includes(word) ? "disabled" : ""}`}
            disabled={currentSentence.includes(word) || feedback.text === "Азаматсың! ✅"}
          >
            {word}
          </button>
        ))}
      </div>
      <button onClick={reset} className="btn-retry-small">Тазалоо (Сброс)</button>
      {/* Место для сообщения Азаматсың! */}
      {feedback.text && <p className="feedback-text" style={{ color: feedback.color }}>{feedback.text}</p>}
    </div>
  );
}

// ОСНОВНОЙ КОМПОНЕНТ
function UibulooWords() {
  const [selectedKg, setSelectedKg] = useState(null);
  const [matchStatus, setMatchStatus] = useState({ text: "", color: "" });
  const [sentence1, setSentence1] = useState("");
  const [msg1, setMsg1] = useState({ text: "", color: "" });

  const familyWords = [
    { kg: "үй-бүлө", ru: "семья" },
    { kg: "апа", ru: "мама" },
    { kg: "ата", ru: "папа" },
    { kg: "чоң ата", ru: "дедушка (со стороны отца)" },
    { kg: "чоң эне", ru: "бабушка (со стороны отца)" },
    { kg: "таята", ru: "дедушка (со стороны матери)" },
    { kg: "таяне", ru: "бабушка (со стороны матери)" },
    { kg: "ага, байке", ru: "старший брат" }
  ];

  const checkMatch = (ruWord) => {
    if (!selectedKg) {
        setMatchStatus({ text: "Алгач кыргызча сөздү тандаңыз!", color: "orange" });
        return;
    }
    
    // Исправлен ключ с "бабалдар" на "балдар" для соответствия кнопкам
    const correctPairs = { 
        "апа": "мама", 
        "балдар": "дети", 
        "ага, байке": "старший брат" 
    };
    
    if (correctPairs[selectedKg] === ruWord) {
      setMatchStatus({ text: "Азаматсың! ✅", color: "green" });
    } else {
      setMatchStatus({ text: "Кайра аракет кыл ❌", color: "red" });
    }
    setTimeout(() => { 
        setSelectedKg(null); 
        setMatchStatus({ text: "", color: "" }); 
    }, 1500);
  };

  return (
    <div className="main-container">
      <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="words-content">
          <h2 className="words-title">Үй-бүлөбүз менен таанышабыз / жаңы сөздөр</h2>

          <div className="dictionary-section">
            <div className="dict-column">
              <h3>Кыргызча</h3>
              {familyWords.map((w, i) => <p key={i}>{w.kg}</p>)}
            </div>
            <div className="dict-column">
              <h3>Орусча</h3>
              {familyWords.map((w, i) => <p key={i}>{w.ru}</p>)}
            </div>
            <div className="dict-column audio-vertical">
              <h3>Аудио</h3>
              <div className="audio-list">
                {familyWords.map((_, i) => <button key={i} className="mini-audio-btn">🔊</button>)}
              </div>
            </div>
          </div>

          <div className="quiz-section">
            <div className="quiz-header">Өзүңдү текшер <br/><span>проверь себя</span></div>
            
            {/* Сопоставление слов */}
            <div className="match-grid">
              <div className="match-column">
                <button onClick={() => setSelectedKg("ага, байке")} className={`quiz-chip ${selectedKg === "ага, байке" ? "selected" : ""}`}>ага, байке</button>
                <button onClick={() => setSelectedKg("балдар")} className={`quiz-chip ${selectedKg === "балдар" ? "selected" : ""}`}>балдар</button>
                <button onClick={() => setSelectedKg("апа")} className={`quiz-chip ${selectedKg === "апа" ? "selected" : ""}`}>апа</button>
              </div>
              <div className="match-column">
                <button onClick={() => checkMatch("дети")} className="quiz-chip">дети</button>
                <button onClick={() => checkMatch("старший брат")} className="quiz-chip">старший брат</button>
                <button onClick={() => checkMatch("мама")} className="quiz-chip">мама</button>
              </div>
            </div>
            {matchStatus.text && <p style={{color: matchStatus.color, textAlign: 'center', fontWeight: 'bold'}}>{matchStatus.text}</p>}

            {/* Заполнение пропуска */}
            <div className="sentence-quiz">
              <p className="ru-hint">Дедушка и бабушка Айдай живут в селе.</p>
              <p className="kg-sentence">Айдайдын <span>{sentence1 || "........."}</span> айылда жашашат.</p>
              <div className="options-row">
                <button onClick={() => {setSentence1("чоң ата, чоң энеси"); setMsg1({text:"Азаматсың!", color:"green"})}} className="quiz-chip">чоң ата, чоң энеси</button>
                <button onClick={() => {setMsg1({text:"Кайра аракет кыл", color:"red"}); setSentence1("")}} className="quiz-chip">ата, апа</button>
              </div>
              <p style={{color: msg1.color, fontWeight: "bold", textAlign: 'center'}}>{msg1.text}</p>
            </div>

            {/* Вызов двух новых приложений */}
            <div className="extra-apps">
                <FamilyMemberQuiz />
                <SentenceBuilder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UibulooWords;