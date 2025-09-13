package ai.shodh.codingcontest.dto;

import ai.shodh.codingcontest.model.Submission.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponseDto {
    private Long id;
    private String username;
    private Long problemId;
    private String language;
    private SubmissionStatus status;
    private String result;
    private Integer executionTimeMs;
    private Integer memoryUsedMb;
    private Integer score;
    private LocalDateTime submittedAt;
}
