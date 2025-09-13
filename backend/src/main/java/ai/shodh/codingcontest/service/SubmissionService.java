package ai.shodh.codingcontest.service;

import ai.shodh.codingcontest.dto.SubmissionRequestDto;
import ai.shodh.codingcontest.dto.SubmissionResponseDto;
import ai.shodh.codingcontest.model.*;
import ai.shodh.codingcontest.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionService {
    
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ContestRepository contestRepository;
    private final ProblemRepository problemRepository;
    private final CodeExecutionService codeExecutionService;
    
    @Transactional
    public SubmissionResponseDto submitCode(SubmissionRequestDto request) {
        log.info("Processing submission for user: {}, problem: {}", 
                request.getUsername(), request.getProblemId());
        
        // Get or create user
        User user = userRepository.findByUsername(request.getUsername())
            .orElseGet(() -> {
                User newUser = User.builder()
                    .username(request.getUsername())
                    .build();
                return userRepository.save(newUser);
            });
        
        // Validate contest and problem
        Contest contest = contestRepository.findById(request.getContestId())
            .orElseThrow(() -> new RuntimeException("Contest not found"));
        
        if (!contest.isActive()) {
            throw new RuntimeException("Contest is not active");
        }
        
        Problem problem = problemRepository.findById(request.getProblemId())
            .orElseThrow(() -> new RuntimeException("Problem not found"));
        
        // Create submission
        Submission submission = Submission.builder()
            .code(request.getCode())
            .language(request.getLanguage())
            .status(Submission.SubmissionStatus.PENDING)
            .user(user)
            .problem(problem)
            .contest(contest)
            .build();
        
        submission = submissionRepository.save(submission);
        
        // Process submission asynchronously
        processSubmissionAsync(submission);
        
        return mapToResponseDto(submission);
    }
    
    @Transactional(readOnly = true)
    public SubmissionResponseDto getSubmissionById(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
        
        return mapToResponseDto(submission);
    }
    
    @Async
    @Transactional
    public CompletableFuture<Void> processSubmissionAsync(Submission submission) {
        log.info("Processing submission {} asynchronously", submission.getId());
        
        try {
            // Update status to running
            submission.setStatus(Submission.SubmissionStatus.RUNNING);
            submissionRepository.save(submission);
            
            // Get test cases
            List<TestCase> testCases = submission.getProblem().getTestCases();
            
            // Execute code
            CodeExecutionService.ExecutionResult result = 
                codeExecutionService.executeCode(submission, testCases);
            
            // Update submission with results
            submission.setStatus(result.status());
            submission.setResult(result.result());
            submission.setExecutionTimeMs(result.executionTimeMs());
            submission.setMemoryUsedMb(result.memoryUsedMb());
            submission.setScore(result.score());
            
            submissionRepository.save(submission);
            
            log.info("Submission {} processed with status: {}", 
                    submission.getId(), result.status());
            
        } catch (Exception e) {
            log.error("Error processing submission {}: {}", submission.getId(), e.getMessage());
            
            submission.setStatus(Submission.SubmissionStatus.RUNTIME_ERROR);
            submission.setResult("System error: " + e.getMessage());
            submissionRepository.save(submission);
        }
        
        return CompletableFuture.completedFuture(null);
    }
    
    private SubmissionResponseDto mapToResponseDto(Submission submission) {
        return SubmissionResponseDto.builder()
            .id(submission.getId())
            .username(submission.getUser().getUsername())
            .problemId(submission.getProblem().getId())
            .language(submission.getLanguage())
            .status(submission.getStatus())
            .result(submission.getResult())
            .executionTimeMs(submission.getExecutionTimeMs())
            .memoryUsedMb(submission.getMemoryUsedMb())
            .score(submission.getScore())
            .submittedAt(submission.getSubmittedAt())
            .build();
    }
}
