import "./Home.css"
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"

import gerb from "../assets/gerb.png"
import book from "../assets/book.png"
import school_bildung from "../assets/school_bildung.png"
import classs from "../assets/class.png"
import family from "../assets/all_family.png"



function Home(){

return(

<div>

<Navbar/>

<div className="layout">

<Sidebar/>

<div className="content">

<h1>Кош келиниз </h1>

<div className="images">

<img src={gerb}/>
</div>

{/* темы */}

<div className="topics">

<Link to="/salam">
  <div className="topicCard">
    <img src={book} />
    <p>Саламдашабыз</p>
  </div>
</Link>

<Link to="/koshtoshuu">
<div className="topicCard">
<img src={book}/>
<p>Коштошобуз</p>
</div>
</Link>


<Link to="/tanyshuu">
<div className="topicCard">
<img src={book}/>
<p>Таанышабыз</p>
</div>
</Link>

  <Link to="/kim" >
    <div className="topicCard">
      <img src={school_bildung}  />
      <p>Ким? Эмне?</p>
    </div>
  </Link>

  <Link to="/mektep" >
    <div className="topicCard">
      <img src={school_bildung}  />
      <p>Мектепке барам</p>
    </div>
  </Link>

  <Link to="/okuu" >
    <div className="topicCard">
      <img src={school_bildung}  />
      <p>Окуу куралдары</p>
    </div>
  </Link>

  <Link to="/klass" >
    <div className="topicCard">
      <img src={classs} />
      <p>Менин классым</p>
    </div>
  </Link>

  <Link to="/uibuloo" >
    <div className="topicCard">
      <img src={family}  />
      <p>үй бүлөө</p>
    </div>
  </Link>

</div>

</div>

</div>

</div>

)

}

export default Home