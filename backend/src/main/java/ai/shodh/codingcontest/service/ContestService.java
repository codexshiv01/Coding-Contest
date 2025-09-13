package ai.shodh.codingcontest.service;

import ai.shodh.codingcontest.dto.ContestResponseDto;
import ai.shodh.codingcontest.dto.LeaderboardEntryDto;
import ai.shodh.codingcontest.model.Contest;
import ai.shodh.codingcontest.repository.ContestRepository;
import ai.shodh.codingcontest.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ContestService {
    
    private final ContestRepository contestRepository;
    private final SubmissionRepository submissionRepository;
    private final ProblemService problemService;
    
    public ContestResponseDto getContestById(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
            .orElseThrow(() -> new RuntimeException("Contest not found with id: " + contestId));
        
        return ContestResponseDto.builder()
            .id(contest.getId())
            .name(contest.getName())
            .description(contest.getDescription())
            .startTime(contest.getStartTime())
            .endTime(contest.getEndTime())
            .active(contest.isActive())
            .problems(problemService.getProblemsByContestId(contestId))
            .build();
    }
    
    public List<LeaderboardEntryDto> getLeaderboard(Long contestId) {
        List<Object[]> results = submissionRepository.findLeaderboardByContest(contestId);
        
        return IntStream.range(0, results.size())
            .mapToObj(i -> {
                Object[] row = results.get(i);
                return LeaderboardEntryDto.builder()
                    .rank(i + 1)
                    .username((String) row[0])
                    .totalScore(((Number) row[1]).intValue())
                    .solvedProblems(((Number) row[2]).intValue())
                    .lastSubmission((LocalDateTime) row[3])
                    .build();
            })
            .toList();
    }
    
    public List<ContestResponseDto> getActiveContests() {
        return contestRepository.findActiveContests(LocalDateTime.now())
            .stream()
            .map(this::mapToResponseDto)
            .toList();
    }
    
    private ContestResponseDto mapToResponseDto(Contest contest) {
        return ContestResponseDto.builder()
            .id(contest.getId())
            .name(contest.getName())
            .description(contest.getDescription())
            .startTime(contest.getStartTime())
            .endTime(contest.getEndTime())
            .active(contest.isActive())
            .build();
    }
}
