package ai.shodh.codingcontest.service;

import ai.shodh.codingcontest.dto.ProblemResponseDto;
import ai.shodh.codingcontest.dto.TestCaseResponseDto;
import ai.shodh.codingcontest.model.Problem;
import ai.shodh.codingcontest.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProblemService {
    
    private final ProblemRepository problemRepository;
    
    public List<ProblemResponseDto> getProblemsByContestId(Long contestId) {
        return problemRepository.findByContestIdOrderByIdAsc(contestId)
            .stream()
            .map(this::mapToResponseDto)
            .toList();
    }
    
    public ProblemResponseDto getProblemById(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
            .orElseThrow(() -> new RuntimeException("Problem not found with id: " + problemId));
        
        return mapToResponseDto(problem);
    }
    
    private ProblemResponseDto mapToResponseDto(Problem problem) {
        List<TestCaseResponseDto> sampleTestCases = problem.getTestCases()
            .stream()
            .filter(tc -> tc.getIsSample())
            .map(tc -> TestCaseResponseDto.builder()
                .input(tc.getInput())
                .expectedOutput(tc.getExpectedOutput())
                .build())
            .toList();
        
        return ProblemResponseDto.builder()
            .id(problem.getId())
            .title(problem.getTitle())
            .description(problem.getDescription())
            .points(problem.getPoints())
            .timeLimitSeconds(problem.getTimeLimitSeconds())
            .memoryLimitMb(problem.getMemoryLimitMb())
            .sampleTestCases(sampleTestCases)
            .build();
    }
}
