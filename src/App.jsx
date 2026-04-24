import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Mektep from "./pages/4tema/Mektep";
import MektepExercise from "./pages/4tema/MektepExercise";
import Klass from "./pages/5tema/Klass";
import KlassExercise from "./pages/5tema/KlassExercise";
import FamilyMain from "./pages/6tema/FamilyMain";
import Greetings from "./pages/1tema/Greetings";
import GreetingsExercise from "./pages/1tema/GreetingsExercise";
import TanyshuuExercise from "./pages/3tema/TanyshuuExercise";
import Taanyshuu from "./pages/3tema/taanyshuu";
import FamilyExercise from "./pages/6tema/FamilyExercise";
import Koshtoshuu from "./pages/2tema/Koshtoshuu";
import Kim from "./pages/31tema/kim";
import KimExercise from "./pages/31tema/KimExercise";
import Oku from "./pages/41tema/Oku";
import OkuExercise from "./pages/41tema/OkuExercise";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mektep" element={<Mektep />} />
      <Route path="/mektep-exercise" element={<MektepExercise />} />
      <Route path="/klass" element={<Klass />} />
      <Route path="/klass-exercise" element={<KlassExercise/>}/>
      <Route path="/uibuloo" element={<FamilyMain/>}/>
      <Route path="/salam" element={<Greetings/>}/>
      <Route path="/salam-exercise" element={<GreetingsExercise/>}/>
      <Route path="/tanyshuu" element={<Taanyshuu/>}/>
      <Route path="/tany-exercise" element={<TanyshuuExercise/>}/>
      <Route path="/family-exercise" element={<FamilyExercise/>}/>
      <Route path="/koshtoshuu" element={<Koshtoshuu/>}/>
      <Route path="/kim" element={<Kim/>}/>
      <Route path="/kim-exercise" element={<KimExercise/>}/>
      <Route path="/okuu" element={<Oku/>}/>
      <Route path="/okuu-exercise" element={<OkuExercise/>}/>
      




   </Routes>
  );
}

export default App;