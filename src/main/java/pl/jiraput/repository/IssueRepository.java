package pl.jiraput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.jiraput.model.Issue;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Integer> {

}
