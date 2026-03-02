import React, { useEffect, useState } from 'react';
import { getLatestDecisionAPI } from '../services/allAPIs';
import { useNavigate } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import './Result.css';

function Result() {

  const [decision, setDecision] = useState(null);
  const [results, setResults] = useState([]);
  const [explanation, setExplanation] = useState([]);

  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const handleHistory = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/get_user_decisions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setHistoryData(data);
        setShowSidebar(true);
      } else {
        alert("Failed to fetch history");
      }
  
    } catch (error) {
      console.error(error);
    }
  };
  const closeSidebar = () => {
    setShowSidebar(false);
  };

  useEffect(() => {
    fetchDecision();
  }, []);

  const fetchDecision = async () => {
    const token = localStorage.getItem("token");

    const response = await getLatestDecisionAPI({
      Authorization: `Bearer ${token}`
    });

    if (response.status === 200) {
      setDecision(response.data);
      calculateResult(response.data);
    }
  };

  const calculateResult = (data) => {

    const { criteria, options, scores } = data;

    const totalWeight = criteria.reduce((sum, c) => sum + parseFloat(c.weight), 0);

    const normalizedWeights = criteria.map(c =>
      parseFloat(c.weight) / totalWeight
    );

    let finalScores = [];

    options.forEach((option, optionIndex) => {

      let totalScore = 0;

      criteria.forEach((criterion, criterionIndex) => {

        const values = options.map((_, i) =>
          parseFloat(scores[i][criterionIndex])
        );

        const min = Math.min(...values);
        const max = Math.max(...values);

        const value = parseFloat(scores[optionIndex][criterionIndex]);

        let normalizedValue = 0;

        if (max === min) {
          normalizedValue = 1;
        } else if (criterion.type === "benefit") {
          normalizedValue = (value - min) / (max - min);
        } else {
          normalizedValue = (max - value) / (max - min);
        }

        totalScore += normalizedValue * normalizedWeights[criterionIndex];
      });

      finalScores.push({
        name: option.name,
        score: totalScore,
        index: optionIndex
      });
    });

    finalScores.sort((a, b) => b.score - a.score);

    setResults(finalScores);

    generateExplanation(finalScores[0], data);
  };

  const generateExplanation = (topOption, data) => {

    const { criteria, options, scores } = data;
    const explanations = [];

    const optionIndex = topOption.index;

    criteria.forEach((criterion, criterionIndex) => {

      const values = options.map((_, i) =>
        parseFloat(scores[i][criterionIndex])
      );

      const max = Math.max(...values);
      const min = Math.min(...values);

      const value = parseFloat(scores[optionIndex][criterionIndex]);
      const weight = parseFloat(criterion.weight);

      // Best performance
      if (
        (criterion.type === "benefit" && value === max) ||
        (criterion.type === "cost" && value === min)
      ) {
        explanations.push(`It had the best ${criterion.name}.`);
      }

      // Above average
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      if (
        (criterion.type === "benefit" && value > avg) ||
        (criterion.type === "cost" && value < avg)
      ) {
        explanations.push(`It performed above average in ${criterion.name}.`);
      }

      // High weight influence
      if (weight >= 40) {
        explanations.push(`High weight on ${criterion.name} favored it.`);
      }
    });

    setExplanation(explanations);
  };
  const handleEdit = () => {
  navigate("/home", { state: { decision } });   // Go back to form (you can later pass data if needed)
};

const handleNewDecision = () => {
  navigate("/home", { state: null, replace: true });
};
const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login", { replace: true });
};

  return (
    <div className="result-container min-h-screen">
      <header className="header">
        <h2 className="logo">Decision Companion System</h2>
        <div className="headersect">
            <button className="history-btn" onClick={handleHistory}>History <FaHistory/></button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <h1 className="result-title mt-4">Decision Results</h1>

      {results.length > 0 ? (
        <>
          <div className="result-cards">
            {results.map((res, index) => (
              <div
                key={index}
                className={`result-card ${index === 0 ? "winner" : ""}`}
              >
                <div className="rank">Rank {index + 1}</div>
                <h2 className="option-name">{res.name}</h2>
                <p className="score">Score: {res.score.toFixed(4)}</p>
              </div>
            ))}
          </div>

          {/* Explanation Section */}
          <div className="explanation-box">
            <h2 id='explaining'>Why did "{results[0].name}" rank highest?</h2>
            <ul>
              {explanation.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p className="loading-text">Calculating results...</p>
      )}
<div className="result-actions">
  <button className="edit-btn" onClick={handleEdit}>
    <MdOutlineEdit />Edit Decision
  </button>

  <button className="new-btn" onClick={handleNewDecision}>
    New Decision
  </button>
</div>
{/* Overlay */}
{showSidebar && <div className="overlay" onClick={closeSidebar}></div>}

{/* Sidebar */}
<div className={`sidebar ${showSidebar ? "active" : ""}`}>
  <div className="sidebar-header">
    <h2 style={{color:"rgba(8, 40, 40)"}}>Decision History</h2>
    <button onClick={closeSidebar}>✖</button>
  </div>

  <div className="sidebar-content">
    {/* <p>No history yet</p> */}
    {historyData.length === 0 ? (
  <p>No history yet</p>
) : (
  historyData.map((decision, index) => (
    <div key={index} className="history-item">
      <h4>{decision.item}</h4>
      <p>Winner: {decision.winner}</p>
      <br />
    </div>
  ))
)}
  </div>
</div>
    </div>
  );
}

export default Result;