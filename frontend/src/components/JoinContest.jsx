import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contestAPI } from '../services/api';
import { ChevronLeft, ChevronRight, Code, Trophy, Users, Clock, Zap, Target, Sparkles, Play, User } from 'lucide-react';

function JoinContest() {
  const [contestId, setContestId] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeContests, setActiveContests] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Sample contest slides for slideshow
  const slides = [
    {
      title: "Master Algorithms",
      description: "Challenge yourself with complex data structures and algorithms. From basic sorting to advanced graph theory.",
      gradient: "from-blue-600 via-blue-700 to-purple-600",
      icon: Code,
      stats: "1000+ Problems",
      features: ["Dynamic Programming", "Graph Algorithms", "Data Structures"]
    },
    {
      title: "Compete Globally", 
      description: "Join thousands of developers in real-time coding competitions. Test your skills against the best.",
      gradient: "from-green-600 via-emerald-600 to-teal-600",
      icon: Trophy,
      stats: "50K+ Participants",
      features: ["Live Contests", "Global Ranking", "Real-time Updates"]
    },
    {
      title: "Build Skills",
      description: "Improve your coding skills with instant feedback, detailed analysis, and personalized learning paths.",
      gradient: "from-orange-600 via-red-600 to-pink-600", 
      icon: Target,
      stats: "Real-time Judging",
      features: ["Instant Feedback", "Code Analysis", "Skill Tracking"]
    }
  ];

  useEffect(() => {
    fetchActiveContests();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchActiveContests = async () => {
    try {
      const response = await contestAPI.getActiveContests();
      setActiveContests(response.data);
    } catch (err) {
      console.error('Failed to fetch active contests:', err);
    }
  };

  const handleJoinContest = async (e) => {
    e.preventDefault();
    
    if (!contestId || !username) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await contestAPI.getContest(contestId);
      localStorage.setItem('username', username);
      navigate(`/contest/${contestId}?username=${encodeURIComponent(username)}`);
    } catch (err) {
      setError('Contest not found or invalid');
    } finally {
      setLoading(false);
    }
  };

  const joinActiveContest = (contest) => {
    if (!username) {
      setError('Please enter your username first');
      return;
    }
    
    localStorage.setItem('username', username);
    navigate(`/contest/${contest.id}?username=${encodeURIComponent(username)}`);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-60 right-40 w-2 h-2 bg-blue-300/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 right-60 w-3 h-3 bg-purple-300/20 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-80 left-20 w-2 h-2 bg-pink-300/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-grid-pattern"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Full-Page Slideshow Hero */}
        <div className="min-h-screen flex flex-col justify-center items-center relative">
          {/* Enhanced Hero Header */}
          <div className="text-center mb-12 animate-fade-in px-6">
            {/* Logo and Brand */}
            <div className="flex flex-col sm:flex-row items-center justify-center mb-8">
              <div className="relative mb-6 sm:mb-0 sm:mr-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center animate-pulse-glow animate-gradient">
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-float-slow" />
                </div>
                {/* Orbital Elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-bounce opacity-80"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
              </div>
              
              <div className="text-center sm:text-left">
                <div className="relative">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight animate-gradient">
                    Shodh AI
                  </h1>
                  {/* Glowing underline */}
                  <div className="absolute -bottom-2 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="mt-4">
                  <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-light mb-2">
                    Next-Gen Coding Platform
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-md mx-auto sm:mx-0 leading-relaxed">
                    🚀 Challenge yourself • 🌍 Compete globally • 🧠 Master algorithms
                  </p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Stats Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6 text-gray-300 mb-8">
              <div className="group flex items-center space-x-3 card-glass px-5 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">50K+</div>
                  <div className="text-xs text-gray-400">Active Coders</div>
                </div>
              </div>
              
              <div className="group flex items-center space-x-3 card-glass px-5 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">Real-time</div>
                  <div className="text-xs text-gray-400">Live Judging</div>
                </div>
              </div>
              
              <div className="group flex items-center space-x-3 card-glass px-5 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">Instant</div>
                  <div className="text-xs text-gray-400">Feedback</div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-gray-300 text-sm mb-2">Ready to start your coding journey?</p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Platform is live!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Slideshow */}
          <div className="w-full max-w-6xl mx-auto mb-16">
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl overflow-hidden">
              {/* Slideshow Content */}
              <div className="relative min-h-[400px] sm:min-h-[500px] lg:h-[600px]">
                {slides.map((slide, index) => {
                  const Icon = slide.icon;
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentSlide 
                          ? 'opacity-100 transform translate-x-0' 
                          : 'opacity-0 transform translate-x-full'
                      }`}
                    >
                      <div className={`bg-gradient-to-br ${slide.gradient} p-8 sm:p-12 lg:p-16 rounded-3xl text-white h-full flex flex-col justify-center relative overflow-hidden`}>
                        {/* Enhanced Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-8 right-8 w-32 h-32 sm:w-48 sm:h-48 border-2 border-white rounded-full"></div>
                          <div className="absolute bottom-8 left-8 w-24 h-24 sm:w-36 sm:h-36 border-2 border-white rounded-full"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 border border-white/20 rounded-full"></div>
                        </div>
                        
                        <div className="relative z-10 text-center max-w-4xl mx-auto">
                          <div className="flex items-center justify-center mb-8">
                            <Icon className="w-20 h-20 sm:w-32 sm:h-32 drop-shadow-2xl animate-float" />
                          </div>
                          
                          <div className="mb-6">
                            <span className="inline-block bg-white/20 px-6 py-3 rounded-full font-bold text-lg sm:text-xl backdrop-blur-sm mb-6">
                              {slide.stats}
                            </span>
                          </div>
                          
                          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            {slide.title}
                          </h2>
                          
                          <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
                            {slide.description}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                            {slide.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center justify-center space-x-3 bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-sm">
                                <div className="w-3 h-3 bg-white rounded-full flex-shrink-0"></div>
                                <span className="text-sm sm:text-base font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Enhanced Slideshow Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 bg-black/20 px-6 py-3 rounded-full backdrop-blur-sm">
                <button 
                  onClick={prevSlide}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 text-white hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex space-x-3">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-white scale-125' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                <button 
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 text-white hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 flex items-center justify-center py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              {/* Form Header */}
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Start Your Journey
                </h2>
                <p className="text-xl text-gray-600 max-w-md mx-auto">
                  Join thousands of developers in the ultimate coding challenge
                </p>
              </div>

              {/* Enhanced Join Form */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/30 animate-slide-up">
                <div className="text-center mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Ready to Compete?</h3>
                  <p className="text-gray-600 text-lg">Enter your details and dive into the challenge</p>
                </div>

                <form onSubmit={handleJoinContest} className="space-y-8">
                  {/* Username Field */}
                  <div className="relative">
                    <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      Username
                    </label>
                    <div className="relative">
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white text-lg placeholder-gray-400 shadow-sm hover:shadow-md"
                        placeholder="Enter your username"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Contest ID Field */}
                  <div className="relative">
                    <label htmlFor="contestId" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <Trophy className="w-4 h-4 mr-2 text-purple-600" />
                      Contest ID
                    </label>
                    <div className="relative">
                      <input
                        id="contestId"
                        type="number"
                        value={contestId}
                        onChange={(e) => setContestId(e.target.value)}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white text-lg placeholder-gray-400 shadow-sm hover:shadow-md"
                        placeholder="Enter contest ID (e.g., 1)"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-sm text-gray-400 font-medium">Try: 1</span>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 animate-fade-in">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">!</span>
                        </div>
                        <div>
                          <p className="text-red-700 font-semibold">Oops! Something went wrong</p>
                          <p className="text-red-600 text-sm">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl focus:ring-4 focus:ring-blue-500/30 focus:ring-offset-2 disabled:hover:scale-100 text-xl animate-gradient"
                  >
                    <span className="flex items-center justify-center space-x-3">
                      {loading ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Joining Contest...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-6 h-6" />
                          <span>Join Contest Now</span>
                          <Zap className="w-6 h-6" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Enhanced Quick Start Tips */}
                <div className="mt-10 p-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl border-2 border-blue-200 shadow-lg">
                  <h3 className="font-bold text-blue-900 mb-6 flex items-center text-xl">
                    <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    Quick Start Guide
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Enter Contest ID</h4>
                      <p className="text-sm text-gray-600">Try: <span className="font-mono bg-white px-3 py-1 rounded-xl font-bold text-blue-600 shadow-sm">1</span></p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Choose Username</h4>
                      <p className="text-sm text-gray-600">Any name you like!</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Start Coding</h4>
                      <p className="text-sm text-gray-600">3 problems await you!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Contests Preview */}
              {activeContests.length > 0 && (
                <div className="mt-8 bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/30">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-xl flex items-center justify-center mr-3">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    Live Contests
                  </h3>
                  <div className="space-y-4">
                    {activeContests.slice(0, 2).map((contest) => (
                      <div key={contest.id} className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-2 border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{contest.name}</h4>
                            <p className="text-gray-600 mt-1">{contest.description}</p>
                          </div>
                          <button
                            onClick={() => joinActiveContest(contest)}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
                            disabled={!username}
                          >
                            Join Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinContest;