package ai.shodh.codingcontest.controller;

import ai.shodh.codingcontest.dto.SubmissionRequestDto;
import ai.shodh.codingcontest.dto.SubmissionResponseDto;
import ai.shodh.codingcontest.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SubmissionController {
    
    private final SubmissionService submissionService;
    
    @PostMapping
    public ResponseEntity<Map<String, Long>> submitCode(@Valid @RequestBody SubmissionRequestDto request) {
        log.info("Received submission from user: {} for problem: {}", 
                request.getUsername(), request.getProblemId());
        
        SubmissionResponseDto submission = submissionService.submitCode(request);
        
        return ResponseEntity.ok(Map.of("submissionId", submission.getId()));
    }
    
    @GetMapping("/{submissionId}")
    public ResponseEntity<SubmissionResponseDto> getSubmission(@PathVariable Long submissionId) {
        log.info("Getting submission with id: {}", submissionId);
        SubmissionResponseDto submission = submissionService.getSubmissionById(submissionId);
        return ResponseEntity.ok(submission);
    }
}
