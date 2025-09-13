package ai.shodh.codingcontest.service.impl;

import ai.shodh.codingcontest.model.Submission;
import ai.shodh.codingcontest.model.TestCase;
import ai.shodh.codingcontest.service.CodeExecutionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Real implementation of CodeExecutionService that actually executes code
 * and validates against test cases
 */
@Service
@Slf4j
public class RealCodeExecutionService implements CodeExecutionService {
    
    // ### CHANGE THIS #### - Adjust timeout if needed
    // private static final int DEFAULT_TIMEOUT_SECONDS = 10;
    // private static final String TEMP_DIR = System.getProperty("java.io.tmpdir");
    
    @Override
    public ExecutionResult executeCode(Submission submission, List<TestCase> testCases) {
        log.info("Executing code for submission {}", submission.getId());
        
        String language = submission.getLanguage().toLowerCase();
        String code = submission.getCode();
        
        try {
            return switch (language) {
                case "java" -> executeJavaCode(code, testCases, submission);
                case "python", "python3" -> executePythonCode(code, testCases, submission);
                default -> new ExecutionResult(
                    Submission.SubmissionStatus.COMPILATION_ERROR,
                    "Unsupported language: " + language,
                    0, 0, 0
                );
            };
        } catch (Exception e) {
            log.error("Error executing code for submission {}: {}", submission.getId(), e.getMessage());
            return new ExecutionResult(
                Submission.SubmissionStatus.RUNTIME_ERROR,
                "System error: " + e.getMessage(),
                0, 0, 0
            );
        }
    }
    
    private ExecutionResult executeJavaCode(String code, List<TestCase> testCases, Submission submission) {
        try {
            // Create temporary directory for this submission
            Path tempDir = Files.createTempDirectory("submission_" + submission.getId());
            Path javaFile = tempDir.resolve("Solution.java");
            
            // Wrap user code in a proper class structure
            String wrappedCode = wrapJavaCode(code);
            Files.write(javaFile, wrappedCode.getBytes());
            
            // Compile the Java code
            ProcessBuilder compileBuilder = new ProcessBuilder("javac", javaFile.toString());
            compileBuilder.directory(tempDir.toFile());
            Process compileProcess = compileBuilder.start();
            
            if (!compileProcess.waitFor(30, TimeUnit.SECONDS) || compileProcess.exitValue() != 0) {
                String error = readProcessError(compileProcess);
                return new ExecutionResult(
                    Submission.SubmissionStatus.COMPILATION_ERROR,
                    "Compilation failed: " + error,
                    0, 0, 0
                );
            }
            
            // Run test cases
            ExecutionResult result = runTestCases(tempDir, "java Solution", testCases, submission);
            
            // Cleanup temporary files
            cleanupTempDirectory(tempDir);
            return result;
            
        } catch (Exception e) {
            log.error("Error executing Java code: {}", e.getMessage());
            return new ExecutionResult(
                Submission.SubmissionStatus.RUNTIME_ERROR,
                "Execution error: " + e.getMessage(),
                0, 0, 0
            );
        }
    }
    
    private ExecutionResult executePythonCode(String code, List<TestCase> testCases, Submission submission) {
        try {
            // Create temporary directory for this submission
            Path tempDir = Files.createTempDirectory("submission_" + submission.getId());
            Path pythonFile = tempDir.resolve("solution.py");
            
            // ### CHANGE THIS #### - Modify Python code wrapping if needed
            Files.write(pythonFile, code.getBytes());
            
            // Run test cases
            ExecutionResult result = runTestCases(tempDir, "python solution.py", testCases, submission);
            
            // Cleanup temporary files
            cleanupTempDirectory(tempDir);
            return result;
            
        } catch (Exception e) {
            log.error("Error executing Python code: {}", e.getMessage());
            return new ExecutionResult(
                Submission.SubmissionStatus.RUNTIME_ERROR,
                "Execution error: " + e.getMessage(),
                0, 0, 0
            );
        }
    }
    
