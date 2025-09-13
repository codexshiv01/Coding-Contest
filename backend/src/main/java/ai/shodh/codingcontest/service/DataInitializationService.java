package ai.shodh.codingcontest.service;

import ai.shodh.codingcontest.model.*;
import ai.shodh.codingcontest.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService implements ApplicationRunner {
    
    private final ContestRepository contestRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    
    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (contestRepository.count() == 0) {
            log.info("Initializing sample data...");
            initializeSampleData();
            log.info("Sample data initialized successfully");
        }
    }
    
    private void initializeSampleData() {
        // Create sample contest
        Contest contest = Contest.builder()
            .name("Shodh AI Coding Challenge")
            .description("A beginner-friendly coding contest to test your programming skills")
            .startTime(LocalDateTime.now().minusHours(1))
            .endTime(LocalDateTime.now().plusHours(23))
            .build();
        
        contest = contestRepository.save(contest);
        
        // Create Problem 1: Two Sum
        Problem problem1 = Problem.builder()
            .title("Two Sum")
            .description("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\n" +
                        "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n" +
                        "Example:\n" +
                        "Input: nums = [2,7,11,15], target = 9\n" +
                        "Output: [0,1]\n" +
                        "Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].")
            .points(100)
            .timeLimitSeconds(5)
            .memoryLimitMb(128)
            .contest(contest)
            .build();
        
        problem1 = problemRepository.save(problem1);
        
        // Test cases for Problem 1
        TestCase tc1_1 = TestCase.builder()
            .input("4\n2 7 11 15\n9")
            .expectedOutput("0 1")
            .isSample(true)
            .problem(problem1)
            .build();
        
        TestCase tc1_2 = TestCase.builder()
            .input("3\n3 2 4\n6")
            .expectedOutput("1 2")
            .isSample(false)
            .problem(problem1)
            .build();
        
        testCaseRepository.saveAll(List.of(tc1_1, tc1_2));
        
        // Create Problem 2: Palindrome Check
        Problem problem2 = Problem.builder()
            .title("Palindrome Check")
            .description("Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.\n\n" +
                        "Example:\n" +
                        "Input: s = \"A man, a plan, a canal: Panama\"\n" +
                        "Output: true\n" +
                        "Explanation: \"amanaplanacanalpanama\" is a palindrome.")
            .points(150)
            .timeLimitSeconds(3)
            .memoryLimitMb(64)
            .contest(contest)
            .build();
        
        problem2 = problemRepository.save(problem2);
        
        // Test cases for Problem 2
        TestCase tc2_1 = TestCase.builder()
            .input("A man, a plan, a canal: Panama")
            .expectedOutput("true")
            .isSample(true)
            .problem(problem2)
            .build();
        
        TestCase tc2_2 = TestCase.builder()
            .input("race a car")
            .expectedOutput("false")
            .isSample(false)
            .problem(problem2)
            .build();
        
        testCaseRepository.saveAll(List.of(tc2_1, tc2_2));
        
        // Create Problem 3: Fibonacci
        Problem problem3 = Problem.builder()
            .title("Fibonacci Number")
            .description("The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, " +
                        "such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\n" +
                        "Given n, calculate F(n).\n\n" +
                        "Example:\n" +
                        "Input: n = 4\n" +
                        "Output: 3\n" +
                        "Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.")
            .points(200)
            .timeLimitSeconds(2)
            .memoryLimitMb(32)
            .contest(contest)
            .build();
        
        problem3 = problemRepository.save(problem3);
        
        // Test cases for Problem 3
        TestCase tc3_1 = TestCase.builder()
            .input("4")
            .expectedOutput("3")
            .isSample(true)
            .problem(problem3)
            .build();
        
        TestCase tc3_2 = TestCase.builder()
            .input("10")
            .expectedOutput("55")
            .isSample(false)
            .problem(problem3)
            .build();
        
        testCaseRepository.saveAll(List.of(tc3_1, tc3_2));
    }
}
