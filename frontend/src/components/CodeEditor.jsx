import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { submissionAPI } from '../services/api';
import { Play, Clock, CheckCircle, XCircle, AlertCircle, Code, Send, Zap } from 'lucide-react';

const languageTemplates = {
  java: `public class Solution {
    public static void main(String[] args) {
        // ### CHANGE THIS ### - Implement your solution here
        
    }
}`,
  python: `# ### CHANGE THIS ### - Implement your solution here

`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // ### CHANGE THIS ### - Implement your solution here
    
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    // ### CHANGE THIS ### - Implement your solution here
    
    return 0;
}`
};

const statusIcons = {
  PENDING: <Clock className="w-4 h-4 text-yellow-500" />,
  RUNNING: <Clock className="w-4 h-4 text-blue-500 animate-spin" />,
  ACCEPTED: <CheckCircle className="w-4 h-4 text-green-500" />,
  WRONG_ANSWER: <XCircle className="w-4 h-4 text-red-500" />,
  TIME_LIMIT_EXCEEDED: <AlertCircle className="w-4 h-4 text-orange-500" />,
  MEMORY_LIMIT_EXCEEDED: <AlertCircle className="w-4 h-4 text-orange-500" />,
  RUNTIME_ERROR: <XCircle className="w-4 h-4 text-red-500" />,
  COMPILATION_ERROR: <XCircle className="w-4 h-4 text-red-500" />
};

const statusColors = {
  PENDING: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  RUNNING: 'text-blue-600 bg-blue-50 border-blue-200',
  ACCEPTED: 'text-green-600 bg-green-50 border-green-200',
  WRONG_ANSWER: 'text-red-600 bg-red-50 border-red-200',
  TIME_LIMIT_EXCEEDED: 'text-orange-600 bg-orange-50 border-orange-200',
  MEMORY_LIMIT_EXCEEDED: 'text-orange-600 bg-orange-50 border-orange-200',
  RUNTIME_ERROR: 'text-red-600 bg-red-50 border-red-200',
  COMPILATION_ERROR: 'text-red-600 bg-red-50 border-red-200'
};

function CodeEditor({ problem, contestId, username }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  useEffect(() => {
    // Set default template when language changes
    setCode(languageTemplates[language] || '');
  }, [language]);

  useEffect(() => {
    // Cleanup polling on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await submissionAPI.submitCode({
        contestId: parseInt(contestId),
        problemId: problem.id,
        username: username,
        code: code,
        language: language
      });

      const submissionId = response.data.submissionId;
      
      // Start polling for submission status
      startPolling(submissionId);
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit code. Please try again.');
      setSubmitting(false);
    }
  };

  const startPolling = (submissionId) => {
    // Clear any existing polling
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    // Poll every 2 seconds
    const interval = setInterval(async () => {
      try {
        const response = await submissionAPI.getSubmission(submissionId);
        const submissionData = response.data;
        
        setSubmission(submissionData);
        
        // Stop polling if submission is completed
        if (!['PENDING', 'RUNNING'].includes(submissionData.status)) {
          clearInterval(interval);
          setPollingInterval(null);
          setSubmitting(false);
        }
      } catch (error) {
        console.error('Polling error:', error);
        clearInterval(interval);
        setPollingInterval(null);
        setSubmitting(false);
      }
    }, 2000);

    setPollingInterval(interval);
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'PENDING': return 'Submission queued...';
      case 'RUNNING': return 'Running tests...';
      case 'ACCEPTED': return 'All tests passed!';
      case 'WRONG_ANSWER': return 'Wrong answer on test case';
      case 'TIME_LIMIT_EXCEEDED': return 'Time limit exceeded';
      case 'MEMORY_LIMIT_EXCEEDED': return 'Memory limit exceeded';
      case 'RUNTIME_ERROR': return 'Runtime error occurred';
      case 'COMPILATION_ERROR': return 'Code failed to compile';
      default: return 'Unknown status';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Code className="w-6 h-6 mr-2 text-blue-600" />
            Code Editor
          </h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none pr-10"
              >
                <option value="java">☕ Java</option>
                <option value="python">🐍 Python</option>
                <option value="cpp">⚡ C++</option>
                <option value="c">🔧 C</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center space-x-2 shadow-lg"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="h-96 relative">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            fontFamily: 'JetBrains Mono, Fira Code, Monaco, monospace',
            lineHeight: 1.6,
            padding: { top: 16, bottom: 16 }
          }}
        />
      </div>

      {/* Submission Status */}
      {submission && (
        <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className={`p-4 rounded-xl border-2 ${statusColors[submission.status]} shadow-lg animate-fade-in`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-white shadow-sm">
                  {statusIcons[submission.status]}
                </div>
                <span className="font-semibold text-lg">{getStatusMessage(submission.status)}</span>
              </div>
              
              {submission.score !== undefined && (
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm">
                  <span className="text-sm font-bold text-gray-600">Score: </span>
                  <span className="text-lg font-bold text-blue-600">{submission.score}</span>
                  <span className="text-sm font-bold text-gray-600">/{problem.points}</span>
                </div>
              )}
            </div>

            {/* Execution Details */}
            {(submission.executionTimeMs || submission.memoryUsedMb) && (
              <div className="flex items-center space-x-6 text-sm bg-white/50 p-3 rounded-lg">
                {submission.executionTimeMs && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Time: {submission.executionTimeMs}ms</span>
                  </div>
                )}
                {submission.memoryUsedMb && (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">Memory: {submission.memoryUsedMb}MB</span>
                  </div>
                )}
              </div>
            )}

            {/* Detailed Result */}
            {submission.result && (
              <div className="mt-2 text-sm">
                <pre className="whitespace-pre-wrap">{submission.result}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeEditor;
