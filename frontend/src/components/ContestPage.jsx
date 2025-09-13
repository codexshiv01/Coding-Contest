import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { contestAPI } from '../services/api';
import ProblemView from './ProblemView';
import CodeEditor from './CodeEditor';
import Leaderboard from './Leaderboard';
import { Clock, Trophy, User, Code, Target, Zap, ArrowLeft } from 'lucide-react';

function ContestPage() {
  const { contestId } = useParams();
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username') || localStorage.getItem('username');

  const [contest, setContest] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('problems');

  useEffect(() => {
    fetchContest();
  }, [contestId]);

  const fetchContest = async () => {
    try {
      setLoading(true);
      const response = await contestAPI.getContest(contestId);
      setContest(response.data);
      
      // Select first problem by default
      if (response.data.problems && response.data.problems.length > 0) {
        setSelectedProblem(response.data.problems[0]);
      }
    } catch (err) {
      setError('Failed to load contest');
      console.error('Contest fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Contest Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Code className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div className="text-white text-lg font-semibold mb-2">Loading Contest...</div>
          <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 py-8 text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div className="text-red-400 text-lg font-semibold mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-60 -left-20 w-40 h-40 bg-purple-200 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="mb-4 sm:mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 btn-enhanced"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm sm:text-base">Back to Join</span>
        </button>

        {/* Contest Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-glow flex-shrink-0">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  {contest?.name}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg line-clamp-2">{contest?.description}</p>
              </div>
            </div>
            
            <div className="mt-4 lg:mt-0 flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-blue-200">
                <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-blue-900 text-sm sm:text-base truncate max-w-24 sm:max-w-none">{username}</span>
              </div>
              
              <div className="flex items-center bg-gradient-to-r from-orange-50 to-orange-100 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-orange-200">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600 flex-shrink-0" />
                <span className="font-semibold text-orange-900 text-xs sm:text-sm lg:text-base whitespace-nowrap">{formatTimeRemaining(contest?.endTime)}</span>
              </div>
              
              <div className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap ${
                contest?.active 
                  ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200' 
                  : 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200'
              }`}>
                {contest?.active ? '🟢 Active' : '🔴 Inactive'}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 sm:p-2 border border-white/30 shadow-lg inline-flex w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('problems')}
              className={`flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                activeTab === 'problems'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Problems</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'problems' ? (
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Panel - Problems and Code Editor */}
            <div className="space-y-4 sm:space-y-6">
              {/* Problem Selection */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 animate-slide-up">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" />
                  Problems
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {contest?.problems?.map((problem, index) => (
                    <button
                      key={problem.id}
                      onClick={() => setSelectedProblem(problem)}
                      className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.01] ${
                        selectedProblem?.id === problem.id
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
                            selectedProblem?.id === problem.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{problem.title}</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 ml-2">
                          <span className="text-xs sm:text-sm font-bold text-green-600 bg-green-100 px-2 py-1 sm:px-3 rounded-full whitespace-nowrap">
                            {problem.points} pts
                          </span>
                          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Editor */}
              {selectedProblem && (
                <div className="animate-fade-in">
                  <CodeEditor
                    problem={selectedProblem}
                    contestId={contestId}
                    username={username}
                  />
                </div>
              )}
            </div>

            {/* Right Panel - Problem Details */}
            <div className="animate-fade-in">
              {selectedProblem ? (
                <ProblemView problem={selectedProblem} />
              ) : (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Problem</h3>
                  <p className="text-gray-500">Choose a problem from the left panel to start coding</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <Leaderboard contestId={contestId} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestPage;
