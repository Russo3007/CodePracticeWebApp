import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import './CodeBlockPage.css';
import 'socket.io-client';

function CodeBlockPage({socket, selectedCodeBlock}) {
  const [codeBlock, setCodeBlock] = useState(null);
  const [isMentor, setIsMentor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [codeId, setCodeId] = useState("")

  useEffect(() => {
    console.log(`user-${socket.id} has entered code block: ${selectedCodeBlock.title}`);
    if (socket) {
      console.log('before joinSession: ', selectedCodeBlock.id);
      socket.emit('joinSession', selectedCodeBlock.id);
      setCodeId(selectedCodeBlock.id);
    }
  }, []);

  useEffect(() => {
    setIsMentor(window.localStorage.getItem('isMentor') === 'true');
    window.localStorage.setItem('isMentor', 'false');
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('roleAssignment', (role) => {
      if (role === 'mentor') {
        setIsMentor(true);
      }
      console.log(`user '${socket.id}' role in session is "${role}".`);
    });

    socket.on('codeUpdate', (newCodeBlock) => {
      console.log(`[codeBlockPage] listening to codeUpdate event - of sessionId ${codeId} with NewCode: ${newCodeBlock.code}`);
      setCodeBlock(newCodeBlock);
    });
  }, [socket]);

  const handleCodeChange = (value) => {
    if ((!isMentor) && socket) {
      console.log(`[socket]: updated server that code '${selectedCodeBlock.title}' changed.`);
      socket.emit('codeChange', { codeId, code: value });
    }
  };

  useEffect(() => {
    const fetchCodeBlockData = async () => {
      try {
        setCodeBlock(selectedCodeBlock);
        setLoading(false);
        console.log(`fetched code block '${selectedCodeBlock.title}'`)
      } catch (error) {
        console.error('Error fetching code blocks:', error);
        setLoading(false);
      }
    };

    fetchCodeBlockData();
  }, [codeId]);

  return (
    <div className="code-block-page">
      {isMentor && <div className="mentor-banner">You are viewing in read-only mode</div>}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : codeBlock ? (
        <div className="code-editor-container">
          <h1>{codeBlock.title}</h1>
          <CodeMirror
            value={codeBlock.code}
            options={{
              lineNumbers: true,
              readOnly: isMentor,
              mode: 'javascript',
            }}
            onChange={(value) => { handleCodeChange(value) }}
          />
        </div>
      ) : (
        <div className="code-block-not-found">
          <h1>Code Block Not Found</h1>
          <p>The requested code block was not found.</p>
        </div>
      )}
    </div>
  );

}

export default CodeBlockPage;