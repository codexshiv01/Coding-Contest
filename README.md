# Shodh AI Coding Contest Platform

A real-time coding contest platform built with Spring Boot, React, and Docker. This application allows students to participate in live coding competitions, solve programming problems, and compete on a real-time leaderboard.

## 🏗️ Architecture Overview

The platform follows a microservices architecture with clear separation of concerns:

- **Backend**: Spring Boot REST API with PostgreSQL database
- **Frontend**: React with Vite and Tailwind CSS
- **Code Execution**: Secure Docker-based sandboxed environment
- **Real-time Updates**: Polling-based live leaderboard and submission status
- **Database**: PostgreSQL (Neon Cloud) with Redis for caching

## 🚀 Features

- **Contest Management**: Join contests by ID or browse active contests
- **Problem Solving**: Multiple programming languages (Java, Python, C++, C)
- **Real-time Code Execution**: Secure Docker-based code evaluation
- **Live Leaderboard**: Real-time ranking updates every 30 seconds
- **Submission Tracking**: Asynchronous submission processing with live status updates
- **Modern UI**: Responsive design with Monaco code editor

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL (Neon Cloud)
- **Caching**: Redis
- **Code Execution**: Docker containers with resource limits
- **Build Tool**: Maven
- **Java Version**: 17

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **HTTP Client**: Axios
- **Routing**: React Router DOM

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: Managed PostgreSQL (Neon)
- **Reverse Proxy**: Built-in CORS configuration

## 📋 Prerequisites

Before running the application, ensure you have:

- **Docker** and **Docker Compose** installed
- **Java 17** or higher
- **Node.js 18** or higher
- **Git** for cloning the repository

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/codexshiv01/Coding-Contest.git
   cd shodh-ai-coding-contest
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - Redis: localhost:6379

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Redis Setup
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

## 📖 Usage Guide

### 1. Joining a Contest

1. Navigate to http://localhost:5173
2. Enter your username
3. Either:
   - Enter a specific Contest ID (e.g., `1` for the sample contest)
   - Click "Join" on an active contest from the list

### 2. Solving Problems

1. Select a problem from the left panel
2. Read the problem description and constraints
3. Choose your programming language
4. Write your solution in the code editor
5. Click "Submit" to execute your code

### 3. Tracking Progress

- **Submission Status**: Watch real-time updates (Pending → Running → Accepted/Wrong Answer)
- **Leaderboard**: Switch to the "Leaderboard" tab to see your ranking
- **Scoring**: Points are awarded based on problem difficulty and correctness

## 🔧 API Documentation

### Contest Endpoints

#### GET /api/contests/{contestId}
Fetches contest details including problems and metadata.

**Response:**
```json
{
  "id": 1,
  "name": "Shodh AI Coding Challenge",
  "description": "A beginner-friendly coding contest",
  "startTime": "2024-01-15T10:00:00",
  "endTime": "2024-01-15T14:00:00",
  "active": true,
  "problems": [...]
}
```

#### GET /api/contests/{contestId}/leaderboard
Returns the live leaderboard for a contest.

**Response:**
```json
[
  {
    "rank": 1,
    "username": "john_doe",
    "totalScore": 450,
    "solvedProblems": 3,
    "lastSubmission": "2024-01-15T12:30:00"
  }
]
```

### Submission Endpoints

#### POST /api/submissions
Submits code for evaluation.

**Request:**
```json
{
  "contestId": 1,
  "problemId": 2,
  "username": "john_doe",
  "code": "public class Solution { ... }",
  "language": "java"
}
```

**Response:**
```json
{
  "submissionId": 123
}
```

#### GET /api/submissions/{submissionId}
Fetches submission status and results.

**Response:**
```json
{
  "id": 123,
  "username": "john_doe",
  "problemId": 2,
  "language": "java",
  "status": "ACCEPTED",
  "result": "All tests passed!",
  "executionTimeMs": 150,
  "memoryUsedMb": 64,
  "score": 150,
  "submittedAt": "2024-01-15T12:15:00"
}
```

## 🏗️ Design Choices & Architecture Decisions

### 1. Service Layer Architecture

**Decision**: Implemented a clean layered architecture with clear separation between Controllers, Services, and Repositories following Domain-Driven Design (DDD) principles.

**Detailed Architecture**:
```
┌─────────────────┐
│   Controllers   │ ← REST API Layer (HTTP handling, validation)
├─────────────────┤
│    Services     │ ← Business Logic Layer (domain operations)
├─────────────────┤
│  Repositories   │ ← Data Access Layer (JPA/database operations)
├─────────────────┤
│    Entities     │ ← Domain Models (JPA entities)
└─────────────────┘
```

