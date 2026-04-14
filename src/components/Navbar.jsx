import "./Navbar.css"
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">

      <div className="logo">
        Кыргыз тили
      </div>

      <div className="menu">
        <Link to="/">
          <button>Башкы бет</button>
        </Link>
        <button>Мамлекеттик символдор</button>
        <button>Кыргыз алфавити</button>
      </div>

    </div>
  )
}

export default Navbar