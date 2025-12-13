import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage.jsx';
import Notes from './pages/Notes.jsx';
import Reminders from './pages/Reminders.jsx';
import Habits from './pages/Habits.jsx';
import './App.css';
import 'normalize.css';
import Header from './components/Header/Header.jsx';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/habits" element={<Habits />} />
      </Routes>
    </Router>

  )
}

export default App
