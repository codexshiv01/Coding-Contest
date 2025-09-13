package ai.shodh.codingcontest.service;

import ai.shodh.codingcontest.model.Submission;
import ai.shodh.codingcontest.model.TestCase;

import java.util.List;

/**
 * Interface for code execution service following Single Responsibility Principle
 */
public interface CodeExecutionService {
    /**
     * Execute code against test cases
     * @param submission The submission to execute
     * @param testCases List of test cases to run against
     * @return ExecutionResult containing status and details
     */
    ExecutionResult executeCode(Submission submission, List<TestCase> testCases);
    
    /**
     * Result of code execution
     */
    record ExecutionResult(
        Submission.SubmissionStatus status,
        String result,
        Integer executionTimeMs,
        Integer memoryUsedMb,
        Integer score
    ) {}
}
