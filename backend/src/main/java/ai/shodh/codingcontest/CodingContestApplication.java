package ai.shodh.codingcontest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CodingContestApplication {
    public static void main(String[] args) {
        SpringApplication.run(CodingContestApplication.class, args);
    }
}
