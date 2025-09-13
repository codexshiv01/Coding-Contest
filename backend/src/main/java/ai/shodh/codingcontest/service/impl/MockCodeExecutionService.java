package ai.shodh.codingcontest.service.impl;

import ai.shodh.codingcontest.model.Submission;
import ai.shodh.codingcontest.model.TestCase;
import ai.shodh.codingcontest.service.CodeExecutionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

/**
 * Mock implementation of CodeExecutionService for demonstration purposes
 * This simulates code execution without requiring Docker
 */
@Service
@Slf4j
public class MockCodeExecutionService implements CodeExecutionService {
    
    private final Random random = new Random();
    
    @Override
    public ExecutionResult executeCode(Submission submission, List<TestCase> testCases) {
        log.info("Mock executing code for submission {}", submission.getId());
        
        try {
            // Simulate execution time
            Thread.sleep(1000 + random.nextInt(2000)); // 1-3 seconds
            
            // Simulate different outcomes based on problem and code quality
            Submission.SubmissionStatus status = simulateExecution(submission, testCases);
            
            String result = generateResult(status, testCases.size());
            int score = calculateScore(status, submission.getProblem().getPoints(), testCases.size());
            
            return new ExecutionResult(
                status,
                result,
                100 + random.nextInt(400), // Random execution time 100-500ms
                32 + random.nextInt(96),   // Random memory usage 32-128MB
                score
            );
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return new ExecutionResult(
                Submission.SubmissionStatus.RUNTIME_ERROR,
                "Execution interrupted",
                0,
                0,
                0
            );
        }
    }
    
    private Submission.SubmissionStatus simulateExecution(Submission submission, List<TestCase> testCases) {
        // Simulate different success rates based on problem difficulty and language
        double successProbability = getSuccessProbability(submission);
        
        if (random.nextDouble() < successProbability) {
            return Submission.SubmissionStatus.ACCEPTED;
        } else {
            // Randomly choose between different failure types
            double rand = random.nextDouble();
            if (rand < 0.6) {
                return Submission.SubmissionStatus.WRONG_ANSWER;
            } else if (rand < 0.8) {
                return Submission.SubmissionStatus.TIME_LIMIT_EXCEEDED;
            } else if (rand < 0.9) {
                return Submission.SubmissionStatus.RUNTIME_ERROR;
            } else {
                return Submission.SubmissionStatus.COMPILATION_ERROR;
            }
        }
    }
    
    private double getSuccessProbability(Submission submission) {
        // Base probability
        double probability = 0.7;
        
        // Adjust based on problem points (higher points = harder problem)
        int points = submission.getProblem().getPoints();
        if (points <= 100) {
            probability = 0.8; // Easy problems
        } else if (points <= 150) {
            probability = 0.7; // Medium problems
        } else {
            probability = 0.6; // Hard problems
        }
        
        // Language-based adjustment (just for simulation)
        String language = submission.getLanguage().toLowerCase();
        switch (language) {
            case "java" -> probability += 0.1;
            case "python" -> probability += 0.05;
            case "cpp", "c++" -> probability -= 0.05;
            case "c" -> probability -= 0.1;
        }
        
        return Math.max(0.1, Math.min(0.95, probability));
    }
    
    private String generateResult(Submission.SubmissionStatus status, int totalTestCases) {
        return switch (status) {
            case ACCEPTED -> String.format("All %d test cases passed successfully!", totalTestCases);
            case WRONG_ANSWER -> {
                int passedTests = random.nextInt(totalTestCases);
                yield String.format("Failed on test case %d. %d/%d test cases passed.", 
                                  passedTests + 1, passedTests, totalTestCases);
            }
            case TIME_LIMIT_EXCEEDED -> "Solution exceeded the time limit. Consider optimizing your algorithm.";
            case MEMORY_LIMIT_EXCEEDED -> "Solution exceeded the memory limit. Try to reduce memory usage.";
            case RUNTIME_ERROR -> "Runtime error occurred during execution. Check for null pointers, array bounds, etc.";
            case COMPILATION_ERROR -> "Code failed to compile. Please check syntax and imports.";
            default -> "Unknown execution result.";
        };
    }
    
    private int calculateScore(Submission.SubmissionStatus status, int maxPoints, int totalTestCases) {
        if (status == Submission.SubmissionStatus.ACCEPTED) {
            return maxPoints;
        } else if (status == Submission.SubmissionStatus.WRONG_ANSWER) {
            // Partial credit based on passed test cases
            int passedTests = random.nextInt(totalTestCases);
            return (int) ((double) passedTests / totalTestCases * maxPoints);
        } else {
            return 0;
        }
    }
}
