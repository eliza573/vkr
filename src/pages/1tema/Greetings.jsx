import React from 'react';
import "./Greetings.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RightSidebar from "../../components/RightSidebar";

function Greetings() {

const playAudio = (fileName) => {
    if (!fileName) return;
    const audio = new Audio(`/audio/${fileName}`); 
    audio.play().catch(err => console.log("Ошибка воспроизведения:", err));
  };

  const wordsForRightMenu = [
{ kg: "Салам", ru: "Привет", audio: "Salam.mp3" },
    { kg: "Саламатсызбы", ru: "Здравствуйте", audio: "Salamatsyzby.mp3" },
    { kg: "Саламатчылык", ru: "Здоровье (ответ)", audio: "Salamatchylyk.mp3" },
    { kg: "Кандайсың", ru: "Как ты", audio: "Kandaisyn.mp3" },
    { kg: "Балдар", ru: "Дети" },
    { kg: "Мугалим эже", ru: "Учительница" },
    { kg: "Сонун", ru: "Прекрасно" },
    { kg: "Жакшы", ru: "Хорошо" },




  ];
  

  return (
    <div className="greetings-page">
      <Navbar />
      <div className="layout-wrapper">
        <Sidebar />
        
        <main className="center-content">
          <h1 className="page-title">Саламдашуу</h1>

          {/* Ряд 1: Мальчики идут */}
          <div className="dialogue-group">
            <div className="person-box">
              <div className="bubble pos-top">
                <div className="bubble-content">
                  <span className="kg-word">Салам Аскар <span className="audio-icon">🔊</span></span>
                  <span className="ru-word">Привет Аскар</span>
                </div>
              </div>
              <img src="/src/assets/1tema/askar_walk.png" alt="Askar" />
            </div>
            <div className="person-box">
              <div className="bubble pos-top">
                <div className="bubble-content">
                  <span className="kg-word">Салам Жолдош <span className="audio-icon">🔊</span></span>
                  <span className="ru-word">Привет Жолдош</span>
                </div>
              </div>
              <img src="/src/assets/1tema/joldosh_walk.png" alt="Joldosh" />
            </div>
          </div>

          {/* Ряд 2: Рукопожатие и девочки */}
          <div className="dialogue-group">
            <div className="person-box">
              <div className="bubble top-left">
                <div className="bubble-content">
                  <span className="kg-word">Саламатчылык 🔊</span>
                  <span className="ru-word">Здравствуйте (ответ)</span>
                </div>
              </div>
              <div className="bubble bottom-right">
                <div className="bubble-content">
                  <span className="kg-word">Саламатсызбы 🔊</span>
                  <span className="ru-word">Здравствуйте</span>
                </div>
              </div>
              <img src="/src/assets/1tema/handshake.png" alt="Handshake" />
            </div>
            <div className="person-box-small-group">
               <div className="person-box">
                  <div className="bubble pos-top">
                    <div className="bubble-content">
                      <span className="kg-word">Салам Айжан 🔊</span>
                      <span className="ru-word">Привет Айжан</span>
                    </div>
                  </div>
                  <img src="/src/assets/1tema/girl1.png" alt="Girl 1" />
               </div>
               <div className="person-box">
                  <div className="bubble pos-top">
                    <div className="bubble-content">
                      <span className="kg-word">Салам Айдай 🔊</span>
                      <span className="ru-word">Привет Айдай</span>
                    </div>
                  </div>
                  <img src="/src/assets/1tema/girl2.png" alt="Girl 2" />
               </div>
            </div>
          </div>

          {/* Ряд 3: Учитель и дети */}
          <div className="dialogue-group">
            <div className="person-box">
              <div className="bubble teacher-left">
                <div className="bubble-content">
                  <span className="kg-word">Саламатсыңарбы балдар? 🔊</span>
                  <span className="ru-word">Здравствуйте дети?</span>
                </div>
              </div>
              <div className="bubble teacher-right">
                <div className="bubble-content">
                  <span className="kg-word">Саламатсызбы эже? 🔊</span>
                  <span className="ru-word">Здравствуйте учительница?</span>
                </div>
              </div>
              <img src="/src/assets/1tema/teacher.png" className="teacher-img" alt="Teacher" />
            </div>
            <div className="person-box">
              <div className="bubble bektur-left">
                <div className="bubble-content">
                  <span className="kg-word">Кандайсыз? Бектур байке 🔊</span>
                  <span className="ru-word">Как вы? Брат Бектур</span>
                </div>
              </div>
              <div className="bubble bektur-right">
                <div className="bubble-content">
                  <span className="kg-word">Жакшы 🔊</span>
                  <span className="ru-word">Хорошо</span>
                </div>
              </div>
              <img src="/src/assets/1tema/bektur.png" alt="Bektur" />
            </div>
          </div>
        </main>

        <RightSidebar 
  words={wordsForRightMenu} 
  exerciseLink="/salam-exercise" 
  onWordClick={(audioName) => playAudio(audioName)}
/>
      </div>
    </div>
  );
}

export default Greetings;