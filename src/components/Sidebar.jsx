import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { topicsData } from "../pages/topicsData";


function Sidebar() {
  const [activeId, setActiveId] = useState(null);
  const location = useLocation();

  // Функция только для открытия/закрытия меню (чтобы не срабатывал переход по ссылке)
  const toggleSubmenu = (e, id) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setActiveId(activeId === id ? null : id);
  };

  const menuData = [
    { id: 1, title: "Саламдашуу", path: "/salam",  exercise: "/salam-exercise" },
    { id: 2, title: "Коштошуу", path: "/koshtoshuu", exercise: "/kosh" },
    { id: 3, title: "Таанышуу", path: "/tanyshuu",  exercise: "/tany-exercise" },
    { id: 31, title: "Ким? эмне?", path: "/kim",  exercise: "/kim-exercise" },
    { id: 4, title: "Мен мектепке барам",   path: "/mektep",     exercise: "/mektep-exercise"
    },
        { id: 41, title: "Окуу куралдары", path: "/okuu", words: "/tanyshuu", exercise: "/okuu-exercise" },

    { id: 5, title: "Бул менин классым", path: "/klass", exercise: "/klass-exercise" },
            { id: 51, title: " Сандар", path: "/san", exercise: "/san_exercise" },
        { id: 6, title: " Үй-бүлө", path: "/uibuloo",  exercise: "/family-exercise" },
        { id: 62, title: " Дене мүчөлөрү", path: "/dene",  exercise: "/dene_exercise" },
        { id: 61, title: " Түстөр", path: "/tuc", exercise: "/tus-exercise" },
        { id: 8, title: " Күз", path: "/kuz",  exercise: "/kuz-exercise" },
        //{ id: 91, title: " Жашылчалар", path: "/jash", words: "/uibuloo-words", exercise: "/jash-exercise" },
       // { id: 10, title: "Жемиштер", path: "/jemish", words: "/uibuloo-words", exercise: "/jemish-exercise" },
//{ id: 9, title: "Жаныбарлар", path: "/animals_aidana", exercise: "/animals_aidana"},
//{ id: 11,  title: "Канаттуулар", path: "/birds", exercise: "/birds"}

  ];

  return (
    <div className="sidebar">
      {menuData.map((item) => (
        <div key={item.id} className="topic-wrapper">
                    <Link to={item.path} className="topic-link-wrapper">
            <div className={`topic ${location.pathname === item.path ? "active-topic" : ""}`}>
              <div className="topic-info">
                <span className="topic-title">{item.title}</span>
              </div>
                            <div 
                className={`arrow-box ${activeId === item.id ? "rotate" : ""}`}
                onClick={(e) => toggleSubmenu(e, item.id)}
              >
                ↓
              </div>
            </div>
          </Link>

          {activeId === item.id && (
            <div className="submenu">
              <Link to={item.exercise} className="submenu-link">
                <div className="submenu-item">Көнүгүү</div>
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;