    private ExecutionResult runTestCases(Path workingDir, String command, List<TestCase> testCases, Submission submission) {
        int passedTests = 0;
        long totalExecutionTime = 0;
        
        for (int i = 0; i < testCases.size(); i++) {
            TestCase testCase = testCases.get(i);
            
            try {
                long startTime = System.currentTimeMillis();
                
                // Run the program with test input
                String[] commandArray = command.split(" ");
                log.debug("Running command: {} in directory: {}", java.util.Arrays.toString(commandArray), workingDir);
                
                ProcessBuilder runBuilder = new ProcessBuilder(commandArray);
                runBuilder.directory(workingDir.toFile());
                Process runProcess = runBuilder.start();
                
                // Provide input to the process
                try (PrintWriter writer = new PrintWriter(runProcess.getOutputStream())) {
                    writer.println(testCase.getInput());
                    writer.flush();
                }
                
                // Wait for completion with timeout
                boolean finished = runProcess.waitFor(submission.getProblem().getTimeLimitSeconds(), TimeUnit.SECONDS);
                long executionTime = System.currentTimeMillis() - startTime;
                totalExecutionTime += executionTime;
                
                if (!finished) {
                    runProcess.destroyForcibly();
                    return new ExecutionResult(
                        Submission.SubmissionStatus.TIME_LIMIT_EXCEEDED,
                        String.format("Time limit exceeded on test case %d", i + 1),
                        (int) totalExecutionTime,
                        0,
                        calculatePartialScore(passedTests, testCases.size(), submission.getProblem().getPoints())
                    );
                }
                
                if (runProcess.exitValue() != 0) {
                    String error = readProcessError(runProcess);
                    return new ExecutionResult(
                        Submission.SubmissionStatus.RUNTIME_ERROR,
                        String.format("Runtime error on test case %d: %s", i + 1, error),
                        (int) totalExecutionTime,
                        0,
                        calculatePartialScore(passedTests, testCases.size(), submission.getProblem().getPoints())
                    );
                }
                
                // Read the output
                String actualOutput = readProcessOutput(runProcess).trim();
                String expectedOutput = testCase.getExpectedOutput().trim();
                
                // Compare outputs
                if (actualOutput.equals(expectedOutput)) {
                    passedTests++;
                    log.debug("Test case {} passed for submission {}", i + 1, submission.getId());
                } else {
                    return new ExecutionResult(
                        Submission.SubmissionStatus.WRONG_ANSWER,
                        String.format("Wrong answer on test case %d.\nExpected: %s\nActual: %s\n%d/%d test cases passed.", 
                                    i + 1, expectedOutput, actualOutput, passedTests, testCases.size()),
                        (int) totalExecutionTime,
                        0,
                        calculatePartialScore(passedTests, testCases.size(), submission.getProblem().getPoints())
                    );
                }
                
            } catch (Exception e) {
                log.error("Error running test case {} for submission {}: {}", i + 1, submission.getId(), e.getMessage());
                return new ExecutionResult(
                    Submission.SubmissionStatus.RUNTIME_ERROR,
                    String.format("Error on test case %d: %s", i + 1, e.getMessage()),
                    (int) totalExecutionTime,
                    0,
                    calculatePartialScore(passedTests, testCases.size(), submission.getProblem().getPoints())
                );
            }
        }
        
        // All test cases passed
        return new ExecutionResult(
            Submission.SubmissionStatus.ACCEPTED,
            String.format("All %d test cases passed successfully!", testCases.size()),
            (int) totalExecutionTime,
            0, // ### CHANGE THIS #### - Implement memory usage tracking if needed
            submission.getProblem().getPoints()
        );
    }
    
    private String wrapJavaCode(String userCode) {
        // ### CHANGE THIS #### - Modify Java code wrapping based on your problem format
        // For now, assume user provides complete main method or we wrap it
        if (userCode.contains("public static void main")) {
            // User provided complete class, just add imports if needed
            if (!userCode.contains("import")) {
                return "import java.util.*;\nimport java.io.*;\n\n" + userCode;
            }
            return userCode;
        } else {
            // Wrap user code in main method
            return String.format("""
                import java.util.*;
                import java.io.*;
                
                public class Solution {
                    public static void main(String[] args) throws IOException {
                        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
                        
                        %s
                    }
                }
                """, userCode);
        }
    }
    
    private String readProcessOutput(Process process) throws IOException {
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }
        return output.toString();
    }
    
    private String readProcessError(Process process) throws IOException {
        StringBuilder error = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                error.append(line).append("\n");
            }
        }
        return error.toString();
    }
    
    private int calculatePartialScore(int passedTests, int totalTests, int maxPoints) {
        if (totalTests == 0) return 0;
        return (int) ((double) passedTests / totalTests * maxPoints);
    }
    
    private void cleanupTempDirectory(Path tempDir) {
        try {
            Files.walk(tempDir)
                .sorted((p1, p2) -> -p1.compareTo(p2)) // Delete files before directories
                .forEach(path -> {
                    try {
                        Files.delete(path);
                    } catch (IOException e) {
                        log.warn("Failed to delete temporary file: {}", path, e);
                    }
                });
        } catch (IOException e) {
            log.warn("Failed to cleanup temporary directory: {}", tempDir, e);
        }
    }
}
