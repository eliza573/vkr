import React from 'react';
import "./Taanyshuu.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RightSidebar from "../../components/RightSidebar";

const Taanyshuu = () => {
  const wordsForRightMenu = [
    { kg: "менин", ru: "мой, моя, мое" }, { kg: "сенин", ru: "твой, твоя, твое" },
    { kg: "сиздин", ru: "ваш, ваша, ваше" }, { kg: "анын", ru: "его, ее" },
    { kg: "биздин", ru: "наш, наша, наши" }, { kg: "силердин", ru: "ваши" },
    { kg: "сиздердин", ru: "ваши" }, { kg: "алардын", ru: "их" },
    { kg: "ат", ru: "имя" }, { kg: "атым", ru: "мое имя" },
    { kg: "окуучу", ru: "ученик (ца)" }, { kg: "мугалим", ru: "учитель" },
    { kg: "Ким?", ru: "Кто?" },
   
  ];

  return (
    <div className="kz-page-wrapper">
      <Navbar />
      <div className="kz-content-layout">
        <Sidebar />
        
        <main className="kz-main-area">
          <h1 className="kz-main-title">Таанышуу</h1>
          
          <div className="kz-dialogue-grid">
            
          {/* Ряд 1: Аскар и Девочка */}
<div className="kz-row kz-flex-between">
  
  {/* Левая пара: Текст - Картинка */}
  <div className="kz-side-item">
    <div className="kz-bubble blue">
      Менин атым Аскар 🔊
      <span className="kz-gray-text">Меня зовут Аскар</span>
    </div>
    <img src="/src/assets/3tema/boy_wave.png" alt="Boy" className="kz-img-askar" />
  </div>

  {/* Правая пара: Картинка - Текст */}
  <div className="kz-side-item reverse">
    <img src="/src/assets/3tema/girl_wave.png" alt="Girl" className="kz-img-girl-wave" />
    <div className="kz-bubble blue">
      Сенин атын ким? 🔊
      <span className="kz-gray-text">Как тебя зовут?</span>
    </div>
  </div>

</div>

{/* Ряд 2: Имена (слева) - Картинка (центр) - Вопрос (справа) */}
<div className="kz-row kz-custom-row-layout">
  
  {/* Левая часть: Список имен */}
  <div className="kz-names-side">
    <div className="kz-names-list">
      <p>-Менин атым Аня. 🔊 <span className="kz-gray-text">Меня зовут Аня</span></p>
      <p>-Менин атым Аскар. 🔊 <span className="kz-gray-text">Меня зовут Аскар</span></p>
      <p>-Менин атым Айжан. 🔊 <span className="kz-gray-text">Меня зовут Айжан</span></p>
    </div>
  </div>

  {/* Центральная часть: Картинка */}
  <img src="/src/assets/3tema/kids.png" alt="Kids" className="kz-img-kids-center" />

  {/* Правая часть: Вопрос */}
  <div className="kz-question-side">
    <div className="kz-bubble blue side-bubble">
      -Силердин атыңар ким? 🔊
      <span className="kz-gray-text">Как вас зовут?</span>
    </div>
  </div>

</div>

        {/* Ряд 3: Учитель и фамилии */}
            <div className="kz-row kz-teacher-section">
              <div className="kz-teacher-intro">
                <div className="kz-bubble blue">
                  Менин атым Айгүл Муратовна 🔊
                  <span className="kz-gray-text">Меня зовут Айгуль Муратовна</span>
                </div>
                <img src="/src/assets/3tema/teacher.png" alt="Teacher" className="kz-img-md" />
              </div>
            {/* Блок девочки с фамилией */}
  <div className="kz-horizontal-item">
    <div className="kz-bubbles-stack">
      <div className="kz-bubble yellow">
        Сенин фамилиян ким? 🔊
        <span className="kz-gray-text">Какая твоя фамилия?</span>
      </div>
      <div className="kz-bubble yellow-pale">
        Менин фамилиям Абакирова  🔊
        <span className="kz-gray-text">Моя фамилия Абакирова</span>
      </div>
    </div>
    <img src="/src/assets/3tema/girl.png" alt="Girl" className="kz-img-girl" />
  </div>
            </div>

           {/* Ряд 4: Аскар, Аксакал и Учитель в одну строку */}
<div className="kz-row kz-final-line-container">
  
  {/* Группа: Диалог с Аксакалом */}
  <div className="kz-final-item">
    <div className="kz-bubbles-stack">
      <div className="kz-bubble blue-light">
        -Менин атым Аскар. Сиздин атыңыз ким? 🔊
        <span className="kz-gray-text">Меня зовут Аскар. Как Ваше имя?</span>
      </div>
      <div className="kz-bubble blue-light">
        -Менин атым Асанбай, Таанышканыма кубанычтамын 🔊
        <span className="kz-gray-text">Меня зовут Асанбай, рад знакомству</span>
      </div>
    </div>
    <img src="/src/assets/3tema/aksakal.png" alt="Aksakal" className="kz-img-vsm" />
  </div>

  {/* Группа: Вопрос про учителя и само фото */}
  <div className="kz-final-item">
    <div className="kz-bubble blue-light">
      -Бул ким? <br /> -Бул Айгүл Муратовна 🔊
      <span className="kz-gray-text">Кто это? Это Айгуль Муратовна</span>
    </div>
    <img src="/src/assets/3tema/teacher_stand.png" alt="Teacher" className="kz-img-vsm" />
  </div>
</div>
</div>
              
             
        </main>

<RightSidebar 
  words={wordsForRightMenu} 
  exerciseLink="/tany-exercise" 
/>      </div>
    </div>
  );
};

export default Taanyshuu;