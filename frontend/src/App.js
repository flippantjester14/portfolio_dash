// frontend/src/App.js
import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Dashboard />
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Portfolio Intelligence Dashboard</p>
      </footer>
    </div>
  );
}

export default App;