**Implementation Details**:
- **Controllers** (`@RestController`): Handle HTTP requests, input validation, and response formatting
- **Services** (`@Service`): Contain business logic, orchestrate repository calls, handle transactions
- **Repositories** (`@Repository`): Provide data access abstraction using Spring Data JPA
- **DTOs**: Separate data transfer objects for API communication vs internal domain models

**Benefits**:
- **Single Responsibility**: Each layer has a distinct, focused purpose
- **Dependency Inversion**: Higher layers depend on abstractions, not concrete implementations
- **Testability**: Easy to unit test each layer in isolation with mocks
- **Maintainability**: Changes in one layer don't cascade to others
- **Scalability**: Can easily add caching, security, or monitoring at specific layers

### 2. Asynchronous Submission Processing

**Decision**: Implemented non-blocking submission processing using Spring's `@Async` annotation with custom thread pool configuration.

**Implementation Strategy**:
```java
@Async("taskExecutor")
public CompletableFuture<Void> processSubmissionAsync(Long submissionId) {
    // Code execution happens on separate thread
    // Updates submission status in database
    return CompletableFuture.completedFuture(null);
}
```

**Configuration**:
- **Thread Pool**: Custom `ThreadPoolTaskExecutor` with configurable core/max threads
- **Queue Capacity**: Bounded queue to prevent memory issues under high load
- **Rejection Policy**: `CallerRunsPolicy` for graceful degradation

**User Experience Flow**:
1. User submits code → Immediate HTTP 200 response with submission ID
2. Frontend polls `/api/submissions/{id}` every 2 seconds for status
3. Backend processes asynchronously and updates database
4. Frontend receives updated status and displays results

**Benefits**:
- **Responsiveness**: UI never freezes during code execution
- **Scalability**: Can handle multiple concurrent submissions
- **Resource Efficiency**: Thread pool prevents resource exhaustion
- **Fault Tolerance**: Failed submissions don't block others

### 3. Code Execution Architecture

**Decision**: Evolved from Docker-based execution to Mock service for development simplicity, with clear abstraction for production deployment.

**Interface Design**:
```java
public interface CodeExecutionService {
    CompletableFuture<ExecutionResult> executeCode(String code, String language, 
                                                 List<TestCase> testCases);
}
```

**Implementation Options**:

#### Mock Service (Current - Development)
```java
@Service("mockCodeExecutionService")
public class MockCodeExecutionService implements CodeExecutionService {
    // Simulates execution with random results for testing
}
```

#### Docker Service (Production-Ready)
```java
@Service("dockerCodeExecutionService") 
public class DockerCodeExecutionService implements CodeExecutionService {
    // Real Docker container execution with security
}
```

**Security Considerations** (for Production Docker implementation):
- **Container Isolation**: Each execution runs in separate container
- **Resource Limits**: CPU (0.5 cores), Memory (128MB), Time (10s)
- **Network Isolation**: No internet access during execution
- **File System**: Read-only with temporary writable directory
- **User Permissions**: Non-root user execution

**Language Support Strategy**:
- **Java**: `openjdk:11-alpine` with compilation and execution
- **Python**: `python:3.9-alpine` with direct execution
- **C++**: `gcc:9-alpine` with compilation step
- **Extensible**: Easy to add new language containers

### 4. Frontend Architecture & State Management

**Decision**: React functional components with hooks-based state management, avoiding Redux for simplicity while maintaining clean component hierarchy.

**Component Architecture**:
```
App
├── JoinContest (Homepage with slideshow)
├── ContestPage
│   ├── ProblemView
│   ├── CodeEditor (Monaco integration)
│   └── Leaderboard
└── Shared Components (Loading, Error states)
```

**State Management Strategy**:
- **Local State**: `useState` for component-specific data
- **Effect Management**: `useEffect` for API calls and cleanup
- **Prop Drilling**: Minimal, controlled data flow between components
- **Context**: Avoided for this scope, keeping state localized

**API Integration Pattern**:
```javascript
// Custom hook pattern for API calls
const useSubmissionStatus = (submissionId) => {
  const [status, setStatus] = useState('PENDING');
  const [polling, setPolling] = useState(false);
  
  useEffect(() => {
    if (!submissionId) return;
    
    const pollStatus = async () => {
      // Polling logic with cleanup
    };
    
    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, [submissionId]);
  
  return { status, polling };
};
```

**Benefits**:
- **Simplicity**: No Redux boilerplate for this application scope
- **Performance**: Direct state updates without middleware overhead
- **Developer Experience**: Easier debugging with React DevTools
- **Bundle Size**: Smaller build size without state management libraries

### 5. Real-time Updates Implementation

