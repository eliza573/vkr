import React from 'react';
import "./Mektep.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RightSidebar from "../../components/RightSidebar";

// Предполагаемые пути к изображениям согласно макету
import schoolMain from "../../assets/4tema/school_main.png"; 

function Mektep() {
  const schoolIntro = [
    { id: "s1", kg: "Бул биздин мектеп", ru: "Это наша школа" },
    { id: "s2", kg: "Биздин мектеп кооз", ru: "Наша школа красивая" },
    { id: "s3", kg: "Биздин мектеп жарык", ru: "Наша школа светлая" },
  ];

  const cards = [
    { id: 1, text: "Бул биздин мугалим эже. Анын аты Айгүл Муратовна", translation: "Это наша учительница. Ее зовут Айгуль Муратовна", img: "teacher_eje.png" },
    { id: 2, text: "Бул биздин мугалим агай. Анын аты Марат Айтиев", translation: "Это наш учитель. Его зовут Марат Айтиев", img: "teacher_agai.png" },
    { id: 3, text: "Бул окуучу бала. Анын аты Азат. Азат мектепке барат", translation: "Это ученик. Его зовут Азат. Азат идет в школу", img: "boy_azat.png" },
    { id: 4, text: "Бул окуучу кыз. Анын аты Айдай. Айдай мектепке барат", translation: "Это ученица. Ее зовут Айдай. Айдай идет в школу", img: "girl_aiday.png" },
    { id: 5, text: "Бул Назик, Ал сабак жазат", translation: "Назик пишет урок", img: "nazik_writing.png" },
    { id: 6, text: "Булар окуучулар. Алар мектепке барышат", translation: "Это ученики. Ученики идут в школу", img: "students_group.png" },
    { id: 7, text: "Окуучулар китеп окушат", translation: "Ученики читают книгу", img: "students_reading.png" },
    { id: 8, text: "Мугалим окутат", translation: "Учитель обучает", img: "teacher_teaching.png" },
  ];

  const wordsForRightMenu = [
    { kg: "менин", ru: "мой, моя, мое" },
    { kg: "мектеп", ru: "школа" },
    { kg: "мугалим", ru: "учитель" },
    { kg: "окуучу", ru: "ученик" },
    { kg: "кооз", ru: "красивый" },
    { kg: "жарык", ru: "светло" },
    { kg: "жазат", ru: "пишет" },
    { kg: "окуйт", ru: "читает" },
    { kg: "барат", ru: "идет" },
  ];

  return (
    <div className="mt-container">
      <Navbar />
      <div className="mt-layout">
        <Sidebar />
        
        <main className="mt-main-content">
          <h1 className="mt-title">Мен мектепке барам</h1>

          {/* Верхний блок с изображением школы */}
          <section className="mt-school-header">
            <div className="mt-image-container">
              <img src={schoolMain} alt="Мектеп" className="mt-school-img" />
            </div>
            <div className="mt-intro-list">
              {schoolIntro.map(item => (
                <div key={item.id} className="mt-intro-bubble">
                  <div className="mt-bubble-text">
                    <p className="mt-kg">{item.kg}</p>
                    <p className="mt-ru">{item.ru}</p>
                  </div>
                  <button className="mt-audio-btn">🔊</button>
                </div>
              ))}
            </div>
          </section>

          {/* Сетка основных карточек */}
          <section className="mt-grid">
            {cards.map((card) => (
              <div key={card.id} className="mt-card">
                <div className="mt-card-media">
                  <img src={`/src/assets/4tema/${card.img}`} alt="урок" />
                </div>
                <div className="mt-card-body">
                  <div className="mt-card-text">
                    <p className="mt-card-kg">{card.text}</p>
                    <p className="mt-card-ru">{card.translation}</p>
                  </div>
                  <button className="mt-audio-btn">🔊</button>
                </div>
              </div>
            ))}
          </section>
        </main>

<RightSidebar 
  words={wordsForRightMenu} 
  exerciseLink="/mektep-exercise" 
/>      </div>
    </div>
  );
}

export default Mektep;