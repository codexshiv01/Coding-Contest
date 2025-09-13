package ai.shodh.codingcontest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDto {
    private String username;
    private Integer totalScore;
    private Integer solvedProblems;
    private LocalDateTime lastSubmission;
    private Integer rank;
}
