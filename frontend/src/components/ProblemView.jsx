import React from 'react';
import { Clock, HardDrive, Trophy, Target, CheckCircle } from 'lucide-react';

function ProblemView({ problem }) {
  if (!problem) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Problem</h3>
        <p className="text-gray-500">Choose a problem from the left panel to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 animate-slide-up">
      {/* Problem Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {problem.title}
          </h2>
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center animate-bounce">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
            🏆 {problem.points} points
          </div>
          <div className={`px-4 py-2 rounded-xl font-bold shadow-lg ${
            problem.difficulty === 'EASY' ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' :
            problem.difficulty === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
            'bg-gradient-to-r from-red-500 to-pink-600 text-white'
          }`}>
            {problem.difficulty === 'EASY' ? '🟢' : problem.difficulty === 'MEDIUM' ? '🟡' : '🔴'} {problem.difficulty}
          </div>
        </div>

        {/* Problem Constraints */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Time Limit</p>
                <p className="text-lg font-bold text-blue-900">{problem.timeLimitSeconds}s</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600 font-medium">Memory Limit</p>
                <p className="text-lg font-bold text-purple-900">{problem.memoryLimitMb}MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Description */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Target className="w-6 h-6 mr-2 text-green-600" />
          Problem Statement
        </h3>
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
            {problem.description}
          </div>
        </div>
      </div>

      {/* Sample Test Cases */}
      {problem.testCases && problem.testCases.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-blue-600" />
            Sample Test Cases
          </h3>
          <div className="space-y-4">
            {problem.testCases
              .filter(testCase => testCase.isSample)
              .map((testCase, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-3 border-b border-green-200">
                    <h4 className="font-bold text-green-800 flex items-center">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
                        {index + 1}
                      </div>
                      Sample Test Case {index + 1}
                    </h4>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Input:
                      </h5>
                      <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono border overflow-x-auto">
                        {testCase.input}
                      </pre>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Expected Output:
                      </h5>
                      <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono border overflow-x-auto">
                        {testCase.expectedOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
        <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center">
          💡 Tips
        </h3>
        <ul className="text-yellow-800 space-y-2 text-sm">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Read the problem statement carefully and understand the constraints
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Test your solution with the sample cases before submitting
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Consider edge cases and optimize for the given time/memory limits
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ProblemView;