import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    school: '',
    class: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const endpoint = isLogin ? 'http://localhost:8000/login.php' : 'http://localhost:8000/register.php';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message);
        if (!isLogin) {
          setTimeout(() => {
            setIsLogin(true);
            setFormData({
              first_name: '', last_name: '', school: '', class: '', email: '', password: ''
            });
          }, 1500);
        } else if (isLogin && data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          if (onLoginSuccess) onLoginSuccess(data.user);
          setTimeout(() => onClose(), 500);
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Серверге туташууда ката кетти');
    }
    
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>×</button>
        
        <div className="auth-tabs">
          <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
            Кируу
          </button>
          <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
            Катталуу
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input type="text" name="first_name" placeholder="Аты" value={formData.first_name} onChange={handleChange} required />
              <input type="text" name="last_name" placeholder="Фамилиясы" value={formData.last_name} onChange={handleChange} required />
              <input type="text" name="school" placeholder="Мектеп" value={formData.school} onChange={handleChange} required />
              <input type="text" name="class" placeholder="Класс (1,2,3,4,5,6,7,8,9,10,11)" value={formData.class} onChange={handleChange} required />
            </>
          )}
          
          <input type="email" name="email" placeholder="Электрондук почта" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Сырсөз" value={formData.password} onChange={handleChange} required />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Күтө туруңуз...' : (isLogin ? 'Кируу' : 'Катталуу')}
          </button>
        </form>
        
        {message && <p className={`auth-message ${message.includes('ийгиликтүү') ? 'success' : 'error'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default AuthModal;