**Decision**: HTTP polling over WebSockets for live leaderboard and submission status updates.

**Polling Strategy**:
- **Submission Status**: Poll every 2 seconds while `PENDING`
- **Leaderboard**: Poll every 30 seconds during active contest
- **Smart Polling**: Stop polling when component unmounts or contest ends
- **Error Handling**: Exponential backoff on API failures

**Implementation Details**:
```javascript
// Smart polling with cleanup
useEffect(() => {
  if (status === 'PENDING') {
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }
}, [status, submissionId]);
```

**Comparison with WebSockets**:

| Aspect | HTTP Polling | WebSockets |
|--------|-------------|------------|
| **Complexity** | Low | High |
| **Infrastructure** | Standard HTTP | Requires WS support |
| **Reliability** | High (HTTP retry logic) | Medium (connection drops) |
| **Latency** | 2-30s delay | Real-time |
| **Scalability** | Good for this scope | Better for high-frequency updates |
| **Debugging** | Easy (standard HTTP tools) | Complex (specialized tools) |

**Trade-offs Accepted**:
- **Network Usage**: ~50% more requests vs persistent connection
- **Latency**: Acceptable 2-30 second delays for contest updates
- **Server Load**: Manageable with caching and efficient queries

### 6. Database Design & Data Modeling

**Decision**: JPA entities with carefully designed relationships, optimized for contest workflow and query patterns.

**Entity Relationship Design**:
```
Contest (1) ←→ (N) Problem ←→ (N) TestCase
Contest (1) ←→ (N) Submission ←→ (1) User
Problem (1) ←→ (N) Submission
```

**Key Design Decisions**:

#### Contest Entity
```java
@Entity
public class Contest {
    @Id @GeneratedValue
    private Long id;
    
    @OneToMany(mappedBy = "contest", cascade = CascadeType.ALL)
    private List<Problem> problems;
    
    // Optimized for leaderboard queries
    @Column(name = "start_time")
    private LocalDateTime startTime;
    
    @Column(name = "end_time") 
    private LocalDateTime endTime;
}
```

#### Submission Entity (Optimized for Status Tracking)
```java
@Entity
@Table(indexes = {
    @Index(name = "idx_submission_user_contest", columnList = "username,contest_id"),
    @Index(name = "idx_submission_status", columnList = "status"),
    @Index(name = "idx_submission_created", columnList = "submitted_at")
})
public class Submission {
    @Enumerated(EnumType.STRING)
    private SubmissionStatus status; // PENDING, ACCEPTED, WRONG_ANSWER, etc.
    
    @Builder.Default
    private Integer score = 0; // Prevents null pointer issues
}
```

**Indexing Strategy**:
- **Leaderboard Query**: Index on `(username, contest_id)` for fast user rankings
- **Status Updates**: Index on `status` for pending submission queries  
- **Time-based Queries**: Index on `submitted_at` for chronological ordering
- **Foreign Keys**: Automatic indexes on all relationship columns

**Query Optimization Examples**:
```sql
-- Leaderboard query (optimized with indexes)
SELECT username, SUM(score) as total_score 
FROM submissions 
WHERE contest_id = ? AND status = 'ACCEPTED'
GROUP BY username 
ORDER BY total_score DESC;

-- Pending submissions (for async processing)
SELECT * FROM submissions 
WHERE status = 'PENDING' 
ORDER BY submitted_at ASC;
```

### 7. API Design Philosophy

**Decision**: RESTful API design with consistent patterns, comprehensive error handling, and clear resource modeling.

**Resource Modeling**:
```
GET    /api/contests/{id}              → Contest details
GET    /api/contests/{id}/leaderboard  → Contest rankings
POST   /api/submissions                → Submit code
GET    /api/submissions/{id}           → Submission status
```

**Response Standardization**:
```java
// Success Response
{
  "data": { /* actual resource */ },
  "timestamp": "2024-01-15T12:00:00Z"
}

// Error Response  
{
  "error": {
    "code": "CONTEST_NOT_FOUND",
    "message": "Contest with ID 999 not found",
    "details": { "contestId": 999 }
  },
  "timestamp": "2024-01-15T12:00:00Z"
}
```

**Error Handling Strategy**:
- **Global Exception Handler**: `@ControllerAdvice` for consistent error responses
- **Validation**: Bean Validation annotations with custom error messages
- **HTTP Status Codes**: Proper use of 200, 400, 404, 500 status codes
- **Client-Friendly**: Error messages suitable for user display

### 8. UI/UX Architecture Decisions

**Decision**: Modern, responsive design with glass-morphism effects and smooth animations, prioritizing user experience over complex interactions.

