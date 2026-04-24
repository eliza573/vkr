import React from 'react';
import "./Kim.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RightSidebar from "../../components/RightSidebar";

function Kim() {
  const wordsForRightMenu = [
    { kg: "Ким?", ru: "Кто?" },
    { kg: "Эмне?", ru: "Что?" },
    { kg: "Бул", ru: "Это" },
    { kg: "Мектеп", ru: "Школа" },
    { kg: "Окуучу кыз", ru: "Ученица" },
    { kg: "Окуучу бала", ru: "Ученик" },
    { kg: "Мугалим", ru: "Учитель" },
    { kg: "Китеп", ru: "Книга" },
    { kg: "Такта", ru: "Доска" },
  ];

  return (
    <div className="kim-page">
      <Navbar />
      <div className="layout-wrapper">
        <Sidebar />
        
        <main className="kim-content">
          <h1 className="main-title">Ким? Эмне? </h1>

          {/* Секция: Бул ким? */}
          <section className="kim-section">
            <div className="question-header yellow">
              Бул ким? 🔊 
            <div className="trans-ru">Кто это?</div>

            </div>
            
            <div className="items-grid">
              <div className="kim-card">
                <img src="/src/assets/31tema/girl.png" alt="Кыз бала" />
                <div className="caption yellow-cap">
                  Кыз бала. Аты Анара 🔊
                  <div className="trans-ru">Девочка. Зовут Анара</div>
                </div>
              </div>
              <div className="kim-card">
                <img src="/src/assets/31tema/boy.png" alt="Эркек бала" />
                <div className="caption yellow-cap">
                  Эркек бала. Аты Азат 🔊
                  <div className="trans-ru">Мальчик. Зовут Азат</div>
                </div>
              </div>
              <div className="kim-card">
                <img src="/src/assets/31tema/teacher.png" alt="Мугалим" />
                <div className="caption yellow-cap">
                  Мугалим
                  <div className="trans-ru">Учитель</div>
                </div>
              </div>
            </div>
          </section>

          {/* Секция: Булар кимдер? */}
          <section className="kim-section">
            <div className="question-header yellow">
              Булар кимдер? 🔊             
              <div className="trans-ru">Кто они?</div>
            </div>
            <div className="items-grid">
              <div className="kim-card">
                <img src="/src/assets/31tema/boys_group.png" alt="Балдар" />
                <div className="caption yellow-cap">
                  Балдар 🔊
                  <div className="trans-ru">Мальчики / Дети</div>
                </div>
              </div>
              <div className="kim-card">
                <img src="/src/assets/31tema/students_group.png" alt="Окуучулар" />
                <div className="caption yellow-cap">
                  Окуучулар 🔊
                  <div className="trans-ru">Ученики</div>
                </div>
              </div>
              <div className="kim-card">
                <img src="/src/assets/31tema/girls_group.png" alt="Кыздар" />
                <div className="caption yellow-cap">
                  Кыздар 🔊
                  <div className="trans-ru">Девочки</div>
                </div>
              </div>
            </div>
          </section>

          {/* Секция: Бул эмне? */}
          <section className="kim-section">
            <div className="question-header green">
              Бул эмне? 🔊 
            <div className="trans-ru">Что это?</div>

            </div>
            <div className="items-grid">
              <div className="kim-card">
                <img src="/src/assets/31tema/book.png" alt="Китеп" className="img-small" />
                <div className="caption green-cap">
                  Китеп 🔊
                  <div className="trans-ru">Книга</div>
                </div>
              </div>
              <div className="kim-card">
                <img src="/src/assets/31tema/school_main.png" alt="Мектеп" className="img-med" />
                <div className="caption green-cap">
                  Мектеп
                  <div className="trans-ru">Школа</div>
                </div>
              </div>
              <div className="kim-card">
                <img src="/src/assets/31tema/board_desk.png" alt="Такта" className="img-small" />
                <div className="caption green-cap">
                  Такта
                  <div className="trans-ru">Доска</div>
                </div>
              </div>
            </div>
          </section>

          {/* Секция: Булар эмнелер? */}
          <section className="kim-section">
            <div className="question-header green">
              Булар эмнелер? 🔊
                          <div className="trans-ru">Что это? мн.ч.</div>
            </div>
            <div className="items-grid">
              <div className="kim-card">
                <img src="/src/assets/31tema/books.png" alt="Китептер" className="img-small" />
                <div className="caption green-cap">
                  Китептер 🔊
                  <div className="trans-ru">Книги</div>
                </div>
              </div>
              <div className="kim-card">
                <img src="/src/assets/31tema/pencils.png" alt="Калемдер" className="img-small" />
                <div className="caption green-cap">
                  Калемдер 🔊
                  <div className="trans-ru">Карандаши / Ручки</div>
                </div>
              </div>
              <div className="kim-card">
                <img src="/src/assets/31tema/boards.png" alt="Такталар" className="img-small" />
                <div className="caption green-cap">
                  Такталар
                  <div className="trans-ru">Доски</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <RightSidebar words={wordsForRightMenu} exerciseLink="/kim-exercise" />
      </div>
    </div>
  );
}

export default Kim;