package ai.shodh.codingcontest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemResponseDto {
    private Long id;
    private String title;
    private String description;
    private Integer points;
    private Integer timeLimitSeconds;
    private Integer memoryLimitMb;
    private List<TestCaseResponseDto> sampleTestCases;
}
