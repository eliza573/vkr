import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Mektep from "./pages/4tema/Mektep";
import MektepWords from "./pages/4tema/MektepWords";
import MektepExercise from "./pages/4tema/MektepExercise";
import Klass from "./pages/5tema/Klass";
import KlassExercise from "./pages/5tema/KlassExercise";
import ClassWords from "./pages/5tema/ClassWords";
import UibulooWords from "./pages/6tema/UibulooWords";
import FamilyMain from "./pages/6tema/FamilyMain";
import Greetings from "./pages/1tema/Greetings";
import GreetingsExercise from "./pages/1tema/GreetingsExercise";
import TanyshuuExercise from "./pages/3tema/TanyshuuExercise";
import Taanyshuu from "./pages/3tema/taanyshuu";
import FamilyExercise from "./pages/6tema/FamilyExercise";
import Koshtoshuu from "./pages/2tema/koshtoshuu";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mektep" element={<Mektep />} />
      <Route path="/mektep-words" element={<MektepWords />} />
      <Route path="/mektep-exercise" element={<MektepExercise />} />
      <Route path="/klass" element={<Klass />} />
      <Route path="/klass-exercise" element={<KlassExercise/>}/>
      <Route path="/class-words" element={<ClassWords/>}/>
      <Route path="/uibuloo-words" element={<UibulooWords/>}/>
      <Route path="/uibuloo" element={<FamilyMain/>}/>
      <Route path="/salam" element={<Greetings/>}/>
      <Route path="/salam-exercise" element={<GreetingsExercise/>}/>
      <Route path="/tanyshuu" element={<Taanyshuu/>}/>
      <Route path="/tany-exercise" element={<TanyshuuExercise/>}/>
      <Route path="/family-exercise" element={<FamilyExercise/>}/>
      <Route path="/koshtoshuu" element={<Koshtoshuu/>}/>
      




   </Routes>
  );
}

export default App;