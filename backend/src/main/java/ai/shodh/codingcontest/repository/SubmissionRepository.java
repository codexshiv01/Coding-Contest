package ai.shodh.codingcontest.repository;

import ai.shodh.codingcontest.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByContestIdOrderBySubmittedAtDesc(Long contestId);
    
    List<Submission> findByUserIdAndContestIdOrderBySubmittedAtDesc(Long userId, Long contestId);
    
    @Query("SELECT s FROM Submission s WHERE s.contest.id = :contestId AND s.status = 'ACCEPTED' " +
           "ORDER BY s.submittedAt")
    List<Submission> findAcceptedSubmissionsByContest(@Param("contestId") Long contestId);
    
    @Query("SELECT s.user.username as username, " +
           "SUM(CASE WHEN s.status = 'ACCEPTED' THEN s.problem.points ELSE 0 END) as totalScore, " +
           "COUNT(CASE WHEN s.status = 'ACCEPTED' THEN 1 END) as solvedProblems, " +
           "MAX(s.submittedAt) as lastSubmission " +
           "FROM Submission s " +
           "WHERE s.contest.id = :contestId " +
           "GROUP BY s.user.id, s.user.username " +
           "ORDER BY totalScore DESC, lastSubmission ASC")
    List<Object[]> findLeaderboardByContest(@Param("contestId") Long contestId);
}
