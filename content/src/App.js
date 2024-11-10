import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // const tiles = [
  //   { top: "110", bottom: "1" },
  //   { top: "1", bottom: "0" },
  //   { top: "0", bottom: "110" },
  // ];

  // const tiles = [
  //   { top: "b", bottom: "ca" },
  //   { top: "a", bottom: "ab" },
  //   { top: "abc", bottom: "c" },
  //   { top: "ca", bottom: "a" }
  // ];
  
  // const tiles = [
  //   { top: "aaaa", bottom: "a" },
  //   { top: "bab", bottom: "babb" },
  //   { top: "aa", bottom: "a" },
  //   { top: "bb", bottom: "bbaa" },
  //   { top: "b", bottom: "bbba" }
  // ]

  const tiles = [
    { top: "ab", bottom: "abab" },
    { top: "b", bottom: "a" },
    { top: "aba", bottom: "b" },
    { top: "aa", bottom: "a" }
  ];

  // const tiles = [
  //   { top: "can", bottom: "ca" },
  //   { top: "ig", bottom: "nige" },
  //   { top: "et", bottom: "t" },
  //   { top: "y", bottom: "your" },
  //   { top: "ournumb", bottom: "n" },
  //   { top: "e", bottom: "um" },
  //   { top: "r", bottom: "ber" },
  // ];

  // const tiles = [
  //   { top: "never", bottom: "every" },
  //   { top: "i", bottom: "in" },
  //   { top: "yodel", bottom: "ode" },
  //   { top: "germany", bottom: "many" },
  //   { top: "in", bottom: "linger" }
  // ];
  

  const [sequence, setSequence] = useState([]);
  const [result, setResult] = useState("");
  const [topString, setTopString] = useState("");
  const [bottomString, setBottomString] = useState("");
  const [isGameOver, setIsGameOver] = useState(false); // Track if the game is over
  // const [tiles, setTiles] = useState([]);

  const alphabet = ['a', 'b', 'c'];
  const length = 3;

  const isPrefixMatch = (str1, str2) => {
    // Ensure str1 is the smaller string for comparison
    const [smaller, larger] = str1.length <= str2.length ? [str1, str2] : [str2, str1];

    // Compare characters of the smaller string with the beginning of the larger string
    return smaller === larger.slice(0, smaller.length);
  };  

  const selectTile = (index) => {
    if (isGameOver) return; // Prevent tile selection if game is over

    const tile = tiles[index];
    const newTopString = topString + tile.top;
    const newBottomString = bottomString + tile.bottom;

    setSequence([...sequence, index]);
    setTopString(newTopString);
    setBottomString(newBottomString);


    // Check for a match or mismatch immediately
    if (newTopString === newBottomString) {
      setResult("Matched!");
      setIsGameOver(true); // End the game on a match
    } else if (isPrefixMatch(newTopString, newBottomString) === false) {
      setResult("Mismatch!");
      setIsGameOver(true);
    } else {
      setResult(""); // Clear result if neither matched nor mismatched
    }
  };

  const clearSequence = () => {
    setSequence([]);
    setResult("");
    setTopString("");
    setBottomString("");
    setIsGameOver(false); // Reset game over status
  };
    
  const undoLastSelection = () => {
    if (sequence.length === 0) return;

    if (isGameOver === true) {
      setIsGameOver(false)
    }

    const lastIndex = sequence[sequence.length - 1];
    const tile = tiles[lastIndex];

    setSequence(sequence.slice(0, -1));
    setTopString(topString.slice(0, -tile.top.length));
    setBottomString(bottomString.slice(0, -tile.bottom.length));
    setResult("");
  };

  useEffect(() => {
    const handleUndo = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        undoLastSelection();
      }
    };

    window.addEventListener('keydown', handleUndo);
    return () => {
      window.removeEventListener('keydown', handleUndo);
    };
  }, [sequence, topString, bottomString, isGameOver]);

  const renderMatchedStrings = () => {
    const maxLength = Math.max(topString.length, bottomString.length);
    const renderedTop = [];
    const renderedBottom = [];

    for (let i = 0; i < maxLength; i++) {
      const topChar = topString[i] || "";
      const bottomChar = bottomString[i] || "";

      if (topChar === bottomChar && topChar !== "") {
        renderedTop.push(<span key={`top-${i}`} className="matched">{topChar}</span>);
        renderedBottom.push(<span key={`bottom-${i}`} className="matched">{bottomChar}</span>);
      } else if (topChar !== bottomChar && topChar !== "" && bottomChar !== "") {
        renderedTop.push(<span key={`top-${i}`} className="mismatched">{topChar}</span>);
        renderedBottom.push(<span key={`bottom-${i}`} className="mismatched">{bottomChar}</span>);
      } else {
        renderedTop.push(<span key={`top-${i}`}>{topChar}</span>);
        renderedBottom.push(<span key={`bottom-${i}`}>{bottomChar}</span>);
      }
    }

    return { renderedTop, renderedBottom };
  };

  
  function getRandomString(alphabet, length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      result += alphabet[randomIndex];
    }
    return result;
  }

  function generateTilesForTarget(target) {
    const tiles = [];
    let top = '';
    let bottom = '';
  
    for (let i = 0; i < target.length; i++) {
      // Randomly decide where to break, ensuring a match eventually.
      const isSplit = Math.random() > 0.5;
  
      top += target[i];
      bottom += target[i];
  
      // Create a tile if we’re at a split or the end
      if (isSplit || i === target.length - 1) {
        tiles.push({ top, bottom });
        top = '';
        bottom = '';
      }
    }
  
    // Shuffle the tiles to add randomness
    return tiles.sort(() => Math.random() - 0.5);
  }

  // const generateNewPuzzle = () => {
  //   const randomString = getRandomString(alphabet, length);
  //   const newTiles = generateTilesForTarget(randomString);
  //   setTiles(newTiles);
  //   localStorage.setItem('tiles', JSON.stringify(newTiles));
  //   clearSequence(); // Reset the game state
  // };

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
            <div>{tile.top}</div>
            <div>{tile.bottom}</div>
          </div>
        ))}
      </div>

      <button onClick={undoLastSelection}>Undo</button>
      <button onClick={clearSequence}>Clear</button>
      {/* <button onClick={generateNewPuzzle}>New Puzzle</button> */}

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
