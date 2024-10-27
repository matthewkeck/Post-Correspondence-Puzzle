import React, { useState } from 'react';
import './App.css';

function App() {
  const tiles = [
    { top: "ab", bottom: "abab" },
    { top: "b", bottom: "a" },
    { top: "aba", bottom: "b" },
    { top: "aa", bottom: "a" }
  ];

  const [sequence, setSequence] = useState([]);
  const [result, setResult] = useState("");
  const [topString, setTopString] = useState("");  // Added state for topString
  const [bottomString, setBottomString] = useState(""); // Added state for bottomString

  const selectTile = (index) => {
    const tile = tiles[index];
    setSequence([...sequence, index]);
    setTopString(prev => prev + tile.top);  // Append the top string
    setBottomString(prev => prev + tile.bottom); // Append the bottom string
  };

  const checkSolution = () => {
    const resultText = topString === bottomString ? "Matched!" : "Not a Match!";
    setResult(resultText);
    setSequence([]); // Reset sequence after checking
  };

  const clearSequence = () => {
    setSequence([]); // Clear the sequence
    setResult(""); // Clear the result display
    setTopString(""); // Clear topString
    setBottomString(""); // Clear bottomString
  };

  const renderMatchedStrings = () => {
    const maxLength = Math.max(topString.length, bottomString.length);
    const renderedTop = [];
    const renderedBottom = [];

    for (let i = 0; i < maxLength; i++) {
      const topChar = topString[i] || "";    // Handle undefined characters
      const bottomChar = bottomString[i] || "";

      // Check if characters match
      if (topChar === bottomChar && topChar !== "") {
        renderedTop.push(<span key={`top-${i}`} className="matched">{topChar}</span>);
        renderedBottom.push(<span key={`bottom-${i}`} className="matched">{bottomChar}</span>);
      } else {
        // If characters are different and not empty, highlight in red
        if (topChar !== bottomChar && topChar !== "" && bottomChar !== "") {
          renderedTop.push(<span key={`top-${i}`} className="mismatched">{topChar}</span>);
          renderedBottom.push(<span key={`bottom-${i}`} className="mismatched">{bottomChar}</span>);
        } else {
          // Handle empty characters
          renderedTop.push(<span key={`top-${i}`}>{topChar}</span>);
          renderedBottom.push(<span key={`bottom-${i}`}>{bottomChar}</span>);
        }
      }
    }

    return { renderedTop, renderedBottom };
  };

  const { renderedTop, renderedBottom } = renderMatchedStrings();

  return (
    <div className="game-container">
      <h1>Post Correspondence Problem Game</h1>
      <p>Click tiles in the correct order to match the sequences.</p>
      
      <div className="tiles">
        {tiles.map((tile, index) => (
          <div 
            key={index} 
            className={`tile ${sequence.includes(index) ? 'selected' : ''}`}
            onClick={() => selectTile(index)}
          >
            <div>{tile.top}</div> {/* Display top pip */}
            <div>{tile.bottom}</div> {/* Display bottom pip */}
          </div>
        ))}
      </div>

      <button onClick={checkSolution}>Check Solution</button>
      <button onClick={clearSequence}>Clear</button>

      <div className="results">
        <div className="string-box">
          <p>{renderedTop}</p>
        </div>
        <div className="string-box">
          <p>{renderedBottom}</p>
        </div>
        {result && <p>Result: {result}</p>}
      </div>
    </div>
  );
}

export default App;
