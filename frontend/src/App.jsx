import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinContest from './components/JoinContest';
import ContestPage from './components/ContestPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">Shodh AI</h1>
                <span className="ml-2 text-gray-600">Coding Contest</span>
              </div>
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<JoinContest />} />
            <Route path="/contest/:contestId" element={<ContestPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
