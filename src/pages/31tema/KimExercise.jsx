import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./KimExercise.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Character from "../../components/Character";

const KimExercise = () => {
  const navigate = useNavigate();
  const [characterState, setCharacterState] = useState("idle");
  const [step, setStep] = useState(1);

  // Состояния для упражнений
  const [catAnswers, setCatAnswers] = useState({ kim: [], emne: [] });
  const [word1, setWord1] = useState(["", "", ""]); // КЫЗ
  const [word2, setWord2] = useState(["", "", "", "", ""]); // КИТЕП
  const [selectedKymder, setSelectedKymder] = useState("");
  const [selectedEmneler, setSelectedEmneler] = useState("");
  const [placedAnswers, setPlacedAnswers] = useState({});

  const catItems = [
    { id: 1, img: "book.png", type: "emne" },
    { id: 2, img: "boy.png", type: "kim" },
    { id: 3, img: "pencil.png", type: "emne" },
    { id: 4, img: "teacher.png", type: "kim" },
    { id: 5, img: "girl.png", type: "kim" },
    { id: 6, img: "board_desk.png", type: "emne" },
  ];

  const exercise6Data = [
    { id: 1, img: "girl.png", correct: "Кыз бала" },
    { id: 2, img: "boy.png", correct: "Эркек бала" },
    { id: 3, img: "teacher.png", correct: "Мугалим" },
    { id: 4, img: "students_group.png", correct: "Окуучулар" },
    { id: 5, img: "boys_group.png", correct: "Балдар" },
    { id: 6, img: "girls_group.png", correct: "Кыздар" }
  ];

  const options6 = ["Окуучулар", "Балдар", "Мугалим", "Кыздар", "Эркек бала", "Кыз бала"];

  const triggerCharacter = (state) => {
    setCharacterState(state);
    setTimeout(() => setCharacterState("idle"), 1500);
  };

  const handleCatDrop = (e, targetCat) => {
    e.preventDefault();
    try {
      const item = JSON.parse(e.dataTransfer.getData("item"));
      if (item.type === targetCat) {
        if (!catAnswers[targetCat].find(i => i.id === item.id)) {
          setCatAnswers(prev => ({ ...prev, [targetCat]: [...prev[targetCat], item] }));
          triggerCharacter("success");
        }
      } else {
        triggerCharacter("error");
      }
    } catch (err) { console.error("Drop error", err); }
  };

  const handleLetterClick = (letter) => {
    if (step === 2) {
      const nextIdx = word1.indexOf("");
      if (nextIdx !== -1) {
        const newWord = [...word1];
        newWord[nextIdx] = letter;
        setWord1(newWord);
        if (nextIdx === word1.length - 1) {
          triggerCharacter(newWord.join("") === "КЫЗ" ? "success" : "error");
        }
      }
    } else if (step === 3) {
      const nextIdx = word2.indexOf("");
      if (nextIdx !== -1) {
        const newWord = [...word2];
        newWord[nextIdx] = letter;
        setWord2(newWord);
        if (nextIdx === word2.length - 1) {
          triggerCharacter(newWord.join("") === "КИТЕП" ? "success" : "error");
        }
      }
    }
  };

  const handleSelectChange = (val, correct, setter) => {
    setter(val);
    if (val === correct) triggerCharacter("success");
    else if (val !== "") triggerCharacter("error");
  };

  const handleDragStart = (e, text) => e.dataTransfer.setData("text", text);

  const handleDrop6 = (e, id) => {
    e.preventDefault();
    const droppedText = e.dataTransfer.getData("text");
    const item = exercise6Data.find(d => d.id === id);
    const isCorrect = droppedText === item.correct;
    
    setPlacedAnswers(prev => ({ ...prev, [id]: { text: droppedText, isCorrect } }));
    triggerCharacter(isCorrect ? "success" : "error");
  };

  return (
    <div className="kim-ex-page">
      <Navbar />
      <div className="kim-ex-layout">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <main className="kim-ex-content">
          <h2 className="ex1-title">Ким? Эмне? / көнүгүү</h2>

          <div className="kim-progress-container">
            <div className="kim-progress-fill" style={{ width: `${(step / 6) * 100}%` }}></div>
          </div>

          <div className="ex-header-banner">
            {step === 1 && "Категорияга бөл"}
            {(step === 2 || step === 3) && "Сөздү кура"}
            {(step === 4 || step === 5) && "Туура жоопту танда"}
            {step === 6 && "Сүрөткө карап, тиешелүү сөздү кой"}
          </div>

          <div className="exercise-scroll-container">
            {/* ШАГ 1 */}
            {step === 1 && (
              <div className="step-content">
                <div className="cat-header-row">
                  <div className="cat-label yellow">Ким?</div>
                  <div className="cat-label green">Эмне?</div>
                </div>
                <div className="cat-zones-row">
                  <div className="cat-zone yellow-zone" onDragOver={e => e.preventDefault()} onDrop={e => handleCatDrop(e, 'kim')}>
                    {catAnswers.kim.map(i => <img key={i.id} src={`/src/assets/31tema/${i.img}`} className="mini-img" alt="kim" />)}
                  </div>
                  <div className="cat-zone green-zone" onDragOver={e => e.preventDefault()} onDrop={e => handleCatDrop(e, 'emne')}>
                    {catAnswers.emne.map(i => <img key={i.id} src={`/src/assets/31tema/${i.img}`} className="mini-img" alt="emne" />)}
                  </div>
                </div>
                <div className="cat-options-pool">
                  {catItems.filter(i => !catAnswers.kim.concat(catAnswers.emne).find(a => a.id === i.id)).map(item => (
                    <img 
                      key={item.id} 
                      src={`/src/assets/31tema/${item.img}`} 
                      draggable 
                      onDragStart={e => e.dataTransfer.setData("item", JSON.stringify(item))}
                      className="pool-img"
                      alt="option"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ШАГ 2 (КЫЗ) */}
            {step === 2 && (
              <div className="step-content words-step">
                <div className="word-block">
                  <img src="/src/assets/31tema/girl.png" className="task-img-large" alt="task" />
                  <div className="letter-slots">
                    {word1.map((l, i) => (
                      <div key={i} className="letter-box" onClick={() => {
                        const newW = [...word1]; newW[i] = ""; setWord1(newW);
                      }}>{l}</div>
                    ))}
                  </div>
                  <div className="letters-pool">
                    {["Ы", "К", "З"].map((l, i) => (
                      <button key={i} className="letter-btn" onClick={() => handleLetterClick(l)}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ШАГ 3 (КИТЕП) */}
            {step === 3 && (
              <div className="step-content words-step">
                <div className="word-block">
                  <h3>Бул эмне?</h3>
                  <img src="/src/assets/31tema/book.png" className="task-img-large" alt="task" />
                  <div className="letter-slots">
                    {word2.map((l, i) => (
                      <div key={i} className="letter-box" onClick={() => {
                        const newW = [...word2]; newW[i] = ""; setWord2(newW);
                      }}>{l}</div>
                    ))}
                  </div>
                  <div className="letters-pool">
                    {["К", "Т", "И", "П", "Е"].map((l, i) => (
                      <button key={i} className="letter-btn" onClick={() => handleLetterClick(l)}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ШАГ 4: Выбор "Булар кимдер?" */}
            {step === 4 && (
              <div className="step-content select-step">
                <div className="word-block">
                  <img src="/src/assets/31tema/students_group.png" className="task-img-large" alt="group" />
                  <div className="select-container">
                    <p>Булар кимдер?</p>
                    <div className="sentence-row">
                      <span>Булар </span>
                      <select 
                        value={selectedKymder} 
                        onChange={(e) => handleSelectChange(e.target.value, "Окуучулар", setSelectedKymder)}
                        className={selectedKymder === "Окуучулар" ? "correct-select" : ""}
                      >
                        <option value="">---</option>
                        <option value="Окуучулар">Окуучулар</option>
                        <option value="Балдар">Балдар</option>
                        <option value="Кыздар">Кыздар</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ШАГ 5: Выбор "Булар эмнелер?" */}
            {step === 5 && (
              <div className="step-content select-step">
                <div className="word-block">
                  <img src="/src/assets/31tema/pencils.png" className="task-img-large" alt="pencils" />
                  <div className="select-container">
                    <p>Булар эмнелер?</p>
                    <div className="sentence-row">
                      <span>Булар </span>
                      <select 
                        value={selectedEmneler} 
                        onChange={(e) => handleSelectChange(e.target.value, "Калемдер", setSelectedEmneler)}
                        className={selectedEmneler === "Калемдер" ? "correct-select" : ""}
                      >
                        <option value="">---</option>
                        <option value="Китептер">Китептер</option>
                        <option value="Такталар">Такталар</option>
                        <option value="Калемдер">Калемдер</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ШАГ 6: Сопоставление */}
            {step === 6 && (
              <div className="step-content match-step">
                <div className="kim-ex-grid">
                  {exercise6Data.map((item) => (
                    <div key={item.id} className="kim-ex-card">
                      <img src={`/src/assets/31tema/${item.img}`} alt="task" />
                      <div 
                        className={`kim-drop-zone ${placedAnswers[item.id] ? (placedAnswers[item.id].isCorrect ? 'correct' : 'wrong') : ''}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop6(e, item.id)}
                      >
                        {placedAnswers[item.id]?.text || "Тартып кел..."}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="kim-options-pool">
                  {options6.map((opt, index) => (
                    <div 
                      key={index} 
                      className="kim-drag-item" 
                      draggable 
                      onDragStart={(e) => handleDragStart(e, opt)}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="finish-screen">
                <div className="finish-icon" style={{ fontSize: "60px", textAlign: "center" }}>🏆</div>
                <h2 style={{ textAlign: "center" }}>Азаматсың!</h2>
                <p style={{ textAlign: "center" }}>Бардык көнүгүүлөрдү ийгиликтүү аяктадың!</p>
                <div className="finish-buttons" style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "20px" }}>
                  <button className="btn-retry" onClick={() => setStep(1)}>Кайра аткаруу</button>
                  <button className="btn-home" onClick={() => navigate("/")}>Башкы бет</button>
                </div>
              </div>
            )}
          </div>

          <div className="kim-nav-controls">
            <button className="nav-btn back" onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1}>Артка</button>
            <button className="nav-btn next" onClick={() => step < 7 ? setStep(step + 1) : navigate("/")}
              style={{ display: step === 7 ? 'none' : 'block' }}>
              {step === 6 ? "Аяктоо" : "Кийинки"}
            </button>
          </div>

          <Character state={characterState} />
        </main>
      </div>
    </div>
  );
};

export default KimExercise;