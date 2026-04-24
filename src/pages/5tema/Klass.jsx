import React from 'react';
import "./Klass.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RightSidebar from "../../components/RightSidebar";
import classroomMain from "../../assets/5tema/classroom.png"; 
import sound1 from "../../assets/audio/bul_bizdin_klass.mp3";

const playSound = (audio) => {
  const sound = new Audio(audio);
  sound.play();
};

function Klass() {
  const classIntro = [
    { id: "c1", kg: "Бул биздин класс", ru: "Это наш класс", audio: sound1 },
    { id: "c2", kg: "Биздин класс таза жана жарык", ru: "Наш класс чистый и светлый" },
    { id: "c3", kg: "Биздин класс чоң", ru: "Наш класс большой" },
  ];

  const classItems = [
    { id: 1, kg: "Класста такта жана парталар бар", ru: "В классе есть доска и парты", img: "board_desk.png" },
    { id: 2, kg: "Класста кичинекей отургучтар бар", ru: "В классе есть маленькие стулья", img: "chairs.png" },
    { id: 3, kg: "Класста чоң терезелер бар", ru: "В классе есть большие окна", img: "windows.png" },
    { id: 4, kg: "Класста шкаф жана эшик бар", ru: "В классе есть шкаф и дверь", img: "cupboard_door.png" },
    { id: 5, kg: "Класста кимдер бар? Класста окуучулар бар", ru: "Кто есть в классе? В классе есть ученики", img: "students_in_class.png" },
    { id: 6, kg: "Класста ким бар? Класста мугалим бар", ru: "Кто есть в классе? В классе есть учитель", img: "answering.png" },
  ];

  const wordsForRightMenu = [
    { kg: "класс", ru: "класс" },
    { kg: "таза", ru: "чистый" },
    { kg: "чоң", ru: "большой" },
    { kg: "такта", ru: "доска" },
    { kg: "парта", ru: "парта" },
    { kg: "отургуч", ru: "стул" },
    { kg: "терезе", ru: "окно" },
    { kg: "шкаф", ru: "шкаф" },
    { kg: "эшик", ru: "дверь" },
  ];

  return (
    <div className="kl-container">
      <Navbar />
      <div className="kl-layout">
        <Sidebar />
        
        <main className="kl-main-content">
          <h1 className="kl-title">Бул менин классым</h1>

          {/* Верхний блок с иллюстрацией класса */}
          <section className="kl-header-section">
            <div className="kl-image-main-wrap">
              <img src={classroomMain} alt="Класс" className="kl-main-img" />
            </div>
            <div className="kl-intro-bubbles">
              {classIntro.map(item => (
                <div key={item.id} className="kl-bubble-row">
                  <div className="kl-text-content">
                    <p className="kl-kg">{item.kg}</p>
                    <p className="kl-ru">{item.ru}</p>
                  </div>
<button 
  className="kl-audio-btn"
  onClick={() => playSound(sound1)}
>
  🔊
</button>                </div>
              ))}
            </div>
          </section>

          {/* Сетка предметов и людей в классе */}
          <section className="kl-items-grid">
            {classItems.map((item) => (
              <div key={item.id} className="kl-item-card">
                {/* Условная отрисовка: фото слева или справа как в макете */}
                {item.id <= 4 ? (
                  <>
                    <div className="kl-item-text-box">
                      <div className="kl-text-content">
                        <p className="kl-kg">{item.kg}</p>
                        <p className="kl-ru">{item.ru}</p>
                      </div>
                      <button className="kl-audio-btn">🔊</button>
                    </div>
                    <div className="kl-item-media">
                      <img src={`/src/assets/5tema/${item.img}`} alt="предмет" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="kl-item-media">
                      <img src={`/src/assets/5tema/${item.img}`} alt="люди" />
                    </div>
                    <div className="kl-item-text-box">
                      <div className="kl-text-content">
                        <p className="kl-kg">{item.kg}</p>
                        <p className="kl-ru">{item.ru}</p>
                      </div>
                      <button className="kl-audio-btn">🔊</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </section>
        </main>

<RightSidebar 
  words={wordsForRightMenu} 
  exerciseLink="/klass-exercise" 
/>      </div>
    </div>
  );
}

export default Klass;