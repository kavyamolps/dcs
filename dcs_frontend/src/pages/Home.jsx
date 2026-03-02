
import React, { useState } from "react";
import "./Home.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { FaHistory } from "react-icons/fa";

function Home() {
  const [item, setItem] = useState("");
  const [numCriteria, setNumCriteria] = useState(0);
  const [numOptions, setNumOptions] = useState(0);

  const [criteria, setCriteria] = useState([]);
  const [options, setOptions] = useState([]);
  const [scores, setScores] = useState({});
  const [decisionDetails,setDecisionDetails]=useState({
    item,
    criteria,
    options,
    scores
  })
  const navigate = useNavigate();
  const location = useLocation();
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
  // Generate Criteria Inputs
  const handleCriteriaChange = (value) => {
    const count = parseInt(value) || 0;
    setNumCriteria(count);

    const newCriteria = Array.from({ length: count }, (_, i) => ({
    id: i,
    name: "",
    weight: "",
    type: "benefit"
  }));

    setCriteria(newCriteria);
  };
  const updateCriterionType = (index, value) => {
    const updated = [...criteria];
    updated[index].type = value;
    setCriteria(updated);
  };


  // Generate Options Inputs
  const handleOptionsChange = (value) => {
    const count = parseInt(value) || 0;
    setNumOptions(count);

    const newOptions = Array.from({ length: count }, (_, i) => ({
      id: i,
      name: ""
    }));

    setOptions(newOptions);
  };

  // Update Criterion Name
  const updateCriterionName = (index, value) => {
    const updated = [...criteria];
    updated[index].name = value;
    setCriteria(updated);
  };

  // Update Criterion Weight
  const updateCriterionWeight = (index, value) => {
  const updated = [...criteria];
  updated[index].weight = value;
  setCriteria(updated);
};

const totalWeight = criteria.reduce(
  (sum, c) => sum + (parseFloat(c.weight) || 0),
  0
);

  // Update Option Name
  const updateOptionName = (index, value) => {
    const updated = [...options];
    updated[index].name = value;
    setOptions(updated);
  };

  // Update Scores
  const updateScore = (optionIndex, criterionIndex, value) => {
    const newScores = { ...scores };

    if (!newScores[optionIndex]) {
      newScores[optionIndex] = {};
    }

    newScores[optionIndex][criterionIndex] = value;
    setScores(newScores);
  };
  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login", { replace: true });
};

  const handleSubmit = async () => {

  if (!item.trim()) {
    alert("Item is required.");
    return;
  }

  if (criteria.length === 0) {
    alert("Please enter number of criteria.");
    return;
  }

  for (let i = 0; i < criteria.length; i++) {
    if (!criteria[i].name.trim()) {
      alert(`Criterion ${i + 1} name is required.`);
      return;
    }
    if (criteria[i].weight === "" || isNaN(criteria[i].weight)) {
      alert(`Weight for Criterion ${i + 1} is required.`);
      return;
    }
  }

  if (totalWeight !== 100) {
    alert("Total weight must equal 100%.");
    return;
  }

  if (options.length === 0) {
    alert("Please enter number of options.");
    return;
  }

  for (let i = 0; i < options.length; i++) {
    if (!options[i].name.trim()) {
      alert(`Option ${i + 1} name is required.`);
      return;
    }
  }

  for (let o = 0; o < options.length; o++) {
    for (let c = 0; c < criteria.length; c++) {
      if (!scores[o] || scores[o][c] === undefined || scores[o][c] === "") {
        alert("All score fields are required!");
        return;
      }
    }
  }

  const data = {
    item,
    criteria,
    options,
    scores
  };

  try {
    const isEditing = location.state?.decision?._id;
    const url = isEditing
    ? `http://localhost:3000/api/update_decision/${location.state.decision._id}`
    : "http://localhost:3000/api/add_decision";

    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}` // if using JWT
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert(isEditing ? "Decision updated successfully!" : "Decision saved successfully!");
      console.log(result);
      navigate("/result", { replace: true })

      // Optional: Reset form after saving
      setItem("");
      setCriteria([]);
      setOptions([]);
      setScores({});
      setNumCriteria(0);
      setNumOptions(0);
    } else {
      alert("Failed to save decision");
      alert("Session expired or invalid access. Please login again to continue.");
      console.error(result);
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Server error");
  }
};
useEffect(() => {
  if (location.state?.decision) {

    const existing = location.state.decision;

    setItem(existing.item);
    setCriteria(existing.criteria);
    setOptions(existing.options);
    setScores(existing.scores);

    setNumCriteria(existing.criteria.length);
    setNumOptions(existing.options.length);
  }
}, [location.state]);

  return (
    <div className="min-h-screen">
      <header className="header">
        <h2 className="logo">Decision Companion System</h2>
        <div className="headersect">
          <button className="history-btn" onClick={handleHistory}>History <FaHistory/></button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="container">
        <h1 className="main-heading">
          Make Smarter Decisions with Confidence
        </h1>

        {/* Item Input */}
        <div className="section">
          <label>Enter Item (What are you deciding?)</label>
          <input
            type="text"
            placeholder="Example: Laptop"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
        </div>

        {/* Number of Criteria */}
        <div className="section">
          <label>Enter Number of Criteria</label>
          <input
            type="number"
            min="0"
            value={numCriteria}
            onChange={(e) => handleCriteriaChange(e.target.value)}
          />
        </div>

        {/* Criteria Inputs */}
        {criteria.map((c, index) => (
  <div key={index} className="section">
    <label>Criterion {index + 1}</label>

    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      
      {/* Criterion Name */}
      <input
        type="text"
        placeholder="Enter criterion name"
        value={c.name}
        onChange={(e) => updateCriterionName(index, e.target.value)}
        style={{ flex: 2 }}
      />

      {/* Weight */}
      <input
        type="number"
        min="0"
        max="100"
        placeholder="Weight (in %)"
        value={c.weight}
        onChange={(e) => updateCriterionWeight(index, e.target.value)}
        style={{ flex: 1 }}
      />

      {/* NEW: Type Dropdown */}
      <select
        value={c.type}
        onChange={(e) => updateCriterionType(index, e.target.value)}
        style={{ flex: 1, padding: "6px" }}
      >
        <option value="benefit">Higher is better</option>
        <option value="cost">Lower is better</option>
      </select>

    </div>
  </div>
))}



        {/* Number of Options */}
        <div className="section">
          <label>Enter Number of Options</label>
          <input
            type="number"
            min="0"
            value={numOptions}
            onChange={(e) => handleOptionsChange(e.target.value)}
          />
        </div>

        {/* Option Inputs */}
        {options.map((o, index) => (
          <div key={index} className="section">
            <label>Enter Name of Option {index + 1}</label>
            <input
              type="text"
              value={o.name}
              onChange={(e) => updateOptionName(index, e.target.value)}
            />
          </div>
        ))}

        {/* Score Matrix */}
        {options.length > 0 && criteria.length > 0 && (
          <div className="score-section">
            <h2>Enter Scores</h2>

            {options.map((option, optionIndex) => (
              <div key={optionIndex} className="option-block">
                <h3 className="option-title">{option.name || `Option ${optionIndex + 1}`}</h3>

                {criteria.map((criterion, criterionIndex) => (
                  <div key={criterionIndex} className="score-input">
                    <label>
                      {criterion.name || `Criterion ${criterionIndex + 1}`}
                    </label>
                    <input
                      type="number"
                      value={scores[optionIndex]?.[criterionIndex] || ""}
                      onChange={(e) =>
                        updateScore(
                          optionIndex,
                          criterionIndex,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
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
    </div>
  );
}

export default Home;