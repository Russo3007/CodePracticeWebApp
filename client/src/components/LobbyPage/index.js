import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LobbyPage.css';

function LobbyPage() {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/codeblocks');
        const data = await response.json();
        setCodeBlocks(data);
      } catch (error) {
        console.error('Error fetching code blocks:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Choose code block</h1>
      <div className="code-block-grid">
        {codeBlocks.map((block) => (
          <Link key={block.id} to={`/codeblock/${block.id}`} className="code-block">
            <h2>{block.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LobbyPage;
