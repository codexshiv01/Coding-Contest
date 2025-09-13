package ai.shodh.codingcontest.controller;

import ai.shodh.codingcontest.dto.ContestResponseDto;
import ai.shodh.codingcontest.dto.LeaderboardEntryDto;
import ai.shodh.codingcontest.service.ContestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ContestController {
    
    private final ContestService contestService;
    
    @GetMapping("/{contestId}")
    public ResponseEntity<ContestResponseDto> getContest(@PathVariable Long contestId) {
        log.info("Getting contest with id: {}", contestId);
        ContestResponseDto contest = contestService.getContestById(contestId);
        return ResponseEntity.ok(contest);
    }
    
    @GetMapping("/{contestId}/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard(@PathVariable Long contestId) {
        log.info("Getting leaderboard for contest: {}", contestId);
        List<LeaderboardEntryDto> leaderboard = contestService.getLeaderboard(contestId);
        return ResponseEntity.ok(leaderboard);
    }
    
    @GetMapping
    public ResponseEntity<List<ContestResponseDto>> getActiveContests() {
        log.info("Getting active contests");
        List<ContestResponseDto> contests = contestService.getActiveContests();
        return ResponseEntity.ok(contests);
    }
}
