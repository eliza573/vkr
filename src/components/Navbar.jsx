
        
    import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import AuthModal from "./AuthModal";

function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Кыргыз тили
        </Link>
      </div>

      <div className="menu">

        <Link to="/">
          <button>Башкы бет</button>
        </Link>

       
        {user ? (
          <>
            <span className="user-name">👋 {user.name}</span>
            <button onClick={handleLogout}>Чыгуу</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsAuthOpen(true)}>Кируу</button>
            <button onClick={() => setIsAuthOpen(true)}>Катталуу</button>
          </>
        )}

         <Link to="/results">
  <button>📊 Натыйжалар</button>
</Link>
      </div>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />
    </div>
  );
}

export default Navbar;