**Design System Approach**:
- **Tailwind CSS**: Utility-first CSS for rapid UI development
- **Component Consistency**: Reusable patterns across all pages
- **Responsive First**: Mobile-first design with desktop enhancements
- **Accessibility**: Proper ARIA labels, keyboard navigation, color contrast

**Animation Strategy**:
```css
/* Custom animations for enhanced UX */
@keyframes fade-in { /* Smooth content loading */ }
@keyframes slide-up { /* Form interactions */ }
@keyframes float { /* Subtle icon movements */ }
@keyframes pulse-glow { /* Call-to-action emphasis */ }
```

**Key UX Decisions**:
- **Full-page Slideshow**: Immersive homepage experience showcasing features
- **Progressive Disclosure**: Information revealed as needed (problem details, submission results)
- **Immediate Feedback**: Loading states, success/error messages, progress indicators
- **Visual Hierarchy**: Clear typography scale, consistent spacing, strategic use of color

**Performance Considerations**:
- **Code Splitting**: Lazy loading of Monaco Editor (large dependency)
- **Image Optimization**: Responsive images with proper sizing
- **Animation Performance**: CSS transforms over property changes
- **Bundle Size**: Tree-shaking unused Tailwind classes

### 9. Development & Deployment Strategy

**Decision**: Simplified development setup with production-ready architecture, enabling easy local development while supporting scalable deployment.

**Environment Strategy**:
```yaml
# Development (H2 in-memory)
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    
# Production (PostgreSQL/Neon)  
spring:
  datasource:
    url: jdbc:postgresql://neon-db-url/contest_db
```

**Configuration Management**:
- **Profile-based**: `application.yml`, `application-docker.yml`
- **Environment Variables**: Database URLs, API keys externalized
- **Sensible Defaults**: Works out-of-the-box for development

**Build & Deployment**:
- **Maven Wrapper**: `./mvnw` ensures consistent build environment
- **Docker Support**: Multi-stage builds for optimized images
- **Frontend Build**: Vite for fast development and optimized production builds

**Benefits of This Approach**:
- **Developer Onboarding**: Clone, run, and start coding in minutes
- **Production Ready**: Clear path from development to production deployment
- **Flexible Infrastructure**: Can deploy to cloud providers, on-premise, or containers
- **Maintainable**: Clear separation of concerns enables easy updates and feature additions

## 🔒 Security Considerations

1. **Code Execution**: Docker containers with resource limits and network isolation
2. **Input Validation**: Bean validation on all API endpoints
3. **CORS**: Configured for specific origins only
4. **Resource Limits**: Memory and CPU constraints on code execution
5. **Container Cleanup**: Automatic removal of execution containers

## 🧪 Testing Strategy

### Backend Testing
```bash
cd backend
./mvnw test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Performance Optimizations

1. **Database Indexing**: Optimized queries for leaderboard and submissions
2. **Redis Caching**: Cached frequently accessed data
3. **Async Processing**: Non-blocking submission handling
4. **Connection Pooling**: Optimized database connections
5. **Docker Image Optimization**: Multi-stage builds for smaller images

## 🚧 Known Limitations & Future Improvements

### Current Limitations
1. **Code Execution**: Simplified Docker execution (marked with `### CHANGE THIS ###`)
2. **Language Support**: Limited to basic runtimes
3. **File I/O**: No support for file-based input/output
4. **Plagiarism Detection**: Not implemented

### Future Enhancements
1. **WebSocket Integration**: Real-time updates without polling
2. **Advanced Code Execution**: Better compilation and execution handling
3. **Analytics Dashboard**: Contest statistics and insights
4. **Mobile App**: React Native mobile application
5. **AI-Powered Hints**: Intelligent problem-solving assistance

## 🐛 Troubleshooting

### Common Issues

1. **Docker Permission Issues**
   ```bash
   sudo usermod -aG docker $USER
   # Logout and login again
   ```

2. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :8080
   # Kill the process or change port in docker-compose.yml
   ```

3. **Database Connection Issues**
   - Verify the Neon database URL is correct
   - Check network connectivity
   - Ensure SSL is properly configured

4. **Frontend Build Issues**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📝 Development Setup

### Adding New Problems

1. Use the `DataInitializationService` to add problems programmatically
2. Include test cases with expected input/output
3. Set appropriate time and memory limits

### Adding New Languages

1. Update `DockerCodeExecutionService.getExecuteCommand()`
2. Add language template in `CodeEditor.jsx`
3. Update Docker image with required runtime

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful frontend library
- Docker for containerization technology
- Neon for managed PostgreSQL hosting

---

**Built with ❤️ for Shodh AI by the Engineering Team**
