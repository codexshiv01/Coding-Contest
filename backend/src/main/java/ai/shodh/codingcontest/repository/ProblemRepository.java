package ai.shodh.codingcontest.repository;

import ai.shodh.codingcontest.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByContestIdOrderByIdAsc(Long contestId);
}
