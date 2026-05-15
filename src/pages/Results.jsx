import React, { useState, useEffect } from 'react';
import './Results.css';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filterSchool, setFilterSchool] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchResults();
    fetchSchools();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8000/get_results.php';
      const params = new URLSearchParams();
      if (filterSchool) params.append('school', filterSchool);
      if (filterClass) params.append('class', filterClass);
      if (params.toString()) url += '?' + params.toString();
      
      const response = await fetch(url, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
    setLoading(false);
  };

  const fetchSchools = async () => {
    try {
      const response = await fetch('http://localhost:8000/get_schools.php');
      const data = await response.json();
      if (data.success) {
        setSchools(data.schools);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [filterSchool, filterClass]);

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'score-excellent';
    if (percentage >= 60) return 'score-good';
    if (percentage >= 40) return 'score-average';
    return 'score-low';
  };

  if (!user) {
    return (
      <div className="results-container">
        <div className="login-message">
          <h2>🔒 Натыйжаларды көрүү үчүн кириңиз</h2>
          <p>Сураныч, системага кириңиз</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h1>📊 Натыйжалар</h1>
      
      {user.role === 'admin' && (
        <div className="filters">
          <select value={filterSchool} onChange={(e) => setFilterSchool(e.target.value)}>
            <option value="">Бардык мектептер</option>
            {schools.map(school => (
              <option key={school.id} value={school.name}>{school.name}</option>
            ))}
          </select>
          
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">Бардык класстар</option>
            {[1,2,3,4,5,6,7,8,9,10,11].map(c => (
              <option key={c} value={c}>{c}-класс</option>
            ))}
          </select>
          
          <button onClick={fetchResults}>🔍 Издөө</button>
        </div>
      )}
      
      {loading ? (
        <div className="loading">Жүктөө...</div>
      ) : results.length === 0 ? (
        <div className="no-results">
          <p>🎯 Азырынча натыйжалар жок</p>
          <p>Көнүгүүлөрдү аткарып көрүңүз!</p>
        </div>
      ) : (
        <div className="results-table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                {user.role === 'admin' && <th>Окуучу</th>}
                {user.role === 'admin' && <th>Мектеп/Класс</th>}
                <th>Көнүгүү</th>
                <th>Упай</th>
                <th>Пайыз</th>
                <th>Убактысы</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx}>
                  {user.role === 'admin' && (
                    <td>{result.first_name} {result.last_name}</td>
                  )}
                  {user.role === 'admin' && (
                    <td>{result.school} / {result.class}</td>
                  )}
                  <td>{result.exercise_name}</td>
                  <td>{result.score} / {result.total_questions}</td>
                  <td className={getScoreColor(result.percentage)}>
                    {Math.round(result.percentage)}%
                  </td>
                  <td>{new Date(result.completed_at).toLocaleString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Results;