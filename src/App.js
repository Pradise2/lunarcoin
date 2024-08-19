import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Tasks from './Pages/Tasks';
import Squad from './Pages/Squad';
import Farm from './Pages/Farm';
import Earn from './Pages/Earn';
import { TotalBalProvider } from './Context/TotalBalContext'; 

const App = () => {
  return (
    <TotalBalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="/farm" element={<Farm />} />
          <Route path="/earn" element={<Earn />} />
        </Routes>
      </BrowserRouter>
    </TotalBalProvider>
  );
};

export default App;
