import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LobbyPage from './components/LobbyPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LobbyPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
