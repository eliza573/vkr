import React from 'react';
import { Link } from "react-router-dom";
import "./Koshtoshuu.css";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RightSidebar from "../../components/RightSidebar";

import img1 from "../../assets/2tema/bay1.png";
import img2 from "../../assets/2tema/bay2.png";
import img3 from "../../assets/2tema/bay3.png";
import img4 from "../../assets/2tema/bay4.png";

let currentAudio = null;
let currentFile = null;

const playAudio = (fileName) => {
  if (!fileName) return;

  if (currentAudio && currentFile === fileName) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    currentFile = null;
    return;
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audio = new Audio(`/audio/${fileName}`);
  currentAudio = audio;
  currentFile = fileName;

  audio.play().catch(err => console.log("Ошибка:", err));

  audio.onended = () => {
    currentAudio = null;
    currentFile = null;
  };
};

const Koshtoshuu = () => {
  const wordsForRightMenu = [
    { kg: "Жакшы баргыла", ru: "Счастливого пути (мн.ч)", audio: "Jakshybargyla.mp3" },
    { kg: "Жакшы калыңыз", ru: "Всего хорошего", audio: "Kalynyz.mp3" },
    { kg: "Саламатта барыңыз", ru: "До свидания (вежл. идите)", audio: "Salamat.mp3" },
    { kg: "Эже", ru: "Сестра", audio: "Eje.mp3" },
    { kg: "Ата", ru: "Папа", audio: "Ata.mp3" },
    { kg: "Чон ата", ru: "Дедушка", audio: "Chonata.mp3" },
  ];

  // Данные для диалогов с аудио
  const dialogues = [
    {
      id: 1,
      img: img1,
      lines: [
        { kg: "Эже, жакшы калыңыз", ru: "До свидания, сестра.", audio: "Ejejakshykalynyz.mp3" },
        { kg: "Жакшы бар, Айдай", ru: "Счастливого пути, Айдай", audio: "JakshybarAidai.mp3" }
      ],
      bubbleColor: "ks-blue"
    },
    {
      id: 2,
      img: img2,
      lines: [
        { kg: "Ата, жакшы барыңыз", ru: "Счастливого пути, папа.", audio: "Atajakshybarynyz.mp3" },
        { kg: "Жакшы кал, балам", ru: "Всего хорошо, сынок", audio: "Jakshykalbalam.mp3" }
      ],
      bubbleColor: "ks-blue"
    },
    {
      id: 3,
      img: img3,
      lines: [
        { kg: "Саламатта баргыла, балдар", ru: "До свидания, дети.", audio: "Salamattabargyla.mp3" },
        { kg: "Саламатта калыңыз", ru: "До свидания", audio: "Salamatkalynyz.mp3" }
      ],
      bubbleColor: "ks-teal"
    },
    {
      id: 4,
      img: img4,
      lines: [
        { kg: "Саламатта калыңыз, чоң ата", ru: "До свидания, дедушка.", audio: "Salamattakalynyzchonata.mp3" },
        { kg: "Саламатта бар", ru: "Счастливого пути", audio: "Salamatbar.mp3" }
      ],
      bubbleColor: "ks-teal"
    }
  ];

  return (
    <div className="ks-page-wrapper">
      <Navbar />
      <div className="ks-content-layout">
        <Sidebar />

        <main className="ks-main-area">
          <h1 className="ks-main-title">
            Коштошуу
          </h1>

          <div className="ks-dialogue-grid">
            {/* Ряд 1: Эже и Айдай / Ата и балам */}
            <div className="ks-row ks-flex-around">
              <div className="ks-char-item">
                <div className={`ks-bubble ${dialogues[0].bubbleColor}`}>
                  {dialogues[0].lines.map((line, idx) => (
                    <div key={idx} className="ks-line">
                      <div className="ks-line-text">
                        {line.kg}
                        <button 
                          className="ks-audio-btn" 
                          onClick={() => playAudio(line.audio)}
                          aria-label="Аудио"
                        >
                          🔊
                        </button>
                      </div>
                      <span className="ks-gray-text">{line.ru}</span>
                    </div>
                  ))}
                </div>
                <img src={dialogues[0].img} alt="Goodbye 1" className="ks-img-md" />
              </div>

              <div className="ks-char-item">
                <div className={`ks-bubble ${dialogues[1].bubbleColor}`}>
                  {dialogues[1].lines.map((line, idx) => (
                    <div key={idx} className="ks-line">
                      <div className="ks-line-text">
                        {line.kg}
                        <button 
                          className="ks-audio-btn" 
                          onClick={() => playAudio(line.audio)}
                          aria-label="Аудио"
                        >
                          🔊
                        </button>
                      </div>
                      <span className="ks-gray-text">{line.ru}</span>
                    </div>
                  ))}
                </div>
                <img src={dialogues[1].img} alt="Goodbye 2" className="ks-img-md" />
              </div>
            </div>

            {/* Ряд 2: Дети и Дедушка */}
            <div className="ks-row ks-flex-around ks-mt-lg">
              <div className="ks-char-item">
                <div className={`ks-bubble ${dialogues[2].bubbleColor}`}>
                  {dialogues[2].lines.map((line, idx) => (
                    <div key={idx} className="ks-line">
                      <div className="ks-line-text">
                        {line.kg}
                        <button 
                          className="ks-audio-btn" 
                          onClick={() => playAudio(line.audio)}
                          aria-label="Аудио"
                        >
                          🔊
                        </button>
                      </div>
                      <span className="ks-gray-text">{line.ru}</span>
                    </div>
                  ))}
                </div>
                <img src={dialogues[2].img} alt="Goodbye 3" className="ks-img-md" />
              </div>

              <div className="ks-char-item">
                <div className={`ks-bubble ${dialogues[3].bubbleColor}`}>
                  {dialogues[3].lines.map((line, idx) => (
                    <div key={idx} className="ks-line">
                      <div className="ks-line-text">
                        {line.kg}
                        <button 
                          className="ks-audio-btn" 
                          onClick={() => playAudio(line.audio)}
                          aria-label="Аудио"
                        >
                          🔊
                        </button>
                      </div>
                      <span className="ks-gray-text">{line.ru}</span>
                    </div>
                  ))}
                </div>
                <img src={dialogues[3].img} alt="Goodbye 4" className="ks-img-md" />
              </div>
            </div>
          </div>
        </main>

        <RightSidebar 
          words={wordsForRightMenu} 
          exerciseLink="/kosh" 
          onWordClick={(audioName) => playAudio(audioName)}
        />
      </div>
    </div>
  );
};

export default Koshtoshuu;