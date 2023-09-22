import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import CodeBlockPage from '../CodeBlockPage';
import './LobbyPage.css';

const socket = io(process.env.REACT_APP_SERVER_URL);

function LobbyPage() {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [codeId, setCodeId] = useState("");
  const [activeCodeBlocks, setActiveCodeBlocks] = useState({});
  const [isCodeSelected, setIsCodeSelected] = useState(false);

  useEffect(() => {

    // Initial fetch for all code blocks
    socket.on("fetch_all_code_blocks", (allCodeBlocks) => {
      console.log("fetching all data from server");
      try {
        setCodeBlocks(allCodeBlocks);
      } catch (error) {
        console.error('Error fetching code blocks:', error);
      }
    });

    // Listen for updates about which code blocks are active
    socket.on('codeBlockStatusUpdate', (updatedActiveCodeBlocks) => {
      console.log("[lobbyPage] updatedActiveCodeBlocks:", updatedActiveCodeBlocks)
      setActiveCodeBlocks(updatedActiveCodeBlocks);
    });

    return () => socket.disconnect();
  }, []);

  const handleButtonClick = (blockId) => {
    console.log(`Button clicked for block with ID ${blockId}`);
    setCodeId(blockId);
    setIsCodeSelected(true);
  };
  
  const renderAvailableCodeBlocks = () => {
    return codeBlocks.map((block) => (
      <div key={block.id} className="code-block">
        <h2>{block.title}</h2>
        <button onClick={() => handleButtonClick(block.id)}>Click Me</button>
      </div>
    ));
  };  

  const renderActiveCodeBlocks = () => {
    return codeBlocks.map((block) => {
      if (activeCodeBlocks[block.id]) {
        return (
          <div key={block.id} className="code-block editing">
            <h2>{block.title}</h2>
            <p>In Session</p>
            <button onClick={() => handleButtonClick(block.id)}>Click Me</button>
          </div>
        );
      }
      return null;
    });
  };
  
  const handleBack = () => {
    setIsCodeSelected(false);
  };

  return (
    <div className='LobbyPage'>
      {isCodeSelected ? (
        <div className="lobby-container">
          <h1 class='title'>Chose Code Blocks</h1>
            <div className="code-block-grid">
              {renderAvailableCodeBlocks()}
            </div>
          <h2>Active Code Blocks</h2>
            <div className="code-block-grid">
              {renderActiveCodeBlocks()}
            </div>
        </div>
        ) : (
          <div>
            <CodeBlockPage socket={socket} codeId={codeId} />
              <div className="back-button">
                <button onClick={handleBack}>Back</button>
              </div>
          </div>
      )}
      
    </div>
  );
}

export default LobbyPage;